const express = require('express');
const { fetchTechStacks } = require('../dao/techStacksDAO');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const teckStacks = await fetchTechStacks();
    res.status(200).json({ responseMessage: 'success', teckStacks });
  } catch (error) {
    res.status(500).json({ responseMessage: 'failure' });
  }
});

module.exports = router;
