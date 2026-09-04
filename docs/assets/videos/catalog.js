/* ══════════════════════════════════════════════════════════════════════════
   XPRESS SUITE — CATÁLOGO DE VIDEOS

   Este es el ÚNICO archivo que hay que editar para publicar videos nuevos.

   ── CÓMO AÑADIR UN VIDEO ──────────────────────────────────────────────────

   1. Copia el archivo de video dentro de esta misma carpeta:
          docs/assets/videos/

   2. Añade una línea en la lista de abajo con sus datos.

   3. Guarda y recarga la web. El video aparecerá solo, tanto en la página
      "Videos" como en la sección de videos del manual de esa aplicación.

   ── CAMPOS ────────────────────────────────────────────────────────────────

   file    (OBLIGATORIO) Nombre exacto del archivo, con su extensión.
           Formatos recomendados: .mp4 (H.264) o .webm — son los que
           reproducen todos los navegadores.

   title   (OBLIGATORIO) Título que se ve en la tarjeta.

   app     (OBLIGATORIO) A qué aplicación pertenece. Valores válidos:
              'copier'        → Copier
              'converter'     → Converter
              'controlstats'  → ControlStats
              'observer'      → Observer
              'inicio'        → Instalación y primeros pasos

   desc    (opcional) Una frase corta explicando qué se enseña en el video.

   thumb   (opcional) Imagen de portada. Si no se pone, la web toma sola
           el primer fotograma del video como portada.

   ── EJEMPLO COMPLETO ──────────────────────────────────────────────────────

   window.XS_VIDEOS = [
       {
           file:  'copier-primera-copia.mp4',
           title: 'Tu primera copia',
           app:   'copier',
           desc:  'Buscar archivos, soltarlos en varias memorias y cobrar.'
       },
       {
           file:  'converter-crear-perfil.mp4',
           title: 'Crear un perfil de conversión',
           app:   'converter',
           desc:  'Perfil MP4 para celulares, paso a paso.',
           thumb: 'converter-crear-perfil.jpg'
       }
   ];

   ══════════════════════════════════════════════════════════════════════════ */

window.XS_VIDEOS = [

    /* Añade aquí tus videos, uno por línea, separados por comas.
       Cuando la lista está vacía la web muestra un aviso explicando
       cómo agregarlos — no da error. */

];
