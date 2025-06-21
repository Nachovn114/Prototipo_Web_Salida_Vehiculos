import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Download, RefreshCw, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

type RegistroAuditoria = {
  id: string;
  accion: string;
  entidad: string;
  idEntidad: string;
  idUsuario: string;
  nombreUsuario: string;
  fechaHora: string;
  detalles: string;
  ipOrigen?: string;
  terminal?: string;
};

const datosPrueba: RegistroAuditoria[] = [
  {
    id: '1',
    accion: 'CREAR',
    entidad: 'Solicitud',
    idEntidad: 'SOL-2023-00123',
    idUsuario: 'usuario123',
    nombreUsuario: 'Juan Pérez',
    fechaHora: '2025-06-20T15:30:00-04:00',
    detalles: 'Se creó una nueva solicitud de salida de vehículo',
    ipOrigen: '192.168.1.100',
    terminal: 'Puesto 1 - Aduana Los Libertadores'
  },
  {
    id: '2',
    accion: 'ACTUALIZAR',
    entidad: 'Solicitud',
    idEntidad: 'SOL-2023-00122',
    idUsuario: 'usuario456',
    nombreUsuario: 'María González',
    fechaHora: '2025-06-20T14:15:00-04:00',
    detalles: 'Se actualizó el estado de la solicitud a "En revisión"',
    ipOrigen: '192.168.1.101',
    terminal: 'Puesto 2 - Aduana Los Libertadores'
  },
  {
    id: '3',
    accion: 'ELIMINAR',
    entidad: 'Documento',
    idEntidad: 'DOC-2023-00456',
    idUsuario: 'usuario789',
    nombreUsuario: 'Carlos Muñoz',
    fechaHora: '2025-06-20T13:45:00-04:00',
    detalles: 'Se eliminó un documento adjunto',
    ipOrigen: '192.168.1.102',
    terminal: 'Oficina Central - Aduana Los Andes'
  },
];

const Auditoria = () => {
  const [registros, setRegistros] = React.useState<RegistroAuditoria[]>(datosPrueba);
  const [cargando, setCargando] = React.useState(false);
  const [terminoBusqueda, setTerminoBusqueda] = React.useState('');

  const manejarActualizacion = () => {
    setCargando(true);
    // Simular carga de datos
    setTimeout(() => {
      setCargando(false);
    }, 1000);
  };

  const registrosFiltrados = React.useMemo(() => {
    if (!terminoBusqueda.trim()) return registros;
    
    const busqueda = terminoBusqueda.toLowerCase().trim();
    
    return registros.filter(registro => {
      // Buscar en todos los campos del registro
      return Object.entries(registro).some(([key, value]) => {
        // Saltar propiedades que no son strings o están vacías
        if (value === null || value === undefined) return false;
        
        // Convertir el valor a string y buscar coincidencias
        const valor = String(value).toLowerCase();
        return valor.includes(busqueda);
      });
    });
  }, [registros, terminoBusqueda]);

  const formatearFechaHora = (fechaHora: string) => {
    return new Date(fechaHora).toLocaleString('es-CL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const obtenerColorAccion = (accion: string) => {
    switch(accion) {
      case 'CREAR':
        return 'bg-green-100 text-green-800';
      case 'ACTUALIZAR':
        return 'bg-blue-100 text-blue-800';
      case 'ELIMINAR':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4 p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Registro de Auditoría</h1>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={manejarActualizacion} 
            disabled={cargando}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${cargando ? 'animate-spin' : ''}`} />
            {cargando ? 'Actualizando...' : 'Actualizar'}
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Exportar a Excel
          </Button>
        </div>
      </div>

      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="pb-3 border-b">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle className="text-lg">Bitácora de Actividades</CardTitle>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="search"
                placeholder="Buscar en registros..."
                className="pl-9"
                value={terminoBusqueda}
                onChange={(e) => setTerminoBusqueda(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="font-semibold">Fecha/Hora</TableHead>
                  <TableHead className="font-semibold">Usuario</TableHead>
                  <TableHead className="font-semibold">Acción</TableHead>
                  <TableHead className="font-semibold">Entidad</TableHead>
                  <TableHead className="font-semibold">ID</TableHead>
                  <TableHead className="font-semibold">Detalles</TableHead>
                  <TableHead className="font-semibold">Origen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {registrosFiltrados.length > 0 ? (
                  registrosFiltrados.map((registro) => (
                    <TableRow key={registro.id} className="hover:bg-gray-50">
                      <TableCell className="whitespace-nowrap">
                        {formatearFechaHora(registro.fechaHora)}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{registro.nombreUsuario}</span>
                          <span className="text-xs text-gray-500">{registro.idUsuario}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${obtenerColorAccion(registro.accion)}`}>
                          {registro.accion}
                        </span>
                      </TableCell>
                      <TableCell>{registro.entidad}</TableCell>
                      <TableCell className="font-mono text-sm">{registro.idEntidad}</TableCell>
                      <TableCell className="max-w-xs">
                        <div className="line-clamp-2">{registro.detalles}</div>
                        {registro.terminal && (
                          <div className="text-xs text-gray-500 mt-1">{registro.terminal}</div>
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-gray-500">
                        {registro.ipOrigen}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      No se encontraron registros que coincidan con la búsqueda
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auditoria;
