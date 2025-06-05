const EmployeeService = require('../services/employeeService');
const ResponseFormatter = require('../utils/responseFormatter');

class EmployeeController {
  static async getEmployeeById(req, res, next) {
    try {
      const { id } = req.params;
      
      if (!id) {
        throw new Error('Employee ID is required');
      }

      const employee = await EmployeeService.getEmployeeById(id);
      res.json(ResponseFormatter.success(employee));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = EmployeeController; 