import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  FileTextOutlined,
  CarOutlined,
  BarChartOutlined,
  SettingOutlined,
  UserOutlined
} from '@ant-design/icons';
import { Header as CustomHeader } from './Header';
import { useNotifications } from '../hooks/useNotifications';

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { notifications, unreadCount, markAsRead } = useNotifications();

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/validacion',
      icon: <FileTextOutlined />,
      label: 'Validación Documental',
    },
    {
      key: '/revision-carga',
      icon: <CarOutlined />,
      label: 'Revisión de Carga',
    },
    {
      key: '/reportes',
      icon: <BarChartOutlined />,
      label: 'Reportes',
    },
    {
      key: '/calidad',
      icon: <SettingOutlined />,
      label: 'Calidad del Sistema',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      <CustomHeader
        unreadCount={unreadCount}
        notifications={notifications}
        markAsRead={markAsRead}
      />
      <main className="flex-1 w-full max-w-7xl mx-auto px-2 md:px-8 py-6">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout; 