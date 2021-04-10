const express = require('express');

const router = express.Router();

// 현재 로그인 된 유저의 정보를 요청
router.get('/', (req, res) => {
  res.send();
});

// 현재 로그인 된 유저의 회원정보 수정
router.put('/', (req, res) => {
  res.send();
});

// 로그인
router.post('/signin', (req, res) => {
  res.send();
});

// 회원가입
router.post('/signup', (req, res) => {
  res.send();
});

// 특정 유저의 닉네임으로 프로필 정보를 요청
router.get('/profile/:nickname', (req, res) => {
  res.send();
});

module.exports = router;
