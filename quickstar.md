# EcoChallenge - Quickstart para revisión (Entrega 2)

## Contexto breve
EcoChallenge es una experiencia móvil empaquetada con Capacitor que promueve hábitos sostenibles a través de retos gamificados. La aplicación es HTML5 + Tailwind + JavaScript puro, y persiste datos localmente vía `localStorage` (`ecochallenge_db_v1` y `ecochallenge_sesion`). No requiere conexión, no usa Ionic ni service workers en el APK final.

## Flujo principal resumido
1. Abrir la app en Android y llegar a la pantalla de login. Existe un usuario demo preconfigurado: `demo@poligran.edu.co` / `Demo1234`. Iniciar sesión con esas credenciales.
2. En el dashboard se muestran puntos, racha, insignias y gráficos (puntos semana, categorías, 7 días). Las tarjetas reflejan retos completados y el usuario demo ya tiene progreso precargado.
3. Navegar al catálogo de retos para revisar categorías, filtrar (todos, movilidad, consumo, energía, residuos) y aceptar un reto nuevo.
4. Entrar a un reto y usar el botón principal para aceptarlo o completarlo. Al completar, el sistema actualiza racha, puntos e insignias en tiempo real y regresa al dashboard.
5. En el perfil se observa la colección de insignias, estadísticas de impacto (CO2, agua, residuos) y la racha actual.

## Cómo probar
- Usar el usuario demo para evitar registros manuales. Si desea redefinir el estado, borrar `localStorage` o el elemento `ecochallenge_demo_ready`, luego reiniciar la app para que rehaga la carga automática.
- Verificar que al completar un reto se sumen puntos en el dashboard, la barra de racha aumenta y se desbloquean insignias (mínimo 3 ya desbloqueadas en el demo). Revisar que los gráficos se actualicen.
- Probar el filtro de categorías en `Retos disponibles` y entrar a un detalle para validar los textos, pasos y la capacidad de compartir/aceptar/completar.
- Usar el botón de cerrar sesión (icono logout) para asegurarse de volver al login.

## Notas adicionales
- El APK empaquetado carga localmente un usuario demo con retos aceptados/completados y datos de resumen. La sesión se mantiene en `localStorage`, por lo que al abrir la app nuevamente ya aparece el progreso.
- Las rutas internas son relativas (`./`) para garantizar que funcionen desde `file://` dentro del WebView de Capacitor.
- Si desea lanzar la app desde un navegador, servir la carpeta `build/` (`python -m http.server 5500` o `npx http-server -p 5500`) y acceder a `front/welcome.html`.
