const express = require('express');
const {
  addComment,
  getComment,
  fetchComment,
  deleteComment,
  editComment,
  getCommentAuthorUniqueId,
} = require('../dao/commentDAO');
const jwtVerify = require('../utils/jwtVerify');

const router = express.Router();

router.post('/', (req, res) => {
  jwtVerify(req, res, async ({ user_id: currentUserId }) => {
    if (currentUserId === req.body.userId) {
      const { insertId } = await addComment(req.body);
      const commentData = await getComment(insertId);
      res.status(200).json({ responseMessage: 'success', commentData });
    } else {
      res.status(401).json({ responseMessage: 'Warning! Use only your own tokens' });
    }
  });
});

router.get('/:project_id', async (req, res) => {
  try {
    const commentsData = await fetchComment(req.params.project_id);
    res.status(200).json({ responseMessage: 'success', commentsData });
  } catch (error) {
    res.status(500).json({ responseMessage: 'failure' });
  }
});

router.patch('/', (req, res) => {
  jwtVerify(req, res, async ({ user_id: currentUserId }) => {
    if (currentUserId === req.body.userId) {
      const editResult = await editComment(req.body);
      res.status(200).json({ responseMessage: 'success', editResult });
    } else {
      res.status(401).json({ responseMessage: 'Warning! Use only your own tokens' });
    }
  });
});

router.delete('/:comment_id', (req, res) => {
  jwtVerify(req, res, async ({ user_id: currentUserId }) => {
    const { comment_id } = req.params;
    const [{ commentAuthorId }] = await getCommentAuthorUniqueId(comment_id);
    console.log(commentAuthorId);
    if (commentAuthorId === currentUserId) {
      const deleteResult = await deleteComment(comment_id);
      res.status(200).json({ responseMessage: 'success', deleteResult });
    } else {
      res.status(401).json({ responseMessage: 'Warning! Use only your own tokens' });
    }
  });
});

module.exports = router;
