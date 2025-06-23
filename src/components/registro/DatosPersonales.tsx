import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

import { DatosRegistroConductor } from '../../pages/RegistroConductor';

interface DatosPersonalesProps {
  formData: DatosRegistroConductor;
  setFormData: React.Dispatch<React.SetStateAction<DatosRegistroConductor>>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors: Record<string, string | undefined>;
  regiones: Array<{ id: string; nombre: string }>;
  comunas: Array<{ id: string; nombre: string; regionId: string }>;
  onRegionChange: (regionId: string) => void;
}

const DatosPersonales: React.FC<DatosPersonalesProps> = ({
  formData,
  setFormData,
  onChange,
  onFileChange: _onFileChange,
  errors,
  regiones,
  comunas,
  onRegionChange
}) => {
  const handleRegionChange = (value: string) => {
    onRegionChange(value);
    
    // Encontrar la primera comuna de la región seleccionada
    const primeraComuna = comunas.find(comuna => comuna.regionId === value);
    
    if (primeraComuna) {
      // Actualizar el estado del formulario con la primera comuna
      setFormData(prev => ({
        ...prev,
        comuna: primeraComuna.id
      }));
    } else {
      // Si no hay comunas, limpiar la selección
      setFormData(prev => ({
        ...prev,
        comuna: ''
      }));
    }
  };

  const handleNacionalidadChange = (value: string) => {
    // Actualizar la nacionalidad
    onChange({
      target: {
        name: 'nacionalidad',
        value
      }
    } as React.ChangeEvent<HTMLSelectElement>);

    // Actualizar el país según la nacionalidad
    let pais = 'Otro';
    if (value === 'Chilena') pais = 'Chile';
    if (value === 'Argentina') pais = 'Argentina';
    
    setFormData(prev => ({
      ...prev,
      pais
    }));
  };

  // Función para calcular el dígito verificador de un RUT chileno
  const calcularDigitoVerificador = (rut: string): string => {
    // Limpiar RUT y convertir a mayúsculas
    rut = rut.replace(/\./g, '').replace(/-/g, '').toUpperCase();
    
    // Separar número y dígito verificador
    const rutSinDv = rut.slice(0, -1);
    const dvIngresado = rut.slice(-1);
    
    // Calcular dígito verificador
    let suma = 0;
    let multiplicador = 2;
    
    for (let i = rutSinDv.length - 1; i >= 0; i--) {
      suma += parseInt(rutSinDv.charAt(i)) * multiplicador;
      multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }
    
    const resto = suma % 11;
    let dvCalculado = 11 - resto;
    
    if (dvCalculado === 10) return 'K';
    if (dvCalculado === 11) return '0';
    return dvCalculado.toString();
  };

  // Función para formatear RUT con puntos y guión
  const formatearRut = (rut: string): string => {
    // Limpiar y convertir a mayúsculas
    rut = rut.replace(/\./g, '').replace(/-/g, '').toUpperCase();
    
    if (rut.length === 0) return '';
    
    // Separar número y dígito verificador
    const rutSinDv = rut.slice(0, -1);
    const dv = rut.slice(-1);
    
    // Formatear con puntos
    let rutFormateado = '';
    let contador = 0;
    
    for (let i = rutSinDv.length - 1; i >= 0; i--) {
      rutFormateado = rutSinDv.charAt(i) + rutFormateado;
      contador++;
      if (contador === 3 && i > 0) {
        rutFormateado = '.' + rutFormateado;
        contador = 0;
      }
    }
    
    return rutFormateado + '-' + dv;
  };

  // Función para generar un RUT chileno realista
  const generarRutAleatorio = (): string => {
    // Rango de RUTs realistas (entre 10.000.000 y 25.000.000 aprox.)
    const minRut = 10000000; // 10.000.000
    const maxRut = 25000000; // 25.000.000
    
    // Generar número aleatorio en el rango
    const numero = Math.floor(Math.random() * (maxRut - minRut + 1)) + minRut;
    const rutSinDv = numero.toString();
    
    // Calcular dígito verificador
    const dv = calcularDigitoVerificador(rutSinDv + '0'); // Agregamos un 0 temporal
    
    // Formatear RUT
    return formatearRut(rutSinDv + dv);
  };

  // Generar RUT aleatorio al cargar el componente
  React.useEffect(() => {
    if (!formData.rut) {
      // Rango de RUTs realistas (entre 1.000.000 y 20.000.000 aprox.)
      const minRut = 1000000;  // 1.000.000
      const maxRut = 20000000; // 20.000.000
      
      // Asegurar que el número tenga exactamente 7 dígitos
      let rutSinDv = '';
      do {
        const numero = Math.floor(Math.random() * (maxRut - minRut + 1)) + minRut;
        rutSinDv = numero.toString().padStart(7, '0');
      } while (rutSinDv.length !== 7);
      
      // Calcular dígito verificador
      let suma = 0;
      let multiplicador = 2;
      
      for (let i = rutSinDv.length - 1; i >= 0; i--) {
        suma += parseInt(rutSinDv.charAt(i)) * multiplicador;
        multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
      }
      
      const resto = suma % 11;
      let dv = (11 - resto).toString();
      if (dv === '10') dv = 'K';
      if (dv === '11') dv = '0';
      
      // Formatear RUT con puntos y guión
      const rutFormateado = 
        rutSinDv.slice(0, 1) + 
        '.' + 
        rutSinDv.slice(1, 4) + 
        '.' + 
        rutSinDv.slice(4, 7) + 
        '-' + 
        dv;
      
      // Actualizar el estado del formulario con el RUT formateado
      setFormData(prev => ({
        ...prev,
        rut: rutFormateado
      }));
      
      // También actualizar el valor a través de onChange para asegurar la validación
      onChange({
        target: {
          name: 'rut',
          value: rutFormateado
        }
      } as React.ChangeEvent<HTMLInputElement>);
    }
  }, [formData.rut, onChange, setFormData]);

  // Manejador de cambio para el campo RUT
  const handleRutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.toUpperCase();
    
    // Permitir solo números, K, k y puntos
    value = value.replace(/[^0-9Kk\.-]/g, '');
    
    // Si se está borrando, mantener el formato
    if (value.length < formData.rut.length) {
      onChange({
        ...e,
        target: {
          ...e.target,
          name: 'rut',
          value: value
        }
      } as React.ChangeEvent<HTMLInputElement>);
      return;
    }
    
    // Limpiar caracteres especiales para el procesamiento
    const rutLimpio = value.replace(/\./g, '').replace(/-/g, '');
    
    // Solo permitir 8 caracteres (7 dígitos + DV)
    if (rutLimpio.length > 8) return;
    
    // Formatear automáticamente
    if (rutLimpio.length > 1) {
      // Separar número y dígito verificador
      const rutSinDv = rutLimpio.slice(0, -1);
      const dv = rutLimpio.slice(-1);
      
      // Formatear con puntos y guión
      const parte1 = rutSinDv.slice(0, 1);
      const parte2 = rutSinDv.slice(1, 4);
      const parte3 = rutSinDv.slice(4, 7);
      
      let rutFormateado = parte1;
      if (parte2) rutFormateado += '.' + parte2;
      if (parte3) rutFormateado += '.' + parte3;
      if (dv) rutFormateado += '-' + dv;
      
      onChange({
        ...e,
        target: {
          ...e.target,
          name: 'rut',
          value: rutFormateado
        }
      } as React.ChangeEvent<HTMLInputElement>);
    } else {
      onChange({
        ...e,
        target: {
          ...e.target,
          name: 'rut',
          value: value
        }
      } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  return (
    <div className="space-y-6" data-name="DatosPersonales">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nombre */}
        <div className="space-y-2">
          <Label htmlFor="nombre" className={cn(errors.nombre && 'text-destructive')}>
            Nombre *
          </Label>
          <Input
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={onChange}
            placeholder="Ingresa tu nombre"
            className={cn(errors.nombre && 'border-destructive')}
          />
          {errors.nombre && (
            <p className="text-sm text-destructive">{errors.nombre}</p>
          )}
        </div>

        {/* Apellido */}
        <div className="space-y-2">
          <Label htmlFor="apellido" className={cn(errors.apellido && 'text-destructive')}>
            Apellido *
          </Label>
          <Input
            id="apellido"
            name="apellido"
            value={formData.apellido}
            onChange={onChange}
            placeholder="Ingresa tu apellido"
            className={cn(errors.apellido && 'border-destructive')}
          />
          {errors.apellido && (
            <p className="text-sm text-destructive">{errors.apellido}</p>
          )}
        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* RUT */}
        <div className="space-y-2">
          <Label htmlFor="rut" className={cn(errors.rut && 'text-destructive')}>
            RUT *
          </Label>
          <Input
            id="rut"
            name="rut"
            value={formData.rut}
            onChange={handleRutChange}
            placeholder="1.234.567-8"
            className={cn(errors.rut && 'border-destructive')}
            maxLength={10} // 10 caracteres para el formato 1.234.567-8
          />
          {errors.rut ? (
            <p className="text-sm text-destructive">{errors.rut}</p>
          ) : (
            <p className="text-xs text-muted-foreground">Formato: 1.234.567-8</p>
          )}
        </div>

        {/* Fecha de Nacimiento */}
        <div className="space-y-2">
          <Label htmlFor="fechaNacimiento" className={cn(errors.fechaNacimiento && 'text-destructive')}>
            Fecha de Nacimiento *
          </Label>
          <Input
            id="fechaNacimiento"
            name="fechaNacimiento"
            type="date"
            value={formData.fechaNacimiento}
            onChange={onChange}
            max={new Date().toISOString().split('T')[0]}
            className={cn(errors.fechaNacimiento && 'border-destructive')}
          />
          {errors.fechaNacimiento && (
            <p className="text-sm text-destructive">{errors.fechaNacimiento}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Género */}
        <div className="space-y-2">
          <Label htmlFor="genero" className={cn(errors.genero && 'text-destructive')}>
            Género *
          </Label>
          <Select
            value={formData.genero}
            onValueChange={(value) => 
              onChange({
                target: { name: 'genero', value }
              } as React.ChangeEvent<HTMLSelectElement>)
            }
          >
            <SelectTrigger className={cn(
              'w-full',
              errors.genero && 'border-destructive'
            )}>
              <SelectValue placeholder="Selecciona tu género" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="masculino">Masculino</SelectItem>
              <SelectItem value="femenino">Femenino</SelectItem>
              <SelectItem value="otro">Otro</SelectItem>
              <SelectItem value="prefiero-no-decir">Prefiero no decirlo</SelectItem>
            </SelectContent>
          </Select>
          {errors.genero && (
            <p className="text-sm text-destructive">{errors.genero}</p>
          )}
        </div>

        {/* Nacionalidad */}
        <div className="space-y-2">
          <Label htmlFor="nacionalidad" className={cn(errors.nacionalidad && 'text-destructive')}>
            Nacionalidad *
          </Label>
          <Select
            value={formData.nacionalidad}
            onValueChange={handleNacionalidadChange}
          >
            <SelectTrigger className={cn(
              'w-full',
              errors.nacionalidad && 'border-destructive'
            )}>
              <SelectValue placeholder="Selecciona tu nacionalidad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Chilena">Chilena</SelectItem>
              <SelectItem value="Argentina">Argentina</SelectItem>
              <SelectItem value="Otro">Otra nacionalidad</SelectItem>
            </SelectContent>
          </Select>
          {errors.nacionalidad && (
            <p className="text-sm text-destructive">{errors.nacionalidad}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="direccion" className={cn(errors.direccion && 'text-destructive')}>
          Dirección *
        </Label>
        <Input
          id="direccion"
          name="direccion"
          value={formData.direccion}
          onChange={onChange}
          placeholder="Calle, número, departamento"
          className={cn(errors.direccion && 'border-destructive')}
        />
        {errors.direccion && (
          <p className="text-sm text-destructive">{errors.direccion}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Región */}
        <div className="space-y-2">
          <Label htmlFor="region" className={cn(errors.region && 'text-destructive')}>
            Región *
          </Label>
          <Select
            value={formData.region}
            onValueChange={handleRegionChange}
          >
            <SelectTrigger className={cn(
              'w-full',
              errors.region && 'border-destructive'
            )}>
              <SelectValue placeholder="Selecciona tu región" />
            </SelectTrigger>
            <SelectContent>
              {regiones.map((region) => (
                <SelectItem key={region.id} value={region.id}>
                  {region.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.region && (
            <p className="text-sm text-destructive">{errors.region}</p>
          )}
        </div>

        {/* Comuna */}
        <div className="space-y-2">
          <Label htmlFor="comuna" className={cn(errors.comuna && 'text-destructive')}>
            Comuna *
          </Label>
          <Select
            value={formData.comuna}
            onValueChange={() => {}} // No hacer nada al intentar cambiar
            disabled={!formData.region}
          >
            <SelectTrigger className={cn(
              'w-full',
              errors.comuna && 'border-destructive',
              !formData.region && 'bg-muted text-muted-foreground',
              'cursor-not-allowed opacity-100' // Hacer que parezca habilitado pero sin interacción
            )}>
              <SelectValue placeholder={!formData.region ? "Primero selecciona una región" : ""}>
                {formData.comuna ? (comunas.find(c => c.id === formData.comuna)?.nombre || '') : ''}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {comunas
                .filter(comuna => formData.region ? comuna.regionId === formData.region : false)
                .map((comuna) => (
                  <SelectItem key={comuna.id} value={comuna.id}>
                    {comuna.nombre}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <input 
            type="hidden" 
            name="comuna" 
            value={formData.comuna} 
          />
          {errors.comuna && (
            <p className="text-sm text-destructive">{errors.comuna}</p>
          )}
        </div>

        {/* País */}
        <div className="space-y-2">
          <Label htmlFor="pais" className={cn(errors.pais && 'text-destructive')}>
            País *
          </Label>
          <Input
            id="pais"
            name="pais"
            value={formData.pais}
            onChange={onChange}
            placeholder="País"
            className={cn('bg-muted', errors.pais && 'border-destructive')}
            readOnly
          />
          {errors.pais && (
            <p className="text-sm text-destructive">{errors.pais}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Teléfono */}
        <div className="space-y-2">
          <Label htmlFor="telefono" className={cn(errors.telefono && 'text-destructive')}>
            Teléfono *
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <span className="text-gray-500 text-sm">+56</span>
            </div>
            <Input
              id="telefono"
              name="telefono"
              type="tel"
              value={formData.telefono}
              onChange={(e) => {
                // Solo permite números y asegura que empiece con 9
                let value = e.target.value.replace(/\D/g, '');
                
                // Si el valor no empieza con 9, forzamos que empiece con 9
                if (value && !value.startsWith('9')) {
                  value = '9' + value.replace(/^9/, '');
                }
                
                // Limitar a 9 dígitos (9 + 8)
                if (value.length > 9) {
                  value = value.substring(0, 9);
                }
                
                onChange({
                  ...e,
                  target: {
                    ...e.target,
                    name: 'telefono',
                    value
                  }
                } as React.ChangeEvent<HTMLInputElement>);
              }}
              placeholder="9 1234 5678"
              className={cn('pl-12', errors.telefono && 'border-destructive')}
              maxLength={9}
            />
          </div>
          {errors.telefono ? (
            <p className="text-sm text-destructive">{errors.telefono}</p>
          ) : (
            <p className="text-xs text-muted-foreground">Ejemplo: +56 9 1234 5678</p>
          )}
        </div>

        {/* Correo Electrónico */}
        <div className="space-y-2">
          <Label htmlFor="email" className={cn(errors.email && 'text-destructive')}>
            Correo Electrónico *
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={onChange}
            placeholder="correo@ejemplo.com"
            className={cn(errors.email && 'border-destructive')}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email}</p>
          )}
        </div>
      </div>

      {/* Sección de Documentos */}
      <div className="space-y-6">
        {/* Document upload components will go here */}
      </div>
    </div>
  );
};

export default DatosPersonales;
