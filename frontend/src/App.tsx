import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import UsersManagement from './components/UsersManagement';
import CategoriesManagement from './components/CategoriesManagement';
import ProductsManagement from './components/ProductsManagement';
import OrderCreation from './components/OrderCreation';
import './index.css';

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex">
        <nav className="admin-nav">
          <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
          <ul className="space-y-4">
            <li><Link to="/" className="block py-2 px-2 rounded hover:bg-gray-200">Dashboard</Link></li>
            <li><Link to="/users" className="block py-2 px-2 rounded hover:bg-gray-200">Users Management</Link></li>
            <li><Link to="/categories" className="block py-2 px-2 rounded hover:bg-gray-200">Category Management</Link></li>
            <li><Link to="/products" className="block py-2 px-2 rounded hover:bg-gray-200">Product Management</Link></li>
            <li><Link to="/orders" className="block py-2 px-2 rounded hover:bg-gray-200">Order Creation</Link></li>
          </ul>
        </nav>
        <main className="admin-main">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/users" element={<UsersManagement />} />
            <Route path="/categories" element={<CategoriesManagement />} />
            <Route path="/products" element={<ProductsManagement />} />
            <Route path="/orders" element={<OrderCreation />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;