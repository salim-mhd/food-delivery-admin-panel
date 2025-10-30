import React, { useEffect, useMemo } from 'react';
import { User, Product, Category, Order } from '../types/types';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchUsers } from '../store/slices/usersSlice';
import { fetchProducts } from '../store/slices/productsSlice';
import { fetchCategories } from '../store/slices/categoriesSlice';
import { fetchOrders } from '../store/slices/ordersSlice';
import { fetchDashboard } from '../store/slices/dashboardSlice';
import CommonTable, { TableColumn } from './common/CommonTable';

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items: users } = useAppSelector(s => s.users);
  const { items: products } = useAppSelector(s => s.products);
  const { items: categories } = useAppSelector(s => s.categories);
  const { items: orders } = useAppSelector(s => s.orders);
  const { summary: data } = useAppSelector(s => s.dashboard);

  useEffect(() => {
    dispatch(fetchDashboard());
    dispatch(fetchUsers());
    dispatch(fetchProducts());
    dispatch(fetchCategories());
    dispatch(fetchOrders());
  }, [dispatch]);

  const userCols: Array<TableColumn<User>> = useMemo(() => ([
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'mobile', header: 'Mobile' },
  ]), []);

  const categoryCols: Array<TableColumn<Category>> = useMemo(() => ([
    { key: 'name', header: 'Name' },
    { key: 'description', header: 'Description' },
  ]), []);

  const productCols: Array<TableColumn<Product>> = useMemo(() => ([
    { key: 'name', header: 'Name' },
    {
      key: 'category',
      header: 'Category',
      accessor: (p) => {
        const raw = (p as unknown as { categoryId: unknown }).categoryId;
        if (raw && typeof raw === 'object' && 'name' in (raw as Record<string, unknown>)) {
          const nameVal = (raw as { name?: unknown }).name;
          return typeof nameVal === 'string' ? nameVal : String(nameVal ?? '');
        }
        if (typeof raw === 'string') {
          const match = categories.find(c => c._id === raw);
          return match ? match.name : raw;
        }
        return '';
      }
    },
    { key: 'price', header: 'Price', accessor: (p) => `$${p.price ?? 0}` },
    { key: 'status', header: 'Status' },
  ]), [categories]);

  const orderCols: Array<TableColumn<Order>> = useMemo(() => ([
    { key: 'id', header: 'Order #', accessor: (o) => o._id },
    { key: 'user', header: 'User', accessor: (o) => users.find(u => u._id === o.userId)?.name ?? o.userId },
    { key: 'items', header: 'Items', accessor: (o) => o.items.length },
    { key: 'total', header: 'Total', accessor: (o) => `$${o.totalAmount.toFixed(2)}` },
  ]), [users]);

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
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold tracking-tight mb-2">Recent Users</h2>
          <CommonTable<User>
            columns={userCols}
            data={users}
            getRowKey={(r) => r._id}
            page={1}
            pageSize={5}
          />
        </div>
        <div>
          <h2 className="text-lg font-semibold tracking-tight mb-2">Recent Categories</h2>
          <CommonTable<Category>
            columns={categoryCols}
            data={categories}
            getRowKey={(r) => r._id}
            page={1}
            pageSize={5}
          />
        </div>
        <div>
          <h2 className="text-lg font-semibold tracking-tight mb-2">Recent Products</h2>
          <CommonTable<Product>
            columns={productCols}
            data={products}
            getRowKey={(r) => r._id}
            page={1}
            pageSize={5}
          />
        </div>
        <div>
          <h2 className="text-lg font-semibold tracking-tight mb-2">Recent Orders</h2>
          <CommonTable<Order>
            columns={orderCols}
            data={orders}
            getRowKey={(r) => r._id}
            page={1}
            pageSize={5}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;