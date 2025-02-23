import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex h-[calc(100vh-4rem)]">
        <Sidebar isCollapsed={isCollapsed} toggleCollapsed={(c) => setIsCollapsed(c)} />

        <div className={`flex-1 ${isCollapsed ? 'ml-16' : 'ml-64'} transition-all duration-300 relative`}>
          <main className="h-full overflow-y-auto">
            <div className="py-6 px-4 sm:px-6 lg:px-8">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Layout;