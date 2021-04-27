const express = require('express');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const githubAuthConfig = require('../.config/githubAuth');
const googleAuthConfig = require('../.config/googleAuth');
const {
  checkExistedUser,
  signupGoogle,
  signupGithub,
  getUserInfo,
  deleteUserInfo,
} = require('../dao/userDAO');
const { getSkillsFromSpecificUser } = require('../dao/portfolioDAO');
const { secretKey } = require('../.config/jwt');
const { options } = require('../.config/jwt');
const cookieOptions = require('../.config/cookie');
const APPLICATION_URL = require('../.config/url');

const app = express();

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(
  new GoogleStrategy(googleAuthConfig, async (accessToken, refreshToken, profile, cb) => {
    const { sub, email } = profile._json;
    const [currentUser] = await checkExistedUser(sub + email);

    if (currentUser) return cb(null, { isExisted: true, currentUser });

    return cb(null, { isExisted: false, profile });
  })
);

app.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: `${APPLICATION_URL}/signin_error` }),
  async (req, res) => {
    if (req.user.isExisted) {
      const { user_id, name, email } = req.user.currentUser;
      const token = jwt.sign({ user_id, email, name, type: 'google' }, secretKey, options);
      res.cookie('auth_token', token, cookieOptions);
    } else {
      const { name, picture, email, sub } = req.user.profile._json;

      const profile_photo = picture.replace('s96-c', 's350-c');

      const signupResult = await signupGoogle({ email, sub, name, profile_photo });
      if (signupResult.affectedRows) {
        const user_id = signupResult.insertId;
        const token = jwt.sign({ user_id, email, name, type: 'google' }, secretKey, options);
        res.cookie('auth_token', token, cookieOptions);
      } else {
        return res.redirect(`${APPLICATION_URL}/signup_error`);
      }
    }
    res.redirect(`${APPLICATION_URL}/sign_in`);
  }
);

passport.use(
  new GitHubStrategy(githubAuthConfig, async (accessToken, refreshToken, profile, cb) => {
    const { node_id, id } = profile._json;
    const [currentUser] = await checkExistedUser(node_id + id);
    if (currentUser) return cb(null, { isExisted: true, currentUser });
    return cb(null, { isExisted: false, profile });
  })
);

app.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

app.get(
  '/github/callback',
  passport.authenticate('github', {
    failureRedirect: `${APPLICATION_URL}/signin_error`,
  }),
  async (req, res) => {
    if (req.user.isExisted) {
      const { user_id, name } = req.user.currentUser;
      const token = jwt.sign({ user_id, name, type: 'github' }, secretKey, options);

      res.cookie('auth_token', token, cookieOptions);
    } else {
      const {
        login: name,
        avatar_url: profile_photo,
        html_url: github_url,
        name: nickname,
        node_id,
        id,
      } = req.user.profile._json;

      const signupResult = await signupGithub({
        name,
        profile_photo,
        github_url,
        nickname: nickname || name,
        unique_id: node_id + id,
      });

      if (signupResult.affectedRows) {
        const user_id = signupResult.insertId;
        const token = jwt.sign({ user_id, name, type: 'github' }, secretKey, options);

        res.cookie('auth_token', token, cookieOptions);
      } else {
        return res.redirect(`${APPLICATION_URL}/signup_error`);
      }
    }
    res.redirect(`${APPLICATION_URL}/sign_in`);
  }
);

app.post('/signin', (req, res) => {
  const { authentication } = req.body;
  jwt.verify(authentication, secretKey, async (err, decoded) => {
    try {
      const [currentUser] = await getUserInfo(decoded);

      const currentUsersSkills = await getSkillsFromSpecificUser(decoded);

      res
        .status(200)
        .json({ responseMessage: 'success', currentUser: { ...currentUser, currentUsersSkills } });
    } catch (error) {
      res.status(500).json({ responseMessage: 'failure', error });
    }
  });
});

app.delete('/:user_id', async (req, res) => {
  try {
    const currentUser = await deleteUserInfo(req.params);

    return res.status(200).json({ responseMessage: 'success', currentUser });
  } catch (error) {
    return res.status(500).json({ responseMessage: 'failure', error });
  }
});

module.exports = app;
