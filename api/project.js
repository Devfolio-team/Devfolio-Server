const express = require('express');
const {
  createProject,
  getProject,
  getProjectTechStacks,
  getProjectLikeCount,
  getAuthorInfo,
  modifyProject,
  deleteProject,
  getProjectTeamMembers,
  getAuthorUniqueId,
} = require('../dao/projectDAO');
const jwtVerify = require('../utils/jwtVerify');

const router = express.Router();

router.get('/:project_id', async (req, res) => {
  const { project_id } = req.params;

  let projectPageData = null;

  try {
    const [projectData] = await getProject(project_id);
    const [authorInfo] = await getAuthorInfo(projectData.user_user_id);
    const teamMembers = await getProjectTeamMembers(project_id);
    projectData.authorInfo = authorInfo;
    projectData.teamMembers = teamMembers;
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

router.post('/', (req, res) => {
  jwtVerify(req, res, async ({ user_id: currentUserId }) => {
    if (currentUserId === req.body.userUserId) {
      const result = await createProject(req.body);
      res.status(201).json(result);
    } else {
      res.status(401).json({ responseMessage: 'Warning! Use only your own tokens' });
    }
  });
});

router.patch('/:project_id', (req, res) => {
  jwtVerify(req, res, async decoded => {
    const { user_id: currentUserId } = decoded;
    const { project_id } = req.params;

    const [{ user_user_id: authorId }] = await getAuthorUniqueId(project_id);

    if (currentUserId === authorId) {
      const result = await modifyProject({ ...req.body, projectId: project_id, currentUserId });
      res.status(200).json({ responseMessage: 'success', responseData: result });
    } else {
      res.status(401).json({ responseMessage: 'Warning! Use only your own tokens' });
    }
  });
});

router.delete('/:project_id', (req, res) => {
  jwtVerify(req, res, async decoded => {
    const { user_id: currentUserId } = decoded;
    const { project_id } = req.params;
    const [{ user_user_id: authorId }] = await getAuthorUniqueId(project_id);
    if (currentUserId === authorId) {
      const result = await deleteProject(project_id);
      res.status(200).json({ responseMessage: 'success', responseData: result });
    } else {
      res.status(401).json({ responseMessage: 'Warning! Use only your own tokens' });
    }
  });
});

module.exports = router;
