const express = require('express');
const router = express.Router();
const EmployeeController = require('../controllers/employeeController');

router.get('/:id', EmployeeController.getEmployeeById);

module.exports = router; 