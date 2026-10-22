// Piezas comunes del Edificio LOTO (bloqueo y etiquetado de energías peligrosas). Script CLÁSICO (no módulo).
// Da: dispositivos (candado, tarjeta, detector de ausencia de tensión), equipo (tablero con palanca, válvula,
// acumulador, volante, carga elevada, botonera), y dos pasos reusables: pasoTocar() y ordenar().
//
// Reglas que esta carpeta respeta (motor/xr.js y el Quest 3S):
//  · Nada de alert/confirm/prompt: todo sale en el panel (W.aviso, W.pregunta, Riesgo.decidir) que el panel 3D lee.
//  · Nada de requestAnimationFrame para lógica: se usa W.animar y W.cuadro (dentro de VR el rAF de la ventana no corre).
//
// MODELOS (21/10/2026): cada pieza se dibuja primero con geometría propia y, si el kit .glb carga, se le encima el
// modelo real y se oculta la geometría. Así el mundo funciona igual sin conexión o si el kit falla.
//   assets/loto/loto.glb            → tablero, palanca, valvula, maquina, banda, brazo, candado (Kenney/Poly Pizza, CC0 y CC-BY)
//   assets/seguridad-electrica/…glb → palanca, caja_fusibles, cable, llave (CC0 y CC-BY)
//   motor/props.js                  → candado, pinza multibloqueo, etiqueta, estación LOTO, tapete, guantes (propios CERS)
// Licencias y autores: assets/INVENTARIO_ASSETS.csv y assets/CREDITOS.md (se muestran en mundos/informacion/creditos.html).
// El mundo llama una vez a LOTO.init3D(W, {Kit3D, Props}) antes de crear las piezas.
//
// Fundamento normativo: PENDIENTE DE VERIFICAR en el DOF y en la STPS (ver ANEXO_TECNICO_LOTO.md §8.2). Mientras tanto
// las fuentes se muestran con la marca «vigencia por verificar» y los pasos del procedimiento se atribuyen al
// procedimiento de la máquina (ficticio), que es lo que manda cuando no hay una secuencia universal.
(function () {
  const PV = '(vigencia y numerales por verificar en el DOF)';
  const N04 = 'NOM-004-STPS-1999 ' + PV;                      // maquinaria y equipo
  const N29 = 'NOM-029-STPS-2011 ' + PV;                      // mantenimiento de instalaciones eléctricas
  const PROC = 'Procedimiento LOTO de la máquina [FICTICIO]';
  const BP = 'Buena práctica técnica (no obligatoria en México salvo que la empresa la adopte)';
  const FIC = 'Planta, máquinas y personas ficticias, para ejercicio didáctico.';
  const COL = { candado: 0xC62828, tarjeta: 0xD32F2F, acero: 0x9AA6AD, tablero: 0x78909C, tubo: 0xB0BEC5,
    aceite: 0x37474F, peligro: 0xF2C94C, ok: 0x2E7D32, cable: 0x263238 };

  // ---------------------------------------------------------------- modos de uso (anexo §5)
  //   'practica'  guiada: resalta el objeto que toca (el de siempre)
  //   'evaluacion': no resalta nada; la persona tiene que saber qué sigue
  //   'demostracion': igual que práctica, para que la persona instructora enseñe el caso
  let modo = 'practica';
  const setModo = m => { modo = m || 'practica'; return modo; };
  // Resalta solo cuando hay guía: en evaluación la persona tiene que ubicar las cosas por su cuenta.
  const guiar = (W, lista) => W.resaltar(modo === 'evaluacion' ? [] : (lista || []));

  // ---------------------------------------------------------------- recorrido a pie
  // Las celdas se recorren caminando (anexo §5 y §11): toca el piso para caminar, toca un objeto lejano y el avatar
  // va hasta él antes de inspeccionarlo. Además habilita el botón 🧍 de vista a la altura de los ojos.
  function aPie(W, N, { inicio = [0, 2.0], obstaculos = [], ancho = 13, fondo = 11, retraso = 300 } = {}) {
    // Se difiere 300 ms, como en mundos/industria/riesgo_*: la escena ya está armada y los obstáculos tienen tamaño.
    // Muros = solo las cajas altas del entorno (el piso y las armaduras del techo no estorban al caminar).
    setTimeout(() => W.recorrido({ piso: N.piso, obstaculos,
      muros: N.entorno.filter(m => m.geometry && m.geometry.type === 'BoxGeometry' && m.geometry.parameters.height > 1),
      limites: { x0: -ancho / 2 + 0.6, x1: ancho / 2 - 0.6, z0: -fondo + 3.6, z1: 2.4 },
      inicio, ry: Math.PI, camara: [3.2, 5.6], alcance: 1.7 }), retraso);
  }

  // ---------------------------------------------------------------- modelos 3D (kits .glb y props propios)
  const D = { kit: null, P: null, THREE: null };
  // Se llama UNA vez por mundo, antes de crear las piezas:  LOTO.init3D(W, { Kit3D, Props })
  function init3D(W, { Kit3D, Props, base = '../../../' } = {}) {
    D.THREE = W.THREE;
    if (Props) { try { D.P = Props(W.THREE); } catch (e) { console.warn('props.js no disponible', e); } }
    if (Kit3D) { D.kit = new Kit3D(W.THREE, base); D.kit.precargar(['loto', 'seguridad-electrica']); }
    return D;
  }
  // Encima el modelo del kit sobre la pieza y oculta la geometría de respaldo cuando llega.
  //   modelo(g, 'loto', 'tablero', { alto: 1.8, y: 0, ry: 0, ocultar: [malla1, malla2] })
  function modelo(g, kit, clave, { alto, y = 0, z = 0, x = 0, ry = 0, ocultar = [] } = {}) {
    if (!D.kit) return g;
    D.kit.pieza(kit, clave).then(m => {
      if (!m || !m.children.length) return;
      if (alto) { const b = new D.THREE.Box3().setFromObject(m), h = b.max.y - b.min.y;
        if (h > 0.001) m.scale.multiplyScalar(alto / h); }
      m.position.set(x, y, z); m.rotation.y = ry; g.add(m);
      ocultar.forEach(o => { if (o) o.visible = false; });
    }).catch(() => { /* sin kit se queda la geometría propia: el mundo sigue jugable */ });
    return g;
  }
  // Pieza de motor/props.js (propias CERS), ya a escala real; devuelve null si props.js no cargó.
  const prop = (nombre, ...args) => (D.P && D.P[nombre] ? D.P[nombre](...args) : null);

  // ---------------------------------------------------------------- dispositivos de bloqueo
  // Candado personal: se crea GUARDADO (en la caja de herramienta) y se coloca con candado.colocar(punto).
  function candado(W, { x = 0, y = 0, z = 0, color = COL.candado, tipo = 'candado', escala = 1 } = {}) {
    const { THREE, caja } = W; const g = new THREE.Group(); g.position.set(x, y, z); g.scale.setScalar(escala); W.scene.add(g);
    const cuerpo = caja(0.09, 0.12, 0.045, color, 0, 0, 0, g);                                       // respaldo
    const arco = new THREE.Mesh(new THREE.TorusGeometry(0.035, 0.009, 8, 20, Math.PI), W.M(COL.acero));
    arco.position.y = 0.06; g.add(arco);
    const boca = caja(0.022, 0.022, 0.05, 0x263238, 0, -0.01, 0.025, g);                             // bocallave
    const real = prop('candado', color);                       // candado de bloqueo personal (motor/props.js)
    if (real) { real.scale.setScalar(2.2); real.position.y = -0.06; g.add(real); [cuerpo, arco, boca].forEach(o => o.visible = false); }
    W.tocable(g, tipo, 0.42);
    return { g, colocar: (px, py, pz) => { g.position.set(px, py, pz); }, tipo };
  }

  // Tarjeta de identificación (no sustituye al candado: eso es justo lo que el simulador debe enseñar)
  function tarjeta(W, { x = 0, y = 0, z = 0, tipo = 'tarjeta', texto = 'NO OPERAR' } = {}) {
    const { THREE, caja, letrero } = W; const g = new THREE.Group(); g.position.set(x, y, z); W.scene.add(g);
    const cart = caja(0.1, 0.16, 0.006, COL.tarjeta, 0, 0, 0, g);                                    // respaldo
    const t = letrero(texto, 0.095, 0.045, '#FFFFFF', '#B71C1C'); t.position.set(0, 0.035, 0.005); g.add(t);
    const ojal = caja(0.012, 0.012, 0.012, 0xFFFFFF, 0, 0.085, 0, g);
    const real = prop('etiqueta');                             // «PELIGRO · NO OPERAR · EQUIPO BLOQUEADO»
    if (real) { real.scale.setScalar(1.5); real.position.y = -0.1; g.add(real); [cart, t, ojal].forEach(o => o.visible = false); }
    W.tocable(g, tipo, 0.4);
    return { g, colocar: (px, py, pz) => g.position.set(px, py, pz), tipo };
  }

  // Detector de ausencia de tensión. Se comprueba ANTES y DESPUÉS de medir (es el paso que más se omite).
  function detector(W, { x = 0, y = 0, z = 0, tipo = 'detector' } = {}) {
    const { THREE, caja, cil } = W; const g = new THREE.Group(); g.position.set(x, y, z); W.scene.add(g);
    caja(0.055, 0.17, 0.035, 0xFFB300, 0, 0, 0, g);
    const punta = cil(0.008, 0.09, COL.acero, 0, 0.13, 0, g); punta.name = 'punta';
    const luz = W.esfera(0.018, 0xB71C1C, 0, 0.055, 0.025, g); luz.material.emissive = new THREE.Color(0x000000);
    W.tocable(g, tipo, 0.42);
    return { g, luz, encender: on => { luz.material.emissive.setHex(on ? 0xFF1744 : 0x000000); luz.material.color.setHex(on ? 0xFF5252 : 0xB71C1C); }, tipo };
  }

  // ---------------------------------------------------------------- equipo de la celda
  // Tablero con interruptor de palanca. abierto=false → energizado. Devuelve {g, palanca, abrir(), punto:[x,y,z]}
  function tablero(W, { x = 0, z = 0, ry = 0, rotulo = 'TABLERO TB-7' } = {}) {
    const { THREE, caja, letrero } = W; const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = ry; W.scene.add(g);
    const gab = caja(0.9, 1.6, 0.35, COL.tablero, 0, 0.9, 0, g);                                     // respaldo
    const frente = caja(0.8, 1.4, 0.03, 0x90A4AE, 0, 0.9, 0.18, g);
    modelo(g, 'loto', 'tablero', { alto: 1.8, ocultar: [gab, frente] });                             // gabinete real (CC0)
    const r = letrero(rotulo, 0.7, 0.14, '#102A43'); r.position.set(0, 1.58, 0.19); g.add(r);
    const piloto = W.esfera(0.035, 0xFF5252, 0.3, 1.35, 0.2, g); piloto.material.emissive = new THREE.Color(0xAA0000);
    const palanca = new THREE.Group(); palanca.position.set(-0.15, 1.1, 0.2); g.add(palanca);
    const vastago = caja(0.07, 0.26, 0.06, 0x212121, 0, 0.1, 0, palanca);
    const mango = caja(0.1, 0.1, 0.1, COL.peligro, 0, 0.22, 0.01, palanca);
    modelo(palanca, 'seguridad-electrica', 'palanca', { alto: 0.3 });                                // interruptor real (CC0)
    const et = letrero('I / O', 0.16, 0.08, '#FFFFFF', '#102A43'); et.position.set(0.12, 1.1, 0.2); g.add(et);
    W.tocable(palanca, 'palanca', 0.5);
    const punto = new THREE.Vector3(-0.15, 1.1, 0.26); g.localToWorld(punto);
    return { g, palanca, mango, piloto, punto: [punto.x, punto.y, punto.z],
      abrir: async () => { await W.animar(500, k => { palanca.rotation.x = -1.15 * k; }); piloto.material.emissive.setHex(0x000000); piloto.material.color.setHex(0x424242); } };
  }

  // Válvula de bola con manija. cerrar() la gira 90°.
  function valvula(W, { x = 0, y = 1.0, z = 0, ry = 0, color = COL.tubo, rotulo = '', tipo = 'valvula' } = {}) {
    const { THREE, cil, caja, letrero } = W; const g = new THREE.Group(); g.position.set(x, y, z); g.rotation.y = ry; W.scene.add(g);
    const cuerpo = cil(0.075, 0.2, color, 0, 0, 0, g); cuerpo.rotation.z = Math.PI / 2;
    modelo(g, 'loto', 'valvula', { alto: 0.34, y: -0.17, ocultar: [cuerpo] });                       // válvula en tubería (CC0)
    const manija = new THREE.Group(); manija.position.y = 0.08; g.add(manija);
    caja(0.26, 0.035, 0.05, COL.candado, 0.07, 0.03, 0, manija);
    cil(0.016, 0.07, COL.acero, 0, 0, 0, manija);
    if (rotulo) { const r = letrero(rotulo, 0.3, 0.09, '#102A43'); r.position.set(0, 0.22, 0); g.add(r); }
    W.tocable(manija, tipo, 0.45);
    const punto = new THREE.Vector3(0.07, 0.11, 0); g.localToWorld(punto);
    return { g, manija, tipo, punto: [punto.x, punto.y, punto.z],
      cerrar: async () => { await W.animar(500, k => { manija.rotation.y = Math.PI / 2 * k; }); } };
  }

  // Acumulador hidráulico / tanque de aire con purga. purgar() lo despresuriza (manómetro a cero).
  function acumulador(W, { x = 0, z = 0, alto = 1.1, color = 0x546E7A, rotulo = 'ACUMULADOR AC-1' } = {}) {
    const { THREE, cil, esfera, letrero } = W; const g = new THREE.Group(); g.position.set(x, 0, z); W.scene.add(g);
    cil(0.22, alto, color, 0, alto / 2 + 0.2, 0, g); esfera(0.22, color, 0, alto + 0.2, 0, g);
    cil(0.26, 0.2, COL.acero, 0, 0.1, 0, g);
    const aguja = W.caja(0.015, 0.1, 0.01, 0xC62828, 0, 0, 0.001, g); aguja.position.set(0.0, alto * 0.75, 0.235);
    const car = letrero('MPa', 0.16, 0.09, '#FFFFFF', '#102A43'); car.position.set(0, alto * 0.75, 0.232); g.add(car);
    const r = letrero(rotulo, 0.5, 0.11, '#B45309'); r.position.set(0, alto + 0.52, 0); g.add(r);
    const purga = cil(0.03, 0.14, COL.candado, 0.0, 0.32, 0.26, g); purga.rotation.x = Math.PI / 2;
    W.tocable(purga, 'purga', 0.45);
    return { g, purga, aguja, despresurizar: async () => { await W.animar(900, k => { aguja.rotation.z = -1.4 * k; }); } };
  }

  // Volante de inercia: sigue girando aunque se corte la energía (se detiene solo con detener()).
  function volante(W, { x = 0, y = 0.9, z = 0, r = 0.42 } = {}) {
    const { THREE, cil } = W; const g = new THREE.Group(); g.position.set(x, y, z); W.scene.add(g);
    const rueda = cil(r, 0.08, COL.acero, 0, 0, 0, g); rueda.rotation.x = Math.PI / 2;
    for (let i = 0; i < 4; i++) { const rayo = W.caja(r * 1.7, 0.05, 0.05, 0x607D8B, 0, 0, 0, g); rayo.rotation.z = i * Math.PI / 4; }
    let vel = 5.2; W.cuadro.push(() => { g.rotation.z -= vel * 0.016; });
    W.tocable(rueda, 'volante', 0.6);
    return { g, rueda, girando: () => vel > 0.05,
      detener: async () => { const v0 = vel; await W.animar(2600, k => { vel = v0 * (1 - k); }); vel = 0; } };
  }

  // Carga elevada sostenida por el mecanismo: bajarla o soportarla es controlar la energía gravitacional.
  function cargaElevada(W, { x = 0, z = 0, y = 1.6 } = {}) {
    const { THREE, caja } = W; const g = new THREE.Group(); g.position.set(x, y, z); W.scene.add(g);
    const bloque = caja(0.7, 0.3, 0.6, 0x8D6E63, 0, 0, 0, g);
    W.tocable(bloque, 'carga', 0.7);
    const soporte = caja(0.12, 1.4, 0.12, COL.peligro, x, 0.7, z + 0.45); soporte.visible = false;
    return { g, bloque, soporte,
      bajar: async () => { await W.animar(1400, k => { g.position.y = y - (y - 0.45) * k; }); },
      apuntalar: async () => { soporte.visible = true; await W.animar(500, k => { soporte.scale.y = k; }); } };
  }

  // Equipo con botonera de paro y arranque (el intento de arranque confirma la condición segura).
  function equipo(W, { x = 0, z = 0, ry = 0, rotulo = 'PRENSA P-02', modeloEquipo = 'maquina' } = {}) {
    const { THREE, caja, cil, letrero } = W; const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = ry; W.scene.add(g);
    const base1 = caja(1.5, 1.0, 0.9, 0x607D8B, 0, 0.5, 0, g), base2 = caja(1.2, 0.5, 0.7, 0x78909C, 0, 1.2, 0, g);
    const mot = cil(0.22, 0.5, 0x455A64, 0.55, 1.25, 0, g); mot.rotation.z = Math.PI / 2;
    modelo(g, 'loto', modeloEquipo, { alto: 1.7, ocultar: [base1, base2] });                         // máquina real (CC0)
    const r = letrero(rotulo, 0.7, 0.14, '#102A43'); r.position.set(0, 1.62, 0); g.add(r);
    const bot = new THREE.Group(); bot.position.set(-0.45, 1.1, 0.46); g.add(bot);
    caja(0.3, 0.22, 0.08, 0x37474F, 0, 0, 0, bot);
    const paro = cil(0.055, 0.04, 0xC62828, -0.07, 0, 0.05, bot); paro.rotation.x = Math.PI / 2;
    const arranque = cil(0.045, 0.04, 0x2E7D32, 0.07, 0, 0.05, bot); arranque.rotation.x = Math.PI / 2;
    W.tocable(paro, 'paro', 0.3); W.tocable(arranque, 'arranque', 0.3);
    const zona = caja(0.9, 0.5, 0.5, 0xFFFFFF, 0, 1.25, 0.5, g); zona.material.transparent = true; zona.material.opacity = 0.0;
    W.tocable(zona, 'intervenir', 0.9);                                        // "meter la mano": trampa de error crítico
    return { g, paro, arranque, zona, motor: mot };
  }

  // ---------------------------------------------------------------- pasos reusables
  // Paso que se resuelve TOCANDO el objeto correcto. Las trampas marcan error (crítico por omisión).
  //   pasoTocar(W, {titulo, texto, fuente, tipo, resaltar:[...], alTocar(), exito, pista, trampas:[{tipo,txt,f,critico}]})
  function pasoTocar(W, o) {
    return { titulo: o.titulo, texto: o.texto, fuente: o.fuente, puntos: o.puntos ?? 10,
      // En modo evaluación no se resalta nada: la persona tiene que saber qué tocar (anexo §5, modos de uso).
      iniciar() { W.resaltar(modo === 'evaluacion' ? [] : (o.resaltar || [])); o.alIniciar && o.alIniciar(); },
      tocar(x) {
        const t = x.userData.tipo;
        if (t === o.tipo) { if (o.alTocar) o.alTocar(); else { W.bien(o.exito || 'Hecho.', o.fuente); W.siguiente(); } return; }
        const tr = (o.trampas || []).find(p => p.tipo === t);
        if (tr) { if (tr.una && tr._d) return; tr._d = true; W.mal(tr.txt, tr.f, tr.critico !== false); tr.alFallar && tr.alFallar(); return; }
        W.toast('info', o.pista || 'Eso no es lo que toca ahora. Lee el panel.');
      } };
  }

  // Añade trampas a un paso que ya tiene su propio tocar() (p. ej. el «encuentra» de Riesgo): meter la mano al equipo
  // tiene que ser error crítico en CUALQUIER paso, no solo en los que se resuelven tocando.
  function conTrampas(W, paso, trampas) {
    const orig = paso.tocar && paso.tocar.bind(paso);
    paso.tocar = o => {
      const tr = trampas.find(p => p.tipo === o.userData.tipo);
      if (tr) { if (tr.una && tr._d) return; tr._d = true; W.mal(tr.txt, tr.f, tr.critico !== false); tr.alFallar && tr.alFallar(); return; }
      orig && orig(o);
    };
    return paso;
  }

  // Trampa de error crítico que vale en TODOS los pasos de una celda: intervenir el equipo antes de tiempo.
  const trampaIntervenir = (W, extra = {}) => ({ tipo: 'intervenir', critico: true,
    txt: extra.txt || 'Metiste la mano al equipo sin terminar el bloqueo y la verificación. En la realidad esto es lo que amputa y mata.',
    f: extra.f || PROC, ...extra });

  // Minijuego de ordenar: lista = textos EN ORDEN CORRECTO. Se toca uno por uno; equivocarse resta.
  function ordenar(W, { titulo, lista, fuente, contexto = '', alTerminar }) {
    const orden = lista.map((t, i) => ({ t, i })), mezcla = barajar(orden);
    let n = 0; const puestos = [];
    const pinta = () => {
      W.$('mCont').innerHTML = `<h2>${titulo}</h2>${contexto ? `<p>${contexto}</p>` : ''}
        <p><b>${n}/${lista.length}</b> · Toca el paso que sigue.</p>
        <ol id="hechos" style="margin:.3rem 0 .8rem">${puestos.map(t => `<li>${t}</li>`).join('')}</ol><div id="ops"></div>`;
      mezcla.forEach(o => { if (o.i < n) return;
        const b = document.createElement('button'); b.className = 'op'; b.textContent = o.t;
        b.onclick = () => {
          if (o.i === n) { n++; puestos.push(o.t); W.bien('Va en ese orden.', fuente);
            if (n === lista.length) { W.$('modal').style.display = 'none'; setTimeout(alTerminar, 500); return; } pinta(); }
          else W.mal(`Ese paso todavía no: antes va «${lista[n]}».`, fuente);
        };
        W.$('ops').appendChild(b); });
    };
    pinta(); W.$('modal').style.display = 'flex';
  }
  const barajar = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  // Estación de bloqueo de pared (tablero con candados, pinza multibloqueo y etiquetas). Decorado: no es tocable.
  function estacion(W, { x = 0, z = 0, ry = 0 } = {}) {
    const g = new W.THREE.Group(); g.position.set(x, 0, z); g.rotation.y = ry; W.scene.add(g);
    const real = prop('estacionLOTO');
    if (real) g.add(real);
    else { W.caja(0.9, 1.0, 0.06, 0xF4F7FA, 0, 1.3, 0, g); W.caja(0.9, 0.14, 0.07, COL.candado, 0, 1.73, 0, g); }
    return g;
  }

  // Caja de herramienta con los dispositivos, al alcance de la mano
  function mesaDispositivos(W, { x = 0, z = 0 } = {}) {
    const { caja } = W; const tapa = caja(1.0, 0.06, 0.6, 0xB89B7A, x, 0.78, z);
    caja(0.08, 0.78, 0.08, 0x8D6E63, x - 0.42, 0.39, z); caja(0.08, 0.78, 0.08, 0x8D6E63, x + 0.42, 0.39, z);
    return { x, z, y: 0.84, tapa };   // tapa = obstáculo para el recorrido a pie
  }

  // PENDIENTE (21/10/2026): aPie() y setModo() ya están listos pero todavía NO se llaman desde las celdas.
  // Falta: en cada celda, tras crear la escena → aPie(W, N, { obstaculos: [EQ.g, TB.g, …] }), y en W.inicio()
  // ofrecer los casos 'practica' | 'evaluacion' | 'demostracion' llamando setModo(sel) dentro de alIniciar.
  window.LOTO = { PV, N04, N29, PROC, BP, FIC, COL, init3D, modelo, prop, setModo, guiar, aPie, candado, tarjeta, detector, tablero,
    valvula, acumulador, volante, cargaElevada, equipo, estacion, pasoTocar, conTrampas, trampaIntervenir,
    ordenar, barajar, mesaDispositivos };
})();
