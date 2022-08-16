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
  });
