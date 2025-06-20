import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  FileTextOutlined,
  CarOutlined,
  BarChartOutlined,
  SettingOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';
import { Header as CustomHeader } from './Header';
import { useNotifications } from '../hooks/useNotifications';
import { Bell, Globe, User, Moon, Sun, Menu, Shield, Zap, Search, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NotificationPanel } from './NotificationPanel';
import { GlobalSearch } from './GlobalSearch';
import { TourGuide, useTour } from './TourGuide';
import Footer from './Footer';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useTranslation } from 'react-i18next';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AduanaChatbot } from './AduanaChatbot';

const menuItems = [
  {
    key: '/',
    icon: <DashboardOutlined />,
    label: 'Dashboard',
    tourId: 'dashboard'
  },
  {
    key: '/inspecciones',
    icon: <CarOutlined />,
    label: 'Inspecciones',
    tourId: 'inspections'
  },
  {
    key: '/documentos',
    icon: <FileTextOutlined />,
    label: 'Documentos',
    tourId: 'documents'
  },
  {
    key: '/reportes',
    icon: <BarChartOutlined />,
    label: 'Reportes',
    tourId: 'reports'
  },
  {
    key: '/calidad',
    icon: <SettingOutlined />,
    label: 'Calidad',
    tourId: 'quality'
  },
  {
    key: '/ayuda',
    icon: <QuestionCircleOutlined />,
    label: 'Ayuda',
    tourId: 'help'
  },
];

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    notifications, 
    unreadCount, 
    urgentCount,
    markAsRead, 
    markAllAsRead, 
    removeNotification, 
    clearAll, 
    executeAction 
  } = useNotifications();
  const { isTourOpen, hasSeenTour, startTour, closeTour } = useTour();
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [showGlobalSearch, setShowGlobalSearch] = React.useState(false);
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
  const { t, i18n } = useTranslation();
  
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
  
  // Atajo de teclado para búsqueda global (Ctrl/Cmd + K)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowGlobalSearch(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  const toggleLanguage = () => {
    const newLang = i18n.language === 'es' ? 'en' : 'es';
    i18n.changeLanguage(newLang);
    setLanguage(newLang);
  };
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

  // Función para renderizar el indicador de notificaciones
  const renderNotificationBadge = () => {
    if (urgentCount > 0) {
      return (
        <span className="absolute -top-2 -right-2 h-6 w-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse transition-all duration-300 shadow-md border-2 border-blue-900" aria-label={`${urgentCount} notificaciones urgentes`}>
          <Zap className="h-3 w-3" />
        </span>
      );
    } else if (unreadCount > 0) {
      return (
        <span className="absolute -top-2 -right-2 h-5 w-5 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse transition-all duration-300 shadow-md border-2 border-blue-900" aria-label={`${unreadCount} notificaciones nuevas`}>
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      );
    }
    return null;
  };

  return (
    <TooltipProvider>
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
          
          {/* Búsqueda global */}
          <div className="px-2 mb-4" data-tour="search">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  onClick={() => setShowGlobalSearch(true)}
                  className="w-full justify-start text-white hover:bg-white/10 border border-white/20"
                  aria-label="Búsqueda global (Ctrl+K)"
                >
                  <Search className="h-4 w-4 mr-2" />
                  <span className="text-sm">Buscar...</span>
                  <span className="ml-auto text-xs opacity-60">⌘K</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Búsqueda global (Ctrl+K)</p>
              </TooltipContent>
            </Tooltip>
          </div>
          
          {/* Menú principal */}
          <nav className="flex flex-col gap-2 mb-8" role="navigation" aria-label="Navegación principal">
            {menuItems.map((item) => (
              <Tooltip key={item.key}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => { navigate(item.key); setSidebarOpen(false); }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold transition-all duration-200
                      ${location.pathname === item.key ? 'bg-white text-blue-900 shadow-lg' : 'text-white hover:bg-white/10 hover:pl-6'}`}
                    aria-label={`Ir a ${item.label}`}
                    aria-current={location.pathname === item.key ? 'page' : undefined}
                    data-tour={item.tourId}
                  >
                    <span className="flex items-center justify-center h-6 w-6" aria-hidden="true">
                      {item.icon}
                    </span>
                    <span className="tracking-wide">{item.label}</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </nav>
          {/* Usuario y acciones rápidas */}
          <div className="mt-auto flex flex-col gap-4 px-2">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-2xl px-4 py-3 shadow-inner border border-white/20">
              <User className="h-7 w-7 text-blue-100" aria-hidden="true" />
              <div>
                <div className="text-white font-bold leading-tight text-base">{userName}</div>
                <div className="text-xs text-blue-200 opacity-80">{userRole.charAt(0).toUpperCase() + userRole.slice(1)}</div>
              </div>
            </div>
            {/* Separador */}
            <div className="border-t border-white/20 my-2" />
            {/* Acciones rápidas ordenadas */}
            <div className="flex flex-row items-center justify-center gap-4 pb-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-white hover:bg-blue-800 hover:text-blue-200 flex items-center gap-1"
                        aria-label="Cambiar idioma"
                      >
                        <Globe className="h-5 w-5" />
                        <span className="ml-1 font-bold text-xs">{i18n.language === 'es' ? 'ES' : 'EN'}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => { i18n.changeLanguage('es'); setLanguage('es'); }}>
                        🇪🇸 Español {i18n.language === 'es' && <span className="ml-2 text-blue-600 font-bold">✓</span>}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => { i18n.changeLanguage('en'); setLanguage('en'); }}>
                        🇺🇸 English {i18n.language === 'en' && <span className="ml-2 text-blue-600 font-bold">✓</span>}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Cambiar idioma</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleDarkMode}
                    className="text-white hover:bg-blue-800 hover:text-blue-200"
                    aria-label="Alternar modo oscuro"
                  >
                    {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Alternar tema</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="group relative" ref={notificationRef} data-tour="notifications">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDrawerOpen(!drawerOpen)}
                      className="text-white hover:bg-blue-800 hover:text-blue-200 relative"
                      aria-label={`Notificaciones ${unreadCount > 0 ? `(${unreadCount} nuevas)` : ''} ${urgentCount > 0 ? `(${urgentCount} urgentes)` : ''}`}
                    >
                      <Bell className="h-5 w-5" />
                      {renderNotificationBadge()}
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Notificaciones {urgentCount > 0 && `(${urgentCount} urgentes)`}</p>
                </TooltipContent>
              </Tooltip>
              
              {/* Botón del Tour */}
              {!hasSeenTour && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={startTour}
                      className="text-white hover:bg-blue-800 hover:text-blue-200 relative animate-pulse"
                      aria-label="Iniciar tour interactivo"
                    >
                      <HelpCircle className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Tour interactivo</p>
                  </TooltipContent>
                </Tooltip>
              )}
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
            
            {/* Búsqueda global móvil */}
            <div className="px-2 mb-4">
              <Button
                variant="ghost"
                onClick={() => { setShowGlobalSearch(true); setSidebarOpen(false); }}
                className="w-full justify-start text-white hover:bg-white/10 border border-white/20"
                aria-label="Búsqueda global"
              >
                <Search className="h-4 w-4 mr-2" />
                <span className="text-sm">Buscar...</span>
              </Button>
            </div>
            
            {/* Menú principal */}
            <nav className="flex flex-col gap-2 mb-8" role="navigation" aria-label="Navegación principal">
              {menuItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => { navigate(item.key); setSidebarOpen(false); }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold transition-all duration-200
                    ${location.pathname === item.key ? 'bg-white text-blue-900 shadow-lg' : 'text-white hover:bg-white/10 hover:pl-6'}`}
                  aria-label={`Ir a ${item.label}`}
                  aria-current={location.pathname === item.key ? 'page' : undefined}
                >
                  <span className="flex items-center justify-center h-6 w-6" aria-hidden="true">
                    {item.icon}
                  </span>
                  <span className="tracking-wide">{item.label}</span>
                </button>
              ))}
            </nav>
            {/* Usuario y acciones rápidas */}
            <div className="mt-auto flex flex-col gap-4 px-2">
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-2xl px-4 py-3 shadow-inner border border-white/20">
                <User className="h-7 w-7 text-blue-100" aria-hidden="true" />
                <div>
                  <div className="text-white font-bold leading-tight text-base">{userName}</div>
                  <div className="text-xs text-blue-200 opacity-80">{userRole.charAt(0).toUpperCase() + userRole.slice(1)}</div>
                </div>
              </div>
              {/* Separador */}
              <div className="border-t border-white/20 my-2" />
              {/* Acciones rápidas ordenadas */}
              <div className="flex flex-row items-center justify-center gap-4 pb-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-blue-800 hover:text-blue-200 flex items-center gap-1"
                      aria-label="Cambiar idioma"
                    >
                      <Globe className="h-5 w-5" />
                      <span className="ml-1 font-bold text-xs">{i18n.language === 'es' ? 'ES' : 'EN'}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => { i18n.changeLanguage('es'); setLanguage('es'); }}>
                      🇪🇸 Español {i18n.language === 'es' && <span className="ml-2 text-blue-600 font-bold">✓</span>}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => { i18n.changeLanguage('en'); setLanguage('en'); }}>
                      🇺🇸 English {i18n.language === 'en' && <span className="ml-2 text-blue-600 font-bold">✓</span>}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleDarkMode}
                  className="text-white hover:bg-blue-800 hover:text-blue-200"
                  aria-label="Alternar modo oscuro"
                >
                  {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>
                <div className="group relative" ref={notificationRef}>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDrawerOpen(!drawerOpen)}
                    className="text-white hover:bg-blue-800 hover:text-blue-200 relative"
                    aria-label={`Notificaciones ${unreadCount > 0 ? `(${unreadCount} nuevas)` : ''} ${urgentCount > 0 ? `(${urgentCount} urgentes)` : ''}`}
                  >
                    <Bell className="h-5 w-5" />
                    {renderNotificationBadge()}
                  </Button>
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
          aria-label="Abrir menú de navegación"
        >
          <Menu className="h-6 w-6" aria-hidden="true" />
        </button>
        {/* Contenido principal */}
        <div className="flex-1 flex flex-col min-h-screen">
          <main className="flex-1 w-full max-w-7xl mx-auto px-2 md:px-8 py-6">
            <Outlet />
          </main>
          
          {/* Footer institucional */}
          <Footer />
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
                <button 
                  onClick={() => setDrawerOpen(false)} 
                  className="text-gray-400 hover:text-blue-600 text-2xl font-bold focus:outline-none"
                  aria-label="Cerrar notificaciones"
                >
                  ×
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <NotificationPanel
                  notifications={notifications}
                  markAsRead={markAsRead}
                  markAllAsRead={markAllAsRead}
                  removeNotification={removeNotification}
                  clearAll={clearAll}
                  executeAction={executeAction}
                  onClose={() => setDrawerOpen(false)}
                />
              </div>
            </div>
          </>
        )}
        
        {/* Búsqueda global */}
        <GlobalSearch 
          isOpen={showGlobalSearch} 
          onClose={() => setShowGlobalSearch(false)} 
        />
        
        {/* Tour interactivo */}
        <TourGuide 
          isOpen={isTourOpen} 
          onClose={closeTour} 
        />

        <AduanaChatbot />
      </div>
    </TooltipProvider>
  );
};

export default MainLayout; 