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

  // Aceptar varios retos para poblar la sección "Mis retos"
  const cantidadAceptar = Math.min(8, retos.length);
  const retosParaAceptar = retos.slice(0, cantidadAceptar);
  console.log('[EcoChallenge] Aceptando', retosParaAceptar.length, 'retos...');
  retosParaAceptar.forEach((reto, idx) => {
    const yaAceptado = (usuario.retosAceptados || []).some(r => r.retoId === reto.id);
    if (!yaAceptado) {
      const resultado = simuladorLocal.aceptarReto(usuario.id, reto.id);
      if (resultado && resultado.error) {
        console.warn(`[EcoChallenge] Error al aceptar reto ${idx + 1}:`, resultado.error);
      }
    }
  });

  // Sembrar completados distribuidos en la semana y por categorías
  sembrarSemanaDemo(usuario, retos);

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
 * Sembrar datos de una semana: completar 5-7 retos con fechas de los últimos días
 * cubriendo categorías diversas para que el dashboard se vea realista
 */
function sembrarSemanaDemo(usuario, retos) {
  try {
    const hoy = new Date();
    const usados = new Set((usuario.retosCompletados || []).map(r => r.retoId));
    const porCategoria = {
      movilidad: retos.filter(r => r.categoria === 'movilidad'),
      energia: retos.filter(r => r.categoria === 'energia'),
      residuos: retos.filter(r => r.categoria === 'residuos'),
      consumo: retos.filter(r => r.categoria === 'consumo')
    };

    // Asegurar al menos uno por categoría (si existe)
    const categorias = ['movilidad', 'energia', 'residuos', 'consumo'];
    let diaOffset = 1;
    categorias.forEach(cat => {
      const lista = porCategoria[cat] || [];
      const candidato = lista.find(r => !usados.has(r.id));
      if (candidato) {
        // Asegurar aceptación previa
        if (!usuario.retosAceptados || !usuario.retosAceptados.some(a => a.retoId === candidato.id)) {
          simuladorLocal.aceptarReto(usuario.id, candidato.id);
        }
        const fecha = new Date(hoy);
        fecha.setDate(hoy.getDate() - diaOffset);
        const res = simuladorLocal.completarReto(usuario.id, candidato.id, fecha.toISOString());
        if (res && res.error) {
          console.warn('[EcoChallenge] Error al completar por categoría', cat, res.error);
        } else {
          usados.add(candidato.id);
          diaOffset = Math.min(diaOffset + 1, 6);
        }
      }
    });

    // Completar extras hasta 6-7 retos en total distribuidos en la semana
    const objetivo = 6;
    for (let i = 0, contador = (usuario.retosCompletados || []).length; i < retos.length && contador < objetivo; i++) {
      const r = retos[i];
      if (usados.has(r.id)) continue;
      if (!usuario.retosAceptados || !usuario.retosAceptados.some(a => a.retoId === r.id)) {
        simuladorLocal.aceptarReto(usuario.id, r.id);
      }
      const fecha = new Date(hoy);
      const offset = (i % 7);
      fecha.setDate(hoy.getDate() - offset);
      const res = simuladorLocal.completarReto(usuario.id, r.id, fecha.toISOString());
      if (!res || !res.error) {
        usados.add(r.id);
        contador++;
      }
    }

    // Refrescar usuario tras las operaciones
    const actualizado = simuladorLocal.obtenerUsuario(usuario.id);
    if (actualizado) {
      simuladorLocal.guardarSesion(actualizado);
      console.log('[EcoChallenge] Semana demo sembrada. Completados:', (actualizado.retosCompletados || []).length);
    }
  } catch (e) {
    console.warn('[EcoChallenge] Error al sembrar semana demo:', e);
  }
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
