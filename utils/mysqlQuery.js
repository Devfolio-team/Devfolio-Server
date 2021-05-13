const mysql = require('mysql2/promise');
const dbconfig = require('../.config/database');

const pool = mysql.createPool(dbconfig);

module.exports = async (query, params = []) => {
  try {
    const connection = await pool.getConnection(async conn => conn);
    try {
      const [rows] = await connection.query(query, params);
      connection.release();
      return rows;
    } catch (err) {
      connection.release();
      return 'Query Error';
    }
  } catch (error) {
    console.error(error);
  }
};
