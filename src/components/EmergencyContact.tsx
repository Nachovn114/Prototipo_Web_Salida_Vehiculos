
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, Shield, AlertTriangle, Hospital, Wrench } from 'lucide-react';
import { toast } from 'sonner';

export const EmergencyContact: React.FC = () => {
  const emergencyContacts = [
    {
      name: 'Emergencias Médicas',
      number: '131',
      icon: Hospital,
      color: 'text-red-600',
      description: 'SAMU - Servicio de Atención Médica'
    },
    {
      name: 'Carabineros',
      number: '133',
      icon: Shield,
      color: 'text-blue-600',
      description: 'Policía de Chile'
    },
    {
      name: 'Bomberos',
      number: '132',
      icon: AlertTriangle,
      color: 'text-orange-600',
      description: 'Cuerpo de Bomberos'
    },
    {
      name: 'Asistencia Vehicular',
      number: '+56 9 8765 4321',
      icon: Wrench,
      color: 'text-green-600',
      description: 'Grúa y mecánica 24/7'
    }
  ];

  const handleEmergencyCall = (name: string, number: string) => {
    toast.success(`Iniciando llamada a ${name}: ${number}`);
    // En una app real, esto abriría el marcador del teléfono
  };

  return (
    <Card className="modern-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Phone className="h-5 w-5 text-red-600" />
          <span>Contactos de Emergencia</span>
        </CardTitle>
        <CardDescription>
          Asistencia 24/7 en frontera
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {emergencyContacts.map((contact, index) => (
          <div key={index} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <contact.icon className={`h-5 w-5 ${contact.color}`} />
                <div>
                  <h5 className="font-medium text-sm">{contact.name}</h5>
                  <p className="text-xs text-gray-600">{contact.description}</p>
                </div>
              </div>
              <Button
                size="sm"
                onClick={() => handleEmergencyCall(contact.name, contact.number)}
                className="btn-primary"
              >
                Llamar
              </Button>
            </div>
            <div className="text-sm font-mono text-gray-700 bg-gray-100 px-2 py-1 rounded">
              {contact.number}
            </div>
          </div>
        ))}

        {/* Quick Actions */}
        <div className="space-y-3 pt-4 border-t">
          <h5 className="text-sm font-semibold text-gray-700">Acciones Rápidas</h5>
          
          <div className="grid grid-cols-1 gap-2">
            <Button variant="outline" size="sm" className="w-full justify-start">
              <AlertTriangle className="h-4 w-4 mr-2 text-yellow-600" />
              Reportar Incidente
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Shield className="h-4 w-4 mr-2 text-blue-600" />
              Solicitar Supervisor
            </Button>
          </div>
        </div>

        {/* Emergency Protocol */}
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-xs text-red-800 font-medium mb-1">
            🚨 Protocolo de Emergencia
          </p>
          <p className="text-xs text-red-700">
            En caso de emergencia grave, presione el botón de pánico en su radio portátil
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
