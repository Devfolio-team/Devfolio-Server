const express = require('express');
const { getProjectCommentCount } = require('../dao/commentDAO');
const { getFavoriteProject, getAuthorInfo, getProjectLikeCount } = require('../dao/projectDAO');

const router = express.Router();

router.get('/:user_id', async (req, res) => {
  const favoriteProjects = await getFavoriteProject(req.params.user_id, req.query);

  const projectsData = await Promise.all(
    favoriteProjects.map(async project => {
      const [authorInfo] = await getAuthorInfo(project.user_user_id);
      const [{ commentCount }] = await getProjectCommentCount(project.project_id);
      const [{ likeCount }] = await getProjectLikeCount(project.project_id);
      const { nickname, profile_photo } = authorInfo;
      return { ...project, nickname, profile_photo, likeCount, commentCount };
    })
  );
  try {
    res.status(200).json({ responseMessage: 'success', projectsData });
  } catch (error) {
    res.status(500).json({ responseMessage: 'failure' });
  }
});

module.exports = router;
