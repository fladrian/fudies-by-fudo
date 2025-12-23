export const env = {
  API_URL: import.meta.env.VITE_API_URL || '',
  MODE: import.meta.env.MODE,
  DEV: import.meta.env.DEV,
  PROD: import.meta.env.PROD,
}

if (!env.API_URL) {
  console.warn(
    'VITE_API_URL no está configurado. Por favor, crea un archivo .env con VITE_API_URL definido.'
  )
}
