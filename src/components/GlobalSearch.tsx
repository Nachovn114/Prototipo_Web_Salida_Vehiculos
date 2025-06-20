import React, { useState, useEffect, useRef } from 'react';
import { Search, X, FileText, Car, User, Settings, ArrowRight, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'solicitud' | 'documento' | 'vehiculo' | 'usuario' | 'configuracion';
  url: string;
  icon: React.ReactNode;
  timestamp?: string;
  status?: string;
}

// Datos de ejemplo para la búsqueda
const mockSearchData: SearchResult[] = [
  {
    id: '1',
    title: 'Solicitud ABCD-12',
    description: 'Toyota Corolla - Juan Pérez González',
    type: 'solicitud',
    url: '/solicitud/1',
    icon: <FileText className="h-4 w-4" />,
    timestamp: 'Hace 2 horas',
    status: 'Pendiente'
  },
  {
    id: '2',
    title: 'Documento SOAP',
    description: 'Seguro Obligatorio - ABCD-12',
    type: 'documento',
    url: '/documentos',
    icon: <FileText className="h-4 w-4" />,
    timestamp: 'Hace 1 día',
    status: 'Válido'
  },
  {
    id: '3',
    title: 'Vehículo EFGH-34',
    description: 'Ford Ranger - María Silva',
    type: 'vehiculo',
    url: '/inspecciones',
    icon: <Car className="h-4 w-4" />,
    timestamp: 'Hace 3 horas',
    status: 'En revisión'
  },
  {
    id: '4',
    title: 'Inspector García',
    description: 'Inspector de vehículos',
    type: 'usuario',
    url: '/usuarios',
    icon: <User className="h-4 w-4" />,
    timestamp: 'Activo',
    status: 'En línea'
  },
  {
    id: '5',
    title: 'Configuración del Sistema',
    description: 'Ajustes generales y preferencias',
    type: 'configuracion',
    url: '/configuracion',
    icon: <Settings className="h-4 w-4" />,
    timestamp: 'Última modificación: hace 1 semana'
  }
];

const getTypeColor = (type: SearchResult['type']) => {
  switch (type) {
    case 'solicitud': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'documento': return 'bg-green-100 text-green-800 border-green-200';
    case 'vehiculo': return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'usuario': return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'configuracion': return 'bg-gray-100 text-gray-800 border-gray-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getTypeLabel = (type: SearchResult['type']) => {
  switch (type) {
    case 'solicitud': return 'Solicitud';
    case 'documento': return 'Documento';
    case 'vehiculo': return 'Vehículo';
    case 'usuario': return 'Usuario';
    case 'configuracion': return 'Configuración';
    default: return 'Otro';
  }
};

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>('todos');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Filtrar resultados basados en la consulta
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    
    // Simular búsqueda con delay
    const timeoutId = setTimeout(() => {
      const filtered = mockSearchData.filter(item => {
        const searchTerm = query.toLowerCase();
        const matchesQuery = 
          item.title.toLowerCase().includes(searchTerm) ||
          item.description.toLowerCase().includes(searchTerm);
        
        const matchesFilter = activeFilter === 'todos' || item.type === activeFilter;
        
        return matchesQuery && matchesFilter;
      });
      
      setResults(filtered);
      setSelectedIndex(0);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, activeFilter]);

  // Manejar navegación con teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < results.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev > 0 ? prev - 1 : results.length - 1
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (results[selectedIndex]) {
            handleResultClick(results[selectedIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onClose]);

  // Enfocar el input cuando se abre
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleResultClick = (result: SearchResult) => {
    navigate(result.url);
    onClose();
    setQuery('');
  };

  const handleClose = () => {
    onClose();
    setQuery('');
    setResults([]);
    setSelectedIndex(0);
  };

  const filters = [
    { key: 'todos', label: 'Todos', count: mockSearchData.length },
    { key: 'solicitud', label: 'Solicitudes', count: mockSearchData.filter(item => item.type === 'solicitud').length },
    { key: 'documento', label: 'Documentos', count: mockSearchData.filter(item => item.type === 'documento').length },
    { key: 'vehiculo', label: 'Vehículos', count: mockSearchData.filter(item => item.type === 'vehiculo').length },
    { key: 'usuario', label: 'Usuarios', count: mockSearchData.filter(item => item.type === 'usuario').length },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={handleClose}
          />
          
          {/* Modal de búsqueda */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 w-full max-w-2xl z-50"
          >
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <Search className="h-5 w-5 text-gray-400" />
                  <Input
                    ref={inputRef}
                    type="text"
                    placeholder="Buscar solicitudes, documentos, vehículos..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="flex-1 border-0 focus:ring-0 text-lg bg-transparent"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClose}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Filtros */}
              <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                <div className="flex gap-2 overflow-x-auto">
                  {filters.map((filter) => (
                    <button
                      key={filter.key}
                      onClick={() => setActiveFilter(filter.key)}
                      className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                        activeFilter === filter.key
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {filter.label}
                      <Badge variant="secondary" className="text-xs">
                        {filter.count}
                      </Badge>
                    </button>
                  ))}
                </div>
              </div>

              {/* Resultados */}
              <div className="max-h-96 overflow-y-auto">
                {isLoading ? (
                  <div className="p-8 text-center text-gray-500">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p>Buscando...</p>
                  </div>
                ) : query.trim() && results.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <Search className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No se encontraron resultados para "{query}"</p>
                    <p className="text-sm text-gray-400 mt-1">Intenta con otros términos</p>
                  </div>
                ) : !query.trim() ? (
                  <div className="p-8 text-center text-gray-500">
                    <Search className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Escribe para buscar</p>
                    <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-gray-400">
                      <div className="flex items-center gap-1">
                        <ArrowRight className="h-3 w-3" />
                        <span>Navegar resultados</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ArrowRight className="h-3 w-3" />
                        <span>Enter para abrir</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ArrowRight className="h-3 w-3" />
                        <span>ESC para cerrar</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {results.map((result, index) => (
                      <motion.div
                        key={result.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`p-4 cursor-pointer transition-colors ${
                          index === selectedIndex
                            ? 'bg-blue-50 dark:bg-blue-900/20'
                            : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                        }`}
                        onClick={() => handleResultClick(result)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-1">
                            {result.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-medium text-gray-900 dark:text-white truncate">
                                {result.title}
                              </h3>
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${getTypeColor(result.type)}`}
                              >
                                {getTypeLabel(result.type)}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                              {result.description}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-gray-400">
                              {result.timestamp && (
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  <span>{result.timestamp}</span>
                                </div>
                              )}
                              {result.status && (
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  <span>{result.status}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <ArrowRight className="h-4 w-4 text-gray-400 flex-shrink-0 mt-1" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}; 