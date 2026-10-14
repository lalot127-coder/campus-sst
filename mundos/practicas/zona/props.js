// Objetos 3D de las zonas de trabajo (12/10/2026), hechos con geometría propia (sin modelos externos):
// maquinaria, vehículos, infraestructura y señalamiento. Script clásico: window.PropsZona.crear(W, tipo, x, z, ry, opc) → Group.
// Las señales usan los pictogramas de motor/senales.js (NOM-026-STPS-2008 / NOM-003-SEGOB-2011).
(function () {
function crear(W, tipo, x, z, ry = 0, o = {}) {
  const { THREE, scene, M } = W, g = new THREE.Group(); g.position.set(x, o.y || 0, z); g.rotation.y = ry; scene.add(g);
  const B = (w, h, d, c, px, py, pz, mx) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mx ? new THREE.MeshStandardMaterial({ color: c, roughness: .8, ...mx }) : M(c)); m.position.set(px, py, pz); g.add(m); return m; };
  const C = (r, h, c, px, py, pz, rot, mx) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 20), mx ? new THREE.MeshStandardMaterial({ color: c, roughness: .7, ...mx }) : M(c)); m.position.set(px, py, pz); if (rot) m.rotation.set(...rot); g.add(m); return m; };
  const S = (r, c, px, py, pz) => { const m = new THREE.Mesh(new THREE.SphereGeometry(r, 16, 12), M(c)); m.position.set(px, py, pz); m.userData.sinCara = true; g.add(m); return m; };
  const rueda = (px, py, pz, r = 0.45, w = 0.35) => { C(r, w, 0x222222, px, py, pz, [0, 0, Math.PI / 2]); C(r * 0.5, w + 0.02, 0x9E9E9E, px, py, pz, [0, 0, Math.PI / 2]); };
  const cartel = (texto, w, h, fondo, color, px, py, pz) => { const l = W.letrero(texto, w, h, fondo, color); l.position.set(px, py, pz); g.add(l); return l; };
  const L = o.largo || 10;
  const P = {
    banco() { const tonos = [0xB98C5C, 0xAE8052, 0xA27449]; for (let i = 0; i < 3; i++) B(30, 2.2, 3, tonos[i], 0, 1.1 + i * 2.2, -i * 3); B(30, 0.4, 0.6, 0xC9A877, 0, 0.2, 1.8); },
    camino() { const p = new THREE.Mesh(new THREE.PlaneGeometry(L, 4.5), M(0xD9C49A)); p.rotation.x = -Math.PI / 2; p.position.y = 0.01; g.add(p); },
    bordo() { B(L, 0.9, 0.9, 0xB89C70, 0, 0.45, 0); },
    camion() { const am = 0xF2B705; B(2.4, 1.6, 2.3, am, 2.4, 1.6, 0); B(1.6, 0.6, 2.0, 0x263238, 2.5, 2.1, 0); const caja = new THREE.Group(); caja.position.set(-0.6, 1.2, 0); g.add(caja);
      const cj = new THREE.Mesh(new THREE.BoxGeometry(4.2, 1.5, 2.6), M(o.volteo ? 0xC62828 : am)); cj.position.set(0, 0.75, 0); caja.add(cj); if (o.levantada) { caja.position.set(-2.6, 1.2, 0); caja.rotation.z = -0.55; cj.position.set(2, 0.75, 0); }
      B(6.6, 0.4, 1.2, 0x37474F, 0.3, 0.8, 0); [[2.6, 1], [-1.2, 1], [-2.5, 1]].forEach(([px]) => { rueda(px, 0.6, 1.2, 0.6, 0.45); rueda(px, 0.6, -1.2, 0.6, 0.45); });
      const faro = S(0.13, 0xFFA000, 2.4, 2.55, 0); faro.material = new THREE.MeshBasicMaterial({ color: 0xFFA000 }); g.userData.torreta = faro; },
    cargador() { B(3.2, 1.4, 2.0, 0xF2B705, 0, 1.3, 0); B(1.4, 1.2, 1.6, 0x263238, -0.4, 2.5, 0); const brazo = B(2.4, 0.25, 0.3, 0xF2B705, 2.0, 1.6, 0); brazo.rotation.z = -0.35;
      B(0.9, 1.0, 2.4, 0x616161, 3.3, 0.7, 0); [[1, 1], [-1, 1]].forEach(([px]) => { rueda(px, 0.7, 1.1, 0.75, 0.5); rueda(px, 0.7, -1.1, 0.75, 0.5); }); },
    pila() { const r = o.chica ? 1.2 : 2.6, m = new THREE.Mesh(new THREE.ConeGeometry(r, r * 0.9, 18), M(0x9C7A55, { flatShading: true })); m.position.y = r * 0.45; g.add(m); },
    tolva() { const t = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 0.6, 2.4, 4, 1, true), M(0x78909C, { side: THREE.DoubleSide })); t.position.y = 4; t.rotation.y = Math.PI / 4; g.add(t);
      [[-1.2, -1.2], [1.2, -1.2], [-1.2, 1.2], [1.2, 1.2]].forEach(([px, pz]) => C(0.12, 3, 0x546E7A, px, 1.5, pz)); },
    banda() { B(0.9, 0.12, L, 0x263238, 0, 1.0, 0); for (let i = -L / 2 + 0.5; i < L / 2; i += 1.5) { C(0.06, 1.0, 0x9E9E9E, 0, 0.95, i, [0, 0, Math.PI / 2]); B(0.08, 1.0, 0.08, 0x546E7A, 0.5, 0.5, i); B(0.08, 1.0, 0.08, 0x546E7A, -0.5, 0.5, i); } },
    roca() { const m = new THREE.Mesh(new THREE.DodecahedronGeometry(0.8), M(0x8D7B68, { flatShading: true })); m.position.y = 0.55; m.rotation.set(o.r || 0.3, 0.6, 0.2); g.add(m); },
    caseta() { B(4, 2.8, 3, 0xECEFF1, 0, 1.4, 0); B(4.4, 0.2, 3.4, 0x1F6FB2, 0, 2.9, 0); B(1, 2, 0.06, 0x546E7A, 0, 1, 1.52); B(1.2, 0.8, 0.06, 0xBFE3F2, 1.3, 1.7, 1.52); },
    extintor() { const t = o.tipo || 'pqs'; C(0.12, 0.62, t === 'k' ? 0xC9D1D6 : 0xC62828, 0, 0.31, 0); S(0.12, t === 'k' ? 0xC9D1D6 : 0xC62828, 0, 0.62, 0); C(0.03, 0.08, 0x37474F, 0, 0.78, 0); C(0.04, 1.6, 0x7B858D, 0.3, 0.8, 0); B(0.3, 0.3, 0.02, 0xC62828, 0.3, 1.5, 0.03);
      // etiqueta con agente y clase de fuego (NOM-002-STPS-2010, 7.2 l) 2) y 4)): se distingue cada tipo de extintor
      const et = { pqs: 'PQS · ABC', co2: 'CO₂ · BC', agua: 'AGUA · A', k: 'QUÍM. HÚMEDO · K' }[t]; cartel(et, 0.22, 0.09, '#FFFFFF', '#B71C1C', 0, 0.36, 0.125); g.userData.nombre = 'Extintor ' + et; },
    letrero() { C(0.05, 1.6, 0x7B858D, -0.9, 0.8, -0.03); C(0.05, 1.6, 0x7B858D, 0.9, 0.8, -0.03); cartel(o.texto || '', 2.2, 0.5, o.fondo || '#fff', o.color || '#111', 0, 1.75, 0); B(2.26, 0.56, 0.04, 0x5D666E, 0, 1.75, -0.03); },
    bitacora() { B(1.4, 1.0, 0.06, 0x8D6E63, 0, 1.4, 0); cartel(o.texto || 'BITÁCORA', 1.3, 0.24, '#FFFFFF', '#1B5E20', 0, 1.45, 0.04); C(0.04, 1.0, 0x6D4C41, 0, 0.5, -0.05); },
    senal() { if (!window.Senales) return; const cv = Senales.canvas(o.senal || 'prec_general', 256), tx = new THREE.CanvasTexture(cv); tx.colorSpace = THREE.SRGBColorSpace;
      C(0.04, 2.0, 0x7B858D, 0, 1.0, -0.03); const p = new THREE.Mesh(new THREE.PlaneGeometry(0.62, 0.62), new THREE.MeshBasicMaterial({ map: tx, transparent: true, side: THREE.DoubleSide })); p.position.set(0, 2.3, 0); g.add(p);
      const info = (Senales.LISTA || []).find(s => s.id === o.senal); if (info) cartel(info.nombre.toUpperCase(), 1.1, 0.16, '#FFFFFF', '#111', 0, 1.88, 0.01); },
    senal_obra() { C(0.05, 2.2, 0x7B858D, 0, 1.1, -0.03); const p = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 1.0), M(0xF57C00, { emissive: 0x331800 })); p.position.set(0, 2.5, 0); p.rotation.z = Math.PI / 4; g.add(p); cartel(o.texto || 'OBRA', 1.6, 0.3, '#F57C00', '#111', 0, 1.6, 0.02); },
    galeria() { const roca = { roughness: 1, flatShading: true };   // galería a lo largo de x: muros, techo y marcos de madera (ademe)
      B(L, 3.6, 0.5, 0x5D4E42, 0, 1.8, -2.9, roca); B(L, 0.9, 0.5, 0x5D4E42, 0, 0.45, 2.9, roca);   // vista en corte: muro del fondo completo y el del frente bajo (se ve el interior)
      for (let k = -L / 2 + 1; k <= L / 2 - 1; k += 3) { B(0.25, 3.3, 0.25, 0x6D4C41, k, 1.65, 2.5); B(0.25, 3.3, 0.25, 0x6D4C41, k, 1.65, -2.5); B(0.3, 0.3, 5.3, 0x6D4C41, k, 3.35, 0); }
      for (let k = -L / 2 + 2; k < L / 2; k += 4) { const l = new THREE.PointLight(0xFFE0B2, 0.7, 8); l.position.set(k, 3.0, 0); g.add(l); S(0.1, 0xFFF3E0, k, 3.2, 0); } },
    via() { B(L, 0.12, 2.0, 0x8D8173, 0, 0.06, 0); for (let i = -L / 2; i <= L / 2; i += 0.7) B(0.22, 0.1, 1.9, 0x5D4037, i, 0.15, 0); [-0.72, 0.72].forEach(pz => B(L, 0.12, 0.08, 0x9E9E9E, 0, 0.26, pz, { metalness: .7, roughness: .35 })); },
    vagon() { if (o.tanque) { C(1.1, 6, 0xECEFF1, 0, 1.75, 0, [0, 0, Math.PI / 2]); cartel('1203', 0.5, 0.25, '#F57C00', '#111', 0, 1.75, 1.12); } else B(6, 2.0, 2.4, 0x6D4C41, 0, 1.6, 0);
      B(6.2, 0.3, 1.6, 0x37474F, 0, 0.55, 0); [-2.2, 2.2].forEach(px => { rueda(px, 0.4, 0.7, 0.38, 0.12); rueda(px, 0.4, -0.7, 0.38, 0.12); }); },
    locomotora() { B(7, 2.4, 2.6, 0x154F90, 0, 1.8, 0); B(2, 1, 2.4, 0xF2C230, 2.6, 3.4, 0); B(7.2, 0.3, 1.8, 0x263238, 0, 0.55, 0); [-2.6, -1, 1, 2.6].forEach(px => { rueda(px, 0.45, 0.75, 0.42, 0.12); rueda(px, 0.45, -0.75, 0.42, 0.12); }); },
    ducto() { C(0.35, L, 0xF2C230, 0, 2.6, 0, [0, 0, Math.PI / 2]); },
    ducto_roto() { C(0.35, 2.5, 0xF2C230, 1.4, 2.6, 0, [0, 0, Math.PI / 2]); const c = C(0.35, 1.2, 0xF2C230, -0.6, 1.6, 0.4, [0.3, 0, 1.0]); c.rotation.z = 1.2; },
    refugio() { B(3, 2.6, 0.3, 0x546E7A, 0, 1.3, 0); B(1.1, 2.0, 0.08, 0x2E7D32, 0, 1.0, 0.2); cartel('REFUGIO', 1.2, 0.3, '#2E7D32', '#fff', 0, 2.3, 0.2); },
    tablero_acceso() { B(1.6, 1.2, 0.1, 0x37474F, 0, 1.5, 0); cartel('CONTROL DE ACCESO · TURNO', 1.5, 0.22, '#0E3A6B', '#fff', 0, 1.9, 0.06); for (let i = 0; i < 8; i++) B(0.12, 0.16, 0.04, i === 5 ? 0x9E9E9E : 0xF2C230, -0.6 + i * 0.17, 1.4, 0.07); C(0.05, 1.0, 0x546E7A, 0, 0.5, -0.05); },
    zanja() { const w = o.ancho || 1.6, h = 1.8; const fondo = new THREE.Mesh(new THREE.PlaneGeometry(L, w), M(0x5B4636)); fondo.rotation.x = -Math.PI / 2; fondo.position.y = -h; g.add(fondo);
      [-1, 1].forEach(s => { const p = new THREE.Mesh(new THREE.PlaneGeometry(L, h), M(0x6E5240, { side: THREE.DoubleSide })); p.position.set(0, -h / 2, s * w / 2); g.add(p); });
      [-1, 1].forEach(s => { const p = new THREE.Mesh(new THREE.PlaneGeometry(w, h), M(0x6E5240, { side: THREE.DoubleSide })); p.rotation.y = Math.PI / 2; p.position.set(s * L / 2, -h / 2, 0); g.add(p); });
      const boca = new THREE.Mesh(new THREE.PlaneGeometry(L, w), new THREE.MeshBasicMaterial({ color: 0x2B2018 })); boca.rotation.x = -Math.PI / 2; boca.position.y = 0.012; boca.userData.boca = true; g.add(boca); },
    barandal() { for (let i = -L / 2; i <= L / 2; i += 2) B(0.06, 0.9, 0.06, 0xF2C230, i, 0.45, 0); B(L, 0.06, 0.06, 0xF2C230, 0, 0.9, 0); B(L, 0.05, 0.05, 0xF2C230, 0, 0.5, 0); },
    excavadora() { B(2.6, 0.7, 2.4, 0x37474F, 0, 0.35, 0); B(2.6, 1.2, 2.2, 0xF2B705, 0, 1.3, 0); B(1.2, 1.2, 1.2, 0x263238, -0.5, 2.4, 0.4);
      const b1 = B(3.0, 0.3, 0.3, 0xF2B705, 2.3, 2.3, 0); b1.rotation.z = 0.5; const b2 = B(2.2, 0.25, 0.25, 0xF2B705, 3.9, 1.6, 0); b2.rotation.z = -0.9; B(0.8, 0.6, 0.9, 0x616161, 4.4, 0.6, 0); },
    conos() { const n = o.n || 6; for (let i = 0; i < n; i++) { const px = -L / 2 + i * L / Math.max(1, n - 1); const c = new THREE.Mesh(new THREE.ConeGeometry(0.17, 0.7, 14), M(0xF57C00)); c.position.set(px, 0.38, 0); g.add(c);
      const f = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.1, 14), M(0xFFFFFF, { emissive: 0x333333 })); f.position.set(px, 0.42, 0); g.add(f); B(0.35, 0.04, 0.35, 0x212121, px, 0.02, 0); } },
    escalera() { [-0.25, 0.25].forEach(pz => { const r = B(0.06, 3.0, 0.06, 0xB0BEC5, 0, -0.3, pz); r.rotation.z = 0.25; }); for (let i = 0; i < 6; i++) { const p = B(0.05, 0.05, 0.5, 0xB0BEC5, -0.38 + i * 0.13, -1.6 + i * 0.45, 0); } },
    nave() { [[-6, -4], [6, -4], [-6, 4], [6, 4]].forEach(([px, pz]) => B(0.3, 4.4, 0.3, 0x5A3E26, px, 2.2, pz)); const t = B(13, 0.25, 9, 0x7A5A3A, 0, 4.5, 0); t.rotation.z = 0.05; },
    sierra() { B(3.2, 0.9, 1.2, 0x546E7A, 0, 0.45, 0); const d = C(0.55, 0.04, 0xCFD8DC, 0, 1.0, 0, [Math.PI / 2, 0, 0], { metalness: .8, roughness: .3 }); d.userData.disco = true; g.userData.disco = d; B(3.2, 0.06, 1.2, 0x8D6E63, 0, 0.93, 0); },
    troncos() { for (let f = 0; f < 3; f++) for (let i = 0; i < 4 - f; i++) C(0.3, 3.2, 0x8B5A2B, 0, 0.3 + f * 0.52, -0.9 + i * 0.62 + f * 0.31, [Math.PI / 2, 0, 0]).rotation.set(Math.PI / 2, 0, Math.PI / 2);
      if (!o.sinCunas) [-1.25, 1.25].forEach(pz => B(0.3, 0.35, 0.3, 0x5D4037, 0, 0.17, pz)); },
    tambo() { C(0.3, 0.9, 0x1565C0, 0, 0.45, 0); C(0.3, 0.9, 0xC62828, 0.75, 0.45, 0.1); B(0.4, 0.3, 0.2, 0xF57C00, -0.6, 0.15, 0.2); },
    paro() { B(0.25, 0.3, 0.15, 0xF2C230, 0, 1.1, 0); S(0.08, 0xC62828, 0, 1.15, 0.09); C(0.04, 1.0, 0x546E7A, 0, 0.5, 0); },
    botiquin() { B(0.5, 0.4, 0.15, 0xFFFFFF, 0, 1.4, 0); cartel('+', 0.22, 0.22, '#2E7D32', '#fff', 0, 1.4, 0.08); C(0.04, 1.3, 0x7B858D, 0, 0.65, -0.05); },
    cajas() { B(0.9, 0.7, 0.9, 0xA1887F, 0, 0.35, 0); B(0.8, 0.6, 0.8, 0x8D6E63, 0.1, 1.0, 0.05); B(0.9, 0.7, 0.9, 0xA1887F, 1.0, 0.35, 0.1); },
    paso() { for (let i = -2; i <= 2; i++) B(0.5, 0.02, 9, 0xFFFFFF, i * 0.9, 0.02, 0); },
    semaforo() { C(0.07, 3.2, 0x37474F, 0, 1.6, 0); B(0.4, 0.8, 0.3, 0x212121, 0, 3.0, 0); const l = S(0.12, 0xFF1744, 0, 3.15, 0.16); l.material = new THREE.MeshBasicMaterial({ color: 0xFF1744 }); g.userData.luz = l; B(0.5, 0.25, 0.25, 0x9E9E9E, 0, 2.5, 0); },
    tope() { B(0.6, 1.0, 2.2, 0xC62828, 0, 0.5, 0); B(0.62, 0.15, 2.22, 0xFFFFFF, 0, 0.75, 0); },
    surcos() { const p = new THREE.Mesh(new THREE.PlaneGeometry(24, 9), M(0x7A5A3A)); p.rotation.x = -Math.PI / 2; p.position.y = 0.01; g.add(p); for (let i = -11; i <= 11; i += 1.2) { B(0.5, 0.18, 8.6, 0x6B4E32, i, 0.09, 0); for (let k = -4; k <= 4; k += 1.4) { const m = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.5, 6), M(0x4F8A3A)); m.position.set(i, 0.4, k); g.add(m); } }
      [[-12.2, 0], [12.2, 0]].forEach(([px]) => { const c = cartel('ZONA TRATADA · NO ENTRAR', 2.4, 0.3, '#C62828', '#fff', px, 1.4, 4.6); }); },
    tractor() { B(2.4, 1.0, 1.2, 0x2E7D32, 0.4, 1.0, 0); B(1.0, 1.4, 1.2, 0x2E7D32, -0.9, 1.6, 0); [[1.4, 1.0], [-1.2, 1.0]].forEach(([px], i) => { rueda(px, i ? 0.85 : 0.5, 0.75, i ? 0.85 : 0.5, 0.4); rueda(px, i ? 0.85 : 0.5, -0.75, i ? 0.85 : 0.5, 0.4); });
      [-0.6, 0.6].forEach(pz => B(0.08, 1.6, 0.08, 0x212121, -1.3, 2.9, pz)); B(0.1, 0.08, 1.3, 0x212121, -1.3, 3.7, 0); B(1.3, 0.06, 1.3, 0x212121, -0.9, 3.72, 0);   // estructura antivuelco con techo
      C(0.06, 1.2, 0x9E9E9E, -2.2, 0.7, 0, [0, 0, Math.PI / 2]); B(0.8, 0.6, 1.8, 0x8D6E63, -3.1, 0.5, 0); },
    bodega() { B(5, 3, 4, 0xD7CCC8, 0, 1.5, 0); B(5.4, 0.2, 4.4, 0x8D6E63, 0, 3.1, 0); B(1.4, 2.2, 0.06, 0x5D4037, 0, 1.1, 2.03); cartel('AGROQUÍMICOS · ÁREA EXCLUSIVA', 2.6, 0.3, '#C62828', '#fff', 0, 2.6, 2.05); for (let i = 0; i < 4; i++) C(0.18, 0.5, 0x1565C0, -1.8 + i * 0.4, 0.25, 2.3); },
    lavado() { B(2.4, 0.9, 0.8, 0xB0BEC5, 0, 0.45, 0); C(0.04, 0.5, 0x9E9E9E, 0, 1.15, -0.3); cartel('LAVADO DE EPP Y EQUIPO', 2.2, 0.26, '#1565C0', '#fff', 0, 1.7, -0.3); },
    comedor() { B(3, 0.08, 1.2, 0x8D6E63, 0, 0.75, 0); [-1.3, 1.3].forEach(px => B(0.08, 0.75, 1.0, 0x6D4C41, px, 0.37, 0)); const t = new THREE.Mesh(new THREE.ConeGeometry(3, 1.2, 4), M(0x1565C0)); t.position.y = 3.0; t.rotation.y = Math.PI / 4; g.add(t); [[-2, -2], [2, -2], [-2, 2], [2, 2]].forEach(([px, pz]) => C(0.06, 2.6, 0x9E9E9E, px, 1.3, pz)); },
    dispensador() { C(0.15, 1.0, 0xECEFF1, 0, 0.5, 0); C(0.14, 0.4, 0x4FC3F7, 0, 1.2, 0); },
    agua() { const p = new THREE.Mesh(new THREE.PlaneGeometry(60, 12), new THREE.MeshStandardMaterial({ color: 0x2E6E9E, roughness: .15, metalness: .2, transparent: true, opacity: .92 })); p.rotation.x = -Math.PI / 2; p.position.y = -0.4; g.add(p);
      B(60, 1.2, 0.6, 0x9E9E9E, 0, -0.2, 5.7); },
    barco() { if (window.Barco) { const b = window.Barco.crear(THREE, { largo: o.largo || 26, M: (c, x) => x ? new THREE.MeshStandardMaterial({ color: c, roughness: .6, ...x }) : M(c) }); b.position.y = -0.35; g.add(b); g.userData.nombre = 'Buque de carga'; return; }
      B(22, 3, 5, 0x263238, 0, 0.6, 0); B(22, 0.5, 5.2, 0xC62828, 0, -0.7, 0); B(4, 4, 4, 0xECEFF1, 8, 3.8, 0); },
    grua() { [[-4, -4], [4, -4], [-4, 4], [4, 4]].forEach(([px, pz]) => B(0.5, 10, 0.5, 0xF2B705, px, 5, pz * 0.5)); B(9, 0.8, 1.2, 0xF2B705, 0, 10.2, 0); B(1.6, 1.4, 1.4, 0x263238, -2.4, 9.2, 0);
      const cab = new THREE.Group(); cab.position.set(0, 9.6, 0); g.add(cab); const cable = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 3.2, 6), M(0x212121)); cable.position.y = -1.6; cab.add(cable);
      const cont = new THREE.Mesh(new THREE.BoxGeometry(6, 2.4, 2.4), M(0x1565C0)); cont.position.y = -4.4; cab.add(cont); g.userData.carga = cab; },
    contenedores() { const n = o.n || 4, cols = [0xC62828, 0x1565C0, 0x2E7D32, 0xF57C00]; for (let i = 0; i < n; i++) for (let k = 0; k < 2; k++) B(6, 2.4, 2.4, cols[(i + k) % 4], 0, 1.2 + k * 2.45, i * 2.5 - (n - 1) * 1.25); },
    montacargas() { B(2.2, 1.0, 1.2, 0xF2C230, 0, 0.8, 0); B(0.9, 1.4, 1.1, 0x263238, -0.4, 1.9, 0); B(0.15, 3.2, 1.0, 0x616161, 1.2, 1.6, 0); B(1.2, 0.08, 0.15, 0x616161, 1.8, 0.2, 0.35); B(1.2, 0.08, 0.15, 0x616161, 1.8, 0.2, -0.35);
      rueda(0.8, 0.35, 0.6, 0.35, 0.25); rueda(0.8, 0.35, -0.6, 0.35, 0.25); rueda(-0.8, 0.35, 0.6, 0.35, 0.25); rueda(-0.8, 0.35, -0.6, 0.35, 0.25); },
    bolardos() { for (let i = -12; i <= 12; i += 4) C(0.25, 0.6, 0x212121, i, 0.3, 0); },
    espejo() { C(0.06, 2.6, 0x9E9E9E, 0, 1.3, 0); const e = new THREE.Mesh(new THREE.SphereGeometry(0.4, 18, 12, 0, Math.PI), new THREE.MeshStandardMaterial({ color: 0xDDE6EE, metalness: .9, roughness: .08 })); e.position.set(0, 2.6, 0.05); g.add(e); const r = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.05, 8, 24), M(0xF57C00)); r.position.set(0, 2.6, 0.05); g.add(r); },
    carretera() { const p = new THREE.Mesh(new THREE.PlaneGeometry(L, 7), M(0x3D4247)); p.rotation.x = -Math.PI / 2; p.position.y = 0.012; g.add(p); for (let i = -L / 2; i < L / 2; i += 4) B(2, 0.01, 0.15, 0xF2C94C, i, 0.02, 0); [-3.4, 3.4].forEach(pz => B(L, 0.01, 0.12, 0xFFFFFF, 0, 0.02, pz)); },
    mechero() { C(0.12, 0.25, 0x212121, 0, 0.12, 0); const f = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.35, 10), new THREE.MeshBasicMaterial({ color: 0xFF7043 })); f.position.y = 0.42; g.add(f); g.userData.flama = f; },
    destello() { C(0.04, 1.3, 0x212121, 0, 0.65, 0); const l = S(0.1, 0xFFB300, 0, 1.35, 0); l.material = new THREE.MeshBasicMaterial({ color: 0xFFB300 }); g.userData.destello = l; },
    marca() { },      // objeto invisible solo para ubicar un hallazgo sobre otro objeto
    senal_flotante() { cartel(o.texto || '!', 1.0, 0.25, '#C62828', '#fff', 0, 1.6, 0); },
  };
  (P[tipo] || P.marca)();
  return g;
}
window.PropsZona = { crear };
})();
