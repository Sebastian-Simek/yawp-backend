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

  static async getRestaurantById(id) {
    const { rows } = await pool.query(
      `SELECT * 
      FROM restaurants
      WHERE id = $1`,
      [id]
    );
    return new Restaurant(rows[0]);
  }

  async getReviews() {
    const { rows } = await pool.query(
      `SELECT reviews.*
        FROM reviews
        INNER JOIN restaurants on restaurants.id = reviews.restaurant_id
        WHERE restaurants.id = $1`,
      [this.id]
    );
    this.reviews = rows;
  }

  static async addReview(newReview) {
    console.log('newReview', newReview);
    const { rows } = await pool.query(
      `INSERT INTO reviews 
        (restaurant_id, user_id, review, detail)
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
      [
        newReview.restaurant_id,
        newReview.user_id,
        newReview.review,
        newReview.detail
      ]
    );
    console.log('rows', rows);
    return new Restaurant(rows[0]);
  }
};
