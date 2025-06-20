import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, Clock, ShieldAlert, UserCheck, CheckCircle } from 'lucide-react';
import { Anomaly, detectAnomalies } from '@/services/anomalyDetectionService';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { motion, AnimatePresence } from 'framer-motion';

const anomalyIcons = {
  'Tiempo de Cruce': <Clock className="h-5 w-5" />,
  'Concentración de Riesgo': <ShieldAlert className="h-5 w-5" />,
  'Rendimiento Inspector': <UserCheck className="h-5 w-5" />,
  'Procedimiento': <AlertTriangle className="h-5 w-5" />,
};

const severityColors = {
  'Alta': 'bg-red-500 border-red-700 text-white',
  'Media': 'bg-yellow-400 border-yellow-600 text-yellow-900',
  'Baja': 'bg-blue-400 border-blue-600 text-white',
};

const AnomalyItem: React.FC<{ anomaly: Anomaly, index: number }> = ({ anomaly, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    className="flex items-start gap-4 p-4 rounded-lg bg-card hover:bg-muted/50 transition-colors"
  >
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${severityColors[anomaly.severity]}`}>
            {React.cloneElement(anomalyIcons[anomaly.type] || <AlertTriangle />, { className: "h-5 w-5" })}
          </div>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>Severidad: {anomaly.severity}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
    <div className="flex-1">
      <p className="font-bold text-sm text-foreground">{anomaly.title}</p>
      <p className="text-sm text-muted-foreground">{anomaly.description}</p>
      <p className="text-xs text-primary font-semibold mt-1 italic">Recomendación: {anomaly.recommendation}</p>
      <div className="text-right text-xs text-muted-foreground mt-2">
        {new Date(anomaly.timestamp).toLocaleString('es-ES')}
      </div>
    </div>
  </motion.div>
);

const AnomalyDetectionWidget = () => {
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnomalies = async () => {
      setLoading(true);
      try {
        const result = await detectAnomalies();
        setAnomalies(result);
      } catch (error) {
        console.error("Failed to detect anomalies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnomalies();
  }, []);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-primary" />
          <span>Detección de Anomalías (IA)</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <AnimatePresence>
            {anomalies.length > 0 ? (
              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                {anomalies.map((anomaly, i) => (
                  <AnomalyItem key={anomaly.id} anomaly={anomaly} index={i} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                <h3 className="mt-2 text-sm font-medium text-foreground">Todo en orden</h3>
                <p className="mt-1 text-sm text-muted-foreground">No se han detectado anomalías significativas.</p>
              </div>
            )}
          </AnimatePresence>
        )}
      </CardContent>
    </Card>
  );
};

export default AnomalyDetectionWidget; 