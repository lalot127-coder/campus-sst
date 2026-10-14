// Buque de carga genérico (14/10/2026), geometría propia sin modelos externos: casco con proa en punta, línea de flotación roja,
// cubierta, contenedores estibados, puente de mando con ventanas, chimenea y mástil. Script clásico: window.Barco.crear(THREE, o)
//   o = { largo: 30, M: (color, extra) => material }  → THREE.Group (eje largo en x; la proa apunta a +x; el agua en y = 0)
(function () {
function crear(THREE, o = {}) {
  const L = o.largo || 30, B = L * 0.2, g = new THREE.Group();
  const M = o.M || ((c, x) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.6, metalness: 0.1, ...(x || {}) }));
  const forma = (esc = 1) => { const s = new THREE.Shape(), l = L * esc, b = B * esc; s.moveTo(-l / 2, -b / 2); s.lineTo(l / 2 - b * 0.9, -b / 2); s.quadraticCurveTo(l / 2 - b * 0.2, -b * 0.42, l / 2, 0);
    s.quadraticCurveTo(l / 2 - b * 0.2, b * 0.42, l / 2 - b * 0.9, b / 2); s.lineTo(-l / 2, b / 2); s.lineTo(-l / 2, -b / 2); return s; };
  const casco = (y0, alto, color, esc = 1, x) => { const m = new THREE.Mesh(new THREE.ExtrudeGeometry(forma(esc), { depth: alto, bevelEnabled: false }), M(color, x)); m.rotation.x = -Math.PI / 2; m.position.y = y0; g.add(m); return m; };
  const caja = (w, h, d, c, x, y, z, mx) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), M(c, mx)); m.position.set(x, y, z); g.add(m); return m; };
  const H = L * 0.11;
  casco(-H * 0.45, H * 0.45, 0xB71C1C);                 // obra viva (roja, bajo la línea de flotación)
  casco(0, H, 0x1F2A33);                                 // casco
  casco(H - 0.12, 0.12, 0xF5F5F5, 1.002);                // franja blanca de la borda
  casco(H, 0.06, 0x7B858D, 0.97);                        // cubierta
  // contenedores en la cubierta (bloques de 3 × 2 × 2)
  const cols = [0xC62828, 0x1565C0, 0x2E7D32, 0xF57C00, 0x6D4C41, 0x00838F], cw = L * 0.085, ch = H * 0.32, cb = B * 0.27;
  let k = 0; for (let x = -L * 0.22; x < L * 0.3; x += cw * 1.05) for (let z of [-cb, 0, cb]) for (let y = 0; y < 2; y++) caja(cw, ch, cb * 0.95, cols[(k++ * 7) % cols.length], x, H + ch / 2 + y * ch * 1.02, z);
  // puente de mando (popa) con ventanas, alerones, chimenea y mástil
  const px = -L * 0.38; caja(L * 0.12, H * 1.4, B * 0.8, 0xF5F5F5, px, H + H * 0.7, 0); caja(L * 0.12 + 0.02, H * 0.16, B * 0.82, 0x263238, px, H + H * 1.18, 0, { roughness: 0.2, metalness: 0.4 });
  caja(L * 0.05, 0.12, B * 1.05, 0xF5F5F5, px + L * 0.02, H + H * 1.4, 0);
  const ch2 = new THREE.Mesh(new THREE.CylinderGeometry(B * 0.11, B * 0.13, H * 0.9, 16), M(0x37474F)); ch2.position.set(px - L * 0.04, H + H * 1.85, 0); g.add(ch2);
  const banda = new THREE.Mesh(new THREE.CylinderGeometry(B * 0.115, B * 0.115, H * 0.18, 16), M(0xC62828)); banda.position.set(px - L * 0.04, H + H * 2.1, 0); g.add(banda);
  const mastil = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.07, H * 1.8, 8), M(0xECEFF1)); mastil.position.set(L * 0.4, H + H * 0.9, 0); g.add(mastil);
  g.userData.nombre = 'Buque de carga'; return g;
}
window.Barco = { crear };
})();
