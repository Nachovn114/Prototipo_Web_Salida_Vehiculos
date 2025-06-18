import React from 'react';
import { Layout, Menu } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  FileTextOutlined,
  CarOutlined,
  BarChartOutlined,
  SettingOutlined,
  UserOutlined
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

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
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        theme="light"
        breakpoint="lg"
        collapsedWidth="0"
        style={{
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        }}
      >
        <div className="p-4">
          <h1 className="text-xl font-bold text-blue-600">Control Fronterizo</h1>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout>
        <Header style={{ 
          background: '#fff', 
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
        }}>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Inspector</span>
            <UserOutlined className="text-xl" />
          </div>
        </Header>
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout; 