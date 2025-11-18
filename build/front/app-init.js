/**
 * Script de inicialización de la aplicación EcoChallenge
 * Verifica sesión, inicializa base de datos y redirige si es necesario
 */

// Inicializar la base de datos al cargar la app
document.addEventListener('DOMContentLoaded', function() {
  // Asegurar que simuladorLocal esté disponible
  if (typeof simuladorLocal !== 'undefined') {
    simuladorLocal.inicializarBaseDatos();
  }
});

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
