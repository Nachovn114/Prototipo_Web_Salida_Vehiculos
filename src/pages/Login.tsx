import React, { useState } from 'react';
import { Shield, User, Key, UserCheck, UserCog, UserPlus, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const roles = [
  { value: 'conductor', label: 'Conductor', icon: <User className="h-5 w-5 mr-2" />, placeholder: '12.345.678-9' },
  { value: 'inspector', label: 'Inspector', icon: <UserCheck className="h-5 w-5 mr-2" />, placeholder: 'INS-2024' },
  { value: 'aduanero', label: 'Aduanero', icon: <UserCog className="h-5 w-5 mr-2" />, placeholder: 'ADU-2024' },
  { value: 'admin', label: 'Administrador', icon: <UserPlus className="h-5 w-5 mr-2" />, placeholder: 'ADMIN-2024' },
];

const Login = () => {
  const [rut, setRut] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('conductor');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const navigate = useNavigate();

  const selectedRole = roles.find(r => r.value === role);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!rut || !password) {
      setError('Por favor, ingresa todos los campos.');
      return;
    }

    try {
      setLoading(true);
      
      // Simulación de proceso de autenticación con mensajes
      setLoadingMessage('Verificando credenciales...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setLoadingMessage('Validando permisos...');
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setLoadingMessage('Preparando tu sesión...');
      await new Promise(resolve => setTimeout(resolve, 700));
      
      // Guardar rol en localStorage para simular sesión
      localStorage.setItem('userRole', role);
      
      // Mostrar toast de bienvenida según el rol
      const userName = {
        conductor: 'Sr. Conductor',
        inspector: 'Inspector García',
        aduanero: 'Aduanero Soto',
        admin: 'Administrador',
      }[role];

      toast.success(`¡Bienvenido ${userName}!`, {
        description: 'Accediendo al sistema...',
        duration: 4000,
      });

      navigate('/');
    } catch (error) {
      setError('Error al iniciar sesión. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
      setLoadingMessage('');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-900/90 via-blue-900/90 to-red-900/90 relative">
      {/* Patrón de fondo */}
      <div 
        className="absolute inset-0 bg-[url('/assets/pattern.svg')] bg-center opacity-5"
        aria-hidden="true"
      />
      
      {/* Overlay con gradiente */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-transparent to-red-900/20 backdrop-blur-sm"
        aria-hidden="true"
      />
      
      {/* Contenido */}
      <div className="relative z-10 w-full max-w-md px-4">
        {/* Logo y título */}
        <div className="flex flex-col items-center mb-6">
          <div className="bg-white/95 rounded-2xl p-4 shadow-lg mb-4 backdrop-blur-md">
            <img 
              src="/assets/frontera-digital-logo.png" 
              alt="Logo de Frontera Digital"
              className="h-24 w-24 drop-shadow-lg"
            />
          </div>
          <h1 className="text-3xl font-black text-white mb-2 text-center drop-shadow-lg">
            Frontera Digital
          </h1>
          <h2 className="text-xl text-white/90 font-medium text-center drop-shadow">
            Sistema oficial de control de salida vehicular
          </h2>
        </div>

        {/* Formulario */}
        <form 
          onSubmit={handleLogin} 
          className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-8 space-y-6 border border-white/20"
          aria-label="Formulario de inicio de sesión"
        >
          <div className="flex items-center gap-3 pb-4 border-b border-blue-100">
            <div className="bg-blue-100 p-3 rounded-xl">
              <Shield className="h-8 w-8 text-blue-700" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-blue-900 leading-tight">
                Aduana Chile
              </h2>
              <p className="text-sm text-blue-600 font-medium">
                Portal de Acceso Institucional
              </p>
            </div>
          </div>

          {/* Selector de rol */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-blue-900">
              Selecciona tu rol
            </label>
            <div 
              className="grid grid-cols-2 gap-2"
              role="radiogroup"
              aria-label="Selección de rol de usuario"
            >
              {roles.map(r => (
                <button
                  type="button"
                  key={r.value}
                  className={`flex items-center px-3 py-2 rounded-xl border-2 transition-all duration-200 ${
                    role === r.value 
                      ? 'bg-blue-100 border-blue-500 text-blue-900 font-bold shadow-md scale-[1.02]' 
                      : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                  onClick={() => setRole(r.value)}
                  aria-label={`Seleccionar rol: ${r.label}`}
                  aria-pressed={role === r.value}
                  role="radio"
                >
                  {r.icon} {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Campos de acceso */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-blue-900 mb-1" htmlFor="rut">
                Identificación
              </label>
              <div className="relative">
                <input
                  id="rut"
                  type="text"
                  className="w-full border-2 rounded-xl px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                  value={rut}
                  onChange={e => setRut(e.target.value)}
                  placeholder={selectedRole?.placeholder}
                  autoFocus
                  aria-label="Ingresa tu identificación"
                  aria-required="true"
                />
                <User className="h-5 w-5 text-blue-500 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-blue-900 mb-1" htmlFor="password">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  className="w-full border-2 rounded-xl px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  aria-label="Ingresa tu contraseña"
                  aria-required="true"
                />
                <Key className="h-5 w-5 text-blue-500 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
              </div>
            </div>

            {/* Opciones adicionales de seguridad */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  aria-label="Recordar sesión"
                />
                Recordar sesión
              </label>
              <a 
                href="#" 
                className="text-blue-600 hover:text-blue-700 font-medium"
                onClick={(e) => {
                  e.preventDefault();
                  toast.info("Función no disponible en el prototipo", {
                    description: "Esta es una simulación académica"
                  });
                }}
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          </div>

          {error && (
            <div 
              className="bg-red-50 text-red-700 p-3 rounded-lg text-sm font-medium flex items-center gap-2"
              role="alert"
              aria-live="polite"
            >
              <Shield className="h-4 w-4" aria-hidden="true" />
              {error}
            </div>
          )}

          {loading && loadingMessage && (
            <div 
              className="bg-blue-50 text-blue-700 p-3 rounded-lg text-sm font-medium flex items-center gap-2"
              role="status"
              aria-live="polite"
            >
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              {loadingMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70"
            aria-label="Iniciar sesión"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                Verificando...
              </>
            ) : (
              <>
                <Shield className="h-5 w-5" aria-hidden="true" />
                Ingresar al Sistema
              </>
            )}
          </button>

          {/* Enlaces institucionales */}
          <div className="grid grid-cols-3 gap-4 text-center text-xs text-gray-500">
            <a 
              href="https://www.aduana.cl" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-blue-600"
            >
              Portal Aduana
            </a>
            <a 
              href="/contacto" 
              className="hover:text-blue-600"
            >
              Mesa de Ayuda
            </a>
            <a 
              href="#"
              onClick={(e) => {
                e.preventDefault();
                toast.info("Función no disponible en el prototipo", {
                  description: "Esta es una simulación académica"
                });
              }}
              className="hover:text-blue-600"
            >
              Soporte 24/7
            </a>
          </div>

          {/* Términos y privacidad */}
          <div className="text-xs text-center space-y-2">
            <div className="text-gray-500">
              Al iniciar sesión aceptas nuestros{' '}
              <a 
                href="#" 
                className="text-blue-600 hover:underline"
                onClick={(e) => {
                  e.preventDefault();
                  toast.info("Función no disponible en el prototipo", {
                    description: "Esta es una simulación académica"
                  });
                }}
              >
                términos y condiciones
              </a>
              {' '}y{' '}
              <a 
                href="#" 
                className="text-blue-600 hover:underline"
                onClick={(e) => {
                  e.preventDefault();
                  toast.info("Función no disponible en el prototipo", {
                    description: "Esta es una simulación académica"
                  });
                }}
              >
                política de privacidad
              </a>
            </div>
            <div className="border-t border-gray-100 pt-4 mt-4">
              <p>Sistema de simulación para fines académicos</p>
              <p className="mt-1 text-gray-400">No se almacena información real</p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login; 