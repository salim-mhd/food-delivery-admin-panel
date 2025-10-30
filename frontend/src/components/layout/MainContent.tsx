import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from '../../components/Dashboard';
import UsersManagement from '../../components/UsersManagement';
import CategoriesManagement from '../../components/CategoriesManagement';
import ProductsManagement from '../../components/ProductsManagement';
import OrderCreation from '../../components/OrderCreation';

const MainContent: React.FC = () => {
  return (
    <main className="admin-main">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/users" element={<UsersManagement />} />
        <Route path="/categories" element={<CategoriesManagement />} />
        <Route path="/products" element={<ProductsManagement />} />
        <Route path="/orders" element={<OrderCreation />} />
      </Routes>
    </main>
  );
};

export default MainContent;


