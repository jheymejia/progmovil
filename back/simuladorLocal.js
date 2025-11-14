// En este archivo simulo un backend local usando localStorage como tabla JSON.
// Las funciones están en español y usan lower camelCase.
// NOTA: Las contraseñas se guardan en texto plano. Esto es solo para fines educativos y demostrativos.
// En producción NUNCA se deben guardar contraseñas sin encriptar.

const claveBaseDatos = 'ecochallenge_db_v1';

function inicializarBaseDatos() {
  if (!localStorage.getItem(claveBaseDatos)) {
    const inicial = { 
      retos: [],
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
    retosCompletados: []
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
  crearUsuario,
  autenticarUsuario,
  actualizarUsuario
};
