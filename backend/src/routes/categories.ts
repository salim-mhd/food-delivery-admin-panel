import express, { Request, Response } from 'express';
import Category from '../models/Category';
import { Category as CategoryType } from '../types/types';

const router = express.Router();

// GET /api/categories - List all categories
router.get('/', async (req: Request, res: Response) => {
  try {
    const categories: CategoryType[] = await Category.find();
    res.json(categories);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/categories - Add category
router.post('/', async (req: Request<{}, {}, CategoryType>, res: Response) => {
  const category = new Category(req.body);
  try {
    const newCategory: CategoryType & { _id: string } = await category.save();
    res.status(201).json(newCategory);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/categories/:id - Update category
router.put('/:id', async (req: Request<{ id: string }, {}, CategoryType>, res: Response) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/categories/:id - Delete category
router.delete('/:id', async (req: Request<{ id: string }>, res: Response) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Category deleted' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;