// "📤 Enviar resultados" para TODOS los juegos y simuladores (07/10/2026). Script clásico, autocontenido.
// Cuando un juego termina y guarda su resultado (servidor de aula /api/registro, localStorage o llamada directa) aparece un
// botón para mandarlo: compartir (WhatsApp, correo, Teams… lo que tenga el celular), WhatsApp directo a la persona
// instructora, copiar o descargar un comprobante. No envía nada solo: la persona decide a quién y cuándo.
//   EnviarRes.ofrecer(fila | texto)   fila = {nombre, modulo/juego, puntos, porcentaje|pct, aciertos, total, resultado, ...}
// Se inserta en los juegos de los cursos con 05_herramientas/insertar_enviar_resultados.py (sincronizar_hospedaje lo corre).
(function () {
  if (window.EnviarRes) return;
  const WA = '522411794542';
  let ultimo = null, boton = null;
  const ETQ = { nombre: 'Nombre', modulo: 'Actividad', juego: 'Juego', caso: 'Caso', equipo: 'Equipo', puntos: 'Puntos', aciertos: 'Aciertos',
    total: 'De', porcentaje: 'Porcentaje', pct: 'Porcentaje', criticos: 'Errores críticos', errores: 'Errores', segundos: 'Tiempo (s)',
    resultado: 'Resultado', resultado_examen: 'Resultado', folio: 'Folio', forma: 'Forma', fecha: 'Fecha' };
  function texto(f) {
    if (typeof f === 'string') return f;
    const lin = [`📋 ${document.title.replace(/\s*·.*$/, '')} · Campus SST CERS`];
    Object.keys(ETQ).forEach(k => { if (f[k] !== undefined && f[k] !== '' && f[k] !== null) lin.push(`${ETQ[k]}: ${f[k]}${(k === 'porcentaje' || k === 'pct') && !String(f[k]).includes('%') ? '%' : ''}`); });
    if (!f.fecha) lin.push('Fecha: ' + new Date().toLocaleString('es-MX'));
    return lin.join('\n');
  }
  const pareceResultado = o => o && typeof o === 'object' && !Array.isArray(o) &&
    ['puntos', 'porcentaje', 'pct', 'aciertos', 'resultado', 'resultado_examen'].some(k => k in o);
  function css() {
    if (document.getElementById('envCss')) return;
    document.head.insertAdjacentHTML('beforeend', `<style id="envCss">
#envBtn{position:fixed;left:12px;bottom:calc(12px + env(safe-area-inset-bottom));z-index:90;border:0;border-radius:999px;background:#25D366;color:#fff;font:800 1rem Calibri,"Segoe UI",sans-serif;padding:12px 18px;box-shadow:0 6px 20px rgba(0,0,0,.3);cursor:pointer}
#envFondo{position:fixed;inset:0;z-index:95;background:rgba(14,58,107,.75);display:flex;align-items:flex-end;justify-content:center;font-family:Calibri,"Segoe UI",sans-serif}
#envCaja{background:#fff;color:#1B2633;border-radius:18px 18px 0 0;max-width:560px;width:100%;padding:16px 16px calc(16px + env(safe-area-inset-bottom));max-height:88vh;overflow:auto}
#envCaja h3{margin:.1rem 0 .5rem;color:#0E3A6B}#envCaja pre{white-space:pre-wrap;background:#E8F5F9;border-radius:12px;padding:10px;font:.92rem Calibri,sans-serif;margin:0 0 10px}
#envCaja button,#envCaja a{display:block;width:100%;box-sizing:border-box;text-align:center;border:0;border-radius:12px;padding:12px;margin:6px 0;font:700 1rem Calibri,sans-serif;cursor:pointer;text-decoration:none}
.envP{background:#154F90;color:#fff}.envW{background:#25D366;color:#fff}.envS{background:#E8F5F9;color:#0E3A6B}</style>`);
  }
  function abrir() {
    if (!ultimo) return; css();
    const t = texto(ultimo), d = document.createElement('div'); d.id = 'envFondo';
    d.innerHTML = `<div id="envCaja"><h3>📤 Enviar mis resultados</h3><pre></pre>
      ${navigator.share ? '<button class="envP" id="envComp">Compartir (WhatsApp, correo…)</button>' : ''}
      <a class="envW" target="_blank" rel="noopener" href="https://wa.me/${WA}?text=${encodeURIComponent(t)}">💬 WhatsApp a la persona instructora</a>
      <button class="envS" id="envCop">📋 Copiar</button><button class="envS" id="envDesc">⬇️ Descargar comprobante</button>
      <button class="envS" id="envCer">Cerrar</button></div>`;
    d.querySelector('pre').textContent = t;
    document.body.appendChild(d);
    d.onclick = e => { if (e.target === d) d.remove(); };
    const q = s => d.querySelector(s);
    if (q('#envComp')) q('#envComp').onclick = () => navigator.share({ title: document.title, text: t }).catch(() => { });
    q('#envCop').onclick = () => (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(() => { q('#envCop').textContent = '✅ Copiado'; }).catch(() => prompt('Copia tus resultados:', t));
    q('#envDesc').onclick = () => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob(['﻿' + t], { type: 'text/plain' }));
      a.download = 'resultados_' + (document.title.replace(/[^\wáéíóúñ]+/gi, '_').slice(0, 40)) + '.txt'; a.click(); };
    q('#envCer').onclick = () => d.remove();
  }
  function ofrecer(f) {
    ultimo = f; css();
    if (!boton) { boton = document.createElement('button'); boton.id = 'envBtn'; boton.textContent = '📤 Enviar resultados'; boton.onclick = abrir; }
    if (!boton.isConnected) (document.body || document.documentElement).appendChild(boton);
  }
  // 1) resultados que el juego manda al servidor de aula
  const f0 = window.fetch;
  if (f0) window.fetch = function (u, o) {
    try { if (String(u).includes('/api/registro') && o && o.body) { const b = JSON.parse(o.body); if (b && b.fila && b.tipo !== 'encuesta') ofrecer(b.fila); } } catch (e) { }
    return f0.apply(this, arguments);
  };
  // 2) resultados que el juego guarda en el dispositivo (lista de partidas)
  try {
    const s0 = Storage.prototype.setItem;
    Storage.prototype.setItem = function (k, v) {
      try { if (this === window.localStorage && /result|sim_|cafeteria|juego/i.test(k)) { const a = JSON.parse(v); const f = Array.isArray(a) ? a[a.length - 1] : null; if (pareceResultado(f)) ofrecer(f); } } catch (e) { }
      return s0.apply(this, arguments);
    };
  } catch (e) { }
  // 3) Navegación de salida (12/10/2026): en juegos y páginas sin barra propia aparece «⬅ Regresar · 🏙️ Campus · 🚪 Salir».
  //    El campus abre cada puerta con ?volver=<campus/index.html?mundo=área>; sin ese dato regresa con el historial
  //    o al campus publicado. No se muestra en páginas que ya tienen su barra (sub-mundos con motor.js, aula, cafetería).
  const CAMPUS = 'https://lalot127-coder.github.io/campus-sst/index.html';
  function navegacion() {
    if (document.getElementById('barra') || document.getElementById('auAtras') || document.getElementById('navSalida') || window.SIN_NAV_SALIDA) return;
    let volver = null; try { volver = new URLSearchParams(location.search).get('volver'); if (volver) sessionStorage.setItem('nav_volver_' + location.pathname, volver); else volver = sessionStorage.getItem('nav_volver_' + location.pathname); } catch (e) { }
    const base = volver ? volver.split('?')[0] : (location.protocol === 'file:' ? null : CAMPUS);
    const ir = q => { location.href = base ? base + q : CAMPUS + q; };
    document.head.insertAdjacentHTML('beforeend', `<style id="navCss">#navSalida{position:fixed;top:calc(8px + env(safe-area-inset-top));right:8px;z-index:89;display:flex;gap:6px;font:700 .9rem Calibri,"Segoe UI",sans-serif}
#navSalida button{border:0;border-radius:999px;padding:8px 12px;background:rgba(14,58,107,.92);color:#fff;cursor:pointer;box-shadow:0 3px 12px rgba(0,0,0,.25);font:inherit}
#navSalida .s{background:#C62828}@media (max-width:560px){#navSalida .t{display:none}#navSalida button{padding:8px 10px}}@media print{#navSalida{display:none}}</style>`);
    const d = document.createElement('div'); d.id = 'navSalida';
    d.innerHTML = '<button id="navReg" title="Regresar al edificio o al curso">⬅<span class="t"> Regresar</span></button><button id="navCam" title="Ir a la plaza del campus">🏙️<span class="t"> Campus</span></button><button class="s" id="navSal" title="Salir a la pantalla de inicio">🚪<span class="t"> Salir</span></button>';
    document.body.appendChild(d);
    d.querySelector('#navReg').onclick = () => { if (volver) location.href = volver; else if (history.length > 1) history.back(); else ir('?plaza'); };
    d.querySelector('#navCam').onclick = () => ir('?plaza');
    d.querySelector('#navSal').onclick = () => ir('?salir');
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', navegacion); else setTimeout(navegacion, 0);
  window.EnviarRes = { ofrecer, abrir, texto, navegacion };
})();
