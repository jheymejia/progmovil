/**
 * Script de verificación de sesión (se carga antes de las vistas protegidas)
 * Redirige a login si no hay sesión activa
 */

function verificarSesion() {
  // Esperar a que simuladorLocal esté disponible
  if (typeof simuladorLocal === 'undefined') {
    // Si no está disponible, intentar en 100ms más
    setTimeout(verificarSesion, 100);
    return;
  }
  
  // Inicializar BD
  simuladorLocal.inicializarBaseDatos();
  
  // Verificar sesión
  if (!simuladorLocal.sesionActiva()) {
    window.location.href = './login.html';
  }
}

// Ejecutar al cargar (lo antes posible)
document.addEventListener('DOMContentLoaded', verificarSesion);

// También verificar inmediatamente (sin esperar DOMContentLoaded)
verificarSesion();
