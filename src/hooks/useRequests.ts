
import { useState, useCallback } from 'react';

export interface Request {
  id: number;
  patente: string;
  estado: 'Pendiente' | 'Verificando' | 'Aprobado' | 'Rechazado';
  conductor: string;
  destino: string;
  fecha: string;
  pasajeros: number;
  tiempo: string;
  prioridad: 'normal' | 'alta' | 'baja';
  progreso: number;
  documentos: string[];
  observaciones: string;
}

const initialRequests: Request[] = [
  { 
    id: 1, 
    patente: 'ABCD-12', 
    estado: 'Pendiente', 
    conductor: 'Juan Pérez González',
    destino: 'Buenos Aires, Argentina',
    fecha: '2024-06-20',
    pasajeros: 3,
    tiempo: '14:30',
    prioridad: 'normal',
    progreso: 25,
    documentos: ['RUT', 'Licencia', 'SOAP'],
    observaciones: 'Falta Revisión Técnica'
  },
  { 
    id: 2, 
    patente: 'EFGH-34', 
    estado: 'Verificando', 
    conductor: 'María Silva Rodríguez',
    destino: 'Mendoza, Argentina',
    fecha: '2024-06-20',
    pasajeros: 2,
    tiempo: '15:45',
    prioridad: 'alta',
    progreso: 75,
    documentos: ['RUT', 'Licencia', 'SOAP', 'Revisión Técnica'],
    observaciones: 'En proceso de verificación final'
  },
  { 
    id: 3, 
    patente: 'IJKL-56', 
    estado: 'Aprobado', 
    conductor: 'Carlos Rodríguez',
    destino: 'Córdoba, Argentina',
    fecha: '2024-06-19',
    pasajeros: 1,
    tiempo: '09:20',
    prioridad: 'normal',
    progreso: 100,
    documentos: ['RUT', 'Licencia', 'SOAP', 'Revisión Técnica'],
    observaciones: 'Solicitud aprobada. Puede proceder al cruce.'
  }
];

export const useRequests = () => {
  const [requests, setRequests] = useState<Request[]>(initialRequests);

  const addRequest = useCallback((newRequest: Omit<Request, 'id' | 'progreso'>) => {
    const request: Request = {
      ...newRequest,
      id: Date.now(),
      progreso: 0,
    };
    setRequests(prev => [request, ...prev]);
    return request;
  }, []);

  const updateRequest = useCallback((id: number, updates: Partial<Request>) => {
    setRequests(prev => 
      prev.map(request => 
        request.id === id 
          ? { ...request, ...updates }
          : request
      )
    );
  }, []);

  const getRequestById = useCallback((id: number) => {
    return requests.find(request => request.id === id);
  }, [requests]);

  const getRequestsByStatus = useCallback((estado: Request['estado']) => {
    return requests.filter(request => request.estado === estado);
  }, [requests]);

  return {
    requests,
    addRequest,
    updateRequest,
    getRequestById,
    getRequestsByStatus
  };
};
