# Documentación Técnica - EcoChallenge

## Información del Proyecto

**Nombre**: EcoChallenge  
**Tipo**: Aplicación móvil híbrida  
**Plataforma objetivo**: Android  
**Tecnología**: HTML5 + Capacitor  
**Versión**: 1.0  
**Fecha**: Noviembre 2025  

---

## 1. Resumen Ejecutivo

EcoChallenge es una aplicación móvil educativa que promueve hábitos sostenibles mediante un sistema gamificado de desafíos ambientales. La aplicación permite a los usuarios registrar acciones ecológicas, acumular puntos, desbloquear insignias y mantener rachas de cumplimiento.

### 1.1 Características Principales

- Sistema de autenticación local
- Catálogo de 20 desafíos ambientales organizados en 4 categorías
- Motor de gamificación con puntos, rachas e insignias
- Visualización de progreso mediante gráficos
- Estadísticas de impacto ambiental
- Funcionamiento offline completo
- Usuario de demostración precargado

### 1.2 Decisiones Técnicas Clave

El equipo decidió implementar la aplicación como HTML5 estático empaquetado con Capacitor en lugar de usar Ionic Framework. Esta decisión se tomó considerando:

- Reducción de complejidad y curva de aprendizaje
- Mayor control sobre la implementación
- Tiempo limitado para el desarrollo académico
- Facilidad de mantenimiento del código base

---

## 2. Arquitectura del Sistema

### 2.1 Arquitectura General

```
┌─────────────────────────────────────────┐
│          Capa de Presentación           │
│   (HTML5 + Tailwind CSS + JavaScript)   │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│          Capa de Aplicación             │
│        (Lógica de negocio JS)           │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         Capa de Persistencia            │
│         (localStorage API)              │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         Contenedor Nativo               │
│        (Capacitor WebView)              │
└─────────────────────────────────────────┘
```

### 2.2 Estructura de Carpetas

```
progmovil/
├── build/                          # Distribución web (empaquetada)
│   ├── index.html                  # Punto de entrada
│   ├── front/                      # Capa de presentación
│   │   ├── welcome.html            # Pantalla inicial
│   │   ├── login.html              # Autenticación
│   │   ├── dashboard.html          # Panel principal
│   │   ├── availablechallenges.html # Catálogo de retos
│   │   ├── challengedetails.html   # Detalle de reto
│   │   ├── profile.html            # Perfil y estadísticas
│   │   ├── community.html          # Comunidad
│   │   ├── app.js                  # Utilidades globales
│   │   ├── app-init.js             # Inicialización de datos
│   │   └── _sessionCheck.js        # Validación de sesión
│   └── back/                       # Capa de datos
│       ├── simuladorLocal.js       # Motor de persistencia
│       └── baseDatos.json          # Datos de respaldo
├── android/                        # Proyecto Android generado
│   ├── app/
│   │   ├── src/
│   │   └── build.gradle
│   └── build.gradle
├── capacitor.config.json           # Configuración de Capacitor
├── package.json                    # Dependencias del proyecto
└── .docs/                          # Documentación adicional
```

### 2.3 Flujo de Datos

```
Usuario interactúa con UI
    ↓
Evento JavaScript capturado
    ↓
Llamada a simuladorLocal.js
    ↓
Lectura/escritura en localStorage
    ↓
Actualización del estado de la aplicación
    ↓
Renderización de cambios en UI
```

---

## 3. Capa de Persistencia

### 3.1 Modelo de Datos

El sistema utiliza `localStorage` como mecanismo de persistencia. Los datos se almacenan en formato JSON bajo tres claves principales:

#### 3.1.1 Base de Datos Principal (`ecochallenge_db_v1`)

```javascript
{
  retos: [
    {
      id: "r1",
      titulo: "Transporte público",
      descripcion: "Usa transporte público en lugar del carro",
      categoria: "movilidad",
      puntos: 50,
      impacto: {
        co2: 2.3,      // kg de CO2 ahorrado
        agua: 0,       // litros de agua ahorrada
        residuos: 0    // kg de residuos evitados
      },
      dificultad: "fácil",
      duracion: "1 día",
      pasos: ["Paso 1", "Paso 2", "..."]
    }
    // ... 19 retos más
  ],
  
  usuarios: [
    {
      id: "u_1731895234567",
      nombre: "Juan Perez",
      email: "demo@poligran.edu.co",
      password: "Demo1234",
      fechaRegistro: "2025-11-17T10:30:00.000Z",
      puntosTotales: 150,
      racha: 2,
      retosCompletados: [
        {
          retoId: "r1",
          puntos: 50,
          fechaCompletacion: "2025-11-16T14:20:00.000Z"
        }
        // ... más retos
      ],
      retosAceptados: [
        {
          retoId: "r2",
          fechaAceptacion: "2025-11-17T09:15:00.000Z"
        }
        // ... más retos
      ],
      insignias: [
        {
          id: "b1",
          nombre: "Primer paso",
          fechaDesbloqueada: "2025-11-16T14:20:00.000Z"
        }
        // ... más insignias
      ],
      ultimoRetoFecha: "2025-11-17T09:15:00.000Z"
    }
    // ... más usuarios
  ],
  
  insignias: [
    {
      id: "b1",
      nombre: "Primer paso",
      descripcion: "Completa tu primer reto",
      icono: "🎯",
      requerimiento: {
        tipo: "retos_completados",
        cantidad: 1
      }
    }
    // ... 9 insignias más
  ]
}
```

#### 3.1.2 Sesión Activa (`ecochallenge_sesion`)

```javascript
{
  usuarioId: "u_1731895234567",
  nombre: "John Doe",
  email: "demo@poligran.edu.co",
  puntosTotales: 150,
  racha: 2
}
```

#### 3.1.3 Flag de Inicialización (`ecochallenge_demo_ready_v2`)

```javascript
"1"  // Indica que la inicialización ya se ejecutó
```

### 3.2 Operaciones CRUD

#### 3.2.1 Usuarios

```javascript
// Crear usuario
simuladorLocal.crearUsuario({
  nombre: "Juan Pérez",
  email: "juan@example.com",
  password: "Pass123"
});

// Autenticar usuario
const usuario = simuladorLocal.autenticarUsuario(
  "juan@example.com",
  "Pass123"
);

// Actualizar usuario
simuladorLocal.actualizarUsuario(usuarioId, datosActualizados);

// Obtener usuario
const usuario = simuladorLocal.obtenerUsuarioPorId(usuarioId);
const usuario = simuladorLocal.obtenerUsuarioPorEmail(email);
```

#### 3.2.2 Retos

```javascript
// Obtener retos
const todosLosRetos = simuladorLocal.obtenerTodosRetos();
const retosPorCategoria = simuladorLocal.obtenerRetosPorCategoria("movilidad");

// Aceptar reto
simuladorLocal.aceptarReto(usuarioId, retoId);

// Completar reto
simuladorLocal.completarReto(usuarioId, retoId);

// Verificar estado
const aceptado = simuladorLocal.verificarRetoAceptado(usuarioId, retoId);
const completado = simuladorLocal.verificarRetoCompletado(usuarioId, retoId);
```

#### 3.2.3 Insignias

```javascript
// Obtener insignias
const todasInsignias = simuladorLocal.obtenerTodasLasInsignias();

// Verificar insignias desbloqueables
simuladorLocal.verificarInsignias(usuarioId);
```

#### 3.2.4 Sesión

```javascript
// Guardar sesión
simuladorLocal.guardarSesion(usuario);

// Obtener sesión
const sesion = simuladorLocal.obtenerSesion();

// Cerrar sesión
simuladorLocal.cerrarSesion();
```

---

## 4. Capa de Aplicación

### 4.1 Inicialización del Sistema

El archivo `app-init.js` se encarga de la inicialización automática del sistema en la primera carga:

```javascript
// Flujo de inicialización
document.addEventListener('DOMContentLoaded', async () => {
  console.log('[EcoChallenge] Inicializando aplicación...');
  
  // 1. Inicializar base de datos
  simuladorLocal.inicializarBaseDatos();
  
  // 2. Verificar y crear usuario demo
  await asegurarUsuarioDemo();
  
  console.log('[EcoChallenge] Aplicación lista');
});

async function asegurarUsuarioDemo() {
  // Verificar si ya se ejecutó antes
  const flagReady = localStorage.getItem('ecochallenge_demo_ready_v2');
  
  if (flagReady === '1') {
    console.log('[EcoChallenge] Usuario demo ya configurado');
    return;
  }
  
  // Crear usuario demo
  const demoUser = simuladorLocal.crearUsuario({
    nombre: 'Juan Perez',
    email: 'demo@poligran.edu.co',
    password: 'Demo1234'
  });
  
  // Precargar retos
  const retos = simuladorLocal.obtenerTodosRetos();
  
  // Aceptar 4 retos
  retos.slice(0, 4).forEach(reto => {
    simuladorLocal.aceptarReto(demoUser.id, reto.id);
  });
  
  // Completar 3 retos
  retos.slice(0, 3).forEach(reto => {
    simuladorLocal.completarReto(demoUser.id, reto.id);
  });
  
  // Marcar como completado
  localStorage.setItem('ecochallenge_demo_ready_v2', '1');
}
```

### 4.2 Gestión de Sesión

El archivo `_sessionCheck.js` valida la sesión en páginas protegidas:

```javascript
(function() {
  const sesion = simuladorLocal.obtenerSesion();
  
  if (!sesion || !sesion.usuarioId) {
    console.warn('[EcoChallenge] No hay sesión activa');
    window.location.href = './login.html';
    return;
  }
  
  console.log('[EcoChallenge] Sesión válida:', sesion.email);
})();
```

### 4.3 Cálculo de Racha

```javascript
function calcularRacha(usuario) {
  if (!usuario.retosCompletados || usuario.retosCompletados.length === 0) {
    return 0;
  }
  
  const fechas = usuario.retosCompletados
    .map(r => new Date(r.fechaCompletacion))
    .sort((a, b) => b - a);  // Ordenar descendente
  
  let racha = 1;
  let fechaActual = fechas[0];
  
  for (let i = 1; i < fechas.length; i++) {
    const diferenciaDias = Math.floor(
      (fechaActual - fechas[i]) / (1000 * 60 * 60 * 24)
    );
    
    if (diferenciaDias === 1) {
      racha++;
      fechaActual = fechas[i];
    } else if (diferenciaDias > 1) {
      break;
    }
  }
  
  return racha;
}
```

### 4.4 Sistema de Insignias

```javascript
function verificarInsignias(usuarioId) {
  const usuario = obtenerUsuarioPorId(usuarioId);
  const insignias = obtenerTodasLasInsignias();
  const insigniasDesbloqueadas = [];
  
  insignias.forEach(insignia => {
    // Verificar si ya la tiene
    const yaDesbloqueada = usuario.insignias.some(
      i => i.id === insignia.id
    );
    
    if (yaDesbloqueada) return;
    
    // Verificar requerimiento
    const cumpleRequerimiento = verificarRequerimiento(
      usuario,
      insignia.requerimiento
    );
    
    if (cumpleRequerimiento) {
      usuario.insignias.push({
        id: insignia.id,
        nombre: insignia.nombre,
        fechaDesbloqueada: new Date().toISOString()
      });
      
      insigniasDesbloqueadas.push(insignia);
    }
  });
  
  if (insigniasDesbloqueadas.length > 0) {
    actualizarUsuario(usuarioId, usuario);
  }
  
  return insigniasDesbloqueadas;
}

function verificarRequerimiento(usuario, requerimiento) {
  switch (requerimiento.tipo) {
    case 'retos_completados':
      return usuario.retosCompletados.length >= requerimiento.cantidad;
    
    case 'racha_dias':
      return usuario.racha >= requerimiento.cantidad;
    
    case 'puntos_totales':
      return usuario.puntosTotales >= requerimiento.cantidad;
    
    case 'categoria_especifica':
      const retosCategoria = usuario.retosCompletados.filter(rc => {
        const reto = obtenerRetoPorId(rc.retoId);
        return reto.categoria === requerimiento.categoria;
      });
      return retosCategoria.length >= requerimiento.cantidad;
    
    default:
      return false;
  }
}
```

---

## 5. Capa de Presentación

### 5.1 Pantallas Principales

#### 5.1.1 Welcome (`welcome.html`)

Pantalla inicial de la aplicación. Muestra el logo y opciones para iniciar sesión o registrarse.

**Funcionalidad**:
- Navegación a login
- Navegación a registro
- Carga automática de `app-init.js`

#### 5.1.2 Login (`login.html`)

Pantalla de autenticación de usuarios.

**Funcionalidad**:
```javascript
function handleLogin(event) {
  event.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  const usuario = simuladorLocal.autenticarUsuario(email, password);
  
  if (usuario) {
    simuladorLocal.guardarSesion(usuario);
    window.location.href = './dashboard.html';
  } else {
    mostrarError('Credenciales incorrectas');
  }
}
```

#### 5.1.3 Dashboard (`dashboard.html`)

Panel principal que muestra resumen de la actividad del usuario.

**Elementos visuales**:
- Saludo personalizado
- Puntos totales
- Racha actual
- Contador de insignias
- Gráficos de progreso (Chart.js)
- Navegación a otras secciones

**Funcionalidad**:
```javascript
function cargarDashboard() {
  const sesion = simuladorLocal.obtenerSesion();
  const usuario = simuladorLocal.obtenerUsuarioPorId(sesion.usuarioId);
  
  // Actualizar UI
  document.getElementById('userName').textContent = usuario.nombre;
  document.getElementById('userPoints').textContent = usuario.puntosTotales;
  document.getElementById('userStreak').textContent = usuario.racha;
  document.getElementById('badgeCount').textContent = usuario.insignias.length;
  
  // Renderizar gráficos
  renderizarGraficoPuntos(usuario);
  renderizarGraficoCategorias(usuario);
}
```

#### 5.1.4 Available Challenges (`availablechallenges.html`)

Catálogo de retos disponibles con filtrado por categoría.

**Funcionalidad**:
```javascript
function cargarRetos(categoria = 'todos') {
  const sesion = simuladorLocal.obtenerSesion();
  const usuario = simuladorLocal.obtenerUsuarioPorId(sesion.usuarioId);
  
  let retos;
  if (categoria === 'todos') {
    retos = simuladorLocal.obtenerTodosRetos();
  } else {
    retos = simuladorLocal.obtenerRetosPorCategoria(categoria);
  }
  
  const container = document.getElementById('retosContainer');
  container.innerHTML = '';
  
  retos.forEach(reto => {
    const completado = simuladorLocal.verificarRetoCompletado(
      usuario.id,
      reto.id
    );
    const aceptado = simuladorLocal.verificarRetoAceptado(
      usuario.id,
      reto.id
    );
    
    const card = crearTarjetaReto(reto, completado, aceptado);
    container.appendChild(card);
  });
}
```

#### 5.1.5 Challenge Details (`challengedetails.html`)

Detalle completo de un reto específico.

**Funcionalidad**:
```javascript
function cargarDetalleReto(retoId) {
  const sesion = simuladorLocal.obtenerSesion();
  const reto = simuladorLocal.obtenerRetoPorId(retoId);
  
  const completado = simuladorLocal.verificarRetoCompletado(
    sesion.usuarioId,
    retoId
  );
  const aceptado = simuladorLocal.verificarRetoAceptado(
    sesion.usuarioId,
    retoId
  );
  
  // Renderizar información
  renderizarInformacionReto(reto);
  
  // Actualizar botón principal
  if (completado) {
    mostrarBotonCompletado();
  } else if (aceptado) {
    mostrarBotonCompletar(retoId);
  } else {
    mostrarBotonAceptar(retoId);
  }
}

function completarReto(retoId) {
  const sesion = simuladorLocal.obtenerSesion();
  const resultado = simuladorLocal.completarReto(sesion.usuarioId, retoId);
  
  if (resultado.exito) {
    mostrarModalExito(resultado);
    setTimeout(() => {
      window.location.href = './dashboard.html';
    }, 2000);
  }
}
```

#### 5.1.6 Profile (`profile.html`)

Perfil del usuario con estadísticas e insignias.

**Funcionalidad**:
```javascript
function cargarPerfil() {
  const sesion = simuladorLocal.obtenerSesion();
  const usuario = simuladorLocal.obtenerUsuarioPorId(sesion.usuarioId);
  
  // Información básica
  document.getElementById('userName').textContent = usuario.nombre;
  document.getElementById('userEmail').textContent = usuario.email;
  document.getElementById('userPoints').textContent = usuario.puntosTotales;
  document.getElementById('userStreak').textContent = usuario.racha;
  
  // Renderizar estadísticas
  renderizarStats(usuario);
  
  // Renderizar insignias
  renderizarInsignias(usuario);
}

function renderizarStats(usuario) {
  const retosCompletados = usuario.retosCompletados.length;
  
  // Calcular impacto basado en retos completados
  const stats = {
    co2: retosCompletados * 2,      // kg
    agua: retosCompletados * 50,    // litros
    residuos: retosCompletados * 5, // kg
    arboles: Math.floor(retosCompletados / 5)
  };
  
  document.getElementById('co2Saved').textContent = stats.co2;
  document.getElementById('waterSaved').textContent = stats.agua;
  document.getElementById('wasteReduced').textContent = stats.residuos;
  document.getElementById('treesEquivalent').textContent = stats.arboles;
}

function renderizarInsignias(usuario) {
  const todasInsignias = simuladorLocal.obtenerTodasLasInsignias();
  const container = document.getElementById('insigniasContainer');
  
  todasInsignias.forEach(insignia => {
    const desbloqueada = usuario.insignias.some(i => i.id === insignia.id);
    const card = crearTarjetaInsignia(insignia, desbloqueada);
    container.appendChild(card);
  });
}
```

### 5.2 Navegación

La aplicación utiliza navegación basada en redirecciones:

```javascript
// Navegación desde cualquier página
function irA(destino) {
  const rutas = {
    'dashboard': './dashboard.html',
    'retos': './availablechallenges.html',
    'perfil': './profile.html',
    'comunidad': './community.html',
    'login': './login.html'
  };
  
  window.location.href = rutas[destino] || './dashboard.html';
}
```

---

## 6. Empaquetado con Capacitor

### 6.1 Configuración

Archivo `capacitor.config.json`:

```json
{
  "appId": "com.progmovil.ecochallenge",
  "appName": "EcoChallenge",
  "webDir": "build",
  "bundledWebRuntime": false,
  "server": {
    "androidScheme": "https"
  }
}
```

### 6.2 Proceso de Build

```powershell
# 1. Preparar contenido web
npm run build

# 2. Copiar al proyecto nativo
npx cap copy

# 3. Sincronizar cambios
npx cap sync

# 4. Abrir en Android Studio
npx cap open android
```

### 6.3 Generación del APK

En Android Studio:

1. Seleccionar: `Build > Generate Signed Bundle / APK`
2. Elegir: `APK`
3. Completar información del keystore
4. Seleccionar build variant: `release`
5. Click en `Finish`

El APK se genera en: `android/app/release/app-release.apk`

---

## 7. Testing y Verificación

### 7.1 Testing en Navegador

```powershell
cd build
python -m http.server 5500
```

Abrir: `http://localhost:5500/front/welcome.html`

### 7.2 Comandos de Consola

```javascript
// Ver base de datos completa
JSON.parse(localStorage.getItem('ecochallenge_db_v1'));

// Ver usuario demo
const db = JSON.parse(localStorage.getItem('ecochallenge_db_v1'));
db.usuarios.find(u => u.email === 'demo@poligran.edu.co');

// Ver sesión actual
JSON.parse(localStorage.getItem('ecochallenge_sesion'));

// Resetear datos demo (solo para testing)
resetearDatosDemo();
```

### 7.3 Checklist de Verificación

- [ ] Base de datos se inicializa correctamente
- [ ] Usuario demo se crea automáticamente
- [ ] Login funciona con credenciales demo
- [ ] Dashboard muestra datos correctos
- [ ] Retos se pueden aceptar
- [ ] Retos se pueden completar
- [ ] Puntos se suman correctamente
- [ ] Racha se calcula correctamente
- [ ] Insignias se desbloquean
- [ ] Perfil muestra estadísticas dinámicas
- [ ] Datos persisten al cerrar la aplicación
- [ ] Funciona sin conexión a internet

---

## 8. Consideraciones de Seguridad

### 8.1 Limitaciones Conocidas

**Almacenamiento de contraseñas**:
- Las contraseñas se almacenan en texto plano en localStorage
- Esta implementación es SOLO para propósitos educativos
- En producción se requeriría: hashing (bcrypt), backend seguro, HTTPS

**Validación de datos**:
- Validación básica en frontend
- No hay sanitización exhaustiva de inputs
- Vulnerable a inyección XSS si se implementara backend

### 8.2 Mejoras Recomendadas para Producción

1. Implementar backend con API REST
2. Usar bcrypt para hash de contraseñas
3. Implementar tokens JWT para autenticación
4. Agregar validación exhaustiva de datos
5. Implementar HTTPS obligatorio
6. Agregar rate limiting
7. Implementar auditoría de acciones

---

## 9. Mantenimiento y Escalabilidad

### 9.1 Agregar Nuevos Retos

```javascript
// En baseDatos.json o durante inicialización
const nuevoReto = {
  id: "r21",
  titulo: "Nuevo reto",
  descripcion: "Descripción del reto",
  categoria: "consumo",
  puntos: 30,
  impacto: { co2: 1.5, agua: 20, residuos: 2 },
  dificultad: "media",
  duracion: "1 semana",
  pasos: ["Paso 1", "Paso 2"]
};

// Agregar manualmente a localStorage o incluir en inicialización
```

### 9.2 Agregar Nuevas Insignias

```javascript
const nuevaInsignia = {
  id: "b11",
  nombre: "Maestro del reciclaje",
  descripcion: "Completa 10 retos de la categoría residuos",
  icono: "♻️",
  requerimiento: {
    tipo: "categoria_especifica",
    categoria: "residuos",
    cantidad: 10
  }
};

// Agregar a la lista de insignias en inicializarBaseDatos()
```

### 9.3 Versionado de Base de Datos

Si se requieren cambios en el esquema:

```javascript
// Cambiar versión en el código
const DB_VERSION = 'ecochallenge_db_v2';

// Implementar migración
function migrarDatos() {
  const datosV1 = localStorage.getItem('ecochallenge_db_v1');
  if (datosV1) {
    const datos = JSON.parse(datosV1);
    // Aplicar transformaciones necesarias
    datos.nuevoCampo = [];
    localStorage.setItem('ecochallenge_db_v2', JSON.stringify(datos));
    // Opcional: eliminar versión anterior
    localStorage.removeItem('ecochallenge_db_v1');
  }
}
```

---

## 10. Resolución de Problemas

### 10.1 Problemas Comunes

**Problema**: La aplicación no carga datos

**Solución**:
```javascript
// Verificar que la base de datos existe
if (!localStorage.getItem('ecochallenge_db_v1')) {
  simuladorLocal.inicializarBaseDatos();
}
```

**Problema**: El usuario demo no aparece

**Solución**:
```javascript
// Resetear el flag de inicialización
localStorage.removeItem('ecochallenge_demo_ready_v2');
// Recargar la página
location.reload();
```

**Problema**: Los datos no persisten

**Solución**:
- Verificar que localStorage está habilitado en el navegador
- Verificar que no hay errores en la consola
- Confirmar que `simuladorLocal.guardarEnLocalStorage()` se llama correctamente

**Problema**: El APK no funciona en el dispositivo

**Solución**:
- Verificar que `npx cap copy` se ejecutó
- Confirmar que las rutas son relativas (no absolutas)
- Revisar logs de Android con `adb logcat`

---

## 11. Glosario Técnico

**Capacitor**: Framework para crear aplicaciones nativas usando tecnologías web

**localStorage**: API del navegador para almacenamiento persistente de datos

**WebView**: Componente nativo que renderiza contenido web dentro de una aplicación móvil

**APK**: Android Package Kit, formato de instalación para aplicaciones Android

**Gamificación**: Aplicación de elementos de juego en contextos no lúdicos

**Racha**: Número de días consecutivos que el usuario ha completado retos

**Insignia**: Reconocimiento virtual otorgado al cumplir ciertos logros

---

## 12. Referencias

### 12.1 Documentación Oficial

- Capacitor: https://capacitorjs.com/docs
- localStorage API: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
- Chart.js: https://www.chartjs.org/docs/

### 12.2 Recursos Adicionales

- Tailwind CSS: https://tailwindcss.com/docs
- Android Studio: https://developer.android.com/studio/intro
- WebView: https://developer.android.com/develop/ui/views/layout/webapps/webview

---

## Apéndices

### Apéndice A: Credenciales de Usuario Demo

```
Email: demo@poligran.edu.co
Contraseña: Demo1234
```

### Apéndice B: Estructura Completa de Retos

Ver archivo: `build/back/baseDatos.json`

### Apéndice C: Lista Completa de Insignias

Ver sección de insignias en `simuladorLocal.js