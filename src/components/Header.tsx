import React, { useState, useRef, useEffect } from 'react';
import { Bell, Menu, Globe, Shield, User, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { NotificationPanel } from './NotificationPanel';
import { Notification } from '../hooks/useNotifications';
import { Link, useLocation } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

interface HeaderProps {
  unreadCount: number;
  notifications: Notification[];
  markAsRead: (id: number) => void;
}

export const Header: React.FC<HeaderProps> = ({ unreadCount, notifications, markAsRead }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [language, setLanguage] = useState('es');
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  const notificationRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

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
    <header className="bg-gradient-to-r from-blue-50 via-white to-blue-100 shadow-md border-b border-blue-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20 md:h-24 gap-8">
          {/* Logo and Title */}
          <Link to="/" className="flex items-center gap-4 group hover:opacity-90 transition-all min-w-fit">
            <Shield className="h-12 w-12 md:h-14 md:w-14 text-blue-700 drop-shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300" />
            <div className="flex flex-col justify-center">
              <h1 className="text-2xl md:text-3xl font-black text-blue-900 leading-tight tracking-tight drop-shadow-sm">Aduana Chile</h1>
              <p className="text-xs md:text-sm text-blue-600 font-semibold bg-blue-50 rounded px-2 py-0.5 inline-block shadow-sm mt-1">Frontera Los Libertadores</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `text-sm font-medium transition-all duration-200 hover:text-blue-600 hover:scale-105 ${
                  isActive ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'
                }`
              }
            >
              Dashboard
            </NavLink>
            <NavLink 
              to="/inspecciones" 
              className={({ isActive }) => 
                `text-sm font-medium transition-all duration-200 hover:text-blue-600 hover:scale-105 ${
                  isActive ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'
                }`
              }
            >
              Inspecciones
            </NavLink>
            <NavLink 
              to="/documentos" 
              className={({ isActive }) => 
                `text-sm font-medium transition-all duration-200 hover:text-blue-600 hover:scale-105 ${
                  isActive ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'
                }`
              }
            >
              Documentos
            </NavLink>
            <NavLink 
              to="/reportes" 
              className={({ isActive }) => 
                `text-sm font-medium transition-all duration-200 hover:text-blue-600 hover:scale-105 ${
                  isActive ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'
                }`
              }
            >
              Reportes
            </NavLink>
            <NavLink 
              to="/calidad" 
              className={({ isActive }) => 
                `text-sm font-medium transition-all duration-200 hover:text-blue-600 hover:scale-105 ${
                  isActive ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'
                }`
              }
            >
              Calidad
            </NavLink>
          </nav>

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
            <div className="relative" ref={notificationRef}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-600 hover:text-blue-600 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full"
              >
                <Bell className="h-5 w-5" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse transition-all duration-300">
                    {notifications.length}
                  </span>
                )}
              </button>
              {showNotifications && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 transform transition-all duration-200 ease-out">
                  <NotificationPanel
                    notifications={notifications}
                    markAsRead={markAsRead}
                    onClose={() => setShowNotifications(false)}
                  />
                </div>
              )}
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
