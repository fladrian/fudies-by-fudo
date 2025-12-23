import { format, getYear, formatISO } from 'date-fns'
import { es } from 'date-fns/locale'

export const formatPostDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return format(dateObj, "d 'de' MMMM 'de' yyyy, HH:mm", { locale: es })
}

export const formatCommentDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return format(dateObj, 'd MMM yyyy, HH:mm', { locale: es })
}

export const getCurrentYear = (): number => {
  return getYear(new Date())
}

export const getCurrentDateISO = (): string => {
  return formatISO(new Date())
}
