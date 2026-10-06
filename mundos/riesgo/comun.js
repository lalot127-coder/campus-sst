// Utilidades de las puertas del curso "Análisis de riesgo" (Industria: Normativa, ¿Es riesgo o no?, Mitigación) y de la
// puerta "Análisis de riesgo" de cada edificio. Script clásico; requiere ../../../motor/motor.js.
// Escenas alrededor del origen: en el visor la persona aparece de pie en (0, 0.6) mirando a -z.
// Fuentes: 02_fuentes_verificadas/registro_fuentes.md (consulta 05/10/2026). Escenas y empresas [FICTICIO].
(function () {
  const PALETA = { noche: '#14213D', naranja: '#C2410C', azul: '#1F6F8B', ambar: '#F2A900', verde: '#2E7D32', rojo: '#B03A2E' };
  const NIVEL_COLOR = { Grave: 0xB03A2E, Elevado: 0xE67E22, Medio: 0xF2C94C, Bajo: 0xA5D6A7, 'Mínimo': 0x2E7D32 };
  // Matriz NOM-031-STPS-2011, 8.3 c) Tabla 4: frecuencia → [I, II, III, IV]
  const MATRIZ = { E: ['Medio', 'Elevado', 'Grave', 'Grave'], D: ['Bajo', 'Medio', 'Elevado', 'Grave'],
    C: ['Mínimo', 'Bajo', 'Medio', 'Elevado'], B: ['Mínimo', 'Mínimo', 'Bajo', 'Medio'], A: ['Mínimo', 'Mínimo', 'Mínimo', 'Bajo'] };
  const FREC = { A: 'A Remota: excepcionalmente puede ocurrir', B: 'B Aislada: difícilmente ocurre', C: 'C Ocasional: pocas veces ocurre',
    D: 'D Recurrente: se repite con periodicidad', E: 'E Frecuente: ocurre con regularidad' };
  const SEV = { I: 'I Menor: sin daño o incapacidad de 3 días o menos', II: 'II Moderada: incapacidad temporal de más de 3 días',
    III: 'III Crítica: incapacidad permanente parcial', IV: 'IV Fatal: incapacidad permanente total o muerte' };
  const nivel = (f, s) => MATRIZ[f][['I', 'II', 'III', 'IV'].indexOf(s)];
  const N31 = 'NOM-031-STPS-2011, 8.3 (Tablas 2, 3 y 4)';

  // Sala de ancho × fondo con piso (teletransporte en el visor), muros y rótulo. Devuelve {piso, entorno}.
  function sala(W, { ancho = 10, fondo = 9, piso = 0xCFC9BE, muro = 0xEEF1F4, rotulo = '', color = PALETA.noche } = {}) {
    const { THREE, scene, caja, M, letrero } = W;
    const p = new THREE.Mesh(new THREE.PlaneGeometry(ancho, fondo), M(piso)); p.rotation.x = -Math.PI / 2; p.position.z = -fondo / 2 + 2; scene.add(p);
    const z0 = -fondo + 2, entorno = [p];
    entorno.push(caja(ancho, 3, 0.1, muro, 0, 1.5, z0), caja(0.1, 3, fondo, muro, -ancho / 2, 1.5, z0 + fondo / 2), caja(0.1, 3, fondo, muro, ancho / 2, 1.5, z0 + fondo / 2));
    // franja de seguridad en el piso (NOM-026: delimitación de áreas)
    for (const x of [-ancho / 2 + 0.6, ancho / 2 - 0.6]) { const f = caja(0.08, 0.005, fondo - 1, 0xF2C94C, x, 0.004, z0 + fondo / 2); entorno.push(f); }
    if (rotulo) { const r = letrero(rotulo, Math.min(ancho - 1, 0.13 * rotulo.length + 1), 0.4, color); r.position.set(0, 2.7, z0 + 0.07); scene.add(r); entorno.push(r); }
    const luz = new THREE.PointLight(0xFFF4E0, 0.7, 16); luz.position.set(0, 2.8, -2); scene.add(luz);
    return { piso: p, entorno, z0 };
  }

  function persona(W, { x = 0, z = 0, ry = 0, ropa = 0x2E75B6, piel = 0xE0B48F, pantalon = 0x37474F, casco = null, pose = '' } = {}) {
    const { THREE, scene, capsula, esfera, cil } = W;
    const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = ry; scene.add(g);
    for (const dx of [-0.09, 0.09]) { const pi = capsula(0.075, 0.55, pantalon); pi.position.set(dx, 0.42, 0); g.add(pi); }
    const torso = capsula(0.2, 0.42, ropa); torso.position.set(0, 1.05, 0); g.add(torso);
    if (pose === 'agachado') { torso.rotation.x = 0.7; torso.position.set(0, 0.95, 0.15); }
    esfera(0.14, piel, 0, pose === 'agachado' ? 1.35 : 1.52, pose === 'agachado' ? 0.35 : 0, g);
    for (const s of [-1, 1]) { const b = capsula(0.055, 0.45, ropa); b.position.set(0.27 * s, 1.02, pose === 'agachado' ? 0.25 : 0); b.rotation.z = -0.12 * s; g.add(b); }
    if (casco !== null) cil(0.16, 0.08, casco, 0, pose === 'agachado' ? 1.47 : 1.64, pose === 'agachado' ? 0.35 : 0, g, 0.12);
    return { g, torso };
  }

  // Objetos genéricos de creación propia (geometría simple). prop(W, clave, x, z, ry) → Group.
  function prop(W, clave, x, z, ry = 0) {
    const { THREE, scene, caja, cil, esfera, M } = W; const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = ry; scene.add(g);
    const c = (w, h, d, col, px, py, pz) => caja(w, h, d, col, px, py, pz, g), k = (r, h, col, px, py, pz, rt) => cil(r, h, col, px, py, pz, g, rt);
    const P = {
      charco() { const m = new THREE.Mesh(new THREE.CircleGeometry(0.55, 24), M(0x7FB3D5, { transparent: true, opacity: .7, roughness: .05 })); m.rotation.x = -Math.PI / 2; m.position.y = 0.006; g.add(m); c(0.25, 0.6, 0.02, 0xF2C94C, 0.6, 0.3, 0); },
      estufa() { c(1.0, 0.9, 0.6, 0xB0BEC5, 0, 0.45, 0); k(0.18, 0.18, 0x37474F, -0.22, 1.0, 0); k(0.2, 0.25, 0x546E7A, 0.22, 1.02, 0); },
      cuchillos() { c(0.9, 0.85, 0.5, 0xA1887F, 0, 0.425, 0); for (let i = 0; i < 3; i++) c(0.03, 0.01, 0.28, 0xCFD8DC, -0.2 + i * 0.12, 0.86, 0.05); },
      cilindro() { k(0.16, 1.0, 0x8E24AA, 0, 0.5, 0); esfera(0.16, 0x8E24AA, 0, 1.0, 0, g); k(0.03, 0.12, 0x9E9E9E, 0, 1.18, 0); },
      multicontacto() { c(0.5, 0.06, 0.12, 0xFFFFFF, 0, 0.04, 0); for (let i = 0; i < 4; i++) { const t = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(-0.2 + i * 0.13, 0.05, 0), new THREE.Vector3(-0.3 + i * 0.2, 0.02, 0.5), new THREE.Vector3(-0.4 + i * 0.3, 0.02, 1)]), 12, 0.012, 6), M(0x212121)); g.add(t); } },
      cable() { const t = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(-1, 0.02, 0), new THREE.Vector3(-0.3, 0.02, 0.3), new THREE.Vector3(0.4, 0.02, -0.2), new THREE.Vector3(1, 0.02, 0.1)]), 30, 0.02, 6), M(0x212121)); g.add(t); esfera(0.05, 0xD84315, 0.05, 0.03, 0.05, g); },
      anaquel() { for (const y of [0.05, 0.6, 1.15, 1.7]) c(1.2, 0.04, 0.45, 0x8D6E63, 0, y, 0); for (const px of [-0.58, 0.58]) c(0.04, 1.8, 0.45, 0x6D4C41, px, 0.9, 0); c(0.4, 0.3, 0.35, 0xBCAAA4, 0.25, 1.9, 0.05); c(0.35, 0.25, 0.3, 0xA1887F, -0.2, 1.88, 0.12); },
      escalera() { for (const px of [-0.22, 0.22]) c(0.05, 2.0, 0.05, 0xFFB300, px, 1.0, 0); for (let i = 0; i < 6; i++) c(0.44, 0.03, 0.05, 0xFFB300, 0, 0.25 + i * 0.3, 0); g.rotation.x = -0.25; },
      punzo() { c(0.8, 0.8, 0.5, 0xECEFF1, 0, 0.4, 0); for (let i = 0; i < 4; i++) { const a = c(0.01, 0.01, 0.12, 0xB0BEC5, -0.2 + i * 0.1, 0.81, 0); a.rotation.y = i; } },
      contenedor_rojo() { c(0.25, 0.32, 0.18, 0xD32F2F, 0, 0.96, 0); c(0.8, 0.8, 0.5, 0xECEFF1, 0, 0.4, 0); },
      lavamanos() { c(0.6, 0.85, 0.45, 0xFFFFFF, 0, 0.425, 0); k(0.02, 0.25, 0xB0BEC5, 0, 1.0, -0.1); },
      puerta() { c(1.0, 2.1, 0.08, 0x6D4C41, 0, 1.05, 0); c(0.12, 0.12, 0.1, 0xFFD54F, 0.35, 1.05, 0.06); },
      puerta_candado() { c(1.0, 2.1, 0.08, 0x546E7A, 0, 1.05, 0); c(0.14, 0.16, 0.08, 0xFFC107, 0.35, 1.05, 0.08); c(0.6, 0.14, 0.02, 0x2E7D32, 0, 2.25, 0.05); },
      cajas() { for (let i = 0; i < 4; i++) c(0.5, 0.4, 0.4, 0xC8A27A, (i % 2) * 0.55 - 0.27, 0.2 + Math.floor(i / 2) * 0.41, 0); },
      tanque() { k(0.8, 1.6, 0x90A4AE, 0, 0.8, 0); k(0.25, 0.1, 0x37474F, 0, 1.65, 0); },
      tablero() { c(0.7, 1.0, 0.25, 0x9E9E9E, 0, 1.2, 0); c(0.2, 0.2, 0.01, 0xFFD600, 0, 1.45, 0.13); },
      prensa() { c(0.9, 0.9, 0.7, 0x1565C0, 0, 0.45, 0); c(0.3, 1.3, 0.3, 0x0D47A1, 0, 1.55, -0.15); c(0.7, 0.15, 0.5, 0x90A4AE, 0, 1.05, 0.05); },
      soldadura() { c(0.8, 0.85, 0.5, 0x546E7A, 0, 0.425, 0); k(0.11, 1.0, 0x2E7D32, 0.5, 0.5, 0.15); k(0.11, 1.0, 0xC62828, 0.75, 0.5, 0.15); esfera(0.06, 0xFFF59D, -0.1, 0.92, 0, g); },
      escritorio() { c(1.3, 0.05, 0.7, 0xB89B7A, 0, 0.75, 0); for (const [a, b] of [[-0.6, -0.3], [0.6, -0.3], [-0.6, 0.3], [0.6, 0.3]]) c(0.05, 0.75, 0.05, 0x6D5A45, a, 0.375, b); c(0.5, 0.32, 0.03, 0x263238, 0, 1.0, -0.2); },
      silla() { c(0.45, 0.06, 0.45, 0x37474F, 0, 0.45, 0); c(0.45, 0.5, 0.05, 0x37474F, 0, 0.75, -0.2); k(0.03, 0.42, 0x212121, 0, 0.21, 0); },
      tambo() { k(0.3, 0.9, 0x1565C0, 0, 0.45, 0); c(0.3, 0.2, 0.01, 0xFFFFFF, 0, 0.55, 0.3); },
      compresora() { c(1.0, 0.7, 0.6, 0xE53935, 0, 0.35, 0); k(0.2, 0.9, 0x9E9E9E, 0.3, 0.45, 0, 0.2); },
      azotea() { c(2.0, 0.15, 1.2, 0x9E9E9E, 0, 2.0, 0); for (const px of [-0.9, 0.9]) c(0.15, 2.0, 0.15, 0x757575, px, 1.0, 0); },
      reloj() { k(0.25, 0.05, 0xFFFFFF, 0, 2.0, 0); g.children[g.children.length - 1].rotation.x = Math.PI / 2; },
      buzon() { c(0.35, 0.45, 0.25, 0x1F5F6B, 0, 1.3, 0); },
      senal_salida() { c(0.6, 0.3, 0.02, 0x2E7D32, 0, 2.2, 0); },
      camilla() { c(0.7, 0.08, 1.9, 0xECEFF1, 0, 0.75, 0); for (const [a, b] of [[-0.3, -0.85], [0.3, -0.85], [-0.3, 0.85], [0.3, 0.85]]) k(0.025, 0.72, 0x9E9E9E, a, 0.37, b); },
      mesa() { c(1.2, 0.05, 0.7, 0xEEEEEE, 0, 0.8, 0); for (const [a, b] of [[-0.55, -0.3], [0.55, -0.3], [-0.55, 0.3], [0.55, 0.3]]) c(0.04, 0.8, 0.04, 0x9E9E9E, a, 0.4, b); },
      dea() { c(0.3, 0.35, 0.12, 0x43A047, 0, 1.3, 0); c(0.22, 0.12, 0.01, 0xFFFFFF, 0, 1.33, 0.07); },
      extintor() { k(0.09, 0.5, 0xC62828, 0, 0.3, 0); k(0.03, 0.08, 0x212121, 0, 0.6, 0); },
      extintor_obstruido() { k(0.09, 0.5, 0xC62828, 0, 0.3, 0); for (let i = 0; i < 3; i++) c(0.5, 0.4, 0.4, 0xC8A27A, (i - 1) * 0.5, 0.2, 0.35); },
      planta() { k(0.18, 0.35, 0x8D6E63, 0, 0.17, 0); esfera(0.3, 0x43A047, 0, 0.6, 0, g); },
    };
    (P[clave] || P.cajas)();
    return g;
  }

  // Marcador tocable (ícono + aro) sobre un objeto de la escena.
  function situacion(W, { x, z, y = 1.3, tipo, icono, etiqueta, color = PALETA.azul }) {
    const { THREE, scene, letrero, tocable } = W;
    const ic = letrero(icono, 0.42, 0.42, '#FFFFFF', '#000'); ic.position.set(x, y, z); ic.lookAt(0, y, 1); scene.add(ic);
    const marco = new THREE.Mesh(new THREE.TorusGeometry(0.27, 0.025, 8, 32), W.M(new THREE.Color(color))); marco.position.copy(ic.position); marco.lookAt(0, y, 1); scene.add(marco);
    tocable(marco, tipo, 0.6);
    let rot = null; if (etiqueta) { rot = letrero(etiqueta, Math.max(0.9, etiqueta.length * 0.055), 0.16, color); rot.position.set(x, y + 0.4, z); rot.lookAt(0, y + 0.4, 1); rot.visible = false; scene.add(rot); }
    return { ic, marco, rot };
  }

  // Decisión: ops [{t, ok, crit, fb, f}]
  function decidir(W, titulo, ops, alAcertar, contexto = '') {
    const $ = W.$;
    $('mCont').innerHTML = `<h2>${titulo}</h2>${contexto ? `<p>${contexto}</p>` : ''}<div id="ops"></div>`;
    ops.forEach(o => { const b = document.createElement('button'); b.className = 'op'; b.textContent = o.t;
      b.onclick = () => { $('modal').style.display = 'none';
        if (o.ok) { W.bien(o.fb || 'Correcto.', o.f); alAcertar && alAcertar(); }
        else { W.mal(o.fb || 'No es lo correcto.', o.f, !!o.crit); setTimeout(() => decidir(W, titulo, ops, alAcertar, contexto), 900); } };
      $('ops').appendChild(b); });
    $('modal').style.display = 'flex';
  }
  const barajar = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  // Paso "encuentra": toca las buenas (cada una suma); las malas restan una vez. items {tipo, nombre, fb, f, obj}
  function encuentra(W, { titulo, texto, fuente, buenas, malas, alTerminar }) {
    const halladas = new Set(); const idc = 'nEnc' + Math.random().toString(36).slice(2, 7);
    return { titulo, texto: texto + ` <b id="${idc}">(0/${buenas.length})</b>`, fuente, puntos: buenas.length * 10,
      iniciar() { W.resaltar([]); },
      tocar(o) {
        const t = o.userData.tipo; const b = buenas.find(x => x.tipo === t), m = malas.find(x => x.tipo === t);
        if (b && !halladas.has(t)) { halladas.add(t); W.bien(`${b.nombre}. ${b.fb}`, b.f); if (b.obj) { b.obj.marco.material.color.set(0x2E7D32); if (b.obj.rot) b.obj.rot.visible = true; }
          const n = document.getElementById(idc); if (n) n.textContent = `(${halladas.size}/${buenas.length})`;
          if (halladas.size === buenas.length) setTimeout(() => (alTerminar ? alTerminar() : W.siguiente()), 900); }
        else if (m && !m._d) { m._d = true; W.mal(m.msg || `${m.nombre}: no es un riesgo sin control. ${m.fb}`, m.f); if (m.obj) { m.obj.marco.material.color.set(0x9E9E9E); if (m.obj.rot) m.obj.rot.visible = true; } }
      } };
  }
  // Paso "toca X y decide"
  const tocaYDecide = (W, titulo, texto, obj, tipo, pregunta, ops, fuente, contexto = '') => ({ titulo, texto, fuente,
    iniciar() { W.resaltar([obj]); },
    tocar(o) { if (o.userData.tipo !== tipo || this._h) return; this._h = true; W.resaltar([]); decidir(W, pregunta, ops, () => W.siguiente(), contexto); } });
  // Paso de decisión directa (sin tocar)
  const decide = (W, titulo, contexto, ops, fuente) => ({ titulo, texto: contexto, fuente, iniciar() { decidir(W, titulo, ops, () => W.siguiente(), contexto); } });
  const intro = (W, html, ficticio) => ({ titulo: 'Inicio', texto: 'Lee la situación.', sinPuntos: true,
    iniciar() { W.aviso(html + (ficticio ? `<p class="ficticio">[FICTICIO – ejercicio didáctico] ${ficticio}</p>` : ''), () => W.siguiente(), 'Comenzar'); } });

  window.Riesgo = { PALETA, NIVEL_COLOR, MATRIZ, FREC, SEV, nivel, N31, sala, persona, prop, situacion, decidir, barajar, encuentra, tocaYDecide, decide, intro };
})();
