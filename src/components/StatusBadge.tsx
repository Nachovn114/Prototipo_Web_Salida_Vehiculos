
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, XCircle, Clock } from 'lucide-react';

interface StatusBadgeProps {
  status: 'Pendiente' | 'Verificando' | 'Aprobado' | 'Rechazado';
  priority?: 'normal' | 'alta' | 'baja';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  priority = 'normal',
  className = '' 
}) => {
  const getStatusStyles = (status: string, priority: string) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition-all duration-200";
    
    switch (status) {
      case 'Aprobado': 
        return `${baseClasses} status-approved glow-green`;
      case 'Rechazado': 
        return `${baseClasses} status-rejected glow-red`;
      case 'Verificando': 
        return `${baseClasses} status-reviewing ${priority === 'alta' ? 'glow-blue' : ''}`;
      default: 
        return `${baseClasses} status-pending`;
    }
  };
  
  const getIcon = (status: string) => {
    switch (status) {
      case 'Aprobado': return <CheckCircle size={12} />;
      case 'Rechazado': return <XCircle size={12} />;
      case 'Verificando': return <AlertCircle size={12} />;
      default: return <Clock size={12} />;
    }
  };
  
  return (
    <Badge className={`${getStatusStyles(status, priority)} ${className}`}>
      {getIcon(status)}
      {status}
    </Badge>
  );
};
