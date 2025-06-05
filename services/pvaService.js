const { pool, sql } = require('../config/db');

class PvaService {
  static async getArticleDetails(articleId) {
    const query = `
      SELECT ID, ARTICLE_MEASURE_ID, IS_ACTIVE, NAME, FIRST_NAME, 
             PIECE_GTIN, FPACK_GTIN, IS_VALID_PERIOD_WATCH, VALID_PERIOD_DAYS 
      FROM OPENQUERY(OW, 'SELECT ID, ARTICLE_MEASURE_ID, IS_ACTIVE, NAME, FIRST_NAME,
      PIECE_GTIN, FPACK_GTIN, IS_VALID_PERIOD_WATCH, VALID_PERIOD_DAYS  
      FROM wms.article WHERE id = ''${articleId}'''
      )
    `;

    const result = await pool.request().query(query);
    if (!result.recordset[0]) return null;

    // Transform to camelCase
    const article = result.recordset[0];
    return {
      id: article.ID,
      articleMeasureId: article.ARTICLE_MEASURE_ID,
      isActive: article.IS_ACTIVE,
      name: article.NAME,
      firstName: article.FIRST_NAME,
      pieceGtin: article.PIECE_GTIN,
      fpackGtin: article.FPACK_GTIN,
      isValidPeriodWatch: article.IS_VALID_PERIOD_WATCH,
      validPeriodDays: article.VALID_PERIOD_DAYS
    };
  }

  static async getPvaData(docId) {
    try {
      await pool.connect();
      
      const query = `
        SELECT doc_id, article_id, qnt_required, qnt_picked, qnt_piece, is_pack_required 
        FROM OPENQUERY(OW2, 'select *
        from wms.dp_pick_article dp
        where dp.doc_id = ''${docId}'''
        )
      `;

      const result = await pool.request().query(query);

      if (!result.recordset || result.recordset.length === 0) {
        const error = new Error('PVA data not found');
        error.code = 'ENOENT';
        throw error;
      }

      // Calculate total quantity
      const totalQntRequired = result.recordset.reduce((sum, item) => sum + item.qnt_required, 0);

      // Extract doc_id from first record
      const documentId = result.recordset[0].doc_id;

      // Get article details for each item and combine the data
      const items = await Promise.all(
        result.recordset.map(async ({ doc_id, article_id, qnt_required, qnt_picked, qnt_piece, is_pack_required }) => {
          const articleDetails = await this.getArticleDetails(article_id);
          return {
            articleId: article_id,
            qntRequired: qnt_required,
            qntPicked: qnt_picked,
            qntPiece: qnt_piece,
            isPackRequired: is_pack_required,
            articleDetails: articleDetails || {}
          };
        })
      );

      return {
        docId: documentId,
        items,
        totalQntRequired
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = PvaService; 