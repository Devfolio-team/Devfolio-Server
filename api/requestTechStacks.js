const express = require('express');
const { requestTechStacks } = require('../dao/techStacksDAO');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { stack_name } = req.query;
    const techStacks = await requestTechStacks(stack_name);
    res.status(200).json({ responseMessage: 'success', techStacks });
  } catch (error) {
    res.status(500).json({ responseMessage: 'failure' });
  }
});

module.exports = router;
