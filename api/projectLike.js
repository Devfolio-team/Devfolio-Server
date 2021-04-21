const express = require('express');
const { postLike, deleteLike, checkExistedLike } = require('../dao/likeDAO');
const { getProjectLikeCount } = require('../dao/projectDAO');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [existeLike] = await checkExistedLike(req.query);
    res.status(200).json({ responseMessage: 'success', existeLike: !!existeLike });
  } catch (error) {
    res.status(500).json({ responseMessage: 'failure', error });
  }
});

router.post('/', async (req, res) => {
  try {
    const { affectedRows } = await postLike(req.query);
    if (affectedRows) {
      try {
        const [likeCount] = await getProjectLikeCount(req.query.project_id);
        res.status(200).json({ responseMessage: 'success', likeCount: likeCount.likeCount });
      } catch (error) {
        res.status(500).json({ responseMessage: 'failure', error });
      }
    }
  } catch (error) {
    res.status(500).json({ responseMessage: 'failure', error });
  }
  res.status(400).json({ responseMessage: 'failure' });
});

router.delete('/', async (req, res) => {
  try {
    const { affectedRows } = await deleteLike(req.query);

    if (affectedRows) {
      try {
        const [likeCount] = await getProjectLikeCount(req.query.project_id);
        res.status(200).json({ responseMessage: 'success', likeCount: likeCount.likeCount });
      } catch (error) {
        res.status(500).json({ responseMessage: 'failure', error });
      }
    }
  } catch (error) {
    res.status(500).json({ responseMessage: 'failure', error });
  }
  res.status(400).json({ responseMessage: 'The users likes do not exist for this post.' });
});

module.exports = router;
