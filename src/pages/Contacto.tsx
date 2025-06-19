import React from 'react';
import { Mail, Phone, Clock, MapPin, Building2, ExternalLink, MessageSquare, HelpCircle, Globe2 } from 'lucide-react';
import { Card } from '@/components/ui/card';

const contactInfo = [
  {
    icon: <Mail className="h-5 w-5" />,
    title: "Correo de Soporte",
    value: "soporte@aduanachile.cl",
    link: "mailto:soporte@aduanachile.cl",
    description: "Tiempo de respuesta promedio: 24 horas"
  },
  {
    icon: <Phone className="h-5 w-5" />,
    title: "Mesa de Ayuda",
    value: "+56 2 1234 5678",
    link: "tel:+56212345678",
    description: "Atención telefónica directa"
  },
  {
    icon: <Clock className="h-5 w-5" />,
    title: "Horario de Atención",
    value: "Lunes a Viernes",
    description: "08:00 a 18:00 hrs (GMT-3)"
  },
  {
    icon: <MapPin className="h-5 w-5" />,
    title: "Oficina Central",
    value: "Plaza Sotomayor 60, Valparaíso",
    description: "Región de Valparaíso, Chile"
  }
];

const additionalResources = [
  {
    icon: <MessageSquare className="h-5 w-5" />,
    title: "Chat en Línea",
    description: "Disponible en horario de oficina",
    action: "Iniciar chat",
    link: "#"
  },
  {
    icon: <HelpCircle className="h-5 w-5" />,
    title: "Preguntas Frecuentes",
    description: "Consulta nuestra base de conocimientos",
    action: "Ver FAQ",
    link: "#"
  },
  {
    icon: <Globe2 className="h-5 w-5" />,
    title: "Portal Aduana",
    description: "Visita el sitio web oficial",
    action: "Ir al portal",
    link: "https://www.aduana.cl"
  }
];

const Contacto: React.FC = () => (
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
            Contacto Institucional
          </h1>
          <p className="text-xl text-blue-600 font-medium mb-6">
            Frontera Digital - Sistema de Control Vehicular
          </p>
          <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-4 py-2 rounded-full">
            <Building2 className="h-4 w-4" />
            Servicio Nacional de Aduanas
          </div>
        </div>
      </div>
    </div>

    {/* Contenido principal */}
    <div className="max-w-5xl mx-auto py-12 px-4">
      {/* Información de contacto principal */}
      <section className="mb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-blue-900 mb-4">Canales de Atención</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Estamos aquí para ayudarte. Contáctanos a través de cualquiera de nuestros canales de atención.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {contactInfo.map((info, i) => (
            <Card key={i} className="p-6">
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  {info.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-blue-900 mb-1">{info.title}</h3>
                  {info.link ? (
                    <a 
                      href={info.link}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      {info.value}
                    </a>
                  ) : (
                    <p className="text-gray-700 font-medium">{info.value}</p>
                  )}
                  <p className="text-sm text-gray-600 mt-1">{info.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Recursos adicionales */}
      <section className="mb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-blue-900 mb-4">Recursos Adicionales</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explora otras formas de obtener ayuda y mantenerte informado.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {additionalResources.map((resource, i) => (
            <Card key={i} className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="bg-blue-100 p-3 rounded-lg mb-4">
                  {resource.icon}
                </div>
                <h3 className="text-lg font-bold text-blue-900 mb-2">{resource.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{resource.description}</p>
                <a 
                  href={resource.link}
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                >
                  {resource.action}
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Aviso */}
      <div className="text-center border-t pt-8">
        <p className="text-sm text-gray-500 mb-2">
          Este es un sistema prototipo para fines académicos.
        </p>
        <p className="text-xs text-gray-400">
          La información de contacto es simulada y no corresponde a datos reales.
        </p>
      </div>
    </div>
  </div>
);

export default Contacto; 