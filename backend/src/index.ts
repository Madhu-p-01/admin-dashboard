import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import productRoutes from './routes/productRoutes';
import customerRoutes from './routes/customerRoutes';
import discountRoutes from './routes/discountRoutes';
import contentRoutes from './routes/contentRoutes';
import orderRoutes from './routes/orderRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import teamRoutes from './routes/teamRoutes';
import notificationRoutes from './routes/notificationRoutes';
import authRoutes from './routes/authRoutes';
import imageRoutes from './routes/imageRoutes';
import { securityMiddleware, auditLogger } from './middleware/security';

const app = express();
const PORT = process.env.PORT;

// CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Apply security middleware (temporarily disabled for debugging)
// app.use(securityMiddleware);

// Audit logging for admin actions
app.use(auditLogger);

// Parse JSON with size limit
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Public routes (no authentication required)
app.use('/api/v1/auth', authRoutes);

// Protected admin routes (authentication temporarily disabled for debugging)
// app.use('/api/v1/admin/products', verifyJWT, productRoutes);
// app.use('/api/v1/admin/customers', verifyJWT, customerRoutes);
// app.use('/api/v1/admin/discounts', verifyJWT, discountRoutes);
// app.use('/api/v1/admin/orders', verifyJWT, orderRoutes);
// app.use('/api/v1/admin/analytics', verifyJWT, analyticsRoutes);
// app.use('/api/v1/admin/team', verifyJWT, teamRoutes);
// app.use('/api/v1/notifications', verifyJWT, notificationRoutes);

// Temporary: Routes without authentication for debugging
app.use('/api/v1/admin/products', productRoutes);
app.use('/api/v1/admin/customers', customerRoutes);
app.use('/api/v1/admin/discounts', discountRoutes);
app.use('/api/v1/admin/content', contentRoutes);
app.use('/api/v1/admin/orders', orderRoutes);
app.use('/api/v1/admin/analytics', analyticsRoutes);
app.use('/api/v1/admin/team', teamRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/images', imageRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
