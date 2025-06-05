const { pool, sql } = require('../config/db');

class EmployeeService {
  static async getEmployeeById(id) {
    try {
      await pool.connect();
      
      // Using parameterized query to prevent SQL injection
      const query = `
        SELECT ID, FULL_NAME 
        FROM OPENQUERY(${process.env.LINKED_SERVER}, 
          'SELECT ID, FULL_NAME FROM staff.employee WHERE id = ''${id}'''
        )
      `;

      const result = await pool.request().query(query);

      if (!result.recordset || result.recordset.length === 0) {
        const error = new Error('Employee not found');
        error.code = 'ENOENT';
        throw error;
      }

      return result.recordset[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = EmployeeService; 