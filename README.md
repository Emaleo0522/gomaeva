# 🎨 Calculadora Goma Eva

Calculadora profesional para calcular costos y precios de trabajos en goma eva.

## ✨ Funcionalidades

- ✅ Cálculo automático de cm² según formas geométricas
- ✅ 8 formas disponibles: círculo, triángulo, cuadrado, pentágono, hexágono, octágono, rectángulo, manual
- ✅ Costos generales por items
- ✅ Precio por pieza individual y total
- ✅ **Guardar y cargar trabajos** (localStorage)
- ✅ Márgenes personalizables (mayorista/minorista)

## 🚀 Cómo subir a Vercel (100% GRATIS)

### Opción 1: Deployment Automático con GitHub (Recomendado)

#### Paso 1: Crear cuenta en GitHub
1. Ve a https://github.com
2. Crea una cuenta GRATIS si no tienes una
3. Verifica tu email

#### Paso 2: Crear un nuevo repositorio
1. Click en el botón verde "New" (Nuevo)
2. Nombre del repositorio: `calculadora-goma-eva`
3. Selecciona "Public" (Público)
4. Click en "Create repository"

#### Paso 3: Subir los archivos
Opción A - Arrastrando archivos (Más fácil):
1. En la página del repositorio, click en "uploading an existing file"
2. Arrastra TODOS los archivos de este proyecto:
   - `package.json`
   - `vite.config.js`
   - `index.html`
   - Carpeta `src/` (con `main.jsx` y `App.jsx`)
3. Scroll abajo y click "Commit changes"

Opción B - Usando Git (Si sabes usar la terminal):
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/calculadora-goma-eva.git
git push -u origin main
```

#### Paso 4: Conectar con Vercel
1. Ve a https://vercel.com
2. Click en "Sign Up" (Registrarse)
3. Selecciona "Continue with GitHub"
4. Autoriza Vercel a acceder a GitHub
5. Click en "Import Project"
6. Busca `calculadora-goma-eva` y click "Import"
7. ¡NO CAMBIES NADA! Vercel detecta automáticamente que es Vite + React
8. Click en "Deploy"
9. ⏱️ Espera 1-2 minutos...
10. 🎉 ¡LISTO! Te dará una URL como: `https://calculadora-goma-eva.vercel.app`

### Opción 2: Deployment Manual (Sin GitHub)

#### Usando Vercel CLI:
```bash
# Instalar Vercel CLI
npm install -g vercel

# Navegar a la carpeta del proyecto
cd calculadora-goma-eva

# Hacer login
vercel login

# Deployar
vercel
```

Sigue las instrucciones en pantalla y ¡listo!

## 💾 Cómo funciona "Guardar Trabajos"

Los trabajos se guardan en el **navegador** (localStorage). Esto significa:

✅ **Ventajas:**
- 100% gratis
- Funciona offline
- Muy rápido
- No necesita login

⚠️ **Importante:**
- Los trabajos solo están disponibles en **ese navegador específico**
- Si borra las cookies/datos del navegador, se pierden
- No se sincronizan entre dispositivos

**Recomendación:** Usar siempre el mismo navegador en la misma computadora.

## 🔄 Actualizar la aplicación

Si haces cambios al código:

### Con GitHub + Vercel:
1. Sube los cambios a GitHub (commit + push)
2. Vercel detecta automáticamente y redeploya
3. ¡En 1 minuto está actualizado!

### Con Vercel CLI:
```bash
vercel --prod
```

## 🆓 Costos

- **Vercel:** GRATIS para proyectos personales
- **GitHub:** GRATIS ilimitado para repositorios públicos
- **LocalStorage:** GRATIS (incluido en todos los navegadores)

**Total: $0 ARS** 💯

## 📱 Compatibilidad

- ✅ Desktop (Windows, Mac, Linux)
- ✅ Mobile (Android, iOS)
- ✅ Tablets
- ✅ Todos los navegadores modernos

## 🆘 Solución de Problemas

### "Los trabajos no se guardan"
- Verifica que el navegador permita localStorage
- No uses modo incógnito
- Verifica que no tengas bloqueadores agresivos

### "La página no carga"
- Verifica que subiste TODOS los archivos
- Revisa que la estructura de carpetas sea correcta:
  ```
  calculadora-goma-eva/
  ├── index.html
  ├── package.json
  ├── vite.config.js
  └── src/
      ├── main.jsx
      └── App.jsx
  ```

### "Error al deployar en Vercel"
- Asegúrate de que `package.json` tenga el script `build`
- Verifica que no haya errores de sintaxis en el código

## 📧 Soporte

Si tienes problemas:
1. Revisa este README
2. Busca el error en Google
3. Pregunta en la comunidad de Vercel

## 📝 Licencia

Uso personal libre. ¡Disfrútalo! 🎉
