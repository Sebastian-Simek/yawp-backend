const { Router } = require('express');
const UserService = require('../middleware/UserService');
const User = require('../models/User');
const authorize = require('../middleware/authorize');
const authenticate = require('../middleware/authenticate');
const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;


module.exports = Router()
  .post('/', async (req, res, next) => {
    try {
      const [user, token] = await UserService.signUpUser(req.body);
      res.cookie(process.env.COOKIE_NAME, token, {
        httpOnly: true,
        maxAge: ONE_DAY_IN_MS
      })
        .json({ user, message: 'Signed in successfully' });
    } catch(e) {
      next(e);
    }
  })
  .post('/sessions', async (req, res, next) => {
    try {
      const token = await UserService.signInUser(req.body);
      res.cookie(process.env.COOKIE_NAME, token, {
        httpOnly: true,
        maxAge: ONE_DAY_IN_MS
      })
        .json({ message: 'Signed in successfully' });
    } catch(e) {
      next(e);
    }
  })
  .get('/', authorize, authenticate,  async (req, res, next) => {
    try {
      const users = await User.getUsers();
      res.json(users);
    } catch(e) {
      next(e);
    }
  });
