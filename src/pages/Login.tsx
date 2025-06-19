import React, { useState } from 'react';
import { Shield, User, Key, UserCheck, UserCog, UserPlus, Loader2, X, Mail, UserCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [showRegister, setShowRegister] = useState(false);
  const navigate = useNavigate();

  // Estados para el formulario de registro
  const [registerData, setRegisterData] = useState({
    fullName: '',
    email: '',
    registerRole: 'conductor',
    registerPassword: '',
    confirmPassword: ''
  });
  const [registerLoading, setRegisterLoading] = useState(false);

  // Estados para validaciones visuales
  const [fieldErrors, setFieldErrors] = useState({
    fullName: false,
    email: false,
    registerPassword: false,
    confirmPassword: false
  });

  const selectedRole = roles.find(r => r.value === role);

  // Función para validar campos en tiempo real
  const validateField = (field: string, value: string) => {
    let isValid = true;
    
    switch (field) {
      case 'fullName':
        isValid = value.trim().length >= 3;
        break;
      case 'email':
        isValid = value.includes('@') || /^\d{1,2}\.\d{3}\.\d{3}-[\dkK]$/.test(value);
        break;
      case 'registerPassword':
        isValid = value.length >= 6;
        break;
      case 'confirmPassword':
        isValid = value === registerData.registerPassword && value.length > 0;
        break;
    }
    
    setFieldErrors(prev => ({ ...prev, [field]: !isValid }));
    return isValid;
  };

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

      // Animación de redirección
      setLoadingMessage('Redirigiendo al sistema...');
      await new Promise(resolve => setTimeout(resolve, 1000));

      navigate('/');
    } catch (error) {
      setError('Error al iniciar sesión. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
      setLoadingMessage('');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar todos los campos
    const validations = {
      fullName: validateField('fullName', registerData.fullName),
      email: validateField('email', registerData.email),
      registerPassword: validateField('registerPassword', registerData.registerPassword),
      confirmPassword: validateField('confirmPassword', registerData.confirmPassword)
    };

    if (!Object.values(validations).every(Boolean)) {
      toast.error('Por favor, corrige los errores en el formulario.');
      return;
    }

    if (registerData.registerPassword !== registerData.confirmPassword) {
      toast.error('Las contraseñas no coinciden.');
      return;
    }

    try {
      setRegisterLoading(true);
      
      // Simulación de proceso de registro con animación
      toast.info('Creando tu cuenta...', {
        description: 'Procesando información',
        duration: 2000,
      });
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Guardar datos de registro en localStorage
      const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const newUser = {
        id: Date.now(),
        ...registerData,
        createdAt: new Date().toISOString()
      };
      users.push(newUser);
      localStorage.setItem('registeredUsers', JSON.stringify(users));
      
      toast.success('¡Registro exitoso!', {
        description: 'Tu cuenta ha sido creada correctamente.',
        duration: 4000,
      });

      // Cerrar modal y limpiar formulario
      setShowRegister(false);
      setRegisterData({
        fullName: '',
        email: '',
        registerRole: 'conductor',
        registerPassword: '',
        confirmPassword: ''
      });
      setFieldErrors({
        fullName: false,
        email: false,
        registerPassword: false,
        confirmPassword: false
      });
      
    } catch (error) {
      toast.error('Error en el registro. Por favor, intenta nuevamente.');
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <motion.div 
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-900/90 via-blue-900/90 to-red-900/90 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={{ willChange: 'auto' }}
    >
      {/* Patrón de fondo - optimizado para scroll */}
      <div 
        className="absolute inset-0 bg-[url('/assets/pattern.svg')] bg-center opacity-5"
        aria-hidden="true"
        style={{ 
          willChange: 'auto',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden'
        }}
      />
      
      {/* Overlay con gradiente - optimizado */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-transparent to-red-900/20"
        aria-hidden="true"
        style={{ 
          willChange: 'auto',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden'
        }}
      />
      
      {/* Contenido - optimizado para scroll */}
      <div className="relative z-10 w-full max-w-md px-4" style={{ willChange: 'auto' }}>
        {/* Logo y título - animación simplificada */}
        <motion.div 
          className="flex flex-col items-center mb-6"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          style={{ willChange: 'auto' }}
        >
          <motion.div 
            className="bg-white/95 rounded-2xl p-4 shadow-lg mb-4"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            style={{ willChange: 'transform' }}
          >
            <img 
              src="/assets/frontera-digital-logo.png" 
              alt="Logo de Frontera Digital"
              className="h-24 w-24 drop-shadow-lg"
              style={{ willChange: 'auto' }}
            />
          </motion.div>
          <motion.h1 
            className="text-3xl font-black text-white mb-2 text-center drop-shadow-lg"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            style={{ willChange: 'auto' }}
          >
            Frontera Digital
          </motion.h1>
          <motion.h2 
            className="text-xl text-white/90 font-medium text-center drop-shadow"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            style={{ willChange: 'auto' }}
          >
            Sistema oficial de control de salida vehicular
          </motion.h2>
        </motion.div>

        {/* Formulario - optimizado para scroll */}
        <motion.form 
          onSubmit={handleLogin} 
          className="bg-white/95 rounded-2xl shadow-xl p-8 space-y-6 border border-white/20"
          aria-label="Formulario de inicio de sesión"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          style={{ 
            willChange: 'auto',
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden'
          }}
        >
          <motion.div 
            className="flex items-center gap-3 pb-4 border-b border-blue-100"
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            style={{ willChange: 'auto' }}
          >
            <motion.div 
              className="bg-blue-100 p-3 rounded-xl"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              style={{ willChange: 'transform' }}
            >
              <Shield className="h-8 w-8 text-blue-700" aria-hidden="true" />
            </motion.div>
            <div>
              <h2 className="text-2xl font-extrabold text-blue-900 leading-tight">
                Aduana Chile
              </h2>
              <p className="text-sm text-blue-600 font-medium">
                Portal de Acceso Institucional
              </p>
            </div>
          </motion.div>

          {/* Selector de rol - optimizado */}
          <motion.div 
            className="space-y-2"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            style={{ willChange: 'auto' }}
          >
            <label className="block text-sm font-medium text-blue-900">
              Selecciona tu rol
            </label>
            <div 
              className="grid grid-cols-2 gap-2"
              role="radiogroup"
              aria-label="Selección de rol de usuario"
            >
              {roles.map((r, index) => (
                <motion.button
                  type="button"
                  key={r.value}
                  className={`flex items-center px-3 py-2 rounded-xl border-2 transition-all duration-200 ${
                    role === r.value 
                      ? 'bg-blue-100 border-blue-500 text-blue-900 font-bold shadow-md' 
                      : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                  onClick={() => setRole(r.value)}
                  aria-label={`Seleccionar rol: ${r.label}`}
                  aria-pressed={role === r.value}
                  role="radio"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.2, delay: 0.6 + index * 0.05 }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  style={{ willChange: 'transform' }}
                >
                  {r.icon} {r.label}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Campos de acceso - optimizados */}
          <motion.div 
            className="space-y-4"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.7 }}
            style={{ willChange: 'auto' }}
          >
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
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
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
          </motion.div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                className="bg-red-50 text-red-700 p-3 rounded-lg text-sm font-medium flex items-center gap-2"
                role="alert"
                aria-live="polite"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
                style={{ willChange: 'auto' }}
              >
                <Shield className="h-4 w-4" aria-hidden="true" />
                {error}
              </motion.div>
            )}

            {loading && loadingMessage && (
              <motion.div 
                className="bg-blue-50 text-blue-700 p-3 rounded-lg text-sm font-medium flex items-center gap-2"
                role="status"
                aria-live="polite"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
                style={{ willChange: 'auto' }}
              >
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                {loadingMessage}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70"
            aria-label="Iniciar sesión"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.8 }}
            style={{ willChange: 'transform' }}
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
          </motion.button>

          {/* Enlaces institucionales - optimizados */}
          <motion.div 
            className="grid grid-cols-3 gap-4 text-center text-xs text-gray-500"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.9 }}
            style={{ willChange: 'auto' }}
          >
            <a 
              href="https://www.aduana.cl" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition-colors"
            >
              Portal Aduana
            </a>
            <a 
              href="/contacto" 
              className="hover:text-blue-600 transition-colors"
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
              className="hover:text-blue-600 transition-colors"
            >
              Soporte 24/7
            </a>
          </motion.div>

          {/* Términos y privacidad - optimizados */}
          <motion.div 
            className="text-xs text-center space-y-2"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 1.0 }}
            style={{ willChange: 'auto' }}
          >
            <div className="text-gray-500">
              Al iniciar sesión aceptas nuestros{' '}
              <a 
                href="#" 
                className="text-blue-600 hover:text-blue-700 font-medium underline"
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
                className="text-blue-600 hover:text-blue-700 font-medium underline"
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
          </motion.div>

          {/* Enlace de registro - optimizado */}
          <motion.div 
            className="text-center pt-4 border-t border-gray-100"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 1.1 }}
            style={{ willChange: 'auto' }}
          >
            <p className="text-sm text-gray-600">
              ¿No tienes cuenta?{' '}
              <motion.button
                type="button"
                onClick={() => setShowRegister(true)}
                className="text-blue-600 hover:text-blue-700 font-medium underline"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{ willChange: 'transform' }}
              >
                Regístrate aquí
              </motion.button>
            </p>
          </motion.div>
        </motion.form>
      </div>

      {/* Footer institucional - optimizado */}
      <motion.div 
        className="relative z-10 w-full max-w-md px-4 mt-8"
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, delay: 1.2 }}
        style={{ willChange: 'auto' }}
      >
        <div className="text-center text-white/80 text-sm">
          <p className="mb-2">
            © 2025 Servicio Nacional de Aduanas
          </p>
          <p className="text-xs text-white/60">
            Sistema Frontera Digital - Plataforma de Control Vehicular
          </p>
          <div className="flex justify-center gap-4 mt-3 text-xs text-white/60">
            <span>Versión 1.0.0</span>
            <span>•</span>
            <span>Chile - Argentina</span>
          </div>
        </div>
      </motion.div>

      {/* Modal de Registro - optimizado para scroll */}
      <AnimatePresence>
        {showRegister && (
          <motion.div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ 
              willChange: 'auto',
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden'
            }}
          >
            <motion.div 
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.2, type: "spring", stiffness: 300, damping: 25 }}
              style={{ 
                willChange: 'transform',
                transform: 'translateZ(0)',
                backfaceVisibility: 'hidden'
              }}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-blue-900">📋 Registrarse</h2>
                  <motion.button
                    onClick={() => setShowRegister(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Cerrar modal de registro"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{ willChange: 'transform' }}
                  >
                    <X className="h-6 w-6" />
                  </motion.button>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                  {/* Campos del formulario - optimizados */}
                  <motion.div
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    style={{ willChange: 'auto' }}
                  >
                    <label className="block text-sm font-medium text-blue-900 mb-1">
                      Nombre completo
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        className={`w-full border-2 rounded-xl px-4 py-2 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 ${
                          fieldErrors.fullName ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                        value={registerData.fullName}
                        onChange={e => {
                          setRegisterData({...registerData, fullName: e.target.value});
                          validateField('fullName', e.target.value);
                        }}
                        onBlur={e => validateField('fullName', e.target.value)}
                        placeholder="Ingresa tu nombre completo"
                        required
                      />
                      <UserCircle className="h-5 w-5 text-blue-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      {registerData.fullName && (
                        <motion.div 
                          className="absolute right-3 top-1/2 -translate-y-1/2"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 400, damping: 15 }}
                          style={{ willChange: 'transform' }}
                        >
                          {fieldErrors.fullName ? (
                            <span className="text-red-500 text-lg">❌</span>
                          ) : (
                            <span className="text-green-500 text-lg">✅</span>
                          )}
                        </motion.div>
                      )}
                    </div>
                    {fieldErrors.fullName && (
                      <motion.p 
                        className="text-red-500 text-xs mt-1"
                        initial={{ opacity: 0, y: -2 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        style={{ willChange: 'auto' }}
                      >
                        El nombre debe tener al menos 3 caracteres
                      </motion.p>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    style={{ willChange: 'auto' }}
                  >
                    <label className="block text-sm font-medium text-blue-900 mb-1">
                      RUT o correo electrónico
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        className={`w-full border-2 rounded-xl px-4 py-2 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 ${
                          fieldErrors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                        value={registerData.email}
                        onChange={e => {
                          setRegisterData({...registerData, email: e.target.value});
                          validateField('email', e.target.value);
                        }}
                        onBlur={e => validateField('email', e.target.value)}
                        placeholder="12.345.678-9 o usuario@email.com"
                        required
                      />
                      <Mail className="h-5 w-5 text-blue-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      {registerData.email && (
                        <motion.div 
                          className="absolute right-3 top-1/2 -translate-y-1/2"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 400, damping: 15 }}
                          style={{ willChange: 'transform' }}
                        >
                          {fieldErrors.email ? (
                            <span className="text-red-500 text-lg">❌</span>
                          ) : (
                            <span className="text-green-500 text-lg">✅</span>
                          )}
                        </motion.div>
                      )}
                    </div>
                    {fieldErrors.email && (
                      <motion.p 
                        className="text-red-500 text-xs mt-1"
                        initial={{ opacity: 0, y: -2 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        style={{ willChange: 'auto' }}
                      >
                        Ingresa un RUT válido o correo electrónico
                      </motion.p>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    style={{ willChange: 'auto' }}
                  >
                    <label className="block text-sm font-medium text-blue-900 mb-1">
                      Rol
                    </label>
                    <select
                      className="w-full border-2 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent border-gray-300"
                      value={registerData.registerRole}
                      onChange={e => setRegisterData({...registerData, registerRole: e.target.value})}
                      required
                    >
                      {roles.map(r => (
                        <option key={r.value} value={r.value}>
                          {r.label}
                        </option>
                      ))}
                    </select>
                  </motion.div>

                  <motion.div
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    style={{ willChange: 'auto' }}
                  >
                    <label className="block text-sm font-medium text-blue-900 mb-1">
                      Contraseña
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        className={`w-full border-2 rounded-xl px-4 py-2 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 ${
                          fieldErrors.registerPassword ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                        value={registerData.registerPassword}
                        onChange={e => {
                          setRegisterData({...registerData, registerPassword: e.target.value});
                          validateField('registerPassword', e.target.value);
                        }}
                        onBlur={e => validateField('registerPassword', e.target.value)}
                        placeholder="••••••••"
                        required
                      />
                      <Key className="h-5 w-5 text-blue-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      {registerData.registerPassword && (
                        <motion.div 
                          className="absolute right-3 top-1/2 -translate-y-1/2"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 400, damping: 15 }}
                          style={{ willChange: 'transform' }}
                        >
                          {fieldErrors.registerPassword ? (
                            <span className="text-red-500 text-lg">❌</span>
                          ) : (
                            <span className="text-green-500 text-lg">✅</span>
                          )}
                        </motion.div>
                      )}
                    </div>
                    {fieldErrors.registerPassword && (
                      <motion.p 
                        className="text-red-500 text-xs mt-1"
                        initial={{ opacity: 0, y: -2 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        style={{ willChange: 'auto' }}
                      >
                        La contraseña debe tener al menos 6 caracteres
                      </motion.p>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    style={{ willChange: 'auto' }}
                  >
                    <label className="block text-sm font-medium text-blue-900 mb-1">
                      Confirmar contraseña
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        className={`w-full border-2 rounded-xl px-4 py-2 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 ${
                          fieldErrors.confirmPassword ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                        value={registerData.confirmPassword}
                        onChange={e => {
                          setRegisterData({...registerData, confirmPassword: e.target.value});
                          validateField('confirmPassword', e.target.value);
                        }}
                        onBlur={e => validateField('confirmPassword', e.target.value)}
                        placeholder="••••••••"
                        required
                      />
                      <Key className="h-5 w-5 text-blue-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      {registerData.confirmPassword && (
                        <motion.div 
                          className="absolute right-3 top-1/2 -translate-y-1/2"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 400, damping: 15 }}
                          style={{ willChange: 'transform' }}
                        >
                          {fieldErrors.confirmPassword ? (
                            <span className="text-red-500 text-lg">❌</span>
                          ) : (
                            <span className="text-green-500 text-lg">✅</span>
                          )}
                        </motion.div>
                      )}
                    </div>
                    {fieldErrors.confirmPassword && (
                      <motion.p 
                        className="text-red-500 text-xs mt-1"
                        initial={{ opacity: 0, y: -2 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        style={{ willChange: 'auto' }}
                      >
                        Las contraseñas no coinciden
                      </motion.p>
                    )}
                  </motion.div>

                  <motion.button
                    type="submit"
                    disabled={registerLoading}
                    className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    style={{ willChange: 'transform' }}
                  >
                    {registerLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Creando cuenta...
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-5 w-5" />
                        Registrarme
                      </>
                    )}
                  </motion.button>
                </form>

                <motion.div 
                  className="text-xs text-gray-500 text-center mt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  style={{ willChange: 'auto' }}
                >
                  <p>Al registrarte aceptas nuestros términos y condiciones</p>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Login; 