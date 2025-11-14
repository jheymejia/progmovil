# EcoChallenge — Prototipo académico web + Capacitor

EcoChallenge es un prototipo académico que combina una aplicación web estática (HTML, Tailwind CSS y JavaScript) con Capacitor para generar un APK Android. El objetivo principal es entregar el instalador generado por Android Studio, por lo que el flujo de desarrollo se centra en preparar correctamente la carpeta `build/` y empaquetarla desde Capacitor.

## Tecnologías y arquitectura
- Interfaz: HTML + CSS generadas a partir de Tailwind, sin frameworks ni bundlers especiales.
- Lógica de datos: `back/simuladorLocal.js` simula un backend completo vía `localStorage`.
- Navegación: las páginas en `front/` se comunican mediante redirecciones relativas y consumen el simulador.
- Empaquetado móvil: Capacitor toma la carpeta `build/` como `webDir` y la pone dentro de `file:///android_asset/www/`, desde donde Android Studio construye el APK.

## Carpeta `build/`
Esta carpeta debe contener la versión final que quieras publicar. Todo lo que está dentro se copia literalmente al proyecto nativo.
- Confirma que `build/` incluye `index.html` y las carpetas `front/` y `back/` con sus scripts y assets.
- No asumas rutas absolutas (como `/front/...`); usa rutas relativas porque WebView carga desde `file://`.
- Cuando estés listo, ejecuta `npm run build` o la tarea que genere este contenido estático y verifica que los archivos estén sincronizados.

## Requisitos previos
- Node.js y `npm` instalados.
- Android Studio con SDK (incluye `platforms`, `build-tools`, etc.).
- JDK instalado y `JAVA_HOME` apuntando a la carpeta del JDK.
- En Windows, que el directorio `platform-tools` (donde está `adb`) esté en el `PATH`.
- Tener configurado el proyecto web con un `package.json` válido y la carpeta `build/` decidida como salida.

## Flujo básico para compilar en Android Studio
1. Desde la raíz del proyecto, instala Capacitor si no se ha hecho y define el `webDir` que apunta a `build`:
  ```powershell
  cd C:\wamp64\www\poligran\progmovil
  npm install @capacitor/core @capacitor/cli
  npx cap init "EcoChallenge" "com.progmovil.ecochallenge" --web-dir build
  npm run build
  npx cap add android
  npx cap copy
  npx cap open android
  ```
2. En Android Studio selecciona un dispositivo/emulador y usa `Run > Run 'app'` para un build debug.
3. Para la entrega final selecciona `Build > Generate Signed Bundle / APK` y sigue el asistente para generar el firmante.

> Nota: si ya ejecutaste `npx cap init` antes, asegúrate de que `capacitor.config.json` contiene `webDir: "build"` y que tus archivos están actualizados antes de correr `npx cap copy`.

## Preparar tu proyecto web
- Ejecuta `npm run build` o el comando que deje el sitio listo dentro de `build/`.
- Asegúrate de que `package.json` documenta las dependencias necesarias para ese build.
- Verifica que las rutas a CSS, scripts, JSON y `front/*.html` usen rutas relativas que funcionen bajo `file:///android_asset/www/`.
- Cada vez que cambies el contenido web, vuelve a ejecutar `npm run build` y luego `npx cap copy` para sincronizar el nativo.

## Entrega académica
- El entregable esperado es el APK firmado que se obtiene desde Android Studio.
- Conserva el prototipo web en esta carpeta y usa el control de versiones para documentar qué archivos se vieron afectados antes de empaquetar.
- Comunica al equipo qué pasos seguir cuando sea necesario regenerar el APK (build web + Capacitor + Android Studio).

## Estructura y backend simulado
- El contenido web vive en `build/`, pero el backend corre completamente en el navegador mediante `localStorage`.
- La clave principal es `ecochallenge_db_v1`, que guarda arrays de retos y usuarios; cada sesión se refleja en `ecochallenge_sesion`.
- Las funciones de `back/simuladorLocal.js` exponen CRUD completos para retos y usuarios, incluyendo autenticación, registro y actualización de perfiles.
- Este simulador se configura como objeto global (`window.simuladorLocal`) para que `front/app.js` y cada página puedan llamarlo directamente.

### Flujo típico del simulador
1. `localStorage` inicializa `ecochallenge_db_v1` con la estructura base si no existe.
2. La navegación entre `dashboard.html`, `community.html`, `availablechallenges.html` y otras páginas depende de datos cargados desde el simulador.
3. Las páginas incluyen `_sessionCheck.js` para validar sesión y redirigir a `./login.html` si no hay usuario activo.
4. Las acciones de login/registro guardan la sesión en `localStorage['ecochallenge_sesion']`, que luego se usa para llenar nombres, puntos e insignias en la interfaz.

### Consideraciones de mantenimiento
- Evita rutas absolutas dentro de HTML, scripts o `fetch`; usa rutas relativas (por ejemplo `./login.html` o `../back/simuladorLocal.js`).
- Cada cambio en la carpeta `front/` o `back/` debe reflejarse en `build/` antes de ejecutar `npx cap copy`.
- Documenta en este README cualquier cambio relevante en la estructura o en las dependencias del simulador local.
