import { format, getYear, formatISO } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Formatea una fecha para mostrar en posts (formato largo con hora)
 * Ejemplo: "1 de diciembre de 2025, 15:06"
 */
export const formatPostDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, "d 'de' MMMM 'de' yyyy, HH:mm", { locale: es });
};

/**
 * Formatea una fecha para mostrar en comentarios (formato corto con hora)
 * Ejemplo: "1 dic 2025, 15:06"
 */
export const formatCommentDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, "d MMM yyyy, HH:mm", { locale: es });
};

/**
 * Obtiene el año actual
 */
export const getCurrentYear = (): number => {
  return getYear(new Date());
};

/**
 * Obtiene la fecha actual en formato ISO string para createdAt
 */
export const getCurrentDateISO = (): string => {
  return formatISO(new Date());
};

