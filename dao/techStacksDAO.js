const mysql = require('mysql2/promise');
const dbconfig = require('../.config/database');

const TechStacksDTO = require('../dto/TechStacksDTO');

const pool = mysql.createPool(dbconfig);

exports.fetchTechStacks = async () => {
  try {
    const connection = await pool.getConnection(async conn => conn);
    try {
      const [rows] = await connection.query('SELECT * FROM tech_stacks');
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
