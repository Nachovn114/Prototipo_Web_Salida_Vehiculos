import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  FileTextOutlined,
  CarOutlined,
  BarChartOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { Header as CustomHeader } from './Header';
import { useNotifications } from '../hooks/useNotifications';
import { Bell, Globe, User, Moon, Sun, Menu, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NotificationPanel } from './NotificationPanel';

const menuItems = [
  {
    key: '/',
    icon: <DashboardOutlined />,
    label: 'Dashboard',
  },
  {
    key: '/inspecciones',
    icon: <CarOutlined />,
    label: 'Inspecciones',
  },
  {
    key: '/documentos',
    icon: <FileTextOutlined />,
    label: 'Documentos',
  },
  {
    key: '/reportes',
    icon: <BarChartOutlined />,
    label: 'Reportes',
  },
  {
    key: '/calidad',
    icon: <SettingOutlined />,
    label: 'Calidad',
  },
];

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [language, setLanguage] = React.useState('es');
  const [isDark, setIsDark] = React.useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });
  const notificationRef = React.useRef<HTMLDivElement>(null);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  React.useEffect(() => {
    if (!showNotifications) return;
    function handleClickOutside(event: MouseEvent) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);
  const toggleLanguage = () => setLanguage(prev => prev === 'es' ? 'en' : 'es');
  const toggleDarkMode = () => {
    setIsDark((prev) => {
      const newValue = !prev;
      if (newValue) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return newValue;
    });
  };
  // Obtener rol y nombre de usuario
  const userRole = localStorage.getItem('userRole') || 'inspector';
  const userName = {
    conductor: 'Conductor',
    inspector: 'Inspector García',
    aduanero: 'Aduanero Soto',
    admin: 'Administrador',
  }[userRole] || 'Usuario';
  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      {/* Sidebar responsive */}
      {/* Desktop/Tablet sidebar */}
      <aside className={`hidden md:flex flex-col w-64 min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-blue-700 shadow-xl px-4 py-8 gap-8 transition-transform duration-300 z-30`}>
        {/* Branding */}
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="bg-white/20 rounded-xl flex items-center justify-center shadow-md h-20 w-60">
            <img src="/assets/frontera-digital-logo.png" alt="Frontera Digital Logo" className="w-full h-full object-contain drop-shadow" />
          </div>
          <span className="text-white text-2xl font-extrabold tracking-widest ml-1">Frontera Digital</span>
        </div>
        {/* Menú principal */}
        <nav className="flex flex-col gap-2 mb-8">
          {menuItems.map((item) => (
            <button
              key={item.key}
              onClick={() => { navigate(item.key); setSidebarOpen(false); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold transition-all duration-200
                ${location.pathname === item.key ? 'bg-white text-blue-900 shadow-lg' : 'text-white hover:bg-white/10 hover:pl-6'}`}
            >
              <span className="flex items-center justify-center h-6 w-6">
                {item.icon}
              </span>
              <span className="tracking-wide">{item.label}</span>
            </button>
          ))}
        </nav>
        {/* Usuario y acciones rápidas */}
        <div className="mt-auto flex flex-col gap-4 px-2">
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-2xl px-4 py-3 shadow-inner border border-white/20">
            <User className="h-7 w-7 text-blue-100" />
            <div>
              <div className="text-white font-bold leading-tight text-base">{userName}</div>
              <div className="text-xs text-blue-200 opacity-80">{userRole.charAt(0).toUpperCase() + userRole.slice(1)}</div>
            </div>
          </div>
          {/* Separador */}
          <div className="border-t border-white/20 my-2" />
          {/* Acciones rápidas ordenadas */}
          <div className="flex flex-row items-center justify-center gap-4 pb-2">
            <div className="group relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleLanguage}
                className="text-white hover:bg-blue-800 hover:text-blue-200"
              >
                <Globe className="h-5 w-5" />
                <span className="sr-only">Idioma</span>
              </Button>
              <span className="absolute left-1/2 -translate-x-1/2 mt-2 px-2 py-1 rounded bg-blue-900 text-white text-xs opacity-0 group-hover:opacity-100 transition pointer-events-none z-50">Idioma</span>
            </div>
            <div className="group relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleDarkMode}
                className="text-white hover:bg-blue-800 hover:text-blue-200"
                aria-label="Alternar modo oscuro"
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              <span className="absolute left-1/2 -translate-x-1/2 mt-2 px-2 py-1 rounded bg-blue-900 text-white text-xs opacity-0 group-hover:opacity-100 transition pointer-events-none z-50">Tema</span>
            </div>
            <div className="group relative" ref={notificationRef}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setDrawerOpen(!drawerOpen)}
                className="text-white hover:bg-blue-800 hover:text-blue-200 relative"
                aria-label="Notificaciones"
              >
                <Bell className="h-5 w-5" />
                {notifications.length > 0 && (
                  <span className="absolute -top-2 -right-2 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse transition-all duration-300 shadow-md border-2 border-blue-900">{notifications.length}</span>
                )}
              </Button>
              <span className="absolute left-1/2 -translate-x-1/2 mt-2 px-2 py-1 rounded bg-blue-900 text-white text-xs opacity-0 group-hover:opacity-100 transition pointer-events-none z-50">Notificaciones</span>
            </div>
          </div>
        </div>
      </aside>
      {/* Mobile sidebar (drawer) */}
      <aside className={`fixed inset-0 z-40 flex md:hidden transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`} style={{ pointerEvents: sidebarOpen ? 'auto' : 'none' }}>
        <div className="w-64 min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-blue-700 shadow-xl px-4 py-8 gap-8 flex flex-col">
          {/* Branding */}
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="bg-white/20 rounded-xl flex items-center justify-center shadow-md h-40 w-40">
              <img src="/assets/frontera-digital-logo.png" alt="Frontera Digital Logo" className="w-full h-full object-contain drop-shadow" />
            </div>
            <span className="text-white text-2xl font-extrabold tracking-widest ml-1">Frontera Digital</span>
          </div>
          {/* Menú principal */}
          <nav className="flex flex-col gap-2 mb-8">
            {menuItems.map((item) => (
              <button
                key={item.key}
                onClick={() => { navigate(item.key); setSidebarOpen(false); }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold transition-all duration-200
                  ${location.pathname === item.key ? 'bg-white text-blue-900 shadow-lg' : 'text-white hover:bg-white/10 hover:pl-6'}`}
              >
                <span className="flex items-center justify-center h-6 w-6">
                  {item.icon}
                </span>
                <span className="tracking-wide">{item.label}</span>
              </button>
            ))}
          </nav>
          {/* Usuario y acciones rápidas */}
          <div className="mt-auto flex flex-col gap-4 px-2">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-2xl px-4 py-3 shadow-inner border border-white/20">
              <User className="h-7 w-7 text-blue-100" />
              <div>
                <div className="text-white font-bold leading-tight text-base">{userName}</div>
                <div className="text-xs text-blue-200 opacity-80">{userRole.charAt(0).toUpperCase() + userRole.slice(1)}</div>
              </div>
            </div>
            {/* Separador */}
            <div className="border-t border-white/20 my-2" />
            {/* Acciones rápidas ordenadas */}
            <div className="flex flex-row items-center justify-center gap-4 pb-2">
              <div className="group relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleLanguage}
                  className="text-white hover:bg-blue-800 hover:text-blue-200"
                >
                  <Globe className="h-5 w-5" />
                  <span className="sr-only">Idioma</span>
                </Button>
                <span className="absolute left-1/2 -translate-x-1/2 mt-2 px-2 py-1 rounded bg-blue-900 text-white text-xs opacity-0 group-hover:opacity-100 transition pointer-events-none z-50">Idioma</span>
              </div>
              <div className="group relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleDarkMode}
                  className="text-white hover:bg-blue-800 hover:text-blue-200"
                  aria-label="Alternar modo oscuro"
                >
                  {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>
                <span className="absolute left-1/2 -translate-x-1/2 mt-2 px-2 py-1 rounded bg-blue-900 text-white text-xs opacity-0 group-hover:opacity-100 transition pointer-events-none z-50">Tema</span>
              </div>
              <div className="group relative" ref={notificationRef}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDrawerOpen(!drawerOpen)}
                  className="text-white hover:bg-blue-800 hover:text-blue-200 relative"
                  aria-label="Notificaciones"
                >
                  <Bell className="h-5 w-5" />
                  {notifications.length > 0 && (
                    <span className="absolute -top-2 -right-2 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse transition-all duration-300 shadow-md border-2 border-blue-900">{notifications.length}</span>
                  )}
                </Button>
                <span className="absolute left-1/2 -translate-x-1/2 mt-2 px-2 py-1 rounded bg-blue-900 text-white text-xs opacity-0 group-hover:opacity-100 transition pointer-events-none z-50">Notificaciones</span>
              </div>
            </div>
          </div>
        </div>
        {/* Overlay para cerrar el drawer */}
        <div className="flex-1 bg-black bg-opacity-30" onClick={() => setSidebarOpen(false)} />
      </aside>
      {/* Botón menú hamburguesa en móvil */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden bg-blue-700 text-white p-2 rounded-lg shadow-lg hover:bg-blue-800 transition-all"
        onClick={() => setSidebarOpen(true)}
        aria-label="Abrir menú"
      >
        <Menu className="h-6 w-6" />
      </button>
      {/* Contenido principal */}
      <div className="flex-1 flex flex-col min-h-screen">
        <main className="flex-1 w-full max-w-7xl mx-auto px-2 md:px-8 py-6">
          <Outlet />
        </main>
        <footer className="w-full bg-blue-900 text-white text-center py-4 mt-8">
          <div className="container mx-auto flex flex-col items-center gap-2">
            <img src="/assets/frontera-digital-logo.png" alt="Frontera Digital Logo" className="h-8 w-8 inline-block mb-1" />
            <div className="font-semibold">Frontera Digital – Aduana Chile</div>
            <div className="flex gap-4 justify-center mt-1">
              <a href="/acerca" className="text-xs text-blue-200 hover:text-white underline transition">Acerca del sistema</a>
              <a href="/contacto" className="text-xs text-blue-200 hover:text-white underline transition">Contacto</a>
            </div>
            <div className="text-xs opacity-80 mt-1">© 2025 Sistema oficial de control de salida vehicular. Todos los derechos reservados.</div>
            <div className="text-xs text-blue-200 mt-1">Desarrollado por Ignacio Valeria (2025)</div>
          </div>
        </footer>
      </div>
      {/* Drawer de notificaciones lateral derecho */}
      {drawerOpen && (
        <>
          {/* Overlay */}
          <div className="fixed inset-0 z-50 bg-black/30" onClick={() => setDrawerOpen(false)} />
          {/* Drawer */}
          <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl border-l border-gray-200 z-50 animate-slide-in flex flex-col" style={{ minWidth: 340 }}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-blue-900">Notificaciones</h2>
              <button onClick={() => setDrawerOpen(false)} className="text-gray-400 hover:text-blue-600 text-2xl font-bold focus:outline-none">×</button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <NotificationPanel
                notifications={notifications}
                markAsRead={markAsRead}
                onClose={() => setDrawerOpen(false)}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MainLayout; 