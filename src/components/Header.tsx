import React, { useState, useRef, useEffect } from 'react';
import { Bell, Menu, Globe, Shield, User, Moon, Sun, Archive, CheckCircle, AlertTriangle, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Notification } from '../hooks/useNotifications';
import { Link, useLocation } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useNotifications } from '../hooks/useNotifications';
import { GlobalSearch } from './GlobalSearch';

interface HeaderProps {
  unreadCount: number;
  notifications: Notification[];
  markAsRead: (id: number) => void;
}

export const Header: React.FC<HeaderProps> = ({ unreadCount, notifications, markAsRead }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationTab, setNotificationTab] = useState<'todas' | 'archivadas'>('todas');
  const [language, setLanguage] = useState('es');
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });
  const [showGlobalSearch, setShowGlobalSearch] = useState(false);

  const notificationRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const {
    notifications: useNotificationsNotifications,
    markAllAsRead,
    archiveNotification,
    unarchiveNotification,
  } = useNotifications();

  useEffect(() => {
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

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setShowGlobalSearch(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'es' ? 'en' : 'es');
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

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20 md:h-24 gap-8">
          {/* Logo and Title */}
          <Link to="/" className="flex items-center gap-4 group hover:opacity-90 transition-all min-w-fit">
            <img
              src="/assets/frontera-digital-logo.png"
              alt="Frontera Digital Logo"
              className="h-12 w-12 md:h-14 md:w-14 drop-shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300"
            />
            <div className="flex flex-col justify-center">
              <h1 className="text-2xl md:text-3xl font-black text-blue-900 dark:text-gray-100 leading-tight tracking-tight drop-shadow-sm">Frontera Digital</h1>
              <p className="text-xs md:text-sm text-blue-600 dark:text-blue-400 font-semibold bg-blue-50 dark:bg-gray-700 rounded px-2 py-0.5 inline-block shadow-sm mt-1">Sistema de Control Fronterizo</p>
            </div>
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-4 min-w-fit">
            {/* Language Toggle */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleLanguage}
              aria-label={`Cambiar idioma (actual: ${language === 'es' ? 'Español' : 'Inglés'})`}
              title={`Cambiar idioma (${language === 'es' ? 'ES' : 'EN'})`}
            >
              <Globe className="h-5 w-5" aria-hidden="true" />
              <span className="sr-only">
                {language === 'es' ? 'Español' : 'English'}
              </span>
            </Button>

            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label={`Notificaciones ${unreadCount > 0 ? `(${unreadCount} sin leer)` : ''}`}
              aria-expanded={showNotifications}
              aria-haspopup="dialog"
              title={unreadCount > 0 ? `${unreadCount} notificaciones sin leer` : 'Ver notificaciones'}
            >
              <Bell className="h-5 w-5" aria-hidden="true" />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                  <span className="sr-only">{unreadCount} notificaciones sin leer</span>
                  <span aria-hidden="true">{unreadCount}</span>
                </span>
              )}
            </Button>

            {/* Dark Mode Switch */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsDark(!isDark)}
              aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            >
              {isDark ? (
                <Sun className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Moon className="h-5 w-5" aria-hidden="true" />
              )}
            </Button>

            {/* User Profile */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-blue-900 hover:bg-blue-50 hover:text-blue-700 transition-colors flex items-center"
              aria-label={`Perfil de ${userName}`}
              title={`Perfil de ${userName} (${userRole})`}
            >
              <User className="h-5 w-5 mr-2" aria-hidden="true" />
              <span className="hidden sm:inline font-semibold">
                {userName} 
                <span className="sr-only">, {userRole}</span>
                <span aria-hidden="true" className="text-xs text-blue-500 font-normal ml-2">
                  ({userRole.charAt(0).toUpperCase() + userRole.slice(1)})
                </span>
              </span>
            </Button>

            {/* Mobile Menu */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="md:hidden text-blue-900 hover:bg-blue-50 hover:text-blue-700 transition-colors"
              aria-label="Menú principal"
              aria-expanded={false}
              aria-haspopup="menu"
              title="Menú principal"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
              <span className="sr-only">Abrir menú principal</span>
            </Button>

            {/* Global Search */}
            <button
              className="ml-2 flex items-center gap-2 px-3 py-2 rounded-lg bg-white dark:bg-gray-900 shadow hover:bg-blue-50 dark:hover:bg-blue-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 transition-all"
              onClick={() => setShowGlobalSearch(true)}
              title="Buscar en todo el sistema (Ctrl+K)"
              aria-label="Buscar en el sistema"
              aria-expanded={showGlobalSearch}
              aria-controls="global-search-dialog"
            >
              <Search className="h-5 w-5" aria-hidden="true" />
              <span className="hidden md:inline font-medium">Buscar</span>
              <kbd 
                className="ml-2 px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs text-gray-500 dark:text-gray-300 border border-gray-300 dark:border-gray-700"
                aria-hidden="true"
              >
                Ctrl+K
              </kbd>
              <span className="sr-only">, abre el diálogo de búsqueda global</span>
            </button>
          </div>
        </div>
      </div>

      {/* Global Search Modal */}
      <GlobalSearch isOpen={showGlobalSearch} onClose={() => setShowGlobalSearch(false)} />
    </header>
  );
};
