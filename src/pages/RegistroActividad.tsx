import React, { useState, useRef } from 'react';
import ActivityLog from '@/components/activity-log/ActivityLog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, RefreshCw, FileText, FileSpreadsheet } from 'lucide-react';
import { toast } from 'sonner';

const RegistroActividad = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const activityLogRef = useRef<any>(null);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Si el componente ActivityLog tiene un método de actualización, lo llamamos
    if (activityLogRef.current?.refresh) {
      activityLogRef.current.refresh();
    }
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleExport = async (format: 'pdf' | 'excel') => {
    try {
      // Si el componente ActivityLog tiene un método para obtener los datos filtrados
      if (activityLogRef.current?.getFilteredData) {
        const filteredData = activityLogRef.current.getFilteredData();
        
        // Usar la función de exportación correspondiente
        if (format === 'pdf') {
          // Asumiendo que exportToPDF está disponible en el scope
          // Si no, necesitaríamos importarlo
          const { exportToPDF } = await import('@/components/activity-log/utils');
          exportToPDF(filteredData, 'registro-actividades');
          toast.success('Exportación a PDF iniciada');
        } else {
          const { exportToExcel } = await import('@/components/activity-log/utils');
          exportToExcel(filteredData, 'registro-actividades');
          toast.success('Exportación a Excel iniciada');
        }
      } else {
        // Si no podemos acceder a los datos filtrados, exportar datos vacíos
        toast.warning('No se pudieron obtener los datos para exportar');
      }
    } catch (error) {
      console.error('Error al exportar:', error);
      toast.error('Error al exportar los datos');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Registro de Actividad del Sistema</h1>
          <p className="text-muted-foreground">
            Monitoreo en tiempo real de las actividades del sistema
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2"
              onClick={() => document.getElementById('export-menu')?.classList.toggle('hidden')}
            >
              <Download className="h-4 w-4" />
              Exportar
            </Button>
            <div 
              id="export-menu" 
              className="hidden absolute right-0 mt-1 w-40 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-700"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => {
                  handleExport('excel');
                  document.getElementById('export-menu')?.classList.add('hidden');
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
              >
                <FileSpreadsheet className="h-4 w-4" />
                Exportar a Excel
              </button>
              <button
                onClick={() => {
                  handleExport('pdf');
                  document.getElementById('export-menu')?.classList.add('hidden');
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                Exportar a PDF
              </button>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh} 
            disabled={isRefreshing}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Agregamos un manejador de clic fuera del menú desplegable */}
      <div 
        className="fixed inset-0 z-0 hidden" 
        id="export-overlay"
        onClick={() => document.getElementById('export-menu')?.classList.add('hidden')}
      />

      <ActivityLog 
        ref={activityLogRef}
        showFilters={true}
        autoRefresh={true}
      />
    </div>
  );
};

export default RegistroActividad;
