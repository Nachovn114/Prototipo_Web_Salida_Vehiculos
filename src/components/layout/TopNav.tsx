import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Bell, User, LogOut, Settings, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

export const TopNav: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b" data-name="TopNavigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center" data-name="Logo">
              <img
                className="h-8 w-auto"
                src="/logo.svg"
                alt="Frontera Digital"
              />
              <span className="ml-2 text-xl font-semibold text-primary">Frontera Digital</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
            <button
              type="button"
              className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none"
              data-name="NotificationsButton"
            >
              <Bell className="h-6 w-6" />
            </button>
            
            <div className="ml-3 relative" data-name="UserMenu">
              <div>
                <button
                  type="button"
                  className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  id="user-menu"
                  aria-expanded="false"
                  aria-haspopup="true"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  <span className="sr-only">Abrir menú de usuario</span>
                  <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center">
                    {user?.nombre?.charAt(0) || <User className="h-4 w-4" />}
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    {user?.nombre || 'Usuario'}
                  </span>
                </button>
              </div>

              {isMobileMenuOpen && (
                <div
                  className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu"
                >
                  <Link
                    to="/perfil"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                    data-name="ProfileLink"
                  >
                    Mi perfil
                  </Link>
                  <Link
                    to="/configuracion"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                    data-name="SettingsLink"
                  >
                    <Settings className="inline-block h-4 w-4 mr-2" />
                    Configuración
                  </Link>
                  <Link
                    to="/ayuda"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                    data-name="HelpLink"
                  >
                    <HelpCircle className="inline-block h-4 w-4 mr-2" />
                    Ayuda
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                    data-name="LogoutButton"
                  >
                    <LogOut className="inline-block h-4 w-4 mr-2" />
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="-mr-2 flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              aria-expanded="false"
              data-name="MobileMenuButton"
            >
              <span className="sr-only">Abrir menú principal</span>
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden" data-name="MobileMenu">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/perfil"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
              data-name="MobileProfileLink"
            >
              Mi perfil
            </Link>
            <Link
              to="/configuracion"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
              data-name="MobileSettingsLink"
            >
              Configuración
            </Link>
            <Link
              to="/ayuda"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
              data-name="MobileHelpLink"
            >
              Ayuda
            </Link>
            <button
              onClick={handleLogout}
              className="w-full text-left block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
              data-name="MobileLogoutButton"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default TopNav;
