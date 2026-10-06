// Utilidades de los 4 escenarios NOM-035 (edificio Laboral STPS). Script clásico; requiere motor.js y ../comun.js.
// Todos los escenarios se construyen alrededor del origen: en el visor la persona aparece de pie en (0, 0) mirando a -z.
// Fuentes: NOM-035-STPS-2018 (DOF 23/10/2018) y demás del registro de fuentes (consulta 05/10/2026).
(function () {
  const PALETA = { petroleo: '#1F5F6B', salvia: '#4F8A7C', noche: '#16323F', rojo: '#B03A2E', ambar: '#C9A227' };

  // Sala/oficina de 9 × 8 m con piso (para teletransporte), muros, ventanas y luz cálida. Devuelve {piso, entorno}.
  function sala(W, { ancho = 9, fondo = 8, piso = 0xD9D4CB, muro = 0xEEF3F1, rotulo = '' } = {}) {
    const { THREE, scene, caja, M, letrero } = W;
    const p = new THREE.Mesh(new THREE.PlaneGeometry(ancho, fondo), M(piso)); p.rotation.x = -Math.PI / 2; p.position.z = -fondo / 2 + 2; scene.add(p);
    const z0 = -fondo + 2, entorno = [p];
    entorno.push(caja(ancho, 3, 0.1, muro, 0, 1.5, z0), caja(0.1, 3, fondo, muro, -ancho / 2, 1.5, z0 + fondo / 2), caja(0.1, 3, fondo, muro, ancho / 2, 1.5, z0 + fondo / 2));
    for (const x of [-2.6, 0, 2.6]) entorno.push(caja(1.6, 1.0, 0.04, 0xBFE0EA, x, 1.9, z0 + 0.07));   // ventanas
    if (rotulo) { const r = letrero(rotulo, 3.4, 0.36, PALETA.noche); r.position.set(0, 2.75, z0 + 0.1); scene.add(r); entorno.push(r); }
    const luz = new THREE.PointLight(0xFFF1DC, 0.8, 14); luz.position.set(0, 2.8, -1.5); scene.add(luz);
    return { piso: p, entorno };
  }

  function escritorio(W, x, z, ry = 0, color = 0xB89B7A) {
    const { THREE, scene, caja } = W; const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = ry; scene.add(g);
    caja(1.3, 0.05, 0.7, color, 0, 0.75, 0, g); for (const [a, b] of [[-0.6, -0.3], [0.6, -0.3], [-0.6, 0.3], [0.6, 0.3]]) caja(0.05, 0.75, 0.05, 0x6D5A45, a, 0.375, b, g);
    caja(0.5, 0.32, 0.03, 0x263238, 0, 1.0, -0.2, g); return g;
  }

  // Globo de diálogo (letrero) sobre un punto
  function globo(W, texto, x, y, z, fondo = '#FFFFFF', color = '#16323F', ancho) {
    const l = W.letrero(texto, ancho || Math.max(0.8, texto.length * 0.06), 0.24, fondo, color); l.position.set(x, y, z); W.scene.add(l); return l;
  }

  // Objeto "situación" tocable: una base y un ícono grande (letrero) que sirve de zona de toque.
  function situacion(W, { x, z, y = 1.2, tipo, icono, etiqueta, color = PALETA.petroleo }) {
    const { THREE, scene, letrero, tocable } = W;
    const ic = letrero(icono, 0.42, 0.42, '#FFFFFF', '#000'); ic.position.set(x, y, z); ic.lookAt(0, y, 0.5); scene.add(ic);
    const marco = new THREE.Mesh(new THREE.TorusGeometry(0.27, 0.025, 8, 32), W.M(new THREE.Color(color))); marco.position.copy(ic.position); marco.lookAt(0, y, 0.5); scene.add(marco);
    tocable(marco, tipo, 0.6);
    let rot = null; if (etiqueta) { rot = letrero(etiqueta, Math.max(0.9, etiqueta.length * 0.055), 0.16, color); rot.position.set(x, y + 0.4, z); rot.lookAt(0, y + 0.4, 0.5); rot.visible = false; scene.add(rot); }
    return { ic, marco, rot };
  }

  // Paso "encuentra las N situaciones": toca las correctas; las distractoras restan. items: {tipo, nombre, fb, f, obj}
  function encuentra(W, { titulo, texto, fuente, buenas, malas, alTerminar }) {
    const halladas = new Set();
    return { titulo, texto: texto + ` <b id="nEnc">(0/${buenas.length})</b>`, fuente, puntos: buenas.length * 10,
      iniciar() { W.resaltar([]); },
      tocar(o) {
        const t = o.userData.tipo; const b = buenas.find(x => x.tipo === t), m = malas.find(x => x.tipo === t);
        if (b && !halladas.has(t)) { halladas.add(t); W.bien(`${b.nombre}. ${b.fb}`, b.f); if (b.obj && b.obj.rot) b.obj.rot.visible = true;
          if (b.obj) b.obj.marco.material.color.set(0x2E7D32);
          const n = document.getElementById('nEnc'); if (n) n.textContent = `(${halladas.size}/${buenas.length})`;
          if (halladas.size === buenas.length) setTimeout(() => (alTerminar ? alTerminar() : W.siguiente()), 900); }
        else if (m && !m._d) { m._d = true; W.mal(m.msg || `${m.nombre}: no es un factor de riesgo. ${m.fb}`, m.f); if (m.obj && m.obj.rot) m.obj.rot.visible = true; }
      } };
  }

  // Paso de decisión con opciones {t, ok, crit, fb, f}
  const decide = (titulo, contexto, ops, fuente) => ({ titulo, texto: contexto, fuente, iniciar() {
    window.Laboral.decidir(this._W, titulo, ops, () => this._W.siguiente(), contexto); } });
  // Paso "toca X y luego decide"
  const tocaYDecide = (titulo, texto, objetivo, tipo, pregunta, ops, fuente) => ({ titulo, texto, fuente,
    iniciar() { this._W.resaltar([objetivo]); },
    tocar(o) { if (o.userData.tipo !== tipo || this._h) return; this._h = true; this._W.resaltar([]);
      window.Laboral.decidir(this._W, pregunta, ops, () => this._W.siguiente()); } });
  // Paso "toca X y luego responde una pregunta (opción múltiple o varias correctas)"
  const tocaYPregunta = (titulo, texto, objetivo, tipo, pregunta, ops, correctas, fuente, multiple, retro) => ({ titulo, texto, fuente,
    iniciar() { this._W.resaltar([objetivo]); },
    tocar(o) { if (o.userData.tipo !== tipo || this._h) return; this._h = true; this._W.resaltar([]);
      this._W.pregunta(pregunta, ops, correctas, fuente, () => this._W.siguiente(), multiple, retro); } });
  // Asigna W a los pasos creados con decide/tocaYDecide/tocaYPregunta
  const con = (W, pasos) => pasos.map(p => Object.assign(p, { _W: W }));

  window.Nom035 = { PALETA, sala, escritorio, globo, situacion, encuentra, decide, tocaYDecide, tocaYPregunta, con };
})();
