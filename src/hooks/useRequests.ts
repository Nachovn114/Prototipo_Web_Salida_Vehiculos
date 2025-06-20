import { useState, useCallback } from 'react';
import { notifyHighRiskVehicle, notifyStatusChange } from '@/services/notificationService';

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
  riesgo: 'bajo' | 'medio' | 'alto' | 'urgente';
}

// Función para calcular el riesgo
function calcularRiesgo(request: Omit<Request, 'riesgo' | 'id' | 'progreso'> & { documentos: string[], observaciones: string, prioridad: string }): 'bajo' | 'medio' | 'alto' | 'urgente' {
  if (request.prioridad === 'alta' || /urgente/i.test(request.observaciones)) return 'urgente';
  if (/falta|vencid/i.test(request.observaciones)) return 'alto';
  if (request.documentos.length < 4 || /verificaci/i.test(request.observaciones)) return 'medio';
  return 'bajo';
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
    observaciones: 'Falta Revisión Técnica',
    riesgo: 'alto',
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
    observaciones: 'En proceso de verificación final. Vehículo con alerta de seguridad previa.',
    riesgo: 'urgente',
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
    observaciones: 'Solicitud aprobada. Puede proceder al cruce.',
    riesgo: 'bajo',
  }
];

export const useRequests = () => {
  const [requests, setRequests] = useState<Request[]>(initialRequests);

  const addRequest = useCallback((newRequest: Omit<Request, 'id' | 'progreso' | 'riesgo'>) => {
    const riesgo = calcularRiesgo(newRequest);
    const request: Request = {
      ...newRequest,
      id: Date.now(),
      progreso: 0,
      riesgo,
    };
    setRequests(prev => [request, ...prev]);

    if (riesgo === 'alto' || riesgo === 'urgente') {
      // Usamos un timeout para simular que la notificación llega tras un breve análisis
      setTimeout(() => notifyHighRiskVehicle(request.patente, riesgo), 1000);
    }

    return request;
  }, []);

  const updateRequest = useCallback((id: number, updates: Partial<Request>) => {
    let updatedRequest: Request | undefined;

    setRequests(prev => 
      prev.map(request => {
        if (request.id === id) {
          const originalStatus = request.estado;
          const newRisk = updates.riesgo || calcularRiesgo({ ...request, ...updates });
          updatedRequest = { ...request, ...updates, riesgo: newRisk };

          // Notificar si el riesgo es alto o urgente
          if (newRisk === 'alto' || newRisk === 'urgente') {
            setTimeout(() => notifyHighRiskVehicle(updatedRequest!.patente, newRisk), 500);
          }

          // Notificar si el estado cambió
          if (updates.estado && updates.estado !== originalStatus) {
            setTimeout(() => notifyStatusChange(updatedRequest!.patente, updates.estado!), 500);
          }
          
          return updatedRequest;
        }
        return request;
      })
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
