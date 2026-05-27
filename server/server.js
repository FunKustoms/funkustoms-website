import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db, adminApp } from './config/firebase.js';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import customizationRoutes from './routes/customizations.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));

console.log(`✓ Firebase initialized for project: ${adminApp.options.projectId}`);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/customizations', customizationRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✓ Server running on port ${PORT}`);
});
