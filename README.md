**EcoChallenge — Proyecto académico (Ionic, prototipo web)**


**Tecnologías y prototipado**:

**Estructura del proyecto** (archivos principales presentes)

**Alcance y consideraciones de arquitectura**:

**Cómo probar el prototipo localmente**:
  ```powershell
  cd C:\wamp64\www\poligran\progmovil
  python -m http.server 5500
  ```
  y luego abrir `http://localhost:5500/welcome.html`.

**Justificación**

**Razón de ser de la aplicación**
EcoChallenge surge como respuesta a la necesidad de transformar comportamientos individuales hacia la sostenibilidad ambiental en contextos urbanos. Bogotá enfrenta desafíos críticos en contaminación del aire, gestión de residuos y movilidad insostenible, lo que demanda intervenciones que combinen educación ambiental con motivación sostenida. La gamificación ofrece una estrategia efectiva para incrementar el compromiso de los usuarios, permitiendo que pequeñas acciones cotidianas se conviertan en hábitos permanentes mediante sistemas de puntos, insignias y rachas. De esta forma, la aplicación democratiza la sostenibilidad, haciéndola accesible, medible y gratificante para cualquier ciudadano.

**Población objetivo**
EcoChallenge está dirigida a ciudadanos bogotanos de todas las edades (principalmente entre 18 y 65 años) con acceso a dispositivos conectados a internet, independientemente de su nivel técnico o experiencia con aplicaciones móviles. El enfoque es inclusivo, buscando alcanzar tanto a usuarios conscientes del impacto ambiental como a aquellos que se sienten motivados por elementos lúdicos. La aplicación se diseña para ser intuitiva, permitiendo que usuarios sin experiencia técnica interactúen con ella sin dificultad.

**Pertinencia del desarrollo**
El desarrollo multiplataforma es esencial para maximizar el alcance e impacto de EcoChallenge. Bogotá presenta una diversidad significativa en dispositivos utilizados (smartphones, tablets y computadoras), sistemas operativos (iOS, Android, Windows) y contextos de uso. Una arquitectura multiplataforma elimina la necesidad de desarrollos paralelos, reduce costos de mantenimiento y garantiza una experiencia consistente. Esto resulta crítico para una aplicación con objetivos de impacto social, donde la accesibilidad universal es fundamental.

**Ventajas del enfoque híbrido (Ionic)**
Ionic es el framework ideal para EcoChallenge debido a sus ventajas inherentes al desarrollo híbrido: (1) compatibilidad simultánea con iOS, Android y web desde un único código base, reduciendo tiempos y costos de desarrollo; (2) capacidad de funcionar como PWA (Progressive Web Application), permitiendo instalación sin tienda de aplicaciones y funcionamiento offline; (3) acceso a APIs nativas del dispositivo (cámara, geolocalización, notificaciones) manteniendo la flexibilidad del desarrollo web; (4) comunidad activa y documentación completa; (5) desempeño optimizado para aplicaciones de baja a media complejidad como EcoChallenge. Estas características aseguran que la aplicación sea accesible, mantenible y escalable en el tiempo.

**Trabajo grupal**
Este proyecto se realiza de forma grupal (Subgrupo G7). Las decisiones de diseño, priorización de requisitos e implementación deben coordinarse dentro del equipo, distribuyendo tareas por áreas (diseño, UI, almacenamiento local, pruebas) y manteniendo control de versiones para facilitar la colaboración.

- Registro / Inicio de Sesión → Acceso a la cuenta del usuario.
- Menú Principal → Acceso a:
  - Desafíos disponibles
  - Progreso personal
**EcoChallenge**

Descripción técnica breve
- Proyecto: prototipo de aplicación móvil multiplataforma. Interfaz y maquetas estáticas incluidas como referencia para migración a Ionic.
- Objetivo técnico: mantener la aplicación con arquitectura standalone (procesamiento y almacenamiento local), priorizar navegación, usabilidad y mínimos funcionales.

Stack y artefactos
- Tecnologías: HTML, Tailwind CSS (prototipo visual). Objetivo de implementación: Ionic (Angular/React/Vue según preferencia del equipo).
- Archivos principales (prototipo):
  - `welcome.html` — Pantalla de entrada
  - `login.html` — Inicio de sesión / registro
  - `availablechallenges.html` — Lista de retos
  - `challengedetails.html` — Detalle de reto
  - `community.html` — Feed comunitario
  - `profile.html` — Métricas e insignias
  - `dashboard.html` — Panel de usuario

Flujo de navegación (resumen)
- Inicio → Iniciar sesión / Registrarse
- Menú principal → Desafíos, Progreso, Insignias, Perfil
- Desafíos → Lista filtrable → Vista detalle → Completar reto
- Progreso → Visualizaciones (puntos, impacto acumulado)
- Perfil → Configuración y cierre de sesión

Cómo ejecutar el prototipo localmente
- Desde WAMP: abrir `http://localhost/progmovil/welcome.html`.
- Alternativa (PowerShell + Python):
  ```powershell
  cd C:\wamp64\www\poligran\progmovil
  python -m http.server 5500
  ```
  Abrir `http://localhost:5500/welcome.html`.
