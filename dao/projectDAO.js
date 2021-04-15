const mysql = require('mysql2/promise');
const dbconfig = require('../.config/database');

const ProjectDTO = require('../dto/ProjectDTO');

const pool = mysql.createPool(dbconfig);

exports.fetchProjects = async () => {
  try {
    const connection = await pool.getConnection(async conn => conn);
    try {
      const [rows] = await connection.query('SELECT * FROM project');
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
