import React, { useState, useEffect, useRef } from 'react';
import { Search, X, FileText, Car, User, Settings, ArrowRight, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getReportData } from '../services/reportService';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'solicitud' | 'documento' | 'vehiculo' | 'usuario' | 'configuracion';
  url: string;
  icon: React.ReactNode;
  timestamp?: string;
  status?: string;
  risk?: string;
}

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
  const [lastQuery, setLastQuery] = useState('');
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const loaderTimeout = useRef<NodeJS.Timeout | null>(null);

  // useEffect optimizado con debounce y loader diferido
  useEffect(() => {
    if (query === lastQuery && results.length > 0) return;
    setLastQuery(query);
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    if (loaderTimeout.current) clearTimeout(loaderTimeout.current);
    // Loader diferido
    loaderTimeout.current = setTimeout(() => setIsLoading(true), 200);
    debounceTimeout.current = setTimeout(() => {
      getReportData().then((data) => {
        let filtered = data;
        if (query.trim()) {
          filtered = data.filter(d =>
            d.id.toLowerCase().includes(query.toLowerCase()) ||
            d.inspector.toLowerCase().includes(query.toLowerCase()) ||
            d.tipoVehiculo.toLowerCase().includes(query.toLowerCase()) ||
            d.paisOrigen.toLowerCase().includes(query.toLowerCase()) ||
            d.puntoControl.toLowerCase().includes(query.toLowerCase())
          );
        } else {
          filtered = data.slice(0, 10);
        }
        const realResults = filtered.map(d => ({
          id: d.id,
          title: `Solicitud ${d.id.substring(0, 8)}`,
          description: `${d.tipoVehiculo} - ${d.paisOrigen} - Inspector: ${d.inspector}`,
          type: 'solicitud',
          url: `/solicitud/${d.id}`,
          icon: <FileText className="h-4 w-4" />,
          timestamp: d.fecha.toLocaleString(),
          status: d.resultadoInspeccion,
          risk: d.nivelRiesgo
        }));
        setResults(realResults);
        setSelectedIndex(0);
        setIsLoading(false);
        if (loaderTimeout.current) clearTimeout(loaderTimeout.current);
      }).catch(() => {
        setIsLoading(false);
        if (loaderTimeout.current) clearTimeout(loaderTimeout.current);
      });
    }, 300);
    // Cleanup
    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
      if (loaderTimeout.current) clearTimeout(loaderTimeout.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // Actualiza los filtros para que cuenten sobre results
  const filters = [
    { key: 'todos', label: 'Todos', count: results.length },
    { key: 'solicitud', label: 'Solicitudes', count: results.filter(item => item.type === 'solicitud').length },
    { key: 'documento', label: 'Documentos', count: results.filter(item => item.type === 'documento').length },
    { key: 'vehiculo', label: 'Vehículos', count: results.filter(item => item.type === 'vehiculo').length },
    { key: 'usuario', label: 'Usuarios', count: results.filter(item => item.type === 'usuario').length },
  ];

  // Sugerencias inteligentes sin 'Configuración'
  const smartSuggestions = [
    { id: 's1', title: 'Ir a Dashboard', icon: <ArrowRight className="h-5 w-5 text-blue-500" />, action: () => navigate('/') },
    { id: 's2', title: 'Nueva Solicitud', icon: <FileText className="h-5 w-5 text-green-500" />, action: () => navigate('/predeclaracion') },
    { id: 's3', title: 'Contactar Soporte', icon: <User className="h-5 w-5 text-orange-500" />, action: () => window.open('mailto:soporte@frontera.cl') },
    { id: 's4', title: 'Ver Reportes', icon: <FileText className="h-5 w-5 text-purple-500" />, action: () => navigate('/reportes') },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="w-full max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 p-0"
            initial={{ scale: 0.99, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.99, y: 20, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 600, damping: 40, duration: 0.18 }}
            onClick={e => e.stopPropagation()}
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
                  <div className="py-2 px-2 space-y-2">
                    {smartSuggestions.map(s => (
                      <button key={s.id} onClick={() => { s.action(); onClose(); }} className="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900 transition-all shadow border border-transparent hover:border-blue-300">
                        {s.icon}
                        <span className="font-medium text-gray-800 dark:text-gray-100">{s.title}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100 dark:divide-gray-800">
                    {results.map((result, idx) => (
                      <li key={result.id} className={`flex items-center gap-4 px-4 py-3 cursor-pointer rounded-xl transition-all ${selectedIndex === idx ? 'bg-blue-50 dark:bg-blue-900 shadow-lg scale-[1.02]' : 'hover:bg-gray-50 dark:hover:bg-gray-800'} group`} onClick={() => handleResultClick(result)}>
                        <div className="flex-shrink-0">
                          {result.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-base text-gray-900 dark:text-gray-100">{result.title}</span>
                            {/* Badge de estado */}
                            {result.status && <Badge className="ml-2" variant="outline">{result.status}</Badge>}
                            {/* Badge de riesgo si aplica */}
                            {result.risk && <Badge className="ml-2 bg-red-100 text-red-700 border-red-200">Riesgo: {result.risk}</Badge>}
                          </div>
                          <span className="block text-gray-600 dark:text-gray-300 text-sm">{result.description}</span>
                          {result.timestamp && <span className="block text-xs text-gray-400 dark:text-gray-500 mt-1">{result.timestamp}</span>}
                        </div>
                        {/* Acciones rápidas */}
                        <div className="flex flex-col gap-2 items-end">
                          {result.type === 'solicitud' && <Button size="sm" variant="outline" onClick={e => { e.stopPropagation(); navigate(`/solicitud/${result.id}/exportar`); }}>Exportar</Button>}
                          {result.type === 'documento' && <Button size="sm" variant="outline" onClick={e => { e.stopPropagation(); navigate(`/documentos/${result.id}`); }}>Ver</Button>}
                        </div>
                      </li>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 