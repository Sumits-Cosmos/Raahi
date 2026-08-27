const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const mapController = require('../controllers/map.controller');
const { query } = require('express-validator');

router.get(
  '/get-coordinates',
  query('address').isString().isLength({ min: 3 }),
  authMiddleware.authAny,
  mapController.getCoordinates
);

router.get(
  '/get-distance-time',
  query('origin').isString().isLength({ min: 3 }),
  query('destination').isString().isLength({ min: 3 }),
  authMiddleware.authAny,
  mapController.getDistanceTime
);

router.get(
  '/get-suggestion',
  query('text').isString().isLength({ min: 3 }),
  authMiddleware.authAny,
  mapController.getAutoCompleteSuggestion
);

router.get(
  '/get-route',
  query('origin').isString().isLength({ min: 3 }),
  query('destination').isString().isLength({ min: 3 }),
  authMiddleware.authAny,
  mapController.getRoute
);

module.exports = router;
