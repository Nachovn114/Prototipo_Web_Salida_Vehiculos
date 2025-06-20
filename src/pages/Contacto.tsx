import React, { useState } from 'react';
import { Mail, Phone, Clock, MapPin, Building2, ExternalLink, MessageSquare, HelpCircle, Globe2, Send, CheckCircle, AlertCircle, User, FileText, Map, Navigation } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const contactInfo = [
  {
    icon: <Mail className="h-5 w-5" />,
    title: "Correo de Soporte",
    value: "soporte@aduanachile.cl",
    link: "mailto:soporte@aduanachile.cl",
    description: "Tiempo de respuesta promedio: 24 horas",
    status: "Activo"
  },
  {
    icon: <Phone className="h-5 w-5" />,
    title: "Mesa de Ayuda",
    value: "+56 2 1234 5678",
    link: "tel:+56212345678",
    description: "Atención telefónica directa",
    status: "Disponible"
  },
  {
    icon: <Clock className="h-5 w-5" />,
    title: "Horario de Atención",
    value: "Lunes a Viernes",
    description: "08:00 a 18:00 hrs (GMT-3)",
    status: "Abierto"
  },
  {
    icon: <MapPin className="h-5 w-5" />,
    title: "Oficina Central",
    value: "Plaza Sotomayor 60, Valparaíso",
    description: "Región de Valparaíso, Chile",
    status: "Presencial"
  }
];

const additionalResources = [
  {
    icon: <MessageSquare className="h-5 w-5" />,
    title: "Chat en Línea",
    description: "Disponible en horario de oficina",
    action: "Iniciar chat",
    link: "#",
    available: true
  },
  {
    icon: <HelpCircle className="h-5 w-5" />,
    title: "Preguntas Frecuentes",
    description: "Consulta nuestra base de conocimientos",
    action: "Ver FAQ",
    link: "/ayuda",
    available: true
  },
  {
    icon: <Globe2 className="h-5 w-5" />,
    title: "Portal Aduana",
    description: "Visita el sitio web oficial",
    action: "Ir al portal",
    link: "https://www.aduana.cl",
    available: true
  }
];

const faqs = [
  {
    question: "¿Cómo puedo reportar un problema técnico?",
    answer: "Puedes reportar problemas técnicos a través del formulario de contacto, especificando 'Problema Técnico' en el tipo de consulta. También puedes llamar directamente a la mesa de ayuda."
  },
  {
    question: "¿Cuál es el tiempo de respuesta para consultas urgentes?",
    answer: "Las consultas marcadas como urgentes tienen un tiempo de respuesta de 2-4 horas en horario laboral. Para emergencias fuera de horario, contacta al número de emergencias."
  },
  {
    question: "¿Puedo solicitar una capacitación para mi equipo?",
    answer: "Sí, ofrecemos capacitaciones personalizadas. Completa el formulario de contacto seleccionando 'Capacitación' y especifica el número de participantes y fechas preferidas."
  },
  {
    question: "¿Cómo puedo acceder a reportes históricos?",
    answer: "Los reportes históricos están disponibles en la sección 'Reportes' del sistema. Si necesitas reportes especializados, contacta a nuestro equipo de análisis de datos."
  }
];

const Contacto: React.FC = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    tipoConsulta: '',
    asunto: '',
    mensaje: '',
    urgencia: 'normal'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'contacto' | 'formulario' | 'faq' | 'mapa'>('contacto');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simular envío
    await new Promise(resolve => setTimeout(resolve, 2000));

    toast.success('Mensaje enviado correctamente', {
      description: 'Nos pondremos en contacto contigo pronto.',
    });

    setFormData({
      nombre: '',
      email: '',
      telefono: '',
      tipoConsulta: '',
      asunto: '',
      mensaje: '',
      urgencia: 'normal'
    });
    setIsSubmitting(false);
  };

  const isFormValid = formData.nombre && formData.email && formData.asunto && formData.mensaje;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto py-12 px-4">
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

      {/* Navegación por pestañas */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {[
            { key: 'contacto', label: 'Información de Contacto', icon: <Phone className="h-4 w-4" /> },
            { key: 'formulario', label: 'Formulario de Contacto', icon: <Send className="h-4 w-4" /> },
            { key: 'faq', label: 'Preguntas Frecuentes', icon: <HelpCircle className="h-4 w-4" /> },
            { key: 'mapa', label: 'Ubicación', icon: <Map className="h-4 w-4" /> }
          ].map((tab) => (
            <Button
              key={tab.key}
              variant={activeTab === tab.key ? 'default' : 'outline'}
              onClick={() => setActiveTab(tab.key as any)}
              className="flex items-center gap-2"
            >
              {tab.icon}
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Contenido de las pestañas */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'contacto' && (
              <div className="space-y-12">
                {/* Información de contacto principal */}
                <section>
                  <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-blue-900 mb-4">Canales de Atención</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                      Estamos aquí para ayudarte. Contáctanos a través de cualquiera de nuestros canales de atención.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {contactInfo.map((info, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <Card className="p-6 hover:shadow-lg transition-shadow">
                          <div className="flex items-start gap-4">
                            <div className="bg-blue-100 p-3 rounded-lg">
                              {info.icon}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <h3 className="text-lg font-bold text-blue-900">{info.title}</h3>
                                <Badge variant="outline" className="text-xs">
                                  {info.status}
                                </Badge>
                              </div>
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
                      </motion.div>
                    ))}
                  </div>
                </section>

                {/* Recursos adicionales */}
                <section>
                  <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-blue-900 mb-4">Recursos Adicionales</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                      Explora otras formas de obtener ayuda y mantenerte informado.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    {additionalResources.map((resource, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <Card className="p-6 hover:shadow-lg transition-shadow">
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
                      </motion.div>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {activeTab === 'formulario' && (
              <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-blue-900 mb-4">Formulario de Contacto</h2>
                  <p className="text-gray-600">
                    Completa el formulario y nos pondremos en contacto contigo lo antes posible.
                  </p>
                </div>

                <Card className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nombre completo *
                        </label>
                        <Input
                          value={formData.nombre}
                          onChange={(e) => handleInputChange('nombre', e.target.value)}
                          placeholder="Tu nombre completo"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email *
                        </label>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="tu@email.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Teléfono
                        </label>
                        <Input
                          value={formData.telefono}
                          onChange={(e) => handleInputChange('telefono', e.target.value)}
                          placeholder="+56 9 1234 5678"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tipo de consulta
                        </label>
                        <Select value={formData.tipoConsulta} onValueChange={(value) => handleInputChange('tipoConsulta', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona el tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="soporte">Soporte técnico</SelectItem>
                            <SelectItem value="capacitacion">Capacitación</SelectItem>
                            <SelectItem value="reporte">Reporte de problema</SelectItem>
                            <SelectItem value="sugerencia">Sugerencia</SelectItem>
                            <SelectItem value="otro">Otro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Asunto *
                      </label>
                      <Input
                        value={formData.asunto}
                        onChange={(e) => handleInputChange('asunto', e.target.value)}
                        placeholder="Resumen de tu consulta"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mensaje *
                      </label>
                      <Textarea
                        value={formData.mensaje}
                        onChange={(e) => handleInputChange('mensaje', e.target.value)}
                        placeholder="Describe tu consulta en detalle..."
                        rows={6}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nivel de urgencia
                      </label>
                      <Select value={formData.urgencia} onValueChange={(value) => handleInputChange('urgencia', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="baja">Baja</SelectItem>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="alta">Alta</SelectItem>
                          <SelectItem value="urgente">Urgente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      type="submit"
                      disabled={!isFormValid || isSubmitting}
                      className="w-full"
                      size="lg"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Enviar mensaje
                        </>
                      )}
                    </Button>
                  </form>
                </Card>
              </div>
            )}

            {activeTab === 'faq' && (
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-blue-900 mb-4">Preguntas Frecuentes</h2>
                  <p className="text-gray-600">
                    Resolvemos las dudas más comunes sobre nuestros servicios de contacto.
                  </p>
                </div>

                <div className="grid gap-6">
                  {faqs.map((faq, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Card className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="bg-blue-100 p-2 rounded-lg">
                            <HelpCircle className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-blue-900 mb-2">
                              {faq.question}
                            </h3>
                            <p className="text-gray-600">
                              {faq.answer}
                            </p>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'mapa' && (
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-blue-900 mb-4">Ubicación</h2>
                  <p className="text-gray-600">
                    Encuentra nuestras oficinas y puntos de atención.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <Card className="p-6">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <MapPin className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-blue-900 mb-2">Oficina Central</h3>
                        <p className="text-gray-600 mb-2">Plaza Sotomayor 60, Valparaíso</p>
                        <p className="text-sm text-gray-500">Región de Valparaíso, Chile</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span>Lunes a Viernes: 08:00 - 18:00</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span>+56 2 1234 5678</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span>soporte@aduanachile.cl</span>
                      </div>
                    </div>

                    <Button className="w-full mt-6" variant="outline">
                      <Navigation className="h-4 w-4 mr-2" />
                      Obtener direcciones
                    </Button>
                  </Card>

                  <Card className="p-6">
                    <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <Map className="h-12 w-12 mx-auto mb-2" />
                        <p>Mapa interactivo</p>
                        <p className="text-sm">Integración con Google Maps</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Aviso */}
      <div className="text-center border-t pt-8 mt-12">
        <p className="text-sm text-gray-500 mb-2">
          Este es un sistema prototipo para fines académicos.
        </p>
        <p className="text-xs text-gray-400">
          La información de contacto es simulada y no corresponde a datos reales.
        </p>
      </div>
    </div>
  );
};

export default Contacto; 