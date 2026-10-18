// Sonidos del campus generados por código (Web Audio API, 12/10/2026). Script clásico, sin archivos de audio:
// no hay licencias que pagar ni descargas extra. Ver motor/LEEME_SONIDO en el encabezado de abajo.
//   Sonido.fuente(tipo, objeto3D, {vol, alcance})  → sonido continuo que se oye más fuerte al acercarse (objeto con getWorldPosition)
//   Sonido.ambiente(tipo, vol)                     → fondo continuo (viento, agua, ventilación…)
//   Sonido.una(tipo)                               → efecto corto (bien, mal, clic, descarga, golpe…)
//   Sonido.camara(objeto3D)                        → oyente (la cámara); sin él, todo suena a volumen pleno
//   Sonido.detener(h) · Sonido.detenerTodo() · Sonido.silenciar(bool) · Sonido.atenuar(bool)
// Tipos continuos: motor, motor_grande, sierra, banda, ventilador, reversa, sirena, alarma, campana, agua, viento, fuga, fuego, dea, maquina.
// Reglas: no suena hasta el primer toque (política de los navegadores); botón 🔊/🔇 recordado por dispositivo; se atenúa con
// preguntas abiertas; ningún aviso depende solo del sonido (siempre hay una señal visual).
(function () {
if (window.Sonido) return;
const CLAVE = 'campus_sonido';
let ctx = null, maestro = null, silencio = false, atenuado = false, oyente = null;
try { silencio = localStorage.getItem(CLAVE) === '0'; } catch (e) { }
const vivos = new Set(), pendientes = [];

function iniciar() {
  if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return; }
  const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
  ctx = new AC(); (window.__audioCtxs = window.__audioCtxs || []).push(ctx);
  maestro = ctx.createGain(); maestro.gain.value = silencio ? 0 : 0.8; maestro.connect(ctx.destination);
  pendientes.splice(0).forEach(f => f());
}
['pointerdown', 'keydown', 'touchstart'].forEach(ev => addEventListener(ev, iniciar, { capture: true, passive: true }));
const listo = f => { if (ctx) f(); else pendientes.push(f); };
function aplicarMaestro() { if (!maestro) return; maestro.gain.setTargetAtTime(silencio ? 0 : atenuado ? 0.25 : 0.8, ctx.currentTime, 0.15); }

// ruido blanco reutilizable
let bufRuido = null;
const ruido = () => { if (!bufRuido) { bufRuido = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate); const d = bufRuido.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; }
  const s = ctx.createBufferSource(); s.buffer = bufRuido; s.loop = true; return s; };
const osc = (tipo, f) => { const o = ctx.createOscillator(); o.type = tipo; o.frequency.value = f; return o; };
const filtro = (tipo, f, q = 1) => { const b = ctx.createBiquadFilter(); b.type = tipo; b.frequency.value = f; b.Q.value = q; return b; };
const ganancia = v => { const g = ctx.createGain(); g.gain.value = v; return g; };
// LFO que modula un parámetro
const lfo = (param, f, prof, tipo = 'sine') => { const o = osc(tipo, f), g = ganancia(prof); o.connect(g).connect(param); o.start(); return o; };

// ---------------------------------------------------------------- generadores (devuelven {salida, partes, extra})
const GEN = {
  motor() { const o = osc('sawtooth', 48), o2 = osc('square', 24), f = filtro('lowpass', 320, 2), g = ganancia(0.35); o.connect(f); o2.connect(ganancia(0.4)).connect(f); f.connect(g);
    lfo(g.gain, 9, 0.12); o.start(); o2.start(); return { salida: g, partes: [o, o2] }; },
  motor_grande() { const o = osc('sawtooth', 34), n = ruido(), fn = filtro('lowpass', 180), f = filtro('lowpass', 260, 3), g = ganancia(0.4); o.connect(f); n.connect(fn).connect(ganancia(0.5)).connect(f); f.connect(g);
    lfo(o.frequency, 0.3, 3); o.start(); n.start(); return { salida: g, partes: [o, n] }; },
  maquina() { const o = osc('triangle', 110), n = ruido(), f = filtro('bandpass', 600, 1.5), g = ganancia(0.18); o.connect(g); n.connect(f).connect(ganancia(0.3)).connect(g); lfo(g.gain, 4, 0.06); o.start(); n.start(); return { salida: g, partes: [o, n] }; },
  sierra() { const o = osc('sawtooth', 820), o2 = osc('sawtooth', 1230), n = ruido(), f = filtro('bandpass', 1800, 1.2), g = ganancia(0.16); o.connect(f); o2.connect(f); n.connect(filtro('highpass', 2500)).connect(ganancia(0.2)).connect(f); f.connect(g);
    lfo(o.frequency, 0.5, 40); o.start(); o2.start(); n.start(); return { salida: g, partes: [o, o2, n] }; },
  banda() { const n = ruido(), f = filtro('lowpass', 420, 1), o = osc('square', 14), g = ganancia(0.35); n.connect(f).connect(g); o.connect(ganancia(0.08)).connect(g); o.start(); n.start(); return { salida: g, partes: [n, o] }; },
  ventilador() { const n = ruido(), f = filtro('bandpass', 260, 0.8), o = osc('sine', 95), g = ganancia(0.45); n.connect(f).connect(g); o.connect(ganancia(0.15)).connect(g); lfo(f.frequency, 0.2, 40); o.start(); n.start(); return { salida: g, partes: [n, o] }; },
  agua() { const n = ruido(), f = filtro('lowpass', 700, 0.7), g = ganancia(0.3); n.connect(f).connect(g); lfo(g.gain, 0.12, 0.15); lfo(f.frequency, 0.07, 300); n.start(); return { salida: g, partes: [n] }; },
  viento() { const n = ruido(), f = filtro('bandpass', 500, 0.6), g = ganancia(0.18); n.connect(f).connect(g); lfo(f.frequency, 0.05, 250); lfo(g.gain, 0.09, 0.08); n.start(); return { salida: g, partes: [n] }; },
  fuga() { const n = ruido(), f = filtro('highpass', 3200, 0.7), g = ganancia(0.22); n.connect(f).connect(g); lfo(g.gain, 7, 0.04); n.start(); return { salida: g, partes: [n] }; },
  fuego() { const n = ruido(), f = filtro('lowpass', 900), g = ganancia(0.3), c = ruido(), fc = filtro('highpass', 2000), gc = ganancia(0); n.connect(f).connect(g); c.connect(fc).connect(gc).connect(g);
    const crep = setInterval(() => { if (!ctx) return; const t = ctx.currentTime; gc.gain.cancelScheduledValues(t); gc.gain.setValueAtTime(Math.random() * 0.5, t); gc.gain.exponentialRampToValueAtTime(0.001, t + 0.05 + Math.random() * 0.08); }, 90);
    n.start(); c.start(); return { salida: g, partes: [n, c], extra: () => clearInterval(crep) }; },
  sirena() { const o = osc('sawtooth', 700), f = filtro('lowpass', 2400), g = ganancia(0.16); o.connect(f).connect(g); lfo(o.frequency, 0.4, 330, 'triangle'); o.start(); return { salida: g, partes: [o] }; },
  // intermitentes (pitidos programados)
  reversa() { return pulsos({ f: 1150, tipo: 'square', on: 0.3, off: 0.3, vol: 0.18 }); },
  alarma() { return pulsos({ f: 880, f2: 660, tipo: 'square', on: 0.35, off: 0.0, vol: 0.14 }); },
  campana() { return pulsos({ f: 1250, tipo: 'sine', on: 0.5, off: 0.4, vol: 0.3, campana: true }); },
  dea() { return pulsos({ f: 960, tipo: 'sine', on: 0.12, off: 0.9, vol: 0.2 }); },
};
function pulsos({ f, f2, tipo, on, off, vol, campana }) {
  const g = ganancia(1); let alt = false, activo = true;
  const tic = () => { if (!activo || !ctx) return; const t = ctx.currentTime, o = osc(tipo, alt && f2 ? f2 : f), e = ganancia(0); alt = !alt;
    o.connect(e).connect(g); e.gain.setValueAtTime(0, t); e.gain.linearRampToValueAtTime(vol, t + 0.01);
    if (campana) { const o2 = osc('sine', f * 2.4); o2.connect(e); o2.start(t); o2.stop(t + on); e.gain.exponentialRampToValueAtTime(0.001, t + on); }
    else { e.gain.setValueAtTime(vol, t + on - 0.02); e.gain.linearRampToValueAtTime(0, t + on); }
    o.start(t); o.stop(t + on + 0.02); };
  tic(); const iv = setInterval(tic, (on + off) * 1000);
  return { salida: g, partes: [], extra: () => { activo = false; clearInterval(iv); } };
}

// ---------------------------------------------------------------- efectos cortos
const UNA = {
  bien() { notas([[880, 0], [1320, 0.09]], 'sine', 0.14, 0.18); },
  mal() { notas([[220, 0], [180, 0.12]], 'square', 0.08, 0.2); },
  clic() { notas([[1600, 0]], 'square', 0.05, 0.03); },
  compresion() { const t = ctx.currentTime, n = ruido(), f = filtro('lowpass', 260), e = ganancia(0); n.connect(f).connect(e).connect(maestro); e.gain.setValueAtTime(0.5, t); e.gain.exponentialRampToValueAtTime(0.001, t + 0.12); n.start(t); n.stop(t + 0.14); },
  descarga() { const t = ctx.currentTime, o = osc('sawtooth', 120), e = ganancia(0); o.connect(e).connect(maestro); o.frequency.exponentialRampToValueAtTime(40, t + 0.35); e.gain.setValueAtTime(0.35, t); e.gain.exponentialRampToValueAtTime(0.001, t + 0.4); o.start(t); o.stop(t + 0.42); },
  golpe() { const t = ctx.currentTime, n = ruido(), f = filtro('lowpass', 500), e = ganancia(0), o = osc('sine', 70); n.connect(f).connect(e); o.connect(e); e.connect(maestro);
    e.gain.setValueAtTime(0.7, t); e.gain.exponentialRampToValueAtTime(0.001, t + 0.6); o.frequency.exponentialRampToValueAtTime(35, t + 0.5); n.start(t); o.start(t); n.stop(t + 0.62); o.stop(t + 0.62); },
  bocina() { notas([[311, 0], [370, 0]], 'sawtooth', 0.12, 0.8); },
  claxon() { notas([[440, 0], [554, 0]], 'square', 0.08, 0.45); },
  paso() { const t = ctx.currentTime, n = ruido(), f = filtro('lowpass', 380 + Math.random() * 160, 0.8), e = ganancia(0), o = osc('sine', 90 + Math.random() * 20); n.connect(f).connect(e); o.connect(ganancia(0.4)).connect(e); e.connect(maestro);
    e.gain.setValueAtTime(0.0001, t); e.gain.linearRampToValueAtTime(0.16 * volPaso, t + 0.008); e.gain.exponentialRampToValueAtTime(0.001, t + 0.11); n.start(t); o.start(t); n.stop(t + 0.13); o.stop(t + 0.13); },
  puerta() { const t = ctx.currentTime, o = osc('sawtooth', 190), f = filtro('bandpass', 900, 6), e = ganancia(0); o.connect(f).connect(e).connect(maestro);   // rechinido + golpe del pestillo
    o.frequency.setValueAtTime(190, t); o.frequency.linearRampToValueAtTime(260, t + 0.25); o.frequency.linearRampToValueAtTime(170, t + 0.5); e.gain.setValueAtTime(0, t); e.gain.linearRampToValueAtTime(0.07, t + 0.05); e.gain.linearRampToValueAtTime(0.0001, t + 0.55);
    o.start(t); o.stop(t + 0.56); notas([[1900, 0], [1300, 0.04]], 'square', 0.05, 0.03); setTimeout(() => UNA.golpeSuave(), 600); },
  golpeSuave() { const t = ctx.currentTime, n = ruido(), f = filtro('lowpass', 300), e = ganancia(0); n.connect(f).connect(e).connect(maestro); e.gain.setValueAtTime(0.25, t); e.gain.exponentialRampToValueAtTime(0.001, t + 0.18); n.start(t); n.stop(t + 0.2); },
  mensaje() { notas([[660, 0], [990, 0.07]], 'sine', 0.09, 0.12); },
  emoji() { notas([[1050, 0], [1400, 0.05], [1750, 0.1]], 'triangle', 0.06, 0.1); },
  alarma_corta() { notas([[880, 0], [660, 0.35], [880, 0.7], [660, 1.05]], 'square', 0.1, 0.33); },
  silbato() { notas([[2100, 0], [2300, 0.25]], 'sine', 0.1, 0.22); },
};
function notas(lista, tipo, vol, dur) { const t0 = ctx.currentTime; lista.forEach(([f, dt]) => { const o = osc(tipo, f), e = ganancia(0); o.connect(e).connect(maestro); e.gain.setValueAtTime(0, t0 + dt); e.gain.linearRampToValueAtTime(vol, t0 + dt + 0.01); e.gain.exponentialRampToValueAtTime(0.001, t0 + dt + dur); o.start(t0 + dt); o.stop(t0 + dt + dur + 0.02); }); }

// ---------------------------------------------------------------- fuentes con distancia
function crearFuente(tipo, obj, o = {}) {
  const h = { tipo, obj, vol: o.vol ?? 1, alcance: o.alcance ?? 22, nodo: null, gen: null, vivo: true };
  listo(() => { if (!h.vivo || !GEN[tipo]) return; h.gen = GEN[tipo](); h.nodo = ganancia(0); h.gen.salida.connect(h.nodo);
    if (ctx.createStereoPanner) { h.pan = ctx.createStereoPanner(); h.nodo.connect(h.pan).connect(maestro); } else h.nodo.connect(maestro); });
  vivos.add(h); return h;
}
function detener(h) { if (!h) return; h.vivo = false; vivos.delete(h); try { h.gen && h.gen.partes.forEach(p => p.stop()); h.gen && h.gen.extra && h.gen.extra(); h.nodo && h.nodo.disconnect(); } catch (e) { } }
const P = { x: 0, y: 0, z: 0 }, C = { x: 0, y: 0, z: 0 };
const posDe = (obj, out) => { if (!obj) return null; if (obj.getWorldPosition) { const v = obj.getWorldPosition(obj.__v || (obj.__v = new obj.position.constructor())); out.x = v.x; out.y = v.y; out.z = v.z; } else if (obj.x !== undefined) { out.x = obj.x; out.y = obj.y || 0; out.z = obj.z; } else return null; return out; };
function cuadro() {
  if (ctx && vivos.size) {
    const cam = oyente ? posDe(oyente, C) : null;
    let dirx = 0, dirz = -1; if (oyente && oyente.getWorldDirection) { const d = oyente.getWorldDirection(oyente.__d || (oyente.__d = new oyente.position.constructor())); dirx = d.x; dirz = d.z; }
    vivos.forEach(h => { if (!h.nodo) return; let g = h.vol, pan = 0;
      if (h.obj && cam && posDe(h.obj, P)) { const dx = P.x - cam.x, dz = P.z - cam.z, d = Math.hypot(dx, P.y - cam.y, dz); g = h.vol * Math.max(0, 1 - d / h.alcance) ** 1.6;
        const L = Math.hypot(dx, dz) || 1; pan = Math.max(-1, Math.min(1, (dx * -dirz + dz * dirx) / L)); }
      h.nodo.gain.setTargetAtTime(g, ctx.currentTime, 0.1); if (h.pan) h.pan.pan.setTargetAtTime(pan * 0.8, ctx.currentTime, 0.1); });
  }
  requestAnimationFrame(cuadro);
}
requestAnimationFrame(cuadro);

// ---------------------------------------------------------------- botón 🔊 / 🔇
function boton() {
  if (document.getElementById('bSonido') || window.SIN_BOTON_SONIDO) return;
  const b = document.createElement('button'); b.id = 'bSonido'; b.title = 'Activar o silenciar el sonido';
  b.style.cssText = 'position:fixed;right:12px;bottom:calc(84px + env(safe-area-inset-bottom));z-index:20;width:46px;height:46px;border-radius:50%;border:0;background:rgba(14,58,107,.9);color:#fff;font-size:1.3rem;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.3)';
  const pintar = () => { b.textContent = silencio ? '🔇' : '🔊'; }; pintar();
  b.onclick = e => { e.stopPropagation(); silenciar(!silencio); pintar(); iniciar(); };
  document.body.appendChild(b);
}
function silenciar(v) { silencio = !!v; try { localStorage.setItem(CLAVE, silencio ? '0' : '1'); } catch (e) { } aplicarMaestro(); }
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boton); else setTimeout(boton, 0);
// se atenúa mientras hay una pregunta o aviso abierto (ventanas .modal del motor)
setInterval(() => { const m = document.querySelector('.modal, #modal'); const abierto = !!(m && getComputedStyle(m).display !== 'none'); if (abierto !== atenuado) { atenuado = abierto; aplicarMaestro(); } }, 400);

// pasos: Sonido.andar(true/false) mientras el personaje camina (un paso cada ~0.42 s, alternando)
let andando = false, volPaso = 1, ultPaso = 0;
setInterval(() => { if (andando && ctx && !silencio && performance.now() - ultPaso > 380) { ultPaso = performance.now(); UNA.paso(); } }, 60);
window.Sonido = {
  fuente: crearFuente, ambiente: (tipo, vol = 0.6) => crearFuente(tipo, null, { vol }), detener,
  detenerTodo: () => [...vivos].forEach(detener),
  una: tipo => listo(() => { if (UNA[tipo]) UNA[tipo](); }),
  camara: obj => { oyente = obj; }, andar: (v, vol) => { andando = !!v; if (vol) volPaso = vol; }, silenciar, iniciar, get activo() { return !!ctx && !silencio; },
};
})();
