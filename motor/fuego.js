// Fuego virtual y descarga de extintor, para cualquier celda del simulador. Script CLÁSICO (no módulo).
//
//   <script src="../../../motor/fuego.js"></script>
//   const F = Fuego.crear(W, { x: 0, z: -3, base: 0.55, radio: 0.6, alto: 1.4 });
//   F.encender(0.85);                       // intensidad de 0 a 1
//   F.rociar(origen, direccion, '#FFF8E1'); // cada cuadro, mientras se aprieta la palanca
//   F.soltar();                             // al soltarla
//   F.alApagarse(fn)  F.alAgotarse(fn)      // se apagó el fuego / se acabó el agente
//   F.S.I (fuego 0-1) · F.S.carga (agente 0-1) · F.S.zona ('base' | 'llamas' | 'fuera')
//
// Se dibuja con SPRITES (no con un sistema de partículas con shaders propios) porque los sprites sí se ven dentro
// del visor y cuestan poco en el Quest 3S. Todo el movimiento va en W.cuadro, que corre en el ciclo del renderer:
// dentro de VR el requestAnimationFrame de la ventana NO se ejecuta (regla 1 de CLAUDE.md).
//
// Números de comportamiento: son los mismos que ya usa mundos/proteccion/extintores (probados desde el 07/10/2026).
// Apuntar a la BASE apaga ~4.5 veces más rápido que apuntar a las llamas, y si dejas de descargar el fuego se
// recupera poco a poco. La duración de la descarga (14 s por omisión) está dentro de los 8 a 25 s que da la
// NOM-002-STPS-2010, Guía de Referencia VII, Tabla VII.2, según la capacidad del extintor.
window.Fuego = (function () {
  const lienzoRadial = paradas => { const c = document.createElement('canvas'); c.width = c.height = 64; const x = c.getContext('2d');
    const g = x.createRadialGradient(32, 32, 0, 32, 32, 32); paradas.forEach(([p, col]) => g.addColorStop(p, col));
    x.fillStyle = g; x.fillRect(0, 0, 64, 64); return c; };
  let texFlama = null, texNube = null;

  function crear(W, o = {}) {
    const { THREE, scene } = W;
    if (!texFlama) { texFlama = new THREE.CanvasTexture(lienzoRadial([[0, 'rgba(255,255,220,1)'], [.3, 'rgba(255,190,60,.9)'], [.7, 'rgba(240,80,20,.5)'], [1, 'rgba(200,30,0,0)']]));
      texNube = new THREE.CanvasTexture(lienzoRadial([[0, 'rgba(255,255,255,.95)'], [1, 'rgba(255,255,255,0)']])); }

    // forma del fuego: dónde está y hasta dónde llega (la celda la cambia según el escenario)
    const C = { x: o.x || 0, z: o.z || 0, base: o.base ?? 0.5, radio: o.radio ?? 0.6, alto: o.alto ?? 1.4 };
    const S = { activo: false, I: 0, carga: 1, rociando: false, zona: '', segundos: o.segundos ?? 14,
      desde: new THREE.Vector3(), hacia: new THREE.Vector3(), color: 0xFFF8E1 };
    let fnApagarse = null, fnAgotarse = null;

    const sprite = (tex, opc) => { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, depthWrite: false, transparent: true, ...opc })); s.visible = false; s.userData.vida = Math.random(); scene.add(s); return s; };
    const flamas = Array.from({ length: o.flamas ?? 70 }, () => sprite(texFlama, { blending: THREE.AdditiveBlending }));
    const humo = Array.from({ length: o.humo ?? 22 }, () => sprite(texNube, { color: 0x37474F, opacity: .35 }));
    const chorro = Array.from({ length: o.chorro ?? 90 }, () => { const s = sprite(texNube, { opacity: .8 }); s.userData.vida = 1; return s; });
    const luz = new THREE.PointLight(0xff8a3d, 0, 7); scene.add(luz);

    const centro = () => new THREE.Vector3(C.x, C.base, C.z);
    function encender(i = 1) { S.activo = true; S.I = i; luz.position.copy(centro()).add(new THREE.Vector3(0, 0.6, 0.4)); }
    function apagar() { S.activo = false; S.I = 0; soltar(); }
    function forma(f) { Object.assign(C, f); luz.position.copy(centro()).add(new THREE.Vector3(0, 0.6, 0.4)); }

    // ¿A dónde apunta quien descarga? Devuelve el punto sobre un plano vertical que pasa por el fuego y de paso
    // clasifica la zona: la BASE es lo que apaga; las llamas casi no; fuera no hace nada.
    function apuntar(origen, dir) {
      const c = centro(), n = new THREE.Vector3(dir.x, 0, dir.z).normalize().negate();
      const plano = new THREE.Plane().setFromNormalAndCoplanarPoint(n.lengthSq() ? n : new THREE.Vector3(0, 0, 1), c);
      const p = new THREE.Vector3();
      if (!new THREE.Ray(origen, dir).intersectPlane(plano, p)) { S.zona = 'fuera'; return null; }
      const dx = Math.hypot(p.x - c.x, p.z - c.z), dy = p.y - c.y;
      S.zona = dx < C.radio * 1.1 && dy > -0.3 && dy < C.alto * 0.35 ? 'base' : dx < C.radio * 1.4 && dy < C.alto * 1.3 ? 'llamas' : 'fuera';
      return p;
    }
    // Se llama cada cuadro mientras se aprieta la palanca. origen = Object3D (mano, control o cámara) o Vector3.
    function rociar(origen, direccion, color) {
      const o3 = origen.isObject3D ? origen.getWorldPosition(new THREE.Vector3()) : origen.clone();
      let dir = direccion;
      if (!dir && origen.isObject3D) { const q = new THREE.Quaternion(); origen.getWorldQuaternion(q); dir = new THREE.Vector3(0, 0, -1).applyQuaternion(q); }
      S.rociando = true; if (color !== undefined) S.color = color;
      const p = apuntar(o3, dir); S.desde.copy(o3);
      if (p) S.hacia.copy(p); else S.hacia.copy(o3).addScaledVector(dir, 4);
    }
    const soltar = () => { S.rociando = false; };

    let tPrev = 0;
    W.cuadro.push(t => {
      const dt = Math.min(0.05, t - tPrev || 0.016); tPrev = t;
      const I = S.activo ? S.I : 0;
      luz.intensity = I * (6 + Math.sin(t * 23) * 1.5 + Math.sin(t * 7) * 1);
      const c = centro();
      flamas.forEach((s, i) => { if (I <= 0.02) { s.visible = false; return; } const u = s.userData; u.vida += dt * (1.1 + (i % 5) * 0.12);
        if (u.vida > 1) { u.vida = 0; u.a = Math.random() * Math.PI * 2; u.r = Math.random() * C.radio * Math.sqrt(I); }
        const k = u.vida; s.visible = i < flamas.length * Math.max(0.25, I);
        s.position.set(c.x + Math.cos(u.a) * u.r * (1 - k * 0.6), c.y + k * C.alto * (0.4 + I * 0.6), c.z + Math.sin(u.a) * u.r * (1 - k * 0.6));
        s.scale.setScalar((0.45 + I * 0.35) * (1 - k * 0.7)); s.material.opacity = 1 - k; });
      humo.forEach(s => { if (I <= 0.02) { s.visible = false; return; } const u = s.userData; u.vida += dt * 0.35;
        if (u.vida > 1) { u.vida = 0; u.x = (Math.random() - .5) * C.radio; }
        s.visible = true; s.position.set(c.x + u.x + u.vida * 0.3, c.y + C.alto * 0.8 + u.vida * 1.6, c.z);
        s.scale.setScalar(0.4 + u.vida * 1.2); s.material.opacity = 0.35 * (1 - u.vida) * I; });

      if (S.rociando && S.carga > 0) {
        S.carga = Math.max(0, S.carga - dt / S.segundos);
        const efecto = S.zona === 'base' ? 0.2 : S.zona === 'llamas' ? 0.045 : 0;
        S.I = Math.max(0, S.I - efecto * dt);
        let n = 0; chorro.forEach(s => { if (s.userData.vida >= 1 && n < 4) { s.userData.vida = 0; s.userData.ini = S.desde.clone();
          s.userData.fin = S.hacia.clone().add(new THREE.Vector3((Math.random() - .5) * .25, (Math.random() - .5) * .2, (Math.random() - .5) * .25)); n++; } });
      } else if (S.activo && S.I > 0 && S.I < 1) S.I = Math.min(1, S.I + dt * 0.012);   // si dejas de descargar, se recupera
      chorro.forEach(s => { const u = s.userData; if (u.vida >= 1) { s.visible = false; return; } u.vida += dt * 2.2; s.visible = true;
        s.material.color.set(S.color); s.position.lerpVectors(u.ini, u.fin, Math.min(1, u.vida));
        s.scale.setScalar(0.08 + u.vida * 0.45); s.material.opacity = 0.85 * (1 - u.vida * 0.8); });

      if (S.activo && S.I <= 0.001 && fnApagarse) { const f = fnApagarse; fnApagarse = null; S.activo = false; S.rociando = false; setTimeout(f, 300); }
      if (S.carga <= 0 && S.I > 0 && fnAgotarse) { const f = fnAgotarse; fnAgotarse = null; f(); }
    });

    return { S, forma: C, encender, apagar, cambiarForma: forma, centro, apuntar, rociar, soltar, luz,
      alApagarse: f => { fnApagarse = f; }, alAgotarse: f => { fnAgotarse = f; }, recargar: () => { S.carga = 1; } };
  }
  return { crear };
})();
