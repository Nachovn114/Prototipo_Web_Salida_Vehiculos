import React from 'react';
import { Shield, Users, Target, GitBranch, BarChart3, User, UserCheck, UserCog, UserPlus, ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui/card';

const roles = [
  {
    icon: <User className="h-6 w-6" />,
    title: "Conductor",
    description: "Responsable de iniciar solicitudes de salida vehicular y presentar la documentación requerida. Puede realizar seguimiento en tiempo real del estado de su trámite.",
    features: ["Inicio de solicitudes", "Carga de documentos", "Seguimiento de estado", "Notificaciones en tiempo real"]
  },
  {
    icon: <UserCheck className="h-6 w-6" />,
    title: "Inspector",
    description: "Encargado de realizar inspecciones físicas de vehículos y validar documentación. Tiene la facultad de firmar digitalmente las inspecciones realizadas.",
    features: ["Revisión documental", "Inspección física", "Firma digital", "Registro de observaciones"]
  },
  {
    icon: <UserCog className="h-6 w-6" />,
    title: "Aduanero",
    description: "Supervisa y autoriza el proceso de salida vehicular, asegurando el cumplimiento de normativas aduaneras y la correcta aplicación de protocolos.",
    features: ["Supervisión de procesos", "Autorización final", "Control normativo", "Gestión de incidencias"]
  },
  {
    icon: <UserPlus className="h-6 w-6" />,
    title: "Administrador",
    description: "Gestiona la plataforma a nivel global, incluyendo usuarios, reportes y métricas de calidad del sistema.",
    features: ["Gestión de usuarios", "Reportes avanzados", "Configuración del sistema", "Control de calidad"]
  }
];

const stats = [
  { value: "98%", label: "Satisfacción", description: "de usuarios satisfechos" },
  { value: "24/7", label: "Disponibilidad", description: "servicio continuo" },
  { value: "-40%", label: "Tiempo de espera", description: "reducción promedio" },
  { value: "+5000", label: "Trámites", description: "procesados mensualmente" }
];

const Acerca: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
    {/* Header */}
    <div className="bg-white border-b">
      <div className="max-w-5xl mx-auto py-12 px-4">
        <div className="flex flex-col items-center text-center">
          <div className="bg-blue-50 p-4 rounded-2xl mb-6">
            <img 
              src="/assets/frontera-digital-logo.png" 
              alt="Frontera Digital Logo" 
              className="h-24 w-24"
            />
          </div>
          <h1 className="text-4xl font-black text-blue-900 mb-4">
            Frontera Digital
          </h1>
          <p className="text-xl text-blue-600 font-medium mb-6">
            Sistema Oficial de Control de Salida Vehicular
          </p>
          <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-4 py-2 rounded-full">
            <Shield className="h-4 w-4" />
            Plataforma institucional de Aduana Chile
          </div>
        </div>
      </div>
    </div>

    {/* Contenido principal */}
    <div className="max-w-5xl mx-auto py-12 px-4">
      {/* Descripción y objetivos */}
      <section className="mb-16">
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-blue-900 mb-3">
                  Objetivo institucional
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  Modernizar y digitalizar el proceso de control fronterizo entre Chile y Argentina, 
                  implementando tecnología de vanguardia para asegurar:
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center gap-2 text-gray-600">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                    Eficiencia en los tiempos de procesamiento
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                    Trazabilidad completa de operaciones
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                    Cumplimiento normativo riguroso
                  </li>
                  <li className="flex items-center gap-2 text-gray-600">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                    Transparencia en los procesos
                  </li>
                </ul>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-blue-900 mb-3">
                  Impacto del sistema
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {stats.map((stat, i) => (
                    <div key={i} className="text-center p-3 bg-blue-50/50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{stat.value}</div>
                      <div className="text-sm font-medium text-blue-900">{stat.label}</div>
                      <div className="text-xs text-blue-600/80">{stat.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Roles del sistema */}
      <section className="mb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-blue-900 mb-4">Roles del Sistema</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Cada perfil cumple un papel fundamental en el proceso de control y autorización 
            de salida vehicular, asegurando eficiencia y seguridad en cada etapa.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {roles.map((role, i) => (
            <Card key={i} className="p-6">
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  {role.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-blue-900 mb-2">{role.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{role.description}</p>
                  <div className="space-y-2">
                    {role.features.map((feature, j) => (
                      <div key={j} className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Enlaces y recursos */}
      <section className="mb-16">
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <GitBranch className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-blue-900 mb-2">Changelog</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Registro detallado de actualizaciones y mejoras del sistema.
                </p>
                <a 
                  href="/changelog" 
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                >
                  Ver historial de cambios
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-blue-900 mb-2">Métricas de Calidad</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Indicadores de rendimiento y calidad del servicio en tiempo real.
                </p>
                <a 
                  href="/calidad" 
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                >
                  Ver métricas
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center border-t pt-8">
        <div className="flex flex-col items-center gap-2">
          <img 
            src="/assets/frontera-digital-logo.png" 
            alt="Frontera Digital Logo" 
            className="h-12 w-12 mb-2 opacity-50"
          />
          <p className="text-sm text-gray-500">
            Desarrollado por Ignacio Valeria
          </p>
          <p className="text-sm text-gray-400">
            © 2024 Aduana Chile - Todos los derechos reservados
          </p>
        </div>
      </footer>
    </div>
  </div>
);

export default Acerca; 