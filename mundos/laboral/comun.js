// Utilidades comunes de los sub-mundos del área LABORAL (inspección STPS). Script clásico (funciona con file://).
// Requiere el motor: ../../../motor/motor.js. Uso: Laboral.persona(W, opciones), Laboral.decidir(W, ...), etc.
(function () {
  // Persona sencilla (cuerpo + cabeza + piernas). Devuelve {g, torso, cabeza}. El torso es el que se resalta/toca.
  function persona(W, { x = 0, z = 0, ry = 0, ropa = 0x2E75B6, piel = 0xE0B48F, pantalon = 0x37474F, alto = 1, gafete = false, etiqueta = '', tipo = '' } = {}) {
    const { THREE, scene, capsula, esfera, caja } = W;
    const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = ry; scene.add(g);
    const pierna1 = capsula(0.075, 0.55, pantalon); pierna1.position.set(-0.09, 0.42 * alto, 0); g.add(pierna1);
    const pierna2 = capsula(0.075, 0.55, pantalon); pierna2.position.set(0.09, 0.42 * alto, 0); g.add(pierna2);
    const torso = capsula(0.2, 0.42, ropa); torso.position.set(0, 1.05 * alto, 0); g.add(torso);
    const cabeza = esfera(0.14, piel, 0, 1.52 * alto, 0, g);
    const brazo1 = capsula(0.055, 0.45, ropa); brazo1.position.set(-0.27, 1.02 * alto, 0); brazo1.rotation.z = 0.12; g.add(brazo1);
    const brazo2 = capsula(0.055, 0.45, ropa); brazo2.position.set(0.27, 1.02 * alto, 0); brazo2.rotation.z = -0.12; g.add(brazo2);
    if (gafete) caja(0.1, 0.13, 0.01, 0xFFFFFF, 0.08, 1.15 * alto, 0.2, g);
    if (etiqueta) { // el letrero siempre mira hacia el frente de la escena (+z), aunque la persona esté girada
      const l = W.letrero(etiqueta, Math.max(0.9, etiqueta.length * 0.055), 0.2, '#1F4E79'); l.position.set(0, 1.85 * alto, 0); l.rotation.y = -ry; g.add(l); }
    if (tipo) W.tocable(torso, tipo, 0.6);
    return { g, torso, cabeza, brazo2 };
  }

  // Decisión con varias opciones; cada opción: {t, ok, crit, fb, f}. Error crítico = resta y cuenta para el reporte.
  function decidir(W, titulo, ops, alAcertar, contexto = '') {
    const $ = W.$;
    $('mCont').innerHTML = `<h2>${titulo}</h2>${contexto ? `<p>${contexto}</p>` : ''}<div id="ops"></div>`;
    ops.forEach(o => {
      const b = document.createElement('button'); b.className = 'op'; b.textContent = o.t;
      b.onclick = () => {
        $('modal').style.display = 'none';
        if (o.ok) { W.bien(o.fb || 'Correcto.', o.f); alAcertar && alAcertar(); }
        else { W.mal(o.fb || 'No es lo correcto.', o.f, !!o.crit); setTimeout(() => decidir(W, titulo, ops, alAcertar, contexto), 900); }
      };
      $('ops').appendChild(b);
    });
    $('modal').style.display = 'flex';
  }

  // Ficha (documento) en el modal: credencial, orden, acta, portal, etc.
  function ficha(W, html, alCerrar, boton = 'Continuar') { W.aviso(`<div class="doc">${html}</div>`, alCerrar, boton); }

  const CSS = `.doc{border:2px solid #1F4E79;border-radius:12px;padding:12px 14px;background:#FAFCFF}
  .doc h3{margin:.1rem 0 .5rem;color:#1F4E79}.doc .ley{font-size:.85rem;background:#FFF8E1;border-left:4px solid #B7791F;padding:6px 8px;margin-top:8px}
  .doc .ok{color:#2E7D32;font-weight:800}.doc .no{color:#C62828;font-weight:800}.doc table td{font-size:.9rem}
  .doc .foto{float:right;width:64px;height:78px;border-radius:8px;background:#CFD8DC;display:flex;align-items:center;justify-content:center;font-size:30px;margin-left:8px}`;
  document.head.insertAdjacentHTML('beforeend', `<style>${CSS}</style>`);

  window.Laboral = { persona, decidir, ficha };
})();
