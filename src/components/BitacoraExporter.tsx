import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const BitacoraExporter = ({ solicitudId }) => {
  const exportToCSV = () => {
    // Datos de ejemplo para la bitácora
    const bitacora = [
      { fecha: new Date(), accion: 'Solicitud creada', usuario: 'Sistema' },
      { fecha: new Date(Date.now() - 1000 * 60 * 5), accion: 'Revisión de documentos', usuario: 'Inspector 1' },
      { fecha: new Date(Date.now() - 1000 * 60 * 10), accion: 'Validación de datos', usuario: 'Sistema' },
    ];

    const csvContent = [
      ['Fecha', 'Acción', 'Usuario'],
      ...bitacora.map(item => [
        format(item.fecha, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
        item.accion,
        item.usuario
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

  return (
    <Button variant="outline" onClick={exportToCSV}>
      <Download className="mr-2 h-4 w-4" />
      Exportar Bitácora
    </Button>
  );
};
