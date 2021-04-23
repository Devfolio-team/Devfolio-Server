const express = require('express');
const { getProjectsFromSpecificUser, getSkillsFromSpecificUser } = require('../dao/portfolioDAO');
const { getAuthorInfo, getProjectLikeCount } = require('../dao/projectDAO');
const { getUserInfo } = require('../dao/userDAO');

const router = express.Router();

router.get('/', async (req, res) => {
  let portfolioPageData = null;

  try {
    const [user] = await getUserInfo(req.query);
    portfolioPageData = { user };

    if (!user) {
      res.status(400).json({
        responseMessage: 'failure',
        responseData: 'The user with the requested id does not exist.',
      });
      return;
    }

    try {
      const skills = await getSkillsFromSpecificUser(req.query);
      portfolioPageData = { ...portfolioPageData, skills };

      try {
        const projectsData = await getProjectsFromSpecificUser(req.query);

        const projects = await Promise.all(
          projectsData.map(async project => {
            const [authorInfo] = await getAuthorInfo(project.user_user_id);
            const [{ likeCount }] = await getProjectLikeCount(project.project_id);
            const { nickname, profile_photo } = authorInfo;
            return { ...project, nickname, profile_photo, likeCount };
          })
        );

        portfolioPageData = { ...portfolioPageData, projects };

        res.status(200).json({
          responseMessage: 'success',
          responseData: portfolioPageData.user ? portfolioPageData : null,
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
