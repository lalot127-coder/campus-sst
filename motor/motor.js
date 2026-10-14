// Motor común de los sub-mundos del simulador (Three.js 0.160 por CDN, importmap en cada página).
// Da: escena básica táctil, utilidades de geometría, panel de pasos, preguntas, puntaje, errores críticos con
// fuente, reporte final, resultados del grupo (localStorage + CSV) y envío al servidor de aula (/api/registro).
// Script CLÁSICO (no módulo) para que funcione también al abrir el archivo con doble clic (file://).
// Uso en cada sub-mundo:
//   <script src="../../../motor/motor.js"></script>   (en <head>)
//   <script type="module"> import * as THREE from 'three'; import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
//     const W = MotorSim.crearMundo(THREE, OrbitControls, {...}); </script>
(function () {
const BASE_MOTOR = document.currentScript ? document.currentScript.src : location.href;

const CSS = `
:root{--navy:#0E3A6B;--azul:#154F90;--medio:#1F6FB2;--cian:#3FA7C6;--cielo:#8CCDE0;--hielo:#E8F5F9;--texto:#1B2633;--tenue:#5B6B7C;--bien:#2E7D32;--mal:#C62828}
*{box-sizing:border-box} html,body{margin:0;height:100%;overflow:hidden;background:#d5e6ee;font-family:Calibri,"Segoe UI",system-ui,sans-serif;color:var(--texto)}
canvas{display:block;touch-action:none}
#barra{position:fixed;top:0;left:0;right:0;display:flex;gap:8px;align-items:center;padding:9px 12px;background:rgba(14,58,107,.96);color:#fff;z-index:12;flex-wrap:wrap}
#barra .salir{background:#C62828;color:#fff}
#barra b{font-size:1.02rem} #barra .chip{background:var(--azul);border-radius:999px;padding:4px 11px;font-weight:700;font-size:.92rem}
#barra .der{margin-left:auto;display:flex;gap:6px}
#panel{position:fixed;left:12px;bottom:12px;width:min(470px,calc(100vw - 24px));background:rgba(255,255,255,.97);border-radius:16px;padding:13px 15px;z-index:3;box-shadow:0 6px 24px rgba(14,58,107,.25);max-height:min(44vh,calc(100vh - var(--barraH,60px) - 30px));overflow:auto}
#panel .min{position:absolute;top:6px;right:8px;border:0;background:var(--hielo);color:var(--navy);border-radius:10px;padding:3px 10px;font-weight:800;cursor:pointer}
#panel.mini{max-height:none}#panel.mini #pTxt,#panel.mini #pFuente,#panel.mini #acciones{display:none}
#panel .paso{color:var(--cian);font-weight:800;font-size:.85rem;letter-spacing:.04em;padding-right:40px}
#panel h2{margin:.15rem 0 .35rem;color:var(--navy);font-size:1.2rem}
#panel p{margin:.2rem 0 .45rem;font-size:1.02rem}
#panel small{display:block;color:var(--tenue);font-style:italic}
#acciones{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px}
button{font-family:inherit} .prim{background:var(--azul);color:#fff;border:0;border-radius:12px;padding:11px 18px;font-size:1.02rem;font-weight:700;cursor:pointer}
.sec{background:var(--hielo);color:var(--navy);border:0;border-radius:12px;padding:11px 16px;font-size:1rem;cursor:pointer}
.peq{padding:6px 11px;font-size:.9rem}
@media (max-width:700px){#barra{padding:6px 8px;gap:5px}#barra img{height:26px}#barra b{font-size:.92rem;max-width:calc(100vw - 70px);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}#barra .txt{display:none}#barra .chip{font-size:.78rem;padding:2px 7px}#barra .der{margin-left:auto}#barra .der button{padding:5px 9px}#panel{left:8px;bottom:8px;width:calc(100vw - 16px);padding:10px 12px}#panel h2{font-size:1.05rem}#panel p{font-size:.95rem}}
#toast{position:fixed;top:calc(var(--barraH,60px) + 6px);left:50%;transform:translateX(-50%);max-width:min(640px,92vw);padding:12px 16px;border-radius:14px;color:#fff;z-index:10;display:none;box-shadow:0 6px 20px rgba(0,0,0,.25);font-size:1.02rem}
#toast.ok{background:var(--bien)} #toast.no{background:var(--mal)} #toast.info{background:var(--azul)} #toast small{display:block;opacity:.92;font-style:italic;margin-top:3px}
.modal{position:fixed;inset:0;background:rgba(14,58,107,.7);display:none;align-items:center;justify-content:center;padding:calc(var(--barraH,60px) + 8px) 14px 14px;z-index:8}
.tarjeta{background:#fff;border-radius:18px;max-width:660px;width:100%;padding:20px;max-height:calc(100vh - var(--barraH,60px) - 24px);overflow:auto}
.tarjeta h2{color:var(--navy);margin-top:0}
.op{display:flex;gap:10px;align-items:center;width:100%;text-align:left;background:var(--hielo);border:2px solid transparent;border-radius:12px;padding:12px;margin:7px 0;font-size:1.02rem;cursor:pointer;color:var(--texto)}
.op.marcada{border-color:var(--azul);background:#D7ECF4}
input[type=text]{font-size:1.05rem;padding:10px;border-radius:10px;border:1px solid var(--cielo);width:100%;margin:6px 0 12px}
table{width:100%;border-collapse:collapse;font-size:.93rem} td,th{padding:6px;border-bottom:1px solid var(--hielo);text-align:left;vertical-align:top}
.ficticio{font-size:.8rem;color:var(--tenue)}
.cron{font-size:2.2rem;font-weight:800;color:var(--navy);text-align:center}
@media print{#barra,#panel,canvas,#toast{display:none!important}.modal{position:static;background:none}.tarjeta{max-height:none}}`;


// ---------------------------------------------------------------- caras (12/10/2026)
// Todas las figuras humanas llevan cara (ojos, cejas, nariz, boca y orejas) para distinguir el frente de la espalda.
//   MotorSim.cara(THREE, cabeza, { dir: [0,0,1], arriba: [0,1,0] })   dir/arriba en el espacio local de la cabeza.
// Además, crearMundo() agrega cara sola a toda esfera con color de piel (r 0.08-0.2 m) que no la tenga; el frente es el +z
// local de la figura. Para personas acostadas se llama cara() a mano con su dirección (p. ej. dir:[0,1,0], arriba:[-1,0,0]).
function cara(THREE, cabeza, o = {}) {
  if (!cabeza || cabeza.userData.conCara || cabeza.userData.sinCara) return; cabeza.userData.conCara = true;
  const p = cabeza.geometry && cabeza.geometry.parameters || {}, r = p.radius || 0.14;
  const z = new THREE.Vector3(...(o.dir || [0, 0, 1])).normalize(), y0 = new THREE.Vector3(...(o.arriba || [0, 1, 0]));
  const x = new THREE.Vector3().crossVectors(y0, z).normalize(), y = new THREE.Vector3().crossVectors(z, x).normalize();
  const f = new THREE.Group(); f.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(x, y, z)); cabeza.add(f);
  const piel = cabeza.material && cabeza.material.color ? cabeza.material.color.clone() : new THREE.Color(0xE0B48F);
  const mat = c => new THREE.MeshStandardMaterial({ color: c, roughness: .6 });
  const oscuro = mat(0x1B2633), blanco = mat(0xFFFFFF), pielO = mat(piel.clone().multiplyScalar(0.86)), labio = mat(0x9A4B3C);
  const esf = (rad, m, px, py, pz) => { const e = new THREE.Mesh(new THREE.SphereGeometry(rad, 12, 10), m); e.position.set(px, py, pz); e.userData.sinCara = true; f.add(e); return e; };
  for (const s of [-1, 1]) {
    esf(r * 0.17, blanco, s * 0.36 * r, 0.12 * r, 0.83 * r).scale.z = 0.6;                       // ojo
    esf(r * 0.095, oscuro, s * 0.36 * r, 0.12 * r, 0.95 * r);                                     // pupila
    const ceja = new THREE.Mesh(new THREE.BoxGeometry(0.3 * r, 0.06 * r, 0.06 * r), oscuro); ceja.position.set(s * 0.36 * r, 0.38 * r, 0.9 * r); ceja.rotation.z = -s * 0.12; f.add(ceja);
    esf(r * 0.2, pielO, s * 0.98 * r, 0.02 * r, -0.05 * r).scale.set(0.5, 1, 0.8);               // oreja
  }
  esf(r * 0.14, pielO, 0, -0.1 * r, 1.0 * r).scale.set(0.85, 1.1, 1);                            // nariz
  const boca = new THREE.Mesh(new THREE.TorusGeometry(0.24 * r, 0.04 * r, 6, 16, Math.PI), labio); boca.position.set(0, -0.36 * r, 0.9 * r); boca.rotation.z = Math.PI; f.add(boca);
  return f;
}
function esPiel(THREE, c) { const h = {}; c.getHSL(h, THREE.SRGBColorSpace); return h.h > 0.02 && h.h < 0.12 && h.s > 0.18 && h.s < 0.8 && h.l > 0.28 && h.l < 0.86; }
function autoCaras(THREE, raiz) {
  let n = 0; raiz.updateMatrixWorld(true);
  raiz.traverse(m => { const p = m.geometry && m.geometry.parameters;
    if (!m.isMesh || m.geometry.type !== 'SphereGeometry' || !p || p.radius < 0.075 || p.radius > 0.2 || m.userData.conCara || m.userData.sinCara) return;
    if ((p.phiLength || 6.3) < 6.2 || (p.thetaLength || 3.2) < 3.1 || !m.material || !m.material.color || !esPiel(THREE, m.material.color)) return;
    if (m.userData.tipo && !m.parent) return; cara(THREE, m); n++; });
  return n;
}

function crearMundo(THREE, OrbitControls, cfg) {
  // cfg: {titulo, icono, clave, criterio:{pct, sinCriticos}, fuentesInicio, vistas:[[pos,target],...], fondo}
  document.head.insertAdjacentHTML('beforeend', `<style>${CSS}</style>`);
  document.body.insertAdjacentHTML('afterbegin', `
<div id="barra"><img src="${new URL('../recursos/logo_CERS.jpeg', BASE_MOTOR).href}" alt="CERS" style="height:34px;border-radius:7px;background:#fff;padding:2px"><b>${cfg.icono} ${cfg.titulo}</b><span class="chip" id="cPaso">Paso 0/0</span><span class="chip" id="cPts">0 pts</span><span class="chip" id="cTiempo">0:00</span>
<div class="der"><button class="sec peq" id="bAtrasM" title="Regresar al edificio">⬅<span class="txt"> Atrás</span></button><button class="sec peq" id="bVista" title="Cambiar la vista">🎥<span class="txt"> Vista</span></button><button class="sec peq" id="bReini" title="Reiniciar el caso">↺<span class="txt"> Reiniciar</span></button><button class="sec peq" id="bInicioM" title="Inicio del campus">🏠<span class="txt"> Inicio</span></button><button class="sec peq" id="bCompM" title="Compartir este simulador">🔗</button><button class="sec peq salir" id="bCampus" title="Salir del simulador">✖<span class="txt"> Salir</span></button></div></div>
<div id="panel"><button class="min" id="bMin" title="Minimizar o ampliar las instrucciones">▾</button><div class="paso" id="pNum"></div><h2 id="pTit">Cargando…</h2><p id="pTxt"></p><small id="pFuente"></small><div id="acciones"></div></div>
<div id="toast"></div><div class="modal" id="modal"><div class="tarjeta" id="mCont"></div></div>`);
  const $ = s => document.getElementById(s);
  // la barra puede ocupar 1 o 2 renglones (celular): las ventanas se acomodan debajo de ella y nunca se enciman
  const altoBarra = () => document.documentElement.style.setProperty('--barraH', $('barra').offsetHeight + 'px');
  altoBarra(); addEventListener('resize', altoBarra); if (window.ResizeObserver) new ResizeObserver(altoBarra).observe($('barra'));
  $('bMin').onclick = () => { const p = $('panel'); p.classList.toggle('mini'); $('bMin').textContent = p.classList.contains('mini') ? '▴' : '▾'; };
  // Regresa al mundo principal, frente al edificio del área (…/mundos/<area>/<modulo>/index.html)
  const area = (location.pathname.match(/mundos\/([^/]+)\//) || [])[1];
  const alCampus = (q) => { location.href = cfg.campus || ('../../../index.html' + (q || (area ? '?mundo=' + area : ''))); };
  const enPartida = () => S.t0 && nPaso < pasos.length;
  const confirmar = (fn) => () => { if (!enPartida() || confirm('¿Salir del simulador? La partida en curso se cancelará y no se registrará.')) fn(); };
  $('bAtrasM').onclick = confirmar(() => alCampus());            // al edificio de su área
  $('bInicioM').onclick = confirmar(() => alCampus('?plaza'));   // a la entrada del campus
  $('bCampus').onclick = confirmar(() => alCampus('?salir'));    // a la pantalla de inicio (salir)
  $('bCompM').onclick = () => { const u = new URL(location.href); u.searchParams.delete('qa');
    if (window.Compartir) Compartir.abrir(u.href, `${cfg.icono} ${cfg.titulo} · Campus SST`); else { navigator.clipboard && navigator.clipboard.writeText(u.href); toast('info', '🔗 Enlace copiado: ' + u.href); } };
  if (!window.Compartir) { const s = document.createElement('script'); s.src = new URL('compartir.js', BASE_MOTOR).href; document.head.appendChild(s); }
  if (!window.EnviarRes) { const s = document.createElement('script'); s.src = new URL('enviar_resultados.js', BASE_MOTOR).href; document.head.appendChild(s); }
  // Control de acceso: si se abre con enlace directo sin código vigente para esta puerta, muestra el candado + WhatsApp
  const proteger = () => { Acceso.sesionUnica && Acceso.sesionUnica(); Acceso.proteger(`${cfg.icono} ${cfg.titulo}`, new URL('../index.html' + (area ? '?mundo=' + area : ''), BASE_MOTOR).href); };
  if (window.Acceso) proteger(); else { const s = document.createElement('script'); s.src = new URL('acceso.js', BASE_MOTOR).href; s.onload = proteger; document.head.appendChild(s); }
  $('bReini').onclick = () => { if (!enPartida() || confirm('¿Reiniciar? La partida en curso se cancelará.')) location.reload(); };

  // ---------------------------------------------------------------- escena
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(innerWidth, innerHeight);
  document.body.prepend(renderer.domElement);
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(cfg.fondo || 0xDDEBF2);
  const camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, 0.05, 60);
  const VISTAS = cfg.vistas;
  let vista = 0;
  camera.position.set(...VISTAS[0][0]);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(...VISTAS[0][1]); controls.enableDamping = true; controls.maxPolarAngle = Math.PI * 0.49;
  controls.minDistance = 0.6; controls.maxDistance = 10; controls.update();
  const hemi = new THREE.HemisphereLight(0xffffff, 0x8899aa, 1.15); scene.add(hemi);
  const sol = new THREE.DirectionalLight(0xffffff, 1.35); sol.position.set(3, 6, 4); scene.add(sol);
  // gráficos más realistas: tono ACES, reflejos de entorno y sombras suaves (motor/realismo.js)
  // piso por edificio (cfg.piso lo cambia; cfg.piso = false lo desactiva): texturas PBR CC0 de assets/texturas/pbr
  const PISO = { hospital: 'azulejo', cafeteria: 'azulejo', industria: 'concreto_pulido', construccion: 'concreto_pulido', proteccion: 'concreto_pulido',
    laboral: 'madera', empresa: 'alfombra', biblioteca: 'madera', riesgo: 'concreto_pulido' };
  const texturizar = () => { if (cfg.piso !== false) Realismo.texturizar(THREE, scene, { piso: cfg.piso || PISO[area] || 'concreto_pulido', muro: 'yeso' }); };
  const realismo = () => { Realismo.aplicar(THREE, renderer, scene, { sol, hemi, radio: cfg.radioSombra || 8, sombras: cfg.sombras }); [300, 2500].forEach(ms => setTimeout(texturizar, ms)); };
  if (window.Realismo) realismo(); else { const s = document.createElement('script'); s.src = new URL('realismo.js', BASE_MOTOR).href; s.onload = realismo; document.head.appendChild(s); }

  const M = (c, extra = {}) => new THREE.MeshStandardMaterial({ color: c, roughness: .6, metalness: .05, ...extra });
  const caja = (w, h, d, c, x, y, z, padre = scene) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), M(c)); m.position.set(x, y, z); padre.add(m); return m; };
  const cil = (r, h, c, x, y, z, padre = scene, rt) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(rt ?? r, r, h, 24), M(c)); m.position.set(x, y, z); padre.add(m); return m; };
  const esfera = (r, c, x, y, z, padre = scene) => { const m = new THREE.Mesh(new THREE.SphereGeometry(r, 20, 16), M(c)); m.position.set(x, y, z); padre.add(m); return m; };
  const capsula = (r, l, c) => new THREE.Mesh(new THREE.CapsuleGeometry(r, l, 6, 14), M(c));
  // Objeto tocable: zona invisible amplia para dedos en tablet/celular.
  function tocable(obj, tipo, t = 0.4) {
    obj.userData.tipo = tipo;
    const z = new THREE.Mesh(new THREE.BoxGeometry(t, t, t), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }));
    z.userData = { tipo, ref: obj }; obj.add(z); return obj;
  }
  function letrero(texto, w = 1.6, h = 0.4, fondo = '#154F90', color = '#fff') {
    const cv = document.createElement('canvas'); cv.width = 512; cv.height = Math.round(512 * h / w); const g = cv.getContext('2d');
    g.fillStyle = fondo; g.fillRect(0, 0, cv.width, cv.height); g.fillStyle = color; g.font = `bold ${Math.round(cv.height * 0.46)}px Calibri, sans-serif`;
    g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(texto, cv.width / 2, cv.height / 2);
    const tx = new THREE.CanvasTexture(cv); tx.colorSpace = THREE.SRGBColorSpace;
    return new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tx, side: THREE.DoubleSide }));
  }

  // ---------------------------------------------------------------- animación, resaltado y toques
  const tweens = [];
  const mover = (v, destino, ms) => new Promise(res => tweens.push({ v, de: v.clone(), a: destino.clone ? destino.clone() : destino, t0: performance.now(), ms, res }));
  const reloj = new THREE.Clock(); let objetivos = []; const cuadro = [];
  renderer.setAnimationLoop(() => {
    const ahora = performance.now();
    for (let i = tweens.length - 1; i >= 0; i--) { const tw = tweens[i]; const k = Math.min(1, (ahora - tw.t0) / tw.ms); const e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      tw.v.lerpVectors(tw.de, tw.a, e); if (k >= 1) { tweens.splice(i, 1); tw.res(); } }
    const pulso = (Math.sin(reloj.getElapsedTime() * 5) + 1) / 2;
    objetivos.forEach(o => { o.material && o.material.emissive && o.material.emissive.setRGB(0, 0.22 * pulso, 0.32 * pulso); o.scale.setScalar(1 + 0.12 * pulso); });
    cuadro.forEach(f => f(reloj.getElapsedTime()));
    controls.update(); renderer.render(scene, camera);
  });
  addEventListener('resize', () => { camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight); });
  function resaltar(lista) { objetivos.forEach(o => { o.material && o.material.emissive && o.material.emissive.setRGB(0, 0, 0); o.scale.setScalar(1); }); objetivos = lista.filter(Boolean); }
  function irVista(i) { vista = i % VISTAS.length; mover(camera.position, new THREE.Vector3(...VISTAS[vista][0]), 700); mover(controls.target, new THREE.Vector3(...VISTAS[vista][1]), 700); }
  $('bVista').onclick = () => irVista(vista + 1);
  const ray = new THREE.Raycaster(), ptr = new THREE.Vector2(); let abajo = null;
  renderer.domElement.addEventListener('pointerdown', e => abajo = [e.clientX, e.clientY]);
  renderer.domElement.addEventListener('pointerup', e => {
    if (!abajo || Math.hypot(e.clientX - abajo[0], e.clientY - abajo[1]) > 10) return;
    ptr.set(e.clientX / innerWidth * 2 - 1, -(e.clientY / innerHeight) * 2 + 1); ray.setFromCamera(ptr, camera);
    const hits = ray.intersectObjects(scene.children, true), hit = hits.find(h => h.object.userData.tipo && visible(h.object));
    if (hit) { const o = hit.object.userData.ref || hit.object; if (REC.activo && REC.acercar(o)) return; tocar(o); }
    else if (REC.activo) REC.piso(ray);
  });
  const visible = o => { for (let p = o; p; p = p.parent) if (p.visible === false) return false; return true; };

  // ---------------------------------------------------------------- estado, pasos y puntaje
  let S = { nombre: '', caso: '', pts: 0, errores: [], criticos: 0, t0: 0 }, paso = null, nPaso = 0, pasos = [];
  // ---------------------------------------------------------------- recorrido a pie (12/10/2026)
  // api.recorrido({ piso, limites:{x0,x1,z0,z1}, obstaculos:[objetos], muros:[mallas], inicio:[x,z], ry, camara:[dy,dz] })
  // Avatar del campus que camina al tocar el piso (ruta A* que rodea muebles, personas y muros: no pasa sobre ellos).
  // Al tocar un objeto lejano, primero camina hasta él y luego lo inspecciona. Los muros entre la cámara y el avatar
  // se vuelven transparentes para que siempre se vea lo que hay dentro de las salas.
  const REC = { activo: false };
  const recorrido = async (o = {}) => {
    const Nav = (await import(new URL('navegacion.js', BASE_MOTOR).href)).Navegacion;
    if (!window.Avatar) await new Promise(ok => { const sc = document.createElement('script'); sc.src = new URL('avatar.js', BASE_MOTOR).href; sc.onload = ok; sc.onerror = ok; document.head.appendChild(sc); });
    const L = o.limites, nav = new Nav({ x0: L.x0, z0: L.z0, x1: L.x1, z1: L.z1, celda: 0.25 }), V = THREE.Vector3;
    const b = new THREE.Box3(), c = new V(), t = new V(), margen = o.margen ?? 0.32;
    const bloquear = ob => { ob.updateMatrixWorld(true); b.setFromObject(ob); if (b.isEmpty() || b.min.y > 1.7) return; b.getCenter(c); b.getSize(t);
      if (t.x * t.z > 40) return;   // pisos y tapetes no estorban
      nav.bloquearRect(c.x, c.z, t.x + margen * 2, t.z + margen * 2, 0); };
    (o.obstaculos || []).forEach(bloquear); (o.muros || []).forEach(m => { m.updateMatrixWorld(true); b.setFromObject(m); b.getCenter(c); b.getSize(t); nav.bloquearRect(c.x, c.z, t.x + 0.3, t.z + 0.3, 0); });
    (o.libres || []).forEach(([x, z, w, d]) => nav.liberarRect(x, z, w, d, 0));
    let perfil = {}; try { perfil = JSON.parse(localStorage.getItem('campus_perfil') || '{}'); } catch (e) { }
    const av = window.Avatar ? Avatar.construir(THREE, perfil) : null; const yo = av ? av.grupo : new THREE.Group(); scene.add(yo);
    yo.position.set(...(o.inicio ? [o.inicio[0], 0, o.inicio[1]] : [0, 0, 0])); yo.rotation.y = o.ry || Math.PI; yo.traverse(m => { m.userData.sinCara = true; });
    const pisos = [].concat(o.piso || []); let ruta = [], alLlegar = null, fase = 0, seguir = true;
    const off = new V(...(o.camara ? [0, o.camara[0], o.camara[1]] : [0, 3.6, 6.8]));   // cámara baja y atrás: se ve hacia el frente, no solo el piso
    camera.position.copy(yo.position).add(new V(0, 1.2, 0)).add(off); controls.target.copy(yo.position).add(new V(0, 1.2, 0));
    const ir = (x, z, cb) => { const r = nav.ruta({ x: yo.position.x, z: yo.position.z }, { x, z }); if (!r.length) { toast('info', 'No hay paso libre hasta ahí.'); return false; }
      ruta = r.map(p => new V(p.x, 0, p.z)); alLlegar = cb || null; seguir = true; marca.position.set(r[r.length - 1].x, 0.02, r[r.length - 1].z); marca.visible = true; return true; };
    const marca = new THREE.Mesh(new THREE.RingGeometry(0.16, 0.24, 24), new THREE.MeshBasicMaterial({ color: 0x3FA7C6, side: THREE.DoubleSide })); marca.rotation.x = -Math.PI / 2; marca.visible = false; scene.add(marca);
    REC.piso = ray => { const h = ray.intersectObjects(pisos, false)[0]; if (h) ir(h.point.x, h.point.z); };
    REC.acercar = obj => { obj.updateMatrixWorld(true); b.setFromObject(obj); if (b.isEmpty()) return false; b.getCenter(c); b.getSize(t);
      const r = Math.max(t.x, t.z) / 2, d = Math.hypot(c.x - yo.position.x, c.z - yo.position.z); if (d < r + (o.alcance || 1.6)) return false;
      const dir = new V(yo.position.x - c.x, 0, yo.position.z - c.z).normalize(), dest = c.clone().addScaledVector(dir, r + 0.8);
      return ir(dest.x, dest.z, () => { yo.rotation.y = Math.atan2(c.x - yo.position.x, c.z - yo.position.z); tocar(obj); }); };
    // muros transparentes entre la cámara y el avatar
    const muros = (o.muros || []).filter(m => m.isMesh), ray2 = new THREE.Raycaster(), cab = new V();
    muros.forEach(m => { m.material = m.material.clone(); m.material.transparent = true; m.userData.op = 1; });
    controls.addEventListener('start', () => { seguir = false; });
    let tPrev = performance.now();
    cuadro.push(() => { const ahora = performance.now(), dt = Math.min(0.05, (ahora - tPrev) / 1000); tPrev = ahora;
      if (ruta.length) { const d = ruta[0].clone().sub(yo.position); d.y = 0; const Ld = d.length();
        if (Ld < 0.06) { ruta.shift(); if (!ruta.length) { marca.visible = false; const f = alLlegar; alLlegar = null; f && f(); } }
        else { d.normalize(); const paso = Math.min(Ld, (o.vel || 2.4) * dt), antes = yo.position.clone(); yo.position.addScaledVector(d, paso); yo.rotation.y = Math.atan2(d.x, d.z); fase += dt * 10; av && av.animar(fase, true);
          const mov = yo.position.clone().sub(antes); camera.position.add(mov); controls.target.add(mov); } }
      else av && av.animar(0, false);
      if (seguir) { const obj = yo.position.clone().add(new V(0, 1.2, 0)); controls.target.lerp(obj, Math.min(1, dt * 3)); }
      if (muros.length) { const tapan = new Set();   // rayos de la cámara al avatar y a su alrededor (lo que hay junto a él también se ve)
        for (const [dx, dz] of [[0, 0], [1.8, 0], [-1.8, 0], [0, -1.8], [0, 1.8]]) { cab.copy(yo.position).add(new V(dx, 1.0, dz)); const dv = cab.clone().sub(camera.position), Ld = dv.length();
          ray2.set(camera.position, dv.normalize()); ray2.far = Ld; ray2.intersectObjects(muros, false).forEach(h => tapan.add(h.object)); }
        muros.forEach(m => { const meta = tapan.has(m) ? 0.16 : 1; m.userData.op += (meta - m.userData.op) * Math.min(1, dt * 8); m.material.opacity = m.userData.op; m.material.depthWrite = m.userData.op > 0.9; }); } });
    REC.activo = true; REC.ir = ir; REC.yo = yo; REC.nav = nav;
    return { yo, ir, nav, detener: () => { ruta = []; marca.visible = false; }, seguir: (v = true) => { seguir = v; } };
  };
  function toast(tipo, txt, fuente = '', ms) { const t = $('toast'); t.className = tipo; t.innerHTML = txt + (fuente ? `<small>Fuente: ${fuente}</small>` : ''); t.style.display = 'block';
    clearTimeout(t._t); t._t = setTimeout(() => t.style.display = 'none', ms || (tipo === 'no' ? 5200 : 2600)); }
  function bien(txt, f) { S.pts += 10; toast('ok', '✅ ' + txt, f); marcador(); }
  function mal(txt, f, critico = false) { S.pts -= 5; if (critico) S.criticos++; S.errores.push({ paso: nPaso + 1, txt, f, critico }); toast('no', (critico ? '⛔ ERROR CRÍTICO: ' : '❌ ') + txt, f); marcador(); }
  function marcador() { $('cPts').textContent = Math.max(0, S.pts) + ' pts'; $('cPaso').textContent = `Paso ${Math.min(nPaso + 1, pasos.length)}/${pasos.length}`; }
  setInterval(() => { if (S.t0) { const s = Math.floor((Date.now() - S.t0) / 1000); $('cTiempo').textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; } }, 1000);
  function botones(lista) { const a = $('acciones'); a.innerHTML = ''; lista.forEach(([txt, fn, cls]) => { const b = document.createElement('button'); b.className = cls || 'prim'; b.textContent = txt; b.onclick = fn; a.appendChild(b); }); }
  function mostrar() { paso = pasos[nPaso]; marcador(); $('panel').classList.remove('mini'); $('bMin').textContent = '▾'; $('pNum').textContent = `PASO ${nPaso + 1} DE ${pasos.length}`; $('pTit').textContent = paso.titulo; $('pTxt').innerHTML = paso.texto;
    $('pFuente').textContent = paso.fuente ? 'Fuente: ' + paso.fuente : ''; botones([]); resaltar([]); paso.iniciar && paso.iniciar(); }
  function siguiente() { nPaso++; if (nPaso >= pasos.length) return reporte(); setTimeout(mostrar, 450); }
  function tocar(o) { if (paso && paso.tocar) paso.tocar(o); }
  function pregunta(titulo, ops, correctas, fuente, alAcertar, multiple = false, retro = '') {
    const sel = new Set();
    $('mCont').innerHTML = `<h2>${titulo}</h2><div id="ops"></div><br><button class="prim" id="mOk">${multiple ? 'Confirmar' : 'Elegir'}</button>`;
    ops.forEach((o, k) => { const b = document.createElement('button'); b.className = 'op'; b.textContent = o; b.onclick = () => { if (!multiple) { sel.clear(); document.querySelectorAll('.op').forEach(x => x.classList.remove('marcada')); }
      sel.has(k) ? (sel.delete(k), b.classList.remove('marcada')) : (sel.add(k), b.classList.add('marcada')); }; $('ops').appendChild(b); });
    $('modal').style.display = 'flex';
    $('mOk').onclick = () => { if (!sel.size) return; const ok = [...sel].sort().join() === [...correctas].sort().join(); $('modal').style.display = 'none';
      if (ok) { bien(retro || 'Correcto.', fuente); alAcertar && alAcertar(); } else { mal('Respuesta incorrecta. ' + (retro || ''), fuente); setTimeout(() => pregunta(titulo, ops, correctas, fuente, alAcertar, multiple, retro), 700); } };
  }
  function aviso(html, alCerrar, txtBoton = 'Entendido') { $('mCont').innerHTML = html + `<br><button class="prim" id="mOk">${txtBoton}</button>`; $('modal').style.display = 'flex';
    $('mOk').onclick = () => { $('modal').style.display = 'none'; alCerrar && alCerrar(); }; }

  // ---------------------------------------------------------------- reporte, grupo, registro
  const K = 'sim_' + cfg.clave;
  const leer = () => { try { return JSON.parse(localStorage.getItem(K) || '[]'); } catch (e) { return []; } };
  async function registrar(fila) { if (!location.protocol.startsWith('http')) return false;
    try { const r = await fetch('/api/registro', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tipo: 'simulador', fila }) }); return r.ok; } catch (e) { return false; } }
  async function reporte() {
    resaltar([]); botones([]);
    S.pts = Math.max(0, S.pts); const s = Math.floor((Date.now() - S.t0) / 1000), max = pasos.reduce((s, p) => s + (p.sinPuntos ? 0 : (p.puntos ?? 10)), 0), pct = Math.min(100, Math.round(S.pts / max * 100));
    const crit = cfg.criterio || { pct: 80, sinCriticos: true };
    const aprobado = pct >= crit.pct && (!crit.sinCriticos || S.criticos === 0);
    const reg = { modulo: cfg.titulo, nombre: S.nombre, caso: S.caso, fecha: new Date().toLocaleString('es-MX'), puntos: S.pts, porcentaje: pct, criticos: S.criticos, errores: S.errores.length, segundos: s, resultado: aprobado ? 'Aprobado' : 'Repasar' };
    try { const a = leer(); a.push(reg); localStorage.setItem(K, JSON.stringify(a)); } catch (e) { }
    $('mCont').innerHTML = `<h2>${aprobado ? '🏆 ¡Lo lograste!' : '💪 Hay que repasar'}</h2>
     <p><b>${S.nombre}</b> · ${cfg.titulo}${S.caso ? ' · ' + S.caso : ''}<br>Puntaje: <b>${S.pts}/${max} (${pct}%)</b> · Errores críticos: <b>${S.criticos}</b> · Tiempo: ${Math.floor(s / 60)} min ${s % 60} s<br>
     Criterio: ${crit.pct}% o más${crit.sinCriticos ? ' y sin errores críticos' : ''}.</p><p class="ficticio" id="estReg">Enviando a la persona instructora…</p>
     ${S.errores.length ? '<table><tr><th>Paso</th><th>Qué pasó</th><th>Fuente</th></tr>' + S.errores.map(e => `<tr><td>${e.paso}</td><td>${e.critico ? '⛔ ' : ''}${e.txt}</td><td>${e.f || ''}</td></tr>`).join('') + '</table>' : '<p>Sin errores. 👏</p>'}
     <br><button class="prim" onclick="location.reload()">Siguiente participante</button> <button class="sec" onclick="print()">Imprimir / PDF</button> <button class="prim" id="bEnviar" style="background:#25D366">📤 Enviar resultados</button> <button class="sec" id="bGrupo">Resultados del grupo</button> <button class="sec" id="bVolver2">⬅ Regresar al campus</button>`;
    $('bVolver2').onclick = () => alCampus();
    if (window.EnviarRes) EnviarRes.ofrecer(reg); $('bEnviar').onclick = () => window.EnviarRes ? (EnviarRes.ofrecer(reg), EnviarRes.abrir()) : alert(Object.entries(reg).map(([k, v]) => k + ': ' + v).join(' · '));
    $('modal').style.display = 'flex'; $('bGrupo').onclick = grupo;
    const ok = await registrar(reg);
    $('estReg').textContent = ok ? '✅ Resultado registrado en la computadora de la persona instructora.' : 'Resultado guardado en este dispositivo (sin conexión al aula). Puedes imprimirlo o guardarlo como PDF.';
  }
  function grupo() {
    const a = leer();
    $('mCont').innerHTML = `<h2>Resultados en este dispositivo (${a.length})</h2><table><tr><th>Nombre</th><th>Caso</th><th>%</th><th>Críticos</th><th>Resultado</th></tr>
     ${a.map(r => `<tr><td>${r.nombre}</td><td>${r.caso || ''}</td><td>${r.porcentaje}%</td><td>${r.criticos}</td><td>${r.resultado}</td></tr>`).join('') || '<tr><td colspan=5>Sin registros</td></tr>'}</table><br>
     <button class="prim" id="bCsv">Descargar CSV</button> <button class="sec" onclick="location.reload()">Cerrar</button> <button class="sec" id="bBorrar">Borrar</button>`;
    $('modal').style.display = 'flex';
    $('bCsv').onclick = () => { const t = 'Modulo,Nombre,Caso,Fecha,Puntos,Porcentaje,Criticos,Errores,Segundos,Resultado\n' + a.map(r => [r.modulo, r.nombre, r.caso, r.fecha, r.puntos, r.porcentaje, r.criticos, r.errores, r.segundos, r.resultado].map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
      const b = new Blob(['﻿' + t], { type: 'text/csv' }); const l = document.createElement('a'); l.href = URL.createObjectURL(b); l.download = `resultados_${cfg.clave}.csv`; l.click(); };
    $('bBorrar').onclick = () => { if (confirm('¿Borrar resultados de este dispositivo?')) { localStorage.removeItem(K); grupo(); } };
  }
  // Pantalla de inicio: nombre + casos
  function inicio(casos, alIniciar, notaFuentes) {
    let sel = casos[0].id;
    $('mCont').innerHTML = `<h2>${cfg.icono} ${cfg.titulo}</h2><p>Gira la vista arrastrando con un dedo y acerca con dos. Toca los objetos que brillan en azul y sigue el panel de instrucciones.</p>
      <input type="text" id="nom" placeholder="Nombre completo del participante" autocomplete="off">
      <div id="casos" style="display:grid;gap:8px;margin:8px 0">${casos.map((c, i) => `<button class="op ${i ? '' : 'marcada'}" data-c="${c.id}">${c.txt}</button>`).join('')}</div>
      <button class="prim" id="bIni">Comenzar</button> <button class="sec" id="bRes">Resultados del grupo</button> <button class="sec" id="bVolver">⬅ Regresar al campus</button><p class="ficticio">${notaFuentes}</p>`;
    $('bVolver').onclick = () => alCampus();
    try { const pf = JSON.parse(localStorage.getItem('campus_perfil') || '{}'); if (pf.nombre) $('nom').value = pf.nombre; } catch (e) { }   // nombre del avatar del campus
    $('modal').style.display = 'flex';
    document.querySelectorAll('#casos .op').forEach(b => b.onclick = () => { document.querySelectorAll('#casos .op').forEach(x => x.classList.remove('marcada')); b.classList.add('marcada'); sel = b.dataset.c; });
    $('bIni').onclick = () => { S.nombre = $('nom').value.trim() || 'Participante'; $('modal').style.display = 'none'; S.caso = casos.find(c => c.id === sel).txt.replace(/<[^>]+>/g, '');
      S.t0 = Date.now(); nPaso = 0; pasos = alIniciar(sel); mostrar(); };
    $('bRes').onclick = grupo;
  }
  const qa = () => ({ paso: nPaso, titulo: paso && paso.titulo, pts: S.pts, criticos: S.criticos, errores: S.errores.length });

  const api = { THREE, scene, camera, controls, renderer, M, caja, cil, esfera, capsula, tocable, letrero, mover, resaltar, irVista, cuadro,
    toast, bien, mal, botones, pregunta, aviso, siguiente, inicio, qa, tocar, $, estado: () => S };
  // Animaciones para que la escena «haga lo que dice la respuesta» (12/10/2026)
  //   await api.animar(ms, k => {...})  k de 0 a 1 · api.globo(texto, objeto, ms) globo de diálogo · api.cara(cabeza, opc)
  api.cara = (cab, o) => cara(THREE, cab, o); api.recorrido = recorrido;
  api.animar = (ms, fn) => new Promise(ok => { const t0 = performance.now(); const f = () => { const k = Math.min(1, (performance.now() - t0) / ms); fn(k); if (k < 1) requestAnimationFrame(f); else ok(); }; requestAnimationFrame(f); });
  api.esperar = ms => new Promise(ok => setTimeout(ok, ms));
  api.globo = (texto, obj, ms = 2600, alto = 0.55) => {
    const cv = document.createElement('canvas'), g = cv.getContext('2d'); g.font = 'bold 44px Calibri, sans-serif';
    const w = Math.min(1000, Math.ceil(g.measureText(texto).width) + 60); cv.width = w; cv.height = 110;
    g.fillStyle = '#ffffff'; g.strokeStyle = '#0E3A6B'; g.lineWidth = 6; g.beginPath(); g.roundRect(4, 4, w - 8, 80, 22); g.fill(); g.stroke();
    g.beginPath(); g.moveTo(w / 2 - 16, 82); g.lineTo(w / 2, 106); g.lineTo(w / 2 + 16, 82); g.fill(); g.font = 'bold 44px Calibri, sans-serif'; g.fillStyle = '#0E3A6B'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(texto, w / 2, 45);
    const tx = new THREE.CanvasTexture(cv); tx.colorSpace = THREE.SRGBColorSpace;
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tx, depthTest: false })); sp.renderOrder = 10; const h = 0.32; sp.scale.set(h * w / 110, h, 1);
    const pos = new THREE.Vector3(); (obj || scene).getWorldPosition(pos); sp.position.copy(pos).add(new THREE.Vector3(0, alto, 0)); scene.add(sp);
    if (ms) setTimeout(() => { scene.remove(sp); tx.dispose(); }, ms); return sp; };
  setTimeout(() => autoCaras(THREE, scene), 900); setTimeout(() => autoCaras(THREE, scene), 3500);
  // Modo inmersivo (WebXR) opcional: cfg.xr = { inicio:[x,z], piso, entorno } (ver motor/xr.js). Se puede llamar
  // también después con api.activarXR({...}) cuando el piso y el entorno ya existen.
  api.activarXR = (opc) => { api._xrPedido = true; const go = () => { api.xr = MotorXR.activar(api, opc || {}); };
    if (window.MotorXR) go(); else { const s = document.createElement('script'); s.src = new URL('xr.js', BASE_MOTOR).href; s.onload = go; document.head.appendChild(s); } };
  if (/[?&]qa\b/.test(location.search)) window.__mundo = api;   // pruebas
  if (cfg.xr) api.activarXR(cfg.xr);
  // Sub-mundos sin configuración propia de VR (07/10/2026): se activa solo. Piso = el plano horizontal más grande (para
  // teletransportarse); la persona aparece entre la cámara inicial y el punto al que mira. cfg.xr = false lo desactiva.
  else if (cfg.xr === undefined) setTimeout(() => { if (api.xr || api._xrPedido) return; let piso = null, mayor = 0; scene.updateMatrixWorld(true);
    scene.traverse(m => { const p = m.geometry && m.geometry.parameters; if (!m.isMesh || !p || m.geometry.type !== 'PlaneGeometry' || Math.abs(Math.abs(m.rotation.x) - Math.PI / 2) > 0.01) return;
      const s = new THREE.Vector3(); m.getWorldScale(s); const a = p.width * s.x * p.height * s.y; if (a > mayor && m.getWorldPosition(new THREE.Vector3()).y < 0.3) { mayor = a; piso = m; } });
    const [c, t] = VISTAS[0]; api.activarXR({ inicio: [(c[0] + t[0]) / 2, (c[2] + t[2]) / 2], piso, entorno: piso ? [piso] : [] }); }, 1500);
  return api;
}

window.MotorSim = { crearMundo, cara, autoCaras };
})();
