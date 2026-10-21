// Solo se ofrece VR / realidad mixta en visores (Meta Quest, Pico…) y computadoras. En celulares Android el navegador
// dice "soporta VR" (modo Cardboard) y la pantalla se partía en dos sin ocupar todo el espacio (07/10/2026).
// Forzar en cualquier equipo: agregar ?xr=1 a la dirección.
window.CampusXR = window.CampusXR || (() => { const ua = navigator.userAgent || '';
  const visor = /OculusBrowser|Quest|Pico|Wolvic|Vive|SamsungBrowser\/.*VR/i.test(ua);
  const movil = !visor && (/Android|iPhone|iPad|iPod|Mobile/i.test(ua) || (navigator.maxTouchPoints > 1 && matchMedia('(pointer: coarse)').matches));
  // (18/10/2026) Al cambiar de página el visor sale de VR (así funciona WebXR). Si venías en VR, la página nueva muestra un
  // botón grande «Continuar en realidad virtual» (el navegador exige un toque para volver a entrar).
  const marca = () => { try { return sessionStorage.getItem('campus_vr') === '1'; } catch (e) { return false; } };
  const quitar = () => { try { sessionStorage.removeItem('campus_vr'); } catch (e) { } };
  function continuar(fn) { if (!marca() || document.getElementById('xrSeguir')) return;
    const d = document.createElement('div'); d.id = 'xrSeguir';
    d.style.cssText = 'position:fixed;inset:0;z-index:99;background:rgba(14,58,107,.88);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;font-family:Calibri,Arial,sans-serif';
    d.innerHTML = '<button style="font:900 2rem Arial,sans-serif;padding:26px 40px;border:0;border-radius:22px;background:#3FA7C6;color:#fff">🥽 Continuar en realidad virtual</button><button style="font:700 1.1rem Arial,sans-serif;padding:12px 22px;border:0;border-radius:14px;background:#E8F5F9;color:#0E3A6B">Seguir en pantalla</button>';
    const [si, no] = d.querySelectorAll('button'); si.onclick = () => { d.remove(); fn(); }; no.onclick = () => { quitar(); d.remove(); };
    document.body.appendChild(d); }
  return { visor, movil, permitir: visor || !movil || /[?&]xr=1/.test(location.search), continuar, quitarMarca: quitar }; })();
// Realidad virtual (WebXR) para el campus, los interiores y las salas de módulos (módulo ES). Probado para el navegador
// del Meta Quest 3S; en computadora/celular sin visor no aparece el botón.
// CONTROLES (revisión 18/10/2026, tras la prueba con el Quest 3S: "se queda atorado, no deja avanzar ni retroceder"):
//   - Joystick IZQUIERDO: caminar (adelante/atrás/lados) hacia donde miras, sin atravesar paredes (o.libre).
//   - Joystick DERECHO: izquierda/derecha = giro de 30°; hacia atrás = media vuelta.
//   - Gatillo apuntando al PISO = teletransporte · a puertas/sillas/señales = tocarlas (pellizco con las manos = gatillo).
//   - A o X = menú 3D (opciones que se eligen con el rayo) · B o Y = Atrás.  - Las ventanas HTML no se ven → panel 3D.
//   const xr = crearXR({ THREE, renderer, camera, controls, contenedor, escena: () => scene, objetivos: () => [...],
//                        alTocar: hit => {}, alTeletransportar: punto => {}, yo: () => avatar, alCambiar: activo => {},
//                        libre: (x, z) => bool, alBoton: 'menu' | 'atras' => {} })
//   xr.activo() · xr.panel(titulo, texto) · xr.menu(titulo, [[texto, fn], ...], pie) · xr.colocar(pos, ry) · xr.salir()
export function crearXR(o) {
  const { THREE, renderer, camera } = o; let sesion = null;
  const rig = new THREE.Group(); rig.name = 'rig_xr'; const ray = new THREE.Raycaster(), mtx = new THREE.Matrix4();
  renderer.xr.enabled = true; renderer.xr.setReferenceSpaceType('local-floor');
  const retic = new THREE.Mesh(new THREE.RingGeometry(.22, .3, 32), new THREE.MeshBasicMaterial({ color: 0x3FA7C6, transparent: true, opacity: .9 })); retic.rotation.x = -Math.PI / 2; retic.visible = false;
  const controles = [0, 1].map(i => { const c = renderer.xr.getController(i);
    const linea = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3(0, 0, -1)]), new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: .8 }));
    linea.scale.z = 6; c.add(linea); const punta = new THREE.Mesh(new THREE.SphereGeometry(.012, 8, 6), new THREE.MeshBasicMaterial({ color: 0x3FA7C6 })); c.add(punta);
    c.addEventListener('connected', e => { c.userData.fuente = e.data; }); c.addEventListener('disconnected', () => { c.userData.fuente = null; });
    c.addEventListener('select', () => { try { seleccionar(c); } catch (e) { console.error('XR select', e); } }); rig.add(c); return { c, linea }; });
  // ---------------- manos libres (20/10/2026): se dibujan las articulaciones (antes no se veían y parecía que no
  // funcionaban) y en la muñeca IZQUIERDA aparece un botón «☰ Menú»: apúntale con la otra mano y pellizca.
  const matMano = new THREE.MeshBasicMaterial({ color: 0xF2D2BD }), geoArt = new THREE.SphereGeometry(0.008, 8, 6);
  const manos = [0, 1].map(i => { const h = renderer.xr.getHand(i); rig.add(h);
    h.addEventListener('connected', e => { h.userData.fuente = e.data; }); h.addEventListener('disconnected', () => { h.userData.fuente = null; }); return h; });
  const cvM = document.createElement('canvas'); cvM.width = 256; cvM.height = 128; { const g = cvM.getContext('2d');
    g.fillStyle = '#3FA7C6'; g.beginPath(); g.roundRect(0, 0, 256, 128, 30); g.fill(); g.fillStyle = '#fff'; g.font = '900 52px Arial'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('☰ Menú', 128, 66); }
  const texM = new THREE.CanvasTexture(cvM); texM.colorSpace = THREE.SRGBColorSpace;
  const muneca = new THREE.Mesh(new THREE.PlaneGeometry(0.09, 0.045), new THREE.MeshBasicMaterial({ map: texM, side: THREE.DoubleSide, depthTest: false }));
  muneca.visible = false; muneca.renderOrder = 12;
  function manosCuadro() { let hay = false; const vTmp = new THREE.Vector3(), cam = new THREE.Vector3();
    manos.forEach(h => { const j = h.joints || {};
      for (const k in j) { const a = j[k]; if (!a.userData.bola) { a.userData.bola = new THREE.Mesh(geoArt, matMano); a.add(a.userData.bola); } }
      const w = j['wrist'], src = h.userData.fuente;
      if (w && w.visible && src && src.handedness === 'left') { hay = true; w.getWorldPosition(vTmp); camera.getWorldPosition(cam); muneca.position.copy(vTmp).add(new THREE.Vector3(0, 0.06, 0)); muneca.lookAt(cam); } });
    muneca.visible = hay && !panelMesh; }
  let panelMesh = null, menuOps = null;
  function lanzar(c) { mtx.identity().extractRotation(c.matrixWorld); ray.ray.origin.setFromMatrixPosition(c.matrixWorld); ray.ray.direction.set(0, 0, -1).applyMatrix4(mtx); ray.far = 60;
    if (!panelMesh && muneca.visible) { const hm = ray.intersectObject(muneca)[0]; if (hm) return hm; }
    const objs = panelMesh ? [panelMesh] : o.objetivos(); return ray.intersectObjects(objs, true)[0]; }
  function seleccionar(c) {
    if (!panelMesh && muneca.visible) { mtx.identity().extractRotation(c.matrixWorld); ray.ray.origin.setFromMatrixPosition(c.matrixWorld); ray.ray.direction.set(0, 0, -1).applyMatrix4(mtx);
      if (ray.intersectObject(muneca)[0]) { o.alBoton && o.alBoton('menu'); return; } }
    if (panelMesh) { const h = lanzar(c);
      if (menuOps && h && h.uv) { const fila = Math.floor((1 - h.uv.y) * menuOps.filas) - menuOps.cabecera; const op = menuOps.ops[fila];
        if (op) { cerrarPanel(); setTimeout(() => op[1](), 0); return; } }
      cerrarPanel(); return; }   // apuntar a cualquier lado y apretar el gatillo cierra el panel (antes había que atinarle)
    const h = lanzar(c); if (!h) return;
    if (h.object.userData.piso) { o.alTeletransportar(h.point.clone().setY(0)); return; } o.alTocar(h); }
  // coloca al usuario en pos: compensa que el casco no está en el centro del rig (si no, quedaba desfasado y "atorado")
  function colocar(pos, ry) { if (ry !== undefined) rig.rotation.y = ry;
    const off = renderer.xr.isPresenting ? new THREE.Vector3(camera.position.x, 0, camera.position.z).applyAxisAngle(new THREE.Vector3(0, 1, 0), rig.rotation.y) : new THREE.Vector3();
    rig.position.set(pos.x - off.x, 0, pos.z - off.z); }
  function montar() { const sc = o.escena(); if (rig.parent !== sc) sc.add(rig); if (retic.parent !== sc) sc.add(retic); if (muneca.parent !== sc) sc.add(muneca); }
  // ---------------- botón
  const btn = document.createElement('button'); btn.className = 'sec'; btn.id = 'bVR'; btn.textContent = '🥽 VR'; btn.title = 'Entrar en realidad virtual (Meta Quest)'; btn.style.display = 'none';
  if (o.contenedor) o.contenedor.prepend(btn);
  if (navigator.xr && navigator.xr.isSessionSupported && window.CampusXR.permitir) navigator.xr.isSessionSupported('immersive-vr').then(ok => { if (ok) { btn.style.display = ''; window.CampusXR.continuar && window.CampusXR.continuar(entrarVR); } }).catch(() => { });
  let pidiendo = false;
  async function entrarVR() { if (sesion || pidiendo) return; pidiendo = true;
    try { sesion = await navigator.xr.requestSession('immersive-vr', { optionalFeatures: ['local-floor', 'bounded-floor', 'hand-tracking'] });
      sesion.addEventListener('end', () => { sesion = null; });
      try { sessionStorage.setItem('campus_vr', '1'); } catch (e) { }
      await renderer.xr.setSession(sesion); renderer.xr.setFoveation && renderer.xr.setFoveation(1); } catch (e) { sesion = null; alert('No se pudo iniciar la realidad virtual: ' + e.message); } finally { pidiendo = false; } }
  btn.onclick = () => { if (sesion) salir(); else entrarVR(); };
  renderer.xr.addEventListener('sessionstart', () => { const yo = o.yo(); montar(); camera.position.set(0, 0, 0); camera.rotation.set(0, 0, 0); rig.add(camera);
    colocar(yo.position, yo.rotation.y + Math.PI); yo.visible = false; if (o.controls) o.controls.enabled = false; btn.textContent = '🥽 Salir VR'; o.alCambiar && o.alCambiar(true); });
  renderer.xr.addEventListener('sessionend', () => { sesion = null; const yo = o.yo(); rig.remove(camera); o.escena().add(camera); yo.visible = true; cerrarPanel(); retic.visible = false;
    if (o.controls) o.controls.enabled = true; btn.textContent = '🥽 VR'; o.alCambiar && o.alCambiar(false); });
  // ---------------- panel 3D (sustituye a las ventanas HTML dentro del visor)
  function lienzo(W, Hh, titulo) { const cv = document.createElement('canvas'); cv.width = W; cv.height = Hh; const g = cv.getContext('2d');
    g.fillStyle = '#ffffff'; g.fillRect(0, 0, W, Hh); g.fillStyle = '#0E3A6B'; g.fillRect(0, 0, W, 96); g.fillStyle = '#fff'; g.font = '900 46px Arial'; g.fillText(String(titulo).slice(0, 40), 28, 64); return { cv, g }; }
  function mostrar(cv, ancho) { const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace;
    panelMesh = new THREE.Mesh(new THREE.PlaneGeometry(ancho, ancho * cv.height / cv.width), new THREE.MeshBasicMaterial({ map: t, side: THREE.DoubleSide }));
    const fr = new THREE.Vector3(0, 0, -1.4).applyQuaternion(camera.getWorldQuaternion(new THREE.Quaternion())); fr.y = 0; fr.setLength(1.4);
    panelMesh.position.copy(camera.getWorldPosition(new THREE.Vector3())).add(fr); panelMesh.lookAt(camera.getWorldPosition(new THREE.Vector3())); o.escena().add(panelMesh); }
  function panel(titulo, texto) { cerrarPanel(); const W = 1024, Hh = 720, { cv, g } = lienzo(W, Hh, titulo);
    g.fillStyle = '#1B2633'; g.font = '34px Arial'; let y = 150; const palabras = String(texto).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().split(' '); let l = '';
    for (const p of palabras) { if (g.measureText(l + p).width > W - 60) { g.fillText(l, 30, y); y += 44; l = ''; if (y > Hh - 90) break; } l += p + ' '; } if (y <= Hh - 90) g.fillText(l, 30, y);
    g.fillStyle = '#3FA7C6'; g.fillRect(0, Hh - 70, W, 70); g.fillStyle = '#fff'; g.font = '900 34px Arial'; g.fillText('Presiona el gatillo para cerrar', 30, Hh - 24);
    mostrar(cv, 1.3); }
  // menú: una fila por opción; se elige apuntando con el rayo y apretando el gatillo
  function menu(titulo, ops, pie) { cerrarPanel(); const FILA = 64, W = 1024, cab = 2, filas = cab + ops.length + 1, Hh = filas * FILA, { cv, g } = lienzo(W, Hh, titulo);
    g.font = '700 36px Arial'; ops.forEach(([t], k) => { const y = (cab + k) * FILA; g.fillStyle = k % 2 ? '#E8F5F9' : '#D4ECF4'; g.fillRect(16, y + 4, W - 32, FILA - 8); g.fillStyle = '#0E3A6B'; g.fillText(String(t).slice(0, 44), 36, y + 44); });
    g.fillStyle = '#3FA7C6'; g.fillRect(0, Hh - FILA, W, FILA); g.fillStyle = '#fff'; g.font = '700 26px Arial'; g.fillText(String(pie || 'Apunta a una opción y presiona el gatillo').slice(0, 70), 24, Hh - 22);
    mostrar(cv, 1.25); menuOps = { ops, filas, cabecera: cab }; }
  function cerrarPanel() { if (panelMesh) { panelMesh.parent && panelMesh.parent.remove(panelMesh); panelMesh.material.map && panelMesh.material.map.dispose(); panelMesh = null; } menuOps = null; }
  // ---------------- cada cuadro: retícula, botones, caminar y giro por pasos
  let girando = false, ultimo = performance.now(); const previo = new Map();
  const v1 = new THREE.Vector3(), v2 = new THREE.Vector3(), Y = new THREE.Vector3(0, 1, 0);
  function botones(f) { const b = f.gamepad && f.gamepad.buttons; if (!b) return; const mano = f.handedness || 'none';
    [[4, 'menu'], [5, 'atras']].forEach(([i, accion]) => { const k = mano + i, ahora = !!(b[i] && b[i].pressed);
      if (ahora && !previo.get(k)) { if (panelMesh) cerrarPanel(); else if (o.alBoton) o.alBoton(accion); } previo.set(k, ahora); }); }
  function girar(d) { const cam = camera.getWorldPosition(new THREE.Vector3()); rig.position.sub(cam).applyAxisAngle(Y, d).add(cam); rig.rotation.y += d; }
  function actualizar() { if (!renderer.xr.isPresenting) return; montar(); retic.visible = false; manosCuadro();
    const ahoraT = performance.now(), dt = Math.min(0.05, (ahoraT - ultimo) / 1000); ultimo = ahoraT;
    for (const { c, linea } of controles) { const h = lanzar(c); linea.scale.z = h ? h.distance : 6; if (h && h.object.userData.piso && !panelMesh) { retic.visible = true; retic.position.copy(h.point).setY(h.point.y + .02); } }
    const fuentes = sesion ? [...sesion.inputSources] : []; let ejeGiro = 0, ejeAtras = 0, mx = 0, mz = 0;
    fuentes.forEach(f => { if (f.hand) return; const ax = f.gamepad && f.gamepad.axes; botones(f); if (!ax || ax.length < 4) return;
      if (f.handedness === 'left') { mx = ax[2]; mz = ax[3]; } else { ejeGiro = ax[2]; ejeAtras = ax[3]; } });
    // giro por pasos (joystick derecho) y media vuelta (joystick derecho hacia atrás)
    if (!girando && Math.abs(ejeGiro) > .7) { girando = true; girar(-Math.sign(ejeGiro) * Math.PI / 6); }
    else if (!girando && ejeAtras > .8) { girando = true; girar(Math.PI); }
    if (Math.abs(ejeGiro) < .3 && ejeAtras < .3) girando = false;
    // caminar (joystick izquierdo) en la dirección de la mirada, deslizándose por las paredes
    if (!panelMesh && Math.hypot(mx, mz) > .15) { camera.getWorldDirection(v1); v1.y = 0; v1.normalize(); v2.set(-v1.z, 0, v1.x);
      const vel = 2.4 * dt, dx = (v1.x * -mz + v2.x * mx) * vel, dz = (v1.z * -mz + v2.z * mx) * vel, cam = camera.getWorldPosition(new THREE.Vector3());
      const ok = (x, z) => !o.libre || o.libre(x, z);
      if (ok(cam.x + dx, cam.z + dz)) { rig.position.x += dx; rig.position.z += dz; } else if (ok(cam.x + dx, cam.z)) rig.position.x += dx; else if (ok(cam.x, cam.z + dz)) rig.position.z += dz; }
    const yo = o.yo(); const cam = camera.getWorldPosition(new THREE.Vector3()); yo.position.set(cam.x, 0, cam.z); }
  function salir() { window.CampusXR.quitarMarca && window.CampusXR.quitarMarca(); if (sesion) sesion.end().catch(() => { }); }
  return { activo: () => renderer.xr.isPresenting, panel, menu, cerrarPanel, colocar, actualizar, salir, entrar: entrarVR, rig, boton: btn };
}
