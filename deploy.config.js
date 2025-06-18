module.exports = {
  // Configuración de protección contra errores
  errorHandling: {
    maxRetries: 3,
    retryDelay: 1000,
    errorThreshold: 0.1, // 10% de errores permitidos
  },

  // Configuración de recursos
  resources: {
    minMemory: '512MB',
    maxMemory: '1GB',
    cpuLimit: '1',
  },

  // Configuración de seguridad
  security: {
    cors: {
      origin: ['https://*.github.io', 'https://*.vercel.app'],
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true,
    },
    headers: {
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    },
  },

  // Configuración de caché
  cache: {
    maxAge: 3600, // 1 hora
    staleWhileRevalidate: true,
  },

  // Configuración de monitoreo
  monitoring: {
    enabled: true,
    metrics: ['response-time', 'error-rate', 'memory-usage'],
    alertThreshold: {
      responseTime: 2000, // ms
      errorRate: 0.05, // 5%
      memoryUsage: 0.8, // 80%
    },
  },
}; 