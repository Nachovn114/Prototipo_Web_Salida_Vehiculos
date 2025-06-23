import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Car } from 'lucide-react';
import { FormData } from '@/types/form';

interface DatosVehiculoProps {
  formData: FormData;
  errors: Partial<Record<keyof FormData, string>>;
  tiposVehiculo: string[];
  onFieldChange: (field: keyof FormData, value: any) => void;
}

const DatosVehiculo: React.FC<DatosVehiculoProps> = ({
  formData,
  errors,
  tiposVehiculo,
  onFieldChange
}) => {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-blue-700">
        <Car className="h-5 w-5" />
        Información del Vehículo (Opcional)
      </h2>
      
      {/* Tipo de vehículo */}
      <div className="mb-4">
        <Label htmlFor="tipoVehiculo" className="block text-sm font-medium text-gray-700 mb-1">
          Tipo de vehículo
        </Label>
        <Select
          value={formData.tipoVehiculo}
          onValueChange={(value) => onFieldChange('tipoVehiculo', value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Seleccione un tipo" />
          </SelectTrigger>
          <SelectContent>
            {tiposVehiculo.map((tipo) => (
              <SelectItem key={tipo} value={tipo}>
                {tipo}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Marca y modelo */}
      <div className="mb-4">
        <Label htmlFor="marca" className="block text-sm font-medium text-gray-700 mb-1">
          Marca y modelo
        </Label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Input
              id="marca"
              name="marca"
              value={formData.marca || ''}
              onChange={(e) => onFieldChange('marca', e.target.value)}
              placeholder="Marca (ej: Toyota)"
            />
          </div>
          <div>
            <Input
              id="modelo"
              name="modelo"
              value={formData.modelo || ''}
              onChange={(e) => onFieldChange('modelo', e.target.value)}
              placeholder="Modelo (ej: Hilux 2023)"
            />
          </div>
        </div>
      </div>
      
      {/* Patente */}
      <div className="mb-4">
        <Label htmlFor="patente" className="block text-sm font-medium text-gray-700 mb-1">
          Patente
        </Label>
        <Input
          id="patente"
          name="patente"
          value={formData.patente}
          onChange={(e) => {
            // Convertir a mayúsculas y limitar a 6 caracteres
            let value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
            onFieldChange('patente', value);
          }}
          placeholder="Ej: AB1234"
          className={errors.patente ? 'border-red-500' : ''}
          maxLength={6}
        />
        {errors.patente && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <span className="text-red-500">*</span>
            {errors.patente}
          </p>
        )}
      </div>
    </div>
  );
};

export default DatosVehiculo;
