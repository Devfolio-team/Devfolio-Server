const express = require('express');
const { requestTechStacks, getRequestTechStacks } = require('../dao/techStacksDAO');
const jwtVerify = require('../utils/jwtVerify');

const router = express.Router();

router.post('/', async (req, res) => {
  jwtVerify(req, res, async () => {
    const { stack_name } = req.query;
    const techStacks = await requestTechStacks(stack_name);
    res.status(200).json({ responseMessage: 'success', techStacks });
  });
});

router.get('/', async (req, res) => {
  try {
    const techStacks = await getRequestTechStacks();
    res.status(200).json({ responseMessage: 'success', techStacks });
  } catch (error) {
    res.status(500).json({ responseMessage: 'failure' });
  }
});

module.exports = router;
