import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Category } from '../types/types';
import { alertSuccess, alertError, confirmDialog } from '../lib/alert';
import CommonTable, { TableColumn } from './common/CommonTable';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchCategories, createCategory, updateCategory, deleteCategory } from '../store/slices/categoriesSlice';

const CategoriesManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items: categories, loading, error } = useAppSelector(s => s.categories);
  const [formData, setFormData] = useState<Partial<Category>>({ name: '', description: '' });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (editingId) {
      dispatch(updateCategory({ id: editingId, data: formData }))
        .then(() => {
          setEditingId(null);
          setFormData({ name: '', description: '' });
          alertSuccess('Category updated');
        })
        .catch(() => { alertError('Update failed', 'Could not update category'); });
    } else {
      dispatch(createCategory(formData))
        .then(() => {
          setFormData({ name: '', description: '' });
          alertSuccess('Category added');
        })
        .catch(() => { alertError('Create failed', 'Could not add category'); });
    }
  };

  const handleEdit = useCallback((category: Category): void => {
    setFormData(category);
    setEditingId(category._id);
  }, []);

  const handleDelete = useCallback(async (id: string): Promise<void> => {
    const ok = await confirmDialog('Delete category?', 'This action cannot be undone', 'Delete');
    if (!ok) return;
    dispatch(deleteCategory(id))
      .then(() => { alertSuccess('Category deleted'); })
      .catch(() => { alertError('Delete failed', 'Could not delete category'); });
  }, [dispatch]);

  const columns: Array<TableColumn<Category>> = useMemo(() => ([
    { key: 'name', header: 'Name', className: 'font-medium text-gray-900', accessor: (c) => c.name },
    { key: 'description', header: 'Description', className: 'text-gray-700', accessor: (c) => c.description },
    {
      key: 'actions',
      header: 'Actions',
      render: (c) => (
        <div className="flex gap-2">
          <button className="inline-flex items-center rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50" onClick={() => handleEdit(c)}>Edit</button>
          <button className="inline-flex items-center rounded-md bg-red-50 text-red-700 px-3 py-1.5 text-sm hover:bg-red-100" onClick={() => handleDelete(c._id)}>Delete</button>
        </div>
      )
    }
  ]), [handleEdit, handleDelete]);
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Category Management</h1>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-600">Name</label>
            <input className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" type="text" name="name" placeholder="Burgers" value={formData.name || ''} onChange={handleInputChange} required />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-600">Description</label>
            <input className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" type="text" name="description" placeholder="Juicy grilled burgers" value={formData.description || ''} onChange={handleInputChange} required />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="submit" className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-white hover:bg-blue-600 transition-colors">{editingId ? 'Update' : 'Add'} Category</button>
          {editingId && (
            <button type="button" className="inline-flex items-center rounded-md bg-white border border-gray-300 px-4 py-2 hover:bg-gray-50" onClick={() => { setEditingId(null); setFormData({ name: '', description: '' }); }}>Cancel</button>
          )}
        </div>
      </form>
      <CommonTable<Category>
        columns={columns}
        data={categories}
        getRowKey={(row) => row._id}
        emptyMessage="No categories found"
        isLoading={loading}
      />
    </div>
  );
};

export default CategoriesManagement;