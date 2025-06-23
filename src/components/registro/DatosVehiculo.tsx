import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

// Tipos
type FormData = {
  patente: string;
  marca: string;
  modelo: string;
  anio: string;
  color: string;
  numeroMotor: string;
  numeroChasis: string;
  tipoVehiculo: string;
  capacidadCarga: string;
};

interface DatosVehiculoProps {
  formData: FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  errors: Record<string, string | undefined>;
}

// Opciones para los selects
const tiposVehiculo = [
  'Automóvil',
  'Camioneta',
  'Camión',
  'Jeep',
  'Furgón',
  'Bus',
  'Buseta',
  'Minibús',
  'Moto',
  'Otro'
];

const colores = [
  'Blanco',
  'Negro',
  'Gris',
  'Plata',
  'Azul',
  'Rojo',
  'Verde',
  'Amarillo',
  'Naranjo',
  'Café',
  'Otro'
];

const DatosVehiculo: React.FC<DatosVehiculoProps> = ({
  formData,
  onChange,
  errors
}) => {
  // Generar años (últimos 30 años)
  const anioActual = new Date().getFullYear();
  const anios = Array.from({ length: 30 }, (_, i) => (anioActual - i).toString());

  // Formatear patente (ej: AB123CD)
  const handlePatenteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.toUpperCase();
    
    // Limitar a 6 caracteres (2 letras, 2-4 números, 2 letras)
    if (value.length > 6) {
      value = value.slice(0, 6);
    }
    
    // Aplicar formato: AB123CD
    if (value.length > 4) {
      value = value.replace(/([A-Za-z]{2})(\d{1,4})([A-Za-z]{0,2})/, (_, p1, p2, p3) => {
        return p1 + p2 + p3;
      });
    }
    
    onChange({
      ...e,
      target: {
        ...e.target,
        name: 'patente',
        value: value
      }
    } as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <div className="space-y-6" data-name="DatosVehiculo">
      <h3 className="text-lg font-medium">Información del Vehículo</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Patente */}
        <div className="space-y-2">
          <Label htmlFor="patente" className={cn(errors.patente && 'text-destructive')}>
            Patente *
          </Label>
          <Input
            id="patente"
            name="patente"
            value={formData.patente}
            onChange={handlePatenteChange}
            placeholder="AB123CD"
            className={cn('uppercase', errors.patente && 'border-destructive')}
            maxLength={7}
          />
          {errors.patente && (
            <p className="text-sm text-destructive">{errors.patente}</p>
          )}
        </div>

        {/* Tipo de Vehículo */}
        <div className="space-y-2">
          <Label htmlFor="tipoVehiculo" className={cn(errors.tipoVehiculo && 'text-destructive')}>
            Tipo de Vehículo *
          </Label>
          <Select
            value={formData.tipoVehiculo}
            onValueChange={(value) => 
              onChange({
                target: { name: 'tipoVehiculo', value }
              } as React.ChangeEvent<HTMLSelectElement>)
            }
          >
            <SelectTrigger className={cn(
              'w-full',
              errors.tipoVehiculo && 'border-destructive'
            )}>
              <SelectValue placeholder="Selecciona el tipo de vehículo" />
            </SelectTrigger>
            <SelectContent>
              {tiposVehiculo.map((tipo) => (
                <SelectItem key={tipo} value={tipo}>
                  {tipo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.tipoVehiculo && (
            <p className="text-sm text-destructive">{errors.tipoVehiculo}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Marca */}
        <div className="space-y-2">
          <Label htmlFor="marca" className={cn(errors.marca && 'text-destructive')}>
            Marca *
          </Label>
          <Input
            id="marca"
            name="marca"
            value={formData.marca}
            onChange={onChange}
            placeholder="Ej: Toyota"
            className={cn(errors.marca && 'border-destructive')}
          />
          {errors.marca && (
            <p className="text-sm text-destructive">{errors.marca}</p>
          )}
        </div>

        {/* Modelo */}
        <div className="space-y-2">
          <Label htmlFor="modelo" className={cn(errors.modelo && 'text-destructive')}>
            Modelo *
          </Label>
          <Input
            id="modelo"
            name="modelo"
            value={formData.modelo}
            onChange={onChange}
            placeholder="Ej: Corolla"
            className={cn(errors.modelo && 'border-destructive')}
          />
          {errors.modelo && (
            <p className="text-sm text-destructive">{errors.modelo}</p>
          )}
        </div>

        {/* Año */}
        <div className="space-y-2">
          <Label htmlFor="anio" className={cn(errors.anio && 'text-destructive')}>
            Año *
          </Label>
          <Select
            value={formData.anio}
            onValueChange={(value) => 
              onChange({
                target: { name: 'anio', value }
              } as React.ChangeEvent<HTMLSelectElement>)
            }
          >
            <SelectTrigger className={cn(
              'w-full',
              errors.anio && 'border-destructive'
            )}>
              <SelectValue placeholder="Selecciona el año" />
            </SelectTrigger>
            <SelectContent>
              {anios.map((anio) => (
                <SelectItem key={anio} value={anio}>
                  {anio}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.anio && (
            <p className="text-sm text-destructive">{errors.anio}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Color */}
        <div className="space-y-2">
          <Label htmlFor="color" className={cn(errors.color && 'text-destructive')}>
            Color *
          </Label>
          <Select
            value={formData.color}
            onValueChange={(value) => 
              onChange({
                target: { name: 'color', value }
              } as React.ChangeEvent<HTMLSelectElement>)
            }
          >
            <SelectTrigger className={cn(
              'w-full',
              errors.color && 'border-destructive'
            )}>
              <SelectValue placeholder="Selecciona el color" />
            </SelectTrigger>
            <SelectContent>
              {colores.map((color) => (
                <SelectItem key={color} value={color}>
                  {color}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.color && (
            <p className="text-sm text-destructive">{errors.color}</p>
          )}
        </div>

        {/* Número de Motor */}
        <div className="space-y-2">
          <Label htmlFor="numeroMotor" className={cn(errors.numeroMotor && 'text-destructive')}>
            Número de Motor *
          </Label>
          <Input
            id="numeroMotor"
            name="numeroMotor"
            value={formData.numeroMotor}
            onChange={onChange}
            placeholder="Ej: ABC123456789"
            className={cn('uppercase', errors.numeroMotor && 'border-destructive')}
          />
          {errors.numeroMotor && (
            <p className="text-sm text-destructive">{errors.numeroMotor}</p>
          )}
        </div>

        {/* Número de Chasis */}
        <div className="space-y-2">
          <Label htmlFor="numeroChasis" className={cn(errors.numeroChasis && 'text-destructive')}>
            Número de Chasis *
          </Label>
          <Input
            id="numeroChasis"
            name="numeroChasis"
            value={formData.numeroChasis}
            onChange={onChange}
            placeholder="Ej: 9BWZZZ377VT004251"
            className={cn('uppercase', errors.numeroChasis && 'border-destructive')}
          />
          {errors.numeroChasis && (
            <p className="text-sm text-destructive">{errors.numeroChasis}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Capacidad de Carga */}
        <div className="space-y-2">
          <Label htmlFor="capacidadCarga" className={cn(errors.capacidadCarga && 'text-destructive')}>
            Capacidad de Carga (kg) *
          </Label>
          <div className="relative">
            <Input
              id="capacidadCarga"
              name="capacidadCarga"
              type="number"
              min="0"
              step="0.01"
              value={formData.capacidadCarga}
              onChange={(e) => {
                // Solo permite números y un punto decimal
                const value = e.target.value.replace(/[^0-9.]/g, '');
                onChange({
                  ...e,
                  target: {
                    ...e.target,
                    name: 'capacidadCarga',
                    value
                  }
                } as React.ChangeEvent<HTMLInputElement>);
              }}
              placeholder="Ej: 500"
              className={cn('pl-12', errors.capacidadCarga && 'border-destructive')}
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              kg
            </span>
          </div>
          {errors.capacidadCarga && (
            <p className="text-sm text-destructive">{errors.capacidadCarga}</p>
          )}
        </div>
      </div>

      <div className="pt-4 border-t">
        <div className="bg-blue-50 p-4 rounded-md">
          <h4 className="font-medium text-blue-800 mb-2">Importante</h4>
          <p className="text-sm text-blue-700">
            La información del vehículo debe coincidir exactamente con la registrada en los documentos oficiales.
            Asegúrate de que todos los datos sean correctos antes de continuar.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DatosVehiculo;
