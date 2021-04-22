const express = require('express');
const { getProjectsFromSpecificUser, getSkillsFromSpecificUser } = require('../dao/portfolioDAO');
const { getUserInfo } = require('../dao/userDAO');

const router = express.Router();

router.get('/', async (req, res) => {
  let portfolioPageData = null;

  try {
    const [user] = await getUserInfo(req.query);
    portfolioPageData = { user };
    try {
      const skills = await getSkillsFromSpecificUser(req.query);
      portfolioPageData = { ...portfolioPageData, skills };

      try {
        const projects = await getProjectsFromSpecificUser(req.query);

        portfolioPageData = { ...portfolioPageData, projects };

        console.log(portfolioPageData);

        res.status(200).json({
          responseMessage: 'success',
          responseData:
            portfolioPageData.projects[0] && portfolioPageData.skills[0] && portfolioPageData.user
              ? portfolioPageData
              : null,
        });
      } catch (error) {
        res.status(500).json({ responseMessage: 'failure', responseData: error });
      }
    } catch (error) {
      res.status(500).json({ responseMessage: 'failure', responseData: error });
    }
  } catch (error) {
    res.status(500).json({ responseMessage: 'failure', responseData: error });
  }
});

module.exports = router;
