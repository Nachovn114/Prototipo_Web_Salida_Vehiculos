import { Download, FileText, FileSpreadsheet } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type BitacoraEntry = {
  fecha: Date;
  accion: string;
  usuario: string;
};

export const BitacoraExporter = ({ solicitudId }: { solicitudId: string }) => {
  // Datos de ejemplo para la bitácora
  const bitacora: BitacoraEntry[] = [
    { fecha: new Date(), accion: 'Solicitud creada', usuario: 'Sistema' },
    { fecha: new Date(Date.now() - 1000 * 60 * 5), accion: 'Revisión de documentos', usuario: 'Inspector 1' },
    { fecha: new Date(Date.now() - 1000 * 60 * 10), accion: 'Validación de datos', usuario: 'Sistema' },
  ];

  const exportToCSV = () => {
    const csvContent = [
      ['Fecha', 'Acción', 'Usuario'],
      ...bitacora.map(item => [
        format(item.fecha, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
        `"${item.accion}"`,
        `"${item.usuario}"`
      ])
    ].map(e => e.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `bitacora-solicitud-${solicitudId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    // This is a placeholder for PDF generation
    // In a real implementation, you would use a library like jspdf or html2pdf
    alert('Función de PDF en desarrollo. Por ahora, usa la exportación a CSV.');
    // Example implementation would go here
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Exportar Bitácora
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={exportToCSV}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Exportar a CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToPDF}>
          <FileText className="mr-2 h-4 w-4" />
          Exportar a PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
