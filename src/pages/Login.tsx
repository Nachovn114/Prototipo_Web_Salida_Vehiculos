import React, { useState } from 'react';
import { Shield, User, Key, UserCheck, UserCog, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const roles = [
  { value: 'conductor', label: 'Conductor', icon: <User className="h-5 w-5 mr-2" /> },
  { value: 'inspector', label: 'Inspector', icon: <UserCheck className="h-5 w-5 mr-2" /> },
  { value: 'aduanero', label: 'Aduanero', icon: <UserCog className="h-5 w-5 mr-2" /> },
  { value: 'admin', label: 'Administrador', icon: <UserPlus className="h-5 w-5 mr-2" /> },
];

const Login = () => {
  const [rut, setRut] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('conductor');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulación de autenticación
    if (rut && password) {
      // Guardar rol en localStorage para simular sesión
      localStorage.setItem('userRole', role);
      navigate('/');
    } else {
      setError('Por favor, ingresa todos los campos.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-100">
      <div className="flex flex-col items-center mb-8">
        <img src="/assets/frontera-digital-logo.png" alt="Frontera Digital Logo" className="h-20 w-20 mb-2" />
        <h1 className="text-2xl font-bold text-blue-900">Frontera Digital <span className="text-blue-600">– Aduana Chile</span></h1>
      </div>
      <form onSubmit={handleLogin} className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="h-10 w-10 text-blue-700" />
          <div>
            <h1 className="text-2xl font-extrabold text-blue-900 leading-tight">Aduana Chile</h1>
            <p className="text-xs text-blue-500 font-medium">Acceso al Sistema</p>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-blue-900 mb-1">RUT/Pasaporte</label>
          <input
            type="text"
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={rut}
            onChange={e => setRut(e.target.value)}
            placeholder="Ej: 12.345.678-9 o Pasaporte"
            autoFocus
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-blue-900 mb-1">Contraseña</label>
          <input
            type="password"
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Contraseña"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-blue-900 mb-1">Rol</label>
          <div className="grid grid-cols-2 gap-2">
            {roles.map(r => (
              <button
                type="button"
                key={r.value}
                className={`flex items-center px-3 py-2 rounded-md border transition-colors ${role === r.value ? 'bg-blue-100 border-blue-500 text-blue-900 font-bold' : 'bg-white border-gray-300 text-gray-700'}`}
                onClick={() => setRole(r.value)}
              >
                {r.icon} {r.label}
              </button>
            ))}
          </div>
        </div>
        {error && <div className="text-red-600 text-sm font-medium">{error}</div>}
        <button
          type="submit"
          className="w-full bg-blue-700 text-white font-bold py-2 rounded-md hover:bg-blue-800 transition-colors"
        >
          Ingresar
        </button>
        <div className="text-xs text-gray-400 text-center pt-2">Simulación de login - No se almacena información real</div>
      </form>
    </div>
  );
};

export default Login; 