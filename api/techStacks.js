const express = require('express');
const { fetchTechStacks } = require('../dao/techStacksDAO');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const techStacks = await fetchTechStacks();
    res.status(200).json({ responseMessage: 'success', techStacks });
  } catch (error) {
    res.status(500).json({ responseMessage: 'failure' });
  }
});

module.exports = router;
