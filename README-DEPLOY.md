# 🚀 Cómo Hacer Deploy de Este Proyecto

## Resumen Ejecutivo

Tu proyecto **ya está listo** para hacer deploy. Solo necesitas subirlo a GitHub y conectarlo con Vercel.

**Tiempo estimado**: 5-10 minutos  
**Costo**: $0 (todo gratis)  
**Resultado**: Tu app en una URL pública tipo `https://tu-proyecto.vercel.app`

---

## 📋 Lo Que Ya Tienes Configurado

✅ **Archivos de Configuración Creados**:
- `package.json` - Dependencias del proyecto
- `vite.config.ts` - Configuración de Vite
- `tsconfig.json` - Configuración de TypeScript
- `index.html` - HTML principal
- `main.tsx` - Entry point de React
- `vercel.json` - Configuración de Vercel
- `.gitignore` - Archivos a ignorar en Git

✅ **Supabase Backend**:
- Base de datos PostgreSQL con 10 tablas
- 28 Edge Functions endpoints ya desplegados
- Credenciales en `/utils/supabase/info.tsx`

✅ **Frontend React**:
- 9 componentes principales
- 9 formularios CRUD
- Gráficos con Recharts
- UI con Tailwind CSS

---

## 🎯 Guía Paso a Paso

### Opción A: Con Interfaz Gráfica (Recomendado)

#### 1️⃣ Sube el Código a GitHub

**Si no tienes Git instalado**:
1. Descarga Git: https://git-scm.com/downloads
2. Instala con opciones por defecto
3. Reinicia tu terminal/cmd

**Subir a GitHub**:
1. Ve a https://github.com/new
2. Nombre del repositorio: `iot-management-fis-uncp`
3. Descripción: `Sistema de Gestión IoT - Diseño de BD`
4. Selecciona "Public"
5. NO marques "Add README" ni ".gitignore"
6. Clic en "Create repository"

7. En tu terminal, en la carpeta del proyecto:

```bash
git init
git add .
git commit -m "Proyecto Sistema IoT - FIS UNCP 2025"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/iot-management-fis-uncp.git
git push -u origin main
```

Reemplaza `TU_USUARIO` con tu usuario de GitHub.

#### 2️⃣ Deploy en Vercel

1. Ve a https://vercel.com
2. Clic en "Sign Up" → Elige "Continue with GitHub"
3. Autoriza a Vercel acceder a tu cuenta de GitHub
4. En el dashboard de Vercel, clic en "Add New..." → "Project"
5. Verás tu repositorio `iot-management-fis-uncp`
6. Clic en "Import"
7. **Framework Preset**: Vite (se detecta automáticamente)
8. **Build Command**: `npm run build` (ya configurado)
9. **Output Directory**: `dist` (ya configurado)
10. **NO agregues variables de entorno** (ya están en el código)
11. Clic en "Deploy"

⏳ Espera 2-3 minutos...

✅ ¡Listo! Vercel te dará una URL como:
```
https://iot-management-fis-uncp.vercel.app
```

---

### Opción B: Con Terminal (Más Rápido)

```bash
# 1. Instalar Vercel CLI globalmente
npm install -g vercel

# 2. Inicializar Git (si no lo has hecho)
git init
git add .
git commit -m "Proyecto Sistema IoT - FIS UNCP 2025"

# 3. Subir a GitHub (crea el repo primero en github.com/new)
git remote add origin https://github.com/TU_USUARIO/tu-repo.git
git branch -M main
git push -u origin main

# 4. Deploy con Vercel
vercel

# Sigue las instrucciones:
# - Set up and deploy? Yes
# - Which scope? (tu cuenta)
# - Link to existing project? No
# - Project name? (acepta el sugerido o ponle uno)
# - In which directory? ./ (presiona Enter)
# - Override settings? No

# 5. Deploy a producción
vercel --prod
```

---

## 🧪 Verificar que Todo Funciona

Una vez desplegado, abre tu URL y verifica:

### ✅ Checklist de Verificación

- [ ] El **Dashboard** muestra 4 estadísticas (Proyectos, Dispositivos, Alertas, Lecturas)
- [ ] La sección **Dispositivos** lista 11 dispositivos
- [ ] Los **Gráficos de Sensores** muestran datos de temperatura/humedad
- [ ] La sección **Alertas** muestra 8 alertas
- [ ] Los **Formularios** se pueden abrir (prueba "Nuevo Proyecto")
- [ ] El sidebar funciona y cambia entre secciones

### ❌ Si Algo No Funciona

**Problema**: Página en blanco  
**Solución**: 
1. Abre la consola del navegador (F12)
2. Ve a la pestaña "Console"
3. Busca errores en rojo
4. Probablemente es un error de importación - revisa que todos los archivos estén subidos

**Problema**: "Failed to fetch" en las estadísticas  
**Solución**:
1. Ve a https://supabase.com/dashboard
2. Selecciona tu proyecto (dzsndogyxytzcydwzwzi)
3. Ve a "Edge Functions"
4. Verifica que `make-server-5aa00d2c` esté desplegada
5. Mira los logs por si hay errores

**Problema**: Build error en Vercel  
**Solución**:
1. Ve a tu proyecto en Vercel Dashboard
2. Clic en el deployment fallido
3. Ve a "Build Logs"
4. Copia el error y búscalo en Google
5. Generalmente es por una dependencia - verifica el `package.json`

---

## 🔄 Actualizar la App Después

Cuando hagas cambios en el código:

```bash
# 1. Guarda tus cambios
git add .
git commit -m "Descripción de lo que cambiaste"
git push

# 2. Vercel detecta el push y re-despliega automáticamente
# En 2-3 minutos tus cambios estarán en vivo
```

---

## 🌐 Personalizar el Dominio

Tu URL por defecto será algo como: `https://iot-management-fis-uncp.vercel.app`

**Cambiar el nombre del subdominio**:
1. Ve a Vercel Dashboard → Tu proyecto
2. Settings → Domains
3. Clic en los 3 puntos (...) de tu dominio actual
4. "Edit" → Cambia el nombre → Save

**Agregar un dominio personalizado** (si tienes uno):
1. Settings → Domains
2. Add → Escribe tu dominio (ej: `miproyecto.com`)
3. Sigue las instrucciones para configurar DNS

---

## 💰 Costos y Límites (Plan Gratuito)

| Servicio | Plan | Límites |
|----------|------|---------|
| **GitHub** | Free | Repos públicos ilimitados |
| **Vercel** | Hobby | 100 GB bandwidth/mes, builds ilimitados |
| **Supabase** | Free | 500 MB DB, 2 GB bandwidth/mes, 50k users |

**Para este proyecto académico es MÁS que suficiente.**

---

## 📚 Archivos de Ayuda

- **QUICK-START.md** - Versión ultra corta (5 min)
- **DEPLOYMENT.md** - Guía completa con troubleshooting
- **Este archivo** - Balance entre detalle y rapidez

---

## 🆘 Ayuda Adicional

**Videos Tutorial Recomendados**:
- "Deploy React Vite to Vercel" en YouTube
- "How to use GitHub for beginners" en YouTube

**Documentación Oficial**:
- Vercel: https://vercel.com/docs
- Vite: https://vitejs.dev/guide/
- Supabase: https://supabase.com/docs

---

## ✨ Compartir con el Equipo

Una vez desplegado, comparte la URL con tus compañeros:

```
🎉 Sistema IoT FIS UNCP - Desplegado

URL: https://tu-proyecto.vercel.app
Repositorio: https://github.com/TU_USUARIO/tu-repo

Equipo:
- Alanya Carbajal Cristian
- Mandujano Vicente Adriel
- Morán de la Cruz Jhulio
- Mucha Parra Mijail
- Yurivilca Espinoza Hector

Curso: Diseño de Base de Datos
Facultad: FIS - UNCP
Año: 2025
```

---

**¿Listo para empezar?**

👉 Lee **QUICK-START.md** si quieres la versión super rápida  
👉 Sigue esta guía si quieres entender cada paso  
👉 Lee **DEPLOYMENT.md** si encuentras problemas

¡Éxito con el deploy! 🚀
