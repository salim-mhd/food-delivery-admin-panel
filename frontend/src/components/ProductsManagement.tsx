import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Product, Category } from '../types/types';
import api from '../lib/axios';
import { alertSuccess, alertError, confirmDialog } from '../lib/alert';
import CommonTable, { TableColumn } from './common/CommonTable';

type ProductWithCategory = Omit<Product, 'categoryId'> & { categoryId: string | Category };

const ProductsManagement: React.FC = () => {
  const [products, setProducts] = useState<ProductWithCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState<Partial<Product>>({ name: '', categoryId: '', price: null, status: 'active' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = (): void => {
    api.get<ProductWithCategory[]>('products')
      .then(res => setProducts(res.data))
      .catch(err => setError('Error fetching products'));
  };

  const fetchCategories = (): void => {
    api.get<Category[]>('categories')
      .then(res => setCategories(res.data))
      .catch(err => setError('Error fetching categories'));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (editingId) {
      api.put(`products/${editingId}`, formData)
        .then(() => {
          setEditingId(null);
          setFormData({ name: '', categoryId: '', price: null, status: 'active' });
          fetchProducts();
          alertSuccess('Product updated');
        })
        .catch(err => { setError('Error updating product'); alertError('Update failed', 'Could not update product'); });
    } else {
      api.post('products', formData)
        .then(() => {
          setFormData({ name: '', categoryId: '', price: null, status: 'active' });
          fetchProducts();
          alertSuccess('Product added');
        })
        .catch(err => { setError('Error adding product'); alertError('Create failed', 'Could not add product'); });
    }
  };

  const handleEdit = useCallback((product: ProductWithCategory): void => {
    const cat = product.categoryId;
    const categoryIdString = typeof cat === 'object' && cat !== null ? cat._id : cat;
    setFormData({ ...product, categoryId: categoryIdString });
    setEditingId(product._id);
  }, []);

  const handleDelete = useCallback(async (id: string): Promise<void> => {
    const ok = await confirmDialog('Delete product?', 'This action cannot be undone', 'Delete');
    if (!ok) return;
    api.delete(`products/${id}`)
      .then(() => {
        setProducts(prev => prev.filter(p => p._id !== id));
        alertSuccess('Product deleted');
      })
      .catch(err => { setError('Error deleting product'); alertError('Delete failed', 'Could not delete product'); });
  }, []);

  const columns: Array<TableColumn<ProductWithCategory>> = useMemo(() => ([
    { key: 'name', header: 'Name' },
    {
      key: 'category',
      header: 'Category',
      accessor: (p) => typeof p.categoryId === 'object' && p.categoryId !== null ? p.categoryId.name : (categories.find(c => c._id === p.categoryId)?.name ?? p.categoryId)
    },
    { key: 'price', header: 'Price', accessor: (p) => `$${p.price ?? 0}` },
    { key: 'status', header: 'Status', accessor: (p) => p.status },
    {
      key: 'actions',
      header: 'Actions',
      render: (p) => (
        <div className="space-x-2">
          <button className="inline-flex items-center rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50" onClick={() => handleEdit(p)}>Edit</button>
          <button className="inline-flex items-center rounded-md bg-red-50 text-red-700 px-3 py-1.5 text-sm hover:bg-red-100" onClick={() => handleDelete(p._id)}>Delete</button>
        </div>
      )
    }
  ]), [categories, handleEdit, handleDelete]);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold tracking-tight">Product Management</h1>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <input className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900" type="text" name="name" placeholder="Name" value={formData.name || ''} onChange={handleInputChange} required />
          <select className="w-full rounded-md border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900" name="categoryId" value={formData.categoryId || ''} onChange={handleInputChange} required>
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
          <input className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900" type="number" name="price" placeholder="Price" value={formData.price || ''} onChange={handleInputChange} required />
          <select className="w-full rounded-md border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900" name="status" value={formData.status || 'active'} onChange={handleInputChange}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div className="flex gap-2">
          <button type="submit" className="inline-flex items-center rounded-md bg-gray-900 px-4 py-2 text-white hover:bg-gray-800">{editingId ? 'Update' : 'Add'} Product</button>
          {editingId && (
            <button type="button" className="inline-flex items-center rounded-md bg-white border border-gray-300 px-4 py-2 hover:bg-gray-50" onClick={() => { setEditingId(null); setFormData({ name: '', categoryId: '', price: null, status: 'active' }); }}>Cancel</button>
          )}
        </div>
      </form>
      <CommonTable<ProductWithCategory>
        columns={columns}
        data={products}
        getRowKey={(row) => row._id}
        emptyMessage="No products found"
      />
    </div>
  );
};

export default ProductsManagement;