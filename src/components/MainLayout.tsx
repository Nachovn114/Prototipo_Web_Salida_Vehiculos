import React from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import {
  DashboardOutlined,
  FileTextOutlined,
  CarOutlined,
  BarChartOutlined,
  SettingOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';
import { useNotifications } from '../hooks/useNotifications';
import { Bell, Globe, User, Moon, Sun, Menu, Shield, Zap, Search, HelpCircle, MapPin, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import AduanaChatbot from './AduanaChatbot';
import { AnimatePresence } from 'framer-motion';
import { FileText } from 'lucide-react';

const menuItems = [
  {
    key: '/',
    icon: <DashboardOutlined />,
    label: 'Dashboard',
    tourId: 'dashboard',
    roles: ['admin', 'conductor', 'inspector', 'aduanero'] // Accesible para todos
  },
  {
    key: '/pre-declaracion',
    icon: <FileText className="h-6 w-6" />,
    label: 'Pre-Declaración',
    tourId: 'pre-declaration',
    roles: ['admin', 'conductor', 'aduanero'] // Accesible para conductores y aduaneros
  },
  {
    key: '/inspecciones',
    icon: <CarOutlined />,
    label: 'Inspecciones',
    tourId: 'inspections',
    roles: ['admin', 'inspector'] // Solo admin e inspectores
  },
  {
    key: '/documentos',
    icon: <FileTextOutlined />,
    label: 'Documentos',
    tourId: 'documents',
    roles: ['admin', 'conductor', 'aduanero'] // Accesible para conductores y aduaneros
  },
  {
    key: '/reportes',
    icon: <BarChartOutlined />,
    label: 'Reportes',
    tourId: 'reports',
    roles: ['admin'] // Solo admin
  },
  {
    key: '/admin/registro-actividad',
    icon: <Shield className="h-5 w-5" />,
    label: 'Registro de Actividad',
    tourId: 'audit',
    roles: ['admin'] // Solo admin
  },
  {
    key: '/calidad',
    icon: <SettingOutlined />,
    label: 'Calidad',
    tourId: 'quality',
    roles: ['admin'] // Solo admin
  },
  {
    key: '/ayuda',
    icon: <QuestionCircleOutlined />,
    label: 'Ayuda',
    tourId: 'help',
    roles: ['admin', 'conductor', 'inspector', 'aduanero'] // Accesible para todos
  },
];

const MainLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
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
    executeAction,
    addNotification
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
  const userRole = localStorage.getItem('userRole') || 'conductor';
  const userName = {
    conductor: 'Conductor',
    inspector: 'Inspector García',
    aduanero: 'Aduanero Soto',
    admin: 'Administrador',
  }[userRole] || 'Usuario';

  const filteredMenuItems = menuItems.filter(item => item.roles.includes(userRole));

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
      <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
        <div className="flex flex-1 min-w-0">
          {/* Sidebar escritorio */}
          <aside className="hidden md:flex flex-col w-72 min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-blue-700 shadow-2xl px-4 md:px-6 py-6 md:py-10 gap-8 transition-transform duration-300 z-30">
            {/* Logo y título */}
            <div className="flex flex-col items-center mb-10">
              <Link to="/" className="bg-white/20 rounded-2xl flex items-center justify-center shadow-lg h-20 w-20 mb-3">
                <img src="/assets/frontera-digital-logo.png" alt="Frontera Digital Logo" className="h-14 w-14 object-contain drop-shadow transition-transform duration-300 hover:scale-110 hover:rotate-6" />
              </Link>
              <h1 className="text-white text-2xl font-extrabold tracking-widest text-center leading-tight drop-shadow">Frontera<br/>Digital</h1>
            </div>
            {/* Buscador */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-200" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="w-full pl-12 pr-4 py-2 rounded-xl bg-white/10 text-white placeholder-blue-200 border border-white/20 focus:border-blue-400 focus:bg-white/20 focus:outline-none transition-all shadow-inner"
                />
                <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded bg-white/10 text-xs text-blue-100 border border-white/20">⌘K</kbd>
              </div>
            </div>
            {/* Separador */}
            <div className="border-t border-white/15 mb-4" />
            {/* Menú principal */}
            <nav className="flex flex-col gap-2 mb-8" role="navigation" aria-label="Navegación principal">
              {filteredMenuItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => { navigate(item.key); setSidebarOpen(false); }}
                  className={`flex items-center gap-4 px-5 py-3 rounded-2xl text-base font-semibold transition-all duration-200
                    ${location.pathname === item.key ? 'bg-white text-blue-900 shadow-lg scale-105' : 'text-white hover:bg-white/10 hover:scale-105'}`}
                  aria-label={`Ir a ${item.label}`}
                  aria-current={location.pathname === item.key ? 'page' : undefined}
                  data-tour={item.tourId}
                >
                  <span className={`flex items-center justify-center h-7 w-7 ${location.pathname === item.key ? 'text-blue-700' : 'text-blue-100'}`} aria-hidden="true">
                    {item.icon}
                  </span>
                  <span className="tracking-wide text-left">{item.label}</span>
                </button>
              ))}
            </nav>
            {/* Separador */}
            <div className="border-t border-white/15 my-4" />
            {/* Usuario y acciones rápidas */}
            <div className="mt-auto flex flex-col gap-6 items-center">
              <div className="flex flex-col items-center bg-white/20 backdrop-blur-xl rounded-3xl px-6 py-6 shadow-2xl border border-white/30 transition-all duration-300 hover:shadow-blue-200 w-full">
                <div className="flex flex-col items-center gap-2">
                  <div className="bg-gradient-to-br from-blue-400 via-blue-700 to-blue-900 rounded-full p-1 shadow-lg mb-2">
                    <User className="h-12 w-12 text-white bg-blue-800 rounded-full p-2 shadow-md" aria-hidden="true" />
                  </div>
                  <div className="text-white font-extrabold text-lg tracking-tight drop-shadow text-center">{userName}</div>
                  <div className="text-xs font-semibold text-blue-100 bg-blue-800/60 px-3 py-1 rounded-full shadow-sm uppercase tracking-widest mt-1" style={{letterSpacing: '0.08em'}}>{userRole.charAt(0).toUpperCase() + userRole.slice(1)}</div>
                </div>
              </div>
              {/* Acciones rápidas ordenadas */}
              <div className="flex flex-row items-center justify-center gap-3 pb-2 w-full">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="glass-btn"
                          aria-label="Cambiar idioma"
                        >
                          <Globe className="h-5 w-5" />
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
                    <p>Idioma: {i18n.language === 'es' ? 'Español' : 'English'}</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleDarkMode}
                      className="glass-btn"
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
                    <Button
                      variant="ghost"
                      size="icon"
                      className="glass-btn"
                      aria-label="Ayuda"
                      onClick={() => navigate('/ayuda')}
                    >
                      <HelpCircle className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Ayuda</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="glass-btn"
                      aria-label="Soporte"
                      onClick={() => window.open('mailto:soporte.frontera@aduana.cl')}
                    >
                      <Mail className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Soporte</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </aside>
          {/* Sidebar móvil (drawer) */}
          <aside className={`fixed inset-0 z-40 flex md:hidden transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`} style={{ pointerEvents: sidebarOpen ? 'auto' : 'none' }}>
            <div className="w-72 min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-blue-700 shadow-2xl px-4 py-8 gap-8 flex flex-col">
              {/* Branding */}
              <div className="flex items-center gap-3 mb-10 px-2">
                <Link to="/" className="bg-white/20 rounded-xl flex items-center justify-center shadow-md h-40 w-40">
                  <img src="/assets/frontera-digital-logo.png" alt="Frontera Digital Logo" className="w-full h-full object-contain drop-shadow transition-transform duration-300 hover:scale-110 hover:rotate-6" />
                </Link>
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
                {filteredMenuItems.map((item) => (
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
              <div className="mt-auto flex flex-col gap-6 px-2">
                <div className="flex flex-col items-center bg-white/20 backdrop-blur-xl rounded-3xl px-6 py-6 shadow-2xl border border-white/30 transition-all duration-300 hover:shadow-blue-200">
                  <div className="flex flex-col items-center gap-2">
                    <div className="bg-gradient-to-br from-blue-400 via-blue-700 to-blue-900 rounded-full p-1 shadow-lg mb-2">
                      <User className="h-12 w-12 text-white bg-blue-800 rounded-full p-2 shadow-md" aria-hidden="true" />
                    </div>
                    <div className="text-white font-extrabold text-lg tracking-tight drop-shadow">{userName}</div>
                    <div className="text-xs font-semibold text-blue-100 bg-blue-800/60 px-3 py-1 rounded-full shadow-sm uppercase tracking-widest mt-1" style={{letterSpacing: '0.08em'}}>{userRole.charAt(0).toUpperCase() + userRole.slice(1)}</div>
                  </div>
                </div>
                {/* Separador */}
                <div className="border-t border-white/20 my-2" />
                {/* Acciones rápidas ordenadas */}
                <div className="flex flex-row items-center justify-center gap-3 pb-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="glass-btn"
                        aria-label="Cambiar idioma"
                      >
                        <Globe className="h-5 w-5" />
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
                    className="glass-btn"
                    aria-label="Alternar modo oscuro"
                  >
                    {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="glass-btn"
                    aria-label="Ayuda"
                    onClick={() => navigate('/ayuda')}
                  >
                    <HelpCircle className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="glass-btn"
                    aria-label="Soporte"
                    onClick={() => window.open('mailto:soporte.frontera@aduana.cl')}
                  >
                    <Mail className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
            {/* Overlay para cerrar el drawer */}
            <div className="flex-1 bg-black bg-opacity-30" onClick={() => setSidebarOpen(false)} />
          </aside>
          {/* Botón menú hamburguesa móvil */}
          <button
            className="fixed top-4 left-4 z-50 md:hidden bg-blue-700 text-white p-2 rounded-lg shadow-lg hover:bg-blue-800 transition-all"
            onClick={() => setSidebarOpen(true)}
            aria-label="Abrir menú de navegación"
          >
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
          {/* Contenido principal */}
          <main className="flex-1 flex flex-col min-w-0">
            <div className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto min-w-0">
              {children || <Outlet />}
            </div>
          </main>
          
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
      </div>
    </TooltipProvider>
  );
};

const MainContent = () => (
  <main className="flex-1 flex flex-col">
    <div className="flex-1 p-4 md:p-8 overflow-y-auto">
      <Outlet />
    </div>
  </main>
);

export default MainLayout; 