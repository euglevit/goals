const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const config = require('../config');

const createAuthToken = user => {
    return jwt.sign({user}, config.JWT_SECRET, {
        subject: user.username,
        expiresIn: config.JWT_EXPIRY,
        algorithm: 'HS256'
    });
};

const router = express.Router();

router.post(
    '/login',
    // The user provides a username and password to login
    passport.authenticate('basic', {session: false}),
    (req, res) => {
        const authToken = createAuthToken(req.user.apiRepr());
        res.json({authToken});
    }
);

router.post(
    '/refresh',
    // The user exchanges an existing valid JWT for a new one with a later
    // expiration
    passport.authenticate('jwt', {session: false}),
    (req, res) => {
        const authToken = createAuthToken(req.user);
        res.json({authToken});
    }
);

exports.sign_in = function(req, res) {
    User.findOne({
      username: req.body.username
    }, function(err, user) {
      if (err) throw err;
      if (!user) {
        res.status(401).json({ message: 'Authentication failed. User not found.' });
      } else if (user) {
        if (!user.comparePassword(req.body.password)) {
          res.status(401).json({ message: 'Authentication failed. Wrong password.' });
        } else {
          return res.json({token: jwt.sign({ username: username, password: password})});
        }
      }
    });
  };

module.exports = {router};
