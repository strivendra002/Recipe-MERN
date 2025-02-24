import express from 'express';
import session from 'express-session';
import cors from 'cors';
import passport from 'passport';
import './config/passport.js'; // Ensure passport strategies are loaded
import authRoutes from './routes/authRoutes.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// 🟢 Fix CORS
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🟢 Configure Express Sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true, sameSite: 'lax' },
  })
);

// 🟢 Initialize Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// 🟢 Fix Route Registration: Use `/auth`, not `/api/auth`
app.use('/auth', authRoutes); // Ensure `/auth` is used, not `/api/auth`
import favoritesRoutes from './routes/favoritesRoutes.js';

app.use('/api/favorites', favoritesRoutes);

import userRoutes from './routes/userRoutes.js';

app.use('/api/user', userRoutes);

import recipeRoutes from './routes/recipeRoutes.js';
app.use('/api/recipes', recipeRoutes);
// import cors from "cors";
// app.use(cors({ origin: "*" })); // Allow frontend access


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.log('❌ MongoDB Connection Error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
app.use(express.static("public"));

