/**
 * Valida un RUT chileno con o sin puntos y guión
 * @param rut RUT a validar (ej: 12.345.678-5)
 * @returns boolean
 */
export const validateRut = (rut: string): boolean => {
  // Eliminar puntos, guiones y espacios
  const cleanRut = rut.replace(/\./g, '').replace(/-/g, '').replace(/ /g, '').toUpperCase();
  
  // Validar formato
  if (!/^\d{7,8}[0-9K]$/.test(cleanRut)) {
    return false;
  }
  
  // Separar número y dígito verificador
  const rutNumber = cleanRut.slice(0, -1);
  const dv = cleanRut.slice(-1);
  
  // Calcular dígito verificador esperado
  let sum = 0;
  let multiple = 2;
  
  for (let i = rutNumber.length - 1; i >= 0; i--) {
    sum += parseInt(rutNumber.charAt(i)) * multiple;
    multiple = multiple === 7 ? 2 : multiple + 1;
  }
  
  const calculatedDv = 11 - (sum % 11);
  let expectedDv = calculatedDv === 11 ? '0' : calculatedDv === 10 ? 'K' : calculatedDv.toString();
  
  return expectedDv === dv;
};

/**
 * Formatea un RUT agregando puntos y guión
 * @param rut RUT a formatear (ej: 123456785)
 * @returns string RUT formateado (ej: 12.345.678-5)
 */
export const formatRut = (rut: string): string => {
  // Eliminar todo lo que no sea número o K
  const cleanRut = rut.replace(/[^0-9kK]/g, '');
  
  if (cleanRut.length <= 1) return cleanRut;
  
  // Separar número y dígito verificador
  const rutNumber = cleanRut.slice(0, -1);
  const dv = cleanRut.slice(-1).toUpperCase();
  
  // Formatear con puntos
  let formatted = '';
  let counter = 0;
  
  for (let i = rutNumber.length - 1; i >= 0; i--) {
    formatted = rutNumber.charAt(i) + formatted;
    counter++;
    if (counter === 3 && i !== 0) {
      formatted = '.' + formatted;
      counter = 0;
    }
  }
  
  return `${formatted}-${dv}`;
};

/**
 * Valida un número de teléfono chileno
 * @param phone Número de teléfono a validar (ej: +56 9 1234 5678)
 * @returns boolean
 */
export const validatePhone = (phone: string): boolean => {
  // Eliminar espacios, paréntesis y guiones
  const cleanPhone = phone.replace(/[\s\-()]/g, '');
  
  // Validar formato chileno: +56912345678 o 56912345678 o 912345678 o 12345678
  return /^(\+?56)?(9\d{8}|\d{8,9})$/.test(cleanPhone);
};

/**
 * Valida una patente de vehículo chilena
 * @param plate Patente a validar (ej: AB1234 o ABC123)
 * @returns boolean
 */
export const validatePatente = (plate: string): boolean => {
  // Eliminar espacios y guiones
  const cleanPlate = plate.replace(/[\s-]/g, '').toUpperCase();
  
  // Validar formato antiguo (AB1234) o nuevo (ABC123)
  return /^[A-Z]{2}\d{4}$/.test(cleanPlate) || /^[A-Z]{3}\d{3}$/.test(cleanPlate);
};

/**
 * Valida un correo electrónico
 * @param email Correo a validar
 * @returns boolean
 */
export const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

/**
 * Calcula la fortaleza de una contraseña
 * @param password Contraseña a evaluar
 * @returns number Puntuación de 0 a 4
 */
export const calculatePasswordStrength = (password: string): number => {
  if (!password) return 0;
  
  let strength = 0;
  
  // Longitud mínima
  if (password.length >= 8) strength += 1;
  
  // Contiene mayúsculas
  if (/[A-Z]/.test(password)) strength += 1;
  
  // Contiene números
  if (/\d/.test(password)) strength += 1;
  
  // Contiene caracteres especiales
  if (/[^A-Za-z0-9]/.test(password)) strength += 1;
  
  return strength;
};

/**
 * Obtiene un texto descriptivo de la fortaleza de la contraseña
 * @param strength Puntuación de fortaleza (0-4)
 * @returns string Texto descriptivo
 */
export const getPasswordStrengthText = (strength: number): string => {
  return strength === 0 ? 'Muy débil' :
         strength === 1 ? 'Débil' :
         strength === 2 ? 'Moderada' :
         strength === 3 ? 'Fuerte' : 'Muy fuerte';
};

/**
 * Obtiene el color de la barra de fortaleza de contraseña
 * @param strength Puntuación de fortaleza (0-4)
 * @returns string Clase de color de Tailwind
 */
export const getPasswordStrengthColor = (strength: number): string => {
  return strength <= 1 ? 'bg-red-500' :
         strength === 2 ? 'bg-yellow-500' :
         strength === 3 ? 'bg-blue-500' : 'bg-green-500';
};
