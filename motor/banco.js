// Banco de preguntas unificado de los juegos del campus (script clásico). Crece solo:
//   1) recursos/banco_trivia.js ← 05_herramientas/banco_simulador.py junta las preguntas de juego de TODOS los cursos
//      (06_banco_preguntas/*.json). Cada curso nuevo o banco nuevo agrega preguntas al correr el script.
//   2) Señales: se generan de motor/senales.js (cada señal nueva = pregunta nueva, con imagen).
//   3) Biblioteca: se generan de biblioteca/catalogo.js (cada norma verificada nueva = pregunta nueva).
// Formato de pregunta: {tema, p, o:[opciones], r: índice correcto, f: fuente, rf: retroalimentación, img?: dataURL}
//   Banco.temas() → [{tema, preguntas}]   Banco.al azar(tema?) → pregunta
(function () {
const barajar = a => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
function opciones(correcta, otras) { const o = barajar([correcta, ...barajar(otras.filter(x => x !== correcta)).slice(0, 3)]); return { o, r: o.indexOf(correcta) }; }
function deSenales() {
  if (!window.Senales) return [];
  return Senales.LISTA.map(s => { const { o, r } = opciones(s.nombre, Senales.LISTA.map(x => x.nombre));
    return { p: '¿Qué indica esta señal?', o, r, f: s.norma, rf: s.significado, imgId: s.id }; });
}
function deBiblioteca() {
  if (!window.DOCUMENTOS) return [];
  const noms = DOCUMENTOS.filter(d => /^(PROY-)?NOM-/.test(d.clave));
  return noms.map(d => { const { o, r } = opciones(d.titulo, noms.map(x => x.titulo));
    return { p: `¿De qué trata la ${d.clave}?`, o, r, f: `${d.clave} (${d.publicacion})`, rf: d.uso }; });
}
let cache = null;
function temas() {
  if (cache) return cache;
  cache = (window.BANCO_TRIVIA || []).map(t => ({ tema: t.tema, preguntas: t.preguntas }));
  const s = deSenales(); if (s.length) cache.push({ tema: 'Señales de seguridad', preguntas: s });
  const b = deBiblioteca(); if (b.length) cache.push({ tema: 'Biblioteca normativa', preguntas: b });
  return cache;
}
const pendientes = {};
function alAzar(tema) {
  const ts = temas(); if (!ts.length) return null;
  const t = tema ? ts.find(x => x.tema === tema) || ts[0] : ts[Math.floor(Math.random() * ts.length)];
  if (!pendientes[t.tema] || !pendientes[t.tema].length) pendientes[t.tema] = barajar(t.preguntas);
  const q = { ...pendientes[t.tema].pop(), tema: t.tema };
  if (q.imgId && window.Senales) q.img = Senales.dataURL(q.imgId, 220);
  return q;
}
window.Banco = { temas, alAzar, barajar, total: () => temas().reduce((s, t) => s + t.preguntas.length, 0) };
})();
