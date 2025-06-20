import React, { useState, useRef, useEffect } from 'react';
import { Bell, Menu, Globe, Shield, User, Moon, Sun, Archive, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Notification } from '../hooks/useNotifications';
import { Link, useLocation } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useNotifications } from '../hooks/useNotifications';

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
              size="sm"
              onClick={toggleLanguage}
              className="text-blue-900 hover:bg-blue-50 hover:text-blue-700 transition-colors"
            >
              <Globe className="h-4 w-4 mr-1" />
              {language.toUpperCase()}
            </Button>

            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(true)}
                className="relative p-2 text-gray-600 hover:text-blue-600 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full"
              >
                <Bell className="h-5 w-5" />
                {useNotificationsNotifications?.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse transition-all duration-300">
                    {useNotificationsNotifications.length}
                  </span>
                )}
              </button>
              <Dialog open={showNotifications} onOpenChange={setShowNotifications}>
                <DialogContent className="max-w-xl w-full p-0 rounded-2xl">
                  <DialogHeader className="flex flex-row items-center justify-between px-6 pt-6 pb-2 border-b">
                    <DialogTitle className="text-2xl font-bold">Notificaciones</DialogTitle>
                    <button className="text-blue-700 text-sm font-medium hover:underline" onClick={() => markAllAsRead()}>
                      Marcar todas como leídas
                    </button>
                  </DialogHeader>
                  <div className="px-6 pt-4 pb-2">
                    <Tabs value={notificationTab} onValueChange={value => setNotificationTab(value as 'todas' | 'archivadas')} className="w-full">
                      <TabsList className="mb-4">
                        <TabsTrigger value="todas">Todas</TabsTrigger>
                        <TabsTrigger value="archivadas">Archivadas</TabsTrigger>
                      </TabsList>
                      <TabsContent value="todas">
                        {/* Alertas importantes agrupadas */}
                        {useNotificationsNotifications.filter(n => !n.archivada && n.prioridad === 'urgente').length > 0 && (
                          <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg mb-4 p-3 flex flex-col gap-2 shadow-sm">
                            {useNotificationsNotifications.filter(n => !n.archivada && n.prioridad === 'urgente').map(n => (
                              <div key={n.id} className="flex items-start gap-3">
                                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                                <span className="font-semibold text-yellow-900 leading-snug">{n.titulo}: {n.mensaje}</span>
                                <button className="ml-auto text-gray-400 hover:text-blue-600" title="Archivar" onClick={() => archiveNotification(n.id)}>
                                  <Archive className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                        {/* Notificaciones normales */}
                        {useNotificationsNotifications.filter(n => !n.archivada && n.prioridad !== 'urgente').length === 0 ? (
                          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                            <Bell className="h-16 w-16 mb-4" />
                            <span className="text-lg font-semibold">No hay notificaciones</span>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {useNotificationsNotifications.filter(n => !n.archivada && n.prioridad !== 'urgente').map(n => (
                              <div key={n.id} className={`flex items-start gap-3 rounded-lg px-4 py-3 bg-white border shadow-sm relative`}>
                                <CheckCircle className="h-5 w-5 text-blue-500 mt-1" />
                                <div className="flex-1">
                                  <span className="block font-medium text-gray-900">{n.titulo}</span>
                                  <span className="block text-gray-600 text-sm">{n.mensaje}</span>
                                  <span className="block text-xs text-gray-400 mt-1">{new Date(n.fecha).toLocaleString()}</span>
                                </div>
                                <button className="ml-2 text-gray-400 hover:text-blue-600" title="Archivar" onClick={() => archiveNotification(n.id)}>
                                  <Archive className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </TabsContent>
                      <TabsContent value="archivadas">
                        {useNotificationsNotifications.filter(n => n.archivada).length === 0 ? (
                          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                            <Bell className="h-16 w-16 mb-4" />
                            <span className="text-lg font-semibold">No hay notificaciones archivadas</span>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {useNotificationsNotifications.filter(n => n.archivada).map(n => (
                              <div key={n.id} className={`flex items-start gap-3 rounded-lg px-4 py-3 bg-gray-50 border shadow-sm relative`}>
                                {n.prioridad === 'urgente' ? (
                                  <AlertTriangle className="h-5 w-5 text-yellow-500 mt-1" />
                                ) : (
                                  <CheckCircle className="h-5 w-5 text-blue-500 mt-1" />
                                )}
                                <div className="flex-1">
                                  <span className="block font-medium text-gray-900">{n.titulo}</span>
                                  <span className="block text-gray-600 text-sm">{n.mensaje}</span>
                                  <span className="block text-xs text-gray-400 mt-1">{new Date(n.fecha).toLocaleString()}</span>
                                </div>
                                <button className="ml-2 text-gray-400 hover:text-blue-600" title="Desarchivar" onClick={() => unarchiveNotification(n.id)}>
                                  <Archive className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Dark Mode Switch */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleDarkMode}
              className="text-blue-900 hover:bg-blue-50 hover:text-blue-700 transition-colors"
              aria-label="Alternar modo oscuro"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {/* User Profile */}
            <Button variant="ghost" size="sm" className="text-blue-900 hover:bg-blue-50 hover:text-blue-700 transition-colors flex items-center">
              <User className="h-5 w-5 mr-2" />
              <span className="hidden sm:inline font-semibold">{userName} <span className="text-xs text-blue-500 font-normal ml-2">({userRole.charAt(0).toUpperCase() + userRole.slice(1)})</span></span>
            </Button>

            {/* Mobile Menu */}
            <Button variant="ghost" size="sm" className="md:hidden text-blue-900 hover:bg-blue-50 hover:text-blue-700 transition-colors">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
