import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNav from './TopNav';

type MainLayoutProps = {
  children?: React.ReactNode;
  showSidebar?: boolean;
  showTopNav?: boolean;
};

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  showSidebar = true,
  showTopNav = true,
}) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" data-name="MainLayout">
      {showTopNav && <TopNav />}
      
      <div className="flex flex-1 overflow-hidden">
        {showSidebar && <Sidebar />}
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6" data-name="MainContent">
          <div className="max-w-7xl mx-auto">
            {children || <Outlet />}
          </div>
        </main>
      </div>
      
      <footer className="bg-white border-t py-4 px-6" data-name="Footer">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-600 mb-2 md:mb-0" data-name="Copyright">
            {new Date().getFullYear()} Frontera Digital - Control Fronterizo
          </div>
          <div className="flex space-x-4" data-name="FooterLinks">
            <a href="#" className="text-sm text-gray-600 hover:text-primary">Términos y condiciones</a>
            <a href="#" className="text-sm text-gray-600 hover:text-primary">Política de privacidad</a>
            <a href="#" className="text-sm text-gray-600 hover:text-primary">Ayuda</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
