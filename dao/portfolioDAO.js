const mysql = require('mysql2/promise');
const dbconfig = require('../.config/database');

const pool = mysql.createPool(dbconfig);

exports.getProjectsFromSpecificUser = async ({ user_id }) => {
  try {
    const connection = await pool.getConnection(async conn => conn);
    try {
      const [
        rows,
      ] = await connection.query('SELECT * FROM project WHERE user_user_id = (?) ORDER BY project_id desc', [
        user_id,
      ]);
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

exports.getSkillsFromSpecificUser = async ({ user_id }) => {
  try {
    const connection = await pool.getConnection(async conn => conn);
    try {
      const [rows] = await connection.query('SELECT * FROM skills WHERE user_user_id = (?)', [user_id]);
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
