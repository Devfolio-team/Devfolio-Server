const express = require('express');
const { postLike, deleteLike, checkExistedLike } = require('../dao/likeDAO');
const { getProjectLikeCount } = require('../dao/projectDAO');
const jwtVerify = require('../utils/jwtVerify');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [existeLike] = await checkExistedLike(req.query);
    res.status(200).json({ responseMessage: 'success', existeLike: !!existeLike });
  } catch (error) {
    res.status(500).json({ responseMessage: 'failure', error });
  }
});

router.post('/', (req, res) => {
  jwtVerify(req, res, async ({ user_id: currentUserId }) => {
    if (+req.query.user_id === currentUserId) {
      const { affectedRows } = await postLike(req.query);
      if (affectedRows) {
        try {
          const [likeCount] = await getProjectLikeCount(req.query.project_id);
          res.status(200).json({ responseMessage: 'success', likeCount: likeCount.likeCount });
          return;
        } catch (error) {
          res.status(500).json({ responseMessage: 'failure', error });
        }
      } else res.status(400).json({ responseMessage: 'failure' });
    } else {
      res.status(401).json({ responseMessage: 'Warning! Use only your own tokens' });
    }
  });
});

router.delete('/', (req, res) => {
  jwtVerify(req, res, async ({ user_id: currentUserId }) => {
    if (+req.query.user_id === currentUserId) {
      const { affectedRows } = await deleteLike(req.query);

      if (affectedRows) {
        try {
          const [likeCount] = await getProjectLikeCount(req.query.project_id);
          res.status(200).json({ responseMessage: 'success', likeCount: likeCount.likeCount });
          return;
        } catch (error) {
          res.status(500).json({ responseMessage: 'failure', error });
        }
      } else res.status(400).json({ responseMessage: 'The users likes do not exist for this post.' });
    } else {
      res.status(401).json({ responseMessage: 'Warning! Use only your own tokens' });
    }
  });
});

module.exports = router;
