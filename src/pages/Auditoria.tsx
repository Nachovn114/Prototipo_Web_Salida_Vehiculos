import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow, 
  TableCaption 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Search, Filter, Download, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

type AuditoriaItem = {
  id: string;
  usuario: string;
  rol: string;
  accion: string;
  fechaHora: Date;
  ip: string;
  detalles?: string;
};

// Función para generar una IP aleatoria
const generateRandomIP = () => {
  return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
};

// Datos de ejemplo
const datosAuditoria: AuditoriaItem[] = [
  {
    id: '1',
    usuario: 'jperez',
    rol: 'Inspector',
    accion: 'Aprobó solicitud #12345',
    fechaHora: new Date(),
    ip: generateRandomIP(),
    detalles: 'Se aprobó la solicitud de salida con destino a Argentina.'
  },
  {
    id: '2',
    usuario: 'mrodriguez',
    rol: 'Administrador',
    accion: 'Actualizó configuración del sistema',
    fechaHora: new Date(Date.now() - 1000 * 60 * 30), // 30 minutos atrás
    ip: generateRandomIP(),
    detalles: 'Se actualizó el tiempo de expiración de sesión a 30 minutos.'
  },
  {
    id: '3',
    usuario: 'sistema',
    rol: 'Sistema',
    accion: 'Cierre de sesión inactivo',
    fechaHora: new Date(Date.now() - 1000 * 60 * 120), // 2 horas atrás
    ip: generateRandomIP(),
    detalles: 'Sesión cerrada por inactividad del usuario jperez.'
  },
  {
    id: '4',
    usuario: 'agarcia',
    rol: 'Supervisor',
    accion: 'Revisó documentación #12345',
    fechaHora: new Date(Date.now() - 1000 * 60 * 180), // 3 horas atrás
    ip: generateRandomIP(),
    detalles: 'Se revisó la documentación adjunta a la solicitud.'
  },
  {
    id: '5',
    usuario: 'sistema',
    rol: 'Sistema',
    accion: 'Copia de seguridad completada',
    fechaHora: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 día atrás
    ip: '127.0.0.1',
    detalles: 'Copia de seguridad de la base de datos completada exitosamente.'
  },
];

const Auditoria = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const toggleDetails = (id: string) => {
    setSelectedItem(selectedItem === id ? null : id);
  };

  const filteredData = datosAuditoria.filter(item => 
    item.usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.accion.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.rol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.ip.includes(searchTerm)
  );

  // Función para formatear fecha usando APIs nativas
  const formatDate = (date: Date) => {
    const fechaFormateada = date.toLocaleDateString('es-CL', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const horaFormateada = date.toLocaleTimeString('es-CL', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    
    // Capitalizar la primera letra del día de la semana
    const fechaCapitalizada = fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1);
    
    return `${fechaCapitalizada}, ${horaFormateada}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Auditoría del Sistema</h1>
          <p className="text-sm text-muted-foreground">
            Registro detallado de todas las acciones realizadas en el sistema
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar en registros..."
              className="w-full pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" className="shrink-0">
            <Filter className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" className="shrink-0">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-gray-50 dark:bg-gray-800">
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Usuario / Rol</TableHead>
              <TableHead>Acción</TableHead>
              <TableHead>IP</TableHead>
              <TableHead className="text-right">Fecha y Hora</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <React.Fragment key={item.id}>
                  <TableRow 
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    onClick={() => toggleDetails(item.id)}
                  >
                    <TableCell className="font-medium">{item.id}</TableCell>
                    <TableCell>
                      <div className="font-medium">{item.usuario}</div>
                      <div className="text-xs text-muted-foreground">{item.rol}</div>
                    </TableCell>
                    <TableCell>{item.accion}</TableCell>
                    <TableCell className="font-mono text-sm">{item.ip}</TableCell>
                    <TableCell className="text-right">
                      <div className="whitespace-nowrap">
                        {formatDate(item.fechaHora)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {selectedItem === item.id ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </TableCell>
                  </TableRow>
                  {selectedItem === item.id && (
                    <TableRow className="bg-gray-50 dark:bg-gray-800/30">
                      <TableCell colSpan={6} className="p-4">
                        <div className="text-sm">
                          <div className="font-medium mb-1">Detalles:</div>
                          <p className="text-muted-foreground">{item.detalles || 'No hay detalles adicionales disponibles.'}</p>
                          <div className="mt-2 text-xs text-muted-foreground">
                            <span className="font-medium">ID de evento:</span> {crypto.randomUUID()}
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No se encontraron registros que coincidan con la búsqueda.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-2 text-sm text-muted-foreground">
        <div>Mostrando {filteredData.length} de {datosAuditoria.length} registros</div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" disabled>
            Anterior
          </Button>
          <Button variant="outline" size="sm" disabled>
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Auditoria;