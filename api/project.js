const express = require('express');
const { fetchProjects, createProject, getAuthorInfo } = require('../dao/projectDAO');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const projects = await fetchProjects();

    const projectsData = await Promise.all(
      projects.map(async project => {
        const authorId = project.user_user_id;
        const [authorInfo] = await getAuthorInfo(authorId);
        const { nickname, profile_photo } = authorInfo;
        return { ...project, nickname, profile_photo };
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
