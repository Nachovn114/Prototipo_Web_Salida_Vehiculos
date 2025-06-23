import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  FileText, 
  Clock, 
  Upload, 
  CheckCircle, 
  User, 
  Users, 
  Settings, 
  BarChart2,
  MessageSquare,
  LogOut,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

type NavItem = {
  name: string;
  href: string;
  icon: React.ReactNode;
  roles?: string[];
  children?: NavItem[];
};

const navigation: NavItem[] = [
  // Navegación para Conductores
  { 
    name: 'Inicio', 
    href: '/dashboard', 
    icon: <Home className="h-5 w-5" />,
    roles: ['conductor', 'inspector', 'administrador', 'funcionario'] 
  },
  { 
    name: 'Nueva Solicitud', 
    href: '/solicitud/nueva', 
    icon: <FileText className="h-5 w-5" />,
    roles: ['conductor'] 
  },
  { 
    name: 'Mis Solicitudes', 
    href: '/solicitudes', 
    icon: <Clock className="h-5 w-5" />,
    roles: ['conductor'] 
  },
  { 
    name: 'Documentos', 
    href: '/documentos', 
    icon: <Upload className="h-5 w-5" />,
    roles: ['conductor'] 
  },
  { 
    name: 'Validación', 
    href: '/validacion', 
    icon: <CheckCircle className="h-5 w-5" />,
    roles: ['inspector'] 
  },
  { 
    name: 'Usuarios', 
    href: '/usuarios', 
    icon: <Users className="h-5 w-5" />,
    roles: ['administrador'] 
  },
  { 
    name: 'Reportes', 
    href: '/reportes', 
    icon: <BarChart2 className="h-5 w-5" />,
    roles: ['administrador', 'funcionario'] 
  },
  { 
    name: 'Configuración', 
    href: '/configuracion', 
    icon: <Settings className="h-5 w-5" />,
    roles: ['administrador'] 
  },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [expandedItems, setExpandedItems] = React.useState<Record<string, boolean>>({});

  const toggleItem = (name: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  const filteredNavigation = navigation.filter(item => {
    if (!item.roles) return true;
    return item.roles.some(role => user?.rol === role);
  });

  const renderNavItem = (item: NavItem) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems[item.name];
    const active = isActive(item.href);

    return (
      <div key={item.name} className="space-y-1">
        <div
          className={cn(
            'group flex items-center px-2 py-2 text-sm font-medium rounded-md',
            active
              ? 'bg-primary-50 text-primary-600'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
            'cursor-pointer'
          )}
          onClick={() => hasChildren ? toggleItem(item.name) : null}
        >
          <div className="flex items-center flex-1">
            <span className={cn('mr-3', active ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500')}>
              {item.icon}
            </span>
            <span className="flex-1">{item.name}</span>
            {hasChildren && (
              <span className="ml-2">
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </span>
            )}
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className="pl-8 space-y-1">
            {item.children?.map(child => (
              <Link
                key={child.name}
                to={child.href}
                className={cn(
                  'group flex items-center px-2 py-2 text-sm font-medium rounded-md',
                  isActive(child.href)
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <span className="flex-1">{child.name}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="hidden md:flex md:flex-shrink-0" data-name="Sidebar">
      <div className="flex flex-col w-64 border-r border-gray-200 bg-white">
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4 mb-8" data-name="Logo">
            <img
              className="h-8 w-auto"
              src="/logo-icon.svg"
              alt="Frontera Digital"
            />
            <span className="ml-2 text-xl font-semibold text-primary">Frontera Digital</span>
          </div>
          
          <div className="flex-1 px-3 space-y-1 bg-white">
            {filteredNavigation.map(item => renderNavItem(item))}
          </div>
        </div>
        
        <div className="flex-shrink-0 flex border-t border-gray-200 p-4" data-name="UserProfile">
          <div className="flex-shrink-0 group block">
            <div className="flex items-center">
              <div className="h-9 w-9 rounded-full bg-primary text-white flex items-center justify-center">
                {user?.nombre?.charAt(0) || <User className="h-5 w-5" />}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                  {user?.nombre || 'Usuario'}
                </p>
                <button
                  onClick={logout}
                  className="text-xs font-medium text-gray-500 group-hover:text-gray-700 flex items-center"
                  data-name="LogoutButton"
                >
                  <LogOut className="h-3 w-3 mr-1" />
                  Cerrar sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
