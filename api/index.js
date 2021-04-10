const express = require('express');
const user = require('./user');
const portfolio = require('./portfolio');
const project = require('./project');
const projects = require('./projects');

const router = express.Router();

router.use('/user', user);
router.use('/portfolio', portfolio);
router.use('/project', project);
router.use('/projects', projects);

module.exports = router;
