const { Router } = require('express');
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
      console.log(restaurant);
      res.json(restaurant);
    } catch (error) {
      next(error);
    }
  });
