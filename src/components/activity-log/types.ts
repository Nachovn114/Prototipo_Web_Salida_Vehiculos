export type User = {
  id: string;
  name: string;
  role: 'Administrador' | 'Inspector' | 'Sistema' | 'Supervisor';
  avatar?: string;
  department?: string;
};

export type ActionType = 'crear' | 'actualizar' | 'eliminar' | 'iniciar_sesion' | 'cerrar_sesion' | 'aprobar' | 'rechazar' | 'sistema';
export type ActionCategory = 'SALIDA_VEHICULO' | 'DOCUMENTO' | 'USUARIO' | 'SISTEMA' | 'AUDITORIA';
export type ActionSeverity = 'EXITO' | 'INFORMACION' | 'ADVERTENCIA' | 'ERROR';

export interface Action {
  type: ActionType;
  description: string;
  category: ActionCategory;
  severity: ActionSeverity;
}

export interface Metadata {
  ip: string;
  vehiclePlate?: string;
  documentId?: string;
  location: string;
  [key: string]: any;
}

export interface ActivityLogItem {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: 'Administrador' | 'Inspector' | 'Sistema' | 'Supervisor';
  userAvatar?: string;
  action: string;
  actionType: ActionType;
  category: ActionCategory;
  severity: ActionSeverity;
  ipAddress: string;
  location?: string;
  country: 'CL' | 'AR';
  metadata?: {
    documentId?: string;
    vehiclePlate?: string;
    borderCrossing?: string;
    location?: string;
    duration?: number;
    documentType?: string;
    vehiculo?: any;
  };
}

export interface ActivityLogFilters {
  type: string;
  category: string;
  severity: string;
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
}

export interface ActivityLogStats {
  total: number;
  byType: Record<string, number>;
  byCategory: Record<string, number>;
  bySeverity: Record<string, number>;
}
