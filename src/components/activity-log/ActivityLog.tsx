import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, Filter, Calendar, X, ChevronDown, ChevronUp, RefreshCw, AlertCircle, Info, Check, Clock, Loader2, Activity, User, Users, BarChart2, Download, FileText, FileSpreadsheet, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreVertical, AlertTriangle, CheckCircle, Info as InfoIcon, Shield, Car, File, Settings, ShieldCheck, LogIn, LogOut, FilePlus, Trash2, MapPin } from 'lucide-react';
import { format, subDays, isWithinInterval, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { useDebounce } from 'use-debounce';

// Import types and utilities
import { ActivityLogItem, ActionType, ActionCategory, ActionSeverity, ActivityLogFilters } from './types';
import { mockData } from './mockData';
import { 
  formatDate, 
  formatRelativeTime, 
  getSeverityColor, 
  getCategoryIcon,
  filterActivityLogs,
  calculateStats,
  exportToPDF,
  exportToExcel
} from './utils';

// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComp } from '@/components/ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Types
type DateRange = {
  from: Date | undefined;
  to: Date | undefined;
};

// Constants
const ITEMS_PER_PAGE = 10;
const AUTO_REFRESH_INTERVAL = 30000; // 30 seconds

// Componente para mostrar un ítem de actividad
const ActivityLogListItem = ({ item }: { item: ActivityLogItem }) => {
  const [expanded, setExpanded] = useState(false);
  const isCL = item.country === 'CL';
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div 
        className="p-4 cursor-pointer flex items-start gap-3"
        onClick={() => setExpanded(!expanded)}
      >
        {/* Avatar con bandera */}
        <div className="relative">
          <Avatar className="h-10 w-10 border">
            <AvatarImage src={item.userAvatar} alt={item.userName} />
            <AvatarFallback className="bg-muted">
              {item.userName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-background flex items-center justify-center text-xs ${isCL ? 'bg-blue-500' : 'bg-green-500'}`}>
            {isCL ? '🇨🇱' : '🇦🇷'}
          </div>
        </div>
        
        {/* Contenido */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm truncate">{item.userName}</span>
              <Badge 
                variant="outline" 
                className={`text-xs ${getSeverityColor(item.severity)}`}
              >
                {item.userRole}
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground whitespace-nowrap">
              {formatRelativeTime(item.timestamp)}
            </div>
          </div>
          
          <p className="text-sm mt-1">
            <span className="h-4 w-4 inline mr-1">
              {getCategoryIcon(item.category)}
            </span>
            {item.action}
          </p>
          
          <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <span className="font-mono">IP: {item.ipAddress}</span>
            </div>
            {item.location && (
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span>{item.location}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Botón de expansión */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 ml-2"
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(!expanded);
          }}
        >
          {expanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
          <span className="sr-only">Ver detalles</span>
        </Button>
      </div>
      
      {/* Detalles expandidos */}
      {expanded && (
        <div className="px-4 pb-4 pt-0 border-t bg-muted/20">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 text-sm">
            <div>
              <h4 className="font-medium mb-1">Detalles de la actividad</h4>
              <div className="space-y-1">
                <p className="text-muted-foreground">
                  <span className="font-medium">Tipo:</span> {item.actionType}
                </p>
                <p className="text-muted-foreground">
                  <span className="font-medium">Categoría:</span> {item.category}
                </p>
                <p className="text-muted-foreground">
                  <span className="font-medium">Severidad:</span> 
                  <Badge 
                    variant="outline" 
                    className={`ml-1 ${getSeverityColor(item.severity)}`}
                  >
                    {item.severity}
                  </Badge>
                </p>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-1">Metadatos</h4>
              <div className="space-y-1">
                <p className="text-muted-foreground">
                  <span className="font-medium">ID de evento:</span> {item.id}
                </p>
                <p className="text-muted-foreground">
                  <span className="font-medium">Fecha exacta:</span> {formatDate(item.timestamp, 'PPpp')}
                </p>
                {item.metadata?.documentId && (
                  <p className="text-muted-foreground">
                    <span className="font-medium">Documento:</span> {item.metadata.documentId}
                  </p>
                )}
                {item.metadata?.vehiclePlate && (
                  <p className="text-muted-foreground">
                    <span className="font-medium">Vehículo:</span> {item.metadata.vehiclePlate}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          {item.metadata && Object.keys(item.metadata).length > 0 && (
            <div className="mt-3 pt-3 border-t">
              <h4 className="font-medium mb-1">Información adicional</h4>
              <div className="bg-muted/50 p-3 rounded-md text-sm">
                <div className="space-y-2">
                  {item.metadata.vehiclePlate && (
                    <div><span className="font-medium">Patente:</span> {item.metadata.vehiclePlate}</div>
                  )}
                  {item.metadata.documentId && (
                    <div><span className="font-medium">ID Documento:</span> {item.metadata.documentId}</div>
                  )}
                  {item.metadata.borderCrossing && (
                    <div><span className="font-medium">Paso Fronterizo:</span> {item.metadata.borderCrossing}</div>
                  )}
                  {item.metadata.documentType && (
                    <div><span className="font-medium">Tipo de Documento:</span> {item.metadata.documentType}</div>
                  )}
                  {item.metadata.duration && (
                    <div><span className="font-medium">Duración:</span> {item.metadata.duration} minutos</div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          <div className="mt-3 flex justify-end gap-2">
            <Button variant="outline" size="sm">
              <FileText className="h-4 w-4 mr-2" />
              Ver documento
            </Button>
            <Button variant="outline" size="sm">
              <Activity className="h-4 w-4 mr-2" />
              Ver actividad relacionada
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

// Componente principal de la lista de actividades
const ActivityLog = ({
  initialData = mockData,
  pageSize = ITEMS_PER_PAGE,
  autoRefresh = true,
  showFilters = true,
  className,
  ...props
}: any) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
  const [filters, setFilters] = useState({
    type: 'all',
    category: 'all',
    severity: 'all',
    dateRange: {
      from: subDays(new Date(), 7),
      to: new Date(),
    },
  });
  
  const [currentPage, setCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Filtrar y paginar datos
  const filteredData = useMemo(() => {
    return filterActivityLogs(initialData, {
      searchTerm: debouncedSearchTerm,
      actionType: filters.type === 'all' ? 'all' : filters.type as ActionType,
      severity: filters.severity === 'all' ? 'all' : filters.severity as ActionSeverity,
      dateRange: filters.dateRange
    });
  }, [initialData, debouncedSearchTerm, filters]);
  
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);
  
  const totalPages = Math.ceil(filteredData.length / pageSize);

  // Restablecer a la primera página cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, debouncedSearchTerm]);
  
  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      handleRefresh();
    }, AUTO_REFRESH_INTERVAL);
    
    return () => clearInterval(interval);
  }, [autoRefresh]);
  
  // Manejadores
  const handleRefresh = () => {
    setIsRefreshing(true);
    // Aquí iría la lógica para recargar datos
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };
  
  const handleExport = (format: 'pdf' | 'excel') => {
    if (format === 'pdf') {
      exportToPDF(filteredData, 'registro-actividades');
    } else {
      exportToExcel(filteredData, 'registro-actividades');
    }
  };

  // Método para obtener los datos filtrados (para el componente padre)
  const getFilteredData = useCallback(() => filteredData, [filteredData]);

  // Exponer el método de actualización al componente padre
  React.useImperativeHandle(props.ref, () => ({
    refresh: handleRefresh,
    getFilteredData
  }));

  return (
    <div className={`space-y-4 ${className}`} {...props}>
      {/* Filtros */}
      {showFilters && (
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar actividades..."
              className="w-full pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <Select
              value={filters.type}
              onValueChange={(value) => setFilters({...filters, type: value as any})}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Tipo de acción" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="create">Creaciones</SelectItem>
                <SelectItem value="update">Actualizaciones</SelectItem>
                <SelectItem value="delete">Eliminaciones</SelectItem>
                <SelectItem value="login">Inicios de sesión</SelectItem>
                <SelectItem value="system">Sistema</SelectItem>
              </SelectContent>
            </Select>
            
            <Select
              value={filters.severity}
              onValueChange={(value) => setFilters({...filters, severity: value as any})}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Severidad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="info">Informativo</SelectItem>
                <SelectItem value="low">Baja</SelectItem>
                <SelectItem value="medium">Media</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
                <SelectItem value="critical">Crítica</SelectItem>
              </SelectContent>
            </Select>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                  <Calendar className="mr-2 h-4 w-4" />
                  {filters.dateRange?.from ? (
                    filters.dateRange.to ? (
                      <>
                        {format(filters.dateRange.from, 'LLL dd, y')} -{' '}
                        {format(filters.dateRange.to, 'LLL dd, y')}
                      </>
                    ) : (
                      format(filters.dateRange.from, 'LLL dd, y')
                    )
                  ) : (
                    <span>Seleccionar rango de fechas</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComp
                  initialFocus
                  mode="range"
                  defaultMonth={filters.dateRange?.from}
                  selected={{
                    from: filters.dateRange?.from,
                    to: filters.dateRange?.to,
                  }}
                  onSelect={(range) => {
                    setFilters({
                      ...filters,
                      dateRange: {
                        from: range?.from,
                        to: range?.to,
                      },
                    });
                  }}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => {
                setSearchTerm('');
                setFilters({
                  type: 'all',
                  category: 'all',
                  severity: 'all',
                  dateRange: {
                    from: subDays(new Date(), 7),
                    to: new Date(),
                  },
                });
              }}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Limpiar filtros</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => handleExport('excel')}
            >
              <FileSpreadsheet className="h-4 w-4" />
              <span className="sr-only">Exportar a Excel</span>
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => handleExport('pdf')}
            >
              <FileText className="h-4 w-4" />
              <span className="sr-only">Exportar a PDF</span>
            </Button>
          </div>
        </div>
      )}
      
      {/* Lista de actividades */}
      <div className="space-y-3">
        {isRefreshing ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : paginatedData.length > 0 ? (
          paginatedData.map((item) => (
            <ActivityLogListItem key={item.id} item={item} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-1">No se encontraron actividades</h3>
            <p className="text-sm text-muted-foreground">
              No hay actividades que coincidan con los filtros seleccionados.
            </p>
          </div>
        )}
      </div>
      
      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2">
          <div className="text-sm text-muted-foreground">
            Mostrando <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> a{' '}
            <span className="font-medium">
              {Math.min(currentPage * pageSize, filteredData.length)}
            </span>{' '}
            de <span className="font-medium">{filteredData.length}</span> actividades
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              <ChevronsLeft className="h-4 w-4" />
              <span className="sr-only">Primera página</span>
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Página anterior</span>
            </Button>
            
            <div className="flex items-center justify-center text-sm font-medium">
              Página {currentPage} de {totalPages}
            </div>
            
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Siguiente página</span>
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              <ChevronsRight className="h-4 w-4" />
              <span className="sr-only">Última página</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityLog;
