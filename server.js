// require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const passport = require('passport');
const passportJWT = require("passport-jwt");
// const cors = require('cors');

const {
  DATABASE_URL,
  PORT
} = require('./config');
const {
  GoalPost
} = require('./models');

const app = express();
const {
  router: usersRouter
} = require('./users');
const {
  router: authRouter,
  basicStrategy,
  jwtStrategy
} = require('./auth');
// const {router: loginRouter} = require('./login');

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(express.static('public'))
passport.use(basicStrategy);
// app.use(cors);

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  if (req.method === 'OPTIONS') {
    return res.send(204);
  }
  next();
});

app.use(passport.initialize());
passport.use('local', basicStrategy);

passport.use(jwtStrategy);

app.use('/api/users/', usersRouter);
app.use('/api/auth/', authRouter);


mongoose.Promise = global.Promise;

const jwtAuth = passport.authenticate('jwt', {
  session: false
});


app.get('/goals', jwtAuth, (req, res) => {
  GoalPost
    .find({
      userId: req.user.username
    })
    .then(posts => {
      res.json(posts);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({
        error: 'something went terribly wrong'
      });
    });
});

app.get('/goals/:userId/', (req, res) => {
  GoalPost
    .find({
      userId: req.params.userId
    })
    .then(posts => {
      res.json(posts.map(post => post.apiRepr()));
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({
        error: 'something went horribly awry'
      });
    });
});


app.post('/goals', jwtAuth, (req, res) => {
  const requiredFields = ['goal'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }

  GoalPost
    .create({
      goal: req.body.goal,
      userId: req.user.username,
      complete: false,
      shortTermGoals: [],
      updates: []
    })
    .then(goalPost => res.status(201).json(goalPost.apiRepr()))
    .catch(err => {
      console.error(err);
      res.status(500).json({
        error: 'Something went wrong'
      });
    });

});

app.post('/goals/:id/shortTermGoals', (req, res) => {
  const requiredFields = ['shortGoal'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  GoalPost
    .findById(req.params.id)
    .then(goalPost => {
      goalPost.shortTermGoals = (goalPost.shortTermGoals || []).concat({
        shortGoal: req.body.shortGoal,
        date: req.body.date,
        complete: false
      })
      goalPost.save()
      res.status(201).json(goalPost.apiRepr())
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({
        error: 'Something went wrong'
      });
    });
});

app.post('/goals/:id/updates', jwtAuth, (req, res) => {
  const requiredFields = ['update'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  GoalPost
    .findById(req.params.id)
    .then(updatePost => {
      updatePost.updates = (updatePost.updates || []).concat({
        date: req.body.date,
        update: req.body.update


      })
      updatePost.save()
      res.status(201).json(updatePost.apiRepr())
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({
        error: 'Something went wrong'
      });
    });
});

app.delete('/goals/:id', (req, res) => {
  GoalPost
    .findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).json({
        message: 'success'
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({
        error: 'something went terribly wrong'
      });
    });
});

//UPDATES GOAL
app.put('/goals/:_id', (req, res) => {

  if (!(req.params._id && req.body._id && req.params._id === req.body._id)) {

    res.status(400).json({
      error: 'Request path id and request body id values must match'
    });
  }

  const updated = {};
  const updateableFields = ['goal'];
  updateableFields.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field];
    }
  });


  GoalPost
    .findByIdAndUpdate(req.params._id, {
      $set: {
        "shortTermGoals.shortGoal": "hello hello"
      }
    }, {
      new: true
    })
    .then(updatedPost => res.status(204).end())
    .catch(err => res.status(500).json({
      message: 'Something went wrong'
    }));
});


//UPDATES SHORT TERM GOAL
app.put('/goals/:id/shortTermGoals/:_id', (req, res) => {
  if (!(req.params._id && req.body._id && req.params._id === req.body._id)) {
    res.status(400).json({
      error: 'Request path id and request body id values must match'
    });
  }
  const updated = req.body.shortGoal;

  GoalPost
    // .find({'shortTermGoals': {$elemMatch : {'_id' : req.params._id}}})
    .findById(req.params.id)
    .then(longTermGoal => {
      const shortGoals = longTermGoal.shortTermGoals;
      shortGoals.forEach(shortTermGoal => {
        if (shortTermGoal._id.toString() === req.params._id) {
          shortTermGoal.shortGoal = updated;
        };
      });
      longTermGoal.save()
      res.status(204).end();
    })
    .catch(err => res.status(500).json({
      message: 'Something went wrong'
    }));
})

//UPDATE Updates
app.put('/goals/:id/updates/:_id', (req, res) => {

  if (!(req.params._id && req.body._id && req.params._id === req.body._id)) {
    res.status(400).json({
      error: 'Request path id and request body id values must match'
    });
  }
  const updated = req.body.update;

  GoalPost
    .findById(req.params.id)
    .then(longTermGoal => {
      const updatesToGoals = longTermGoal.updates;
      updatesToGoals.forEach(updatedGoal => {
        if (updatedGoal._id == req.params._id) {
          updatedGoal.update = updated;
        };
      });
      longTermGoal.save()
      res.status(204).end();
    })
    .catch(err => res.status(500).json({
      message: 'Something went wrong'
    }));
});




app.use('*', function (req, res) {
  res.status(404).json({
    message: 'Not Found'
  });
});

// closeServer needs access to a server object, but that only
// gets created when `runServer` runs, so we declare `server` here
// and then assign a value to it in run
let server;

// this function connects to our database, then starts the server
function runServer(databaseUrl = DATABASE_URL, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
          resolve();
        })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

// this function closes the server, and returns a promise. we'll
// use it in our integration tests later.
function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = {
  runServer,
  app,
  closeServer
};