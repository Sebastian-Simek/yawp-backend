const pool = require('../utils/pool');

module.exports = class Restaurant {
  id;
  name;
  location;

  constructor(row) {
    this.id = row.id;
    this.name = row.name;
    this.location = row.location;
  }

  static async getAllRestaurants() {
    const { rows } = await pool.query(
      'SELECT * FROM restaurants'
    );
    return rows.map((row) => new Restaurant(row));
  }
};
