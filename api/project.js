const express = require('express');
const { createProject, getProject } = require('../dao/projectDAO');

const router = express.Router();

router.get('/:project_id', async (req, res) => {
  const { project_id } = req.params;
  try {
    const [projectData] = await getProject(project_id);

    res.status(200).json({ responseMessage: 'success', responseData: projectData || null });
  } catch (error) {
    res.status(500).json({ responseMessage: 'failure', responseData: null });
  }
});

router.post('/', async (req, res) => {
  const result = await createProject(req.body);
  res.send(result);
});

module.exports = router;
