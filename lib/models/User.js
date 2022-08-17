const pool = require('../utils/pool');

module.exports = class User {
  id;
  email;
  username;
  #passwordHash;

  constructor(row) {
    this.id = row.id;
    this.email = row.email;
    this.username = row.username;
    this.#passwordHash = row.password_hash;
  }

  static async insert({ email, username, passwordHash }) {
    const { rows } = await pool.query(
      `INSERT INTO users (email, username, password_hash)
        VALUES ($1, $2, $3)
        RETURNING *`,
      [email, username, passwordHash]
    );
    return new User(rows[0]);
  }

  static async getByUsername(username) {
    const { rows } = await pool.query(
      `SELECT * 
      FROM users
      WHERE username = $1`,
      [username]
    );
    if(!rows[0]) return null;
    return new User(rows[0]);
  }
  get passwordHash () {
    return this.#passwordHash;
  }

  static async getUsers() { 
    const { rows } = await pool.query(
      'SELECT * FROM users'
    );
    return rows.map((row) => new User(row));
  }
};
