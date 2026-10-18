// Prácticas por zona: AMPLIACIÓN (14/10/2026). Script clásico que se carga después de datos.js y agrega a cada zona más
// fichas de recorrido, peligros, puntos de inspección, decisiones de emergencia y un segundo riesgo para el análisis.
// REGLA: cada dato normativo cita su numeral, leído en el texto oficial guardado en 02_fuentes_verificadas
// (NOM-001/002/004/006/011/017/018/025/029/031 STPS) o ya verificado en datos.js (NOM-003/008/016/023/086).
// Escenas, personas, niveles de ruido y valores de frecuencia/severidad son [FICTICIO – ejercicio didáctico].
(function () {
const Z = window.PRACTICAS_ZONA, FU = window.PRACTICAS_ZONA_FUENTES; if (!Z) return;
const N06 = 'NOM-006-STPS-2023', N17 = 'NOM-017-STPS-2024', N31 = 'NOM-031-STPS-2011', N02 = 'NOM-002-STPS-2010', N04 = 'NOM-004-STPS-1999',
  N11 = 'NOM-011-STPS-2001', N25 = 'NOM-025-STPS-2008', N29 = 'NOM-029-STPS-2011', N18 = 'NOM-018-STPS-2015', N01 = 'NOM-001-STPS-2008',
  N23 = 'NOM-023-STPS-2012', N08 = 'NOM-008-STPS-2013', N16 = 'NOM-016-STPS-2001', N03 = 'NOM-003-STPS-2023', N86 = 'NOM-086-SCT2-2015',
  NIOSH = 'NIOSH, jerarquía de controles (referencia, no obligatoria)', T71 = 'NOM-002-STPS-2010, Guía de Referencia VII, Tabla VII.1 (no obligatoria)';
Object.assign(FU, {
  [N04]: { t: 'NOM-004-STPS-1999, Sistemas de protección y dispositivos de seguridad en la maquinaria y equipo que se utilice en los centros de trabajo (DOF 31/05/1999).' },
  [N11]: { t: 'NOM-011-STPS-2001, Condiciones de seguridad e higiene en los centros de trabajo donde se genere ruido (DOF 17/04/2002).' },
  [N25]: { t: 'NOM-025-STPS-2008, Condiciones de iluminación en los centros de trabajo (DOF 30/12/2008).' },
  [N29]: { t: 'NOM-029-STPS-2011, Mantenimiento de las instalaciones eléctricas en los centros de trabajo-Condiciones de seguridad (DOF 29/12/2011).' },
  [N18]: { t: 'NOM-018-STPS-2015, Sistema armonizado para la identificación y comunicación de peligros y riesgos por sustancias químicas peligrosas en los centros de trabajo (DOF 09/10/2015).' },
  [N01]: { t: 'NOM-001-STPS-2008, Edificios, locales, instalaciones y áreas en los centros de trabajo-Condiciones de seguridad (DOF 24/11/2008).' },
});
const fin = ' [FICTICIO – ejercicio didáctico]';
const ctl = (ok, t, fb, f) => ({ t, ok, fb, f });
const P = (id, real, obj, icono, nombre, fb, f) => ({ id, real, obj, icono, nombre, fb, f });
const I = (obj, q, a, exp, f) => ({ obj, q, a, exp, f });
const E = (q, ops, ok, exp, f, anim) => ({ q, ops, ok, exp, f, anim });
const R = (at, titulo, texto, f) => ({ at, titulo, texto, f });
function ampliar(id, a) { const z = Z[id]; if (!z) return;
  ['escena', 'extras', 'recorrido', 'peligros', 'inspeccion'].forEach(k => { if (a[k]) z[k] = (z[k] || []).concat(a[k]); });
  if (a.pasos) z.emergencia.pasos = z.emergencia.pasos.concat(a.pasos);
  if (a.analisis) z.analisis = [].concat(z.analisis, a.analisis); }

// ============================================================== MINA A CIELO ABIERTO
ampliar('mina_abierta', {
  extras: [['paro', -12.4, -1.2, 0]],
  recorrido: [
    R([-8.5, -8], 'Tolva de descarga', 'Se impide el paso de trabajadores a las áreas donde exista riesgo de caída de material y se delimitan con barandas y señalización.', `${N06}, 8.8.2 g)`),
    R([9, -4.6], 'Revisión del cargador', 'Al inicio de cada jornada se hace una revisión visual y una prueba funcional de la maquinaria, incluidos sus controles de operación y de emergencia.', `${N06}, 8.1 a)`),
    R([-13, -2.4], 'Paro de la banda', 'La banda transportadora tiene una alarma audible y luminosa que indica que funciona y un cable para paro de emergencia a todo su largo.', `${N06}, 8.8.2 b) y c)`),
    R([10.5, 3.4], 'Extintor', 'Se dispone de al menos un extintor del tipo y capacidad para la clase de fuego que se pueda presentar.', `${N06}, 8.1 c)`)],
  peligros: [
    P('ropa_suelta', true, ['persona', -12.4, -5.5, Math.PI / 2, { ropa: 0x8E24AA }], '👕', 'Trabajador con ropa suelta y cadena junto a la banda en operación', 'Cerca de los transportadores se usa el cabello corto o recogido, sin cadenas, anillos, pulseras ni ropa suelta.', `${N06}, 8.8.2 f)`),
    P('bajo_tolva', true, ['persona', -11, -7.0, 0, { ropa: 0x455A64 }], '🪨', 'Trabajador parado bajo la descarga de la tolva', 'Se impide el paso a las áreas con riesgo de caída de material y se delimitan con barandas y señalización.', `${N06}, 8.8.2 g)`),
    P('pasajero', true, ['persona', 10.2, -5.6, -0.6, { ropa: 0x6D4C41, y: 0.95 }], '🚜', 'Ayudante viajando parado en el estribo del cargador', 'Se prohíbe usar la maquinaria de manejo de materiales como medio de transporte de personal.', `${N06}, 8.1 n)`),
    P('paro_ok', false, ['marca', -12.4, -1.2, 0, { alto: 1.4 }], '🛑', 'Botón de paro de la banda visible y al alcance', 'Condición controlada: los dispositivos de arranque y paro están visibles, accesibles y libres de obstáculos.', `${N06}, 8.8.1 a)`)],
  inspeccion: [
    I('paro_ok', '¿Los dispositivos de arranque y paro de la banda son visibles y de fácil acceso?', true, 'Sí: están junto a la banda y sin obstáculos.', `${N06}, 8.8.1 a)`),
    I('bajo_tolva', '¿El área donde puede caer material de la tolva está delimitada y sin personas?', false, 'No: hay un trabajador debajo de la descarga.', `${N06}, 8.8.2 g)`),
    I('pasajero', '¿Nadie viaja en la maquinaria de manejo de materiales?', false, 'No: un ayudante va parado en el estribo del cargador.', `${N06}, 8.1 n)`),
    I('extintor', '¿Hay un extintor del tipo y capacidad para el fuego que se puede presentar?', true, 'Sí, en la caseta.', `${N06}, 8.1 c)`)],
  pasos: [
    E('¿Qué se hace con la maquinaria que está cerca del accidente?', ['Se pone en posición segura', 'Se sigue cargando para no perder tiempo', 'Se usa para jalar la cabina del camión sin plan'], 0, 'El procedimiento de emergencia indica poner la maquinaria involucrada en posición segura.', `${N06}, 7.6 c)`, ['detener', 'cargador']),
    E('El operador necesita atención en un hospital. ¿Cómo se organiza?', ['Con el directorio de cuerpos de socorro y el transporte disponible que define el procedimiento', 'Que se vaya por su cuenta', 'Esperar al final del turno'], 0, 'El procedimiento incluye el directorio de los cuerpos de socorro y los medios para trasladar a los lesionados.', `${N06}, 7.6 f) y g)`),
    E('¿Quién coordina toda la atención?', ['El responsable designado en el procedimiento, capacitado para esa función', 'El primero que llegue', 'Nadie: cada quien hace lo que puede'], 0, 'El procedimiento nombra a los responsables de su ejecución y coordinación, con capacitación y adiestramiento.', `${N06}, 7.6 h)`, ['globo', 'yo', 'Coordinador de la emergencia'])],
  analisis: { principal: 'bajo_tolva', riesgo: 'Golpe por caída de material desde la tolva', f: 'C', s: 'III', pista: 'Solo ocurre cuando alguien pasa por debajo, pero una roca puede causar una lesión permanente.' + fin, control: [
    ctl(true, 'Delimitar con barandas y señalización el área bajo la tolva e impedir el paso', 'Control de ingeniería: aleja a las personas de la caída de material.', `${N06}, 8.8.2 g); ${NIOSH}`),
    ctl(false, 'Pedir que pasen rápido por debajo', 'Depende del comportamiento: no evita la exposición.', NIOSH),
    ctl(false, 'Solo reforzar el uso del casco', 'El EPP es el último nivel de la jerarquía.', `${N17}, 5.2; ${NIOSH}`),
    ctl(false, 'Poner un letrero de precaución sin barandas', 'Control administrativo más débil que impedir físicamente el paso.', NIOSH)] },
});

// ============================================================== MINA SUBTERRÁNEA
ampliar('mina_subterranea', {
  extras: [['r:tablero', -4, 1.2, 0], ['cajas', -4.6, 2.0, 0], ['r:cable', 6, 2.6, 0.3]],
  recorrido: [
    R([0, -2.2], 'Iluminación de la galería', 'Para labores en minas subterráneas el nivel mínimo de iluminación es de 50 luxes.', `${N25}, 7 (Tabla 1)`),
    R([-4, 3.2], 'Tablero eléctrico', 'Se evita almacenar materiales sobre las instalaciones eléctricas y se mantiene libre el acceso a los tableros.', `${N29}, 10.2 j) y k)`),
    R([12, 5.2], 'Ruido del ventilador', 'Con exposición a 85 dB(A) o más se proporciona protección auditiva y aplica el programa de conservación de la audición.', `${N11}, 5.4 y 5.5`),
    R([-9, -0.5], 'Extintor', 'Los extintores se colocan a una altura no mayor de 1.50 m, medidos del piso a su parte más alta.', `${N02}, 7.17 f)`)],
  peligros: [
    P('tablero_cajas', true, ['marca', -4.3, 1.6, 0, { alto: 2 }], '⚡', 'Cajas de material almacenadas frente al tablero eléctrico', 'Se evita almacenar materiales sobre las instalaciones eléctricas y se mantiene libre el acceso a los tableros.', `${N29}, 10.2 j) y k)`),
    P('cable_piso', true, ['marca', 6, 2.6, 0, { alto: 0.6 }], '🔌', 'Cable eléctrico dañado tendido en el paso hacia la galería', 'Se protege contra daños a todos los cables.', `${N29}, 10.2 f)`),
    P('sin_casco', true, ['persona', -1.5, 4.2, Math.PI, { casco: null, ropa: 0x37474F }], '⛑️', 'Minero sin casco en la bocamina', 'El patrón debe proporcionar el equipo de protección personal básico.', `${N23}, 5.19`),
    P('extintor_ok', false, ['extintor', -9, 0.6, 0], '🧯', 'Extintor colocado y señalizado a no más de 1.50 m del piso', 'Condición controlada.', `${N02}, 7.17 f)`)],
  inspeccion: [
    I('tablero_cajas', '¿El acceso al tablero eléctrico está libre de obstáculos?', false, 'No: hay cajas almacenadas enfrente.', `${N29}, 10.2 k)`),
    I('cable_piso', '¿Los cables del paso están protegidos contra daños?', false, 'No: hay un cable dañado en el piso.', `${N29}, 10.2 f)`),
    I('sin_casco', '¿Todos los trabajadores en la bocamina usan su equipo de protección básico?', false, 'No: un minero no trae casco.', `${N23}, 5.19`),
    I('extintor_ok', '¿El extintor está a 1.50 m o menos del piso, medido a su parte más alta?', true, 'Sí.', `${N02}, 7.17 f)`)],
  pasos: [
    E('¿Cómo sabe la brigada quién sigue dentro de la mina?', ['Con el registro de acceso y salida del turno', 'Preguntando a gritos en la bocamina', 'No hace falta saberlo'], 0, 'Debe existir un sistema de registro, por cada turno, del acceso y salida de los trabajadores.', `${N23}, 5.9`, ['ir', 'tablero_acceso']),
    E('Pasó la emergencia. ¿Cuándo se reanudan los trabajos?', ['Al aplicar el procedimiento para el retorno a actividades normales, eliminar los riesgos e identificar los daños', 'De inmediato, para recuperar el tiempo', 'Cuando cada quien quiera'], 0, 'El plan de atención a emergencias incluye los procedimientos para el retorno a actividades normales.', `${N02}, 8.1 j)`)],
  analisis: { principal: 'tablero_cajas', riesgo: 'Contacto eléctrico o incendio en el tablero obstruido', f: 'C', s: 'III', pista: 'Ocurre pocas veces, pero un arco o una descarga eléctrica pueden dejar lesiones permanentes.' + fin, control: [
    ctl(true, 'Retirar las cajas, delimitar el frente del tablero y prohibir almacenar ahí', 'Elimina la condición: el acceso queda libre y nada se apoya en la instalación.', `${N29}, 10.2 j) y k)`),
    ctl(false, 'Avisar que tengan cuidado al mover las cajas', 'Depende del comportamiento.', NIOSH),
    ctl(false, 'Dar guantes de carnaza al almacenista', 'El EPP no corrige la obstrucción del tablero.', `${N17}, 5.2; ${NIOSH}`),
    ctl(false, 'Colocar una señal de riesgo eléctrico y dejar las cajas', 'La señal no elimina la obstrucción.', NIOSH)] },
});

// ============================================================== CONSTRUCCIÓN
ampliar('construccion', {
  extras: [['botiquin', -10.6, 6.6, 0], ['letrero', -13.4, 5.6, 0.3, { texto: 'EMERGENCIAS: BOMBEROS · HOSPITAL · POLICÍA · RESCATE', fondo: '#00995C', color: '#fff' }]],
  recorrido: [
    R([3, -2.6], 'Inspección de la zanja', 'El sitio de la excavación se inspecciona al iniciar cada jornada y al terminar los trabajos para detectar fallas, grietas o desprendimientos; los sistemas de estabilización de las paredes, al inicio y al final de cada jornada.', `${N31}, 11.2 a) y b)`),
    R([-9.5, -3.4], 'Radio de acción de la máquina', 'Se acordona el entorno del radio de acción donde trabaja la maquinaria.', `${N31}, 17.4.1 a)`),
    R([12, -1], 'Polvo', 'Se riegan con agua los caminos, los accesos y las cajas de los camiones para evitar nubes de polvo.', `${N31}, 15.10`),
    R([-11, 5.2], 'Plan de emergencias de la obra', 'Incluye las acciones para atender emergencias (con primeros auxilios), un responsable, el botiquín y los teléfonos de bomberos, hospitales, policía y rescate.', `${N31}, 19.1`)],
  peligros: [
    P('peon_radio', true, ['persona', -7.4, -8.0, 0.4, { ropa: 0x6D4C41 }], '🦾', 'Peón dentro del radio de giro de la excavadora, sin acordonar', 'Se acordona el entorno del radio de acción de la maquinaria.', `${N31}, 17.4.1 a)`),
    P('sin_lona', true, ['marca', 9, 2, 0, { alto: 3 }], '🚛', 'Camión de volteo cargado de tierra sin lona', 'Los camiones de volteo cargados con tierra, grava o arena llevan el material cubierto con una lona.', `${N31}, 15.9`),
    P('combustible', true, ['persona', 11.6, 0.6, -Math.PI / 2, { ropa: 0x1565C0 }], '⛽', 'Cargando combustible al camión con el motor encendido', 'Se prohíbe suministrar combustible con el motor en marcha.', `${N31}, 17.4.1 o)`),
    P('botiquin_ok', false, ['marca', -10.6, 6.6, 0, { alto: 1.8 }], '🩹', 'Botiquín y teléfonos de emergencia en la caseta', 'Condición controlada: son recursos del plan de atención a emergencias.', `${N31}, 19.1 c) y d)`)],
  inspeccion: [
    I('peon_radio', '¿El radio de acción de la excavadora está acordonado y sin personas?', false, 'No: hay un peón dentro del radio de giro.', `${N31}, 17.4.1 a)`),
    I('sin_lona', '¿El camión cargado de tierra lleva la carga cubierta con lona?', false, 'No.', `${N31}, 15.9`),
    I('combustible', '¿El combustible se suministra con el motor apagado?', false, 'No: el motor sigue encendido.', `${N31}, 17.4.1 o)`),
    I('botiquin_ok', '¿Hay botiquín y números de emergencia a la mano?', true, 'Sí, en la caseta.', `${N31}, 19.1 c) y d)`)],
  pasos: [
    E('¿Con qué recursos del plan atiendes al trabajador mientras llega la ayuda?', ['Con el botiquín y los teléfonos de bomberos, hospitales, policía y rescate del plan', 'Con lo que haya en el camión', 'Con agua y esperar'], 0, 'El plan incluye el botiquín de primeros auxilios y los números telefónicos de los servicios de auxilio.', `${N31}, 19.1 c) y d)`, ['acudir', 'en_zanja']),
    E('¿Qué se hace alrededor de la máquina mientras se atiende?', ['Se acordona el radio de acción de la maquinaria', 'Se deja libre para que los curiosos ayuden', 'Nada'], 0, 'Se acordona el entorno del radio de acción donde se realizan actividades con maquinaria.', `${N31}, 17.4.1 a)`, ['delimitar', 'excavadora', 5]),
    E('Antes de volver a trabajar en la zanja…', ['Se inspecciona el sitio para detectar fallas, grietas o desprendimientos y se revisan los sistemas de estabilización', 'Se vuelve a excavar de inmediato', 'Se tapa con tierra suelta'], 0, 'El sitio y los sistemas de estabilización de las paredes se inspeccionan para detectar fallas antes de continuar.', `${N31}, 11.2 a) y b)`)],
  analisis: { principal: 'peon_radio', riesgo: 'Golpe o atrapamiento por el brazo o el giro de la excavadora', f: 'C', s: 'IV', pista: 'Pocas veces alguien entra al radio de giro, pero el golpe puede ser fatal.' + fin, control: [
    ctl(true, 'Acordonar el radio de acción de la máquina y prohibir el paso mientras opera', 'Barrera física: separa a las personas de la zona de giro.', `${N31}, 17.4.1 a); ${NIOSH}`),
    ctl(false, 'Pedir al peón que esté atento', 'Depende del comportamiento.', NIOSH),
    ctl(false, 'Darle un chaleco reflejante', 'El EPP no evita el golpe.', `${N17}, 5.2; ${NIOSH}`),
    ctl(false, 'Que el operador toque el claxon de vez en cuando', 'Aviso débil frente a una barrera.', NIOSH)] },
});

// ============================================================== ASERRADERO
ampliar('aserradero', {
  extras: [['letrero', -3.6, -1.6, 0.4, { texto: 'SIERRA PRINCIPAL · 98 dB(A)', fondo: '#FFD100', color: '#111' }]],
  recorrido: [
    R([-3.5, -2.6], 'Ruido de la sierra', 'Con exposición a 85 dB(A) o más se proporciona protección auditiva a los trabajadores; en ningún caso debe haber exposición sin protección a más de 105 dB(A).', `${N11}, 5.3 y 5.4`),
    R([4.5, -3], 'Mantenimiento con bloqueo', 'El bloqueo de energía se realiza antes y durante el mantenimiento de la maquinaria, por el encargado del mantenimiento y avisando a los trabajadores.', `${N04}, 7.2.2 c)`),
    R([2.5, 1.5], 'Ropa y accesorios', 'Quien opera maquinaria usa el cabello corto o recogido y no porta cadenas, anillos, pulseras, mangas sueltas u otros objetos de riesgo.', `${N04}, 6.5`),
    R([12.5, 2.2], 'Extintor para madera', 'Los extintores se eligen según la clase de fuego (madera: clase A); para la clase A sirven, por ejemplo, el de agua o el de polvo químico seco ABC.', `${N02}, 7.17 a); ${T71}`)],
  peligros: [
    P('sin_auditiva', true, ['persona', -2.6, -3.3, Math.PI * 0.9, { ropa: 0x37474F }], '🎧', 'Operador junto a la sierra (98 dB(A)) sin protección auditiva', 'Con exposición a 85 dB(A) o más se proporciona equipo de protección auditiva.', `${N11}, 5.4`),
    P('mant_sin_bloqueo', true, ['persona', 1.6, -7.8, 0, { ropa: 0x1565C0, pose: 'agachado' }], '🔧', 'Mecánico ajustando la sierra sin bloquear la energía', 'El bloqueo de energía se realiza antes y durante el mantenimiento.', `${N04}, 7.2.2 c)`),
    P('alhajas', true, ['persona', 3.6, -4.2, -Math.PI / 2, { ropa: 0xEF6C00 }], '📿', 'Ayudante con pulsera y manga suelta alimentando la sierra', 'No se portan cadenas, anillos, pulseras ni mangas sueltas al operar maquinaria.', `${N04}, 6.5`),
    P('extintor_ok', false, ['extintor', 12.5, 1, 0], '🧯', 'Extintor PQS ABC señalizado para fuego clase A de madera', 'Condición controlada: extintor acorde a la clase de fuego.', `${N02}, 7.17 a)`)],
  inspeccion: [
    I('sin_auditiva', '¿Los trabajadores expuestos a 85 dB(A) o más usan protección auditiva?', false, 'No: el operador de la sierra no la usa.', `${N11}, 5.4`),
    I('mant_sin_bloqueo', '¿El mantenimiento se hace con la energía bloqueada?', false, 'No: el mecánico trabaja con la sierra energizada.', `${N04}, 7.2.2 c)`),
    I('alhajas', '¿Quien opera la sierra trabaja sin alhajas ni ropa suelta?', false, 'No: el ayudante trae pulsera y manga suelta.', `${N04}, 6.5`),
    I('extintor_ok', '¿El extintor es acorde a la clase de fuego del aserradero?', true, 'Sí: PQS ABC sirve para fuego clase A.', `${N02}, 7.17 a); ${T71}`)],
  pasos: [
    E('Mientras revisan la sierra, ¿cómo evitas que alguien la encienda?', ['Bloqueando la energía con candado y tarjeta durante la revisión', 'Poniendo una nota en el botón', 'Pidiendo a todos que no la toquen'], 0, 'El bloqueo de energía se realiza antes y durante el mantenimiento de la maquinaria.', `${N04}, 7.2.2 c)`, ['cortar', 'sierra', 'Candado y tarjeta colocados']),
    E('¿Qué se reporta al patrón?', ['Que la protección de la sierra no estaba en su lugar', 'Nada: fue un descuido del ayudante', 'Solo la hora del accidente'], 0, 'Los trabajadores reportan cuando los sistemas de protección se encuentran deteriorados, fuera de funcionamiento o bloqueados.', `${N04}, 6.3`),
    E('¿Cuándo vuelve a operar la sierra?', ['Cuando sus protectores y dispositivos estén en su lugar y funcionando', 'En cuanto se limpie la sangre', 'Al día siguiente, como sea'], 0, 'Al concluir el mantenimiento, los protectores y dispositivos deben estar en su lugar y en condiciones de funcionamiento.', `${N04}, 7.2.2 a)`)],
  analisis: { principal: 'mant_sin_bloqueo', riesgo: 'Amputación o corte por arranque inesperado de la sierra', f: 'C', s: 'IV', pista: 'Pocas veces alguien la enciende durante el ajuste, pero el daño puede ser grave o fatal.' + fin, control: [
    ctl(true, 'Bloquear la energía con candado y tarjeta antes y durante el mantenimiento', 'Elimina la energía peligrosa mientras se trabaja en la máquina.', `${N04}, 7.2.2 c)`),
    ctl(false, 'Trabajar rápido para terminar antes', 'No controla la energía.', NIOSH),
    ctl(false, 'Usar guantes anticorte', 'El EPP no detiene un disco en movimiento.', `${N17}, 5.2; ${NIOSH}`),
    ctl(false, 'Avisar a gritos que nadie la encienda', 'Aviso verbal: no impide el arranque.', NIOSH)] },
});

// ============================================================== FERROCARRIL
ampliar('ferrocarril', {
  extras: [['bitacora', 7, 5.6, 0, { texto: 'HOJAS DE DATOS DE SEGURIDAD' }], ['r:extintor_obstruido', 12.4, 4.6, 0]],
  recorrido: [
    R([7, 4.4], 'Hojas de datos de seguridad', 'Las hojas de datos de seguridad se ponen permanentemente a disposición de los trabajadores en las áreas donde se manejan sustancias químicas peligrosas.', `${N18}, 6.4`),
    R([2, -2.8], 'Recipientes identificados', 'Se señalizan los depósitos, recipientes y áreas de almacenamiento que contengan sustancias químicas peligrosas.', `${N18}, 6.5`),
    R([12.4, 3.2], 'Extintor accesible', 'Se prohíbe almacenar materiales u objetos que obstruyan el acceso al equipo contra incendio.', `${N02}, 7.14`)],
  peligros: [
    P('sentado_via', true, ['persona', -4, 1, 0, { pose: 'agachado', ropa: 0x1565C0 }], '🛤️', 'Trabajador descansando agachado sobre la vía', 'Debe existir un procedimiento para el tránsito de trabajadores entre vías: nadie permanece sobre ellas.', `${N16}, 9.4 a)`),
    P('epp_vagon', true, ['persona', 3.8, -3.2, Math.PI, { ropa: 0x2E7D32 }], '🧤', 'Trabajador abriendo la válvula del carro tanque sin el equipo de protección requerido', 'El equipo de protección personal debe proveer la protección contra los tipos y grados de riesgo a que se expone.', `${N17}, 5.3 b)`),
    P('extintor_tapado', true, ['marca', 12.4, 4.6, 0, { alto: 1.4 }], '📦', 'Extintor tapado con cajas', 'Se prohíbe almacenar materiales que obstruyan el acceso al equipo contra incendio.', `${N02}, 7.14`),
    P('hds_ok', false, ['marca', 7, 5.6, 0, { alto: 2 }], '📄', 'Hojas de datos de seguridad disponibles en el patio', 'Condición controlada.', `${N18}, 6.4`)],
  inspeccion: [
    I('hds_ok', '¿Las hojas de datos de seguridad están disponibles para consulta en el patio?', true, 'Sí.', `${N18}, 6.4`),
    I('extintor_tapado', '¿El acceso al extintor está libre de obstáculos?', false, 'No: hay cajas enfrente.', `${N02}, 7.14`),
    I('sentado_via', '¿Nadie permanece sobre las vías?', false, 'No: un trabajador descansa sobre la vía.', `${N16}, 9.4 a)`),
    I('epp_vagon', '¿Quien maneja el carro tanque usa el equipo que lo protege del riesgo?', false, 'No.', `${N17}, 5.3 b)`)],
  pasos: [
    E('La brigada se acercará a la fuga. ¿Con qué equipo?', ['Con el equipo de protección que protege contra ese tipo y grado de riesgo, según la hoja de datos de seguridad', 'Con su ropa normal, para ganar tiempo', 'Con un cubrebocas cualquiera'], 0, 'El EPP debe proveer la protección requerida contra los tipos y grados de riesgo.', `${N17}, 5.3 b); ${N18}, 6.4`),
    E('¿Dónde se consulta la información de la sustancia?', ['En la hoja de datos de seguridad, disponible en el área', 'En internet, cuando haya señal', 'Se adivina por el olor'], 0, 'Las HDS están permanentemente a disposición de los trabajadores en el área.', `${N18}, 6.4`, ['ir', 'hds_ok'])],
  analisis: { principal: 'sentado_via', riesgo: 'Atropellamiento de un trabajador que permanece sobre la vía', f: 'C', s: 'IV', pista: 'Pasa pocas veces, pero puede ser fatal.' + fin, control: [
    ctl(true, 'Prohibir permanecer en las vías y habilitar un área de descanso fuera de ellas, con el procedimiento de tránsito entre vías', 'Elimina la presencia de personas sobre la vía.', `${N16}, 9.4 a)`),
    ctl(false, 'Decirle que escuche el silbato', 'Depende de que oiga a tiempo.', NIOSH),
    ctl(false, 'Darle un chaleco reflejante', 'El EPP no evita el atropellamiento.', `${N17}, 5.2; ${NIOSH}`),
    ctl(false, 'Colocar un letrero de "no sentarse"', 'Control administrativo débil frente a un área de descanso segura.', NIOSH)] },
});

// ============================================================== CAMPO AGRÍCOLA
ampliar('agricola', {
  extras: [['r:tambo', 3.4, 7.4, 0], ['bitacora', -13.6, 6.2, 0, { texto: 'PLAN DE EMERGENCIAS' }], ['botiquin', -10.6, 6.4, 0]],
  recorrido: [
    R([-12, 4.8], 'Plan y botiquín', 'El centro de trabajo agrícola cuenta con un plan de atención de emergencias y con botiquín de primeros auxilios.', `${N03}, 5.14 y 5.16`),
    R([11, 0.6], 'Lavado del equipo', 'Existe un área específica para lavar el equipo de protección y los equipos de aplicación.', `${N03}, 5.3 g)`),
    R([-1, -3.4], 'Equipo de la talla correcta', 'El equipo de protección personal es de la talla y medidas de quien lo usa, para que no genere riesgos por sí mismo.', `${N17}, 5.3 c)`)],
  peligros: [
    P('calor', true, ['persona', -8, -8, 0.5, { ropa: 0xFFFFFF, casco: null }], '🌡️', 'Jornalero cortando a pleno sol (34 °C) sin pausas ni agua', 'Con temperatura promedio mayor a 28 °C: pausas de al menos 10 minutos cada 2 horas y beber al menos un vaso de agua cada 30 minutos.', `${N03}, 7.11 b) y d)`),
    P('garrafa', true, ['marca', 3.4, 7.4, 0, { alto: 1.2 }], '🧪', 'Agroquímico trasvasado a un bidón sin etiqueta junto al comedor', 'Los agroquímicos se almacenan en sus envases originales y cerrados, en un área exclusiva.', `${N03}, 8.5 h)`),
    P('plan_ok', false, ['marca', -13.6, 6.2, 0, { alto: 2 }], '📋', 'Plan de emergencias a la vista', 'Condición controlada.', `${N03}, 5.14`),
    P('botiquin_ok', false, ['marca', -10.6, 6.4, 0, { alto: 1.8 }], '🩹', 'Botiquín de primeros auxilios', 'Condición controlada.', `${N03}, 5.16`)],
  inspeccion: [
    I('calor', '¿Con más de 28 °C se dan pausas y agua suficiente?', false, 'No: el jornalero trabaja sin pausa ni agua.', `${N03}, 7.11 b) y d)`),
    I('garrafa', '¿Los agroquímicos están en su envase original, cerrados y en la bodega?', false, 'No: hay producto trasvasado junto al comedor.', `${N03}, 8.5 h)`),
    I('plan_ok', '¿Existe un plan de atención de emergencias?', true, 'Sí.', `${N03}, 5.14`),
    I('botiquin_ok', '¿Hay botiquín de primeros auxilios?', true, 'Sí.', `${N03}, 5.16`)],
  pasos: [
    E('¿Qué se hace con la ropa y el equipo contaminados?', ['Se lavan en el área específica para lavar el EPP y los equipos de aplicación', 'Se lavan en el canal de riego', 'Se guardan sucios en la bodega'], 0, 'Existe un área específica para lavar el equipo de protección y los equipos de aplicación.', `${N03}, 5.3 g)`),
    E('¿Pueden entrar los demás jornaleros a la parcela tratada?', ['No, hasta que pase el tiempo de reentrada', 'Sí, si van rápido', 'Sí, con sombrero'], 0, 'Se respeta el tiempo de reentrada a las zonas tratadas.', `${N03}, 6.7`, ['delimitar', 'surcos', 6])],
  analisis: { principal: 'calor', riesgo: 'Golpe de calor por trabajo a pleno sol', f: 'D', s: 'III', pista: 'En temporada de calor pasa con regularidad y puede dejar daños graves.' + fin, control: [
    ctl(true, 'Programar pausas de al menos 10 minutos cada 2 horas, con sombra y agua suficiente (un vaso cada 30 minutos)', 'Es la medida que la norma exige para temperaturas mayores a 28 °C.', `${N03}, 7.11 b) y d)`),
    ctl(false, 'Que cada quien aguante lo que pueda', 'No controla la exposición.', NIOSH),
    ctl(false, 'Solo darle un sombrero', 'Ayuda, pero no sustituye pausas ni hidratación.', `${N17}, 5.2; ${NIOSH}`),
    ctl(false, 'Pagar un bono por terminar antes', 'Incentiva trabajar más rápido con calor.', NIOSH)] },
});

// ============================================================== PUERTO
if (Z.puerto) Z.puerto.exterior = 0x2E6E9E;   // fuera del muelle: mar (el buque queda en el agua)
ampliar('puerto', {
  extras: [['montacargas', -8, -10.2, Math.PI / 2], ['letrero', 5, -8.6, 0, { texto: 'CARGA MÁXIMA: 30 000 kg', fondo: '#FFD100', color: '#111' }]],
  recorrido: [
    R([-6, -8], 'Código de señales', 'Operador y ayudantes usan un código de señales o sistema de comunicación; el operador no mueve la grúa hasta entender la señal.', `${N06}, 8.4.2 d) y f)`),
    R([6.5, -1], 'Horquillas abajo', 'El montacargas circula con los brazos de la horquilla entre 0.15 y 0.20 m del suelo, o como indique el fabricante.', `${N06}, 8.5.2 f)`),
    R([-5, -10.5], 'Topes en el muelle', 'Se usan barreras de protección o topes en plataformas o muelles donde operan montacargas, para evitar caídas.', `${N06}, 8.5.2 h)`),
    R([5, -7], 'Carga máxima', 'Un letrero visible para el operador y los maniobristas indica la carga máxima de utilización de la grúa.', `${N06}, 8.4.2 c)`)],
  peligros: [
    P('pasajero_horquillas', true, ['persona', 5.2, 1.9, Math.PI / 2, { ropa: 0x00838F, y: 0.35 }], '🚧', 'Trabajador viajando sobre las horquillas del montacargas', 'Se prohíbe usar la maquinaria de manejo de materiales como medio de transporte de personal.', `${N06}, 8.1 n)`),
    P('sin_topes', true, ['marca', -8, -10.2, 0, { alto: 2.5 }], '🌊', 'Montacargas operando en el borde del muelle sin topes', 'Se usan barreras o topes en los muelles donde operan montacargas.', `${N06}, 8.5.2 h)`),
    P('sobre_trabajadores', true, ['persona', -1.8, -4.6, 0, { ropa: 0x5D4037 }], '⬇️', 'Contenedor trasladado por encima de un maniobrista', 'Las cargas no se suspenden ni trasladan, en lo posible, por encima de donde se ubican o transitan los trabajadores.', `${N06}, 8.4.2 m)`),
    P('letrero_carga', false, ['marca', 5, -8.6, 0, { alto: 2.2 }], '🏷️', 'Letrero de carga máxima visible', 'Condición controlada.', `${N06}, 8.4.2 c)`)],
  inspeccion: [
    I('letrero_carga', '¿La grúa tiene un letrero visible con su carga máxima de utilización?', true, 'Sí.', `${N06}, 8.4.2 c)`),
    I('pasajero_horquillas', '¿Nadie viaja en el montacargas fuera de la cabina?', false, 'No: un trabajador va sobre las horquillas.', `${N06}, 8.1 n)`),
    I('sin_topes', '¿El muelle tiene topes donde operan los montacargas?', false, 'No.', `${N06}, 8.5.2 h)`),
    I('sobre_trabajadores', '¿La trayectoria de la carga evita pasar sobre trabajadores?', false, 'No: hay un maniobrista debajo de la trayectoria.', `${N06}, 8.4.2 m)`)],
  pasos: [
    E('¿Cómo se traslada al lesionado?', ['Con los medios de transporte disponibles hacia un centro de atención médica, según el procedimiento', 'En la caja del montacargas', 'Que espere a que termine el turno'], 0, 'El procedimiento define los medios de transporte para trasladar a los lesionados.', `${N06}, 7.6 g)`),
    E('¿Cómo se pide apoyo externo?', ['Con el directorio de los cuerpos de socorro del procedimiento', 'Buscando números en el celular', 'No se pide'], 0, 'El procedimiento incluye el directorio de los cuerpos de socorro competentes.', `${N06}, 7.6 f)`),
    E('Al final, ¿qué se hace con la grúa?', ['Desconectar el interruptor principal y dejarlo bloqueado', 'Dejarla encendida para seguir después', 'Quitarle solo la llave'], 0, 'Al finalizar la operación se desconecta el interruptor principal y se deja bloqueado para evitar una operación no autorizada.', `${N06}, 8.4.2 p)`, ['cortar', 'grua', 'Interruptor desconectado y bloqueado'])],
  analisis: { principal: 'pasajero_horquillas', riesgo: 'Caída o aplastamiento de una persona transportada en el montacargas', f: 'C', s: 'IV', pista: 'Pasa pocas veces, pero una caída desde las horquillas puede ser fatal.' + fin, control: [
    ctl(true, 'Prohibir que alguien viaje en la maquinaria y dar rutas peatonales delimitadas', 'Elimina la exposición: nadie va sobre las horquillas.', `${N06}, 8.1 n) y d)`),
    ctl(false, 'Ir más despacio cuando alguien viaje', 'Mantiene a la persona expuesta.', NIOSH),
    ctl(false, 'Darle casco al que viaja', 'El EPP no evita la caída.', `${N17}, 5.2; ${NIOSH}`),
    ctl(false, 'Pedirle que se sujete bien', 'Depende del comportamiento.', NIOSH)] },
});

// ============================================================== CARRETERA EN CONSTRUCCIÓN
ampliar('carretera', {
  extras: [['r:compresora', -4, -1.6, 0], ['r:cable', -1.4, -0.4, 0], ['tope', 14, -8, 0]],
  recorrido: [
    R([10, -0.8], 'Maniobras de reversa', 'Los vehículos de transporte de materiales cuentan con alarma de reversa y personal que auxilie al operador en las maniobras de reversa.', `${N31}, 15.4 a) y b)`),
    R([-8, -3.4], 'Cucharón abajo', 'La maquinaria se desplaza con el cucharón, uñas o pluma sin levantar o en posición de operación.', `${N31}, 17.4.1 k)`),
    R([-3, -3.4], 'Compresor', 'Las mangueras de presión se protegen con guardas en los cruces peatonales y de vehículos.', `${N31}, 17.4.2 d)`),
    R([14, -6.2], 'Topes en el terraplén', 'Se instalan topes en las orillas de taludes y terraplenes de relleno para evitar la marcha en reversa de los vehículos.', `${N31}, 15.11`)],
  peligros: [
    P('detras_camion', true, ['persona', 12, -5.2, Math.PI, { ropa: 0x455A64 }], '🔙', 'Peón caminando detrás del camión que da reversa, sin ayudante de maniobra', 'Las maniobras de reversa se auxilian con personal y alarma de reversa.', `${N31}, 15.4 a) y b)`),
    P('manguera', true, ['marca', -1.4, -0.4, 0, { alto: 0.5 }], '🧵', 'Manguera del compresor cruzando el paso sin guarda', 'Las mangueras de presión se protegen con guardas en los cruces peatonales y de vehículos.', `${N31}, 17.4.2 d)`),
    P('carga_motor', true, ['persona', -10.4, -4.2, Math.PI / 2, { ropa: 0x1565C0 }], '⛽', 'Cargando combustible a la retroexcavadora con el motor encendido', 'Se prohíbe suministrar combustible con el motor en marcha.', `${N31}, 17.4.1 o)`),
    P('tope_ok', false, ['marca', 14, -8, 0, { alto: 1.2 }], '🧱', 'Tope en la orilla del terraplén', 'Condición controlada: evita la reversa de los vehículos hacia el talud.', `${N31}, 15.11`)],
  inspeccion: [
    I('detras_camion', '¿Las maniobras de reversa tienen ayudante y nadie camina detrás del camión?', false, 'No.', `${N31}, 15.4 b)`),
    I('manguera', '¿Las mangueras del compresor tienen guardas en los cruces?', false, 'No.', `${N31}, 17.4.2 d)`),
    I('carga_motor', '¿El combustible se suministra con el motor apagado?', false, 'No.', `${N31}, 17.4.1 o)`),
    I('tope_ok', '¿Hay topes en las orillas del terraplén?', true, 'Sí.', `${N31}, 15.11`)],
  pasos: [
    E('El operador baja de la retroexcavadora para ayudar. ¿Qué debe hacer antes?', ['Poner el freno, retirar la llave y dejar el cucharón sobre el suelo', 'Dejarla encendida para regresar rápido', 'Bajar de un salto'], 0, 'Al abandonar la maquinaria se coloca el freno manual, se retira la llave y los implementos quedan sobre el suelo.', `${N31}, 17.4.1 s)`),
    E('Antes de que los camiones vuelvan a circular junto a la zanja…', ['Se verifica que respeten la distancia de seguridad al borde', 'Se les pide que vayan por la orilla', 'No hace falta revisar nada'], 0, 'Los vehículos respetan en todo momento la distancia de seguridad a la zanja.', `${N31}, 15.7`)],
  analisis: { principal: 'detras_camion', riesgo: 'Atropellamiento durante la reversa del camión', f: 'D', s: 'IV', pista: 'Los camiones dan reversa muchas veces al día y el golpe puede ser fatal.' + fin, control: [
    ctl(true, 'Asignar un ayudante de maniobra para las reversas, con alarma de reversa funcionando y la ruta peatonal separada', 'Combina el dispositivo y el personal que exige la norma y separa a los peatones.', `${N31}, 15.4 a) y b)`),
    ctl(false, 'Que el peón voltee seguido', 'Depende del comportamiento.', NIOSH),
    ctl(false, 'Darle chaleco reflejante', 'El EPP no evita el atropellamiento.', `${N17}, 5.2; ${NIOSH}`),
    ctl(false, 'Pedir al chofer que toque el claxon', 'Aviso débil.', NIOSH)] },
});
})();
