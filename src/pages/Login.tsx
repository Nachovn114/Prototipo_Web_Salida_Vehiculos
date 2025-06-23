import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Search, Shield, Settings, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

type UserRole = "conductor" | "inspector" | "aduanero" | "admin";

const Login = () => {
  const { login } = useAuth();
  const [loginData, setLoginData] = useState({
    role: 'conductor' as UserRole,
    identification: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  // Verificar el tamaño de la pantalla
  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 1024);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const roles: Array<{ id: UserRole; label: string; icon: React.ReactElement }> = [
    { id: 'conductor', label: 'Conductor', icon: <User size={20} /> },
    { id: 'inspector', label: 'Inspector', icon: <Search size={20} /> },
    { id: 'aduanero', label: 'Aduanero', icon: <Shield size={20} /> },
    { id: 'admin', label: 'Administrador', icon: <Settings size={20} /> },
  ];

  const getInputConfig = () => {
    switch(loginData.role) {
      case 'conductor':
        return {
          label: 'RUT',
          placeholder: '12.345.678-9',
          type: 'text',
          helpText: 'Ingresa tu RUT con puntos y guión',
          pattern: '^[0-9]{1,2}[0-9]{3}[0-9]{3}[-][0-9Kk]$'
        };
      case 'inspector':
        return {
          label: 'ID de Inspector',
          placeholder: 'INS-2025',
          type: 'text',
          helpText: 'Ingresa tu ID institucional',
          pattern: '^INS-\\d{4}$'
        };
      case 'aduanero':
        return {
          label: 'ID Aduanero',
          placeholder: 'ADU-7411',
          type: 'text',
          helpText: 'Ingresa tu ID funcional',
          pattern: '^ADU-\\d{4}$'
        };
      case 'admin':
        return {
          label: 'Correo Institucional',
          placeholder: 'usuario@aduana.cl',
          type: 'email',
          helpText: 'Ingresa tu correo institucional',
          pattern: '^[a-zA-Z0-9._%+-]+@aduana\\.cl$'
        };
      default:
        return {
          label: 'Identificación',
          placeholder: 'Ingresa tu identificación',
          type: 'text',
          helpText: '',
          pattern: '.*'
        };
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRoleChange = (roleId: UserRole) => {
    setLoginData(prev => ({
      ...prev,
      role: roleId,
      identification: ''
    }));
  };

  // Credenciales predefinidas para cada rol
  const credentials = {
    conductor: {
      identification: '12.345.678-9',
      password: 'conductor123',
      name: 'Juan Pérez',
      email: 'jperez@conductor.cl'
    },
    inspector: {
      identification: 'INS-2025',
      password: 'inspector123',
      name: 'María González',
      email: 'mgonzalez@aduana.cl'
    },
    aduanero: {
      identification: 'ADU-7411',
      password: 'aduanero123',
      name: 'Carlos Rojas',
      email: 'crojas@aduana.cl'
    },
    admin: {
      identification: 'admin@aduana.cl',
      password: 'admin123',
      name: 'Administrador',
      email: 'admin@aduana.cl'
    }
  };

  // Efecto para rellenar automáticamente las credenciales cuando cambia el rol
  useEffect(() => {
    const role = loginData.role as keyof typeof credentials;
    setLoginData(prev => ({
      ...prev,
      identification: credentials[role].identification,
      password: credentials[role].password
    }));
  }, [loginData.role]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const role = loginData.role as keyof typeof credentials;
      const userCredentials = credentials[role];
      
      // Validar credenciales
      if (
        loginData.identification === userCredentials.identification &&
        loginData.password === userCredentials.password
      ) {
        await login(
          userCredentials.email,
          userCredentials.password
        );
        
        // Redirigir según el rol
        navigate(from === '/' ? `/${loginData.role}/dashboard` : from, { replace: true });
      } else {
        setError('Credenciales inválidas. Por favor, verifica tus datos.');
      }
    } catch (error) {
      console.error('Error en el inicio de sesión:', error);
      setError('Ocurrió un error al iniciar sesión. Por favor, intente nuevamente.');
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    try {
      setError('');
      // Here you would typically integrate with Firebase Auth or another auth service
      // For now, we'll just show a message
      alert(`Redirigiendo a inicio de sesión con ${provider}...`);
      // Example implementation with Firebase would look like:
      // const result = await signInWithPopup(auth, provider === 'google' ? googleProvider : facebookProvider);
      // const user = result.user;
      // Then handle the user authentication in your app
    } catch (error) {
      console.error(`Error en inicio de sesión con ${provider}:`, error);
      setError(`No se pudo iniciar sesión con ${provider}. Por favor, intente nuevamente.`);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-cover bg-center bg-fixed overflow-hidden"
      style={{
        backgroundImage: 'url(/images/login-bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}>
      
      {/* Contenedor principal */}
      <div className={`relative z-10 w-full h-full flex ${isSmallScreen ? 'flex-col' : 'items-center'} p-4`}>
        
        {/* Columna izquierda - Visual institucional */}
        <div className={`${isSmallScreen ? 'w-full' : 'w-1/2'} flex items-center justify-center`}>
          <div className="max-w-md mt-20">
            <div className="flex items-center mb-8">
              <div className="w-20 h-20 flex-shrink-0 flex items-center justify-center bg-white rounded-2xl shadow-sm mr-6">
                <img 
                  src="/assets/frontera-digital-logo.png" 
                  alt="Frontera Digital" 
                  className="w-14 h-14 object-contain"
                />
              </div>
              <h1 className="text-3xl font-extrabold leading-tight text-white">
                Bienvenido a <br />
                <span className="text-amber-400">Frontera Digital</span>
              </h1>
            </div>
            
            <p className="text-base text-white/90 mb-2">
              Sistema oficial para el control de salida vehicular terrestre
            </p>

            <p className="text-sm text-white/70 mb-6">
              Plataforma segura y moderna para la gestión del tránsito fronterizo Chile – Argentina
            </p>
            
            <div className="inline-flex items-center text-white text-xs bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-green-400 mr-2"></span>
              Sistema en línea
            </div>
          </div>
        </div>
        
        {/* Columna derecha - Formulario */}
        <div className={`bg-white flex flex-col ${
          isSmallScreen 
            ? 'w-full max-w-md mx-auto mt-8' 
            : 'w-[45%] min-w-[420px] max-w-[480px] h-auto rounded-2xl border border-gray-200 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)]'
        }`}>
          <div className="w-full px-8 py-10">
            <h2 className="text-xl font-bold text-gray-900 mb-1.5">Iniciar Sesión</h2>
            <p className="text-gray-600 text-xs mb-6">Ingresa tus credenciales para acceder al sistema</p>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-md">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Selector de rol */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Selecciona tu rol</label>
                <div className="grid grid-cols-2 gap-2">
                  {roles.map((role) => (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => handleRoleChange(role.id)}
                      className={`flex flex-col items-center justify-center p-1.5 rounded-lg border-2 transition-all text-xs h-[48px] ${
                        loginData.role === role.id
                          ? 'border-[#4F46E5] bg-[#4F46E5] text-white shadow-md'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <span className={`${loginData.role === role.id ? 'text-white' : 'text-gray-500'}`}>
                        {React.cloneElement(role.icon, { size: 16 })}
                      </span>
                      <span className="text-[11px]">{role.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Campo de Identificación Dinámico */}
              <div>
                <label htmlFor="identification" className="block text-xs font-medium text-gray-700 mb-1">
                  {getInputConfig().label}
                </label>
                <input
                  type={getInputConfig().type}
                  id="identification"
                  name="identification"
                  value={loginData.identification}
                  onChange={handleInputChange}
                  placeholder={getInputConfig().placeholder}
                  className="w-full h-[42px] px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent text-sm placeholder-gray-400"
                  pattern={getInputConfig().pattern}
                  required
                />
                {getInputConfig().helpText && (
                  <p className="mt-1 text-xs text-gray-500">{getInputConfig().helpText}</p>
                )}
              </div>

              {/* Campo Contraseña */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="password" className="block text-xs font-medium text-gray-700">Contraseña</label>
                  <a href="#" className="text-xs text-[#4F46E5] hover:underline">¿Olvidaste tu contraseña?</a>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={loginData.password}
                    onChange={handleInputChange}
                    className="w-full h-[42px] px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent text-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Social Login - Only for Conductor */}
              {loginData.role === 'conductor' && (
                <div className="space-y-3 pt-2">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">O continúa con</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleSocialLogin('google')}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                      </svg>
                      <span className="text-sm font-medium">Google</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSocialLogin('facebook')}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                      <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                      </svg>
                      <span className="text-sm font-medium">Facebook</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Recordar credenciales */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  checked={loginData.rememberMe}
                  onChange={handleInputChange}
                  className="h-3.5 w-3.5 text-[#4F46E5] rounded border-gray-300 focus:ring-[#4F46E5]"
                />
                <label htmlFor="rememberMe" className="ml-2 block text-xs text-gray-700">
                  Recordar mis credenciales
                </label>
              </div>

              {/* Botón de inicio de sesión */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-[#4F46E5] hover:bg-[#4338CA] text-white font-medium py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-4 text-sm h-[44px]"
              >
                Iniciar Sesión
                <ArrowRight size={16} />
              </motion.button>

              {/* Enlace de registro */}
              {loginData.role === 'conductor' && (
                <div className="text-center pt-2">
                  <p className="text-xs text-gray-600">
                    ¿Eres nuevo?{' '}
                    <Link to="/registro" className="font-medium text-[#4F46E5] hover:underline">
                      Regístrate aquí
                    </Link>
                  </p>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;