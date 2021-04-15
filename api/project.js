const express = require('express');
const { fetchProjects } = require('../dao/projectDAO');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const projects = await fetchProjects();
    res.status(200).json({ responseMessage: 'success', projects });
  } catch (error) {
    res.status(500).json({ responseMessage: 'failure', error });
  }
});

module.exports = router;
