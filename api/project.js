const express = require('express');
const { fetchProjects, createProject, getAuthorInfo, getProjectLikeCount } = require('../dao/projectDAO');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const projects = await fetchProjects();

    const projectsData = await Promise.all(
      projects.map(async project => {
        const [authorInfo] = await getAuthorInfo(project.user_user_id);
        const [{ likeCount }] = await getProjectLikeCount(project.project_id);
        const { nickname, profile_photo } = authorInfo;
        return { ...project, nickname, profile_photo, likeCount };
      })
    );

    res.status(200).json({ responseMessage: 'success', projectsData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ responseMessage: 'failure', error });
  }
});

router.post('/', async (req, res) => {
  const result = await createProject(req.body);
  res.send(result);
});

module.exports = router;
