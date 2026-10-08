// Base común de los juegos de la Cafetería (script clásico): barra con logos CERS y AMISI, navegación
// (Atrás = edificio Cafetería, Inicio = entrada del campus, Salir = pantalla de inicio), compartir, avisos y registro.
//   Juego.iniciar({titulo, icono})   Juego.nombre()   Juego.toast(html, 'ok'|'no'|'info')   Juego.modal(html)
//   Juego.registrar({modulo, puntos, porcentaje, errores, segundos, resultado})  → localStorage + servidor de aula
(function () {
const CSS = `:root{--navy:#0E3A6B;--azul:#154F90;--cian:#3FA7C6;--cielo:#8CCDE0;--hielo:#E8F5F9;--texto:#1B2633;--tenue:#5B6B7C;--bien:#2E7D32;--mal:#C62828;--cafe:#B8662E}
*{box-sizing:border-box}html,body{margin:0;min-height:100%;font-family:Calibri,"Segoe UI",system-ui,sans-serif;color:var(--texto);background:linear-gradient(160deg,#FFF4E6,#E8F5F9)}
#jBarra{position:sticky;top:0;display:flex;gap:7px;align-items:center;padding:7px 10px;background:rgba(14,58,107,.97);color:#fff;z-index:10;flex-wrap:wrap}
#jBarra img{height:34px;border-radius:7px;background:#fff;padding:2px}#jBarra b{font-size:1.05rem}#jBarra .der{margin-left:auto;display:flex;gap:5px;flex-wrap:wrap}
button{font-family:inherit;cursor:pointer}.sec{background:var(--hielo);color:var(--navy);border:0;border-radius:11px;padding:7px 10px;font-size:.92rem;font-weight:700;white-space:nowrap}
.sec.rojo{background:#C62828;color:#fff}.prim{background:var(--azul);color:#fff;border:0;border-radius:12px;padding:11px 18px;font-size:1.02rem;font-weight:800}
.prim:disabled{opacity:.5;cursor:default}
main{max-width:1000px;margin:0 auto;padding:14px}
.tarjeta{background:#fff;border-radius:16px;padding:14px;box-shadow:0 3px 14px rgba(14,58,107,.12);margin-bottom:12px}
h1{color:var(--navy);margin:.2rem 0 .4rem;font-size:1.45rem}.tenue{color:var(--tenue)}.fuente{font-size:.85rem;color:var(--tenue);font-style:italic}
#jToast{position:fixed;top:60px;left:50%;transform:translateX(-50%);max-width:min(620px,92vw);padding:11px 15px;border-radius:14px;color:#fff;z-index:30;display:none;box-shadow:0 6px 20px rgba(0,0,0,.25)}
#jToast.ok{background:var(--bien)}#jToast.no{background:var(--mal)}#jToast.info{background:var(--azul)}
#jModal{position:fixed;inset:0;background:rgba(14,58,107,.72);display:none;align-items:center;justify-content:center;z-index:25;padding:12px}
#jModal .caja{background:#fff;border-radius:18px;padding:18px;max-width:560px;width:100%;max-height:92vh;overflow:auto}
#jModal h2{color:var(--navy);margin-top:0}
@media (max-width:640px){.txt{display:none}}`;
const base = location.pathname.includes('/mundos/') ? '../../' : './';
function iniciar(cfg) {
  document.head.insertAdjacentHTML('beforeend', `<style>${CSS}</style>`);
  document.body.insertAdjacentHTML('afterbegin', `<div id="jBarra"><img src="${base}recursos/logo_CERS.jpeg" alt="CERS"><b>${cfg.icono} ${cfg.titulo}</b>
   <div class="der"><button class="sec" id="jAtras" title="Regresar a la cafetería">⬅<span class="txt"> Atrás</span></button><button class="sec" id="jReini" title="Reiniciar el juego">↺<span class="txt"> Reiniciar</span></button>
   <button class="sec" id="jInicio" title="Inicio del campus">🏠<span class="txt"> Inicio</span></button><button class="sec" id="jComp" title="Compartir">🔗</button><button class="sec rojo" id="jSalir" title="Salir">✖<span class="txt"> Salir</span></button></div></div>
   <div id="jToast"></div><div id="jModal"><div class="caja" id="jCaja"></div></div>`);
  const ir = q => location.href = base + 'index.html' + q;
  document.getElementById('jAtras').onclick = () => ir('?mundo=cafeteria');
  document.getElementById('jInicio').onclick = () => ir('?plaza');
  document.getElementById('jSalir').onclick = () => ir('?salir');
  document.getElementById('jReini').onclick = () => { if (confirm('¿Reiniciar el juego?')) location.reload(); };
  document.getElementById('jComp').onclick = () => window.Compartir ? Compartir.abrir(Compartir.url(location.pathname.split('/').pop()), `${cfg.icono} ${cfg.titulo} · Cafetería del Campus SST`) : null;
  document.getElementById('jModal').onclick = e => { if (e.target.id === 'jModal' && !document.getElementById('jCaja').dataset.fijo) e.target.style.display = 'none'; };
  document.title = `${cfg.titulo} · Cafetería · Campus SST`;
  const proteger = () => Acceso.proteger(`${cfg.icono} ${cfg.titulo}`, base + 'index.html?mundo=cafeteria');
  if (window.Acceso) proteger(); else { const s = document.createElement('script'); s.src = base + 'motor/acceso.js'; s.onload = proteger; document.head.appendChild(s); }
  if (!window.EnviarRes) { const s = document.createElement('script'); s.src = base + 'motor/enviar_resultados.js'; document.head.appendChild(s); }
}
function nombre() { try { return JSON.parse(localStorage.getItem('campus_perfil') || '{}').nombre || ''; } catch (e) { return ''; } }
function toast(html, cls = 'info', ms) { const t = document.getElementById('jToast'); t.className = cls; t.innerHTML = html; t.style.display = 'block'; clearTimeout(t._t); t._t = setTimeout(() => t.style.display = 'none', ms || (cls === 'no' ? 4200 : 2600)); }
function modal(html, fijo) { const c = document.getElementById('jCaja'); c.innerHTML = html; if (fijo) c.dataset.fijo = 1; else delete c.dataset.fijo; document.getElementById('jModal').style.display = 'flex'; }
const cerrar = () => document.getElementById('jModal').style.display = 'none';
async function registrar(r) {
  const reg = { modulo: r.modulo, nombre: r.nombre || nombre() || 'Participante', caso: r.caso || '', fecha: new Date().toLocaleString('es-MX'), puntos: r.puntos, porcentaje: r.porcentaje ?? '', criticos: 0, errores: r.errores ?? '', segundos: r.segundos ?? '', resultado: r.resultado || '' };
  try { const k = 'cafeteria_resultados', a = JSON.parse(localStorage.getItem(k) || '[]'); a.push(reg); localStorage.setItem(k, JSON.stringify(a.slice(-200))); } catch (e) { }
  if (!location.protocol.startsWith('http')) return false;
  try { return (await fetch('/api/registro', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tipo: 'juego', fila: reg }) })).ok; } catch (e) { return false; }
}
const barajar = a => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };

// Selector de temas para cualquier juego (07/10/2026): opciones [{id, txt, n}] → alListo([ids elegidos]). Se recuerda por juego.
function elegirTemas(titulo, opciones, clave, alListo, minimo = 1) {
  let sel; try { sel = JSON.parse(localStorage.getItem('temas_' + clave) || 'null'); } catch (e) { sel = null; }
  if (!Array.isArray(sel) || !sel.some(x => opciones.some(o => o.id === x))) sel = opciones.map(o => o.id);
  modal(`<h2>🎯 ${titulo}</h2><p>Marca los temas que quieres incluir:</p><div id="jTemas" style="display:grid;gap:6px;margin:8px 0">${opciones.map(o => `<label style="display:flex;gap:8px;align-items:center;background:#E8F5F9;border-radius:10px;padding:9px 11px;cursor:pointer"><input type="checkbox" value="${o.id}" ${sel.includes(o.id) ? 'checked' : ''}> ${o.txt}${o.n !== undefined ? ` <small style="color:#5B6B7C">(${o.n})</small>` : ''}</label>`).join('')}</div>
    <button class="sec" id="jTodos">Todos</button> <button class="sec" id="jNinguno">Ninguno</button> <button class="prim" id="jTemOk">Jugar con estos temas</button>`, true);
  const caja = document.getElementById('jCaja'), marcar = v => caja.querySelectorAll('#jTemas input').forEach(i => i.checked = v);
  caja.querySelector('#jTodos').onclick = () => marcar(true); caja.querySelector('#jNinguno').onclick = () => marcar(false);
  caja.querySelector('#jTemOk').onclick = () => { const e = [...caja.querySelectorAll('#jTemas input:checked')].map(i => i.value);
    const n = opciones.filter(o => e.includes(o.id)).reduce((a, o) => a + (o.n ?? 1), 0);
    if (!e.length || n < minimo) { toast(`Elige temas con al menos ${minimo} elementos.`, 'no'); return; }
    try { localStorage.setItem('temas_' + clave, JSON.stringify(e)); } catch (x) { } cerrar(); alListo(e); };
}
window.Juego = { iniciar, nombre, toast, modal, cerrar, registrar, barajar, base, elegirTemas };
})();
