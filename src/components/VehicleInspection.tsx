
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Car, QrCode, Camera, FileCheck } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { toast } from 'sonner';

export const VehicleInspection: React.FC = () => {
  const [vehicleData, setVehicleData] = useState({
    patente: '',
    marca: '',
    modelo: '',
    año: '',
    conductor: '',
    pasaporte: ''
  });

  const [inspectionItems, setInspectionItems] = useState([
    { id: 1, item: 'Documentación vehicular completa', checked: false },
    { id: 2, item: 'Revisión técnica vigente', checked: false },
    { id: 3, item: 'Seguro obligatorio vigente', checked: false },
    { id: 4, item: 'Permiso de circulación al día', checked: false },
    { id: 5, item: 'Identificación del conductor', checked: false },
    { id: 6, item: 'Inspección visual del vehículo', checked: false },
    { id: 7, item: 'Verificación de carga (si aplica)', checked: false }
  ]);

  const [observations, setObservations] = useState('');
  const [status, setStatus] = useState<'Pendiente' | 'Verificando' | 'Aprobado' | 'Rechazado'>('Pendiente');

  const handleInputChange = (field: string, value: string) => {
    setVehicleData(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (id: number, checked: boolean) => {
    setInspectionItems(prev =>
      prev.map(item => item.id === id ? { ...item, checked } : item)
    );
  };

  const handleSubmitInspection = () => {
    const completedItems = inspectionItems.filter(item => item.checked).length;
    const totalItems = inspectionItems.length;

    if (completedItems === totalItems) {
      setStatus('Aprobado');
      toast.success('Inspección completada y aprobada');
    } else if (completedItems > totalItems * 0.7) {
      setStatus('Verificando');
      toast.warning('Inspección requiere verificación adicional');
    } else {
      setStatus('Rechazado');
      toast.error('Inspección no cumple con los requisitos mínimos');
    }
  };

  const generateQRCode = () => {
    toast.success('Código QR generado para el vehículo');
  };

  return (
    <Card className="modern-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Car className="h-5 w-5 text-blue-600" />
          <span>Inspección Vehicular</span>
        </CardTitle>
        <CardDescription>
          Control de salida - Frontera Los Libertadores
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Vehicle Information */}
        <div className="space-y-4">
          <h4 className="font-semibold text-sm text-gray-700">Información del Vehículo</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="patente">Patente</Label>
              <Input
                id="patente"
                placeholder="ABCD-12"
                value={vehicleData.patente}
                onChange={(e) => handleInputChange('patente', e.target.value)}
                className="form-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="marca">Marca</Label>
              <Input
                id="marca"
                placeholder="Toyota"
                value={vehicleData.marca}
                onChange={(e) => handleInputChange('marca', e.target.value)}
                className="form-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="modelo">Modelo</Label>
              <Input
                id="modelo"
                placeholder="Corolla"
                value={vehicleData.modelo}
                onChange={(e) => handleInputChange('modelo', e.target.value)}
                className="form-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="año">Año</Label>
              <Input
                id="año"
                placeholder="2020"
                value={vehicleData.año}
                onChange={(e) => handleInputChange('año', e.target.value)}
                className="form-input"
              />
            </div>
          </div>
        </div>

        {/* Driver Information */}
        <div className="space-y-4">
          <h4 className="font-semibold text-sm text-gray-700">Información del Conductor</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="conductor">Nombre Completo</Label>
              <Input
                id="conductor"
                placeholder="Juan Pérez González"
                value={vehicleData.conductor}
                onChange={(e) => handleInputChange('conductor', e.target.value)}
                className="form-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pasaporte">Documento/Pasaporte</Label>
              <Input
                id="pasaporte"
                placeholder="12.345.678-9"
                value={vehicleData.pasaporte}
                onChange={(e) => handleInputChange('pasaporte', e.target.value)}
                className="form-input"
              />
            </div>
          </div>
        </div>

        {/* Inspection Checklist */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm text-gray-700">Lista de Verificación</h4>
            <StatusBadge status={status} />
          </div>
          
          <div className="space-y-3">
            {inspectionItems.map((item) => (
              <div key={item.id} className="flex items-center space-x-3">
                <Checkbox
                  id={`item-${item.id}`}
                  checked={item.checked}
                  onCheckedChange={(checked) => handleCheckboxChange(item.id, !!checked)}
                />
                <Label
                  htmlFor={`item-${item.id}`}
                  className={`text-sm ${item.checked ? 'text-green-700' : 'text-gray-700'}`}
                >
                  {item.item}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Observations */}
        <div className="space-y-2">
          <Label htmlFor="observations">Observaciones</Label>
          <Textarea
            id="observations"
            placeholder="Ingrese observaciones adicionales..."
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
            className="form-input min-h-20"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={handleSubmitInspection} className="btn-primary flex-1">
            <FileCheck className="h-4 w-4 mr-2" />
            Completar Inspección
          </Button>
          <Button variant="outline" onClick={generateQRCode} className="flex-1">
            <QrCode className="h-4 w-4 mr-2" />
            Generar QR
          </Button>
          <Button variant="outline" className="flex-1">
            <Camera className="h-4 w-4 mr-2" />
            Capturar Foto
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
