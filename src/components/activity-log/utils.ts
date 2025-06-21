import { format, parseISO, subDays, isToday } from 'date-fns';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
import { isWithinInterval } from 'date-fns/isWithinInterval';
import { es } from 'date-fns/locale';
import { ActivityLogItem, ActionSeverity, ActionCategory, ActionType } from './types';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

/**
 * Formatea una fecha al formato localizado en español
 */
export const formatDate = (dateString: string, formatStr = 'PPpp') => {
  return format(parseISO(dateString), formatStr, { locale: es });
};

/**
 * Formatea una fecha como tiempo relativo (ej: "hace 2 horas")
 */
export const formatRelativeTime = (dateString: string) => {
  return formatDistanceToNow(parseISO(dateString), { 
    addSuffix: true, 
    locale: es,
    includeSeconds: true,
  });
};

/**
 * Obtiene las clases de color según la severidad
 */
export const getSeverityColor = (severity: ActionSeverity) => {
  const colorMap = {
    EXITO: 'bg-green-100 text-green-800 border-green-200 hover:bg-green-50',
    INFORMACION: 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-50',
    ADVERTENCIA: 'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-50',
    ERROR: 'bg-red-100 text-red-800 border-red-200 hover:bg-red-50',
  };
  return colorMap[severity] || 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-50';
};

/**
 * Obtiene el icono correspondiente a una categoría
 */
export const getCategoryIcon = (category: ActionCategory) => {
  const iconMap = {
    SALIDA_VEHICULO: '🚗',
    DOCUMENTO: '📄',
    USUARIO: '👤',
    SISTEMA: '⚙️',
    AUDITORIA: '🔒',
  };
  return iconMap[category] || '📋';
};

/**
 * Obtiene el texto descriptivo para un tipo de acción
 */
export const getActionTypeLabel = (type: ActionType): string => {
  const typeMap: Record<string, string> = {
    'crear': 'Creación',
    'actualizar': 'Actualización',
    'eliminar': 'Eliminación',
    'iniciar_sesion': 'Inicio de sesión',
    'cerrar_sesion': 'Cierre de sesión',
    'aprobar': 'Aprobación',
    'rechazar': 'Rechazo',
    'sistema': 'Sistema',
    'advertencia': 'Advertencia',
    'error': 'Error'
  };
  return typeMap[type] || type;
};

/**
 * Filtra los registros de actividad según los filtros proporcionados
 */
export const filterActivityLogs = (
  items: ActivityLogItem[],
  filters: {
    searchTerm: string;
    actionType: ActionType | 'all';
    severity: ActionSeverity | 'all';
    dateRange: { from?: Date; to?: Date };
  }
): ActivityLogItem[] => {
  const { searchTerm, actionType, severity, dateRange } = filters;
  const searchTermLower = searchTerm.toLowerCase();

  return items.filter((item) => {
    // Filtrar por término de búsqueda
    if (searchTerm) {
      const matchesSearch = 
        item.action.toLowerCase().includes(searchTermLower) ||
        item.userName.toLowerCase().includes(searchTermLower) ||
        item.userRole.toLowerCase().includes(searchTermLower) ||
        (item.metadata?.vehiclePlate?.toLowerCase().includes(searchTermLower) ?? false) ||
        (item.metadata?.documentId?.toLowerCase().includes(searchTermLower) ?? false) ||
        (item.location?.toLowerCase().includes(searchTermLower) ?? false);
      
      if (!matchesSearch) return false;
    }

    // Filtrar por tipo de acción
    if (actionType !== 'all' && item.actionType !== actionType) return false;
    
    // Filtrar por severidad
    if (severity !== 'all' && item.severity !== severity) return false;
    
    // Filtrar por rango de fechas
    const itemDate = new Date(item.timestamp);
    if (dateRange.from && itemDate < dateRange.from) return false;
    if (dateRange.to) {
      const toDate = new Date(dateRange.to);
      toDate.setHours(23, 59, 59, 999); // Fin del día
      if (itemDate > toDate) return false;
    }
    
    return true;
  });
};

/**
 * Calcula estadísticas a partir de los registros de actividad
 */
export const calculateStats = (items: ActivityLogItem[]) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  // Contar eventos de hoy
  const eventsToday = items.filter(item => {
    const itemDate = new Date(item.timestamp);
    return isToday(itemDate);
  }).length;
  
  // Obtener usuarios únicos
  const uniqueUsers = new Set(items.map(item => item.userId)).size;
  
  // Calcular promedio diario (últimos 30 días)
  const thirtyDaysAgo = subDays(now, 30);
  const recentItems = items.filter(item => new Date(item.timestamp) >= thirtyDaysAgo);
  const dailyAverage = recentItems.length > 0 
    ? Math.round((recentItems.length / 30) * 10) / 10 
    : 0;
  
  return {
    totalEvents: items.length,
    eventsToday,
    activeUsers: uniqueUsers,
    dailyAverage,
  };
};

/**
 * Exporta los registros a PDF
 */
export const exportToPDF = (items: ActivityLogItem[], filename: string) => {
  const doc = new jsPDF();
  const title = 'Registro de Actividades del Sistema';
  const date = format(new Date(), 'PPpp', { locale: es });
  
  // Título y fecha
  doc.setFontSize(18);
  doc.text(title, 14, 22);
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generado el: ${date}`, 14, 30);
  
  // Datos de la tabla
  const tableColumn = ['Fecha', 'Usuario', 'Acción', 'Tipo', 'Severidad', 'Detalles'];
  const tableRows: any[] = [];
  
  items.forEach(item => {
    const itemDate = format(parseISO(item.timestamp), 'PPpp', { locale: es });
    const userName = `${item.userName} (${item.userRole})`;
    const actionType = getActionTypeLabel(item.actionType);
    
    tableRows.push([
      itemDate,
      userName,
      item.action,
      actionType,
      item.severity,
      item.metadata?.location || 'N/A'
    ]);
  });
  
  // Generar tabla
  (doc as any).autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 40,
    styles: { 
      fontSize: 8,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [41, 99, 235],
      textColor: 255,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245]
    },
    margin: { top: 40 }
  });
  
  // Guardar archivo
  doc.save(`${filename}.pdf`);
};

/**
 * Exporta los registros a Excel
 */
export const exportToExcel = (items: ActivityLogItem[], filename: string) => {
  // Preparar datos para Excel
  const excelData = items.map(item => ({
    'ID': item.id,
    'Fecha y Hora': formatDate(item.timestamp, 'dd/MM/yyyy HH:mm:ss'),
    'Usuario': item.userName,
    'Rol': item.userRole,
    'País': item.country === 'CL' ? 'Chile' : 'Argentina',
    'Acción': item.action,
    'Tipo de Acción': getActionTypeLabel(item.actionType),
    'Categoría': item.category,
    'Severidad': item.severity,
    'Ubicación': item.metadata?.location || item.location || 'N/A',
    'Vehículo': item.metadata?.vehiclePlate || 'N/A',
    'Documento': item.metadata?.documentId || 'N/A',
    'Paso Fronterizo': item.metadata?.borderCrossing || 'N/A',
    'Duración (min)': item.metadata?.duration || 'N/A',
    'IP': item.ipAddress || 'N/A',
    'Detalles Adicionales': item.metadata ? JSON.stringify(item.metadata, null, 2) : 'N/A'
  }));
  
  // Crear hoja de trabajo
  const worksheet = XLSX.utils.json_to_sheet(excelData);
  
  // Ajustar ancho de columnas
  const columnWidths = [
    { wch: 10 },  // ID
    { wch: 20 },  // Fecha y Hora
    { wch: 20 },  // Usuario
    { wch: 15 },  // Rol
    { wch: 10 },  // País
    { wch: 40 },  // Acción
    { wch: 20 },  // Tipo de Acción
    { wch: 15 },  // Categoría
    { wch: 12 },  // Severidad
    { wch: 20 },  // Ubicación
    { wch: 15 },  // Vehículo
    { wch: 20 },  // Documento
    { wch: 20 },  // Paso Fronterizo
    { wch: 15 },  // Duración
    { wch: 15 },  // IP
    { wch: 50 }   // Detalles Adicionales
  ];
  
  worksheet['!cols'] = columnWidths;
  
  // Crear libro de trabajo
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Registro de Actividades');
  
  // Agregar un título
  const title = 'Registro de Actividades del Sistema';
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet([[title]]), 'Título');
  
  // Exportar archivo
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};

/**
 * Formatea un objeto de metadatos para mostrarlo como texto
 */
export const formatMetadata = (metadata: Record<string, any>): string => {
  return Object.entries(metadata)
    .map(([key, value]) => {
      if (value === null || value === undefined) return '';
      return `${key}: ${value}`;
    })
    .filter(Boolean)
    .join(' • ');
};

/**
 * Obtiene el color de borde según la severidad
 */
export const getBorderColor = (severity: ActionSeverity): string => {
  const colorMap = {
    EXITO: 'border-l-green-500',
    INFORMACION: 'border-l-blue-500',
    ADVERTENCIA: 'border-l-amber-500',
    ERROR: 'border-l-red-500',
  };
  return colorMap[severity] || 'border-l-gray-300';
};
