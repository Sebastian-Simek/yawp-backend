const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = class UserService {
  static async signUpUser({ email, username, password }) {
    const passwordHash = await bcrypt.hash(
      password,
      Number(process.env.SALT_ROUNDS)
    );

    const user = await User.insert({
      email,
      username,
      passwordHash
    });
    try {
      const token = jwt.sign({ ...user }, process.env.JWT_SECRET, { expiresIn: '1 day' });

      return [user, token];
      
    } catch(e) {
      e.status = 401;
      throw e;
    }
  }
};
