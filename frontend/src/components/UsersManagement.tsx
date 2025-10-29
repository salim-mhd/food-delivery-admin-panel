import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { User } from '../types/types';
import api from '../lib/axios';
import { alertSuccess, alertError, confirmDialog } from '../lib/alert';
import CommonTable, { TableColumn } from './common/CommonTable';

const UsersManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [formData, setFormData] = useState<Partial<User>>({ name: '', email: '', mobile: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = (): void => {
    api.get<User[]>('users')
      .then(res => setUsers(res.data))
      .catch(err => setError('Error fetching users'));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (editingId) {
      api.put(`users/${editingId}`, formData)
        .then(() => {
          setEditingId(null);
          setFormData({ name: '', email: '', mobile: '' });
          fetchUsers();
          alertSuccess('User updated');
        })
        .catch(err => { setError('Error updating user'); alertError('Update failed', 'Could not update user'); });
    } else {
      api.post('users', formData)
        .then(() => {
          setFormData({ name: '', email: '', mobile: '' });
          fetchUsers();
          alertSuccess('User added');
        })
        .catch(err => { setError('Error adding user'); alertError('Create failed', 'Could not add user'); });
    }
  };

  const handleEdit = useCallback((user: User): void => {
    setFormData(user);
    setEditingId(user._id);
  }, []);

  const handleDelete = useCallback(async (id: string): Promise<void> => {
    const ok = await confirmDialog('Delete user?', 'This action cannot be undone', 'Delete');
    if (!ok) return;
    api.delete(`users/${id}`)
      .then(() => { fetchUsers(); alertSuccess('User deleted'); })
      .catch(err => { setError('Error deleting user'); alertError('Delete failed', 'Could not delete user'); });
  }, []);

  const columns: Array<TableColumn<User>> = useMemo(() => ([
    { key: 'name', header: 'Name', className: 'font-medium text-gray-900' },
    { key: 'email', header: 'Email', className: 'text-gray-700' },
    { key: 'mobile', header: 'Mobile', className: 'text-gray-700' },
    {
      key: 'actions',
      header: 'Actions',
      render: (u) => (
        <div className="space-x-2">
          <button className="inline-flex items-center rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50" onClick={() => handleEdit(u)}>Edit</button>
          <button className="inline-flex items-center rounded-md bg-red-50 text-red-700 px-3 py-1.5 text-sm hover:bg-red-100" onClick={() => handleDelete(u._id)}>Delete</button>
        </div>
      )
    }
  ]), [handleEdit, handleDelete]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Users Management</h1>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-600">Name</label>
            <input className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" type="text" name="name" placeholder="Jane Cooper" value={formData.name || ''} onChange={handleInputChange} required />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-600">Email</label>
            <input className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" type="email" name="email" placeholder="jane@example.com" value={formData.email || ''} onChange={handleInputChange} required />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-600">Mobile</label>
            <input className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" type="text" name="mobile" placeholder="+1 555 0100" value={formData.mobile || ''} onChange={handleInputChange} required />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="submit" className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-white hover:bg-blue-600 transition-colors">{editingId ? 'Update' : 'Add'} User</button>
          {editingId && (
            <button type="button" className="inline-flex items-center rounded-md bg-white border border-gray-300 px-4 py-2 hover:bg-gray-50" onClick={() => { setEditingId(null); setFormData({ name: '', email: '', mobile: '' }); }}>Cancel</button>
          )}
        </div>
      </form>

      <CommonTable
        columns={columns}
        data={users}
        getRowKey={(row) => row._id}
        emptyMessage="No users found"
      />
    </div>
  );
};

export default UsersManagement;