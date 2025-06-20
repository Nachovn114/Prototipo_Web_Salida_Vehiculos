import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Tooltip, Legend, Title } from 'chart.js';
import { FileText, Download, BarChart2, CheckCircle, XCircle, Calendar as CalendarIcon, Loader2, Share2, FileDown, Clock } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { getReportData, ReportData } from '@/services/reportService';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { es } from 'date-fns/locale';
import { DateRange } from "react-day-picker";
import { toast } from 'sonner';

// Exportación de utilidades
import { exportReport } from '@/services/exportService';

Chart.register(CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Tooltip, Legend, Title);

const Reportes = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ReportData[]>([]);
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    to: new Date(),
  });
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await getReportData({
          startDate: date?.from,
          endDate: date?.to,
        });
        setData(result);
      } catch (error) {
        console.error("Failed to fetch report data:", error);
        toast.error("Error al cargar los datos del reporte.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [date]);
  
  // --- Lógica de Exportación ---
  const handleExport = async (format: 'pdf' | 'csv') => {
    if (data.length === 0) {
      toast.warning("No hay datos para exportar.");
      return;
    }

    // Asegurarse de que tenemos un rango de fechas válido
    if (!date?.from || !date?.to) {
      toast.warning("Por favor, selecciona un rango de fechas válido");
      return;
    }

    try {
      await exportReport(data, {
        format,
        dateRange: {
          start: date.from,
          end: date.to
        },
        includeDetails: true,
        filters: {
          // Aquí puedes agregar filtros adicionales si es necesario
        }
      });
    } catch (error) {
      console.error('Error al exportar:', error);
      toast.error(`Error al exportar el reporte a ${format.toUpperCase()}`);
    }
  };

  // --- Procesamiento de datos para gráficos ---
  const processDataForCharts = () => {
    const kpis = {
      totalSolicitudes: data.length,
      aprobadas: data.filter(d => d.resultadoInspeccion === 'Aprobado').length,
      rechazadas: data.filter(d => d.resultadoInspeccion === 'Rechazado').length,
      tiempoPromedio: Math.round(data.reduce((acc, d) => acc + d.tiempoCruce, 0) / (data.length || 1)),
    };
    
    const flujoPorDia = data.reduce((acc, d) => {
      const day = format(d.fecha, 'eee', { locale: es });
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const flujoData = {
      labels: Object.keys(flujoPorDia),
      datasets: [{
        label: 'Solicitudes',
        data: Object.values(flujoPorDia),
        backgroundColor: 'rgba(37, 99, 235, 0.7)',
        borderRadius: 4,
      }]
    };

    const riesgoData = {
      labels: ['Bajo', 'Medio', 'Alto'],
      datasets: [{
        data: [
          data.filter(d => d.nivelRiesgo === 'Bajo').length,
          data.filter(d => d.nivelRiesgo === 'Medio').length,
          data.filter(d => d.nivelRiesgo === 'Alto').length,
        ],
        backgroundColor: ['#22c55e', '#f59e0b', '#ef4444'],
      }]
    };
    
    return { kpis, flujoData, riesgoData };
  };
  
  const { kpis, flujoData, riesgoData } = processDataForCharts();

  const renderContent = () => {
    if (loading) {
      return <Skeleton className="h-[500px] w-full" />;
    }

    return (
      <div ref={reportRef} className="space-y-8 p-4 md:p-6 bg-card rounded-lg">
        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Solicitudes</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpis.totalSolicitudes}</div>
            </CardContent>
          </Card>
           <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aprobadas</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpis.aprobadas}</div>
            </CardContent>
          </Card>
           <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rechazadas</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpis.rechazadas}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tiempo Cruce Promedio</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpis.tiempoPromedio} min</div>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Flujo de Solicitudes</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <Bar data={flujoData} options={{ maintainAspectRatio: false, responsive: true }} />
            </CardContent>
          </Card>
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Distribución de Riesgo</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <Pie data={riesgoData} options={{ maintainAspectRatio: false, responsive: true }} />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-4 p-4 sm:p-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-3xl font-bold text-foreground flex items-center gap-2 text-center md:text-left">
          <BarChart2 className="h-7 w-7" /> Reportes y Analítica Avanzada
        </h2>
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className="w-full sm:w-[280px] justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "LLL dd, y", { locale: es })} -{" "}
                      {format(date.to, "LLL dd, y", { locale: es })}
                    </>
                  ) : (
                    format(date.from, "LLL dd, y")
                  )
                ) : (
                  <span>Selecciona un rango de fechas</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
                locale={es}
              />
            </PopoverContent>
          </Popover>
          <Button onClick={() => handleExport('pdf')} variant="outline" className="w-full sm:w-auto"><Share2 className="mr-2 h-4 w-4" /> Exportar Vista (PDF)</Button>
          <Button onClick={() => handleExport('csv')} className="w-full sm:w-auto"><FileDown className="mr-2 h-4 w-4" /> Exportar Datos (CSV)</Button>
        </div>
      </div>
      {renderContent()}
    </div>
  );
};

export default Reportes; 