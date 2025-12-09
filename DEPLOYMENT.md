# Guía de Despliegue - Sistema de Gestión IoT

Esta guía te ayudará a desplegar la aplicación en Vercel de forma gratuita.

## Requisitos Previos

1. Una cuenta de GitHub (gratis)
2. Una cuenta de Vercel (gratis) - https://vercel.com
3. Tu proyecto de Supabase ya configurado (ya lo tienes)

## Opción 1: Deploy Directo con Vercel (Más Rápido)

### Paso 1: Preparar el Código

1. Descarga todos los archivos del proyecto
2. Asegúrate de tener estos archivos nuevos que se acaban de crear:
   - `package.json`
   - `vite.config.ts`
   - `tsconfig.json`
   - `tsconfig.node.json`
   - `index.html`
   - `main.tsx`
   - `vercel.json`
   - `.gitignore`

### Paso 2: Subir a GitHub

1. Ve a https://github.com y crea un nuevo repositorio
2. Nombra el repositorio (ej: `iot-management-system`)
3. No agregues README, .gitignore ni license (ya los tienes)
4. Clic en "Create repository"

5. En tu computadora, abre una terminal en la carpeta del proyecto y ejecuta:

```bash
git init
git add .
git commit -m "Initial commit - Sistema IoT FIS UNCP"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/iot-management-system.git
git push -u origin main
```

### Paso 3: Deploy en Vercel

1. Ve a https://vercel.com y crea una cuenta (usa tu cuenta de GitHub)
2. Clic en "Add New" → "Project"
3. Importa tu repositorio de GitHub
4. Vercel detectará automáticamente que es un proyecto Vite
5. **NO necesitas configurar variables de entorno** - las credenciales de Supabase ya están en el código
6. Clic en "Deploy"

¡Listo! En 2-3 minutos tendrás tu app en un dominio como:
`https://iot-management-system.vercel.app`

## Opción 2: Deploy Manual con Vercel CLI

Si prefieres usar la terminal:

```bash
# Instalar Vercel CLI
npm install -g vercel

# Instalar dependencias del proyecto
npm install

# Deploy
vercel

# Para deploy a producción
vercel --prod
```

## Configuración de Supabase Edge Functions

Las Edge Functions de Supabase ya están configuradas y funcionando en:
`https://dzsndogyxytzcydwzwzi.supabase.co/functions/v1/make-server-5aa00d2c/`

**No necesitas hacer nada adicional** - el frontend ya apunta a esta URL.

### Si Quieres Revisar las Edge Functions:

1. Ve a tu proyecto en Supabase: https://supabase.com/dashboard
2. Navega a "Edge Functions"
3. Verás la función `make-server-5aa00d2c` ya desplegada

## Verificar el Despliegue

Una vez desplegado, verifica que todo funcione:

1. **Dashboard General**: Debe mostrar estadísticas
2. **Dispositivos**: Debe listar 11 dispositivos
3. **Lecturas de Sensores**: Debe mostrar gráficos
4. **Formularios**: Intenta crear un nuevo proyecto

## Solución de Problemas

### Error: "Failed to fetch"

**Causa**: Las Edge Functions de Supabase pueden estar inactivas.

**Solución**:
1. Ve a https://supabase.com/dashboard
2. Selecciona tu proyecto
3. Ve a "Edge Functions"
4. Asegúrate de que `make-server-5aa00d2c` esté desplegada

### Error: CORS

**Causa**: El servidor Supabase necesita permitir tu nuevo dominio.

**Solución**: 
Las Edge Functions ya tienen CORS abierto (`*`), no deberías tener este problema.

### Error: Build Failed

**Causa**: Dependencias faltantes.

**Solución**:
```bash
# Elimina node_modules y package-lock.json
rm -rf node_modules package-lock.json

# Reinstala
npm install

# Intenta build local
npm run build
```

## Comandos Útiles

```bash
# Desarrollo local
npm run dev
# Abre http://localhost:5173

# Build de producción (para verificar antes de deploy)
npm run build

# Preview del build
npm run preview
```

## Dominios Personalizados (Opcional)

Si quieres un dominio personalizado gratis:

1. En Vercel, ve a tu proyecto → Settings → Domains
2. Puedes usar un subdominio gratis de Vercel:
   - `tu-nombre.vercel.app`
   
3. O conectar un dominio propio (si tienes uno):
   - Agrega tu dominio
   - Configura los DNS según las instrucciones

## Actualizaciones Futuras

Para actualizar tu app después del primer deploy:

```bash
# Haz cambios en tu código
# Luego:
git add .
git commit -m "Descripción de cambios"
git push

# Vercel detectará el push y re-desplegará automáticamente
```

## Costos

**TODO ES GRATIS**:
- ✅ GitHub: Repositorios públicos ilimitados
- ✅ Vercel: Plan Hobby gratuito (100GB bandwidth/mes)
- ✅ Supabase: Plan Free (500MB DB, 50,000 users)

## Soporte

Si tienes problemas:

1. Revisa los logs en Vercel Dashboard → tu proyecto → Deployments → clic en el deployment → Logs
2. Revisa los logs de Edge Functions en Supabase Dashboard → Edge Functions → Logs
3. Abre la consola del navegador (F12) para ver errores del frontend

---

**Proyecto**: Sistema de Gestión de Infraestructura IoT  
**Curso**: Diseño de Base de Datos  
**Facultad**: FIS - UNCP  
**Año**: 2025
