const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = class UserService {
    
  static async signUpUser({ email, username, password }) {
    
    if (await User.getByUsername(username) !== null)
      throw new Error('Username already exists');
    
    try {
      const passwordHash = await bcrypt.hash(
        password,
        Number(process.env.SALT_ROUNDS)
      );
    
      const user = await User.insert({
        email,
        username,
        passwordHash
      });


      const token = jwt.sign({ ...user }, process.env.JWT_SECRET, { expiresIn: '1 day' });
      return [user, token];

    } catch(e) {
      e.status = 401;
      throw e;
    }
  }

  static async signInUser({ username, password }) {
    try {
      const user = await User.getByUsername(username);
      if(!user)
        throw new Error('Invalid username');
      if(!bcrypt.compareSync(password, user.passwordHash))  
        throw new Error('Invalid password');
      const token = jwt.sign({ ...user }, process.env.JWT_SECRET, { expiresIn: '1 day' });
      return token;
    } catch(e) {
      e.status = 401;
      throw e;
    }
  }

};
