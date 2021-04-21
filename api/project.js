const express = require('express');
const { createProject } = require('../dao/projectDAO');

const router = express.Router();

router.post('/', async (req, res) => {
  const result = await createProject(req.body);
  res.send(result);
});

module.exports = router;
