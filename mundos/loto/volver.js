// Botón "Volver al campus" de las fichas del Edificio LOTO (21/10/2026). Script clásico, autocontenido.
// El campus abre cada puerta con ?volver=<url del interior del edificio>: si viene, el botón regresa AL INTERIOR
// y no a la plaza. Solo se acepta una dirección del mismo sitio, para que un enlace manipulado no mande a otro lado.
// Sin alert/confirm/prompt y sin requestAnimationFrame: estas páginas también se abren desde el visor.
(function () {
  var a = document.querySelector('a.volver');
  if (!a) return;
  try {
    var v = new URLSearchParams(location.search).get('volver');
    if (!v) return;
    var destino = new URL(v, location.href);
    if (destino.origin === location.origin) a.href = destino.href;
  } catch (e) { /* sin parámetro válido se queda el enlace normal al campus */ }
})();
