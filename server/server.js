/*
  Server entry point for SwarnaVeda
*/
require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const cartRoutes = require('./routes/cartRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { seedProductsIfNeeded, ensureAdminUser } = require('./seed');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/admin', adminRoutes);

// Serve frontend static files
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Always return index.html for SPA routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Server Error' });
});

const PORT = process.env.PORT || 5000;

// Start server after DB connect
connectDB()
  .then(async () => {
    // Seed database if empty
    await seedProductsIfNeeded();
    await ensureAdminUser();

    app.listen(PORT, () => {
      console.log(`SwarnaVeda server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });
