import { ReportData } from './reportService';
import { format, isAfter, isBefore, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { toast } from 'sonner';

// Tipos de formato de exportación
export type ExportFormat = 'csv' | 'pdf' | 'excel';

// Opciones de exportación
export interface ExportOptions {
  format: ExportFormat;
  includeDetails?: boolean;
  dateRange?: { start: Date; end: Date };
  filters?: {
    tipoVehiculo?: string[];
    paisOrigen?: string[];
    puntoControl?: string[];
    resultadoInspeccion?: string[];
    nivelRiesgo?: string[];
  };
}

/**
 * Formatea los datos para exportación
 */
const formatDataForExport = (data: ReportData[], options: ExportOptions): any[] => {
  if (!data || !Array.isArray(data)) {
    console.error('Datos de entrada inválidos para formateo');
    return [];
  }

  return data
    .filter(item => {
      try {
        // Validar fechas si se proporciona un rango
        if (options.dateRange?.start && options.dateRange?.end) {
          const itemDate = item.fecha instanceof Date ? item.fecha : new Date(item.fecha);
          return isAfter(itemDate, options.dateRange.start) && 
                 isBefore(itemDate, options.dateRange.end);
        }
        return true;
      } catch (error) {
        console.error('Error al formatear datos para exportación:', error);
        return false;
      }
    })
    .map(item => {
      try {
        const fecha = item.fecha instanceof Date ? item.fecha : new Date(item.fecha);
        return {
          'ID': item.id || 'N/A',
          'Fecha': format(fecha, 'PPP', { locale: es }),
          'Hora': format(fecha, 'HH:mm'),
          'Tipo de Vehículo': item.tipoVehiculo || 'No especificado',
          'País de Origen': item.paisOrigen || 'No especificado',
          'Punto de Control': item.puntoControl || 'No especificado',
          'Tiempo de Cruce (min)': item.tiempoCruce ?? 'N/A',
          'Resultado': item.resultadoInspeccion || 'Pendiente',
          'Nivel de Riesgo': item.nivelRiesgo || 'No evaluado',
          'Inspector': item.inspector || 'No asignado'
        };
      } catch (error) {
        console.error('Error al formatear ítem:', item, error);
        return null;
      }
    })
    .filter(Boolean); // Eliminar nulos
};

/**
 * Exporta los datos a CSV
 */
const exportToCsv = (data: any[], filename: string) => {
  try {
    if (!data || !data.length) {
      throw new Error('No hay datos para exportar');
    }

    const safeData = data.map(item => {
      const safeItem: Record<string, any> = {};
      Object.entries(item).forEach(([key, value]) => {
        // Manejar valores nulos o indefinidos
        if (value === null || value === undefined) {
          safeItem[key] = '';
        } 
        // Escapar comillas en cadenas
        else if (typeof value === 'string') {
          safeItem[key] = `"${value.replace(/"/g, '""')}"`;
        }
        // Convertir otros tipos a string
        else {
          safeItem[key] = String(value);
        }
      });
      return safeItem;
    });

    const headers = Object.keys(safeData[0] || {}).join(';');
    const rows = safeData.map(item => Object.values(item).join(';'));
    
    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([
      '﻿', // BOM para UTF-8
      csvContent
    ], { type: 'text/csv;charset=utf-8;' });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    // Configurar el enlace de descarga
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${format(new Date(), 'yyyyMMdd_HHmmss')}.csv`);
    link.style.display = 'none';
    
    // Descargar el archivo
    document.body.appendChild(link);
    link.click();
    
    // Limpiar
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
    
    return true;
  } catch (error) {
    console.error('Error al exportar a CSV:', error);
    toast.error('Error al generar el archivo CSV');
    return false;
  }
};

/**
 * Exporta los datos a PDF
 */
const exportToPdf = (data: any[], filename: string): boolean => {
  try {
    // Crear un nuevo documento PDF
    const doc = new jsPDF();
    
    // Título del documento
    doc.setFontSize(18);
    doc.text('Reporte de Inspecciones Fronterizas', 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    
    // Fecha de generación
    doc.text(`Generado el: ${format(new Date(), 'PPPp', { locale: es })}`, 14, 30);
    
    // Configuración de la tabla
    const headers = [
      'ID',
      'Fecha',
      'Hora',
      'Vehículo',
      'Origen',
      'Punto Control',
      'Tiempo (min)',
      'Resultado',
      'Riesgo',
      'Inspector'
    ];
    
    // Preparar datos para la tabla
    const tableData = data.map(item => [
      item['ID'] || '',
      item['Fecha'] || '',
      item['Hora'] || '',
      item['Tipo de Vehículo'] || '',
      item['País de Origen'] || '',
      item['Punto de Control'] || '',
      item['Tiempo de Cruce (min)'] || '',
      item['Resultado'] || '',
      item['Nivel de Riesgo'] || '',
      item['Inspector'] || ''
    ]);
    
    // Agregar la tabla al documento
    (doc as any).autoTable({
      head: [headers],
      body: tableData,
      startY: 40,
      styles: {
        fontSize: 8,
        cellPadding: 2,
        overflow: 'linebreak',
        lineWidth: 0.1,
        lineColor: 200
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 9
      },
      alternateRowStyles: {
        fillColor: 245
      },
      columnStyles: {
        0: { cellWidth: 15 },
        1: { cellWidth: 25 },
        2: { cellWidth: 15 },
        3: { cellWidth: 20 },
        4: { cellWidth: 20 },
        5: { cellWidth: 25 },
        6: { cellWidth: 15 },
        7: { cellWidth: 20 },
        8: { cellWidth: 15 },
        9: { cellWidth: 30 }
      },
      margin: { top: 40 }
    });
    
    // Pie de página
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(150);
      doc.text(
        `Página ${i} de ${pageCount}`, 
        doc.internal.pageSize.width - 30, 
        doc.internal.pageSize.height - 10
      );
    }
    
    // Guardar el documento
    doc.save(`${filename}.pdf`);
    return true;
  } catch (error) {
    console.error('Error al generar PDF:', error);
    toast.error('Error al generar el archivo PDF');
    return false;
  }
};

/**
 * Exporta los datos a Excel (CSV para simplificar)
 */
const exportToExcel = (data: any[], filename: string): boolean => {
  try {
    // Para simplificar, usaremos CSV como formato de Excel
    return exportToCsv(data, `${filename}_excel`);
  } catch (error) {
    console.error('Error al generar Excel:', error);
    toast.error('Error al generar el archivo Excel');
    return false;
  }
};

/**
 * Función principal de exportación
 */
export const exportReport = async (
  data: ReportData[], 
  options: ExportOptions
): Promise<boolean> => {
  try {
    // Validación de parámetros
    if (!data || !Array.isArray(data)) {
      throw new Error('Datos de entrada inválidos');
    }

    if (!options?.format || !['csv', 'pdf', 'excel'].includes(options.format)) {
      throw new Error('Formato de exportación no soportado');
    }

    // Aplicar filtros si existen
    let filteredData = [...data];
    
    if (options.filters) {
      const { filters } = options;
      filteredData = filteredData.filter(item => {
        try {
          if (filters.tipoVehiculo?.length && !filters.tipoVehiculo.includes(item.tipoVehiculo)) {
            return false;
          }
          if (filters.paisOrigen?.length && !filters.paisOrigen.includes(item.paisOrigen)) {
            return false;
          }
          if (filters.puntoControl?.length && !filters.puntoControl.includes(item.puntoControl)) {
            return false;
          }
          if (filters.resultadoInspeccion?.length && !filters.resultadoInspeccion.includes(item.resultadoInspeccion)) {
            return false;
          }
          if (filters.nivelRiesgo?.length && !filters.nivelRiesgo.includes(item.nivelRiesgo)) {
            return false;
          }
          return true;
        } catch (error) {
          console.error('Error al aplicar filtros:', error);
          return false;
        }
      });
    }
    
    // Validar que hayan datos después de filtrar
    if (filteredData.length === 0) {
      toast.warning('No hay datos que coincidan con los filtros seleccionados');
      return false;
    }
    
    // Formatear datos para exportación
    const formattedData = formatDataForExport(filteredData, options);
    
    if (formattedData.length === 0) {
      toast.warning('No hay datos válidos para exportar');
      return false;
    }
    
    // Generar nombre de archivo con fecha y hora
    const timestamp = format(new Date(), 'yyyyMMdd-HHmmss');
    const filename = `reporte-inspecciones_${timestamp}`;
    
    // Mostrar notificación de progreso
    toast.info(`Generando archivo ${options.format.toUpperCase()}...`);
    
    // Exportar según el formato seleccionado
    let success = false;
    switch (options.format) {
      case 'csv':
        success = await exportToCsv(formattedData, filename);
        break;
      case 'pdf':
        success = await exportToPdf(formattedData, filename);
        break;
      case 'excel':
        success = await exportToExcel(formattedData, filename);
        break;
    }
    
    if (success) {
      toast.success(`Archivo ${options.format.toUpperCase()} generado correctamente`);
      return true;
    } else {
      throw new Error('Error al generar el archivo');
    }
    
  } catch (error) {
    console.error('Error al exportar el reporte:', error);
    toast.error(`Error al exportar: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    return false;
  }
};
