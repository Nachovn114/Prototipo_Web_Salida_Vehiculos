import React from 'react';
import { HelpCircle, FileText, Shield, Users, Clock, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { Card } from '@/components/ui/card';

const faqs = [
  {
    question: "¿Cómo se valida una solicitud de salida vehicular?",
    answer: "El proceso de validación incluye tres etapas: 1) Revisión documental por el conductor, 2) Inspección física por el inspector, y 3) Autorización final por el aduanero. Cada etapa debe completarse antes de proceder a la siguiente.",
    icon: <CheckCircle className="h-5 w-5 text-green-600" />
  },
  {
    question: "¿Qué documentos debo adjuntar obligatoriamente?",
    answer: "Documentos requeridos: Licencia de conducir vigente, Permiso de circulación, Seguro obligatorio, Documentos de carga (si aplica), y Certificados sanitarios según el tipo de mercancía.",
    icon: <FileText className="h-5 w-5 text-blue-600" />
  },
  {
    question: "¿Qué pasa si no hay conexión a internet?",
    answer: "El sistema funciona en modo offline. Los datos se sincronizan automáticamente cuando se restablece la conexión. Se recomienda verificar la conectividad antes de iniciar el proceso.",
    icon: <AlertTriangle className="h-5 w-5 text-orange-600" />
  },
  {
    question: "¿Cuánto tiempo toma el proceso completo?",
    answer: "El tiempo promedio es de 15-30 minutos dependiendo de la complejidad de la carga y el flujo vehicular. Los tiempos pueden variar en horarios de alta demanda.",
    icon: <Clock className="h-5 w-5 text-purple-600" />
  },
  {
    question: "¿Puedo cancelar una solicitud en proceso?",
    answer: "Sí, puedes cancelar una solicitud antes de que sea firmada por el inspector. Una vez firmada, debe seguir el proceso de anulación oficial que requiere autorización del aduanero.",
    icon: <Info className="h-5 w-5 text-blue-600" />
  },
  {
    question: "¿Cómo funciona la firma digital?",
    answer: "La firma digital es un proceso seguro que valida la identidad del inspector y certifica que la inspección fue realizada. Incluye timestamp y es legalmente válida según normativas aduaneras.",
    icon: <Shield className="h-5 w-5 text-green-600" />
  }
];

const quickGuides = [
  {
    title: "Para Conductores",
    steps: [
      "Completa el formulario de solicitud",
      "Adjunta todos los documentos requeridos",
      "Espera la notificación de inspección",
      "Sigue las instrucciones del inspector"
    ]
  },
  {
    title: "Para Inspectores",
    steps: [
      "Revisa la documentación presentada",
      "Realiza la inspección física del vehículo",
      "Registra observaciones si las hay",
      "Firma digitalmente la inspección"
    ]
  },
  {
    title: "Para Aduaneros",
    steps: [
      "Supervisa el proceso completo",
      "Valida la documentación e inspección",
      "Autoriza la salida vehicular",
      "Registra la operación en el sistema"
    ]
  }
];

const Ayuda: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
    {/* Header */}
    <div className="bg-white border-b">
      <div className="max-w-5xl mx-auto py-12 px-4">
        <div className="flex flex-col items-center text-center">
          <div className="bg-blue-50 p-4 rounded-2xl mb-6">
            <HelpCircle className="h-16 w-16 text-blue-600" />
          </div>
          <h1 className="text-4xl font-black text-blue-900 mb-4">
            Centro de Ayuda
          </h1>
          <p className="text-xl text-blue-600 font-medium mb-6">
            Frontera Digital - Guías y Preguntas Frecuentes
          </p>
          <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-4 py-2 rounded-full">
            <Info className="h-4 w-4" />
            Encuentra respuestas rápidas y guías de uso
          </div>
        </div>
      </div>
    </div>

    {/* Contenido principal */}
    <div className="max-w-5xl mx-auto py-12 px-4">
      {/* Guías rápidas */}
      <section className="mb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-blue-900 mb-4">Guías Rápidas por Rol</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Instrucciones paso a paso para cada tipo de usuario del sistema.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {quickGuides.map((guide, i) => (
            <Card key={i} className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-blue-900">{guide.title}</h3>
              </div>
              <ol className="space-y-2">
                {guide.steps.map((step, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="bg-blue-100 text-blue-600 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                      {j + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </Card>
          ))}
        </div>
      </section>

      {/* Preguntas frecuentes */}
      <section className="mb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-blue-900 mb-4">Preguntas Frecuentes</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Resolvemos las dudas más comunes sobre el uso del sistema.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <Card key={i} className="p-6">
              <div className="flex items-start gap-4">
                <div className="bg-blue-50 p-2 rounded-lg flex-shrink-0">
                  {faq.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-blue-900 mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Información de contacto */}
      <section className="mb-16">
        <Card className="p-8 bg-gradient-to-r from-blue-50 to-blue-100">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-blue-900 mb-4">
              ¿No encontraste lo que buscabas?
            </h2>
            <p className="text-gray-600 mb-6">
              Nuestro equipo de soporte está disponible para ayudarte.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/contacto"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-xl transition-colors"
              >
                Contactar Soporte
              </a>
              <a 
                href="mailto:soporte@aduanachile.cl"
                className="bg-white hover:bg-gray-50 text-blue-600 font-medium px-6 py-3 rounded-xl border border-blue-200 transition-colors"
              >
                Enviar Email
              </a>
            </div>
          </div>
        </Card>
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
            Sistema Frontera Digital - Centro de Ayuda
          </p>
          <p className="text-sm text-gray-400">
            © 2025 Aduana Chile - Todos los derechos reservados
          </p>
        </div>
      </footer>
    </div>
  </div>
);

export default Ayuda; 