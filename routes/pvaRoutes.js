const express = require('express');
const router = express.Router();
const PvaController = require('../controllers/pvaController');

router.get('/data', PvaController.getPvaData);

module.exports = router; 