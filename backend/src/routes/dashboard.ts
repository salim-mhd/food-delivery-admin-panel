import express, { Request, Response } from 'express';
import User from '../models/User';
import Product from '../models/Product';
import Order from '../models/Order';
import { DashboardSummary } from '../types/types';

const router = express.Router();

// GET /api/dashboard - Dashboard summary using aggregation
router.get('/', async (req: Request, res: Response) => {
  try {
    const totalUsers: number = await User.countDocuments();
    const totalProducts: number = await Product.countDocuments();
    const totalOrders: number = await Order.countDocuments();

    const totalRevenueAggregation = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' }
        }
      }
    ]);

    const totalRevenue: number = totalRevenueAggregation.length > 0 ? totalRevenueAggregation[0].totalRevenue : 0;

    const summary: DashboardSummary = {
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue
    };

    res.json(summary);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;