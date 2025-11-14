// Verificar sesión antes de cargar la página
function verificarSesion() {
  const sesion = localStorage.getItem('ecochallenge_sesion');
  if (!sesion) {
    window.location.href = './login.html';
  }
}

// Ejecutar al cargar
document.addEventListener('DOMContentLoaded', verificarSesion);
