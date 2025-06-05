const ResponseFormatter = require('../utils/responseFormatter');

function errorHandler(err, req, res, next) {
  console.error('Error:', err);

  if (err.name === 'RequestError') {
    return res.status(400).json(
      ResponseFormatter.error('INVALID_REQUEST', err.message)
    );
  }

  if (err.code === 'ENOENT') {
    // Check if the error is from PVA service
    if (err.message === 'PVA data not found') {
      return res.status(404).json(
        ResponseFormatter.error('PVA_DATA_NOT_FOUND')
      );
    }
    // Default not found error
    return res.status(404).json(
      ResponseFormatter.error('EMPLOYEE_NOT_FOUND')
    );
  }

  // Default error response
  res.status(500).json(
    ResponseFormatter.error('INTERNAL_SERVER_ERROR')
  );
}

module.exports = errorHandler; 