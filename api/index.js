const express = require('express');
// const user = require('./user');
const portfolio = require('./portfolio');
const project = require('./project');
const projects = require('./projects');
const image = require('./image');
const techStacks = require('./techStacks');
const requestTechStacks = require('./requestTechStacks');
const projectLike = require('./projectLike');

const router = express.Router();

// router.use('/user', user);
router.use('/portfolio', portfolio);
router.use('/project', project);
router.use('/projects', projects);
router.use('/image', image);
router.use('/tech_stacks', techStacks);
router.use('/request_tech_stacks', requestTechStacks);
router.use('/project_like', projectLike);
// auth라우트는 OAuth 이슈로 router객체로 모듈화를 진행하지 못함

module.exports = router;
