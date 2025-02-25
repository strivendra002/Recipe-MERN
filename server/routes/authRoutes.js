import express from 'express';
import passport from 'passport';
import { ensureAuth } from '../middleware/auth.js'; // Import middleware

const router = express.Router();

// 🟢 Initiate Google OAuth Login
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// 🟢 Google OAuth Callback
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect(process.env.FRONTEND_URL); // Redirect user to frontend
  }
);

// 🟢 Logout User
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy((err) => {
      if (err) return res.status(500).json({ message: 'Logout failed' });
      res.clearCookie('connect.sid');
      res.json({ message: 'Logged out successfully' });
    });
  });
});

// 🟢 Get Current Authenticated User
router.get('/user', ensureAuth, (req, res) => {
  console.log('Session:', req.session);
  console.log('User:', req.user);

  if (req.isAuthenticated()) {
    return res.json(req.user);
  } else {
    return res.status(401).json({ message: 'Not logged in' });
  }
});

export default router;
