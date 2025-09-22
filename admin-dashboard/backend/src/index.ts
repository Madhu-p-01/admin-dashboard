import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import productRoutes from './routes/productRoutes';
import customerRoutes from './routes/customerRoutes';
import discountRoutes from './routes/discountRoutes';
import orderRoutes from './routes/orderRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import teamRoutes from './routes/teamRoutes';
import notificationRoutes from './routes/notificationRoutes';

const app = express();
const PORT = process.env.PORT;

// Basic middleware for API testing
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/v1/admin/products', productRoutes);
app.use('/api/v1/admin/customers', customerRoutes);
app.use('/api/v1/admin/discounts', discountRoutes);
app.use('/api/v1/admin/orders', orderRoutes);
app.use('/api/v1/admin/analytics', analyticsRoutes);
app.use('/api/v1/admin/team', teamRoutes);
app.use('/api/v1/notifications', notificationRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
