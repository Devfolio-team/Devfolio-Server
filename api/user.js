// const express = require('express');
// const jwt = require('jsonwebtoken');

// const { secretKey } = require('../.config/jwt');
// const { options } = require('../.config/jwt');
// const cookieOptions = require('../.config/cookie');
// const { checkExistedUser, signinEmail, signupEmail } = require('../dao/userDAO');
// const { UserDTO } = require('../dto');

// const router = express.Router();

// // 현재 로그인 된 유저의 정보를 요청
// router.get('/', (req, res) => {
//   res.send('check');
// });

// // 현재 로그인 된 유저의 회원정보 수정
// router.put('/', (req, res) => {
//   res.send();
// });

// // 로그인
// router.post('/signin/email', async (req, res) => {
//   const userDTO = new UserDTO(req.body);
//   try {
//     const [isExistedUser] = await checkExistedUser(userDTO);
//     res.status(200).json({ isExistedUser: !!isExistedUser });
//   } catch (error) {
//     res.status(500).json({ error });
//   }
// });

// // 로그인
// router.post('/signin/password', async (req, res) => {
//   const userDTO = new UserDTO(req.body);
//   try {
//     const [isConnect] = await signinEmail(userDTO);
//     if (isConnect) {
//       const { email, nickname } = isConnect;
//       const token = jwt.sign({ email, nickname }, secretKey, options);
//       res.cookie('token', token, cookieOptions);
//       res.status(200).json({ isConnect: !!isConnect, userInfo: isConnect });
//     } else {
//       res.status(200).json({ isConnect: !!isConnect, message: 'password not matched' });
//     }
//   } catch (error) {
//     res.status(500).json({ error });
//   }
// });

// // 일반 회원가입
// router.post('/signup', async (req, res) => {
//   const userDTO = new UserDTO(req.body);
//   const signupResult = await signupEmail(userDTO);
//   // 정상 추가시
//   // {
//   //   "fieldCount": 0,
//   //   "affectedRows": 1,
//   //   "insertId": 4,
//   //   "info": "",
//   //   "serverStatus": 2,
//   //   "warningStatus": 0
//   // }
//   // 에러 발생시
//   // {
//   //   "message": "Duplicate entry 'hjr4557@gmail.com' for key 'email_UNIQUE'",
//   //   "code": "ER_DUP_ENTRY",
//   //   "errno": 1062,
//   //   "sqlState": "23000",
//   //   "sqlMessage": "Duplicate entry 'hjr4557@gmail.com' for key 'email_UNIQUE'"
//   // }
//   if (signupResult.result === 'success' && signupResult.rows.affectedRows) {
//     res.status(200).json(signupResult);
//   } else {
//     res.status(200).json(signupResult);
//   }
// });

// // 특정 유저의 닉네임으로 프로필 정보를 요청
// router.get('/profile/:nickname', (req, res) => {
//   res.send();
// });

// module.exports = router;
