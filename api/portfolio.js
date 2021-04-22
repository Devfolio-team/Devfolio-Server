const express = require('express');
const { getProjectsFromSpecificUser, getSkillsFromSpecificUser } = require('../dao/portfolioDAO');

const router = express.Router();

router.get('/', async (req, res) => {
  let portfolioPageData = null;

  try {
    const projectData = await getProjectsFromSpecificUser(req.query);
    portfolioPageData = { projectData };
    try {
      const skillsData = await getSkillsFromSpecificUser(req.query);
      portfolioPageData = { ...portfolioPageData, skillsData };
      res.status(200).json({
        responseMessage: 'success',
        responseData:
          portfolioPageData.projectData[0] && portfolioPageData.skillsData[0] ? portfolioPageData : null,
      });
    } catch (error) {
      res.status(500).json({ responseMessage: 'failure', responseData: error });
    }
  } catch (error) {
    res.status(500).json({ responseMessage: 'failure', responseData: error });
  }
});

module.exports = router;
