const express = require('express');
const { getProjectCommentCount } = require('../dao/commentDAO');
const {
  getProjectsFromSpecificUser,
  getSkillsFromSpecificUser,
  deleteSkillsFromSpecificUser,
  createSkillsToSpecificUser,
} = require('../dao/portfolioDAO');
const { getAuthorInfo, getProjectLikeCount } = require('../dao/projectDAO');
const { getUserInfo, updateUserInfo } = require('../dao/userDAO');

const router = express.Router();

router.get('/', async (req, res) => {
  let portfolioPageData = null;

  try {
    const [user] = await getUserInfo(req.query);
    portfolioPageData = { user };

    if (!user) {
      return res.status(400).json({
        responseMessage: 'failure',
        responseData: 'The user with the requested id does not exist.',
      });
    }

    try {
      const skills = await getSkillsFromSpecificUser(req.query);
      portfolioPageData = { ...portfolioPageData, skills };

      try {
        const projectsData = await getProjectsFromSpecificUser(req.query);

        const projects = await Promise.all(
          projectsData.map(async project => {
            const [authorInfo] = await getAuthorInfo(project.user_user_id);
            const [{ commentCount }] = await getProjectCommentCount(project.project_id);
            const [{ likeCount }] = await getProjectLikeCount(project.project_id);
            const { nickname, profile_photo } = authorInfo;
            return { ...project, nickname, profile_photo, likeCount, commentCount };
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

router.patch('/', async (req, res) => {
  const { user_id } = req.query;

  try {
    const updateResult = await updateUserInfo({ ...req.body, user_id });

    if (!updateResult.affectedRows) {
      res.status(400).json({
        responseMessage: 'failure',
        responseData: 'The user with the requested id does not exist.',
      });
      return;
    }

    try {
      const { serverStatus } = await deleteSkillsFromSpecificUser(req.query);

      if (serverStatus === 2) {
        try {
          await createSkillsToSpecificUser({ ...req.body, user_id });

          const [currentUser] = await getUserInfo(req.query);
          const currentUsersSkills = await getSkillsFromSpecificUser(req.query);

          return res.status(200).json({
            responseMessage: 'success',
            currentUser: { ...currentUser, currentUsersSkills },
          });
        } catch (error) {
          return res.status(500).json({ responseMessage: 'failure', responseData: error });
        }
      }
      return res.status(500).json({ responseMessage: 'failure' });
    } catch (error) {
      return res.status(500).json({ responseMessage: 'failure', responseData: error });
    }
  } catch (error) {
    return res.status(500).json({ responseMessage: 'failure', responseData: error });
  }
});

module.exports = router;
