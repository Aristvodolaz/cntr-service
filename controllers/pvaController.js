const PvaService = require('../services/pvaService');
const ResponseFormatter = require('../utils/responseFormatter');

class PvaController {
  static async getPvaData(req, res, next) {
    try {
      const { docId } = req.query;
      
      if (!docId) {
        throw new Error('Document ID is required');
      }

      const pvaData = await PvaService.getPvaData(docId);
      
      // Format response with doc_id, items and total
      const response = {
        docId: pvaData.docId,
        items: pvaData.items,
        totalQntRequired: pvaData.totalQntRequired
      };

      res.json(ResponseFormatter.success(response));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = PvaController; 