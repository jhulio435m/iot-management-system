# Quick Start - Deploy en 5 Minutos

## 🚀 Deploy Rápido

### 1. Crea un repositorio en GitHub

```bash
# En tu terminal, dentro de la carpeta del proyecto:
git init
git add .
git commit -m "Sistema IoT FIS UNCP"
git branch -M main

# Ve a github.com/new y crea un repositorio nuevo
# Luego ejecuta (reemplaza TU_USUARIO):
git remote add origin https://github.com/TU_USUARIO/tu-repo.git
git push -u origin main
```

### 2. Deploy en Vercel

1. Ve a **https://vercel.com**
2. Clic en **"Sign up"** → Usa tu cuenta de GitHub
3. Clic en **"Add New"** → **"Project"**
4. Selecciona tu repositorio de GitHub
5. Clic en **"Deploy"** (sin cambiar nada)

**¡Listo!** En 2-3 minutos tendrás tu URL:
`https://tu-proyecto.vercel.app`

## ✅ Verificación

Tu app debe mostrar:
- Dashboard con estadísticas
- Lista de 11 dispositivos
- Gráficos de sensores
- Formularios funcionando

## 🔧 Desarrollo Local (Opcional)

Si quieres correr el proyecto en tu computadora:

```bash
# Instalar dependencias
npm install

# Correr en desarrollo
npm run dev

# Abrir http://localhost:5173
```

## 📝 Notas Importantes

- ✅ **Supabase ya está configurado** - No necesitas cambiar nada
- ✅ **Las credenciales están en el código** - `/utils/supabase/info.tsx`
- ✅ **El backend ya está desplegado** - Edge Functions en Supabase
- ✅ **Es 100% gratis** - GitHub + Vercel + Supabase Free Plan

## 🆘 ¿Problemas?

Lee **DEPLOYMENT.md** para una guía completa con solución de problemas.

---

**¿No tienes Git instalado?**

1. Descarga desde: https://git-scm.com/downloads
2. Instala con las opciones por defecto
3. Reinicia la terminal y sigue los pasos arriba
