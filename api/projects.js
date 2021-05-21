const express = require('express');
const { getProjectCommentCount } = require('../dao/commentDAO');
const { fetchProjects, getAuthorInfo, getProjectLikeCount } = require('../dao/projectDAO');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const projects = await fetchProjects();

    const projectsData = await Promise.all(
      projects.map(async project => {
        const [authorInfo] = await getAuthorInfo(project.user_user_id);
        const [{ commentCount }] = await getProjectCommentCount(project.project_id);
        const [{ likeCount }] = await getProjectLikeCount(project.project_id);
        const { nickname, profile_photo } = authorInfo;
        return { ...project, nickname, profile_photo, likeCount, commentCount };
      })
    );

    res.status(200).json({ responseMessage: 'success', projectsData });
  } catch (error) {
    res.status(500).json({ responseMessage: 'failure', error });
  }
});

module.exports = router;
