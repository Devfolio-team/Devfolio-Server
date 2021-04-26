const mysql = require('mysql2/promise');
const dbconfig = require('../.config/database');
const { UserDTO } = require('../dto');

const pool = mysql.createPool(dbconfig);

// 일반 이메일 회원가입시 email, password, nickname을 받고 profile_photo는 클라이언트에서 랜덤 아바타를 생성하여 전송해준다.
exports.signupEmail = async ({ email, password, name, nickname, profile_photo } = new UserDTO({})) => {
  try {
    const connection = await pool.getConnection(async conn => conn);
    try {
      const [
        rows,
      ] = await connection.query(
        'INSERT INTO user(email, password, name, nickname, profile_photo, created) values((?), (?), (?), (?), (?), now())',
        [email, password, name, nickname, profile_photo]
      );
      connection.release();
      return { result: 'success', rows };
    } catch (err) {
      connection.release();
      return { result: 'error', err };
    }
  } catch (error) {
    console.error(error);
  }
};

// 구글 로그인 시 받아야하는 3가지 인자를 API에서 제공받을 수 있다.
exports.signupGoogle = async ({ email, sub, name, profile_photo } = new UserDTO({})) => {
  try {
    const connection = await pool.getConnection(async conn => conn);
    try {
      const [
        rows,
      ] = await connection.query(
        'INSERT INTO user(email, unique_id, name, nickname, profile_photo, created) value((?), (?), (?), (?), (?), now())',
        [email, sub + email, name, name, profile_photo]
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

// 깃허브 로그인시 받는 4개의 인자를 모두 제공받을 수 있다.
exports.signupGithub = async ({ name, nickname, profile_photo, github_url, unique_id } = new UserDTO({})) => {
  try {
    const connection = await pool.getConnection(async conn => conn);
    try {
      const [
        rows,
      ] = await connection.query(
        'INSERT INTO user(name, unique_id, nickname, profile_photo, created, github_url) values((?), (?), (?), (?), now(), (?))',
        [name, unique_id, nickname, profile_photo, github_url]
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

exports.checkExistedUser = async uniqueId => {
  try {
    const connection = await pool.getConnection(async conn => conn);
    try {
      // 구글이나 깃헙 이메일로 로그인 할 시에는 존재할 시에 바로 쿼리문의 결과값을 클라이언트에 전달 (쿠키에 토큰을 담아서)
      const [rows] = await connection.query('SELECT * FROM user WHERE unique_id = (?)', [uniqueId]);
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

exports.getUserInfo = async ({ user_id } = new UserDTO({})) => {
  try {
    const connection = await pool.getConnection(async conn => conn);
    try {
      const [rows] = await connection.query('SELECT * FROM user WHERE user_id = (?)', [user_id]);
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
