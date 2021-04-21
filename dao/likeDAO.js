const mysql = require('mysql2/promise');
const dbconfig = require('../.config/database');

const pool = mysql.createPool(dbconfig);

exports.checkExistedLike = async ({ project_id, user_id }) => {
  try {
    const connection = await pool.getConnection(async conn => conn);
    try {
      const [
        rows,
      ] = await connection.query(
        'SELECT * FROM project_likes WHERE project_project_id = (?) AND user_user_id = (?)',
        [project_id, user_id]
      );
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

exports.postLike = async ({ project_id, user_id }) => {
  try {
    const connection = await pool.getConnection(async conn => conn);
    try {
      const [
        rows,
      ] = await connection.query(
        'INSERT INTO project_likes(project_project_id, user_user_id) values((?), (?))',
        [project_id, user_id]
      );
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

exports.deleteLike = async ({ project_id, user_id }) => {
  try {
    const connection = await pool.getConnection(async conn => conn);
    try {
      const [
        rows,
      ] = await connection.query(
        'DELETE FROM project_likes WHERE project_project_id = (?) AND user_user_id = (?) LIMIT 1',
        [project_id, user_id]
      );
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
