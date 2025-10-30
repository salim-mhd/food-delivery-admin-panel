import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AdminSidebar from './components/layout/AdminSidebar';
import MainContent from './components/layout/MainContent';
import './index.css';

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex">
        <AdminSidebar />
        <MainContent />
      </div>
    </Router>
  );
};

export default App;