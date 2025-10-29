import express, { Request, Response } from 'express';
import User from '../models/User';
import { User as UserType } from '../types/types';

const router = express.Router();

// GET /api/users - List all users
router.get('/', async (req: Request, res: Response) => {
  try {
    const users: UserType[] = await User.find();
    res.json(users);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/users - Add user
router.post('/', async (req: Request<{}, {}, UserType>, res: Response) => {
  const user = new User(req.body);
  try {
    const newUser: UserType & { _id: string } = await user.save();
    res.status(201).json(newUser);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/users/:id - Update user
router.put('/:id', async (req: Request<{ id: string }, {}, UserType>, res: Response) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/users/:id - Delete user
router.delete('/:id', async (req: Request<{ id: string }>, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;