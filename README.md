# EcoChallenge – Aplicación móvil de hábitos sostenibles

## Descripción del proyecto

EcoChallenge es una aplicación móvil multiplataforma que promueve hábitos sostenibles entre ciudadanos mediante un sistema gamificado de desafíos ambientales. Los usuarios pueden registrar acciones ecológicas, acumular puntos, desbloquear insignias y mantener rachas de cumplimiento, visualizando su impacto individual.

La aplicación está implementada como una solución web estática (HTML5, Tailwind CSS y JavaScript) empaquetada con Capacitor para generar un APK funcional en Android. Todo el procesamiento y almacenamiento de datos ocurre localmente en el dispositivo mediante `localStorage`, sin requerir conexión a servicios externos.

## Objetivos académicos

### Objetivo general

Desarrollar una aplicación multiplataforma empaquetada con Capacitor que fomente la adopción de hábitos sostenibles mediante desafíos gamificados, permitiendo el registro de progreso, visualización de impacto y mantenimiento de motivación a través de mecánicas interactivas.

### Objetivos específicos

- Implementar un sistema de desafíos organizados en categorías (movilidad, consumo, energía, residuos)
- Desarrollar un motor de gamificación con puntos, insignias y rachas
- Diseñar una interfaz mobile-first accesible y motivadora
- Validar funcionamiento multiplataforma (Android, navegador)

## Tecnologías utilizadas

- **Frontend**: HTML5, Tailwind CSS, JavaScript
- **Persistencia**: localStorage (claves: `ecochallenge_db_v1`, `ecochallenge_sesion`)
- **Empaquetado móvil**: Capacitor
- **Entorno de desarrollo**: Node.js, Android Studio

## Decisiones técnicas importantes

El equipo decidió no utilizar Ionic Framework (sugerido originalmente) por limitaciones de tiempo y complejidad del proyecto. En su lugar se implementó una solución con HTML5 estático que ofrece mayor control y simplicidad en el desarrollo.

La aplicación no utiliza Service Workers en la versión empaquetada, ya que Capacitor carga los recursos desde `file://` en el WebView de Android, contexto incompatible con Service Workers. La funcionalidad offline se garantiza mediante `localStorage`.

## Estructura del proyecto

```
progmovil/
├── build/              # Carpeta de distribución (empaquetada por Capacitor)
│   ├── front/         # Interfaces de usuario
│   ├── back/          # Lógica y simulador local
│   └── index.html     # Punto de entrada
├── android/           # Proyecto nativo generado por Capacitor
├── capacitor.config.json
└── package.json
```

## Requisitos previos

- Node.js y npm instalados
- Android Studio con SDK configurado
- JDK instalado con `JAVA_HOME` configurado
- Directorio `platform-tools` (donde está `adb`) en el PATH del sistema

## Instalación y configuración

### Configuración inicial del proyecto

```powershell
cd C:\wamp64\www\poligran\progmovil
npm install
npm install @capacitor/core @capacitor/cli
npx cap init "EcoChallenge" "com.progmovil.ecochallenge" --web-dir build
```

### Agregar plataforma Android

```powershell
npx cap add android
```

## Flujo de desarrollo

### Preparar el build web

Asegúrese de que la carpeta `build/` contiene todos los archivos necesarios:

```powershell
npm run build
```

Este comando prepara el contenido estático que será empaquetado. Verifique que `build/` incluye `index.html` y las carpetas `front/` y `back/` con sus respectivos recursos.

### Sincronizar con Capacitor

Cada vez que realice cambios en el contenido web, debe sincronizar con el proyecto nativo:

```powershell
npx cap copy
```

### Abrir en Android Studio

```powershell
npx cap open android
```

En Android Studio:
- Para pruebas: `Run > Run 'app'`
- Para APK firmado: `Build > Generate Signed Bundle / APK`

## Prueba local en navegador

Para probar la aplicación web antes de empaquetar:

```powershell
cd build
python -m http.server 5500
# O alternativamente:
npx http-server -p 5500
```

Abrir en el navegador: `http://localhost:5500/front/welcome.html`

## Usuario de demostración

La aplicación incluye un usuario preconfigurado para pruebas:

- **Email**: demo@poligran.edu.co
- **Contraseña**: Demo1234

Este usuario cuenta con progreso precargado (retos aceptados y completados, puntos, insignias) para facilitar la evaluación de funcionalidades.

## Funcionalidades implementadas

### Requerimientos funcionales

- Registro y autenticación de usuarios
- Visualización, aceptación y completado de desafíos ambientales
- Sistema de puntos y rachas
- Desbloqueo de insignias
- Gráficos de progreso (puntos semanales, distribución por categoría)
- Filtrado de desafíos por categoría
- Persistencia de sesión
- Estadísticas de impacto (CO₂, agua, residuos)

### Requerimientos no funcionales

- Interfaz responsive y accesible
- Funcionamiento offline mediante persistencia local
- Tiempo de carga objetivo menor a 3 segundos
- Código modular y documentado

## Consideraciones para desarrollo

### Rutas relativas

El proyecto utiliza rutas relativas (`./` en lugar de `/`) para garantizar compatibilidad con el protocolo `file://` usado por Capacitor en Android. Ejemplo:

```html
<script src="./back/simuladorLocal.js"></script>
<a href="./dashboard.html">Dashboard</a>
```

### Persistencia de datos

El simulador local (`back/simuladorLocal.js`) gestiona toda la lógica mediante `localStorage`:

- `ecochallenge_db_v1`: base de datos principal (retos, usuarios, insignias)
- `ecochallenge_sesion`: sesión activa del usuario

### Validación de sesión

Las páginas protegidas incluyen `_sessionCheck.js` para validar la sesión activa y redirigir al login si es necesario.

## Limitaciones conocidas

- La autenticación utiliza comparación de contraseñas en texto plano (aceptable para prototipo académico)
- No hay sincronización entre dispositivos (almacenamiento exclusivamente local)
- Las funcionalidades PWA están deshabilitadas en la versión empaquetada

## Entregables académicos

### Entrega 1 (Completada)
Diseño del proyecto y justificación de la arquitectura multiplataforma.

### Entrega 2 (En progreso)
Implementación funcional con navegación completa y al menos 70% de requisitos implementados. Incluye APK de prueba y documento de diseño actualizado.

### Entrega 3 (Pendiente)
Aplicación completa con análisis de monetización y preparación para publicación.

## Comandos útiles

```powershell
# Preparar build y sincronizar con Android
npm run build
npx cap copy

# Abrir proyecto en Android Studio
npx cap open android

# Comando combinado (si está configurado)
npm run prepare:android
```

## Soporte y contacto

Este proyecto es un prototipo académico desarrollado para el curso de Programación Móvil de la Institución Universitaria Politécnico Grancolombiano. Para consultas relacionadas con el desarrollo, consultar la documentación adicional en la carpeta `.docs/` o contactar al equipo de desarrollo.