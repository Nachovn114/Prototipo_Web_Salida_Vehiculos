import React from 'react';
import { HelpCircle, FileText, Shield, Users, Clock, AlertTriangle, CheckCircle, Info, Mail, Phone, Video, BookOpen, Wrench, Calendar, Bell, ExternalLink, Download, Globe, MapPin } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

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
  },
  {
    question: "¿Qué hago si el sistema no reconoce mi documento?",
    answer: "Verifica que el documento esté en buen estado y bien iluminado. Si el problema persiste, contacta al soporte técnico o utiliza el formulario manual de ingreso de datos.",
    icon: <Wrench className="h-5 w-5 text-orange-600" />
  },
  {
    question: "¿Cómo puedo recuperar una solicitud perdida?",
    answer: "Las solicitudes se guardan automáticamente. Puedes acceder a ellas desde 'Mis Solicitudes' en el menú principal. Si no aparece, verifica tu conexión a internet.",
    icon: <Info className="h-5 w-5 text-blue-600" />
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

const tutorials = [
  {
    title: "Primeros Pasos en Frontera Digital",
    description: "Aprende a navegar por el sistema y crear tu primera solicitud",
    duration: "5:32",
    thumbnail: "🎥",
    url: "#"
  },
  {
    title: "Carga de Documentos",
    description: "Guía completa para subir y validar documentos",
    duration: "8:15",
    thumbnail: "📄",
    url: "#"
  },
  {
    title: "Proceso de Inspección",
    description: "Cómo realizar una inspección vehicular completa",
    duration: "12:45",
    thumbnail: "🔍",
    url: "#"
  },
  {
    title: "Firma Digital y Autorización",
    description: "Proceso de firma digital y autorización final",
    duration: "6:20",
    thumbnail: "✍️",
    url: "#"
  }
];

const glossary = [
  { term: "SOAP", definition: "Seguro Obligatorio de Accidentes Personales. Documento obligatorio para circular en Chile." },
  { term: "Revisión Técnica", definition: "Inspección técnica obligatoria que certifica que el vehículo cumple con las condiciones de seguridad." },
  { term: "Permiso de Circulación", definition: "Documento que autoriza la circulación del vehículo en las vías públicas." },
  { term: "Arancel Aduanero", definition: "Impuesto que se aplica sobre el valor de las mercancías que cruzan la frontera." },
  { term: "Firma Digital", definition: "Proceso electrónico que valida la identidad y autoriza una operación de forma legal." },
  { term: "Biometría", definition: "Sistema de identificación basado en características físicas únicas (huella dactilar, rostro)." }
];

const commonProblems = [
  {
    problem: "No puedo iniciar sesión",
    solution: "Verifica tu RUT y contraseña. Si olvidaste tu contraseña, usa la opción de recuperación.",
    severity: "Alto"
  },
  {
    problem: "La carga de documentos es muy lenta",
    solution: "Verifica tu conexión a internet. Los archivos deben ser menores a 5MB.",
    severity: "Medio"
  },
  {
    problem: "El sistema no reconoce mi documento",
    solution: "Asegúrate de que el documento esté bien iluminado y en buen estado.",
    severity: "Medio"
  },
  {
    problem: "Error al firmar digitalmente",
    solution: "Verifica que tu certificado digital esté vigente y no haya expirado.",
    severity: "Alto"
  }
];

const updates = [
  {
    version: "v2.1.0",
    date: "15 de Diciembre, 2024",
    changes: [
      "Nueva interfaz de carga de documentos mejorada",
      "Soporte para firmas biométricas",
      "Mejoras en la responsividad móvil",
      "Corrección de errores menores"
    ]
  },
  {
    version: "v2.0.5",
    date: "1 de Diciembre, 2024",
    changes: [
      "Integración con sistema de aduanas argentino",
      "Nuevos reportes de estadísticas",
      "Optimización del rendimiento"
    ]
  }
];

const Ayuda: React.FC = () => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
  >
    {/* Header */}
    <header className="bg-white dark:bg-gray-950 border-b dark:border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <div className="inline-block bg-blue-100 dark:bg-blue-900/50 p-4 rounded-2xl mb-4">
            <HelpCircle className="h-12 w-12 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight sm:text-5xl">
            Centro de Ayuda
          </h1>
          <p className="mt-4 text-xl text-gray-500 dark:text-gray-400">
            Guías, preguntas frecuentes y soporte para Frontera Digital.
          </p>
        </motion.div>
      </div>
    </header>

    {/* Contenido principal */}
    <main className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      {/* Videos Tutoriales */}
      <section className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight flex items-center justify-center gap-3">
            <Video className="h-8 w-8 text-blue-600" />
            Videos Tutoriales
          </h2>
          <p className="mt-3 text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Aprende a usar el sistema con nuestros videos paso a paso.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tutorials.map((tutorial, i) => (
            <motion.div
              key={tutorial.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300 dark:bg-gray-800/50 group cursor-pointer">
                <CardContent className="p-6">
                  <div className="text-4xl mb-4">{tutorial.thumbnail}</div>
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors">
                    {tutorial.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    {tutorial.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">
                      {tutorial.duration}
                    </Badge>
                    <Button size="sm" variant="outline" className="group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Ver
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Guías rápidas */}
      <section className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight">Guías Rápidas por Rol</h2>
          <p className="mt-3 text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Instrucciones paso a paso para cada tipo de usuario del sistema.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {quickGuides.map((guide, i) => (
            <motion.div
              key={guide.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300 dark:bg-gray-800/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-lg">
                      <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span>{guide.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-3">
                    {guide.steps.map((step, j) => (
                      <li key={j} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
                        <span className="flex-shrink-0 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 font-bold rounded-full w-6 h-6 flex items-center justify-center">
                          {j + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Preguntas frecuentes */}
      <section className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight">Preguntas Frecuentes</h2>
          <p className="mt-3 text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Resolvemos las dudas más comunes sobre el uso del sistema.
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-lg font-medium text-left hover:no-underline">
                  <div className="flex items-center gap-4">
                    {faq.icon}
                    {faq.question}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-base text-gray-600 dark:text-gray-300 pl-11 pt-2">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </section>

      {/* Problemas Comunes */}
      <section className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight flex items-center justify-center gap-3">
            <Wrench className="h-8 w-8 text-orange-600" />
            Problemas Comunes
          </h2>
          <p className="mt-3 text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Soluciones rápidas para los problemas más frecuentes.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {commonProblems.map((problem, i) => (
            <motion.div
              key={problem.problem}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
            >
              <Card className="h-full dark:bg-gray-800/50">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-lg">{problem.problem}</h3>
                    <Badge 
                      variant={problem.severity === "Alto" ? "destructive" : "secondary"}
                      className="text-xs"
                    >
                      {problem.severity}
                    </Badge>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {problem.solution}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Glosario */}
      <section className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight flex items-center justify-center gap-3">
            <BookOpen className="h-8 w-8 text-purple-600" />
            Glosario de Términos
          </h2>
          <p className="mt-3 text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Conoce los términos técnicos utilizados en el sistema.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {glossary.map((term, i) => (
            <motion.div
              key={term.term}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + i * 0.05 }}
            >
              <Card className="h-full dark:bg-gray-800/50">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg text-blue-600 dark:text-blue-400 mb-2">
                    {term.term}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {term.definition}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Novedades */}
      <section className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight flex items-center justify-center gap-3">
            <Bell className="h-8 w-8 text-green-600" />
            Novedades y Actualizaciones
          </h2>
          <p className="mt-3 text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Mantente informado sobre las últimas mejoras del sistema.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {updates.map((update, i) => (
            <motion.div
              key={update.version}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + i * 0.1 }}
            >
              <Card className="dark:bg-gray-800/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-3">
                      <Badge variant="outline" className="text-sm">
                        {update.version}
                      </Badge>
                      <span className="text-lg">{update.date}</span>
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {update.changes.map((change, j) => (
                      <li key={j} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
                        <span className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></span>
                        {change}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Información de contacto */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Card className="bg-blue-600 text-white dark:bg-blue-700 overflow-hidden">
            <div className="p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-2xl font-bold mb-4">¿Necesitas más ayuda?</h2>
                  <p className="text-blue-100 mb-6">
                    Nuestro equipo de soporte está disponible para asistirte con cualquier consulta o problema técnico.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5" />
                      <span>soporte.frontera@aduana.cl</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5" />
                      <span>+56 2 2345 6789</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5" />
                      <span>Frontera Los Libertadores, Chile</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5" />
                      <span>Lun-Vie: 8:00 - 18:00 | Sáb: 9:00 - 14:00</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-4">
                  <Button asChild variant="secondary" size="lg" className="w-full">
                    <a href="mailto:soporte.frontera@aduana.cl">
                      <Mail className="h-4 w-4 mr-2" />
                      Enviar Email
                    </a>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="w-full border-white text-white hover:bg-white hover:text-blue-600">
                    <a href="tel:+56223456789">
                      <Phone className="h-4 w-4 mr-2" />
                      Llamar Ahora
                    </a>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="w-full border-white text-white hover:bg-white hover:text-blue-600">
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      <Download className="h-4 w-4 mr-2" />
                      Manual de Usuario
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </section>
    </main>
  </motion.div>
);

export default Ayuda; 