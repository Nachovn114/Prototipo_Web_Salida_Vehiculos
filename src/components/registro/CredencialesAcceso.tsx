import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Key } from 'lucide-react';
import { FormData } from '@/types/form';

interface CredencialesAccesoProps {
  formData: FormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors?: Partial<Record<keyof FormData, string>>;
}

const CredencialesAcceso: React.FC<CredencialesAccesoProps> = ({
  formData,
  handleChange,
  errors = {}
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Calcular fortaleza de la contraseña
  const getPasswordStrength = (password: string): number => {
    if (!password) return 0;
    
    let strength = 0;
    
    // Longitud mínima
    if (password.length >= 8) strength += 1;
    
    // Contiene mayúsculas
    if (/[A-Z]/.test(password)) strength += 1;
    
    // Contiene números
    if (/\d/.test(password)) strength += 1;
    
    // Contiene caracteres especiales
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    return strength;
  };

  const passwordStrength = getPasswordStrength(formData.contrasena);
  const passwordStrengthText = 
    passwordStrength === 0 ? 'Muy débil' :
    passwordStrength === 1 ? 'Débil' :
    passwordStrength === 2 ? 'Moderada' : 'Fuerte';
  
  const passwordStrengthColor = 
    passwordStrength <= 1 ? 'bg-red-500' :
    passwordStrength === 2 ? 'bg-yellow-500' : 'bg-green-500';

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Credenciales de Acceso</h3>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="nombreUsuario">Nombre de Usuario</Label>
          <Input
            id="nombreUsuario"
            name="nombreUsuario"
            value={formData.nombreUsuario}
            onChange={handleChange}
            className={errors.nombreUsuario ? 'border-red-500' : ''}
          />
          {errors.nombreUsuario && (
            <p className="text-sm text-red-500">{errors.nombreUsuario}</p>
          )}
        </div>

        <div>
          <Label htmlFor="contrasena">Contraseña</Label>
          <div className="relative">
            <Input
              id="contrasena"
              name="contrasena"
              type={showPassword ? 'text' : 'password'}
              value={formData.contrasena}
              onChange={handleChange}
              className={`pr-10 ${errors.contrasena ? 'border-red-500' : ''}`}
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <div className="mt-2">
            <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full ${passwordStrengthColor} transition-all duration-300`} 
                style={{ width: `${(passwordStrength / 3) * 100}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Fortaleza: {passwordStrengthText}
            </p>
          </div>
          {errors.contrasena && (
            <p className="text-sm text-red-500">{errors.contrasena}</p>
          )}
        </div>

        <div>
          <Label htmlFor="confirmarContrasena">Confirmar Contraseña</Label>
          <div className="relative">
            <Input
              id="confirmarContrasena"
              name="confirmarContrasena"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmarContrasena}
              onChange={handleChange}
              className={`pr-10 ${errors.confirmarContrasena ? 'border-red-500' : ''}`}
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.confirmarContrasena && (
            <p className="text-sm text-red-500">{errors.confirmarContrasena}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CredencialesAcceso;
