import React, { useState } from 'react';
import { Bell, Menu, Globe, Shield, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { NotificationPanel } from './NotificationPanel';
import { Notification } from '../hooks/useNotifications';
import { Link } from 'react-router-dom';

interface HeaderProps {
  unreadCount: number;
  notifications: Notification[];
  markAsRead: (id: number) => void;
}

export const Header: React.FC<HeaderProps> = ({ unreadCount, notifications, markAsRead }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [language, setLanguage] = useState('es');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'es' ? 'en' : 'es');
  };

  return (
    <header className="bg-white shadow-lg border-b border-blue-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo and Title */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Shield className="h-10 w-10 text-blue-700 drop-shadow" />
            <div>
              <h1 className="text-2xl font-extrabold text-blue-900 leading-tight">Aduana Chile</h1>
              <p className="text-xs text-blue-500 font-medium">Frontera Los Libertadores</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/">
              <Button variant="ghost" className="text-blue-900 font-semibold hover:bg-blue-50 hover:text-blue-700 transition-colors">
                Inicio
              </Button>
            </Link>
            <Link to="/inspecciones">
              <Button variant="ghost" className="text-blue-900 font-semibold hover:bg-blue-50 hover:text-blue-700 transition-colors">
                {language === 'es' ? 'Inspecciones' : 'Inspections'}
              </Button>
            </Link>
            <Link to="/documentos">
              <Button variant="ghost" className="text-blue-900 font-semibold hover:bg-blue-50 hover:text-blue-700 transition-colors">
                {language === 'es' ? 'Documentos' : 'Documents'}
              </Button>
            </Link>
            <Link to="/reportes">
              <Button variant="ghost" className="text-blue-900 font-semibold hover:bg-blue-50 hover:text-blue-700 transition-colors">
                {language === 'es' ? 'Reportes' : 'Reports'}
              </Button>
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
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
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNotifications(!showNotifications)}
                className="text-blue-900 hover:bg-blue-50 hover:text-blue-700 transition-colors relative"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold shadow-lg border-2 border-white animate-bounce">
                    {unreadCount}
                  </span>
                )}
              </Button>
              {showNotifications && (
                <NotificationPanel
                  notifications={notifications}
                  markAsRead={markAsRead}
                  onClose={() => setShowNotifications(false)}
                />
              )}
            </div>

            {/* User Profile */}
            <Button variant="ghost" size="sm" className="text-blue-900 hover:bg-blue-50 hover:text-blue-700 transition-colors flex items-center">
              <User className="h-5 w-5 mr-2" />
              <span className="hidden sm:inline font-semibold">Inspector García</span>
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
