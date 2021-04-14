const mysql = require('mysql2/promise');
const dbconfig = require('../.config/database');
const { UserDTO } = require('../dto');

const pool = mysql.createPool(dbconfig);

// 일반 이메일 회원가입시 email, password, nickname을 받고 profile_photo는 클라이언트에서 랜덤 아바타를 생성하여 전송해준다.
exports.signupEmail = async ({ email, password, name, nickname, profile_photo } = new UserDTO()) => {
  try {
    const connection = await pool.getConnection(async conn => conn);
    console.log(email, password, name, nickname, profile_photo);
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
exports.signupGoogle = async ({ email, name, profile_photo } = new UserDTO()) => {
  try {
    const connection = await pool.getConnection(async conn => conn);
    try {
      const [
        rows,
      ] = await connection.query(
        'INSERT INTO user(email, name, profile_photo, created) values (?, ?, ?, now())',
        [email, name, profile_photo]
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
exports.signupGithub = async ({ email, nickname, profile_photo, github_url } = new UserDTO()) => {
  try {
    const connection = await pool.getConnection(async conn => conn);
    try {
      const [
        rows,
      ] = await connection.query(
        'INSERT INTO user(email, nickname, profile_photo, created, github_url) values (?, ?, ?, now(), ?)',
        [email, nickname, profile_photo, github_url]
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

exports.checkExistedUser = async ({ email }) => {
  try {
    const connection = await pool.getConnection(async conn => conn);
    try {
      // 구글이나 깃헙 이메일로 로그인 할 시에는 존재할 시에 바로 쿼리문의 결과값을 클라이언트에 전달 (쿠키에 토큰을 담아서)
      const [rows] = await connection.query('SELECT * FROM user WHERE email = (?)', [email]);
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

exports.signinEmail = async ({ email, password } = new UserDTO()) => {
  console.log(email, password);
  try {
    const connection = await pool.getConnection(async conn => conn);
    try {
      const [rows] = await connection.query('SELECT * FROM user WHERE email = (?) and password = (?)', [
        email,
        password,
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
