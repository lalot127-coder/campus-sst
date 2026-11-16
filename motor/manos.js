// Manos que AGARRAN dentro del visor (Meta Quest 3S) y su equivalente en pantalla. Script CLÁSICO (no módulo),
// igual que motor.js y xr.js, para que funcione también al abrir el archivo con doble clic (file://).
//
//   <script src="../../../motor/manos.js"></script>
//   const manos = Manos.activar(W);
//   manos.agarrable(extintor, { pose: [0, -0.1, -0.12, -0.5, 0, 0], alAgarrar: () => …, alUsar: si => … });
//   manos.tomar(extintor);          // lo pone en la mano (o frente a la cámara, en pantalla)
//   manos.soltar(extintor);         // lo devuelve a donde estaba
//   manos.enMano(extintor)          // ¿lo trae en la mano?      manos.usando(extintor) → gatillo apretado
//
// Cómo se maneja (NO se inventa un control nuevo: son los del Quest y los de siempre):
//   · Visor con controles: acercar la mano a la pieza y apretar el GATILLO o el botón lateral = tomarla.
//     Ya con la pieza en la mano, el gatillo deja de tomar y pasa a USARLA (apretar la palanca del extintor).
//   · Visor con manos libres: lo mismo con el PELLIZCO (no hay botones; regla 4 de CLAUDE.md).
//   · Pantalla (computadora, celular, tablet): tocar la pieza la toma; el botón grande de la página la usa.
//     Así la misma celda se puede practicar sin visor, que es como la va a ver la mayoría.
//
// Por qué existe este archivo y no está dentro de cada celda: las siete celdas del edificio de Simulación
// Inmersiva (extintores, primeros auxilios, LOTO, EPP, espacios confinados, alturas y SGH) necesitan lo mismo.
//
// Convive con motor/xr.js: xr.js usa el gatillo para el rayo del panel 3D. Cuando la mano tiene una pieza o hay
// una pieza al alcance, xr.js se hace a un lado (pregunta por W.manos.ocupado(c)). La respuesta se calcula en el
// momento, no con una bandera, para que no importe cuál de los dos se active primero.
window.Manos = (function () {
  function activar(W, opc = {}) {
    const { THREE, renderer, scene, camera } = W;
    renderer.xr.enabled = true;
    scene.add(camera);                       // en pantalla la pieza se cuelga de la cámara: tiene que estar en la escena
    const piezas = [];                       // { obj, r, pose, inicio, alAgarrar, alSoltar, alUsar, padre }
    const manos = [];                        // { c, pieza, usando }
    const vTmp = new THREE.Vector3(), vTmp2 = new THREE.Vector3();

    const dato = obj => piezas.find(p => p.obj === obj) || null;
    const manoDe = obj => manos.find(m => m.pieza && m.pieza.obj === obj) || null;
    const enMano = obj => !!manoDe(obj) || !!(pantalla.pieza && pantalla.pieza.obj === obj);
    const usando = obj => { const m = manoDe(obj); return m ? !!m.usando : (pantalla.pieza && pantalla.pieza.obj === obj && pantalla.usando); };
    const pantalla = { pieza: null, usando: false };

    // Registra una pieza que se puede tomar con la mano.
    //   pose = [x, y, z, rx, ry, rz] → cómo queda sujeta (posición y giro dentro de la mano)
    function agarrable(obj, o = {}) {
      obj.updateWorldMatrix(true, false);
      const p = { obj, r: o.r ?? 0.3, pose: o.pose || [0, -0.08, -0.12, -0.5, 0, 0], padre: obj.parent,
        inicio: { p: obj.position.clone(), q: obj.quaternion.clone() },
        alAgarrar: o.alAgarrar, alSoltar: o.alSoltar, alUsar: o.alUsar };
      piezas.push(p); return obj;
    }

    function colgar(destino, p) {
      destino.attach(p.obj);
      p.obj.position.set(p.pose[0], p.pose[1], p.pose[2]);
      p.obj.rotation.set(p.pose[3], p.pose[4], p.pose[5]);
    }

    // Toma la pieza: en el visor con la mano indicada (o la derecha), en pantalla colgada de la cámara.
    function tomar(obj, mano) {
      const p = dato(obj); if (!p || enMano(obj)) return false;
      if (renderer.xr.isPresenting) {
        const m = mano || manos.find(m => !m.pieza) || manos[0]; if (!m) return false;
        m.pieza = p; m.usando = false; colgar(m.c, p);
      } else { if (pantalla.pieza) soltar(pantalla.pieza.obj); pantalla.pieza = p; pantalla.usando = false; colgar(camera, p); }
      p.alAgarrar && p.alAgarrar();
      return true;
    }

    // Suelta la pieza. Sin `donde` vuelve al lugar y al padre donde nació (nada se queda flotando en el aire).
    function soltar(obj, donde) {
      const p = dato(obj); if (!p) return;
      const m = manoDe(obj); if (m) { m.pieza = null; m.usando = false; }
      if (pantalla.pieza === p) { pantalla.pieza = null; pantalla.usando = false; }
      if (donde) { donde.attach(p.obj); }
      else { (p.padre || scene).attach(p.obj); p.obj.position.copy(p.inicio.p); p.obj.quaternion.copy(p.inicio.q); }
      p.alSoltar && p.alSoltar();
    }

    const usar = (p, si, m) => { if (!p || p.__usando === si) return; p.__usando = si; if (m) m.usando = si; else pantalla.usando = si; p.alUsar && p.alUsar(si); };

    // Pieza libre al alcance de este control (para decidir si el gatillo toma algo o es del rayo del panel)
    function alAlcance(c) {
      c.getWorldPosition(vTmp);
      let cerca = null, dmin = Infinity;
      for (const p of piezas) {
        if (enMano(p.obj) || !p.obj.visible) continue;
        p.obj.getWorldPosition(vTmp2); const d = vTmp.distanceTo(vTmp2);
        if (d <= p.r && d < dmin) { dmin = d; cerca = p; }
      }
      return cerca;
    }

    // ---------------------------------------------------------------- controles del visor (y manos libres)
    [0, 1].forEach(i => {
      const c = renderer.xr.getController(i); scene.add(c);
      const m = { c, pieza: null, usando: false }; manos.push(m);
      const tomarOUsar = () => {
        if (m.pieza) { usar(m.pieza, true, m); return; }         // ya trae algo: el gatillo lo USA
        const p = alAlcance(c); if (p) tomar(p.obj, m);
      };
      c.addEventListener('selectstart', tomarOUsar);
      c.addEventListener('selectend', () => { if (m.pieza) usar(m.pieza, false, m); });
      c.addEventListener('squeezestart', () => { if (!m.pieza) { const p = alAlcance(c); if (p) tomar(p.obj, m); } });
    });

    // xr.js pregunta esto antes de usar el gatillo para el rayo del panel: si la mano está ocupada o hay algo
    // al alcance, el gatillo es para agarrar/usar y el rayo no debe tocar nada más.
    function ocupado(c) { const m = manos.find(m => m.c === c); if (!m) return false; return !!m.pieza || !!alAlcance(c); }

    // ---------------------------------------------------------------- pantalla (sin visor)
    // Tocar la pieza la toma. Para usarla, la celda llama manos.usarPantalla(true/false) desde su botón.
    const usarPantalla = si => { if (pantalla.pieza) usar(pantalla.pieza, si, null); };

    const api = { agarrable, tomar, soltar, enMano, usando, ocupado, usarPantalla, alAlcance,
      pieza: () => (manos.find(m => m.pieza) || pantalla).pieza, piezas,
      // mano (o cámara) que trae la pieza: de ahí sale el chorro del extintor
      origen: obj => { const m = manoDe(obj); return m ? m.c : (pantalla.pieza && pantalla.pieza.obj === obj ? camera : null); } };
    W.manos = api; return api;
  }
  return { activar };
})();
