// Modo INMERSIVO (WebXR) para cualquier sub-mundo del motor. Script clásico; lo carga motor.js cuando cfg.xr existe.
// Qué hace:
//  · Agrega a la barra los botones "🥽 VR" (immersive-vr) y "🔲 Mixta" (immersive-ar) si el navegador los soporta
//    (Meta Quest 3/3S: navegador del visor). En pantalla todo sigue igual.
//  · En el visor muestra un PANEL FLOTANTE que refleja en vivo lo que el motor pone en pantalla: el paso actual, las
//    preguntas y avisos (modal) y los mensajes de acierto/error (toast) con su fuente. Sus botones se eligen con el rayo
//    del control (gatillo) o con la mano (pellizco). No hay que reescribir los pasos de cada sub-mundo.
//  · El mismo rayo toca los objetos de la escena que brillan (los "tocables" del motor).
//  · Apuntar al piso y apretar el gatillo = desplazarse ahí (teletransporte). Botón lateral (squeeze) = traer el panel
//    al frente.
// cfg.xr del sub-mundo: { inicio: [x, z], piso: Mesh, entorno: [Mesh…] (se ocultan en realidad mixta) }
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
(function () {
  const ANCHO = 1024, ALTO = 1280, MW = 0.95, MH = MW * ALTO / ANCHO;

  function activar(W, opc = {}) {
    const { THREE, renderer, scene, camera, controls, $ } = W;
    renderer.xr.enabled = true;

    // ---------------------------------------------------------------- panel (canvas → textura)
    const cv = document.createElement('canvas'); cv.width = ANCHO; cv.height = ALTO; const g = cv.getContext('2d');
    const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace;
    const panel = new THREE.Mesh(new THREE.PlaneGeometry(MW, MH), new THREE.MeshBasicMaterial({ map: tex, transparent: true }));
    panel.visible = false; panel.renderOrder = 10; scene.add(panel);
    let botones = [];                       // [{x,y,w,h,el}] en coordenadas del canvas

    const css = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim() || '#154F90';
    function lineas(txt, max) {
      const out = []; String(txt || '').split('\n').forEach(par => {
        let l = ''; par.split(/\s+/).forEach(p => { const t = l ? l + ' ' + p : p; if (g.measureText(t).width > max && l) { out.push(l); l = p; } else l = t; });
        out.push(l); }); return out.filter((x, i, a) => x || (i && a[i - 1]));
    }
    function caja(x, y, w, h, r, color) { g.fillStyle = color; g.beginPath(); g.roundRect(x, y, w, h, r); g.fill(); }
    function visible(el) { return el && getComputedStyle(el).display !== 'none'; }

    function leer() {   // qué hay en pantalla ahora
      const conf = $('conf'), modal = visible(conf) ? conf : $('modal'), toast = $('toast');   // conf = confirmación Sí/No (motor.js)
      let titulo, cuerpo, els;
      if (visible(modal)) {
        const tarj = modal.firstElementChild, c = tarj.cloneNode(true); c.querySelectorAll('button,input,script,style').forEach(e => e.remove());
        const h = c.querySelector('h2,h3'); titulo = h ? h.textContent : ''; if (h) h.remove();
        cuerpo = c.innerText.replace(/\n{2,}/g, '\n').trim();
        els = [...tarj.querySelectorAll('button')].filter(b => !/print\(/.test(b.getAttribute('onclick') || '') && b.id !== 'bCsv' && b.id !== 'bBorrar');
      } else {
        titulo = ($('pNum').textContent ? $('pNum').textContent + ' · ' : '') + $('pTit').textContent;
        cuerpo = $('pTxt').innerText + ($('pFuente').textContent ? '\n' + $('pFuente').textContent : '');
        els = [...$('acciones').querySelectorAll('button')];
        const atras = $('bAtrasM'); if (atras) els.push(atras);   // con manos libres no hay botón B/Y: «Atrás» va en el panel
      }
      return { titulo, cuerpo, els, toast: visible(toast) ? { tipo: toast.className, txt: toast.innerText } : null };
    }

    function pintar() {
      const d = leer(); botones = [];
      g.clearRect(0, 0, ANCHO, ALTO);
      caja(0, 0, ANCHO, ALTO, 36, 'rgba(255,255,255,0.96)');
      caja(0, 0, ANCHO, 120, 36, css('--navy')); g.fillRect(0, 80, ANCHO, 40);
      g.fillStyle = '#fff'; g.font = 'bold 40px Calibri, sans-serif'; g.textBaseline = 'middle';
      g.fillText((lineas(d.titulo, ANCHO - 60)[0] || '').slice(0, 60), 30, 60);
      let y = 140;
      if (d.toast) {
        g.font = '30px Calibri, sans-serif'; const ls = lineas(d.toast.txt, ANCHO - 80).slice(0, 4);
        const h = 24 + ls.length * 38; caja(20, y, ANCHO - 40, h, 20, d.toast.tipo === 'ok' ? '#2E7D32' : d.toast.tipo === 'no' ? '#C62828' : css('--azul'));
        g.fillStyle = '#fff'; ls.forEach((l, i) => g.fillText(l, 40, y + 30 + i * 38)); y += h + 16;
      }
      g.fillStyle = '#1B2633'; g.font = '32px Calibri, sans-serif';
      const nb = d.els.length, altoB = nb > 6 ? 66 : 80, zonaB = nb * (altoB + 12);
      const maxL = Math.max(2, Math.floor((ALTO - 40 - zonaB - y) / 40));
      const ls = lineas(d.cuerpo, ANCHO - 60); ls.slice(0, maxL).forEach((l, i) => g.fillText(i === maxL - 1 && ls.length > maxL ? l + ' …' : l, 30, y + 20 + i * 40));
      let by = ALTO - 30 - zonaB;
      d.els.forEach(el => {
        const sel = el.classList.contains('marcada'), prim = el.classList.contains('prim'), dis = el.disabled;
        caja(30, by, ANCHO - 60, altoB, 18, dis ? '#ccc' : sel ? '#D7ECF4' : prim ? css('--azul') : '#E8F0F4');
        if (sel) { g.strokeStyle = css('--azul'); g.lineWidth = 5; g.beginPath(); g.roundRect(30, by, ANCHO - 60, altoB, 18); g.stroke(); }
        g.fillStyle = prim && !sel ? '#fff' : '#1B2633'; g.font = (prim ? 'bold ' : '') + (nb > 6 ? '27px' : '30px') + ' Calibri, sans-serif';
        const t = lineas(el.textContent.trim(), ANCHO - 110); t.slice(0, 2).forEach((l, i) => g.fillText(l, 52, by + altoB / 2 + (t.length > 1 ? (i - 0.5) * 32 : 0)));
        botones.push({ x: 30, y: by, w: ANCHO - 60, h: altoB, el }); by += altoB + 12;
      });
      tex.needsUpdate = true;
    }
    let pendiente = false;
    // (20/10/2026) setTimeout y no requestAnimationFrame: dentro de VR el rAF de la ventana no corre y `pendiente` se
    // quedaba en true para siempre → el panel ya no cambiaba y sus botones no respondían («se congela»).
    const repintar = () => { if (pendiente || !renderer.xr.isPresenting) return; pendiente = true; setTimeout(() => { pendiente = false; try { pintar(); } catch (e) { console.error('XR panel', e); } }, 30); };
    new MutationObserver(repintar).observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['style', 'class', 'disabled'] });

    function alFrente() {   // coloca el panel 1 m al frente de la vista, un poco abajo y a la izquierda
      const c = renderer.xr.getCamera(); const p = new THREE.Vector3(), q = new THREE.Quaternion(); c.getWorldPosition(p); c.getWorldQuaternion(q);
      const fr = new THREE.Vector3(0, 0, -1).applyQuaternion(q); fr.y = 0; fr.normalize(); const izq = new THREE.Vector3(fr.z, 0, -fr.x);
      panel.position.copy(p).addScaledVector(fr, 0.95).addScaledVector(izq, 0.35); panel.position.y = p.y - 0.15;
      panel.lookAt(p.x, panel.position.y, p.z);
    }

    // ---------------------------------------------------------------- controles (rayo + gatillo + squeeze)
    const ray = new THREE.Raycaster(), M4 = new THREE.Matrix4();
    const geo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -1)]);
    const mira = new THREE.Mesh(new THREE.RingGeometry(0.02, 0.035, 24), new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide }));
    mira.visible = false; scene.add(mira);
    function apuntar(c) { M4.identity().extractRotation(c.matrixWorld); ray.ray.origin.setFromMatrixPosition(c.matrixWorld); ray.ray.direction.set(0, 0, -1).applyMatrix4(M4); }
    // (20/10/2026) antes se lanzaba el rayo contra TODA la escena (recursivo) 2 veces por cuadro: en el Quest 3S bajaba
    // los cuadros por segundo y la imagen se veía mal / a saltos. Ahora solo contra los tocables (lista renovada cada 1 s).
    const vis = o => { for (let p = o; p; p = p.parent) if (p.visible === false) return false; return true; };
    let tocables = [], tLista = 0;
    function listaTocables() { const ahora = performance.now(); if (ahora - tLista < 1000) return tocables; tLista = ahora;
      tocables = []; scene.traverse(o => { if (o.isMesh && o.userData.tipo && o !== panel) tocables.push(o); }); return tocables; }
    function golpe(c) {
      apuntar(c);
      if (muneca.visible) { const hm = ray.intersectObject(muneca)[0]; if (hm) return { tipo: 'muneca', h: hm }; }
      const hp = panel.visible ? ray.intersectObject(panel)[0] : null;
      const ho = ray.intersectObjects(listaTocables(), false).find(h => vis(h.object));
      const hs = opc.piso ? ray.intersectObject(opc.piso)[0] : null;
      if (hp && (!ho || hp.distance <= ho.distance)) return { tipo: 'panel', h: hp };
      if (ho) return { tipo: 'obj', h: ho };
      if (hs) return { tipo: 'piso', h: hs };
      return null;
    }
    // posición y giro del espacio físico dentro del mundo (rig): mundo = Trasladar(ofs) · GirarY(yaw) · pose del visor
    let base = null; const ofs = { x: 0, z: 0 }; let yaw = 0;
    function aplicarRig() {
      if (!base) base = renderer.xr.getReferenceSpace(); if (!base) return;
      const c = Math.cos(-yaw), s = Math.sin(-yaw), px = -ofs.x, pz = -ofs.z;   // inversa: GirarY(-yaw) · Trasladar(-ofs)
      renderer.xr.setReferenceSpace(base.getOffsetReferenceSpace(new XRRigidTransform(
        { x: c * px + s * pz, y: 0, z: -s * px + c * pz, w: 1 }, { x: 0, y: Math.sin(-yaw / 2), z: 0, w: Math.cos(-yaw / 2) }))); }
    function irA(x, z) { ofs.x = x; ofs.z = z; aplicarRig(); setTimeout(alFrente, 120); }   // teletransporte
    function girar(d) {   // giro por pasos alrededor de la cabeza (no del centro del cuarto)
      const h = new THREE.Vector3(); renderer.xr.getCamera().getWorldPosition(h);
      const dx = ofs.x - h.x, dz = ofs.z - h.z, c = Math.cos(d), s = Math.sin(d);
      ofs.x = h.x + c * dx + s * dz; ofs.z = h.z - s * dx + c * dz; yaw += d; aplicarRig(); }
    // ---------------------------------------------------------------- manos libres (hand tracking)
    // Se dibujan las articulaciones (antes no se veían las manos y parecía que no funcionaban). Pellizco = gatillo.
    // Botón en la muñeca IZQUIERDA: apúntale con la otra mano y pellizca = traer el panel al frente.
    const matMano = new THREE.MeshBasicMaterial({ color: 0xF2D2BD }), geoArt = new THREE.SphereGeometry(0.008, 8, 6);
    const manos = [0, 1].map(i => { const h = renderer.xr.getHand(i); scene.add(h); return h; });
    const cvM = document.createElement('canvas'); cvM.width = 256; cvM.height = 128; { const g2 = cvM.getContext('2d');
      g2.fillStyle = '#3FA7C6'; g2.beginPath(); g2.roundRect(0, 0, 256, 128, 30); g2.fill(); g2.fillStyle = '#fff'; g2.font = '900 48px Arial'; g2.textAlign = 'center'; g2.textBaseline = 'middle'; g2.fillText('📋 Panel', 128, 66); }
    const texM = new THREE.CanvasTexture(cvM); texM.colorSpace = THREE.SRGBColorSpace;
    const muneca = new THREE.Mesh(new THREE.PlaneGeometry(0.09, 0.045), new THREE.MeshBasicMaterial({ map: texM, side: THREE.DoubleSide, depthTest: false }));
    muneca.visible = false; muneca.renderOrder = 12; scene.add(muneca);
    const qTmp = new THREE.Quaternion(), vTmp = new THREE.Vector3();
    W.cuadro.push(() => { if (!renderer.xr.isPresenting) { muneca.visible = false; return; } let hayMano = false;
      manos.forEach(h => { const j = h.joints || {};
        for (const k in j) { const a = j[k]; if (!a.userData.bola) { a.userData.bola = new THREE.Mesh(geoArt, matMano); a.add(a.userData.bola); } }
        const w = j['wrist']; const src = h.userData.fuente;
        if (w && w.visible && src && src.handedness === 'left') { hayMano = true; w.getWorldPosition(vTmp); w.getWorldQuaternion(qTmp);
          muneca.position.copy(vTmp).add(new THREE.Vector3(0, 0.06, 0)); const cam = new THREE.Vector3(); renderer.xr.getCamera().getWorldPosition(cam); muneca.lookAt(cam); } });
      muneca.visible = hayMano; });
    manos.forEach(h => { h.addEventListener('connected', e => { h.userData.fuente = e.data; }); h.addEventListener('disconnected', () => { h.userData.fuente = null; }); });
    [0, 1].forEach(i => {
      const c = renderer.xr.getController(i); scene.add(c);
      const linea = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: 0x9CC5A1 })); linea.scale.z = 4; c.add(linea);
      c.addEventListener('selectstart', () => { try {
        const r = golpe(c); if (!r) return;
        if (r.tipo === 'muneca') { alFrente(); return; }
        if (r.tipo === 'panel') { const u = r.h.uv, px = u.x * ANCHO, py = (1 - u.y) * ALTO;
          const b = botones.find(b => px >= b.x && px <= b.x + b.w && py >= b.y && py <= b.y + b.h); if (b && !b.el.disabled) b.el.click(); }
        else if (r.tipo === 'obj') W.tocar(r.h.object.userData.ref || r.h.object);
        else if (r.tipo === 'piso') {   // la persona queda parada donde apunta (descuenta lo que ya caminó en su cuarto)
          const p = r.h.point, cp = new THREE.Vector3(); renderer.xr.getCamera().getWorldPosition(cp);
          irA(p.x - (cp.x - ofs.x), p.z - (cp.z - ofs.z)); }
      } catch (e) { console.error('XR select', e); } });
      c.addEventListener('squeezestart', alFrente);
      c.addEventListener('connected', e => { c.userData.fuente = e.data; });
      c.addEventListener('disconnected', () => { c.userData.fuente = null; });
      W.cuadro.push(() => { if (!renderer.xr.isPresenting) return; const r = golpe(c);
        linea.scale.z = r ? r.h.distance : 4; if (i === 0) { mira.visible = !!r && r.tipo === 'piso'; if (mira.visible) { mira.position.copy(r.h.point).y += 0.01; mira.rotation.x = -Math.PI / 2; } } });
    });

    // ---------------------------------------------------------------- joystick y botones del Quest (18/10/2026)
    // Joystick izq. = caminar · Joystick der. = girar 30° (hacia atrás = media vuelta) · B/Y = Atrás (pregunta si quieres
    // volver al edificio) · A/X = traer el panel al frente. Las manos (sin gamepad) usan pellizco y el botón de la muñeca.
    const prevB = new Map(), dir = new THREE.Vector3(); let tMov = performance.now(), girando = false;
    W.cuadro.push(() => { const s = renderer.xr.getSession && renderer.xr.getSession(); if (!s || !renderer.xr.isPresenting) return;
      const ahora = performance.now(), dt = Math.min(0.05, (ahora - tMov) / 1000); tMov = ahora; let gx = 0, gz = 0;
      for (const f of s.inputSources) { const gp = f.gamepad; if (!gp || f.hand) continue; const mano = f.handedness;
        [[4, alFrente], [5, () => { const b = document.getElementById('bAtrasM'); if (b) b.click(); }]].forEach(([i, fn]) => {
          const k = mano + i, on = !!(gp.buttons[i] && gp.buttons[i].pressed); if (on && !prevB.get(k)) { try { fn(); } catch (e) { console.error(e); } } prevB.set(k, on); });
        if (gp.axes.length < 4) continue;
        if (mano === 'right') { gx = gp.axes[2]; gz = gp.axes[3]; continue; }
        if (Math.hypot(gp.axes[2], gp.axes[3]) > .15) {
          renderer.xr.getCamera().getWorldDirection(dir); dir.y = 0; dir.normalize(); const v = 2 * dt;
          ofs.x += (dir.x * -gp.axes[3] - dir.z * gp.axes[2]) * v; ofs.z += (dir.z * -gp.axes[3] + dir.x * gp.axes[2]) * v; aplicarRig(); } }
      if (!girando && Math.abs(gx) > .7) { girando = true; girar(-Math.sign(gx) * Math.PI / 6); }
      else if (!girando && gz > .8) { girando = true; girar(Math.PI); }
      if (Math.abs(gx) < .3 && gz < .3) girando = false; });

    // ---------------------------------------------------------------- entrar / salir
    const fondo = scene.background;
    async function entrar(modo) {
      const s = await navigator.xr.requestSession(modo, { requiredFeatures: ['local-floor'], optionalFeatures: ['hand-tracking'] });
      renderer.xr.setReferenceSpaceType('local-floor'); await renderer.xr.setSession(s); base = null; ofs.x = ofs.z = 0; yaw = 0;
      renderer.xr.setFoveation && renderer.xr.setFoveation(1);   // menos carga en los bordes de la lente (Quest 3S)
      try { sessionStorage.setItem('campus_vr', '1'); } catch (e) { }
      controls.enabled = false;
      // (22/10/2026) En el visor manda la realidad virtual: se apaga la vista a la altura de los ojos para que sus
      // flechas y su giro no peleen con el movimiento de la cabeza (el campus ya lo hacia, a los sub-mundos les faltaba).
      if (W.v1a && W.v1a.activa()) W.v1a.desactivar();
      if (modo === 'immersive-ar') { scene.background = null; (opc.entorno || []).forEach(o => o.visible = false); }
      const [x, z] = opc.inicio || [0, 0];
      setTimeout(() => { if (x || z) irA(x, z); else alFrente(); panel.visible = true; pintar(); }, 300);
      s.addEventListener('end', () => { renderer.xr.setReferenceSpace(null); scene.background = fondo; (opc.entorno || []).forEach(o => o.visible = true); panel.visible = false; mira.visible = false; controls.enabled = true; });
    }
    (async () => {
      if (!navigator.xr || !window.CampusXR.permitir) return;
      const der = document.querySelector('#barra .der'); if (!der) return;
      for (const [modo, txt, tit] of [['immersive-ar', '🔲', 'Realidad mixta: tu espacio real'], ['immersive-vr', '🥽 VR', 'Entrar en realidad virtual']]) {
        let ok = false; try { ok = await navigator.xr.isSessionSupported(modo); } catch (e) { }
        if (!ok) continue;
        const b = document.createElement('button'); b.className = 'sec peq'; b.textContent = txt; b.title = tit; b.style.fontWeight = '800';
        b.onclick = () => entrar(modo).catch(e => W.toast('no', 'No se pudo iniciar el modo inmersivo: ' + e.message)); der.prepend(b);
        if (modo === 'immersive-vr' && window.CampusXR.continuar) window.CampusXR.continuar(() => entrar(modo));
      }
    })();
    return { panel, pintar, alFrente, irA };
  }
  window.MotorXR = { activar };
})();
