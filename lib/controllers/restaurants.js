const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const Restaurant = require('../models/Restaurant');

module.exports = Router()
  .get('/', async (req, res, next) => {
    try { 
      const restaurants = await Restaurant.getAllRestaurants();
      res.json(restaurants);
        
    } catch (error) {
      next(error);
    }
  })
  .get('/:id', async (req, res, next) => {
    try {
      const restaurant = await Restaurant.getRestaurantById(req.params.id);
      await restaurant.getReviews();
      res.json(restaurant);
    } catch (error) {
      next(error);
    }
  })
  .post('/:id/reviews', authenticate, async (req, res, next) => {
    try {
      const newReview = await Restaurant.addReview({ ...req.body, restaurant_id: req.params.id, user_id: req.user.id });
      res.json(newReview);
    } catch (error) {
      next(error);
    }
  });
