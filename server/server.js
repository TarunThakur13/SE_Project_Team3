/**
 * server.js - Express entry point for College Dispensary API
 * Connects to MongoDB, mounts all routes, serves static client files.
 */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files (bills, etc.) as static
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve the React/JSX frontend from /client
app.use(express.static(path.join(__dirname, '..', 'client')));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth',         require('./routes/auth'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/prescriptions',require('./routes/prescriptions'));
app.use('/api/pharmacy',     require('./routes/pharmacy'));
app.use('/api/inventory',    require('./routes/inventory'));
app.use('/api/admin',        require('./routes/admin'));

// ─── Catch-all: serve SPA index for any non-API route ─────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'index.html'));
});

// ─── MongoDB + Start ──────────────────────────────────────────────────────────
const PORT = process.env.PORT || 4000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅  MongoDB connected');
    app.listen(PORT, () =>
      console.log(`🚀  Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error('❌  MongoDB connection error:', err.message);
    process.exit(1);
  });
