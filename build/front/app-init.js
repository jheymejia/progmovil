/**
 * Script de inicialización de la aplicación EcoChallenge
 * Verifica sesión, inicializa base de datos y redirige si es necesario
 */

// Inicializar la base de datos al cargar la app
const demoCredenciales = {
  nombre: 'John Doe',
  email: 'demo@poligran.edu.co',
  password: 'Demo1234'
};

const demoRetosAceptados = 4;
const demoRetosCompletados = 3;
const demoFlag = 'ecochallenge_demo_ready';

document.addEventListener('DOMContentLoaded', function() {
  if (typeof simuladorLocal !== 'undefined') {
    simuladorLocal.inicializarBaseDatos();
    asegurarUsuarioDemo();
  }
});

function obtenerUsuarioDemo() {
  if (typeof simuladorLocal === 'undefined') return null;
  return simuladorLocal.obtenerUsuarioPorEmail(demoCredenciales.email);
}

function asegurarUsuarioDemo() {
  if (typeof simuladorLocal === 'undefined') return;

  let usuario = obtenerUsuarioDemo();
  if (!usuario) {
    usuario = simuladorLocal.crearUsuario(demoCredenciales);
  }

  if (!usuario) return;

  // Solo preparamos datos una vez por dispositivo
  if (localStorage.getItem(demoFlag)) return;

  const retos = simuladorLocal.obtenerTodosRetos();
  if (retos.length === 0) return;

  const retosParaAceptar = retos.slice(0, demoRetosAceptados).map(r => r.id);
  const retosParaCompletar = retos.slice(0, demoRetosCompletados).map(r => r.id);

  retosParaAceptar.forEach(retoId => {
    simuladorLocal.aceptarReto(usuario.id, retoId);
  });

  retosParaCompletar.forEach(retoId => {
    // completarReto internally actualiza racha, puntos e insignias
    simuladorLocal.completarReto(usuario.id, retoId);
  });

  localStorage.setItem(demoFlag, '1');
}

/**
 * Obtener la sesión actual del usuario
 * @returns {Object|null} Objeto de sesión o null si no hay sesión
 */
function obtenerSesionActual() {
  if (typeof simuladorLocal === 'undefined') {
    return null;
  }
  return simuladorLocal.obtenerSesion();
}

/**
 * Verificar si hay sesión activa
 * @returns {Boolean} true si hay sesión, false en caso contrario
 */
function tieneSesion() {
  return obtenerSesionActual() !== null;
}

/**
 * Obtener usuario actual desde la sesión
 * @returns {Object|null} Objeto usuario o null si no hay sesión
 */
function obtenerUsuarioActual() {
  const sesion = obtenerSesionActual();
  if (!sesion) return null;
  
  // Obtener datos completos del usuario desde la BD
  if (typeof simuladorLocal !== 'undefined' && sesion.usuarioId) {
    const usuario = simuladorLocal.obtenerUsuario(sesion.usuarioId);
    return usuario || sesion; // Retornar usuario completo o datos de sesión
  }
  return sesion;
}

/**
 * Cerrar sesión y redirigir a login
 */
function cerrarSesion() {
  if (typeof simuladorLocal !== 'undefined') {
    simuladorLocal.limpiarSesion();
  }
  window.location.href = './login.html';
}

/**
 * Requerir autenticación (redirigir a login si no hay sesión)
 * Útil para proteger vistas que requieren autenticación
 */
function requerirAutenticacion() {
  if (!tieneSesion()) {
    // Redirigir a login si no hay sesión
    window.location.href = './login.html';
  }
}

/**
 * Actualizar sesión con datos del usuario actual
 * Llamar después de cambios en el usuario
 */
function actualizarSesion() {
  const usuario = obtenerUsuarioActual();
  if (usuario && typeof simuladorLocal !== 'undefined') {
    simuladorLocal.guardarSesion(usuario);
  }
}

/**
 * Cargar vistas protegidas (integrado con requerirAutenticacion)
 * Llamar en el onload de páginas que requieren autenticación
 */
function inicializarVistaProtegida() {
  requerirAutenticacion();
  // Aquí pueden ir otras inicializaciones específicas de vistas
}
