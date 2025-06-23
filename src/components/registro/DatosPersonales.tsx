import React from 'react';
import { FormData } from '@/types/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, User, Mail, Phone, MapPin } from 'lucide-react';
import { validateRut, formatRut } from '@/lib/validations';

type DatosPersonalesProps = {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  onRegionChange: (regionId: string) => void;
  errors: Partial<Record<keyof FormData, string>>;
  regiones: { id: string; nombre: string }[];
  comunas: { id: string; nombre: string; regionId: string }[];
};

export default function DatosPersonales({ 
  formData, 
  setFormData, 
  onRegionChange,
  errors,
  regiones,
  comunas 
}: DatosPersonalesProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    if (name === 'region') {
      onRegionChange(value);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleRutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formattedValue = formatRut(value);
    setFormData(prev => ({
      ...prev,
      rut: formattedValue
    }));
  };

  const handleRutBlur = () => {
    if (formData.rut && !validateRut(formData.rut)) {
      setFormData(prev => ({
        ...prev,
        rut: formData.rut
      }));
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Información Personal</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nombre">Nombres *</Label>
          <div className="relative">
            <Input
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className={errors.nombre ? 'border-red-500 pl-10' : 'pl-10'}
              placeholder="Ingresa tus nombres"
            />
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          {errors.nombre && <p className="text-sm text-red-500">{errors.nombre}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="apellido">Apellidos *</Label>
          <div className="relative">
            <Input
              id="apellido"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              className={errors.apellido ? 'border-red-500 pl-10' : 'pl-10'}
              placeholder="Ingresa tus apellidos"
            />
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          {errors.apellido && <p className="text-sm text-red-500">{errors.apellido}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="rut">RUT *</Label>
          <div className="relative">
            <Input
              id="rut"
              name="rut"
              value={formData.rut}
              onChange={handleRutChange}
              onBlur={handleRutBlur}
              className={errors.rut ? 'border-red-500 pl-10' : 'pl-10'}
              placeholder="12.345.678-9"
            />
            <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          {errors.rut && <p className="text-sm text-red-500">{errors.rut}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="fechaNacimiento">Fecha de Nacimiento *</Label>
          <div className="relative">
            <Input
              id="fechaNacimiento"
              name="fechaNacimiento"
              type="date"
              value={formData.fechaNacimiento}
              onChange={handleChange}
              className={errors.fechaNacimiento ? 'border-red-500 pl-10' : 'pl-10'}
            />
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          {errors.fechaNacimiento && <p className="text-sm text-red-500">{errors.fechaNacimiento}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="genero">Género *</Label>
          <Select 
            value={formData.genero} 
            onValueChange={(value) => handleSelectChange('genero', value)}
          >
            <SelectTrigger className={errors.genero ? 'border-red-500' : ''}>
              <SelectValue placeholder="Selecciona tu género" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="masculino">Masculino</SelectItem>
              <SelectItem value="femenino">Femenino</SelectItem>
              <SelectItem value="otro">Otro</SelectItem>
              <SelectItem value="prefiero-no-decir">Prefiero no decirlo</SelectItem>
            </SelectContent>
          </Select>
          {errors.genero && <p className="text-sm text-red-500">{errors.genero}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="nacionalidad">Nacionalidad *</Label>
          <div className="relative">
            <Input
              id="nacionalidad"
              name="nacionalidad"
              value={formData.nacionalidad}
              onChange={handleChange}
              className={errors.nacionalidad ? 'border-red-500 pl-10' : 'pl-10'}
              placeholder="Ej: Chilena"
            />
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          {errors.nacionalidad && <p className="text-sm text-red-500">{errors.nacionalidad}</p>}
        </div>
      </div>

      <h3 className="text-lg font-medium mt-8">Información de Contacto</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Correo Electrónico *</Label>
          <div className="relative">
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'border-red-500 pl-10' : 'pl-10'}
              placeholder="tucorreo@ejemplo.com"
            />
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="telefono">Teléfono *</Label>
          <div className="relative">
            <Input
              id="telefono"
              name="telefono"
              type="tel"
              value={formData.telefono}
              onChange={handleChange}
              className={errors.telefono ? 'border-red-500 pl-10' : 'pl-10'}
              placeholder="+56 9 1234 5678"
            />
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          {errors.telefono && <p className="text-sm text-red-500">{errors.telefono}</p>}
        </div>
      </div>

      <h3 className="text-lg font-medium mt-8">Dirección</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="direccion">Calle y Número *</Label>
          <div className="relative">
            <Input
              id="direccion"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              className={errors.direccion ? 'border-red-500 pl-10' : 'pl-10'}
              placeholder="Av. Principal 1234"
            />
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          {errors.direccion && <p className="text-sm text-red-500">{errors.direccion}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="region">Región *</Label>
          <Select 
            value={formData.region} 
            onValueChange={(value) => handleSelectChange('region', value)}
          >
            <SelectTrigger className={errors.region ? 'border-red-500' : ''}>
              <SelectValue placeholder="Selecciona una región" />
            </SelectTrigger>
            <SelectContent>
              {regiones.map((region) => (
                <SelectItem key={region.id} value={region.id}>
                  {region.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.region && <p className="text-sm text-red-500">{errors.region}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="ciudad">Comuna *</Label>
          <Select 
            value={formData.ciudad} 
            onValueChange={(value) => handleSelectChange('ciudad', value)}
            disabled={!formData.region}
          >
            <SelectTrigger className={errors.ciudad ? 'border-red-500' : ''}>
              <SelectValue placeholder={formData.region ? "Selecciona una comuna" : "Primero selecciona una región"} />
            </SelectTrigger>
            <SelectContent>
              {comunas
                .filter(comuna => comuna.regionId === formData.region)
                .map((comuna) => (
                  <SelectItem key={comuna.id} value={comuna.nombre}>
                    {comuna.nombre}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          {errors.ciudad && <p className="text-sm text-red-500">{errors.ciudad}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="pais">País *</Label>
          <div className="relative">
            <Input
              id="pais"
              name="pais"
              value={formData.pais}
              onChange={handleChange}
              className={errors.pais ? 'border-red-500 pl-10' : 'pl-10'}
              placeholder="Ej: Chile"
            />
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          {errors.pais && <p className="text-sm text-red-500">{errors.pais}</p>}
        </div>
      </div>
    </div>
  );
}
