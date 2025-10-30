import express, { Application } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { connectDB } from './config/db';

// Import routes
import usersRouter from './routes/users';
import categoriesRouter from './routes/categories';
import productsRouter from './routes/products';
import ordersRouter from './routes/orders';
import dashboardRouter from './routes/dashboard';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(bodyParser.json());

// MongoDB Connection
connectDB();

// Routes
app.use('/api/users', usersRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/dashboard', dashboardRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});