// CATÁLOGO DEL JUEGO "ANÁLISIS DE RIESGO" (puerta de cada edificio: mundos/riesgo/analisis/index.html?e=<edificio>).
// REGLA PERMANENTE (05/10/2026): cada vez que se abra un edificio, se active un módulo/puerta o se integre una norma o
// curso a un edificio, se agrega aquí su ZONA. 05_herramientas/sincronizar_hospedaje.py avisa qué módulos no tienen zona.
//
// Zona: { id, titulo, modulos: ['area/modulo', ...] (ids de puerta del campus que cubre), escena (texto [FICTICIO]),
//         riesgos: [ { id, prop, icono, nombre, real: true|false, tipo, fb, f } ],
//         principal: id del riesgo que se evalúa,
//         evalua: { f: 'A'-'E', s: 'I'-'IV', pista } → califica con la matriz NOM-031-STPS-2011 8.3
//              ó  { metodo: { pregunta, ops: [{t, ok, fb, f}] } } → cuando una NOM fija su propio método (selector),
//         control: [{t, ok, crit, fb, f}] → la medida más efectiva (jerarquía de controles) }
// prop = objeto 3D de mundos/riesgo/comun.js (Riesgo.prop). Tipos: Físico, Mecánico, Químico, Biológico, Ergonómico,
// Psicosocial, Condición de instalaciones, Incendio / químico-tecnológico, Fenómeno geológico.
// Frecuencias y severidades son EJEMPLOS DIDÁCTICOS [FICTICIO] coherentes con la descripción de la escena.
// Fuentes: 02_fuentes_verificadas/registro_fuentes.md (consulta 05/10/2026).
(function () {
  const RF = 'RFSST (DOF 13/11/2014)', N30 = 'NOM-030-STPS-2009', N17 = 'NOM-017-STPS-2024', N35 = 'NOM-035-STPS-2018';
  const NIOSH = 'NIOSH, Hierarchy of Controls (10/04/2024), referencia', N02 = 'NOM-002-STPS-2010', N33 = 'NOM-033-STPS-2015';
  const N87 = 'NOM-087-SEMARNAT-SSA1-2002', N45 = 'NOM-045-SSA2-2005', LGPC = 'LGPC art. 2';
  const NO_CUIDADO = { t: 'Pedir que "tengan cuidado" y nada más', ok: false, fb: 'Depende solo de la conducta: es el control menos confiable.', f: NIOSH };
  const SOLO_EPP = { t: 'Solo dar equipo de protección personal', ok: false, fb: 'El EPP es transitorio o complementario, no la primera opción.', f: `${N17}, 5.2` };

  window.CATALOGO_RIESGOS = { version: '2026-10-05', edificios: {

  cafeteria: { nombre: 'Cafetería', icono: '☕', color: 0x8D6E63, zonas: [
    { id: 'cocina', titulo: 'Cocina y comedor', modulos: ['cafeteria'],
      escena: 'Hora de la comida en la cafetería del campus: la cocina trabaja a toda velocidad. [FICTICIO]',
      riesgos: [
        { id: 'freidora', prop: 'estufa', icono: '🔥', nombre: 'Freidora con aceite caliente junto al paso', real: true, tipo: 'Físico', fb: 'Contacto con temperaturas extremas: quemaduras.', f: `${N17}, 5.1 d) 1)` },
        { id: 'gas', prop: 'cilindro', icono: '💨', nombre: 'Cilindro de gas con manguera agrietada', real: true, tipo: 'Incendio / químico-tecnológico', fb: 'Fuga que puede provocar incendio o explosión.', f: `${LGPC} fr. XXV` },
        { id: 'piso', prop: 'charco', icono: '💧', nombre: 'Piso mojado sin señal', real: true, tipo: 'Condición de instalaciones', fb: 'Condición física insegura: caída al mismo nivel.', f: `${N30}, 6.1 a)` },
        { id: 'extintor', prop: 'extintor', icono: '🧯', nombre: 'Extintor visible y sin obstáculos', real: false, fb: 'Es una medida de protección.', f: `${N02}, 7.2 b)` },
        { id: 'planta', prop: 'planta', icono: '🪴', nombre: 'Planta decorativa', real: false, fb: 'No es un peligro relevante.', f: `${N30}, 3.8` },
      ],
      principal: 'gas', evalua: { f: 'B', s: 'IV', pista: 'Con el mantenimiento actual una fuga difícilmente ocurre, pero una explosión puede ser mortal.' },
      control: [{ t: 'Cambiar de inmediato la manguera dañada y revisar la instalación de gas (eliminar la falla)', ok: true, fb: 'Se elimina la condición peligrosa en su origen.', f: NIOSH },
        NO_CUIDADO, { t: 'Seguir cocinando y abrir la ventana', ok: false, crit: true, fb: 'Mantiene la fuente de ignición junto a una fuga.', f: `${LGPC} fr. XXV` }] },
  ] },

  biblioteca: { nombre: 'Biblioteca', icono: '📚', color: 0x5D4037, zonas: [
    { id: 'sala', titulo: 'Sala de lectura y acervo', modulos: ['biblioteca'],
      escena: 'La biblioteca guarda leyes y normas en anaqueles altos; hay computadoras de consulta. [FICTICIO]',
      riesgos: [
        { id: 'anaquel', prop: 'anaquel', icono: '📦', nombre: 'Anaquel alto sin anclar con cajas pesadas arriba', real: true, tipo: 'Fenómeno geológico', fb: 'En un sismo puede volcarse o tirar las cajas.', f: `${LGPC} fr. XXIII; ${N30}, 6.1 a)` },
        { id: 'escalera', prop: 'escalera', icono: '🪜', nombre: 'Escalera de mano con un peldaño roto', real: true, tipo: 'Condición de instalaciones', fb: 'Equipo en mal estado: caída.', f: `${RF} art. 3 fr. V` },
        { id: 'multi', prop: 'multicontacto', icono: '🔌', nombre: 'Multicontacto sobrecargado con extensiones', real: true, tipo: 'Físico', fb: 'Riesgo eléctrico y de incendio.', f: `${N17}, 5.1 d) 1)` },
        { id: 'salida', prop: 'senal_salida', icono: '🟩', nombre: 'Señal de salida de emergencia visible', real: false, fb: 'Es una medida de seguridad.', f: `${N02}, 7.16 a)` },
        { id: 'silla', prop: 'silla', icono: '🪑', nombre: 'Silla en buen estado', real: false, fb: 'No es un peligro relevante.', f: `${N30}, 3.8` },
      ],
      principal: 'anaquel', evalua: { f: 'C', s: 'III', pista: 'Los sismos fuertes ocurren pocas veces, pero una caja de libros puede causar una lesión permanente.' },
      control: [{ t: 'Anclar el anaquel al muro y bajar las cajas pesadas a los niveles inferiores', ok: true, fb: 'Control de ingeniería que reduce la vulnerabilidad.', f: `${NIOSH}; ${LGPC} fr. XXXVI (mitigación)` },
        NO_CUIDADO, { t: 'Poner un letrero de "cuidado"', ok: false, fb: 'La señal informa, pero no evita que el anaquel caiga.', f: NIOSH }] },
  ] },

  hospital: { nombre: 'Hospital', icono: '🏥', color: 0x154F90, zonas: [
    { id: 'traslado', titulo: 'Traslado de pacientes', modulos: ['hospital/camilleros'],
      escena: 'Un camillero debe pasar a una paciente de la cama a la camilla. [FICTICIO]',
      riesgos: [
        { id: 'levantar', prop: 'camilla', icono: '🏋️', nombre: 'Levantar a la paciente solo y sin ayuda mecánica', real: true, tipo: 'Ergonómico', fb: 'Sobreesfuerzo y posturas forzadas.', f: `${RF} art. 3 fr. XVI` },
        { id: 'freno', prop: 'camilla', icono: '🛞', nombre: 'Camilla con freno descompuesto', real: true, tipo: 'Condición de instalaciones', fb: 'Equipo en mal estado durante la transferencia.', f: `${RF} art. 3 fr. V` },
        { id: 'fluidos', prop: 'mesa', icono: '🩸', nombre: 'Contacto con fluidos sin guantes', real: true, tipo: 'Biológico', fb: 'Exposición a microorganismos.', f: `${N17}, 5.1 d) 4)` },
        { id: 'lavamanos', prop: 'lavamanos', icono: '🧼', nombre: 'Lavamanos con jabón y toallas', real: false, fb: 'Es una medida de control de infecciones.', f: `${N45}, 10.6.1.1` },
        { id: 'extintor', prop: 'extintor', icono: '🧯', nombre: 'Extintor accesible', real: false, fb: 'Es una medida de protección.', f: `${N02}, 7.2 b)` },
      ],
      principal: 'levantar', evalua: { f: 'D', s: 'II', pista: 'Las transferencias se repiten con periodicidad en cada turno; una lesión de espalda incapacita más de 3 días.' },
      control: [{ t: 'Usar ayudas mecánicas (tabla de transferencia o grúa) y hacer la maniobra en equipo con técnica', ok: true, fb: 'El RFSST pide medidas para mitigar los factores ergonómicos.', f: `${RF} art. 42 fr. II` },
        { t: 'Solo darle una faja y que lo haga solo', ok: false, fb: 'El EPP no sustituye las medidas sobre el puesto.', f: `${N17}, 5.2` }, NO_CUIDADO] },
    { id: 'infecciones', titulo: 'Control de infecciones y RPBI', modulos: ['hospital/higiene_manos_5momentos', 'hospital/higiene_manos_tecnica'],
      escena: 'Sala de curaciones al final del turno. [FICTICIO]',
      riesgos: [
        { id: 'agujas', prop: 'punzo', icono: '💉', nombre: 'Agujas usadas en la basura común', real: true, tipo: 'Biológico', fb: 'Punción y contagio; los punzocortantes van en recipiente rígido.', f: `${N87}, 6.2` },
        { id: 'lleno', prop: 'contenedor_rojo', icono: '🟥', nombre: 'Recipiente de punzocortantes lleno hasta el tope', real: true, tipo: 'Biológico', fb: 'Se llena como máximo al 80%.', f: `${N87}, 6.2.1` },
        { id: 'manos', prop: 'mesa', icono: '🖐️', nombre: 'Atender a otro paciente sin lavarse las manos', real: true, tipo: 'Biológico', fb: 'Transmisión de infecciones.', f: `${N45}, 10.6.1.1` },
        { id: 'lavamanos', prop: 'lavamanos', icono: '🧼', nombre: 'Lavamanos equipado', real: false, fb: 'Es una medida de control.', f: `${N45}, 10.6.1.1` },
        { id: 'tarjeta', prop: 'buzon', icono: '🪧', nombre: 'Tarjeta de precauciones en la puerta', real: false, fb: 'Es una medida de control de infecciones.', f: `${N45}, 10.6.5.1` },
      ],
      principal: 'agujas', evalua: { f: 'D', s: 'II', pista: 'Se repite con periodicidad cuando no hay recipiente cerca; un pinchazo puede requerir tratamiento e incapacidad de más de 3 días.' },
      control: [{ t: 'Recipiente rígido rojo de polipropileno en el punto de uso', ok: true, fb: 'Control de ingeniería que separa el peligro desde su origen.', f: `${N87}, 6.2` },
        { t: 'Solo guantes gruesos al personal de limpieza', ok: false, fb: 'El EPP es complementario; el problema es dónde se desechan.', f: `${N17}, 5.2` }, NO_CUIDADO] },
    { id: 'emergencias', titulo: 'Atención de emergencias', modulos: ['hospital/rcp_dea', 'hospital/atragantamiento_hemorragia'],
      escena: 'Un compañero se cortó y sangra mucho; otro está en paro y llega el DEA. [FICTICIO]',
      riesgos: [
        { id: 'sangre', prop: 'mesa', icono: '🩸', nombre: 'Atender la hemorragia sin guantes ni barrera', real: true, tipo: 'Biológico', fb: 'Protégete antes de ayudar.', f: 'IFRC 2025, p. 256' },
        { id: 'dea', prop: 'dea', icono: '⚡', nombre: 'Tocar a la persona mientras el DEA analiza o descarga', real: true, tipo: 'Físico', fb: 'Nadie toca a la persona durante el análisis y la descarga.', f: 'AHA 2025, Parte 7 (algoritmo para legos)' },
        { id: 'botiquin', prop: 'buzon', icono: '🧰', nombre: 'Botiquín con guantes y barrera disponibles', real: false, fb: 'Es una medida de protección.', f: 'LFT art. 504 fr. I' },
        { id: 'dea_ok', prop: 'dea', icono: '🟩', nombre: 'DEA señalizado y accesible', real: false, fb: 'Es un recurso de atención.', f: 'AHA 2025, Parte 7' },
      ],
      principal: 'sangre', evalua: { f: 'C', s: 'II', pista: 'Las hemorragias en el trabajo ocurren pocas veces; un contagio puede incapacitar más de 3 días.' },
      control: [{ t: 'Guantes y barrera en todos los botiquines y capacitación: aquí el EPP es el complemento indispensable', ok: true, fb: 'No se puede eliminar la sangre de una emergencia: el EPP complementa la capacitación.', f: `IFRC 2025, p. 256; ${N17}, 5.2 b)` },
        { t: 'Atender sin protección para ganar tiempo', ok: false, crit: true, fb: 'Tu seguridad va primero.', f: 'IFRC 2025, p. 114' }] },
  ] },

  industria: { nombre: 'Industria', icono: '🏭', color: 0x5B6B7C, zonas: [
    { id: 'alturas', titulo: 'Trabajos en altura', modulos: ['industria/alturas'],
      escena: 'Mantenimiento de la azotea de la nave, a 6 m de altura. [FICTICIO]',
      riesgos: [
        { id: 'borde', prop: 'azotea', icono: '⬇️', nombre: 'Trabajar en el borde de la azotea sin barandal', real: true, tipo: 'Condición de instalaciones', fb: 'Caída de altura (más de 1.80 m).', f: 'NOM-009-STPS-2011, 4 (definición) y 8.4.1 a)' },
        { id: 'herram', prop: 'cajas', icono: '🔧', nombre: 'Herramienta suelta sobre personas que pasan abajo', real: true, tipo: 'Mecánico', fb: 'Golpe por caída de objetos.', f: 'NOM-009-STPS-2011, cap. 8; NOM-017-STPS-2024, 5.1 d) 2)' },
        { id: 'escalera', prop: 'escalera', icono: '🪜', nombre: 'Escalera de mano con peldaño roto', real: true, tipo: 'Condición de instalaciones', fb: 'Equipo en mal estado.', f: `${RF} art. 3 fr. V` },
        { id: 'casco', prop: 'extintor', icono: '⛑️', nombre: 'Casco y arnés revisados en su gabinete', real: false, fb: 'Es equipo de protección disponible.', f: `${N17}, 5.3` },
      ],
      principal: 'borde', evalua: { f: 'C', s: 'IV', pista: 'Suben a la azotea pocas veces, pero una caída de 6 m puede ser mortal.' },
      control: [{ t: 'Instalar barandal o protección perimetral; si no es posible, sistema personal para interrumpir caídas', ok: true, fb: 'La norma pide el sistema personal donde no sea posible colocar barandales.', f: 'NOM-009-STPS-2011, 8.4.1 a)' },
        SOLO_EPP, NO_CUIDADO] },
    { id: 'confinado', titulo: 'Espacios confinados', modulos: ['industria/espacios-confinados'],
      escena: 'Limpieza interior de una cisterna. [FICTICIO]',
      riesgos: [
        { id: 'atm', prop: 'tanque', icono: '🫁', nombre: 'Entrar sin medir oxígeno ni gases', real: true, tipo: 'Químico', fb: 'Asfixia o intoxicación por atmósfera peligrosa.', f: `${N33}, 7.5 b)` },
        { id: 'motor', prop: 'compresora', icono: '⛽', nombre: 'Bomba de gasolina dentro del espacio', real: true, tipo: 'Químico', fb: 'Está prohibido introducir equipos de combustión interna.', f: `${N33}, 9.1 z)` },
        { id: 'solo', prop: 'tanque', icono: '🧍', nombre: 'Un solo trabajador, sin vigía', real: true, tipo: 'Condición de instalaciones', fb: 'Se prohíbe el trabajo individual en espacios confinados.', f: `${N33}, 9.1 x)` },
        { id: 'vent', prop: 'compresora', icono: '🌀', nombre: 'Ventilador con ducto funcionando', real: false, fb: 'Es un control técnico.', f: `${N33}, 9.3 b)` },
      ],
      principal: 'atm', evalua: { metodo: { pregunta: '¿Qué método exige la norma antes de entrar?', ops: [
        { t: 'Clasificar el espacio (tipo I o II) y hacer el análisis de riesgos por espacio y por trabajo', ok: true, fb: 'Con la Tabla 1 y el contenido mínimo del 7.5.', f: `${N33}, 5.2 y 7.4-7.5` },
        { t: 'La matriz NOM-031 y listo', ok: false, fb: 'La NOM-033 fija su propio análisis.', f: `${N33}, cap. 7` },
        { t: 'Ninguno, es un trabajo rápido', ok: false, crit: true, fb: 'El análisis es previo al acceso.', f: `${N33}, 5.2` }] } },
      control: [{ t: 'Hacer la limpieza desde el exterior si es posible; si no, ventilar y medir la atmósfera antes y durante el trabajo', ok: true, fb: 'Primero evitar el ingreso; después, controles técnicos.', f: `${N33}, 7.1 y 9.3 a)-b)` },
        SOLO_EPP, NO_CUIDADO] },
    { id: 'electrica', titulo: 'Seguridad eléctrica y bloqueo', modulos: ['industria/seguridad-electrica', 'industria/loto'],
      escena: 'Mantenimiento a un tablero de distribución. [FICTICIO]',
      riesgos: [
        { id: 'sinbloqueo', prop: 'tablero', icono: '⚡', nombre: 'Intervenir el tablero energizado sin bloqueo', real: true, tipo: 'Físico', fb: 'Choque eléctrico y arco eléctrico.', f: 'NOM-029-STPS-2011, 4.25 y 7.2 f)' },
        { id: 'cable', prop: 'cable', icono: '🔌', nombre: 'Cable pelado en el piso', real: true, tipo: 'Físico', fb: 'Contacto con partes energizadas.', f: 'NOM-029-STPS-2011, 7.2 e)' },
        { id: 'charco', prop: 'charco', icono: '💧', nombre: 'Charco junto al tablero', real: true, tipo: 'Condición de instalaciones', fb: 'Aumenta el riesgo eléctrico y de caída.', f: `${N30}, 6.1 a)` },
        { id: 'loto', prop: 'tablero', icono: '🔒', nombre: 'Estación de candados y etiquetas', real: false, fb: 'Es un control para el bloqueo.', f: 'NOM-029-STPS-2011, 7.2 f)' },
      ],
      principal: 'sinbloqueo', evalua: { f: 'C', s: 'IV', pista: 'El mantenimiento se hace pocas veces, pero un choque eléctrico puede ser mortal.' },
      control: [{ t: 'Desenergizar, bloquear con candado y etiquetar antes de intervenir', ok: true, fb: 'Se elimina la exposición a la energía durante el trabajo.', f: 'NOM-029-STPS-2011, 7.2 f)' },
        SOLO_EPP, NO_CUIDADO] },
    { id: 'taller', titulo: 'Taller de producción (curso Análisis de riesgo)', modulos: ['industria/riesgo_normativa', 'industria/riesgo_es_riesgo', 'industria/riesgo_mitigacion'],
      escena: 'Taller de Metalmecánica del Centro. [FICTICIO]',
      riesgos: [
        { id: 'prensa', prop: 'prensa', icono: '⚙️', nombre: 'Prensa sin guarda', real: true, tipo: 'Mecánico', fb: 'Atrapamiento y amputación.', f: 'NOM-004-STPS-1999, 5.2.1; NOM-017-STPS-2024, 5.1 d) 2)' },
        { id: 'solvente', prop: 'tambo', icono: '🧪', nombre: 'Tina de solvente abierta sin extracción', real: true, tipo: 'Químico', fb: 'Inhalación de vapores.', f: `${N17}, 5.1 d) 3)` },
        { id: 'ruido', prop: 'compresora', icono: '🔊', nombre: 'Compresora ruidosa junto a los puestos', real: true, tipo: 'Físico', fb: 'Exposición continua a ruido.', f: `${RF} art. 33` },
        { id: 'extintor', prop: 'extintor', icono: '🧯', nombre: 'Extintor señalizado', real: false, fb: 'Es una medida de protección.', f: `${N02}, 7.2 b)-c)` },
      ],
      principal: 'prensa', evalua: { f: 'C', s: 'III', pista: 'Los atrapamientos ocurren pocas veces, pero pueden causar la pérdida de un dedo.' },
      control: [{ t: 'Guarda fija y mando bimanual', ok: true, fb: 'Control de ingeniería.', f: `NOM-004-STPS-1999, 5.3; ${NIOSH}` }, SOLO_EPP, NO_CUIDADO] },
  ] },

  proteccion: { nombre: 'Protección civil', icono: '🚨', color: 0xE07A1F, zonas: [
    { id: 'incendio', titulo: 'Prevención de incendios', modulos: ['proteccion/extintores', 'proteccion/extintores-fuego'],
      escena: 'Almacén con área de soldadura. [FICTICIO]',
      riesgos: [
        { id: 'inflamable', prop: 'tambo', icono: '🔥', nombre: 'Tambos de solvente junto al área de soldadura', real: true, tipo: 'Incendio / químico-tecnológico', fb: 'Material inflamable cerca de una fuente de ignición.', f: `${LGPC} fr. XXV; NOM-027-STPS-2008, cap. 7` },
        { id: 'obstruido', prop: 'extintor_obstruido', icono: '🧯', nombre: 'Extintor tapado con cajas', real: true, tipo: 'Condición de instalaciones', fb: 'Deben estar visibles, accesibles y libres de obstáculos.', f: `${N02}, 7.2 b)` },
        { id: 'multi', prop: 'multicontacto', icono: '🔌', nombre: 'Multicontacto sobrecargado', real: true, tipo: 'Físico', fb: 'Sobrecalentamiento e incendio.', f: `${N17}, 5.1 d) 1)` },
        { id: 'detector', prop: 'buzon', icono: '🚨', nombre: 'Detector de humo instalado', real: false, fb: 'Es un medio de detección.', f: `${RF} art. 19 fr. II` },
      ],
      principal: 'inflamable', evalua: { f: 'C', s: 'IV', pista: 'Se suelda pocas veces junto a los tambos, pero un incendio con solvente puede ser mortal.' },
      control: [{ t: 'Retirar los tambos del área de soldadura y almacenarlos en un lugar adecuado', ok: true, fb: 'Se elimina la cercanía entre combustible e ignición.', f: `${NIOSH}; ${N02}, 5.1` },
        { t: 'Poner un extintor más y seguir igual', ok: false, fb: 'El extintor ayuda a responder, pero no elimina el peligro.', f: NIOSH }, NO_CUIDADO] },
    { id: 'evacuacion', titulo: 'Evacuación', modulos: ['proteccion/evacuacion'],
      escena: 'Pasillo hacia la salida de emergencia de un edificio de oficinas. [FICTICIO]',
      riesgos: [
        { id: 'ruta', prop: 'cajas', icono: '📦', nombre: 'Ruta de evacuación bloqueada con cajas', real: true, tipo: 'Condición de instalaciones', fb: 'Las rutas deben estar libres de obstáculos.', f: `${N02}, 7.15 b)` },
        { id: 'candado', prop: 'puerta_candado', icono: '🔒', nombre: 'Puerta de emergencia con candado en horario laboral', real: true, tipo: 'Condición de instalaciones', fb: 'Las salidas de emergencia no deben tener candados.', f: `${N02}, 7.16 f)` },
        { id: 'anaquel', prop: 'anaquel', icono: '🌋', nombre: 'Anaquel sin anclar junto a la salida', real: true, tipo: 'Fenómeno geológico', fb: 'Puede bloquear la salida en un sismo.', f: `${LGPC} fr. XXIII` },
        { id: 'senal', prop: 'senal_salida', icono: '🟩', nombre: 'Señal de ruta de evacuación', real: false, fb: 'Es una medida de seguridad.', f: `${N02}, 7.15 a)` },
      ],
      principal: 'candado', evalua: { f: 'B', s: 'IV', pista: 'Una emergencia que obligue a usar esa puerta difícilmente ocurre, pero si está cerrada puede costar vidas.' },
      control: [{ t: 'Retirar el candado y dejar la puerta con apertura simple desde el interior', ok: true, fb: 'Se elimina la condición peligrosa.', f: `${N02}, 7.16 e)-f)` },
        { t: 'Esconder la llave cerca de la puerta', ok: false, crit: true, fb: 'Durante las horas laborales la salida no debe tener candados.', f: `${N02}, 7.16 f)` }, NO_CUIDADO] },
  ] },

  laboral: { nombre: 'Laboral STPS', icono: '⚖️', color: 0x1F4E79, zonas: [
    { id: 'psicosocial', titulo: 'Oficina: factores de riesgo psicosocial (NOM-035)', modulos: ['laboral/nom035_factores', 'laboral/nom035_ats', 'laboral/nom035_entorno', 'laboral/nom035_requisitos'],
      escena: 'Oficinas de una distribuidora con 42 personas. [FICTICIO]',
      riesgos: [
        { id: 'cargas', prop: 'escritorio', icono: '📚', nombre: 'Cargas de trabajo que exceden la capacidad', real: true, tipo: 'Psicosocial', fb: 'Factor de riesgo psicosocial.', f: `${N35}, 7.2 b)` },
        { id: 'mensajes', prop: 'escritorio', icono: '📱', nombre: 'Mensajes del jefe a medianoche', real: true, tipo: 'Psicosocial', fb: 'Interferencia trabajo-familia.', f: `${N35}, 7.2 e)` },
        { id: 'burlas', prop: 'silla', icono: '🛑', nombre: 'Burlas constantes a un compañero', real: true, tipo: 'Psicosocial', fb: 'Violencia laboral (malos tratos).', f: `${N35}, 7.2 g)` },
        { id: 'buzon', prop: 'buzon', icono: '📮', nombre: 'Buzón confidencial de quejas', real: false, fb: 'Es una medida de prevención.', f: `${N35}, 8.1 b)` },
      ],
      principal: 'burlas', evalua: { metodo: { pregunta: 'Para los factores psicosociales, ¿qué método corresponde?', ops: [
        { t: 'El de la NOM-035: identificación y análisis con los cuestionarios de sus guías de referencia', ok: true, fb: 'La NOM-035 fija su propio método.', f: `${RF} art. 43 fr. I; ${N35}, cap. 7` },
        { t: 'La matriz de frecuencia y severidad de la NOM-031', ok: false, fb: 'Para factores psicosociales, la NOM-035 tiene su propio método.', f: `${N35}, cap. 7` },
        { t: 'Ninguno, son cosas personales', ok: false, fb: 'Son factores de riesgo que el patrón debe identificar.', f: `${RF} art. 43` }] } },
      control: [{ t: 'Aplicar el procedimiento de atención de quejas, con responsable y seguimiento, e informar cómo denunciar', ok: true, fb: 'Prevención de la violencia laboral.', f: `${N35}, 8.2 g)` },
        { t: 'Son bromas: no intervenir', ok: false, crit: true, fb: 'El patrón debe atender la violencia laboral.', f: `${N35}, 5.4` }] },
    { id: 'oficina', titulo: 'Oficina administrativa (inspección)', modulos: ['laboral/recepcion_inspector', 'laboral/visita_inspeccion'],
      escena: 'Oficina donde se recibe a la inspección. [FICTICIO]',
      riesgos: [
        { id: 'archivero', prop: 'anaquel', icono: '🗄️', nombre: 'Archivero sin anclar con cajones abiertos', real: true, tipo: 'Condición de instalaciones', fb: 'Golpes y volcamiento.', f: `${N30}, 6.1 a)` },
        { id: 'postura', prop: 'escritorio', icono: '🖥️', nombre: 'Pantalla muy baja que obliga a encorvarse todo el día', real: true, tipo: 'Ergonómico', fb: 'Postura forzada.', f: `${RF} art. 3 fr. XVI` },
        { id: 'cables', prop: 'cable', icono: '🔌', nombre: 'Cables cruzando el paso', real: true, tipo: 'Condición de instalaciones', fb: 'Tropiezos y caídas.', f: `${N30}, 6.1 a)` },
        { id: 'extintor', prop: 'extintor', icono: '🧯', nombre: 'Extintor accesible', real: false, fb: 'Es una medida de protección.', f: `${N02}, 7.2 b)` },
      ],
      principal: 'archivero', evalua: { f: 'D', s: 'I', pista: 'Los golpes con cajones abiertos se repiten con periodicidad, pero sin incapacidad.' },
      control: [{ t: 'Anclar el archivero y cerrar los cajones después de usarlos', ok: true, fb: 'Ingeniería más una práctica administrativa sencilla.', f: NIOSH }, SOLO_EPP, NO_CUIDADO] },
  ] },

  empresa: { nombre: 'Empresa · RH', icono: '🏢', color: 0x14284B, zonas: [
    { id: 'rh', titulo: 'Recursos humanos y jornada', modulos: ['empresa/rh_checador', 'empresa/horarios_qa'],
      escena: 'Oficina de RH y archivo de expedientes. [FICTICIO]',
      riesgos: [
        { id: 'cajas', prop: 'cajas', icono: '📦', nombre: 'Cajas de archivo de 20 kg cargadas desde el piso', real: true, tipo: 'Ergonómico', fb: 'Manejo manual de cargas.', f: 'NOM-036-1-STPS-2018, cap. 7' },
        { id: 'jornada', prop: 'reloj', icono: '🕚', nombre: 'Jornadas que exceden lo permitido sin descanso', real: true, tipo: 'Psicosocial', fb: 'Factor de riesgo por jornadas de trabajo.', f: `${N35}, 7.2 d)` },
        { id: 'multi', prop: 'multicontacto', icono: '🔌', nombre: 'Multicontacto sobrecargado bajo el escritorio', real: true, tipo: 'Físico', fb: 'Riesgo eléctrico.', f: `${N17}, 5.1 d) 1)` },
        { id: 'checador', prop: 'buzon', icono: '⏱️', nombre: 'Checador funcionando', real: false, fb: 'Es un registro, no un peligro.', f: `${N30}, 3.8` },
      ],
      principal: 'cajas', evalua: { metodo: { pregunta: 'Para el manejo manual de cargas, ¿qué método corresponde?', ops: [
        { t: 'El de la NOM-036-1: identificación, estimación simple y, si hace falta, evaluación específica', ok: true, fb: 'La NOM-036-1 fija su propio método.', f: `${RF} art. 42 fr. I; NOM-036-1-STPS-2018, 7.1` },
        { t: 'El cuestionario de la NOM-035', ok: false, fb: 'Ese es para factores psicosociales.', f: `${N35}, cap. 7` },
        { t: 'Ninguno', ok: false, fb: 'El RFSST pide analizar los factores ergonómicos.', f: `${RF} art. 42 fr. I` }] } },
      control: [{ t: 'Colocar los archivos a la altura de la cintura y usar un carrito', ok: true, fb: 'Medidas sobre el puesto para mitigar el factor ergonómico.', f: `${RF} art. 42 fr. II` },
        { t: 'Solo darle una faja', ok: false, fb: 'El EPP no sustituye las medidas sobre el puesto.', f: `${N17}, 5.2` }, NO_CUIDADO] },
  ] },

  } };
})();
