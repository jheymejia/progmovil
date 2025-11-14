// En este archivo simulo un backend local usando localStorage como tabla JSON.
// Las funciones están en español y usan lower camelCase.

const claveBaseDatos = 'ecochallenge_db_v1';

function inicializarBaseDatos() {
  if (!localStorage.getItem(claveBaseDatos)) {
    const inicial = { retos: [] };
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
  buscarPorCampo
};
