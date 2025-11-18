/**
 * Script de inicialización de la aplicación EcoChallenge
 * Prepara datos de demostración en la primera carga del APK
 */

// Configuración de usuario demo
const demoCredenciales = {
  nombre: 'Juan Perez',
  email: 'demo@poligran.edu.co',
  password: 'Demo1234'
};

// Cantidad de retos para precargar
const demoRetosAceptados = 4;
const demoRetosCompletados = 3;

// Flag para no reinicializar cada vez que se carga la app
const demoFlag = 'ecochallenge_demo_ready_v2';

/**
 * Ejecutar inicialización cuando el DOM esté listo
 */
document.addEventListener('DOMContentLoaded', function() {
  if (typeof simuladorLocal !== 'undefined') {
    console.log('[EcoChallenge] Inicializando base de datos...');
    simuladorLocal.inicializarBaseDatos();
    asegurarUsuarioDemo();
    console.log('[EcoChallenge] Inicialización completada');
  } else {
    console.warn('[EcoChallenge] simuladorLocal no disponible');
  }
});

/**
 * Obtener usuario demo desde la BD
 */
function obtenerUsuarioDemo() {
  if (typeof simuladorLocal === 'undefined') return null;
  return simuladorLocal.obtenerUsuarioPorEmail(demoCredenciales.email);
}

/**
 * Función principal: asegurar que el usuario demo existe y tiene datos precargados
 */
function asegurarUsuarioDemo() {
  if (typeof simuladorLocal === 'undefined') {
    console.error('[EcoChallenge] simuladorLocal no está disponible');
    return;
  }

  // Verificar si el usuario demo YA EXISTE en la BD
  let usuario = obtenerUsuarioDemo();
  
  // Si el usuario existe Y tiene datos, no hacer nada
  if (usuario && usuario.puntosTotales > 0) {
    console.log('[EcoChallenge] Usuario demo ya tiene datos:', usuario.puntosTotales, 'puntos');
    return;
  }

  // Si llegamos aquí, necesitamos inicializar
  console.log('[EcoChallenge] Preparando usuario demo...');

  // Crear usuario demo si no existe
  if (!usuario) {
    console.log('[EcoChallenge] Creando usuario demo...');
    usuario = simuladorLocal.crearUsuario(demoCredenciales);
    if (!usuario || usuario.error) {
      console.error('[EcoChallenge] Error al crear usuario demo:', usuario);
      return;
    }
  } else {
    console.log('[EcoChallenge] Usuario demo ya existe');
  }

  // Obtener lista de retos disponibles
  const retos = simuladorLocal.obtenerTodosRetos();
  if (retos.length === 0) {
    console.warn('[EcoChallenge] No hay retos disponibles para precargar');
    return;
  }

  console.log('[EcoChallenge] Encontrados', retos.length, 'retos disponibles');

  // Seleccionar retos para aceptar (primeros N)
  const retosParaAceptar = retos.slice(0, Math.min(demoRetosAceptados, retos.length));
  const retosParaCompletar = retos.slice(0, Math.min(demoRetosCompletados, retos.length));

  // Aceptar retos
  console.log('[EcoChallenge] Aceptando', retosParaAceptar.length, 'retos...');
  retosParaAceptar.forEach((reto, idx) => {
    const resultado = simuladorLocal.aceptarReto(usuario.id, reto.id);
    if (resultado.error) {
      console.warn(`[EcoChallenge] Error al aceptar reto ${idx + 1}:`, resultado.error);
    }
  });

  // Completar retos (esto suma puntos, racha e insignias)
  console.log('[EcoChallenge] Completando', retosParaCompletar.length, 'retos...');
  retosParaCompletar.forEach((reto, idx) => {
    const resultado = simuladorLocal.completarReto(usuario.id, reto.id);
    if (resultado.error) {
      console.warn(`[EcoChallenge] Error al completar reto ${idx + 1}:`, resultado.error);
    } else {
      console.log(`[EcoChallenge] Reto ${idx + 1} completado: +${reto.puntos} puntos`);
    }
  });

  // Obtener usuario actualizado
  usuario = simuladorLocal.obtenerUsuario(usuario.id);
  if (usuario) {
    console.log('[EcoChallenge] Datos finales del usuario demo:');
    console.log('  - Puntos totales:', usuario.puntosTotales);
    console.log('  - Racha:', usuario.racha, 'días');
    console.log('  - Retos completados:', usuario.retosCompletados.length);
    console.log('  - Insignias obtenidas:', usuario.insignias.length);
  }

  console.log('[EcoChallenge] ✓ Inicialización de usuario demo completada');
}

/**
 * Función para resetear datos de demostración (útil para testing)
 * Uso: resetearDatosDemo() en consola del navegador
 */
function resetearDatosDemo() {
  console.log('[EcoChallenge] Reseteando datos de demostración...');
  
  if (typeof simuladorLocal === 'undefined') {
    console.error('simuladorLocal no disponible');
    return;
  }

  // Limpiar flags
  localStorage.removeItem(demoFlag);
  
  // Limpiar sesión
  simuladorLocal.limpiarSesion();
  
  // Opcionalmente, limpiar toda la BD (descomenta si necesitas reiniciar todo)
  // localStorage.removeItem('ecochallenge_db_v1');
  // simuladorLocal.inicializarBaseDatos();

  console.log('[EcoChallenge] ✓ Datos reseteados. Recarga la página para reinicializar.');
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
 * @returns {Object|null} Objeto usuario completo o null si no hay sesión
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
