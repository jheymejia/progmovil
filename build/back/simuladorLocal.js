// En este archivo simulo un backend local usando localStorage como tabla JSON.
// Las funciones están en español y usan lower camelCase.
// NOTA: Las contraseñas se guardan en texto plano. Esto es solo para fines educativos y demostrativos.
// En producción NUNCA se deben guardar contraseñas sin encriptar.

const claveBaseDatos = 'ecochallenge_db_v1';
const claveSesion = 'ecochallenge_sesion';

// Datos de demostración: 20+ retos en 4 categorías
const retosDemo = [
  // Movilidad
  { id: 'r1', titulo: 'Viaje en transporte público', descripcion: 'Usar transporte público una vez hoy', categoria: 'movilidad', dificultad: 'fácil', puntos: 10, icono: '🚌' },
  { id: 'r2', titulo: 'Camina 5km', descripcion: 'Realiza una caminata de al menos 5km', categoria: 'movilidad', dificultad: 'media', puntos: 20, icono: '🚶' },
  { id: 'r3', titulo: 'Usa bicicleta', descripcion: 'Desplázate en bicicleta hoy', categoria: 'movilidad', dificultad: 'media', puntos: 25, icono: '🚴' },
  { id: 'r4', titulo: 'Comparte viaje', descripcion: 'Comparte auto con alguien más', categoria: 'movilidad', dificultad: 'fácil', puntos: 15, icono: '🚗' },
  
  // Consumo
  { id: 'r5', titulo: 'Evita plástico', descripcion: 'No uses bolsas plásticas hoy', categoria: 'consumo', dificultad: 'fácil', puntos: 10, icono: '♻️' },
  { id: 'r6', titulo: 'Compra local', descripcion: 'Compra productos en comercio local', categoria: 'consumo', dificultad: 'media', puntos: 20, icono: '🏪' },
  { id: 'r7', titulo: 'Reutiliza envases', descripcion: 'Reutiliza 3 envases para otros usos', categoria: 'consumo', dificultad: 'media', puntos: 15, icono: '🏺' },
  { id: 'r8', titulo: 'Compra de segunda mano', descripcion: 'Adquiere un artículo de segunda mano', categoria: 'consumo', dificultad: 'media', puntos: 25, icono: '♻️' },
  
  // Energía
  { id: 'r9', titulo: 'Apaga luces', descripcion: 'Apaga todas las luces innecesarias', categoria: 'energia', dificultad: 'fácil', puntos: 10, icono: '💡' },
  { id: 'r10', titulo: 'Reduce ducha', descripcion: 'Toma una ducha de menos de 5 minutos', categoria: 'energia', dificultad: 'media', puntos: 15, icono: '🚿' },
  { id: 'r11', titulo: 'Desconecta dispositivos', descripcion: 'Desconecta 5 dispositivos en standby', categoria: 'energia', dificultad: 'fácil', puntos: 12, icono: '🔌' },
  { id: 'r12', titulo: 'Usa luz natural', descripcion: 'Trabaja/estudia con luz natural', categoria: 'energia', dificultad: 'fácil', puntos: 8, icono: '☀️' },
  
  // Residuos
  { id: 'r13', titulo: 'Separa residuos', descripcion: 'Separa y recicla tus residuos', categoria: 'residuos', dificultad: 'fácil', puntos: 10, icono: '♻️' },
  { id: 'r14', titulo: 'Composta orgánicos', descripcion: 'Composta restos de comida', categoria: 'residuos', dificultad: 'media', puntos: 20, icono: '🌱' },
  { id: 'r15', titulo: 'Recicla papel', descripcion: 'Recicla toda tu basura de papel', categoria: 'residuos', dificultad: 'fácil', puntos: 10, icono: '📄' },
  { id: 'r16', titulo: 'Donación de ropa', descripcion: 'Dona ropa que no uses', categoria: 'residuos', dificultad: 'media', puntos: 15, icono: '👕' },
  { id: 'r17', titulo: 'Sin empaque', descripcion: 'Compra productos sin empaque plástico', categoria: 'residuos', dificultad: 'media', puntos: 18, icono: '🎁' },
  { id: 'r18', titulo: 'E-waste reciclaje', descripcion: 'Recicla un dispositivo electrónico viejo', categoria: 'residuos', dificultad: 'difícil', puntos: 30, icono: '📱' },
  
  // Extras para llegar a 20+
  { id: 'r19', titulo: 'Planta un árbol', descripcion: 'Planta un árbol o arbusto', categoria: 'consumo', dificultad: 'difícil', puntos: 50, icono: '🌳' },
  { id: 'r20', titulo: 'Educa otros', descripcion: 'Enseña a alguien sobre sostenibilidad', categoria: 'movilidad', dificultad: 'media', puntos: 25, icono: '🎓' },
];

// Insignias de demostración (10 insignias)
const insigniasDemo = [
  { id: 'b1', nombre: 'Primer paso', descripcion: 'Completa tu primer reto', icono: '🌱', requerimiento: { tipo: 'retos_completados', valor: 1 } },
  { id: 'b2', nombre: 'Dedicado', descripcion: 'Completa 5 retos', icono: '⭐', requerimiento: { tipo: 'retos_completados', valor: 5 } },
  { id: 'b3', nombre: 'Campeón', descripcion: 'Completa 10 retos', icono: '🏆', requerimiento: { tipo: 'retos_completados', valor: 10 } },
  { id: 'b4', nombre: 'Racha de fuego', descripcion: 'Mantén racha de 7 días', icono: '🔥', requerimiento: { tipo: 'racha', valor: 7 } },
  { id: 'b5', nombre: 'Ambientalista', descripcion: 'Acumula 100 puntos', icono: '🌍', requerimiento: { tipo: 'puntos', valor: 100 } },
  { id: 'b6', nombre: 'Experto eco', descripcion: 'Acumula 250 puntos', icono: '♻️', requerimiento: { tipo: 'puntos', valor: 250 } },
  { id: 'b7', nombre: 'Viajero verde', descripcion: 'Completa 3 retos de movilidad', icono: '🚴', requerimiento: { tipo: 'retos_categoria', valor: 'movilidad', cantidad: 3 } },
  { id: 'b8', nombre: 'Consumidor responsable', descripcion: 'Completa 3 retos de consumo', icono: '🛒', requerimiento: { tipo: 'retos_categoria', valor: 'consumo', cantidad: 3 } },
  { id: 'b9', nombre: 'Ahorrador de energía', descripcion: 'Completa 3 retos de energía', icono: '💡', requerimiento: { tipo: 'retos_categoria', valor: 'energia', cantidad: 3 } },
  { id: 'b10', nombre: 'Maestro del reciclaje', descripcion: 'Completa 3 retos de residuos', icono: '♻️', requerimiento: { tipo: 'retos_categoria', valor: 'residuos', cantidad: 3 } },
];

function inicializarBaseDatos() {
  if (!localStorage.getItem(claveBaseDatos)) {
    const inicial = { 
      retos: retosDemo.map(r => ({ ...r, activo: true })),
      usuarios: []
    };
    localStorage.setItem(claveBaseDatos, JSON.stringify(inicial));
  }
}

function leerBaseDatos() {
  inicializarBaseDatos();
  return JSON.parse(localStorage.getItem(claveBaseDatos));
}

function guardarBaseDatos(obj) {
  localStorage.setItem(claveBaseDatos, JSON.stringify(obj));
}

function obtenerTodosRetos() {
  const db = leerBaseDatos();
  return db.retos || [];
}

function obtenerRetoPorId(id) {
  const retos = obtenerTodosRetos();
  return retos.find(r => r.id === id) || null;
}

function crearReto(reto) {
  const db = leerBaseDatos();
  db.retos = db.retos || [];
  db.retos.push(reto);
  guardarBaseDatos(db);
  return reto;
}

function actualizarReto(id, cambios) {
  const db = leerBaseDatos();
  db.retos = db.retos || [];
  const idx = db.retos.findIndex(r => r.id === id);
  if (idx === -1) return null;
  db.retos[idx] = { ...db.retos[idx], ...cambios };
  guardarBaseDatos(db);
  return db.retos[idx];
}

function eliminarReto(id) {
  const db = leerBaseDatos();
  db.retos = db.retos || [];
  const antes = db.retos.length;
  db.retos = db.retos.filter(r => r.id !== id);
  guardarBaseDatos(db);
  return db.retos.length !== antes;
}

function buscarPorCampo(campo, valor) {
  const retos = obtenerTodosRetos();
  return retos.filter(r => r[campo] === valor);
}

// Funciones CRUD para usuarios

function obtenerTodosUsuarios() {
  const db = leerBaseDatos();
  return db.usuarios || [];
}

function obtenerUsuarioPorEmail(email) {
  const usuarios = obtenerTodosUsuarios();
  return usuarios.find(u => u.email === email) || null;
}

function crearUsuario(usuario) {
  const db = leerBaseDatos();
  db.usuarios = db.usuarios || [];
  
  if (obtenerUsuarioPorEmail(usuario.email)) {
    return { error: 'El email ya está registrado' };
  }
  
  const nuevoUsuario = {
    id: 'u' + Date.now(),
    nombre: usuario.nombre,
    email: usuario.email,
    password: usuario.password,
    fechaRegistro: new Date().toISOString(),
    puntosTotales: 0,
    retosCompletados: [],
    retosAceptados: [],
    racha: 0,
    ultimoRetoFecha: null,
    insignias: []
  };
  
  db.usuarios.push(nuevoUsuario);
  guardarBaseDatos(db);
  return nuevoUsuario;
}

function autenticarUsuario(email, password) {
  const usuario = obtenerUsuarioPorEmail(email);
  
  if (!usuario) {
    return { error: 'Usuario no encontrado' };
  }
  
  if (usuario.password !== password) {
    return { error: 'Contraseña incorrecta' };
  }
  
  return { 
    success: true, 
    usuario: {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      puntosTotales: usuario.puntosTotales,
      retosCompletados: usuario.retosCompletados
    }
  };
}

function actualizarUsuario(id, cambios) {
  const db = leerBaseDatos();
  db.usuarios = db.usuarios || [];
  const idx = db.usuarios.findIndex(u => u.id === id);
  
  if (idx === -1) return null;
  
  db.usuarios[idx] = { ...db.usuarios[idx], ...cambios };
  guardarBaseDatos(db);
  return db.usuarios[idx];
}

// ============ FUNCIONES DE SESIÓN ============

function guardarSesion(usuario) {
  const sesion = {
    usuarioId: usuario.id,
    nombre: usuario.nombre,
    email: usuario.email,
    puntosTotales: usuario.puntosTotales,
    racha: usuario.racha,
    fechaInicio: new Date().toISOString()
  };
  localStorage.setItem(claveSesion, JSON.stringify(sesion));
  return sesion;
}

function obtenerSesion() {
  const sesionStr = localStorage.getItem(claveSesion);
  if (!sesionStr) return null;
  try {
    return JSON.parse(sesionStr);
  } catch (e) {
    return null;
  }
}

function limpiarSesion() {
  localStorage.removeItem(claveSesion);
}

function sesionActiva() {
  return obtenerSesion() !== null;
}

// ============ FUNCIONES PARA ACEPTAR/COMPLETAR RETOS ============

function aceptarReto(usuarioId, retoId) {
  const usuario = obtenerUsuario(usuarioId);
  if (!usuario) return { error: 'Usuario no encontrado' };
  
  const reto = obtenerRetoPorId(retoId);
  if (!reto) return { error: 'Reto no encontrado' };
  
  if (!usuario.retosAceptados) usuario.retosAceptados = [];
  
  if (usuario.retosAceptados.find(r => r.retoId === retoId)) {
    return { error: 'Ya has aceptado este reto' };
  }
  
  usuario.retosAceptados.push({
    retoId: retoId,
    fechaAceptacion: new Date().toISOString()
  });
  
  return actualizarUsuario(usuarioId, usuario);
}

function completarReto(usuarioId, retoId) {
  const usuario = obtenerUsuario(usuarioId);
  if (!usuario) return { error: 'Usuario no encontrado' };
  
  const reto = obtenerRetoPorId(retoId);
  if (!reto) return { error: 'Reto no encontrado' };
  
  const ahora = new Date();
  const hoy = ahora.toISOString().split('T')[0];
  
  // Verificar racha
  const ultimaFecha = usuario.ultimoRetoFecha ? new Date(usuario.ultimoRetoFecha).toISOString().split('T')[0] : null;
  const ayer = new Date(ahora.getTime() - 86400000).toISOString().split('T')[0];
  
  if (ultimaFecha === hoy) {
    // Ya completó un reto hoy, no suma racha nuevamente
  } else if (ultimaFecha === ayer) {
    // Continúa la racha
    usuario.racha = (usuario.racha || 0) + 1;
  } else {
    // Reinicia racha
    usuario.racha = 1;
  }
  
  // Registrar reto completado
  if (!usuario.retosCompletados) usuario.retosCompletados = [];
  
  usuario.retosCompletados.push({
    retoId: retoId,
    fechaCompletacion: ahora.toISOString(),
    puntos: reto.puntos
  });
  
  // Sumar puntos
  usuario.puntosTotales = (usuario.puntosTotales || 0) + reto.puntos;
  usuario.ultimoRetoFecha = ahora.toISOString();
  
  // Verificar nuevas insignias
  usuario = verificarInsignias(usuario);
  
  const actualizado = actualizarUsuario(usuarioId, usuario);
  
  // Actualizar sesión si existe
  if (sesionActiva()) {
    guardarSesion(actualizado);
  }
  
  return actualizado;
}

function obtenerUsuario(id) {
  const usuarios = obtenerTodosUsuarios();
  return usuarios.find(u => u.id === id) || null;
}

// ============ FUNCIONES DE INSIGNIAS Y RACHAS ============

function verificarInsignias(usuario) {
  if (!usuario.insignias) usuario.insignias = [];
  
  insigniasDemo.forEach(insig => {
    // Evitar duplicados
    if (usuario.insignias.find(i => i.id === insig.id)) return;
    
    let desbloqueada = false;
    
    if (insig.requerimiento.tipo === 'retos_completados') {
      if ((usuario.retosCompletados || []).length >= insig.requerimiento.valor) {
        desbloqueada = true;
      }
    } else if (insig.requerimiento.tipo === 'puntos') {
      if ((usuario.puntosTotales || 0) >= insig.requerimiento.valor) {
        desbloqueada = true;
      }
    } else if (insig.requerimiento.tipo === 'racha') {
      if ((usuario.racha || 0) >= insig.requerimiento.valor) {
        desbloqueada = true;
      }
    } else if (insig.requerimiento.tipo === 'retos_categoria') {
      const count = (usuario.retosCompletados || [])
        .filter(rc => {
          const r = obtenerRetoPorId(rc.retoId);
          return r && r.categoria === insig.requerimiento.valor;
        }).length;
      if (count >= insig.requerimiento.cantidad) {
        desbloqueada = true;
      }
    }
    
    if (desbloqueada) {
      usuario.insignias.push({
        id: insig.id,
        nombre: insig.nombre,
        fechaDesbloqueada: new Date().toISOString()
      });
    }
  });
  
  return usuario;
}

// Exportar para uso en páginas incluidas con <script>
window.simuladorLocal = {
  inicializarBaseDatos,
  leerBaseDatos,
  guardarBaseDatos,
  obtenerTodosRetos,
  obtenerRetoPorId,
  crearReto,
  actualizarReto,
  eliminarReto,
  buscarPorCampo,
  obtenerTodosUsuarios,
  obtenerUsuarioPorEmail,
  obtenerUsuario,
  crearUsuario,
  autenticarUsuario,
  actualizarUsuario,
  // Sesión
  guardarSesion,
  obtenerSesion,
  limpiarSesion,
  sesionActiva,
  // Retos
  aceptarReto,
  completarReto,
  // Insignias
  verificarInsignias
};
