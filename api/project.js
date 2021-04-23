const express = require('express');
const { createProject, getProject, getProjectTechStacks, getProjectLikeCount } = require('../dao/projectDAO');

const router = express.Router();

router.get('/:project_id', async (req, res) => {
  const { project_id } = req.params;

  let projectPageData = null;

  try {
    const [projectData] = await getProject(project_id);
    const [projectLikeCount] = await getProjectLikeCount(project_id);
    projectData.likeCount = projectLikeCount.likeCount;
    projectPageData = { projectData };
    try {
      const projectTechStacks = await getProjectTechStacks(project_id);
      projectPageData = { ...projectPageData, projectTechStacks };
      res.status(200).json({
        responseMessage: 'success',
        responseData: projectPageData.projectData ? projectPageData : null,
      });
    } catch (error) {
      res.status(500).json({ responseMessage: 'failure', responseData: null });
    }
  } catch (error) {
    res.status(500).json({ responseMessage: 'failure', responseData: null });
  }
});

router.post('/', async (req, res) => {
  const result = await createProject(req.body);
  res.send(result);
});

module.exports = router;
