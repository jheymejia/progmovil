// En este archivo conecto la UI con el simulador local.
// Aquí se manejarán las integraciones básicas con las vistas HTML.

document.addEventListener('DOMContentLoaded', () => {
  simuladorLocal.inicializarBaseDatos();
  
  // Detectar en qué página se encuentra el usuario
  const pathname = window.location.pathname;
  
  if (pathname.includes('availablechallenges.html')) {
    cargarRetosDisponibles();
  }
  
  if (pathname.includes('profile.html')) {
    cargarPerfilUsuario();
  }
});

// Ejemplo: cargar retos disponibles
function cargarRetosDisponibles() {
  const contenedorRetos = document.getElementById('lista-retos');
  if (!contenedorRetos) return;
  
  const retos = simuladorLocal.obtenerTodosRetos();
  
  if (retos.length === 0) {
    contenedorRetos.innerHTML = '<p class="text-center">No hay retos disponibles.</p>';
    return;
  }
  
  contenedorRetos.innerHTML = '';
  retos.forEach(reto => {
    const retoCard = crearTarjetaReto(reto);
    contenedorRetos.appendChild(retoCard);
  });
}

// Ejemplo: crear tarjeta de reto
function crearTarjetaReto(reto) {
  const div = document.createElement('div');
  div.className = 'reto-card';
  div.innerHTML = `
    <h3>${reto.titulo}</h3>
    <p>Categoría: ${reto.categoria}</p>
    <p>Puntos: ${reto.puntos}</p>
    <button onclick="unirseReto('${reto.id}')">Unirse al reto</button>
  `;
  return div;
}

// Ejemplo: unirse a un reto
function unirseReto(idReto) {
  const usuarioActual = obtenerUsuarioActual();
  
  if (!usuarioActual) {
    alert('Debes iniciar sesión para unirte a un reto');
    window.location.href = './login.html';
    return;
  }
  
  const reto = simuladorLocal.obtenerRetoPorId(idReto);
  if (!reto) {
    alert('Reto no encontrado');
    return;
  }
  
  alert(`Te has unido al reto: ${reto.titulo}`);
}

// Ejemplo: cargar perfil de usuario
function cargarPerfilUsuario() {
  const usuarioActual = obtenerUsuarioActual();
  
  if (!usuarioActual) {
    window.location.href = './login.html';
    return;
  }
  
  const nombreElement = document.getElementById('nombre-usuario');
  const puntosElement = document.getElementById('puntos-usuario');
  
  if (nombreElement) nombreElement.textContent = usuarioActual.nombre;
  if (puntosElement) puntosElement.textContent = usuarioActual.puntosTotales;
}

// Utilidad: obtener usuario de sesión actual
function obtenerUsuarioActual() {
  const sesion = localStorage.getItem('ecochallenge_sesion');
  return sesion ? JSON.parse(sesion) : null;
}

// Utilidad: guardar sesión de usuario
function guardarSesion(usuario) {
  localStorage.setItem('ecochallenge_sesion', JSON.stringify(usuario));
}

// Utilidad: cerrar sesión
function cerrarSesion() {
  localStorage.removeItem('ecochallenge_sesion');
  window.location.href = './welcome.html';
}

// Ejemplo de uso del CRUD de usuarios (para testing en consola)
function ejemploCrearUsuario() {
  const resultado = simuladorLocal.crearUsuario({
    nombre: 'Juan Pérez',
    email: 'juan@ejemplo.com',
    password: 'demo123'
  });
  
  console.log('Usuario creado:', resultado);
  return resultado;
}

function ejemploAutenticar() {
  const resultado = simuladorLocal.autenticarUsuario('juan@ejemplo.com', 'demo123');
  
  if (resultado.success) {
    console.log('Autenticación exitosa:', resultado.usuario);
    guardarSesion(resultado.usuario);
  } else {
    console.log('Error de autenticación:', resultado.error);
  }
  
  return resultado;
}

// Service worker registration removed: WebView/file:// does not support SW; offline handled by localStorage
