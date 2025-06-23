import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Check, Eye, EyeOff, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  preguntaSeguridad1: string;
  respuestaSeguridad1: string;
  preguntaSeguridad2: string;
  respuestaSeguridad2: string;
}

interface CredencialesAccesoProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors: Record<string, string | undefined>;
  preguntasSeguridad: Array<{ value: string; label: string }>;
}

const CredencialesAcceso: React.FC<CredencialesAccesoProps> = ({
  formData,
  setFormData,
  onChange,
  errors,
  preguntasSeguridad
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [name]: value
    }));
  };

  // Función para verificar la fortaleza de la contraseña
  const checkPasswordStrength = (password: string) => {
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*]/.test(password);
    
    const strength = [hasMinLength, hasUpperCase, hasNumber, hasSpecialChar]
      .filter(Boolean).length;
    
    return {
      strength,
      hasMinLength,
      hasUpperCase,
      hasNumber,
      hasSpecialChar
    };
  };

  const passwordStrength = checkPasswordStrength(formData.password);
  const passwordMatch = formData.password === formData.confirmPassword;

  // Filtrar preguntas disponibles para la segunda pregunta
  const availableQuestions2 = preguntasSeguridad.filter(
    q => q.value !== formData.preguntaSeguridad1
  );

  return (
    <div className="space-y-6" data-name="CredencialesAcceso">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Credenciales de Acceso</h2>
        <p className="text-muted-foreground">
          Crea tus credenciales para acceder al sistema.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">Correo Electrónico *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={onChange}
            className={errors.email ? 'border-red-500' : ''}
            placeholder="tucorreo@ejemplo.com"
          />
          {errors.email && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.email}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Contraseña *</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button type="button" className="text-gray-400 hover:text-gray-500">
                    <HelpCircle className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>La contraseña debe tener al menos 8 caracteres, incluyendo una mayúscula, un número y un carácter especial.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={onChange}
              className={cn(
                "pr-10",
                errors.password && "border-red-500"
              )}
              placeholder="••••••••"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          
          {/* Indicador de fortaleza de contraseña */}
          {formData.password && (
            <div className="mt-2 space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={cn("h-full rounded-full", {
                      "w-1/4 bg-red-500": passwordStrength.strength === 1,
                      "w-1/2 bg-yellow-500": passwordStrength.strength === 2,
                      "w-3/4 bg-blue-500": passwordStrength.strength === 3,
                      "w-full bg-green-500": passwordStrength.strength === 4,
                      "bg-gray-200": !formData.password
                    })}
                  />
                </div>
                <span className="text-xs text-gray-500">
                  {!formData.password
                    ? "Seguridad"
                    : passwordStrength.strength === 1
                    ? "Débil"
                    : passwordStrength.strength === 2
                    ? "Moderada"
                    : passwordStrength.strength === 3
                    ? "Fuerte"
                    : "Muy fuerte"}
                </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
                <div className="flex items-center gap-1">
                  {passwordStrength.hasMinLength ? (
                    <Check className="h-3 w-3 text-green-500" />
                  ) : (
                    <div className="h-3 w-3 rounded-full bg-gray-200" />
                  )}
                  <span>Mínimo 8 caracteres</span>
                </div>
                <div className="flex items-center gap-1">
                  {passwordStrength.hasUpperCase ? (
                    <Check className="h-3 w-3 text-green-500" />
                  ) : (
                    <div className="h-3 w-3 rounded-full bg-gray-200" />
                  )}
                  <span>1 mayúscula</span>
                </div>
                <div className="flex items-center gap-1">
                  {passwordStrength.hasNumber ? (
                    <Check className="h-3 w-3 text-green-500" />
                  ) : (
                    <div className="h-3 w-3 rounded-full bg-gray-200" />
                  )}
                  <span>1 número</span>
                </div>
                <div className="flex items-center gap-1">
                  {passwordStrength.hasSpecialChar ? (
                    <Check className="h-3 w-3 text-green-500" />
                  ) : (
                    <div className="h-3 w-3 rounded-full bg-gray-200" />
                  )}
                  <span>1 carácter especial</span>
                </div>
              </div>
            </div>
          )}
          
          {errors.password && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.password}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmar Contraseña *</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={onChange}
              className={cn(
                "pr-10",
                errors.confirmPassword || (formData.confirmPassword && !passwordMatch)
                  ? "border-red-500"
                  : formData.confirmPassword && passwordMatch
                  ? "border-green-500"
                  : ""
              )}
              placeholder="••••••••"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {formData.confirmPassword && !passwordMatch && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              Las contraseñas no coinciden
            </p>
          )}
          {errors.confirmPassword && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.confirmPassword}
            </p>
          )}
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium">Preguntas de Seguridad</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Estas preguntas te ayudarán a recuperar tu cuenta en caso de olvidar tu contraseña.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="preguntaSeguridad1">Pregunta de Seguridad 1 *</Label>
            <Select
              value={formData.preguntaSeguridad1}
              onValueChange={(value) => handleSelectChange('preguntaSeguridad1', value)}
            >
              <SelectTrigger className={errors.preguntaSeguridad1 ? 'border-red-500' : ''}>
                <SelectValue placeholder="Selecciona una pregunta" />
              </SelectTrigger>
              <SelectContent>
                {preguntasSeguridad.map((pregunta) => (
                  <SelectItem key={pregunta.value} value={pregunta.value}>
                    {pregunta.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.preguntaSeguridad1 && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.preguntaSeguridad1}
              </p>
            )}
            <Input
              id="respuestaSeguridad1"
              name="respuestaSeguridad1"
              value={formData.respuestaSeguridad1}
              onChange={onChange}
              className={errors.respuestaSeguridad1 ? 'mt-2 border-red-500' : 'mt-2'}
              placeholder="Tu respuesta"
            />
            {errors.respuestaSeguridad1 && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.respuestaSeguridad1}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="preguntaSeguridad2">Pregunta de Seguridad 2 *</Label>
            <Select
              value={formData.preguntaSeguridad2}
              onValueChange={(value) => handleSelectChange('preguntaSeguridad2', value)}
              disabled={!formData.preguntaSeguridad1}
            >
              <SelectTrigger className={errors.preguntaSeguridad2 ? 'border-red-500' : ''}>
                <SelectValue placeholder={formData.preguntaSeguridad1 ? "Selecciona otra pregunta" : "Selecciona la primera pregunta"} />
              </SelectTrigger>
              <SelectContent>
                {availableQuestions2.map((pregunta) => (
                  <SelectItem key={pregunta.value} value={pregunta.value}>
                    {pregunta.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.preguntaSeguridad2 && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.preguntaSeguridad2}
              </p>
            )}
            <Input
              id="respuestaSeguridad2"
              name="respuestaSeguridad2"
              value={formData.respuestaSeguridad2}
              onChange={onChange}
              className={errors.respuestaSeguridad2 ? 'mt-2 border-red-500' : 'mt-2'}
              placeholder="Tu respuesta"
              disabled={!formData.preguntaSeguridad2}
            />
            {errors.respuestaSeguridad2 && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.respuestaSeguridad2}
              </p>
            )}
          </div>
        </div>

        <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Consejos de seguridad</h3>
              <div className="mt-2 text-sm text-blue-700">
                <ul className="list-disc pl-5 space-y-1">
                  <li>No compartas tus credenciales con nadie</li>
                  <li>Usa una contraseña única que no hayas usado en otros sitios</li>
                  <li>Elige preguntas de seguridad cuyas respuestas solo tú conozcas</li>
                  <li>Considera usar un gestor de contraseñas</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CredencialesAcceso;
