const express = require('express');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const githubAuthConfig = require('../.config/githubAuth');
const googleAuthConfig = require('../.config/googleAuth');
const { checkExistedUser, signupGoogle, signupGithub, signIn } = require('../dao/userDAO');
const { secretKey } = require('../.config/jwt');
const { options } = require('../.config/jwt');
const cookieOptions = require('../.config/cookie');

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
    const [currentUser] = await checkExistedUser(profile._json);

    if (currentUser) return cb(null, { isExisted: true, currentUser });

    return cb(null, { isExisted: false, profile });
  })
);

app.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: 'http://localhost:3000/signin_error' }),
  async (req, res) => {
    if (req.user.isExisted) {
      const { user_id, name, email } = req.user.currentUser;
      const token = jwt.sign({ user_id, email, name, type: 'google' }, secretKey, options);
      res.cookie('auth_token', token, cookieOptions);
    } else {
      const { name, picture: profile_photo, email } = req.user.profile._json;
      const signupResult = await signupGoogle({ email, name, profile_photo });
      if (signupResult.affectedRows) {
        const user_id = signupResult.insertId;
        const token = jwt.sign({ user_id, email, name, type: 'google' }, secretKey, options);
        res.cookie('auth_token', token, cookieOptions);
      } else {
        return res.redirect('http://localhost:3000/signup_error');
      }
    }
    res.redirect('http://localhost:3000/sign_in');
  }
);

passport.use(
  new GitHubStrategy(githubAuthConfig, async (accessToken, refreshToken, profile, cb) => {
    // Github는 email을 고유한 아이디로 사용하지 않기 때문에 node_id를 애플리케이션의 id인 email값으로 사용
    const [currentUser] = await checkExistedUser({ email: profile._json.node_id });
    if (currentUser) return cb(null, { isExisted: true, currentUser });
    return cb(null, { isExisted: false, profile });
  })
);

app.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

app.get(
  '/github/callback',
  passport.authenticate('github', {
    failureRedirect: 'http://localhost:3000/signin_error',
  }),
  async (req, res) => {
    if (req.user.isExisted) {
      const { user_id, name } = req.user.currentUser;
      const token = jwt.sign({ user_id, name, type: 'github' }, secretKey, options);

      res.cookie('auth_token', token, cookieOptions);
    } else {
      const { login: name, avatar_url: profile_photo, html_url: github_url } = req.user.profile._json;

      const signupResult = await signupGithub({ name, profile_photo, github_url });

      if (signupResult.affectedRows) {
        const user_id = signupResult.insertId;
        const token = jwt.sign({ user_id, name, type: 'github' }, secretKey, options);

        res.cookie('auth_token', token, cookieOptions);
      } else {
        return res.redirect('http://localhost:3000/signup_error');
      }
    }
    res.redirect('http://localhost:3000/sign_in');
  }
);

app.post('/signin', (req, res) => {
  const { authentication } = req.body;
  jwt.verify(authentication, secretKey, async (err, decoded) => {
    try {
      const [currentUser] = await signIn(decoded);
      console.log({ responseMessage: 'success', currentUser });
      res.status(200).json({ responseMessage: 'success', currentUser });
    } catch (error) {
      res.status(500).json({ responseMessage: 'failure', error });
    }
  });
});

module.exports = app;
