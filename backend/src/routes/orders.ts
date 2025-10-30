import express, { Request, Response } from 'express';
import Order from '../models/Order';
import { Order as OrderType } from '../types/types';

const router = express.Router();

// GET /api/orders - List all orders
router.get('/', async (_req: Request, res: Response) => {
  try {
    const orders = await Order.find().lean();
    res.json(orders);
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Failed to fetch orders' });
  }
});

// POST /api/orders - Create new order
router.post('/', async (req: Request<{}, {}, OrderType>, res: Response) => {
  const order = new Order(req.body);
  try {
    const newOrder: OrderType & { _id: string } = await order.save();
    res.status(201).json(newOrder);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

export default router;