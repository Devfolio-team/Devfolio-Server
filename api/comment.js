const express = require('express');
const { addComment, getComment, fetchComment } = require('../dao/commentDAO');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { insertId } = await addComment(req.body);
    const commentData = await getComment(insertId);
    console.log(commentData);
    res.status(200).json({ responseMessage: 'success', commentData });
  } catch (error) {
    res.status(500).json({ responseMessage: 'failure' });
  }
});

router.get('/:project_id', async (req, res) => {
  try {
    const commentsData = await fetchComment(req.params.project_id);
    res.status(200).json({ responseMessage: 'success', commentsData });
  } catch (error) {
    res.status(500).json({ responseMessage: 'failure' });
  }
});

module.exports = router;
