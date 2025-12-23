# Fudies by Fudo

Una aplicación web moderna de blog/foro construida con React, TypeScript y Vite. Permite a los usuarios crear y gestionar posts, así como comentar en ellos con soporte para respuestas anidadas.

## 📋 Descripción

Fudies es una plataforma social donde los usuarios pueden:
- Crear y editar posts con título y contenido
- Comentar en posts con soporte para respuestas anidadas
- Gestionar sus propias publicaciones (editar y eliminar)
- Mantener su información de usuario (nombre y avatar) almacenada localmente

La aplicación está construida con una arquitectura limpia, separando las capas de presentación, aplicación, datos y dominio.

## 🛠️ Dependencias Principales

### Runtime
- **React 19** - Librería de UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **React Router DOM** - Enrutamiento
- **TanStack Query (React Query)** - Gestión de estado del servidor y cache
- **Zustand** - Gestión de estado local (usuarios y ownership)
- **Axios** - Cliente HTTP
- **React Hook Form + Zod** - Validación de formularios
- **Tailwind CSS** - Estilos utility-first
- **Sonner** - Notificaciones toast
- **Headless UI** - Componentes accesibles
- **date-fns** - Manejo de fechas

### Desarrollo
- **Vitest** - Framework de testing
- **React Testing Library** - Testing de componentes
- **ESLint** - Linter
- **Prettier** - Formateo de código

## 🚀 Instalación y Desarrollo Local

### Prerequisitos
- Node.js 20 o superior
- pnpm (recomendado) o npm

### Pasos

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd fudies-by-fudo
   ```

2. **Instalar dependencias**
   ```bash
   pnpm install
   # o
   npm install
   ```

3. **Configurar variables de entorno**
   
   Copia el archivo de ejemplo y ajusta la URL del API según sea necesario:
   ```bash
   cp .env.example .env
   ```
   
   O crea un archivo `.env` en la raíz del proyecto:
   ```env
   VITE_API_URL=https://665de6d7e88051d60408c32d.mockapi.io
   ```
   
   **Nota:** Para desarrollo local con un backend, usa:
   ```env
   VITE_API_URL=http://localhost:3000/api
   ```

4. **Iniciar servidor de desarrollo**
   ```bash
   pnpm dev
   # o
   npm run dev
   ```

   La aplicación estará disponible en `http://localhost:5173`

### Scripts Disponibles

```bash
# Desarrollo
pnpm dev              # Inicia servidor de desarrollo
pnpm build            # Construye para producción
pnpm preview          # Preview de la build de producción

# Testing
pnpm test             # Ejecuta tests
pnpm test:ui          # Ejecuta tests con UI
pnpm test:coverage    # Ejecuta tests con coverage

# Code Quality
pnpm lint             # Ejecuta ESLint
pnpm lint:fix         # Ejecuta ESLint y corrige errores
pnpm format           # Formatea código con Prettier
pnpm format:check     # Verifica formato sin modificar
```

## 🐳 Docker

### Construir la imagen

Para construir la imagen con las variables de entorno necesarias, pasa el argumento `VITE_API_URL`:

```bash
docker build --build-arg VITE_API_URL=https://665de6d7e88051d60408c32d.mockapi.io -t fudies-by-fudo .
```

O si quieres usar tu archivo `.env` local:

```bash
docker build --build-arg VITE_API_URL=$(grep VITE_API_URL .env | cut -d '=' -f2) -t fudies-by-fudo .
```

**Nota:** Las variables de entorno de Vite deben estar disponibles durante el build, no en runtime, ya que se inyectan en el código compilado.

### Ejecutar el contenedor

Para ejecutar el contenedor en modo detached (en segundo plano):

```bash
docker run -d --name fudies-by-fudo -p 3000:3000 fudies-by-fudo
```

La aplicación estará disponible en `http://localhost:3000`

**Nota:** Si el puerto 3000 ya está en uso, puedes mapear a otro puerto:

```bash
docker run -d --name fudies-by-fudo -p 8080:3000 fudies-by-fudo
```

En este caso, la aplicación estará disponible en `http://localhost:8080`

### Comandos útiles

```bash
# Ver logs del contenedor
docker logs fudies-by-fudo

# Detener el contenedor
docker stop fudies-by-fudo

# Iniciar el contenedor (si está detenido)
docker start fudies-by-fudo

# Eliminar el contenedor
docker rm -f fudies-by-fudo

# Ver el estado del contenedor
docker ps | grep fudies-by-fudo
```

### Build multi-stage

El Dockerfile utiliza un build multi-stage:
1. **Build stage**: Compila la aplicación React con Node.js
2. **Production stage**: Sirve los archivos estáticos con Nginx

El contenedor final es ligero (basado en Nginx Alpine) y optimizado para producción.

## 📁 Estructura del Proyecto

```
src/
├── application/      # Capa de aplicación (stores, casos de uso)
├── core/            # Capa de dominio (entidades, repositorios)
├── data/            # Capa de datos (implementación de repositorios, API)
├── presentation/    # Capa de presentación (componentes, páginas, hooks)
├── shared/          # Código compartido (configuración, utilidades)
└── test/            # Tests
```

## 🧪 Testing

El proyecto utiliza Vitest y React Testing Library para testing. Los tests están organizados en la carpeta `src/test/` siguiendo la misma estructura del código fuente.

```bash
# Ejecutar todos los tests
pnpm test

# Ejecutar tests en modo watch
pnpm test --watch

# Ejecutar tests con UI
pnpm test:ui
```

## 📝 Notas Adicionales

- La aplicación requiere un backend API funcionando (configurado en `VITE_API_URL`)
- Los datos del usuario se almacenan en `localStorage` usando Zustand persist
- La aplicación utiliza arquitectura hexagonal/clean architecture para separación de responsabilidades
