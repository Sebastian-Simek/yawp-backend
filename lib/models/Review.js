const pool = require('../utils/pool');

module.exports = class Review {
  id;
  review;
  user_id;
  restaurant_id;

  constructor(row) {
    this.id = row.id;
    this.review = row.review;
    this.user_id = row.user_id;
    this.restaurant_id = row.restaurant_id;
  }

  static async delete(id) {
    const { rows } = await pool.query(
      `DELETE from reviews
        WHERE id = $1
        RETURNING *`, [id]
    );
    return new Review(rows[0]);
  }

  static async getReviewById(id) {
    const { rows } = await pool.query(
      `SELECT reviews.* FROM reviews
      INNER JOIN users on reviews.user_id = users.id
      WHERE reviews.id = $1`, [id]
    );
    return new Review(rows[0]);
  }
};
