import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import productRoutes from './routes/productRoutes';

const app = express();
const PORT = process.env.PORT;

// Basic middleware for API testing
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/v1/admin/products', productRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
