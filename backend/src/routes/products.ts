import express, { Request, Response } from 'express';
import Product from '../models/Product';
import { Product as ProductType } from '../types/types';

const router = express.Router();

// GET /api/products - List all products (populate category)
router.get('/', async (req: Request, res: Response) => {
  try {
    const products: (ProductType & { categoryId: { name: string; description: string } })[] = await Product.find().populate('categoryId', 'name description');
    res.json(products);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/products - Add product
router.post('/', async (req: Request<{}, {}, ProductType>, res: Response) => {
  const product = new Product(req.body);
  try {
    const newProduct = await product.save();
    const populatedProduct = await Product.findById(newProduct._id).populate('categoryId', 'name description');
    if (!populatedProduct) {
      return res.status(500).json({ message: 'Failed to retrieve created product' });
    }
    res.status(201).json(populatedProduct);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/products/:id - Update product
router.put('/:id', async (req: Request<{ id: string }, {}, ProductType>, res: Response) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    const populatedProduct = await Product.findById(product._id).populate('categoryId', 'name description');
    if (!populatedProduct) {
      return res.status(500).json({ message: 'Failed to retrieve updated product' });
    }
    res.json(populatedProduct);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/products/:id - Delete product
router.delete('/:id', async (req: Request<{ id: string }>, res: Response) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;