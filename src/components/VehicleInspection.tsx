import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Car, QrCode, FileCheck, Loader2 } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { toast } from 'sonner';

// Datos para generación automática
const marcasModelos = [
  { marca: 'Toyota', modelos: ['Yaris', 'Corolla', 'Hilux', 'RAV4', 'Fortuner'] },
  { marca: 'Hyundai', modelos: ['Accent', 'Tucson', 'Creta', 'Elantra', 'Santa Fe'] },
  { marca: 'Chevrolet', modelos: ['Sail', 'Onix', 'Tracker', 'S10', 'Colorado'] },
  { marca: 'Kia', modelos: ['Rio', 'Seltos', 'Sportage', 'Sorento', 'Carnival'] },
  { marca: 'Nissan', modelos: ['Versa', 'Kicks', 'Qashqai', 'X-Trail', 'Frontier'] },
];

const nombresChilenos = [
  'Juan', 'María', 'Pedro', 'Ana', 'Carlos', 'Laura', 'Diego', 'Camila', 'Javier', 'Valentina',
  'Sebastián', 'Isidora', 'Matías', 'Sofía', 'Benjamín', 'Martina', 'Vicente', 'Emilia', 'Tomás', 'Emma'
];

const apellidosChilenos = [
  'González', 'Muñoz', 'Rojas', 'Díaz', 'Pérez', 'Soto', 'Contreras', 'Silva', 'Martínez', 'Sepúlveda',
  'Morales', 'Rodríguez', 'López', 'Fuentes', 'Hernández', 'Torres', 'Araya', 'Flores', 'Espinoza', 'Valenzuela'
];

// Función para obtener un elemento aleatorio de un array
const getRandom = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];

// Función para generar un nombre completo aleatorio
const generarNombreCompleto = () => {
  return `${getRandom(nombresChilenos)} ${getRandom(apellidosChilenos)} ${getRandom(apellidosChilenos)}`;
};

// Función para generar una patente chilena aleatoria
const generarPatente = () => {
  const letras = 'BCDFGHJKLMNPRSTVWXYZ';
  const numeros = '0123456789';
  let patente = '';
  
  // Formato: BB-BB-00 o B-BB-BB-00
  if (Math.random() > 0.5) {
    // Formato BB-BB-00
    for (let i = 0; i < 4; i++) {
      patente += letras.charAt(Math.floor(Math.random() * letras.length));
      if (i === 1) patente += '-';
    }
    patente += '-';
    for (let i = 0; i < 2; i++) {
      patente += numeros.charAt(Math.floor(Math.random() * numeros.length));
    }
  } else {
    // Formato B-BB-BB-00
    patente = `${letras.charAt(Math.floor(Math.random() * letras.length))}-`;
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 2; j++) {
        patente += letras.charAt(Math.floor(Math.random() * letras.length));
      }
      patente += '-';
    }
    for (let i = 0; i < 2; i++) {
      patente += numeros.charAt(Math.floor(Math.random() * numeros.length));
    }
  }
  
  return patente;
};

export const VehicleInspection: React.FC = () => {
  const [loading, setLoading] = useState(true);
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

  // Generar datos aleatorios al cargar el componente
  useEffect(() => {
    // Generar datos de inmediato sin retraso
    const marcaModelo = getRandom(marcasModelos);
    const marca = marcaModelo.marca;
    const modelo = getRandom(marcaModelo.modelos);
    
    setVehicleData({
      patente: generarPatente(),
      marca,
      modelo,
      año: (2000 + Math.floor(Math.random() * 25)).toString(),
      conductor: generarNombreCompleto(),
      pasaporte: `AB${Math.floor(100000 + Math.random() * 900000)}`
    });

    // Marcar aleatoriamente algunos ítems de inspección
    setInspectionItems(prev => 
      prev.map(item => ({
        ...item,
        checked: Math.random() > 0.3 // 70% de probabilidad de estar marcado
      }))
    );

    setStatus('Pendiente');
    setLoading(false);
  }, []);

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
    <AnimatePresence mode="wait">
      {loading ? (
        <div className="flex justify-center items-center p-8">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
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
              <div className="space-y-4">
                <h4 className="font-semibold text-sm text-gray-700">Información del Vehículo</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="patente">Patente</Label>
                    <Input
                      id="patente"
                      value={vehicleData.patente}
                      onChange={(e) => handleInputChange('patente', e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="marca">Marca</Label>
                    <Input
                      id="marca"
                      value={vehicleData.marca}
                      onChange={(e) => handleInputChange('marca', e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="modelo">Modelo</Label>
                    <Input
                      id="modelo"
                      value={vehicleData.modelo}
                      onChange={(e) => handleInputChange('modelo', e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="año">Año</Label>
                    <Input
                      id="año"
                      value={vehicleData.año}
                      onChange={(e) => handleInputChange('año', e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="conductor">Conductor</Label>
                    <Input
                      id="conductor"
                      value={vehicleData.conductor}
                      onChange={(e) => handleInputChange('conductor', e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pasaporte">N° Pasaporte o Cédula</Label>
                    <Input
                      id="pasaporte"
                      value={vehicleData.pasaporte}
                      onChange={(e) => handleInputChange('pasaporte', e.target.value)}
                      className="form-input"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-sm text-gray-700">Lista de Verificación</h4>
                <div className="space-y-3">
                  {inspectionItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <Checkbox
                        id={`item-${item.id}`}
                        checked={item.checked}
                        onCheckedChange={(checked) => handleCheckboxChange(item.id, checked as boolean)}
                      />
                      <Label htmlFor={`item-${item.id}`} className="text-sm font-normal">
                        {item.item}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="observations">Observaciones</Label>
                <Textarea
                  id="observations"
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">Estado:</span>
                  <StatusBadge status={status} />
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <Button variant="outline" size="sm" onClick={generateQRCode}>
                    <QrCode className="h-4 w-4 mr-2" />
                    Generar QR
                  </Button>
                  <Button size="sm" onClick={handleSubmitInspection}>
                    <FileCheck className="h-4 w-4 mr-2" />
                    Finalizar Inspección
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VehicleInspection;
