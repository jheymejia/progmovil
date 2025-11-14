**EcoChallenge — Proyecto académico (Ionic, prototipo web)**


**Tecnologías y prototipado**:

**Estructura del proyecto** (archivos principales presentes)

**Alcance y consideraciones de arquitectura**:

**Justificación**

**Razón de ser de la aplicación**
EcoChallenge surge como respuesta a la necesidad de transformar comportamientos individuales hacia la sostenibilidad ambiental en contextos urbanos. Bogotá enfrenta desafíos críticos en contaminación del aire, gestión de residuos y movilidad insostenible, lo que demanda intervenciones que combinen educación ambiental con motivación sostenida. La gamificación ofrece una estrategia efectiva para incrementar el compromiso de los usuarios, permitiendo que pequeñas acciones cotidianas se conviertan en hábitos permanentes mediante sistemas de puntos, insignias y rachas. De esta forma, la aplicación democratiza la sostenibilidad, haciéndola accesible, medible y gratificante para cualquier ciudadano.

**Población objetivo**
EcoChallenge está dirigida a ciudadanos bogotanos de todas las edades (principalmente entre 18 y 65 años) con acceso a dispositivos conectados a internet, independientemente de su nivel técnico o experiencia con aplicaciones móviles. El enfoque es inclusivo, buscando alcanzar tanto a usuarios conscientes del impacto ambiental como a aquellos que se sienten motivados por elementos lúdicos. La aplicación se diseña para ser intuitiva, permitiendo que usuarios sin experiencia técnica interactúen con ella sin dificultad.

**Pertinencia del desarrollo**
El desarrollo multiplataforma es esencial para maximizar el alcance e impacto de EcoChallenge. Bogotá presenta una diversidad significativa en dispositivos utilizados (smartphones, tablets y computadoras), sistemas operativos (iOS, Android, Windows) y contextos de uso. Una arquitectura multiplataforma elimina la necesidad de desarrollos paralelos, reduce costos de mantenimiento y garantiza una experiencia consistente. Esto resulta crítico para una aplicación con objetivos de impacto social, donde la accesibilidad universal es fundamental.

**Ventajas del enfoque híbrido (Ionic)**
Ionic es el framework ideal para EcoChallenge debido a sus ventajas inherentes al desarrollo híbrido: (1) compatibilidad simultánea con iOS, Android y web desde un único código base, reduciendo tiempos y costos de desarrollo; (2) capacidad de funcionar como PWA (Progressive Web Application), permitiendo instalación sin tienda de aplicaciones y funcionamiento offline; (3) acceso a APIs nativas del dispositivo (cámara, geolocalización, notificaciones) manteniendo la flexibilidad del desarrollo web; (4) comunidad activa y documentación completa; (5) desempeño optimizado para aplicaciones de baja a media complejidad como EcoChallenge. Estas características aseguran que la aplicación sea accesible, mantenible y escalable en el tiempo.

**Trabajo grupal**
Este proyecto se realiza de forma grupal (Subgrupo G7). Las decisiones de diseño, priorización de requisitos e implementación deben coordinarse dentro del equipo, distribuyendo tareas por áreas (diseño, UI, almacenamiento local, pruebas) y manteniendo control de versiones para facilitar la colaboración.

- Registro / Inicio de Sesión → Acceso a la cuenta del usuario.
- Menú Principal → Acceso a:
  - Desafíos disponibles
  - Progreso personal
**EcoChallenge**

Descripción técnica breve
- Proyecto: prototipo de aplicación móvil multiplataforma. Interfaz y maquetas estáticas incluidas como referencia para migración a Ionic.
- Objetivo técnico: mantener la aplicación con arquitectura standalone (procesamiento y almacenamiento local), priorizar navegación, usabilidad y mínimos funcionales.

Stack y artefactos
- Tecnologías: HTML, Tailwind CSS (prototipo visual). Objetivo de implementación: Ionic (Angular/React/Vue según preferencia del equipo).
- Archivos principales (prototipo):
  - `welcome.html` — Pantalla de entrada
  - `login.html` — Inicio de sesión / registro
  - `availablechallenges.html` — Lista de retos
  - `challengedetails.html` — Detalle de reto
  - `community.html` — Feed comunitario
  - `profile.html` — Métricas e insignias
  - `dashboard.html` — Panel de usuario

Flujo de navegación (resumen)
- Inicio → Iniciar sesión / Registrarse
- Menú principal → Desafíos, Progreso, Insignias, Perfil
- Desafíos → Lista filtrable → Vista detalle → Completar reto
- Progreso → Visualizaciones (puntos, impacto acumulado)
- Perfil → Configuración y cierre de sesión

Cómo ejecutar el prototipo localmente
- Desde WAMP: abrir `http://localhost/progmovil/welcome.html`.
- Alternativa (PowerShell + Python):
  ```powershell
  cd C:\wamp64\www\poligran\progmovil
  python -m http.server 5500
  ```
    Abrir `http://localhost:5500/welcome.html`.

## Arquitectura técnica: Backend simulado con localStorage

### Estructura de almacenamiento

El backend está completamente simulado en el navegador utilizando la API `localStorage` de JavaScript. No requiere servidor externo.

**Clave de almacenamiento principal**: `ecochallenge_db_v1`

```json
{
  "retos": [
    {
      "id": "r1",
      "titulo": "Lunes sin carne",
      "descripcion": "Evita consumir carne un día a la semana",
      "categoria": "Alimentación",
      "puntos": 50,
      "completado": false,
      "fechaCreacion": "2025-01-01T10:00:00Z"
    }
  ],
  "usuarios": [
    {
      "id": "u1",
      "nombre": "Juan Pérez",
      "email": "juan@ecochallenge.com",
      "password": "hashedPassword123",
      "fechaRegistro": "2025-01-01T10:00:00Z",
      "puntosTotales": 350,
      "retosCompletados": ["r1", "r3"]
    }
  ]
}
```

**Sesión de usuario activa**: `ecochallenge_sesion`
- Se guarda cuando el usuario inicia sesión o se registra
- Contiene los datos del usuario actual (nombre, email, puntos, etc.)
- Se utiliza para llenar dinámicamente interfaces como el dashboard

---

### Archivo: `back/simuladorLocal.js`

**Propósito**: Capa CRUD (Create, Read, Update, Delete) que gestiona toda la lógica de datos.

**Funciones principales**:

#### Inicialización
```javascript
function inicializarBaseDatos()
```
- Crea la estructura JSON inicial si no existe
- Se ejecuta automáticamente al cargar la página
- Clave: `ecochallenge_db_v1`

#### Retos (Challenges)
```javascript
function obtenerTodosRetos()              // Retorna array de todos los retos
function obtenerRetoPorId(id)             // Retorna un reto específico
function crearReto(reto)                  // Crea nuevo reto, retorna {error} o {id, ...}
function actualizarReto(id, cambios)      // Actualiza campos de un reto
function eliminarReto(id)                 // Elimina un reto
function buscarPorCampo(campo, valor)     // Búsqueda genérica
```

#### Usuarios (Users & Authentication)
```javascript
function obtenerTodosUsuarios()           // Retorna array de todos los usuarios
function obtenerUsuarioPorEmail(email)    // Búsqueda de usuario por correo
function crearUsuario(usuario)            // Registra nuevo usuario
  // Parámetros: {nombre, email, password}
  // Retorna: {error: "..."} o {id, nombre, email, ...}
function autenticarUsuario(email, password) // Valida credenciales
  // Retorna: {error: "..."} o {success: true, usuario: {...}}
function actualizarUsuario(id, cambios)   // Actualiza perfil de usuario
```

**Características de seguridad (educativas)**:
- Validación de email único (no permite duplicados)
- Validación de contraseña mínimo 6 caracteres
- Las contraseñas se guardan en texto plano (⚠️ **solo para fines educativos**)
- Manejo de errores con mensajes claros

**Exposición global**:
```javascript
window.simuladorLocal = {
  inicializarBaseDatos,
  obtenerTodosRetos,
  obtenerRetoPorId,
  // ... (14 funciones disponibles globalmente)
}
```

---

### Archivo: `front/app.js`

**Propósito**: Capa de integración entre la UI (HTML) y la lógica de datos (`simuladorLocal.js`).

**Funciones principales**:

#### Gestión de sesión
```javascript
function guardarSesion(usuario)           // Guarda sesión en localStorage['ecochallenge_sesion']
function obtenerUsuarioActual()           // Lee usuario actual desde la sesión
function cerrarSesion()                   // Limpia sesión y redirige a login
```

#### Carga de datos en UI
```javascript
function cargarRetosDisponibles()         // Obtiene retos y llena #lista-retos
function cargarPerfilUsuario()            // Carga datos del usuario en el dashboard
```

#### Flujos de ejemplo
```javascript
function ejemploCrearUsuario()            // Función de prueba en consola
```

**Patrón de uso**:
1. HTML carga `simuladorLocal.js` primero
2. HTML carga `app.js` segundo
3. Al hacer `DOMContentLoaded`, se ejecutan funciones como `cargarRetosDisponibles()`

---

### Archivo: `front/login.html`

**Propósito**: Interfaz de autenticación con toggle entre login y registro.

**Lógica JavaScript embebida**:

#### Cambio de modo (Login ↔ Registro)
```javascript
function cambiarModo(modo)
  // modo = 'login' o 'registro'
  // Muestra/oculta campos condicionalmente
  // Actualiza texto del botón
```

#### Procesamiento de autenticación
```javascript
function procesarAuth(event)
  // Delegador que decide si hacer login o registro

function autenticarUsuario(email, password)
  // Llama a simuladorLocal.autenticarUsuario()
  // Si éxito: guarda sesión y redirige a dashborad.html
  // Si error: muestra mensaje de error

function registrarUsuario(nombre, email, password)
  // Llama a simuladorLocal.crearUsuario()
  // Si éxito: guarda sesión automáticamente y redirige
  // Si error: muestra validaciones
```

#### Utilidades
```javascript
function togglePasswordVisibility()       // Muestra/oculta contraseña
function mostrarMensaje(texto, tipo)      // Muestra error/éxito con estilos
function limpiarMensaje()                 // Limpia mensajes
```

---

### Archivo: `front/dashboard.html`

**Propósito**: Panel de usuario que muestra progreso y retos personales.

**Lógica JavaScript embebida**:

```javascript
function cargarNombreUsuario()
  // Lee sesión desde localStorage['ecochallenge_sesion']
  // Actualiza #nombreUsuario con el nombre real
  // Si no hay sesión, redirige a login.html

function cerrarSesion()
  // Elimina localStorage['ecochallenge_sesion']
  // Redirige a login.html
```

---

### Flujo completo de una operación

**Ejemplo: Usuario se registra**

1. Usuario abre `login.html`
2. Hace clic en tab "Registrarse"
3. `cambiarModo('registro')` muestra campo de nombre
4. Usuario llena: nombre, email, contraseña
5. Submit → `procesarAuth(event)` → `registrarUsuario()`
6. `registrarUsuario()` → `simuladorLocal.crearUsuario()`
7. `simuladorLocal.js`:
   - Valida email único
   - Valida contraseña ≥ 6 caracteres
   - Genera ID único y timestamp
   - Guarda en `localStorage['ecochallenge_db_v1']`
   - Retorna usuario creado
8. En `login.html`: `guardarSesion(usuario)` → almacena en `localStorage['ecochallenge_sesion']`
9. Redirige a `dashborad.html`
10. `dashboard.html` ejecuta `cargarNombreUsuario()` → lee sesión → actualiza greeting
