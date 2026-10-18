// Avatar personalizable del campus (script clásico). Lo usan el campus, el multijugador y la vista previa del editor.
//   Avatar.cargar() / Avatar.guardar(p)  → perfil en localStorage ('campus_perfil')
//   Avatar.construir(THREE, perfil)      → { grupo, animar(fase, andando) }
//   Avatar.editor(contenedor, alCambiar) → controles HTML (sexo, piel, cabello, ropa, accesorios)
(function () {
const K = 'campus_perfil';
const OPC = {
  sexo: [['m', 'Masculino'], ['f', 'Femenino']],
  piel: ['#F6D7C3', '#E9BC9A', '#D39F77', '#B07B53', '#8A5A3B', '#5C3A24'],
  cabello: ['#1E1A17', '#4B2E1E', '#8A5A2B', '#D9B26A', '#A0442A', '#BDBDBD'],
  superior: [['playera', 'Playera'], ['camisa', 'Camisa'], ['chamarra', 'Chamarra'], ['saco', 'Saco'], ['overol', 'Overol']],
  colores: ['#154F90', '#0E3A6B', '#3FA7C6', '#2E7D32', '#C62828', '#E07A1F', '#F2C230', '#6A3FA0', '#FFFFFF', '#5B6B7C', '#1B2633', '#8B6B4A'],
  zapatos: ['#1B2633', '#5A3A22', '#FFFFFF', '#8B6B4A', '#C62828'],
};
const BASE = { nombre: '', sexo: 'm', piel: OPC.piel[1], cabello: OPC.cabello[1], superior: 'playera', colorSup: '#154F90',
  pantalon: '#0E3A6B', zapatos: '#1B2633', lentes: false, gorra: false, colorGorra: '#C62828', casco: false };
function cargar() { try { return { ...BASE, ...JSON.parse(localStorage.getItem(K) || '{}') }; } catch (e) { return { ...BASE }; } }
function guardar(p) { try { localStorage.setItem(K, JSON.stringify(p)); } catch (e) { } }
function limpiar(p) {   // solo campos conocidos (para multijugador)
  const q = { ...BASE }; Object.keys(BASE).forEach(k => { if (p && typeof p[k] === typeof BASE[k]) q[k] = p[k]; });
  q.nombre = String(q.nombre).slice(0, 30); return q;
}

function construir(THREE, perfil) {
  // Figura detallada (14/10/2026): cabeza con ojos (esclerótica, iris, pupila y brillo), cejas, nariz, boca y orejas;
  // fleco y cabello con volumen; cuello, hombros redondeados, torso aplanado; codos y rodillas articulados; manos con
  // pulgar; zapatos con suela; cinturón, cuello de la prenda, botones y bolsas. Todo procedural (sin archivos externos).
  const p = limpiar(perfil); const g = new THREE.Group();
  const mats = {}; const M = (c, r = 0.75) => { const k = c + '|' + r; return mats[k] || (mats[k] = new THREE.MeshStandardMaterial({ color: c, roughness: r, metalness: 0.02 })); };
  const mk = (geo, c, x, y, z, padre = g, r) => { const m = new THREE.Mesh(geo, M(c, r)); m.position.set(x, y, z); padre.add(m); return m; };
  const osc = (c, k = 0.72) => '#' + new THREE.Color(c).multiplyScalar(k).getHexString();
  const cl = (c, k = 0.35) => '#' + new THREE.Color(c).lerp(new THREE.Color('#ffffff'), k).getHexString();
  const f = p.sexo === 'f', hombro = f ? 0.29 : 0.33, sup = p.superior, overol = sup === 'overol';
  const cSup = p.colorSup, cPant = overol ? p.colorSup : p.pantalon, cBajo = overol ? '#E8F0F5' : cSup, piel = p.piel;
  const cap = (r, l) => new THREE.CapsuleGeometry(r, l, 8, 16);
  // ---- torso (aplanado de frente a espalda), hombros y cadera
  const torso = mk(cap(f ? 0.235 : 0.265, 0.4), cBajo, 0, 1.06, 0); torso.scale.set(1, 1, f ? 0.74 : 0.7);
  [-1, 1].forEach(sx => mk(new THREE.SphereGeometry(0.105, 16, 12), cBajo, sx * (hombro - 0.02), 1.32, 0).scale.set(1, 0.85, 0.9));
  const cadera = mk(new THREE.CylinderGeometry(f ? 0.215 : 0.2, f ? 0.22 : 0.2, 0.2, 20), cPant, 0, 0.75, 0); cadera.scale.z = 0.72;
  const zf = (f ? 0.235 : 0.265) * (f ? 0.74 : 0.7);   // frente del torso
  if (!overol) { mk(new THREE.CylinderGeometry(0.205, 0.205, 0.05, 24), '#2A2522', 0, 0.85, 0, g, 0.5).scale.z = 0.74;   // cinturón y hebilla
    mk(new THREE.BoxGeometry(0.07, 0.045, 0.02), '#C9A227', 0, 0.85, 0.155, g, 0.3); }
  // prenda superior
  if (sup === 'playera') mk(new THREE.TorusGeometry(0.095, 0.02, 8, 20), osc(cSup), 0, 1.4, 0.0).rotation.x = Math.PI / 2;
  if (sup === 'camisa') { mk(new THREE.BoxGeometry(0.03, 0.5, 0.01), cl(cSup, 0.2), 0, 1.1, zf + 0.005);
    [1.3, 1.18, 1.06, 0.94].forEach(y => mk(new THREE.SphereGeometry(0.012, 8, 6), '#F5F5F5', 0, y, zf + 0.012));
    [-1, 1].forEach(sx => { const c = mk(new THREE.BoxGeometry(0.11, 0.07, 0.02), '#FFFFFF', sx * 0.06, 1.42, 0.09); c.rotation.set(-0.4, 0, sx * 0.5); });
    mk(new THREE.BoxGeometry(0.1, 0.11, 0.012), osc(cSup, 0.85), -0.11, 1.2, zf + 0.004); }
  if (sup === 'chamarra') { mk(new THREE.BoxGeometry(0.02, 0.58, 0.012), '#C7CDD3', 0, 1.06, zf + 0.006, g, 0.3);
    mk(new THREE.CylinderGeometry(0.13, 0.17, 0.1, 20), cSup, 0, 1.42, 0);
    [-1, 1].forEach(sx => mk(new THREE.BoxGeometry(0.12, 0.012, 0.012), osc(cSup), sx * 0.12, 0.95, zf - 0.005)); }
  if (sup === 'saco') { const v = mk(new THREE.ConeGeometry(0.12, 0.32, 3), '#FFFFFF', 0, 1.25, zf - 0.03); v.rotation.x = Math.PI; v.scale.z = 0.25;
    mk(new THREE.BoxGeometry(0.05, 0.28, 0.012), '#7A1E1E', 0, 1.18, zf + 0.008); mk(new THREE.BoxGeometry(0.06, 0.04, 0.02), '#7A1E1E', 0, 1.34, zf + 0.005);
    [-1, 1].forEach(sx => { const l = mk(new THREE.BoxGeometry(0.06, 0.3, 0.015), osc(cSup), sx * 0.085, 1.22, zf + 0.004); l.rotation.z = sx * 0.32; });
    [1.0, 0.92].forEach(y => mk(new THREE.SphereGeometry(0.013, 8, 6), '#1B1B1B', 0.03, y, zf + 0.01)); }
  if (overol) { mk(new THREE.BoxGeometry(0.42, 0.34, 0.06), cSup, 0, 1.0, zf - 0.015);   // peto
    [-0.12, 0.12].forEach(x => { mk(new THREE.BoxGeometry(0.06, 0.42, 0.03), cSup, x, 1.3, zf - 0.01); mk(new THREE.SphereGeometry(0.018, 8, 6), '#C9A227', x, 1.15, zf + 0.02, g, 0.3); });
    mk(new THREE.BoxGeometry(0.16, 0.12, 0.012), osc(cSup, 0.85), 0, 1.03, zf + 0.02); }
  // ---- cuello y cabeza
  mk(new THREE.CylinderGeometry(0.075, 0.085, 0.14, 14), piel, 0, 1.47, 0);
  const H = new THREE.Group(); H.position.set(0, 1.71, 0); g.add(H); g.userData.cabeza = H;
  mk(new THREE.SphereGeometry(0.23, 32, 24), piel, 0, 0, 0, H).scale.set(0.95, 1.07, 1);
  mk(new THREE.SphereGeometry(0.15, 20, 14), piel, 0, -0.1, 0.06, H).scale.set(1, 0.8, 0.9);   // mandíbula
  [-1, 1].forEach(sx => { const x = sx * 0.078;
    mk(new THREE.SphereGeometry(0.04, 16, 12), '#FFFFFF', x, 0.02, 0.185, H, 0.3).scale.set(1, 0.85, 0.55);   // ojo
    mk(new THREE.SphereGeometry(0.024, 14, 10), '#4A2F1D', x, 0.02, 0.2, H, 0.3).scale.z = 0.5;               // iris
    mk(new THREE.SphereGeometry(0.012, 10, 8), '#0B0B0B', x, 0.02, 0.208, H, 0.2).scale.z = 0.5;              // pupila
    mk(new THREE.SphereGeometry(0.006, 6, 6), '#FFFFFF', x + 0.008, 0.03, 0.214, H, 0.1);                   // brillo
    mk(new THREE.BoxGeometry(0.075, 0.016, 0.016), osc(p.cabello, 0.9), x, 0.085, 0.2, H).rotation.z = -sx * 0.14;   // ceja
    mk(new THREE.SphereGeometry(0.045, 12, 10), piel, sx * 0.22, 0, 0, H).scale.set(0.45, 1, 0.75);          // oreja
    if (f) mk(new THREE.SphereGeometry(0.03, 10, 8), '#E89A8C', sx * 0.12, -0.06, 0.17, H, 0.9).scale.set(1, 0.6, 0.4); });   // mejillas
  mk(new THREE.SphereGeometry(0.03, 12, 10), osc(piel, 0.95), 0, -0.03, 0.22, H).scale.set(0.8, 1.15, 1);   // nariz
  const boca = mk(new THREE.TorusGeometry(0.04, 0.009, 6, 16, Math.PI), f ? '#B5483E' : '#9A4B3C', 0, -0.095, 0.19, H, 0.5); boca.rotation.z = Math.PI;
  // cabello
  const sinTapa = !p.casco && !p.gorra, cc = p.cabello;
  if (sinTapa) { mk(new THREE.SphereGeometry(0.245, 28, 16, 0, Math.PI * 2, 0, Math.PI * 0.48), cc, 0, 0.03, -0.015, H, 0.85).scale.set(1, 1.05, 1.03);
    const fl = mk(cap(0.045, 0.2), cc, 0.02, 0.17, 0.16, H, 0.85); fl.rotation.set(0.5, 0, Math.PI / 2 + 0.15); }   // fleco
  mk(new THREE.SphereGeometry(0.24, 24, 12, Math.PI * 0.92, Math.PI * 1.16, Math.PI * 0.3, Math.PI * 0.34), cc, 0, 0, -0.01, H, 0.85).scale.set(1.02, 1.04, 1.04);   // nuca y patillas
  if (f) { mk(cap(0.16, 0.32), cc, 0, -0.2, -0.13, H, 0.85).scale.set(1.1, 1, 0.75);   // cabello largo
    [-1, 1].forEach(sx => mk(cap(0.05, 0.22), cc, sx * 0.2, -0.12, 0.02, H, 0.85));
    if (sinTapa) mk(new THREE.SphereGeometry(0.1, 14, 10), cc, 0, 0.12, -0.2, H, 0.85); }
  if (p.lentes) { [-1, 1].forEach(sx => mk(new THREE.TorusGeometry(0.052, 0.01, 8, 20), '#111111', sx * 0.08, 0.02, 0.222, H, 0.3));
    mk(new THREE.BoxGeometry(0.05, 0.01, 0.01), '#111111', 0, 0.025, 0.228, H); [-1, 1].forEach(sx => mk(new THREE.BoxGeometry(0.01, 0.01, 0.2), '#111111', sx * 0.2, 0.03, 0.12, H)); }
  if (p.gorra && !p.casco) { mk(new THREE.SphereGeometry(0.255, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), p.colorGorra, 0, 0.04, 0, H, 0.8);
    const v = mk(new THREE.CylinderGeometry(0.16, 0.16, 0.02, 20, 1, false, -Math.PI / 2, Math.PI), osc(p.colorGorra, 0.85), 0, 0.05, 0.2, H); v.scale.z = 0.9;
    mk(new THREE.SphereGeometry(0.02, 8, 6), p.colorGorra, 0, 0.29, 0, H); }
  if (p.casco) { mk(new THREE.SphereGeometry(0.275, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), '#F2C230', 0, 0.05, 0, H, 0.4);
    mk(new THREE.CylinderGeometry(0.33, 0.33, 0.022, 28), '#F2C230', 0, 0.06, 0.02, H, 0.4); mk(new THREE.BoxGeometry(0.04, 0.05, 0.5), '#E2B21E', 0, 0.3, 0, H, 0.4); }
  g.userData.pecho = new THREE.Vector3(0, 1.12, zf + 0.01);
  // ---- brazos (hombro → codo → mano) y piernas (cadera → rodilla → pie)
  const corta = sup === 'playera' || overol;
  function brazo(sx) { const piv = new THREE.Group(); piv.position.set(sx * hombro, 1.33, 0); g.add(piv);
    mk(cap(0.075, 0.2), cBajo, 0, -0.15, 0, piv);
    const codo = new THREE.Group(); codo.position.y = -0.31; piv.add(codo);
    mk(cap(0.065, 0.17), corta ? piel : cBajo, 0, -0.12, 0, codo);
    if (!corta) mk(new THREE.CylinderGeometry(0.07, 0.07, 0.04, 14), osc(cBajo), 0, -0.22, 0, codo);   // puño
    const mano = mk(cap(0.05, 0.05), piel, 0, -0.3, 0.01, codo); mano.scale.set(1, 1, 0.62);
    mk(cap(0.018, 0.04), piel, -sx * 0.045, -0.28, 0.035, codo).rotation.z = -sx * 0.5;   // pulgar
    piv.userData.codo = codo; return piv; }
  function pierna(sx) { const piv = new THREE.Group(); piv.position.set(sx * 0.11, 0.66, 0); g.add(piv);
    mk(cap(0.098, 0.2), cPant, 0, -0.15, 0, piv);
    const rod = new THREE.Group(); rod.position.y = -0.32; piv.add(rod);
    mk(cap(0.082, 0.18), cPant, 0, -0.13, 0, rod);
    const pie = new THREE.Group(); pie.position.y = -0.29; rod.add(pie);
    const z = mk(cap(0.068, 0.13), p.zapatos, 0, 0.0, 0.05, pie, 0.55); z.rotation.x = Math.PI / 2; z.scale.set(1.15, 1, 0.78);
    mk(new THREE.BoxGeometry(0.15, 0.025, 0.29), p.zapatos === '#FFFFFF' ? '#9AA5AE' : '#EDEDED', 0, -0.045, 0.05, pie, 0.9);
    piv.userData.rod = rod; return piv; }
  const bI = brazo(-1), bD = brazo(1), pI = pierna(-1), pD = pierna(1);
  const eI = bI.userData.codo, eD = bD.userData.codo, kI = pI.userData.rod, kD = pD.userData.rod;
  // pose: undefined (de pie/caminando) · 'sentado' (rodillas dobladas; quien llama baja el grupo con ALTO_SENTADO) · 'mirando' (manos atrás)
  function animar(fase, andando, pose) {
    if (pose === 'sentado') { pI.rotation.x = pD.rotation.x = -Math.PI / 2; kI.rotation.x = kD.rotation.x = 1.35; bI.rotation.x = bD.rotation.x = -0.35; eI.rotation.x = eD.rotation.x = -0.6; torso.position.y = 1.06; return; }
    if (pose === 'mirando') { pI.rotation.x = pD.rotation.x = kI.rotation.x = kD.rotation.x = 0; bI.rotation.x = bD.rotation.x = 0.3; eI.rotation.x = eD.rotation.x = -0.25; torso.position.y = 1.06; return; }
    const s = andando ? Math.sin(fase) * 0.55 : 0;
    bI.rotation.x = s; bD.rotation.x = -s; pI.rotation.x = -s; pD.rotation.x = s;
    eI.rotation.x = -0.18 - (andando ? Math.max(0, -Math.sin(fase)) * 0.5 : 0); eD.rotation.x = -0.18 - (andando ? Math.max(0, Math.sin(fase)) * 0.5 : 0);
    kI.rotation.x = andando ? 0.1 + Math.max(0, Math.sin(fase + 1.3)) * 0.75 : 0.03; kD.rotation.x = andando ? 0.1 + Math.max(0, Math.sin(fase + 1.3 + Math.PI)) * 0.75 : 0.03;
    bI.rotation.z = -0.06; bD.rotation.z = 0.06;
    torso.position.y = 1.06 + (andando ? Math.abs(Math.sin(fase)) * 0.03 : Math.sin(performance.now() / 900) * 0.004);
    H.rotation.y = andando ? Math.sin(fase) * 0.05 : 0; }
  return { grupo: g, animar };
}
// Editor HTML. alCambiar(perfil) se llama en cada cambio.
function editor(cont, alCambiar) {
  let p = cargar();
  const sw = (lista, campo) => `<div class="sw">${lista.map(c => `<button type="button" data-c="${campo}" data-v="${c}" style="background:${c}" title="${c}"></button>`).join('')}</div>`;
  const op = (lista, campo) => `<div class="ops">${lista.map(([v, t]) => `<button type="button" data-c="${campo}" data-v="${v}">${t}</button>`).join('')}</div>`;
  const chk = (campo, t) => `<label class="chk"><input type="checkbox" data-c="${campo}"> ${t}</label>`;
  cont.innerHTML = `<label class="lbl">Tu nombre (así te verán los demás)</label><input type="text" id="avNombre" maxlength="30" placeholder="Escribe tu nombre" autocomplete="off">
   <label class="lbl">Avatar</label>${op(OPC.sexo, 'sexo')}
   <label class="lbl">Tono de piel</label>${sw(OPC.piel, 'piel')}
   <label class="lbl">Cabello</label>${sw(OPC.cabello, 'cabello')}
   <label class="lbl">Prenda superior</label>${op(OPC.superior, 'superior')}${sw(OPC.colores, 'colorSup')}
   <label class="lbl">Pantalón</label>${sw(OPC.colores, 'pantalon')}
   <label class="lbl">Zapatos</label>${sw(OPC.zapatos, 'zapatos')}
   <label class="lbl">Accesorios</label><div class="ops">${chk('lentes', '👓 Lentes')}${chk('gorra', '🧢 Gorra')}${chk('casco', '⛑️ Casco')}</div>${sw(OPC.colores, 'colorGorra')}`;
  const pintar = () => { cont.querySelectorAll('button[data-c]').forEach(b => b.classList.toggle('sel', String(p[b.dataset.c]) === b.dataset.v));
    cont.querySelectorAll('input[type=checkbox]').forEach(i => i.checked = !!p[i.dataset.c]); cont.querySelector('#avNombre').value = p.nombre; };
  cont.querySelectorAll('button[data-c]').forEach(b => b.onclick = () => { p[b.dataset.c] = b.dataset.v; if (b.dataset.c === 'colorGorra') p.gorra = true; pintar(); guardar(p); alCambiar && alCambiar(p); });
  cont.querySelectorAll('input[type=checkbox]').forEach(i => i.onchange = () => { p[i.dataset.c] = i.checked; if (i.dataset.c === 'casco' && i.checked) p.gorra = false; if (i.dataset.c === 'gorra' && i.checked) p.casco = false; pintar(); guardar(p); alCambiar && alCambiar(p); });
  cont.querySelector('#avNombre').oninput = e => { p.nombre = e.target.value.slice(0, 30); guardar(p); alCambiar && alCambiar(p, true); };
  pintar(); return { perfil: () => p };
}
const CSS = `.lbl{display:block;font-weight:800;color:#0E3A6B;margin:10px 0 4px;font-size:.92rem}
.sw{display:flex;flex-wrap:wrap;gap:6px}.sw button{width:30px;height:30px;border-radius:50%;border:2px solid #cfd8e0;cursor:pointer;padding:0}
.sw button.sel{outline:3px solid #154F90;outline-offset:2px}
.ops{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:6px}.ops button,.chk{background:#E8F5F9;color:#0E3A6B;border:2px solid transparent;border-radius:10px;padding:7px 11px;font-weight:700;cursor:pointer;font-size:.92rem}
.ops button.sel{border-color:#154F90;background:#D7ECF4}.chk input{transform:scale(1.2);margin-right:4px}`;
// Sentado: la cadera (pivote de piernas a 0.66 m) debe quedar a la altura del asiento → grupo.y = asiento - 0.66 + 0.1
const ALTO_SENTADO = asiento => asiento - 0.56;
window.Avatar = { OPC, BASE, cargar, guardar, limpiar, construir, editor, CSS, ALTO_SENTADO };
})();
