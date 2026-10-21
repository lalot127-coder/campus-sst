// Vista en PRIMERA PERSONA con giro por movimiento del celular (21/10/2026). Script clásico: lo cargan el campus
// (index.html) y el motor compartido (motor/motor.js), así lo heredan todos los simuladores y las prácticas.
//
// Para qué: en el celular, la vista de arriba (tercera persona) se siente lejana. En primera persona la persona ve
// a la altura de sus ojos y gira la vista moviendo el celular, como en el edificio de prácticas de hidrocarburos.
//
//   const v = Vista1a.crear({ THREE, camera, controls, renderer, barra,
//                             yo: () => avatar, libre: (x, z) => bool, alCambiar: a => {}, bloqueado: () => bool });
//   v.actualizar(dt)   ← una vez por cuadro · v.activa() · v.alternar() · v.boton
//
// Cómo se gira la vista:
//   · Celular/tablet: moviendo el aparato (sensor de orientación). Si el navegador pide permiso (iPhone/iPad), el
//     botón «🧭 Girar con el celular» lo solicita; mientras tanto se puede arrastrar con el dedo.
//   · Arrastrando con el dedo o el mouse (siempre disponible, también sobre el giro del aparato).
//   · Computadora: W A S D o las flechas para caminar; arrastrar para mirar.
window.Vista1a = (function () {
  const CSS = `#v1aPad{position:fixed;left:12px;bottom:12px;z-index:30;display:none;grid-template-columns:repeat(3,52px);grid-gap:6px;touch-action:none}
#v1aPad button{width:52px;height:52px;border:0;border-radius:14px;background:rgba(21,79,144,.86);color:#fff;font:900 20px Arial,sans-serif;touch-action:none;-webkit-user-select:none;user-select:none}
#v1aPad button:active{background:#3FA7C6}#v1aPad .e{visibility:hidden}
#v1aGiro{position:fixed;right:12px;bottom:12px;z-index:30;display:none;border:0;border-radius:14px;padding:12px 14px;background:rgba(21,79,144,.86);color:#fff;font:700 15px Calibri,Arial,sans-serif}
/* el panel de instrucciones deja sitio a las flechas para que no se encimen en el celular */
body.v1aOn #panel{padding-bottom:84px}body.v1aOn #ayuda{display:none!important}`;

  function crear(o) {
    const { THREE, camera, controls, renderer } = o;
    const alto = o.altura ?? 1.62, vel = o.vel ?? 3.4;
    let activa = false, yaw = 0, pitch = 0, giroOn = false, giroQ = null, yawGiro = 0, yawGiro0 = null, updateOrig = null;
    const teclas = new Set(), pad = { f: 0, b: 0, l: 0, r: 0 };
    const lienzo = renderer.domElement;

    if (!document.getElementById('v1aCss')) document.head.insertAdjacentHTML('beforeend', `<style id="v1aCss">${CSS}</style>`);
    // ------------------------------------------------------------------ botones en pantalla
    const boton = document.createElement('button');
    boton.className = 'sec peq'; boton.id = 'bVista1a'; boton.title = 'Ver a la altura de los ojos y girar moviendo el celular';
    boton.textContent = '🧍'; boton.innerHTML = '🧍<span class="txt"> 1ª persona</span>';
    boton.onclick = () => alternar();
    if (o.barra) o.barra.prepend(boton);

    document.body.insertAdjacentHTML('beforeend',
      `<div id="v1aPad"><button class="e"></button><button data-m="f">▲</button><button class="e"></button>
       <button data-m="l">◀</button><button data-m="b">▼</button><button data-m="r">▶</button></div>
       <button id="v1aGiro">🧭 Girar con el celular</button>`);
    const elPad = document.getElementById('v1aPad'), elGiro = document.getElementById('v1aGiro');
    elPad.querySelectorAll('[data-m]').forEach(b => {
      const m = b.dataset.m, on = e => { e.preventDefault(); pad[m] = 1; }, off = () => pad[m] = 0;
      b.addEventListener('pointerdown', on); ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => b.addEventListener(ev, off));
    });

    // ------------------------------------------------------------------ girar la vista con el dedo o el mouse
    let arrastre = null;
    lienzo.addEventListener('pointerdown', e => { if (activa) arrastre = { x: e.clientX, y: e.clientY, id: e.pointerId, movido: 0 }; });
    lienzo.addEventListener('pointermove', e => {
      if (!activa || !arrastre || e.pointerId !== arrastre.id) return;
      const dx = e.clientX - arrastre.x, dy = e.clientY - arrastre.y; arrastre.x = e.clientX; arrastre.y = e.clientY;
      arrastre.movido += Math.abs(dx) + Math.abs(dy);
      const k = 0.0045 * (camera.fov / 55);
      if (giroOn) yawGiro -= dx * k; else yaw -= dx * k;
      pitch = Math.max(-1.2, Math.min(1.2, pitch - dy * k));
    });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach(ev => lienzo.addEventListener(ev, () => arrastre = null));

    // ------------------------------------------------------------------ girar la vista moviendo el aparato
    // Conversión estándar de los ángulos del sensor (alpha/beta/gamma) a la orientación de la cámara.
    const zee = new THREE.Vector3(0, 0, 1), euler = new THREE.Euler(), qAux = new THREE.Quaternion();
    const qPantalla = new THREE.Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5));   // -90° en X: el teléfono "mira" al frente
    const rad = Math.PI / 180;
    function alSensor(e) {
      if (e.alpha == null) return;
      const orient = (screen.orientation && screen.orientation.angle || window.orientation || 0) * rad;
      euler.set(e.beta * rad, e.alpha * rad, -e.gamma * rad, 'YXZ');
      const q = new THREE.Quaternion().setFromEuler(euler).multiply(qPantalla).multiply(qAux.setFromAxisAngle(zee, -orient));
      giroQ = q; giroOn = true; elGiro.style.display = 'none';
    }
    function pedirGiro() {
      const D = window.DeviceOrientationEvent;
      if (!D) { elGiro.style.display = 'none'; return; }
      const escuchar = () => addEventListener('deviceorientation', alSensor, true);
      if (typeof D.requestPermission === 'function') D.requestPermission().then(r => { if (r === 'granted') escuchar(); }).catch(() => { });
      else escuchar();
    }
    elGiro.onclick = pedirGiro;
    const tactil = matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 1;

    // ------------------------------------------------------------------ teclado (computadora)
    addEventListener('keydown', e => { if (activa && e.target.tagName !== 'INPUT') teclas.add(e.key.toLowerCase()); });
    addEventListener('keyup', e => teclas.delete(e.key.toLowerCase()));

    // ------------------------------------------------------------------ encender y apagar
    function activar() {
      if (activa) return; activa = true;
      const av = o.yo && o.yo(); if (av) yaw = av.rotation.y + Math.PI;
      // OrbitControls volvería a poner la cámara donde él quiere: se le calla mientras dura esta vista. Su update() es
      // una función de la propia instancia (no del prototipo), así que hay que GUARDARLA: borrarla la perdería.
      controls.enabled = false; updateOrig = updateOrig || controls.update.bind(controls); controls.update = () => { };
      if (av) av.visible = false;
      elPad.style.display = 'grid'; document.body.classList.add('v1aOn');
      boton.innerHTML = '🎥<span class="txt"> Vista normal</span>'; boton.title = 'Volver a la vista de cámara';
      if (tactil && window.DeviceOrientationEvent) { if (typeof DeviceOrientationEvent.requestPermission === 'function') elGiro.style.display = 'block'; else pedirGiro(); }
      o.alCambiar && o.alCambiar(true);
    }
    function desactivar() {
      if (!activa) return; activa = false; giroOn = false; giroQ = null; yawGiro0 = null; yawGiro = 0;
      removeEventListener('deviceorientation', alSensor, true);
      if (updateOrig) controls.update = updateOrig;              // vuelve el OrbitControls de siempre
      controls.enabled = true;
      const av = o.yo && o.yo(); if (av) av.visible = true;
      elPad.style.display = 'none'; elGiro.style.display = 'none'; document.body.classList.remove('v1aOn');
      boton.innerHTML = '🧍<span class="txt"> 1ª persona</span>'; boton.title = 'Ver a la altura de los ojos y girar moviendo el celular';
      if (av) { camera.position.copy(av.position).add(new THREE.Vector3(0, 6, 8)); controls.target.copy(av.position).setY(1); }
      controls.update(); o.alCambiar && o.alCambiar(false);
    }
    const alternar = () => activa ? desactivar() : activar();

    // ------------------------------------------------------------------ cada cuadro
    const adelante = new THREE.Vector3(), derecha = new THREE.Vector3(), Y = new THREE.Vector3(0, 1, 0);
    function actualizar(dt) {
      if (!activa) return;
      dt = Math.min(0.05, dt || 0.016);
      const av = o.yo && o.yo(); if (!av) return;
      // orientación: la del aparato (si hay sensor) más lo que se haya arrastrado con el dedo
      if (giroOn && giroQ) {
        camera.quaternion.copy(giroQ);
        const e = new THREE.Euler().setFromQuaternion(giroQ, 'YXZ');
        if (yawGiro0 === null) yawGiro0 = e.y;
        camera.rotateOnWorldAxis(Y, yawGiro);
        yaw = e.y + yawGiro;
      } else {
        camera.quaternion.setFromEuler(new THREE.Euler(pitch, yaw, 0, 'YXZ'));
      }
      // caminar: el avatar se mueve y la cámara va en su cabeza
      if (!(o.bloqueado && o.bloqueado())) {
        let mf = (teclas.has('w') || teclas.has('arrowup') ? 1 : 0) - (teclas.has('s') || teclas.has('arrowdown') ? 1 : 0) + pad.f - pad.b;
        let ml = (teclas.has('d') || teclas.has('arrowright') ? 1 : 0) - (teclas.has('a') || teclas.has('arrowleft') ? 1 : 0) + pad.r - pad.l;
        if (mf || ml) {
          adelante.set(Math.sin(yaw), 0, Math.cos(yaw)).multiplyScalar(-1);   // -Z es "al frente"
          derecha.set(-adelante.z, 0, adelante.x);
          const paso = vel * dt, nx = adelante.x * mf + derecha.x * ml, nz = adelante.z * mf + derecha.z * ml;
          const L = Math.hypot(nx, nz) || 1, dx = nx / L * paso, dz = nz / L * paso;
          const libre = o.libre || (() => true), p = av.position;
          if (libre(p.x + dx, p.z + dz)) { p.x += dx; p.z += dz; }
          else if (libre(p.x + dx, p.z)) p.x += dx;
          else if (libre(p.x, p.z + dz)) p.z += dz;
          av.rotation.y = Math.atan2(adelante.x, adelante.z);
        }
      }
      camera.position.copy(av.position).setY(av.position.y + alto);
    }

    return { activa: () => activa, activar, desactivar, alternar, actualizar, boton };
  }
  return { crear };
})();
