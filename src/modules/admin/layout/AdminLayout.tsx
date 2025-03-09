import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';

const AdminLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen">
      <div className="w-64 border-r border-gray-200 dark:border-gray-700">
        <AdminSidebar />
      </div>
      <div className="flex-1 p-8">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;