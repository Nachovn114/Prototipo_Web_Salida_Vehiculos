import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Mail, Phone, ChevronRight } from 'lucide-react';

const Footer: React.FC = () => {
  // Función para obtener la fecha formateada
  const getCurrentDate = () => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const footerLinks = [
    { name: 'Portal de Aduanas', href: 'https://www.aduana.cl' },
    { name: 'Ayuda y Soporte', href: '/ayuda' },
    { name: 'Términos de Servicio', href: '#' },
    { name: 'Política de Privacidad', href: '#' },
  ];

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="bg-slate-900 text-white border-t-2 border-blue-700"
    >
      <div className="max-w-screen-xl px-4 pt-16 pb-8 mx-auto sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Columna 1: Logo y Descripción */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-lg">
                <img 
                  src="/assets/frontera-digital-logo.png" 
                  alt="Frontera Digital Logo" 
                  className="h-10 w-10 object-contain"
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white tracking-wider">Frontera Digital</h3>
                <p className="text-sm text-slate-400">Sistema de Control Vehicular</p>
              </div>
            </div>
            <p className="mt-4 text-slate-300 leading-relaxed max-w-xs">
              Plataforma oficial para la gestión y control de salida de vehículos en la frontera Chile-Argentina.
            </p>
          </div>

          {/* Columnas 2 y 3: Links y Contacto */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:col-span-2">
            <div>
              <p className="text-lg font-semibold text-slate-100">Enlaces de Interés</p>
              <ul className="mt-6 space-y-4 text-sm">
                {footerLinks.map(link => (
                  <li key={link.name}>
                    <a href={link.href} className="flex items-center gap-1.5 text-slate-300 hover:text-blue-400 transition-colors duration-300">
                      <ChevronRight className="h-4 w-4 text-blue-500" />
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <p className="text-lg font-semibold text-slate-100">Contacto Institucional</p>
              <ul className="mt-6 space-y-4 text-sm">
                <li>
                  <a href="mailto:contacto@aduana.cl" className="flex items-center gap-3 group">
                    <Mail className="h-5 w-5 text-blue-500 group-hover:text-blue-400 transition-colors" />
                    <span className="text-slate-300 group-hover:text-blue-400 transition-colors">contacto@aduana.cl</span>
                  </a>
                </li>
                <li>
                  <a href="tel:+56223456789" className="flex items-center gap-3 group">
                    <Phone className="h-5 w-5 text-blue-500 group-hover:text-blue-400 transition-colors" />
                    <span className="text-slate-300 group-hover:text-blue-400 transition-colors">+56 2 2345 6789</span>
                  </a>
                </li>
                <li>
                  <a href="https://www.aduana.cl" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group">
                    <Globe className="h-5 w-5 text-blue-500 group-hover:text-blue-400 transition-colors" />
                    <span className="text-slate-300 group-hover:text-blue-400 transition-colors">www.aduana.cl</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Barra inferior */}
        <div className="mt-12 pt-8 border-t border-slate-800 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-slate-500">
              © {new Date().getFullYear()} Servicio Nacional de Aduanas - Frontera Digital.
            </p>
            <p className="text-xs text-slate-500">
              Versión 2.1.0  •  Última actualización: {getCurrentDate()}
            </p>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer; 