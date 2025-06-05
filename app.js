const express = require('express');
const employeeRoutes = require('./routes/employeeRoutes');
const pvaRoutes = require('./routes/pvaRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/employee', employeeRoutes);
app.use('/pva', pvaRoutes);

// Error handling
app.use(errorHandler);

module.exports = app; 