import React, { useEffect, useState } from 'react';
import { DashboardSummary } from '../types/types';
import api from '../lib/axios';

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardSummary>({ totalUsers: 0, totalProducts: 0, totalOrders: 0, totalRevenue: 0 });

  useEffect(() => {
    api.get('/dashboard').then(res => setData(res.data)).catch(err => console.error(err));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard Summary</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="admin-card">
          <h3 className="text-lg font-semibold text-gray-600">Total Users</h3>
          <p className="text-3xl font-bold text-primary mt-2">{data.totalUsers}</p>
        </div>
        <div className="admin-card">
          <h3 className="text-lg font-semibold text-gray-600">Total Products</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">{data.totalProducts}</p>
        </div>
        <div className="admin-card">
          <h3 className="text-lg font-semibold text-gray-600">Total Orders</h3>
          <p className="text-3xl font-bold text-purple-600 mt-2">{data.totalOrders}</p>
        </div>
        <div className="admin-card">
          <h3 className="text-lg font-semibold text-gray-600">Total Revenue</h3>
          <p className="text-3xl font-bold text-indigo-600 mt-2">${data.totalRevenue.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;