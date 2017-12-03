'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const config = require('../config');

const {User} = require('./models');

const router = express.Router();
const createAuthToken = user => {
  console.log('create', user);
  return jwt.sign({user}, config.JWT_SECRET, {
      subject: user.username,
      expiresIn: config.JWT_EXPIRY,
      algorithm: 'HS256'
  });
  console.log('return complete');
};



// const jsonParser = bodyParser.json();

// Post to register a new user

router.post('/', (req, res) => {
  const requiredFields = ['username', 'password'];
  const missingField = requiredFields.find(field => !(field in req.body));
  console.log(req.body);


  const stringFields = ['username', 'password', 'firstName', 'lastName'];
  const nonStringField = stringFields.find(
    field => field in req.body && typeof req.body[field] !== 'string'
  );

  if (nonStringField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Incorrect field type: expected string',
      location: nonStringField
    });
  }

  // If the username and password aren't trimmed we give an error.  Users might
  // expect that these will work without trimming (i.e. they want the password
  // "foobar ", including the space at the end).  We need to reject such values
  // explicitly so the users know what's happening, rather than silently
  // trimming them and expecting the user to understand.
  // We'll silently trim the other fields, because they aren't credentials used
  // to log in, so it's less of a problem.
  const explicityTrimmedFields = ['username', 'password'];
  const nonTrimmedField = explicityTrimmedFields.find(
    field => req.body[field].trim() !== req.body[field]
  );

  if (nonTrimmedField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Cannot start or end with whitespace',
      location: nonTrimmedField
    });
  }

  const sizedFields = {
    username: {
      min: 1
    },
    password: {
      min: 8,
      // bcrypt truncates after 72 characters, so let's not give the illusion
      // of security by storing extra (unused) info
      max: 72
    }
  };
  const tooSmallField = Object.keys(sizedFields).find(
    field =>
      'min' in sizedFields[field] &&
            req.body[field].trim().length < sizedFields[field].min
  );
  const tooLargeField = Object.keys(sizedFields).find(
    field =>
      'max' in sizedFields[field] &&
            req.body[field].trim().length > sizedFields[field].max
  );

  if (tooSmallField || tooLargeField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: tooSmallField
        ? `Must be at least ${sizedFields[tooSmallField]
          .min} characters long`
        : `Must be at most ${sizedFields[tooLargeField]
          .max} characters long`,
      location: tooSmallField || tooLargeField
    });
  }

  let {username, password, firstName = '', lastName = ''} = req.body;
  // Username and password come in pre-trimmed, otherwise we throw an error
  // before this
  firstName = firstName.trim();
  lastName = lastName.trim();

  return User.find({username})
    .count()
    .then(count => {
      if (count > 0) {
        // There is an existing user with the same username
        return Promise.reject({
          code: 422,
          reason: 'ValidationError',
          message: 'Username already taken',
          location: 'username'
        });
      }
      // If there is no existing user, hash the password
      return User.hashPassword(password);
    })
    .then(hash => {
      return User.create({
        username,
        password: hash,
        firstName,
        lastName
      });
    })
    .then(user => {
      let apiRepr = user.apiRepr()
      const authToken = createAuthToken(apiRepr);
      res.json(Object.assign({}, {authToken}, apiRepr));
  
      // return res.status(201).json(user.apiRepr());
      
    })
    .catch(err => {
      // Forward validation errors on to the client, otherwise give a 500
      // error because something unexpected has happened
      if (err.reason === 'ValidationError') {
        return res.status(err.code).json(err);
      }
      res.status(500).json({code: 500, message: 'Internal server error'});
    });
});

// router.post('/login', (req, res) => {
//   const { username, password } = req.body
//   if (!username) {
//       return res.status(400).send('Username is missing')
//   }
//   if (!password) {
//       return res.status(400).send('Password is missing')
//   }
//   User.findOne({ username }).then(userExist => {
//       if (!userExist) {
//           return res.status(400).send('User not exist plz signup first')
//       }

//       const isValidPwd = bcrypt.compareSync(password, userExist.password)

//       if (!isValidPwd) {
//           return res.status(400).send('Incorect credentiels')
//       }

//       return res.status(200).json(userExist)
//   })
// })


// router.get('/login', (req, res) => {
//   return User.find()
//     .then(users => res.json(users.map(user => user.apiRepr())))
//     .catch(err => res.status(500).json({message: 'Internal server error'}));
// });

// router.post('/login/:username', (req, res) => {
//   console.log(req.params.username);
  
//   // const user = [ {username : req.username}];
//   // // const user = [ { id: 3}];
//   // const token = jwt.sign({user}, 'my_secret_key');
  // return User
  //   .find({username : req.body.username})
  //   .then(data => {
  //     const user = [ {username : data}];
  //     const token = jwt.sign({user}, 'my_secret_key');
  //     return token;
  //   } )
  //   .then( data => {
  //     res.json({
  //     token : data
  //     })
  //   }
  //   )
//   });

// router.get('/protected', ensureToken, (req,res) => {
//   console.log(ensureToken);

//   jwt.verify(req.token, 'my_secret_key', function(err,data) {
//     if (err) {
//       res.sendStatus(403);
//     }
//     else {
//       res.json({
//         text : 'this is protected',
//         data : data
//       });
//     }
//   })
// });

router.get('/', (req, res) => {
  return User.find()
    .then(users => res.json(users.map(user => user.apiRepr())))
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});
// Never expose all your users like below in a prod application
// we're just doing this so we have a quick way to see
// if we're creating users. keep in mind, you can also
// verify this in the Mongo shell.


module.exports = {router};
