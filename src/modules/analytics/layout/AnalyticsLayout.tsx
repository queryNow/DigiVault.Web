import React from 'react';
import { Outlet } from 'react-router-dom';

const AnalyticsLayout: React.FC = () => {
  return (
    <div className="p-8">
      <Outlet />
    </div>
  );
};

export default AnalyticsLayout;