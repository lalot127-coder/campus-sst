// Enlaces del material multimedia del campus: videos explicativos y presentaciones narradas.
// Los usan mundos/biblioteca/videos.html y mundos/biblioteca/presentaciones.html.
//
// AQUÍ SOLO VAN ENLACES, NUNCA ARCHIVOS. Los videos viven en YouTube como «no listado»: la carpeta
// 04_simulador se publica completa en GitHub y un MP4 dentro se iría al repositorio.
//
// CÓMO SE LLENA: al subir un video a YouTube se pega su enlace en `yt`. Mientras esté vacío, la
// puerta muestra el video como «pendiente de subir» en vez de dar una liga rota.
// La misma liga va en el INDICE_MULTIMEDIA.md del curso, que es el índice que leen los agentes:
//   AGENTE DE CAPACITACION/03_cursos/<curso>/05_recursos_digitales/INDICE_MULTIMEDIA.md
//
// «no listado» = solo quien tiene el enlace lo ve; no sale en búsquedas ni en el canal.

window.MULTIMEDIA = {

  // ---------- Videos explicativos por tema: cortos, verticales, en 3D ----------
  videos: [
    { curso: 'Bloqueo y etiquetado de energías peligrosas (LOTO)',
      clave: 'BASE_loto_bloqueo_etiquetado_8h',
      nota: 'Serie de los seis errores críticos del curso, en orden.',
      lista: [
        { n: 1, titulo: 'La fuente que quedó viva', dur: '1:42',
          sub: 'Omitir una fuente de energía peligrosa', yt: '' },
        { n: 2, titulo: 'Primero el aislamiento, después la firma', dur: '1:49',
          sub: 'Intervenir sin el aislamiento completo', yt: '' },
        { n: 3, titulo: 'La tarjeta avisa, el candado impide', dur: '1:57',
          sub: 'Tratar la etiqueta como sustituto del bloqueo', yt: '' },
        { n: 4, titulo: 'La energía que ya estaba dentro', dur: '2:01',
          sub: 'Omitir el control de la energía almacenada o residual', yt: '' },
        { n: 5, titulo: 'Se considera energizada', dur: '1:58',
          sub: 'Dar por comprobada la energía cero sin verificarla', yt: '' },
        { n: 6, titulo: 'Cada quien retira su candado', dur: '1:37',
          sub: 'Retorno al servicio sin cumplir las condiciones de liberación', yt: '' },
      ] },
  ],

  // ---------- Presentaciones narradas: las láminas del curso con la voz de Carlos ----------
  presentaciones: [
    { curso: 'Jornada de 40 horas',
      clave: 'BASE_jornada_40_horas_2h',
      // Este curso TIENE aula propia en el campus (mundos/empresa/aula_jornada40), con las 57
      // narraciones completas. Carlos decidió el 03/11/2026 que esa aula se queda como está: la
      // puerta de aquí es el acceso alterno por YouTube, no un reemplazo.
      aula: 'mundos/empresa/aula_jornada40/index.html',
      nota: 'También se puede ver dentro del campus, en su aula.',
      lista: [
        { n: 1, titulo: 'Inicio', dur: '6:38', yt: '' },
        { n: 2, titulo: 'M1 · Lo que cambió', dur: '6:55', yt: '' },
        { n: 3, titulo: 'M2 · Lo que debo hacer', dur: '6:32', yt: '' },
        { n: 4, titulo: 'Receso', dur: '0:09', yt: '' },
        { n: 5, titulo: 'M3 · Salud en el trabajo', dur: '2:49', yt: '' },
        { n: 6, titulo: 'M4 · Preguntas y casos', dur: '8:25', yt: '' },
        { n: 7, titulo: 'M5 · Plan de acción', dur: '2:41', yt: '' },
        { n: 8, titulo: 'Cierre', dur: '3:20', yt: '' },
      ] },
  ],
};
