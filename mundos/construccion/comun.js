// Utilidades de los escenarios del curso "Trabajo seguro en alturas" (zona Obra en construcción y edificio Industria).
// Script clásico; requiere ../../../motor/motor.js y ../../riesgo/comun.js (decidir, encuentra, intro, barajar).
// Escenas alrededor del origen; en el visor la persona aparece de pie en cfg.xr.inicio mirando a -z.
// Fuentes: 02_fuentes_verificadas/registro_fuentes.md (consulta 06/10/2026), NOM-009-STPS-2011 (DOF 06/05/2011).
// Escenas, empresas, personas y fichas de fabricante [FICTICIO – ejercicio didáctico].
(function () {
  const N09 = 'NOM-009-STPS-2011', N31 = 'NOM-031-STPS-2011', N26 = 'NOM-026-STPS-2008', RF = 'RFSST (DOF 13/11/2014)';
  const SHIB = 'OSHA SHIB 03-24-2004, act. 2011 (referencia no obligatoria)';
  const FIC = '[FICTICIO – ejercicio didáctico]';
  // Ficha de fabricante del curso (igual que contenido.py FICHA_FIC). TODOS LOS VALORES SON FICTICIOS.
  const FICHA = { linea: 1.8, despliegue: 1.2, anilloPies: 1.5, margen: 1.0, caidaLibreMax: 1.8 };
  const COL = { concreto: 0xB9B4AA, losa: 0xA7A29A, acero: 0x7B8794, amarillo: 0xF2C200, naranja: 0xE07A1F, arnes: 0xF57C00,
    arnes2: 0x263238, chaleco: 0xC6FF00, casco: 0xFFFFFF, piel: 0xD9A47E, mezclilla: 0x34495E, madera: 0xB98B57, rojo: 0xC62828, verde: 0x2E7D32 };

  const tubo = (W, a, b, r, c, padre) => { const { THREE } = W; const d = new THREE.Vector3().subVectors(b, a), L = d.length();
    const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, L, 10), W.M(c, { metalness: .35, roughness: .5 }));
    m.position.copy(a).add(b).multiplyScalar(.5); m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize()); (padre || W.scene).add(m); return m; };
  const V = (W, x, y, z) => new W.THREE.Vector3(x, y, z);

  // Cielo, luz de sol con sombras suaves y niebla de distancia (ambiente exterior realista)
  function exterior(W, { sombras = true, cielo = 0xBFD9EC } = {}) {
    const { THREE, scene, renderer } = W;
    scene.background = new THREE.Color(cielo); scene.fog = new THREE.Fog(cielo, 22, 60);
    if (sombras) { renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap; }
    const sol = new THREE.DirectionalLight(0xFFF2DA, 1.6); sol.position.set(6, 12, 5); sol.castShadow = sombras;
    sol.shadow.mapSize.set(1024, 1024); Object.assign(sol.shadow.camera, { left: -12, right: 12, top: 12, bottom: -12, near: 1, far: 40 });
    scene.add(sol); return sol;
  }
  const sombrear = (g) => g.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });

  // Obra en construcción: terreno, estructura de concreto de 2 niveles en obra negra (losa de nivel 1 a `altura` m), columnas,
  // varillas, borde de losa sin pretil, cinta de delimitación y señales. Devuelve {piso, losa, entorno, alturaLosa, bordeZ}.
  function obra(W, { altura = 4.0, bordeZ = -1.2, ancho = 9, fondo = 6, rotulo = 'OBRA · CONSTRUCTORA DEL CENTRO [FICTICIO]' } = {}) {
    const { THREE, scene, caja, M, letrero } = W; const entorno = [];
    const piso = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), M(0xA89A84, { roughness: 1 })); piso.rotation.x = -Math.PI / 2; piso.receiveShadow = true; scene.add(piso); entorno.push(piso);
    // estructura
    const g = new THREE.Group(); scene.add(g); entorno.push(g);
    const z0 = bordeZ - fondo;   // la losa va de z0 (atrás) a bordeZ (borde libre hacia la cámara)
    caja(ancho, 0.25, fondo, COL.losa, 0, altura - 0.125, (z0 + bordeZ) / 2, g);                       // losa nivel 1
    caja(ancho, 0.25, fondo, COL.losa, 0, altura * 2 - 0.125, (z0 + bordeZ) / 2, g);                   // losa nivel 2
    for (const x of [-ancho / 2 + 0.3, 0, ancho / 2 - 0.3]) for (const z of [bordeZ - 0.3, z0 + 0.3]) {
      caja(0.4, altura * 2, 0.4, COL.concreto, x, altura, z, g);
      for (const dx of [-0.12, 0.12]) caja(0.025, 0.7, 0.025, 0x6D4C41, x + dx, altura * 2 + 0.35, z, g); }   // varillas
    caja(ancho, altura, 0.15, 0xC9C2B6, 0, altura / 2, z0 + 0.05, g);                                  // muro de fondo
    // cinta de delimitación a nivel de piso bajo el borde (NOM-009 7.12)
    const cinta = new THREE.Group(); g.add(cinta);
    for (const x of [-3.5, -1.2, 1.2, 3.5]) { W.cil(0.03, 1.0, COL.naranja, x, 0.5, bordeZ + 2.4, cinta); }
    caja(7.2, 0.06, 0.01, 0xFFD000, 0, 0.92, bordeZ + 2.4, cinta);
    for (let i = 0; i < 12; i++) caja(0.25, 0.06, 0.012, 0x111111, -3.3 + i * 0.6, 0.92, bordeZ + 2.4, cinta);
    // materiales
    for (let i = 0; i < 5; i++) caja(1.8, 0.06, 0.25, COL.madera, -3.2, 0.03 + i * 0.065, 2.2, g);
    for (let i = 0; i < 3; i++) W.cil(0.35, 0.8, 0x8D8D8D, 3.4 + i * 0.75, 0.4, 2.6, g);
    if (rotulo) { const r = letrero(rotulo, 4.6, 0.38, '#E07A1F'); r.position.set(0, altura - 0.55, bordeZ + 0.01); g.add(r); }
    sombrear(g);
    return { piso, entorno, alturaLosa: altura, bordeZ, z0, g, cinta };
  }

  // Nave industrial interior (para Industria): piso epóxico, muros, techo alto con estructura y luminarias.
  function nave(W, { alto = 7, ancho = 14, fondo = 12, rotulo = 'NAVE 2 · MANTENIMIENTO INDUSTRIAL DEL CENTRO [FICTICIO]' } = {}) {
    const { THREE, scene, caja, M, letrero } = W; const entorno = [];
    scene.background = new THREE.Color(0xDDE3E8);
    const piso = new THREE.Mesh(new THREE.PlaneGeometry(ancho, fondo), M(0x8FA3A6, { roughness: .35 })); piso.rotation.x = -Math.PI / 2; piso.position.z = -fondo / 2 + 3; scene.add(piso); entorno.push(piso);
    const zf = -fondo + 3;
    entorno.push(caja(ancho, alto, 0.15, 0xE7ECEF, 0, alto / 2, zf), caja(0.15, alto, fondo, 0xE7ECEF, -ancho / 2, alto / 2, zf + fondo / 2), caja(0.15, alto, fondo, 0xE7ECEF, ancho / 2, alto / 2, zf + fondo / 2));
    for (let x = -ancho / 2 + 1; x < ancho / 2; x += 3) entorno.push(caja(0.18, 0.5, fondo, COL.acero, x, alto - 0.25, zf + fondo / 2));   // armaduras
    for (const x of [-ancho / 2 + 0.7, ancho / 2 - 0.7]) entorno.push(caja(0.1, 0.006, fondo - 1, 0xF2C94C, x, 0.004, zf + fondo / 2));
    if (rotulo) { const r = letrero(rotulo, Math.min(ancho - 2, 0.12 * rotulo.length + 1), 0.4, '#102A43'); r.position.set(0, 3.2, zf + 0.09); scene.add(r); entorno.push(r); }
    const luz = new THREE.PointLight(0xFFFFFF, 0.8, 30); luz.position.set(0, alto - 1, -2); scene.add(luz);
    return { piso, entorno, zf, alto };
  }

  // Trabajador con casco con barboquejo, chaleco, botas y ARNÉS de cuerpo completo por piezas (visibles o no):
  // partes.tirantes, partes.pecho, partes.piernas, partes.anillo (dorsal), partes.subpelvica. Devuelve {g, partes, anillo()}.
  function trabajador(W, { x = 0, y = 0, z = 0, ry = 0, arnes = true, casco = COL.casco, ropa = 0x546E7A, pose = '' } = {}) {
    const { THREE, capsula, esfera, cil, caja } = W;
    const g = new THREE.Group(); g.position.set(x, y, z); g.rotation.y = ry; W.scene.add(g);
    const piernas = [], brazos = [];
    for (const s of [-1, 1]) { const p = capsula(0.075, 0.6, COL.mezclilla); p.position.set(0.1 * s, 0.45, 0); g.add(p); piernas.push(p);
      caja(0.13, 0.1, 0.24, 0x3E2723, 0.1 * s, 0.05, 0.04, g); }                                                           // botas
    const torso = capsula(0.19, 0.42, ropa); torso.position.set(0, 1.08, 0); g.add(torso);
    const chaleco = capsula(0.2, 0.4, COL.chaleco); chaleco.position.set(0, 1.1, 0); chaleco.scale.set(1.02, 1, 1.02); g.add(chaleco);
    for (const yy of [1.0, 1.18]) { const f = new THREE.Mesh(new THREE.TorusGeometry(0.205, 0.012, 6, 24), W.M(0xE0E0E0, { emissive: 0x333333 })); f.rotation.x = Math.PI / 2; f.position.y = yy; g.add(f); }
    esfera(0.13, COL.piel, 0, 1.56, 0, g);
    for (const s of [-1, 1]) { const b = capsula(0.055, 0.46, ropa); b.position.set(0.27 * s, 1.07, 0); b.rotation.z = -0.15 * s; g.add(b); brazos.push(b); }
    const cascoM = cil(0.155, 0.1, casco, 0, 1.69, 0, g, 0.13); caja(0.34, 0.015, 0.36, casco, 0, 1.64, 0.02, g);
    const barbiquejo = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.007, 4, 20, Math.PI), W.M(0x212121)); barbiquejo.position.set(0, 1.56, 0.0); barbiquejo.rotation.set(0, Math.PI / 2, Math.PI); g.add(barbiquejo);
    // arnés
    const A = COL.arnes, partes = { tirantes: new THREE.Group(), pecho: new THREE.Group(), piernas: new THREE.Group(), anillo: new THREE.Group(), subpelvica: new THREE.Group() };
    Object.values(partes).forEach(p => g.add(p));
    for (const s of [-1, 1]) { tubo(W, V(W, 0.09 * s, 1.36, 0.17), V(W, 0.12 * s, 0.86, 0.2), 0.022, A, partes.tirantes); tubo(W, V(W, 0.09 * s, 1.36, -0.17), V(W, 0.1 * s, 0.86, -0.2), 0.022, A, partes.tirantes);
      const pierna = new THREE.Mesh(new THREE.TorusGeometry(0.095, 0.02, 6, 20), W.M(A)); pierna.rotation.x = Math.PI / 2; pierna.position.set(0.1 * s, 0.68, 0); partes.piernas.add(pierna); }
    tubo(W, V(W, -0.16, 1.22, 0.19), V(W, 0.16, 1.22, 0.19), 0.02, A, partes.pecho); caja(0.06, 0.05, 0.03, 0x9E9E9E, 0, 1.22, 0.21, partes.pecho);
    tubo(W, V(W, -0.18, 0.84, 0.16), V(W, 0.18, 0.84, 0.16), 0.022, A, partes.subpelvica); tubo(W, V(W, -0.18, 0.84, -0.17), V(W, 0.18, 0.84, -0.17), 0.022, A, partes.subpelvica);
    const anillo = new THREE.Mesh(new THREE.TorusGeometry(0.045, 0.011, 8, 20), W.M(0xB0BEC5, { metalness: .8, roughness: .3 })); anillo.position.set(0, 1.3, -0.23); partes.anillo.add(anillo);
    Object.values(partes).forEach(p => p.visible = arnes);
    if (pose === 'colgado') { piernas.forEach(p => { p.rotation.x = 0.25; }); brazos.forEach((b, i) => { b.rotation.z = (i ? -1 : 1) * 0.35; }); }
    sombrear(g);
    const anilloMundo = () => anillo.getWorldPosition(new THREE.Vector3());
    return { g, partes, piernas, brazos, torso, anillo: anilloMundo, cascoM };
  }

  // Línea de vida con absorbedor (paquete) entre dos puntos; cuerda tensa o con catenaria. Devuelve {g, set(a,b,despl)}.
  function lineaVida(W, { color = 0x1565C0 } = {}) {
    const { THREE } = W; const g = new THREE.Group(); W.scene.add(g);
    const mat = W.M(color), matPack = W.M(0x212121);
    let cuerda = null; const pack = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.2, 0.06), matPack); g.add(pack);
    const despl = new THREE.Mesh(new THREE.BoxGeometry(0.05, 1, 0.01), W.M(0xFFB300)); despl.visible = false; g.add(despl);
    function set(a, b, desplegado = 0, flojo = 0) {
      if (cuerda) { g.remove(cuerda); cuerda.geometry.dispose(); }
      const medio = a.clone().add(b).multiplyScalar(.5); medio.y -= flojo;
      const curva = new THREE.QuadraticBezierCurve3(a, medio, b); cuerda = new THREE.Mesh(new THREE.TubeGeometry(curva, 24, 0.012, 6), mat); g.add(cuerda);
      const pPack = curva.getPoint(0.88); pack.position.copy(pPack);
      despl.visible = desplegado > 0.02; if (despl.visible) { despl.scale.y = desplegado; despl.position.copy(curva.getPoint(0.94)); }
    }
    return { g, set };
  }

  // Mosquetón (torus abierto + compuerta). bloquea=false → la compuerta queda abierta (defecto).
  function mosqueton(W, { x, y, z, padre, bloquea = true, color = 0xB0BEC5 } = {}) {
    const { THREE } = W; const g = new THREE.Group(); g.position.set(x, y, z); (padre || W.scene).add(g);
    const cuerpo = new THREE.Mesh(new THREE.TorusGeometry(0.07, 0.012, 8, 24, Math.PI * 1.65), W.M(color, { metalness: .85, roughness: .25 })); cuerpo.rotation.z = 0.6; g.add(cuerpo);
    const comp = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.009, 0.075, 8), W.M(bloquea ? 0xFFC107 : 0xE53935, { metalness: .6 }));
    comp.position.set(0.055, -0.035, 0); comp.rotation.z = bloquea ? 0.25 : 1.15; g.add(comp);
    return g;
  }

  // Andamio tipo torre de `niveles` cuerpos de 2 m. cfg de cumplimiento (true = cumple): rodapie, intermedia, tablones,
  // frenos, tarjeta, caballete (true = NO hay caballete), sujecion. Devuelve {g, piezas{clave: Object3D}, alto}.
  function andamio(W, { x = 0, z = 0, niveles = 3, base = 1.5, prof = 1.0, cfg = {} } = {}) {
    const { THREE, caja } = W; const g = new THREE.Group(); g.position.set(x, 0, z); W.scene.add(g);
    const c = { rodapie: true, intermedia: true, tablones: true, frenos: true, tarjeta: true, caballete: true, sujecion: true, ...cfg };
    const H = niveles * 2, piezas = {}, A = 0x9AA5B1;
    const esq = [[-base / 2, -prof / 2], [base / 2, -prof / 2], [-base / 2, prof / 2], [base / 2, prof / 2]];
    for (const [ex, ez] of esq) { tubo(W, V(W, ex, 0.18, ez), V(W, ex, H + 1.0, ez), 0.024, A, g);
      const rueda = W.cil(0.09, 0.05, 0x212121, ex, 0.09, ez, g); rueda.rotation.z = Math.PI / 2;
      const freno = caja(0.06, 0.05, 0.06, c.frenos ? 0xD32F2F : 0x9E9E9E, ex + 0.07, 0.16, ez, g); if (ex < 0 && ez > 0) piezas.frenos = freno; }
    for (let n = 0; n <= niveles; n++) { const y = 0.2 + n * 2;
      for (const ez of [-prof / 2, prof / 2]) tubo(W, V(W, -base / 2, y, ez), V(W, base / 2, y, ez), 0.02, A, g);
      for (const ex of [-base / 2, base / 2]) tubo(W, V(W, ex, y, -prof / 2), V(W, ex, y, prof / 2), 0.02, A, g);
      if (n < niveles) for (const ez of [-prof / 2, prof / 2]) tubo(W, V(W, -base / 2, y, ez), V(W, base / 2, y + 2, ez), 0.015, A, g); }   // diagonales
    // escalera interior de acceso (dentro del cuerpo)
    for (let k = 0; k < niveles * 6; k++) tubo(W, V(W, -0.2, 0.45 + k * 0.33, prof / 2 - 0.05), V(W, 0.2, 0.45 + k * 0.33, prof / 2 - 0.05), 0.012, 0xFFB300, g);
    // plataforma de trabajo arriba
    const yP = 0.2 + niveles * 2, tab = new THREE.Group(); g.add(tab); piezas.tablones = tab;
    const nTab = c.tablones ? 3 : 2, anchoT = c.tablones ? base / 3 - 0.012 : 0.3;
    for (let i = 0; i < nTab; i++) { const tx = c.tablones ? -base / 2 + anchoT / 2 + 0.006 + i * (anchoT + 0.012) : (i ? 0.45 : -0.45);
      caja(anchoT, 0.05, prof + 0.2, COL.madera, tx, yP + 0.03, 0, tab); }
    const yB = yP + 0.9, bar = new THREE.Group(); g.add(bar); piezas.barandal = bar;
    for (const ez of [-prof / 2, prof / 2]) tubo(W, V(W, -base / 2, yB, ez), V(W, base / 2, yB, ez), 0.02, 0xFFC107, bar);
    for (const ex of [-base / 2, base / 2]) tubo(W, V(W, ex, yB, -prof / 2), V(W, ex, yB, prof / 2), 0.02, 0xFFC107, bar);
    const inter = new THREE.Group(); g.add(inter); piezas.intermedia = inter; inter.visible = c.intermedia;
    for (const ez of [-prof / 2, prof / 2]) tubo(W, V(W, -base / 2, yP + 0.47, ez), V(W, base / 2, yP + 0.47, ez), 0.016, 0xFFC107, inter);
    const rod = new THREE.Group(); g.add(rod); piezas.rodapie = rod; rod.visible = c.rodapie;
    for (const ez of [-prof / 2 - 0.01, prof / 2 + 0.01]) caja(base, 0.15, 0.02, 0xFF8F00, 0, yP + 0.13, ez, rod);
    // tarjeta en el acceso (NOM-009 9.1 v)
    const tarjeta = W.letrero(c.tarjeta ? 'APTO · 06/10 · J. Pérez' : '', 0.32, 0.2, c.tarjeta ? '#2E7D32' : '#BDBDBD'); tarjeta.position.set(0, 1.3, prof / 2 + 0.03); g.add(tarjeta); piezas.tarjeta = tarjeta;
    // caballete usado como soporte (incumplimiento 9.1 p)
    if (!c.caballete) { const cab = new THREE.Group(); cab.position.set(base / 2 + 1.0, 0, 0); g.add(cab); piezas.caballete = cab;
      for (const s of [-1, 1]) tubo(W, V(W, -0.25, 0, s * 0.25), V(W, 0, 1.6, s * 0.25), 0.02, 0xFFB300, cab), tubo(W, V(W, 0.25, 0, s * 0.25), V(W, 0, 1.6, s * 0.25), 0.02, 0xFFB300, cab);
      caja(1.6, 0.05, 0.3, COL.madera, -0.7, 1.62, 0, cab); }
    // sujeción a la estructura (9.1 o)
    if (c.sujecion) { const suj = new THREE.Group(); g.add(suj); piezas.sujecion = suj; for (const y of [4.2, 8.2].filter(v => v < H)) tubo(W, V(W, 0, y, -prof / 2), V(W, 0, y, -prof / 2 - 1.9), 0.02, 0x546E7A, suj); }
    sombrear(g);
    return { g, piezas, alto: H, yP };
  }

  // Escalera de mano recta de longitud L, con el pie en (x, 0, zPie) apoyada en un muro en z = zMuro. Devuelve {g, peldaños[], colocar(dx)}.
  function escalera(W, { L = 5, x = 0, zMuro = -3, color = 0xFFB300 } = {}) {
    const { THREE } = W; const g = new THREE.Group(); W.scene.add(g); const interior = new THREE.Group(); g.add(interior);
    const pel = []; const n = Math.floor(L / 0.3);
    for (const s of [-1, 1]) { const r = W.caja(0.05, L, 0.07, color, 0.22 * s, L / 2, 0, interior); r.castShadow = true; }
    for (let i = 1; i <= n; i++) { const p = W.caja(0.44, 0.035, 0.05, color, 0, i * 0.3, 0, interior); p.userData.k = i; pel.push(p); }
    for (const s of [-1, 1]) W.caja(0.09, 0.04, 0.12, 0x212121, 0.22 * s, 0.02, 0, interior);                             // bases antiderrapantes
    function colocar(dx) {   // dx: distancia horizontal del pie al muro
      const ang = Math.asin(Math.min(0.98, dx / L)); g.position.set(x, 0, zMuro + dx); interior.rotation.x = -ang; return ang; }
    colocar(L / 4);
    return { g, peldanos: pel, colocar, n, L };
  }

  // Plataforma de elevación de tijera con canastilla, barandal de 90 cm, panel de control, estabilizadores y anclaje.
  function plataforma(W, { x = 0, z = 0, alto = 0.4 } = {}) {
    const { THREE, caja } = W; const g = new THREE.Group(); g.position.set(x, 0, z); W.scene.add(g); const p = {};
    p.base = caja(1.2, 0.35, 2.2, 0x1565C0, 0, 0.35, 0, g);
    for (const [a, b] of [[-0.5, -0.85], [0.5, -0.85], [-0.5, 0.85], [0.5, 0.85]]) { const r = W.cil(0.15, 0.12, 0x212121, a, 0.15, b, g); r.rotation.z = Math.PI / 2; }
    p.tijera = new THREE.Group(); g.add(p.tijera);
    const canast = new THREE.Group(); g.add(canast); p.canastilla = canast;
    caja(1.15, 0.06, 2.1, 0x90A4AE, 0, 0, 0, canast);
    p.barandal = new THREE.Group(); canast.add(p.barandal);
    for (const [ax, az, bx, bz] of [[-0.57, -1.03, 0.57, -1.03], [-0.57, 1.03, 0.57, 1.03], [-0.57, -1.03, -0.57, 1.03], [0.57, -1.03, 0.57, 1.03]]) {
      tubo(W, V(W, ax, 0.9, az), V(W, bx, 0.9, bz), 0.022, 0xFFC107, p.barandal); tubo(W, V(W, ax, 0.45, az), V(W, bx, 0.45, bz), 0.016, 0xFFC107, p.barandal); }
    for (const [ax, az] of [[-0.57, -1.03], [0.57, -1.03], [-0.57, 1.03], [0.57, 1.03]]) tubo(W, V(W, ax, 0, az), V(W, ax, 0.9, az), 0.02, 0xFFC107, p.barandal);
    p.panel = caja(0.3, 0.25, 0.08, 0x37474F, 0.3, 1.0, 0.95, canast); caja(0.05, 0.05, 0.02, 0xD32F2F, 0.38, 1.05, 0.995, canast);
    p.anclaje = new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.012, 8, 20), W.M(0xB0BEC5, { metalness: .8 })); p.anclaje.position.set(-0.4, 0.12, 0.9); canast.add(p.anclaje);
    p.estab = []; for (const [a, b] of [[-0.75, -0.95], [0.75, -0.95], [-0.75, 0.95], [0.75, 0.95]]) { const e = caja(0.12, 0.3, 0.12, 0xFFB300, a, 0.25, b, g); p.estab.push(e); }
    p.calcomania = W.letrero('CAPACIDAD 227 kg [FIC]', 0.7, 0.14, '#FFFFFF', '#111'); p.calcomania.position.set(0, 0.42, 1.11); g.add(p.calcomania);
    p.fuga = new THREE.Mesh(new THREE.CircleGeometry(0.25, 20), W.M(0x3E2723, { transparent: true, opacity: .75, roughness: .1 })); p.fuga.rotation.x = -Math.PI / 2; p.fuga.position.set(0.3, 0.006, 0.4); g.add(p.fuga); p.fuga.visible = false;
    function elevar(h) {   // h: altura del piso de la canastilla
      canast.position.set(0, Math.max(0.6, h), 0);
      p.tijera.clear(); const n = Math.max(1, Math.round((h - 0.55) / 0.9)), paso = (Math.max(0.6, h) - 0.55) / n;
      for (let i = 0; i < n; i++) { const y0 = 0.55 + i * paso; for (const s of [-0.5, 0.5]) { tubo(W, V(W, s, y0, -0.9), V(W, s, y0 + paso, 0.9), 0.03, 0x37474F, p.tijera); tubo(W, V(W, s, y0, 0.9), V(W, s, y0 + paso, -0.9), 0.03, 0x37474F, p.tijera); } }
      sombrear(g); }
    elevar(alto); sombrear(g);
    return { g, p, elevar };
  }

  // Aro tocable con ícono (marcador de hallazgo) — mismo estilo que Riesgo.situacion, pero orientado a la cámara inicial.
  function marcador(W, { x, y, z, tipo, icono = '❓', etiqueta = '', color = '#0E7490', mira = [0, 1.6, 4], escala = 1 }) {
    const { THREE, scene, letrero, tocable } = W;
    const ic = letrero(icono, 0.36, 0.36, '#FFFFFF', '#000'); ic.position.set(x, y, z); ic.lookAt(...mira); scene.add(ic);
    const marco = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.024, 8, 32), W.M(new THREE.Color(color))); marco.position.copy(ic.position); marco.lookAt(...mira); scene.add(marco);
    tocable(marco, tipo, 0.55);
    let rot = null; if (etiqueta) { rot = letrero(etiqueta, Math.max(0.9, etiqueta.length * 0.05), 0.15, color); rot.position.set(x, y + 0.36 * escala, z); rot.lookAt(mira[0], y + 0.36 * escala, mira[2]); rot.visible = false; scene.add(rot); }
    if (escala !== 1) [ic, marco, rot].forEach(o => o && o.scale.multiplyScalar(escala));
    return { ic, marco, rot };
  }

  // Cronómetro grande en la barra (para el rescate). Devuelve {seg(), parar()}.
  function cronometro(W, { etiqueta = '⏱' } = {}) {
    const el = document.createElement('span'); el.className = 'chip'; el.style.background = '#C62828'; el.textContent = etiqueta + ' 0:00';
    W.$('cTiempo').after(el); const t0 = Date.now(); let fin = null;
    const h = setInterval(() => { const s = Math.floor(((fin || Date.now()) - t0) / 1000); el.textContent = `${etiqueta} ${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; }, 500);
    return { seg: () => Math.floor(((fin || Date.now()) - t0) / 1000), parar: () => { fin = Date.now(); clearInterval(h); } };
  }

  window.Alturas = { N09, N31, N26, RF, SHIB, FIC, FICHA, COL, tubo, V, exterior, sombrear, obra, nave, trabajador, lineaVida, mosqueton, andamio, escalera, plataforma, marcador, cronometro };
})();
