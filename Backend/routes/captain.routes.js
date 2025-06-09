const express = require('express');
const { body } = require("express-validator");
const captianController = require('../controllers/captain.controller');

const router = express.Router();


router.post('/register', captianController.registerCaptain);


module.exports = router;