const express = require('express');
const {
  createProject,
  getProject,
  getProjectTechStacks,
  getProjectLikeCount,
  getAuthorInfo,
  modifyProject,
  deleteProject,
} = require('../dao/projectDAO');

const router = express.Router();

router.get('/:project_id', async (req, res) => {
  const { project_id } = req.params;

  let projectPageData = null;

  try {
    const [projectData] = await getProject(project_id);
    const authorInfo = await getAuthorInfo(projectData.user_user_id);
    projectData.authorInfo = authorInfo;
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
  try {
    const result = await createProject(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ responseMessage: 'failure', responseData: null, error });
  }
});

router.patch('/:project_id', async (req, res) => {
  const { project_id } = req.params;

  try {
    const result = await modifyProject({ ...req.body, projectId: project_id });
    res.status(200).json({ responseMessage: 'success', responseData: result });
  } catch (error) {
    res.send({ responseMessage: 'failure', responseData: null, error });
  }
});

router.delete('/:project_id', async (req, res) => {
  const { project_id } = req.params;

  try {
    const result = await deleteProject(project_id);
    res.status(200).json({ responseMessage: 'success', responseData: result });
  } catch (error) {
    res.send({ responseMessage: 'failure', responseData: null, error });
  }
});

module.exports = router;
