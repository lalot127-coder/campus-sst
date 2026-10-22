// Prácticas en los EDIFICIOS del campus (14/10/2026): hospital, industria, protección civil, laboral, empresa, cafetería y
// biblioteca, con los mismos modos que las zonas de trabajo (recorrido, peligros, inspección, emergencia y análisis).
// Script clásico: agrega entradas a window.PRACTICAS_ZONA; se abre con mundos/practicas/zona/index.html?z=<edificio>.
// REGLA: cada dato normativo cita su numeral, leído en el texto oficial guardado en 02_fuentes_verificadas (NOM-001, 002,
// 004, 005, 011, 017, 018, 025, 026, 027, 029, 030, 035 y 036-1 STPS; NOM-045-SSA2-2005; NOM-003-SEGOB-2011; extractos
// AHA 2025 / IFRC 2025; tríptico SGIRPC CDMX 2022) o ya verificado en mundos/riesgo/catalogo.js (NOM-087, LFT, LGPC).
// Escenas, personas, cantidades y valores de frecuencia/severidad son [FICTICIO – ejercicio didáctico].
(function () {
const Z = window.PRACTICAS_ZONA, FU = window.PRACTICAS_ZONA_FUENTES; if (!Z) return;
const N01 = 'NOM-001-STPS-2008', N02 = 'NOM-002-STPS-2010', N04 = 'NOM-004-STPS-1999', N05 = 'NOM-005-STPS-1998', N06 = 'NOM-006-STPS-2023',
  N11 = 'NOM-011-STPS-2001', N17 = 'NOM-017-STPS-2024', N18 = 'NOM-018-STPS-2015', N25 = 'NOM-025-STPS-2008', N26 = 'NOM-026-STPS-2008',
  N27 = 'NOM-027-STPS-2008', N29 = 'NOM-029-STPS-2011', N30 = 'NOM-030-STPS-2009', N35 = 'NOM-035-STPS-2018', N361 = 'NOM-036-1-STPS-2018',
  N45 = 'NOM-045-SSA2-2005', N87 = 'NOM-087-SEMARNAT-SSA1-2002', S03 = 'NOM-003-SEGOB-2011', LGPC = 'LGPC art. 2', LFT = 'LFT art. 504 fr. I',
  AHA = 'AHA 2025, Parte 7 (algoritmo para legos)', IFRC = 'IFRC 2025', SGIRPC = 'SGIRPC CDMX (2022), tríptico Evacuación o repliegue en caso de sismos',
  T71 = 'NOM-002-STPS-2010, Guía de Referencia VII, Tabla VII.1 (no obligatoria)', NIOSH = 'NIOSH, jerarquía de controles (referencia, no obligatoria)';
Object.assign(FU, {
  [N05]: { t: 'NOM-005-STPS-1998, Manejo, transporte y almacenamiento de sustancias químicas peligrosas (DOF 02/02/1999).' },
  [N27]: { t: 'NOM-027-STPS-2008, Actividades de soldadura y corte-Condiciones de seguridad e higiene (DOF 07/11/2008).' },
  [N30]: { t: 'NOM-030-STPS-2009, Servicios preventivos de seguridad y salud en el trabajo (DOF 22/12/2009).' },
  [N35]: { t: 'NOM-035-STPS-2018, Factores de riesgo psicosocial en el trabajo-Identificación, análisis y prevención (DOF 23/10/2018).' },
  [N361]: { t: 'NOM-036-1-STPS-2018, Factores de riesgo ergonómico en el trabajo-Identificación, análisis, prevención y control. Parte 1: Manejo manual de cargas (DOF 23/11/2018).' },
  [N45]: { t: 'NOM-045-SSA2-2005, Para la vigilancia epidemiológica, prevención y control de las infecciones nosocomiales (DOF 20/11/2009).' },
  [N87]: { t: 'NOM-087-SEMARNAT-SSA1-2002, Protección ambiental-Salud ambiental-Residuos peligrosos biológico-infecciosos (DOF 17/02/2003).' },
  [S03]: { t: 'NOM-003-SEGOB-2011, Señales y avisos para protección civil (DOF 23/12/2011).' },
  [LGPC]: { t: 'Ley General de Protección Civil, art. 2 (definiciones).' },
  [LFT]: { t: 'Ley Federal del Trabajo, art. 504 fr. I (medicamentos y material de curación para primeros auxilios).' },
  [AHA]: { t: 'American Heart Association. Guías 2025 de RCP y ACE, Parte 7 (soporte vital básico del adulto).' },
  [IFRC]: { t: 'IFRC. International First Aid, Resuscitation and Education Guidelines 2025.' },
  [SGIRPC]: { t: 'Secretaría de Gestión Integral de Riesgos y Protección Civil de la CDMX (2022). Tríptico «Evacuación o repliegue en caso de sismos».' },
});
const fin = ' [FICTICIO – ejercicio didáctico]';
const ctl = (ok, t, fb, f) => ({ t, ok, fb, f });
const P = (id, real, obj, icono, nombre, fb, f) => ({ id, real, obj, icono, nombre, fb, f });
const I = (obj, q, a, exp, f) => ({ obj, q, a, exp, f });
const E = (q, ops, ok, exp, f, anim) => ({ q, ops, ok, exp, f, anim });
const R = (at, titulo, texto, f) => ({ at, titulo, texto, f });
const sin = { casco: null };   // personas de interiores sin casco
const base = (o) => Object.assign({ ancho: 22, fondo: 16, interior: true, alto: 3.2, reunion: [0, 11.5], exterior: 0x9CC48E }, o);

// ============================================================== HOSPITAL
Z.hospital = base({ nombre: 'Hospital: hospitalización y curaciones', icono: '🏥', piso: 0xDCE3E8, muro: 0xEAF2F6, rotulo: 'HOSPITALIZACIÓN · CURACIONES',
  intro: 'Área de hospitalización con sala de curaciones y estación de enfermería, a media mañana.' + fin,
  escena: [['r:camilla', -8, -6, 0], ['r:camilla', -5, -6, 0], ['r:camilla', -2, -6, 0], ['r:mesa', 2.5, -6.6, 0], ['r:lavamanos', 8.5, -7.4, 0], ['r:contenedor_cerrado', 6.2, -7.2, 0],
    ['r:escritorio', -7.5, 2, 0], ['r:silla', -7.5, 2.9, Math.PI], ['r:anaquel', -10.3, -1.5, Math.PI / 2], ['r:botiquin', 10.6, 1.5, -Math.PI / 2], ['r:senal_salida', 2.2, 7.85, 0], ['r:planta', 9.8, 6.8, 0]],
  recorrido: [
    R([8.5, -5.6], 'Higiene de manos', 'Todo el personal de salud se lava las manos con agua corriente y jabón y se seca con toallas desechables; hace higiene de manos antes y después de revisar a cada paciente.', `${N45}, 10.6.1.1`),
    R([-5, -4.4], 'Tarjetones de precauciones', 'Se cumplen las precauciones estándar y hay tarjetones de precauciones específicas: estándar (rojo), contacto (amarillo), gotas (verde) y vía aérea (azul), en la entrada del cuarto o en la cabecera.', `${N45}, 10.6.5.1 y 10.6.5.2`),
    R([-2, -4.4], 'Limpieza de camas', 'Cada vez que se desocupa una cama se limpia y desinfecta, de acuerdo con el manual de procedimientos.', `${N45}, 10.6.7.6`),
    R([2.5, -5.2], 'Desinfectantes', 'Los recipientes con desinfectante permanecen tapados y rotulados con el producto, la fecha de preparación y la de caducidad.', `${N45}, 10.6.6.4`),
    R([5.4, -5.6], 'Punzocortantes', 'Los punzocortantes se depositan en recipientes rígidos rojos, que se llenan como máximo al 80 %.', `${N87}, 6.2 y 6.2.1`),
    R([0, 3], 'Ruta de evacuación', 'Las rutas de evacuación están señalizadas y libres de obstáculos; el plan prevé la evacuación de las personas con discapacidad.', `${N02}, 7.15 a) y b); 8.1 e)`),
    R([9.4, 4], 'Extintor', 'Los extintores están visibles, de fácil acceso, libres de obstáculos y señalizados.', `${N02}, 7.2 b) y c)`)],
  peligros: [
    P('sin_lavado', true, ['persona', -3.5, -4.4, Math.PI, { ropa: 0x80CBC4, casco: null }], '🧼', 'Enfermera pasa de un paciente a otro sin higiene de manos', 'Se realiza higiene de manos antes y después de revisar a cada paciente.', `${N45}, 10.6.1.1`),
    P('punzo', true, ['r:punzo', 4.4, -7.1, 0], '💉', 'Agujas usadas en la basura común', 'Punción y contagio: los punzocortantes van en recipiente rígido.', `${N87}, 6.2`),
    P('desinf', true, ['r:tambo', 0.6, -7.2, 0], '🧴', 'Bidón de desinfectante destapado y sin rótulo', 'Los recipientes con desinfectante permanecen tapados y rotulados.', `${N45}, 10.6.6.4`),
    P('camilla_pasillo', true, ['r:camilla', 0.3, 4.6, Math.PI / 2], '🛏️', 'Camilla estacionada en la ruta de evacuación', 'Las rutas de evacuación deben estar libres de obstáculos.', `${N02}, 7.15 b)`),
    P('charco', true, ['r:charco', -4, 0.6, 0], '💧', 'Piso mojado sin señal frente a la estación de enfermería', 'Los pisos se mantienen de modo que los estancamientos de líquidos no generen caídas o resbalones.', `${N01}, 7.4 b)`),
    P('multi', true, ['r:multicontacto', -6.2, 3.2, 0], '🔌', 'Multicontacto con varias cargas: bomba de infusión, monitor y cafetera', 'Las sobrecargas (varias cargas en un solo tomacorriente) se revisan y corrigen en el programa de instalaciones eléctricas.', `${N02}, 7.5.2`),
    P('lavabo_ok', false, ['marca', 8.5, -7.4, 0, { alto: 1.2 }], '🚰', 'Lavabo con agua corriente, jabón líquido y toallas desechables', 'Condición controlada.', `${N45}, 10.6.1.1`),
    P('rpbi_ok', false, ['marca', 6.2, -7.2, 0, { alto: 1.2 }], '🟥', 'Recipiente rojo para punzocortantes cerrado y lleno a menos del 80 %', 'Condición controlada: envasado y llenado correctos.', `${N87}, 6.2 y 6.2.1`),
    P('extintor_ok', false, ['extintor', 10.4, 4, -Math.PI / 2], '🧯', 'Extintor visible, señalizado y sin obstáculos', 'Condición controlada.', `${N02}, 7.2 b) y c)`),
    P('tarjeton', false, ['r:buzon', -5, -7.75, 0], '🟥', 'Tarjetón de precauciones en la cabecera', 'Condición controlada: indica los cuidados del paciente.', `${N45}, 10.6.5.1 y 10.6.5.2`)],
  inspeccion: [
    I('lavabo_ok', '¿El lavabo tiene agua corriente, jabón y toallas desechables?', true, 'Sí.', `${N45}, 10.6.1.1`),
    I('rpbi_ok', '¿El recipiente de punzocortantes está cerrado y a menos del 80 %?', true, 'Sí.', `${N87}, 6.2.1`),
    I('punzo', '¿Todas las agujas usadas se desechan en el recipiente rígido rojo?', false, 'No: hay agujas en la basura común.', `${N87}, 6.2`),
    I('desinf', '¿Los desinfectantes están tapados y rotulados?', false, 'No: hay un bidón destapado y sin rótulo.', `${N45}, 10.6.6.4`),
    I('camilla_pasillo', '¿La ruta de evacuación está libre de obstáculos?', false, 'No: hay una camilla estacionada.', `${N02}, 7.15 b)`),
    I('extintor_ok', '¿El extintor está visible, accesible y señalizado?', true, 'Sí.', `${N02}, 7.2 b) y c)`)],
  emergencia: { intro: 'Sale humo y hay flamas en el multicontacto de la estación de enfermería; hay pacientes encamados.' + fin, foco: 'multi', efecto: 'incendio', pasos: [
    E('¿Qué haces primero?', ['Poner en práctica el procedimiento de alertamiento', 'Grabar con el celular', 'Seguir con la curación'], 0, 'Al detectar una emergencia de incendio se pone en práctica el procedimiento de alertamiento.', `${N02}, 6.9 y 8.1 c)`, ['alarma', 'yo', '¡Alarma de incendio!']),
    E('Es un fuego pequeño en un equipo eléctrico y estás capacitada/o. ¿Con qué lo combates?', ['Con el extintor de polvo químico seco ABC o de CO2 (fuego clase C)', 'Con agua del lavabo', 'Con una sábana húmeda'], 0, 'Para fuego clase C sirven PQS ABC o CO2; el agua no se usa en equipo energizado. Solo combate un fuego incipiente quien está entrenado.', `${T71}; ${N02}, 11.2 e)`, ['apagar', 'multi', 'pqs']),
    E('¿Cómo se evacua a los pacientes que no pueden caminar?', ['Con el procedimiento de evacuación que considera a las personas con discapacidad', 'Se les deja en su cama', 'Cada quien sale por su cuenta'], 0, 'El plan incluye el procedimiento de evacuación de trabajadores, pacientes y visitantes, considerando a las personas con capacidades diferentes.', `${N02}, 8.1 e)`, ['evacuar', 'yo', 4]),
    E('¿Usan el elevador para bajar a los pacientes?', ['No: los elevadores no se usan en caso de incendio', 'Sí, es más rápido', 'Solo si hay luz'], 0, 'Los elevadores no forman parte de la ruta de evacuación y no se usan en caso de incendio.', `${N02}, 7.15 f)`),
    E('¿Quién pide ayuda a los bomberos?', ['Se aplica el procedimiento de solicitud de auxilio a cuerpos especializados, con su directorio', 'Nadie: ya se apagó', 'Un paciente con su celular'], 0, 'El plan incluye el procedimiento de solicitud de auxilio y el directorio de los cuerpos especializados.', `${N02}, 8.1 i)`),
    E('¿Cuándo regresan al área?', ['Con el procedimiento de retorno a actividades normales, una vez eliminados los riesgos e identificados los daños', 'En cuanto deje de salir humo', 'De inmediato'], 0, 'El plan define el retorno a actividades normales.', `${N02}, 8.1 j)`),
    E('¿Qué pasa con el extintor que se usó?', ['Se recarga después de su uso', 'Se regresa a su lugar así', 'Se tira'], 0, 'Se proporciona la recarga a los extintores después de su uso.', `${N02}, 7.19`)] },
  analisis: [
    { principal: 'punzo', riesgo: 'Punción con aguja contaminada (riesgo biológico)', f: 'D', s: 'III', pista: 'Pasa con regularidad cuando las agujas van a la basura común y el contagio puede dejar daño permanente.' + fin, control: [
      ctl(true, 'Desechar las agujas de inmediato en un recipiente rígido rojo en el punto de uso', 'Separa el peligro desde su origen: es el envasado que la norma fija.', `${N87}, 6.2; ${NIOSH}`),
      ctl(false, 'Usar doble guante y seguir tirándolas a la basura', 'El EPP no evita la punción del personal de limpieza.', `${N17}, 5.2; ${NIOSH}`),
      ctl(false, 'Avisar al personal de limpieza que tenga cuidado', 'Depende del comportamiento.', NIOSH),
      ctl(false, 'Pegar un letrero en el bote', 'Control administrativo débil.', NIOSH)] },
    { principal: 'camilla_pasillo', riesgo: 'Evacuación bloqueada por una camilla en la ruta', f: 'C', s: 'IV', pista: 'Solo importa si hay una emergencia, pero puede atrapar a pacientes y personal.' + fin, control: [
      ctl(true, 'Retirar la camilla y definir un área de estacionamiento fuera de la ruta de evacuación', 'Elimina la obstrucción de la ruta.', `${N02}, 7.15 b)`),
      ctl(false, 'Dejarla y moverla si hay emergencia', 'En una emergencia no hay tiempo.', NIOSH),
      ctl(false, 'Ponerle un letrero de "estorbo"', 'No libera la ruta.', NIOSH),
      ctl(false, 'Acordonarla con cinta', 'Sigue bloqueando la ruta.', NIOSH)] }],
});

// ============================================================== INDUSTRIA
Z.industria = base({ nombre: 'Industria: taller de producción', icono: '🏭', piso: 0xBFC4C8, muro: 0xE3E6E8, rotulo: 'TALLER DE PRODUCCIÓN', alto: 4,
  intro: 'Taller de metalmecánica con prensas, área de soldadura, compresor, almacén de solventes y montacargas.' + fin,
  escena: [['r:prensa', -7, -5, 0], ['r:guarda', -3.6, -5, 0], ['r:soldadura', 3.6, -5.8, 0], ['r:compresora', 9, -6.6, 0], ['r:tablero', 10.85, -1, -Math.PI / 2], ['r:anaquel', -10.3, 1.5, Math.PI / 2],
    ['r:franja', -5.4, -5, 0], ['r:senal_obligacion', -9.8, -2.4, 0], ['montacargas', 6, 2, Math.PI / 2], ['extintor', 1.2, -7.6, 0], ['bitacora', -10.4, 4.6, Math.PI / 2, { texto: 'HOJAS DE DATOS DE SEGURIDAD' }],
    ['letrero', 9, -3.8, 0, { texto: 'COMPRESOR · 92 dB(A)', fondo: '#FFD100', color: '#111' }], ['r:basurero', -1, 6.2, 0]],
  recorrido: [
    R([-7, -3.2], 'Protectores de la maquinaria', 'Los protectores dan protección total al trabajador, impiden el acceso a la zona de riesgo y están fijos y resistentes.', `${N04}, 8.1.1 a), d) y j)`),
    R([-3.6, -3.2], 'Paro de emergencia', 'La maquinaria tiene dispositivos de paro de urgencia de fácil activación.', `${N04}, 8.2.1`),
    R([3.6, -3.6], 'Área de soldadura', 'Hay un extintor tipo ABC a no más de 7 m, casetas o mamparas que delimitan el área y ventilación natural o artificial.', `${N27}, cap. 8 a), b) y h)`),
    R([3.6, -1.4], 'Combustibles cerca de la soldadura', 'Se verifica que no haya materiales combustibles en un radio no menor a 10 metros del área de soldadura.', `${N27}, 10.3 b)`),
    R([9, -2.6], 'Ruido del compresor', 'Con exposición a 85 dB(A) o más se proporciona protección auditiva.', `${N11}, 5.4`),
    R([9.2, 0.8], 'Tablero eléctrico', 'Se mantiene libre de obstáculos el acceso a los tableros.', `${N29}, 10.2 k)`),
    R([-8.8, 4.6], 'Sustancias químicas', 'Las hojas de datos de seguridad están disponibles en el área y los recipientes con sustancias peligrosas permanecen cerrados mientras no se usan.', `${N18}, 6.4; ${N05}, 9.8`),
    R([4, 2.6], 'Montacargas', 'El montacargas tiene alarma sonora de reversa y luz ámbar centelleante o giratoria cuando está en movimiento.', `${N06}, 8.5.1 b) y d)`)],
  peligros: [
    P('prensa', true, ['marca', -7, -5, 0, { alto: 2.2 }], '⚙️', 'Prensa operando sin protector en el punto de operación', 'Los protectores deben dar protección total e impedir el acceso a la zona de riesgo.', `${N04}, 8.1.1 a) y d)`),
    P('solvente', true, ['r:tambo', 6.2, -4.6, 0], '🛢️', 'Tambo de solvente abierto a 3 m de la soldadura', 'No debe haber combustibles en un radio menor a 10 m y los recipientes con sustancias peligrosas permanecen cerrados.', `${N27}, 10.3 b); ${N05}, 9.8`),
    P('soldador', true, ['persona', 3.2, -4.4, Math.PI, { ropa: 0x5D4037, casco: null }], '🥽', 'Soldador trabajando sin careta ni lentes de sombra', 'Se usa al menos careta o lentes con sombra de soldador y protección facial, según el proceso.', `${N27}, cap. 8 c)`),
    P('tablero', true, ['cajas', 9.6, -0.2, 0], '⚡', 'Cajas apiladas frente al tablero eléctrico', 'Se mantiene libre de obstáculos el acceso a los tableros.', `${N29}, 10.2 k)`),
    P('ruido', true, ['persona', 8.2, -5.2, 0, { ropa: 0x1565C0, casco: 0xF2C230 }], '🎧', 'Mecánico junto al compresor (92 dB(A)) sin protección auditiva', 'Con 85 dB(A) o más se proporciona protección auditiva.', `${N11}, 5.4`),
    P('anillos', true, ['persona', -7, -3.6, Math.PI, { ropa: 0xEF6C00, casco: 0xF2C230 }], '💍', 'Operador de la prensa con anillos y pulsera', 'Quien opera maquinaria no porta cadenas, anillos, pulseras ni mangas sueltas.', `${N04}, 6.5`),
    P('guarda_ok', false, ['marca', -3.6, -5, 0, { alto: 2 }], '🛡️', 'Máquina con su guarda colocada', 'Condición controlada.', `${N04}, 8.1.1`),
    P('franja_ok', false, ['marca', -5.4, -5, 0, { alto: 0.4 }], '🟨', 'Área delimitada con franjas amarillas en el piso', 'Las áreas se delimitan, por ejemplo, con franjas amarillas de al menos 5 cm de ancho.', `${N01}, 7.1.2`),
    P('extintor_ok', false, ['marca', 1.2, -7.6, 0, { alto: 1.4 }], '🧯', 'Extintor PQS ABC a menos de 7 m del área de soldadura', 'Condición controlada.', `${N27}, cap. 8 a)`),
    P('hds_ok', false, ['marca', -10.4, 4.6, 0, { alto: 2 }], '📄', 'Hojas de datos de seguridad a la vista', 'Condición controlada.', `${N18}, 6.4`)],
  inspeccion: [
    I('guarda_ok', '¿La máquina tiene su guarda colocada y fija?', true, 'Sí.', `${N04}, 8.1.1 j)`),
    I('prensa', '¿La prensa tiene protector en el punto de operación?', false, 'No.', `${N04}, 8.1.1 a)`),
    I('extintor_ok', '¿Hay un extintor ABC a no más de 7 m de la soldadura?', true, 'Sí.', `${N27}, cap. 8 a)`),
    I('solvente', '¿El área de soldadura está libre de combustibles en un radio de 10 m?', false, 'No: hay un tambo de solvente a 3 m.', `${N27}, 10.3 b)`),
    I('tablero', '¿El acceso al tablero eléctrico está libre?', false, 'No: hay cajas apiladas.', `${N29}, 10.2 k)`),
    I('franja_ok', '¿Las áreas están delimitadas con franjas de al menos 5 cm?', true, 'Sí.', `${N01}, 7.1.2`)],
  emergencia: { intro: 'Una chispa de la soldadura encendió el solvente del tambo abierto.' + fin, foco: 'solvente', efecto: 'incendio', pasos: [
    E('¿Qué haces primero?', ['Poner en práctica el procedimiento de alertamiento', 'Echarle agua al tambo', 'Seguir soldando'], 0, 'Al detectar una emergencia de incendio se pone en práctica el procedimiento de alertamiento.', `${N02}, 6.9 y 8.1 c)`, ['alarma', 'yo', '¡Incendio en soldadura!']),
    E('¿Qué clase de fuego es?', ['Clase B: líquidos inflamables', 'Clase A: sólidos', 'Clase K: aceites de cocina'], 0, 'El solvente es un líquido inflamable: fuego clase B.', `${N02}, 4.11`),
    E('Es incipiente y estás entrenada/o. ¿Con qué lo combates?', ['Con el extintor de polvo químico seco ABC (o CO2)', 'Con el extintor de agua', 'Con una manguera de aire comprimido'], 0, 'Para clase B sirven PQS ABC, PQS BC o CO2; el agua no. Solo combate un fuego incipiente quien está entrenado.', `${T71}; ${N02}, 11.2 e)`, ['apagar', 'solvente', 'pqs']),
    E('El fuego crece. ¿Qué hace el resto del personal?', ['Evacuar por la ruta señalizada hasta el punto de reunión', 'Acercarse a ver', 'Esconderse en el almacén'], 0, 'El plan identifica rutas de evacuación, salidas y puntos de reunión.', `${N02}, 8.1 b)`, ['evacuar', 'yo', 4]),
    E('¿Quién decide las acciones de combate?', ['La brigada, que evalúa los riesgos de la situación a través de su responsable', 'Cualquier persona', 'El cliente'], 0, 'La brigada evalúa los riesgos de la emergencia y toma las decisiones a través de su responsable.', `${N02}, 9.3 a)`),
    E('Antes de volver a soldar…', ['Se retiran los combustibles a más de 10 m y se colocan mamparas', 'Se suelda más lejos sin mover nada', 'Se tapa el tambo con cartón'], 0, 'No debe haber combustibles en un radio menor a 10 m y el área se delimita con casetas o mamparas.', `${N27}, 10.3 b) y cap. 8 b)`)] },
  analisis: [
    { principal: 'prensa', riesgo: 'Atrapamiento o amputación en el punto de operación de la prensa', f: 'D', s: 'III', pista: 'La prensa trabaja todo el turno y una mano atrapada puede quedar con daño permanente.' + fin, control: [
      ctl(true, 'Instalar el protector fijo en el punto de operación (y dispositivos de seguridad)', 'Control de ingeniería: impide el acceso a la zona de riesgo.', `${N04}, 8.1.1 a) y d); ${NIOSH}`),
      ctl(false, 'Pedir al operador que tenga cuidado', 'Depende del comportamiento.', NIOSH),
      ctl(false, 'Darle guantes gruesos', 'El EPP no evita el atrapamiento.', `${N17}, 5.2; ${NIOSH}`),
      ctl(false, 'Colocar una señal de advertencia', 'Control administrativo débil.', NIOSH)] },
    { principal: 'solvente', riesgo: 'Incendio por combustibles junto a la soldadura', f: 'C', s: 'IV', pista: 'Solo con chispas cerca, pero el incendio puede ser fatal.' + fin, control: [
      ctl(true, 'Retirar los combustibles a más de 10 m, cerrar los recipientes y delimitar con mamparas', 'Elimina el combustible del alcance de las chispas.', `${N27}, 10.3 b) y cap. 8 b); ${N05}, 9.8`),
      ctl(false, 'Tener un extintor más cerca y seguir así', 'Ayuda a responder, pero no previene el incendio.', NIOSH),
      ctl(false, 'Que el soldador use ropa de algodón', 'EPP: no elimina el combustible.', `${N17}, 5.2; ${NIOSH}`),
      ctl(false, 'Soldar más rápido', 'No controla el peligro.', NIOSH)] }],
});

// ============================================================== PROTECCIÓN CIVIL
Z.proteccion = base({ nombre: 'Protección civil: edificio de oficinas', icono: '🚨', piso: 0xD7D2C8, muro: 0xF1EEE8, rotulo: 'OFICINAS · PISO 1',
  intro: 'Planta de oficinas con 40 personas, sala de juntas y salida de emergencia lateral.' + fin,
  reunion: [0, 12],
  escena: [['r:escritorio', -7, -5, 0], ['r:escritorio', -3.4, -5, 0], ['r:escritorio', 3.4, -5, 0], ['r:silla', -7, -4.2, Math.PI], ['r:silla', -3.4, -4.2, Math.PI], ['r:silla', 3.4, -4.2, Math.PI],
    ['r:mesa', 7.6, -5.2, 0], ['bitacora', -1, 7.4, Math.PI, { texto: 'CROQUIS DE EVACUACIÓN' }], ['r:senal_salida', 10.85, 4, -Math.PI / 2], ['r:lampara', 10.85, 6, -Math.PI / 2],
    ['r:botiquin', -10.6, -1.5, Math.PI / 2], ['senal', 9.2, 7.6, Math.PI, { senal: 'ruta' }], ['letrero', 7.4, -7.6, 0, { texto: 'ELEVADOR', fondo: '#B0BEC5', color: '#111' }]],
  divisiones: [[10.95, 4.8, 0.05, 1.6, 2.2]],
  recorrido: [
    R([-1, 5.8], 'Croquis', 'Hay un croquis actualizado en los lugares de entrada y tránsito, con rutas de evacuación, salidas, equipos contra incendio y primeros auxilios.', `${N02}, 5.2 d), e) y g)`),
    R([4, 3.2], 'Ruta de evacuación', 'La ruta está señalizada, libre de obstáculos y con iluminación de emergencia; desde el punto más alejado hay a lo más 40 m hasta la ruta (o se evacua en tres minutos).', `${N02}, 7.15 a), b), c) y d)`),
    R([9.4, 4.6], 'Salida de emergencia', 'Las puertas de emergencia abren en el sentido del flujo, se abren desde dentro con un empuje y no tienen candados ni seguros durante el horario laboral.', `${N02}, 7.16 c), e) y f)`),
    R([7.4, -6], 'Elevador', 'Cerca de los elevadores hay una señal que prohíbe usarlos en caso de incendio; no forman parte de la ruta de evacuación.', `${N02}, 7.9 y 7.15 f)`),
    R([-9, -1.5], 'Extintores', 'Se coloca al menos un extintor por cada 300 m² en riesgo ordinario, a no más de 1.50 m de altura.', `${N02}, 7.17 b) y f)`),
    R([0, -2], 'Simulacros', 'Se hacen simulacros de incendio al menos una vez al año (riesgo ordinario) o dos veces al año (riesgo alto).', `${N02}, 5.7`),
    R([-5, 2], 'Señales de protección civil', 'Las señales informativas de ruta de evacuación y salida de emergencia en interiores deben poder observarse bajo cualquier condición.', `${S03}, 6.6`)],
  peligros: [
    P('ruta_bloqueada', true, ['cajas', 4, 4.4, 0], '📦', 'Cajas de archivo bloqueando la ruta de evacuación', 'La ruta de evacuación debe estar libre de obstáculos.', `${N02}, 7.15 b)`),
    P('puerta_candado', true, ['r:puerta_candado', 10.85, 4.8, -Math.PI / 2], '🔒', 'Salida de emergencia con candado en horario laboral', 'Las salidas de emergencia están libres de candados o seguros durante las horas laborales.', `${N02}, 7.16 f)`),
    P('extintor_tapado', true, ['r:extintor_obstruido', -10.4, 3.4, Math.PI / 2], '🧯', 'Extintor tapado con cajas', 'Se prohíbe almacenar objetos que obstruyan el acceso al equipo contra incendio.', `${N02}, 7.14`),
    P('anaquel', true, ['r:anaquel', -6, 6.6, 0], '🗄️', 'Anaquel alto sin anclar junto a la ruta', 'Puede volcarse y bloquear la salida en un sismo.', `${LGPC} fr. XXIII`),
    P('senal_tapada', true, ['persona', 6.2, 6.8, 0.6, { casco: null, ropa: 0x8E24AA }], '🪧', 'Persona pegando un cartel encima de la señal de ruta de evacuación', 'No se bloquean ni dañan los señalamientos de evacuación.', `${N02}, 6.8 y 7.10`),
    P('croquis_ok', false, ['marca', -1, 7.4, 0, { alto: 2 }], '🗺️', 'Croquis de evacuación actualizado en la entrada', 'Condición controlada.', `${N02}, 5.2`),
    P('salida_ok', false, ['marca', 10.85, 4, 0, { alto: 2.6 }], '🟩', 'Señal de salida de emergencia visible', 'Condición controlada.', `${N02}, 7.16 a)`),
    P('lampara_ok', false, ['marca', 10.85, 6, 0, { alto: 2.6 }], '💡', 'Lámpara de emergencia sobre la ruta', 'Condición controlada: permite ver el piso si se va la luz.', `${N02}, 7.15 c)`)],
  inspeccion: [
    I('croquis_ok', '¿Hay croquis con rutas de evacuación, salidas y equipos contra incendio?', true, 'Sí.', `${N02}, 5.2`),
    I('ruta_bloqueada', '¿La ruta de evacuación está libre de obstáculos?', false, 'No: hay cajas de archivo.', `${N02}, 7.15 b)`),
    I('puerta_candado', '¿La salida de emergencia está libre de candados en horario laboral?', false, 'No.', `${N02}, 7.16 f)`),
    I('lampara_ok', '¿La ruta tiene iluminación de emergencia?', true, 'Sí.', `${N02}, 7.15 c)`),
    I('extintor_tapado', '¿El acceso al extintor está libre?', false, 'No: hay cajas enfrente.', `${N02}, 7.14`),
    I('salida_ok', '¿La salida de emergencia está identificada con su señal?', true, 'Sí.', `${N02}, 7.16 a)`)],
  emergencia: { intro: 'Se detecta humo en la sala de juntas y suena la alarma de incendio.' + fin, foco: 'croquis_ok', efecto: 'humo', pasos: [
    E('Suena la alarma. ¿Qué haces?', ['Seguir el plan: dejar lo que haces y dirigirme a la ruta de evacuación', 'Guardar mis archivos', 'Ir al elevador'], 0, 'El plan identifica rutas de evacuación, salidas y puntos de reunión.', `${N02}, 8.1 b)`, ['alarma', 'yo', 'Alarma: evacuación']),
    E('Hay visitantes en la recepción. ¿Qué haces?', ['Conducirlos a un lugar seguro, como indica la capacitación', 'Dejar que busquen la salida', 'Pedirles que esperen'], 0, 'Los trabajadores se capacitan para conducir a los visitantes a un lugar seguro en caso de emergencia.', `${N02}, 11.2 f)`),
    E('¿Usas el elevador?', ['No', 'Sí, si hay pocos', 'Solo para bajar las cajas'], 0, 'Los elevadores no se usan en caso de incendio.', `${N02}, 7.15 f)`),
    E('La salida de emergencia, ¿hacia dónde abre?', ['En el sentido del flujo, con un empuje desde dentro', 'Hacia adentro, jalando', 'Con llave'], 0, 'Las puertas de emergencia abren en el sentido del flujo y se abren desde el interior con un empuje.', `${N02}, 7.16 c) y e)`, ['evacuar', 'yo', 5]),
    E('Ya en el punto de reunión…', ['Se espera a que la brigada coordine y autorice el regreso', 'Cada quien regresa cuando quiere', 'Se van a su casa sin avisar'], 0, 'El plan incluye los procedimientos para el retorno a actividades normales.', `${N02}, 8.1 j)`),
    E('¿Cada cuánto se practica esta evacuación?', ['Al menos una vez al año (riesgo ordinario) o dos (riesgo alto)', 'Nunca', 'Solo cuando hay inspección'], 0, 'Los simulacros de incendio se realizan al menos una o dos veces al año según el riesgo.', `${N02}, 5.7`)] },
  analisis: [
    { principal: 'ruta_bloqueada', riesgo: 'Personas atrapadas por la ruta de evacuación bloqueada', f: 'D', s: 'IV', pista: 'Las cajas se dejan ahí seguido y en un incendio pueden impedir la salida.' + fin, control: [
      ctl(true, 'Retirar las cajas, asignar un área de archivo fuera de la ruta y revisar la ruta periódicamente', 'Elimina la obstrucción.', `${N02}, 7.15 b)`),
      ctl(false, 'Poner una flecha para rodear las cajas', 'La ruta sigue obstruida.', NIOSH),
      ctl(false, 'Avisar en el simulacro que hay cajas', 'No elimina el obstáculo.', NIOSH),
      ctl(false, 'Pegar una señal de precaución en las cajas', 'No libera la ruta.', NIOSH)] },
    { principal: 'puerta_candado', riesgo: 'Salida de emergencia inutilizable por el candado', f: 'C', s: 'IV', pista: 'Solo importa en una emergencia, pero puede impedir la salida de todos.' + fin, control: [
      ctl(true, 'Retirar el candado y usar un mecanismo que abra desde dentro con un empuje', 'Cumple las condiciones de la salida de emergencia.', `${N02}, 7.16 e) y f)`),
      ctl(false, 'Dejar la llave colgada junto a la puerta', 'Sigue cerrada durante el horario laboral.', NIOSH),
      ctl(false, 'Avisar que se use otra salida', 'No corrige la salida.', NIOSH),
      ctl(false, 'Poner un letrero de "salida"', 'No elimina el candado.', NIOSH)] }],
});

// ============================================================== LABORAL (NOM-035 y condiciones de la oficina)
Z.laboral = base({ nombre: 'Laboral: oficina y factores psicosociales', icono: '⚖️', piso: 0xCFC6B8, muro: 0xF3F0EA, rotulo: 'OFICINAS · 42 PERSONAS',
  intro: 'Oficinas de una distribuidora con 42 personas al cierre del mes.' + fin,
  escena: [['r:escritorio', -7, -5, 0], ['r:escritorio', -3, -5, 0], ['r:escritorio', 1, -5, 0], ['r:escritorio', 5, -5, 0], ['r:silla', -3, -4.2, Math.PI], ['r:silla', 5, -4.2, Math.PI],
    ['r:buzon', -10.85, -2, Math.PI / 2], ['r:dispensador', 9.6, 5.8, 0], ['r:cuadro', 0, -7.85, 0], ['r:planta', -9.6, 6.6, 0], ['bitacora', -8.4, 7.4, Math.PI, { texto: 'POLÍTICA DE PREVENCIÓN DE RIESGOS PSICOSOCIALES' }],
    ['letrero', 7.6, -2.4, 0.2, { texto: 'ENTREGAS DE HOY: 6 REPORTES', fondo: '#FFFFFF', color: '#B71C1C' }], ['r:mesa', 7, 3, 0]],
  recorrido: [
    R([-8.4, 5.8], 'Política', 'Hay una política escrita de prevención de riesgos psicosociales: prevención de factores de riesgo, de la violencia laboral y promoción de un entorno organizacional favorable.', `${N35}, 5.1`),
    R([-9.4, -2], 'Buzón de quejas', 'Existen mecanismos seguros y confidenciales para recibir quejas y denunciar actos de violencia laboral.', `${N35}, 8.1 b)`),
    R([-3, -3], 'Cargas de trabajo', 'Se identifican las cargas de trabajo que exceden la capacidad de las personas (cuantitativas, mentales, emocionales…).', `${N35}, 7.2 b)`),
    R([1, -3], 'Identificación periódica', 'Con más de 50 personas se identifican los factores y se evalúa el entorno organizacional; con 16 a 50, se identifican los factores; al menos cada dos años y con resultados disponibles.', `${N35}, 7.1, 7.8 y 7.9`),
    R([5, -3], 'Iluminación', 'Para trabajos de oficina el nivel mínimo es de 300 lx; en captura y procesamiento de información, 500 lx.', `${N25}, 7 (Tabla 1)`),
    R([7, 4.6], 'Acontecimientos traumáticos severos', 'Se identifica a quienes sufrieron un acontecimiento traumático severo con motivo del trabajo y se les canaliza para su atención.', `${N35}, 5.5`)],
  peligros: [
    P('cargas', true, ['persona', 5, -4.2, Math.PI, { casco: null, ropa: 0x6A1B9A }], '📚', 'Analista con seis entregas para hoy, sin apoyo ni prioridades', 'Las cargas de trabajo que exceden la capacidad son un factor de riesgo psicosocial.', `${N35}, 7.2 b)`),
    P('medianoche', true, ['persona', -3, -4.2, Math.PI, { casco: null, ropa: 0x37474F }], '📱', 'Jefe que manda mensajes de trabajo a medianoche y fines de semana', 'Atender constantemente el trabajo fuera de la jornada es interferencia en la relación trabajo-familia.', `${N35}, 7.2 e)`),
    P('burlas', true, ['persona', 1, -2.6, 0.4, { casco: null, ropa: 0xC62828 }], '😠', 'Burlas constantes a un compañero frente a todos', 'Son actos de violencia laboral (acoso o malos tratos).', `${N35}, 7.2 g)`),
    P('jornada', true, ['persona', -7, -4.2, Math.PI, { casco: null, ropa: 0x2E7D32 }], '⏰', 'Personal que dobla turno toda la semana sin pago ni descanso', 'Jornadas que exceden lo establecido en la LFT son un factor de riesgo psicosocial.', `${N35}, 7.2 d)`),
    P('cable', true, ['r:cable', 3, 1.2, 0], '🔌', 'Cable de extensión cruzando el pasillo', 'Condición insegura del área que se identifica en el diagnóstico.', `${N30}, 6.1 a)`),
    P('buzon_ok', false, ['marca', -10.85, -2, 0, { alto: 1.6 }], '📮', 'Buzón confidencial de quejas', 'Condición controlada.', `${N35}, 8.1 b)`),
    P('politica_ok', false, ['marca', -8.4, 7.4, 0, { alto: 2 }], '📜', 'Política de prevención publicada', 'Condición controlada.', `${N35}, 5.1 y 5.7 a)`),
    P('agua_ok', false, ['marca', 9.6, 5.8, 0, { alto: 1.6 }], '🚰', 'Dispensador de agua potable', 'Condición controlada.', `${N30}, 3.8`)],
  inspeccion: [
    I('politica_ok', '¿Existe y se difunde la política de prevención de riesgos psicosociales?', true, 'Sí.', `${N35}, 5.1 y 5.7 a)`),
    I('buzon_ok', '¿Hay un mecanismo seguro y confidencial para quejas y denuncias?', true, 'Sí, el buzón.', `${N35}, 8.1 b)`),
    I('cargas', '¿Las cargas de trabajo están dentro de la capacidad de las personas?', false, 'No.', `${N35}, 7.2 b)`),
    I('burlas', '¿El trato entre compañeros está libre de violencia laboral?', false, 'No: hay burlas constantes.', `${N35}, 7.2 g)`),
    I('jornada', '¿Las jornadas respetan lo que establece la LFT?', false, 'No: se dobla turno toda la semana.', `${N35}, 7.2 d)`),
    I('cable', '¿El pasillo está libre de cables que provoquen tropiezos?', false, 'No.', `${N30}, 6.1 a)`)],
  emergencia: { intro: 'Un cliente agredió con violencia a una compañera en la recepción; ella quedó muy afectada.' + fin, foco: 'burlas', efecto: 'ninguno', pasos: [
    E('Tiene un golpe leve en el brazo. ¿Con qué se le atiende en el momento?', ['Con el botiquín y el personal que presta los primeros auxilios', 'Con un café', 'No se atiende'], 0, 'El patrón mantiene medicamentos y material de curación para primeros auxilios y adiestra al personal que los presta.', LFT, ['acudir', 'burlas']),
    E('¿Qué debe hacer el patrón con la trabajadora?', ['Identificarla como persona que sufrió un acontecimiento traumático severo y canalizarla para su atención', 'Pedirle que siga trabajando', 'Despedirla'], 0, 'Se identifica a quienes sufrieron un acontecimiento traumático severo y se les canaliza a la institución de seguridad social o privada, o al médico.', `${N35}, 5.5`),
    E('¿Quién informa por escrito lo ocurrido?', ['Quien lo sufrió o presenció, al patrón, a los servicios preventivos o a la comisión de seguridad e higiene', 'Nadie: mejor no hacer ruido', 'El cliente'], 0, 'Los trabajadores informan por escrito haber presenciado o sufrido un acontecimiento traumático severo.', `${N35}, 6.5`),
    E('Si presenta signos o síntomas de alteración a su salud…', ['Se le practican exámenes médicos y evaluaciones psicológicas', 'Se le deja de hablar', 'Se le cambia de turno sin explicar'], 0, 'Se practican exámenes médicos y evaluaciones psicológicas cuando existan signos o síntomas.', `${N35}, 5.6`),
    E('¿Qué queda registrado?', ['Los nombres de quienes fueron evaluados por exposición a acontecimientos traumáticos severos', 'Nada', 'Solo el nombre del cliente'], 0, 'Se llevan registros de los trabajadores evaluados que estuvieron expuestos.', `${N35}, 5.8 c)`),
    E('¿Cómo se informa al personal de las medidas?', ['Se difunden las medidas contra la violencia laboral y los mecanismos para presentar quejas', 'Con chismes', 'No se informa'], 0, 'El patrón difunde las medidas adoptadas y los mecanismos de queja y denuncia.', `${N35}, 5.7 b) y d)`)] },
  analisis: [
    { principal: 'cargas', riesgo: 'Estrés por cargas de trabajo que exceden la capacidad', f: 'E', s: 'II', pista: 'Ocurre cada cierre de mes y puede causar incapacidades temporales.' + fin, control: [
      ctl(true, 'Redistribuir las cargas, fijar prioridades y ajustar plazos con el personal', 'Actúa sobre la causa organizacional.', `${N35}, 7.2 b) y 7.3 e)`),
      ctl(false, 'Dar una plática de manejo del estrés y dejar igual las cargas', 'No cambia la carga.', NIOSH),
      ctl(false, 'Ofrecer café ilimitado', 'No controla el factor.', NIOSH),
      ctl(false, 'Pedir que trabajen más rápido', 'Aumenta la carga.', NIOSH)] },
    { principal: 'burlas', riesgo: 'Violencia laboral entre compañeros', f: 'D', s: 'II', pista: 'Se repite cada semana y afecta la salud de quien la recibe.' + fin, control: [
      ctl(true, 'Atender la queja con el mecanismo confidencial, aplicar la política y medidas contra la violencia laboral', 'Es lo que la norma pide para prevenir y atender la violencia laboral.', `${N35}, 5.1 b), 5.4 y 8.1 b)`),
      ctl(false, 'Decirle al afectado que no se lo tome personal', 'Normaliza la violencia.', NIOSH),
      ctl(false, 'Cambiar de lugar al afectado', 'Castiga a quien la recibe.', NIOSH),
      ctl(false, 'Ignorarlo hasta que pare', 'No atiende la conducta.', NIOSH)] }],
});

// ============================================================== EMPRESA · RH (oficinas y archivo)
Z.empresa = base({ nombre: 'Empresa · RH: oficinas y archivo', icono: '🏢', piso: 0xC9C2B6, muro: 0xF2F2EE, rotulo: 'RECURSOS HUMANOS · ARCHIVO',
  intro: 'Oficinas de Recursos Humanos con archivo de expedientes en un nivel inferior (escalera) y área de impresión.' + fin,
  escena: [['r:escritorio', -6, -5, 0], ['r:escritorio', -2, -5, 0], ['r:silla', -6, -4.2, Math.PI], ['r:silla', -2, -4.2, Math.PI], ['r:anaquel', 6, -7.2, 0], ['r:anaquel', 8, -7.2, 0],
    ['r:escalera_guardada', 10.6, -4, -Math.PI / 2], ['r:botiquin', -10.6, 1.2, Math.PI / 2], ['r:lampara', -10.85, 4, Math.PI / 2], ['r:dispensador', 9.6, 5.8, 0], ['extintor', 10.4, 2, -Math.PI / 2],
    ['r:mesa', 2.6, -1.4, 0], ['letrero', 4, -7.7, 0, { texto: 'ARCHIVO DE EXPEDIENTES', fondo: '#0E3A6B', color: '#fff' }]],
  recorrido: [
    R([-4, -3], 'Orden y limpieza', 'Las áreas de trabajo y los pasillos se mantienen con orden y limpieza permanentes.', `${N01}, 7.1.1`),
    R([7, -5.6], 'Anaqueles del archivo', 'Las escaleras portátiles se usan solo con estructura segura, peldaños completos y fijos y apoyos antiderrapantes.', `${N01}, 7.7.2.4`),
    R([9, -2.2], 'Escalera portátil', 'Al usar una escalera portátil, su base se separa de la vertical al menos un peldaño por cada cuatro de altura.', `${N01}, 7.7.2.3`),
    R([4, 1], 'Cajas de expedientes', 'La masa máxima que levanta un hombre de 18 a 45 años es de 25 kg y una mujer de 18 a 45, de 20 kg; si se rebasa se usan diablos, carretillas o se divide la carga.', `${N361}, 8.3 b) 2) y 3)`),
    R([2.6, 0.2], 'Impresora y contactos', 'Se revisan las sobrecargas en contactos (varias cargas en un solo tomacorriente), las conexiones flojas y las improvisaciones.', `${N02}, 7.5.2`),
    R([-9, 1.2], 'Botiquín', 'El patrón mantiene medicamentos y material de curación para primeros auxilios.', LFT)],
  peligros: [
    P('escalera_rota', true, ['r:escalera', 8.6, -6, Math.PI], '🪜', 'Escalera de mano con un peldaño roto apoyada en el anaquel', 'Solo se usan escaleras portátiles con peldaños completos y fijos.', `${N01}, 7.7.2.4 b)`),
    P('silla_ruedas', true, ['persona', 6, -6.2, Math.PI, { casco: null, ropa: 0x6A1B9A, y: 0.5 }], '🪑', 'Persona parada sobre una silla con ruedas para alcanzar el archivo', 'Para alcanzar alturas se usan escaleras portátiles con elementos que eviten su deslizamiento; una silla con ruedas se desliza.', `${N01}, 7.7.2.4 y 7.7.2.6`),
    P('caja_pesada', true, ['persona', 4, 1.6, 0.3, { casco: null, ropa: 0x37474F }], '📦', 'Trabajador cargando solo una caja de expedientes de 32 kg', 'Supera la masa máxima de la Tabla 1 (25 kg para un hombre de 18 a 45 años): se usa diablo o se divide la carga.', `${N361}, 8.3 b) 2) y 3)`),
    P('multi', true, ['r:multicontacto', 2.6, -0.4, 0], '🔌', 'Multicontacto con impresora, cafetera y calefactor', 'Las sobrecargas (varias cargas en un solo tomacorriente) se identifican y corrigen.', `${N02}, 7.5.2`),
    P('cajon', true, ['cajas', -4, 0.4, 0], '🗃️', 'Cajas y archiveros abiertos en el pasillo', 'Orden y limpieza permanentes en las áreas de trabajo y los pasillos.', `${N01}, 7.1.1`),
    P('escalera_ok', false, ['marca', 10.6, -4, 0, { alto: 2.2 }], '🪜', 'Escalera en buen estado, guardada en su soporte', 'Condición controlada.', `${N01}, 7.7.2.4`),
    P('extintor_ok', false, ['marca', 10.4, 2, 0, { alto: 1.4 }], '🧯', 'Extintor visible y señalizado', 'Condición controlada.', `${N02}, 7.2 b) y c)`),
    P('botiquin_ok', false, ['marca', -10.6, 1.2, 0, { alto: 1.8 }], '🩹', 'Botiquín surtido y señalizado', 'Condición controlada.', LFT)],
  inspeccion: [
    I('escalera_ok', '¿Hay una escalera portátil en buen estado para el archivo?', true, 'Sí, en su soporte.', `${N01}, 7.7.2.4`),
    I('escalera_rota', '¿Las escaleras en uso tienen peldaños completos y fijos?', false, 'No: la que está en el anaquel tiene un peldaño roto.', `${N01}, 7.7.2.4 b)`),
    I('caja_pesada', '¿Las cajas que se cargan a mano están dentro de la masa máxima permitida?', false, 'No: hay una de 32 kg.', `${N361}, 8.3 b) 2)`),
    I('multi', '¿Los contactos están libres de sobrecargas?', false, 'No.', `${N02}, 7.5.2`),
    I('cajon', '¿Los pasillos están ordenados y libres?', false, 'No.', `${N01}, 7.1.1`),
    I('botiquin_ok', '¿Hay botiquín con material de curación?', true, 'Sí.', LFT)],
  emergencia: { intro: 'Un compañero se desplomó junto a la impresora: no responde y solo jadea.' + fin, foco: 'caja_pesada', efecto: 'desmayo', pasos: [
    E('¿Qué revisas antes de acercarte?', ['Que la escena sea segura (cables, cajas, tránsito)', 'Nada: corro', 'Que haya señal de celular'], 0, 'Antes de ayudar se verifica que la escena sea segura.', `${IFRC}, p. 114`, ['ir', 'caja_pesada']),
    E('No responde y solo jadea. ¿Qué significa?', ['Paro cardíaco: activar emergencias y empezar RCP', 'Está dormido', 'Hay que darle agua'], 0, 'No responder y no respirar o solo jadear indica paro: se activan emergencias y se inicia la RCP.', AHA, ['globo', 'yo', '¡Llamen al 911 y traigan el DEA!']),
    E('¿Cómo comprimes?', ['Centro del pecho, 5 a 6 cm, 100 a 120 por minuto, dejando que el pecho regrese', 'Despacio y suave', 'En el abdomen'], 0, 'Compresiones de al menos 5 cm sin pasar de 6, a 100-120 por minuto, con reexpansión completa.', 'AHA 2025, Parte 7 (calidad de la RCP)'),
    E('Llega el DEA. ¿Qué haces?', ['Encenderlo, colocar los parches y seguir sus indicaciones; nadie lo toca durante el análisis y la descarga', 'Guardarlo hasta que llegue la ambulancia', 'Ponerlo sobre la ropa'], 0, 'Algoritmo para legos: aplicar parches, seguir indicaciones y reanudar la RCP 2 minutos.', AHA),
    E('¿Quién lleva el botiquín y apoya?', ['El personal adiestrado para primeros auxilios, con el material de curación', 'Cualquiera, sin saber', 'Nadie'], 0, 'El patrón mantiene material de curación y adiestra al personal que presta los primeros auxilios.', LFT, ['acudir', 'caja_pesada']),
    E('¿Hasta cuándo sigues?', ['Hasta que llegue ayuda profesional o el DEA indique otra cosa, relevándose cada 2 minutos si hay otra persona', 'Hasta cansarme a los 30 segundos', '1 minuto'], 0, 'Se continúa la RCP, con relevo aproximadamente cada 2 minutos.', 'AHA 2025, Parte 7 (relevo cada 2 min)')] },
  analisis: [
    { principal: 'escalera_rota', riesgo: 'Caída desde una escalera dañada en el archivo', f: 'D', s: 'III', pista: 'Se usa varias veces al día y una caída puede dejar lesiones permanentes.' + fin, control: [
      ctl(true, 'Retirar de uso la escalera rota y usar la que está en buen estado, con apoyos antiderrapantes', 'Elimina el equipo dañado.', `${N01}, 7.7.2.4`),
      ctl(false, 'Pisar con cuidado el peldaño roto', 'Depende del comportamiento.', NIOSH),
      ctl(false, 'Usar zapatos cómodos', 'No corrige la escalera.', NIOSH),
      ctl(false, 'Poner un letrero de "precaución"', 'No elimina el daño.', NIOSH)] },
    { principal: 'caja_pesada', riesgo: 'Lesión de espalda por cargar cajas de más de 25 kg', f: 'D', s: 'II', pista: 'Pasa cada vez que se mueve el archivo y causa incapacidades temporales.' + fin, control: [
      ctl(true, 'Usar diablo o carretilla y dividir el contenido en cajas más ligeras', 'Son las medidas que la norma indica cuando se rebasa la masa máxima.', `${N361}, 8.3 b) 3)`),
      ctl(false, 'Darle una faja', 'No reduce el peso.', NIOSH),
      ctl(false, 'Que la cargue más rápido', 'Aumenta el esfuerzo.', NIOSH),
      ctl(false, 'Pedirle que doble las rodillas y siga', 'La masa sigue rebasando el límite.', NIOSH)] }],
});

// ============================================================== CAFETERÍA (cocina)
Z.cafeteria = base({ nombre: 'Cafetería: cocina y comedor', icono: '☕', piso: 0xE0DCD4, muro: 0xF7F3EC, rotulo: 'COCINA · COMEDOR',
  intro: 'Hora de la comida: la cocina trabaja a toda velocidad y el comedor está lleno.' + fin,
  escena: [['r:estufa', -6, -6.6, 0], ['r:estufa', -2.6, -6.6, 0], ['r:cuchillos', 1.6, -6.8, 0], ['r:lavamanos', 5.4, -7.3, 0], ['r:cilindro_encadenado', 9.6, -7.2, 0],
    ['r:mesa', -4, 3, 0], ['r:mesa', 0, 3, 0], ['r:mesa', 4, 3, 0], ['r:silla', -4, 3.8, Math.PI], ['r:silla', 0, 3.8, Math.PI], ['r:silla', 4, 3.8, Math.PI],
    ['extintor', -9.4, -7.6, 0, { tipo: 'k' }], ['r:botiquin', 10.6, 1, -Math.PI / 2], ['r:basurero', 8, -4.6, 0], ['r:charco_senalado', 6.2, -3.6, 0]],
  recorrido: [
    R([-6, -4.8], 'Freidora', 'El fuego clase K se da en grasas y aceites de cocina; el agua no sirve para combatirlo.', `${N02}, 4.11 e); ${T71}`),
    R([-9.4, -6], 'Extintor clase K', 'El químico húmedo sirve para fuegos A, B y K; se coloca a no más de 1.50 m de altura.', `${T71}; ${N02}, 7.17 f)`),
    R([9.6, -5.4], 'Instalación de gas', 'Hay un programa anual de revisión de la instalación de gas: integridad de sus elementos y tuberías señalizadas.', `${N02}, 7.6 a) y b)`),
    R([2, -4.2], 'Pisos', 'Los pisos se mantienen de modo que los líquidos estancados no generen caídas o resbalones.', `${N01}, 7.4 b)`),
    R([1.6, -5.2], 'Cuchillos y equipo', 'El EPP, como los guantes, protege contra el tipo y grado de riesgo y es de la talla de quien lo usa.', `${N17}, 5.3 b) y c)`),
    R([0, 6], 'Salida del comedor', 'La ruta de evacuación está libre de obstáculos.', `${N02}, 7.15 b)`)],
  peligros: [
    P('freidora', true, ['marca', -6, -6.6, 0, { alto: 1.3 }], '🍟', 'Freidora con aceite caliente sin tapa, junto al paso del personal', 'Las áreas de riesgo se delimitan para disponer de espacios seguros.', `${N01}, 7.1.2`),
    P('ext_agua', true, ['extintor', -4.4, -7.6, 0, { tipo: 'agua' }], '💦', 'Junto a la freidora solo hay un extintor de agua', 'El agua no sirve para fuego clase K (aceite de cocina).', T71),
    P('manguera', true, ['r:cilindro', 8.2, -7.2, 0], '🔥', 'Cilindro de gas con la manguera agrietada', 'La revisión de la instalación de gas verifica la integridad de sus elementos.', `${N02}, 7.6 a)`),
    P('charco', true, ['r:charco', -1, -3.4, 0], '💧', 'Aceite derramado en el piso sin señal', 'Los líquidos estancados no deben generar caídas o resbalones.', `${N01}, 7.4 b)`),
    P('cajas_salida', true, ['cajas', 0.2, 6.6, 0], '📦', 'Cajas de verdura bloqueando la salida del comedor', 'La ruta de evacuación debe estar libre de obstáculos.', `${N02}, 7.15 b)`),
    P('ext_k_ok', false, ['marca', -9.4, -7.6, 0, { alto: 1.4 }], '🧯', 'Extintor de químico húmedo (clase K) junto a la cocina', 'Condición controlada.', T71),
    P('charco_ok', false, ['marca', 6.2, -3.6, 0, { alto: 0.8 }], '🟨', 'Piso mojado acordonado y con señal de precaución', 'Condición controlada.', `${N26}, 7.1`),
    P('cilindro_ok', false, ['marca', 9.6, -7.2, 0, { alto: 1.4 }], '⛓️', 'Cilindro sujeto con cadena, con capuchón y manguera en buen estado', 'Condición controlada.', `${N30}, 6.1 a)`)],
  inspeccion: [
    I('ext_k_ok', '¿Hay un extintor adecuado para fuego de aceite (clase K)?', true, 'Sí, de químico húmedo.', T71),
    I('ext_agua', '¿El extintor junto a la freidora sirve para fuego clase K?', false, 'No: es de agua.', T71),
    I('manguera', '¿La instalación de gas está íntegra?', false, 'No: una manguera está agrietada.', `${N02}, 7.6 a)`),
    I('charco', '¿Los pisos están libres de líquidos que causen resbalones?', false, 'No: hay aceite derramado.', `${N01}, 7.4 b)`),
    I('cajas_salida', '¿La salida del comedor está libre?', false, 'No.', `${N02}, 7.15 b)`),
    I('charco_ok', '¿El piso mojado de la tarja está señalizado?', true, 'Sí.', `${N26}, 7.1`)],
  emergencia: { intro: 'El aceite de la freidora se incendió.' + fin, foco: 'freidora', efecto: 'incendio', pasos: [
    E('¿Qué haces primero?', ['Poner en práctica el procedimiento de alertamiento', 'Echar agua', 'Mover la freidora'], 0, 'Al detectar una emergencia de incendio se pone en práctica el procedimiento de alertamiento.', `${N02}, 6.9 y 8.1 c)`, ['alarma', 'yo', '¡Fuego en la cocina!']),
    E('¿Qué clase de fuego es?', ['Clase K: aceites y grasas de cocina', 'Clase A', 'Clase C'], 0, 'El fuego clase K se presenta en aceites y grasas de cocina.', `${N02}, 4.11 e)`),
    E('¿Por qué NO usar agua?', ['Porque el agua no sirve para fuego clase K', 'Porque se desperdicia', 'Sí se puede usar'], 0, 'En la Tabla VII.1 el agua no aplica para fuego clase K.', T71),
    E('Es incipiente y estás entrenada/o. ¿Con qué lo combates?', ['Con el extintor de químico húmedo (clase K)', 'Con el de agua', 'Con harina'], 0, 'El químico húmedo sirve para fuegos A, B y K. Solo combate un fuego incipiente quien está entrenado.', `${T71}; ${N02}, 11.2 e)`, ['apagar', 'freidora', 'k']),
    E('¿Qué hacen los comensales?', ['Evacuar por la ruta hasta el punto de reunión', 'Terminar de comer', 'Grabar'], 0, 'El plan prevé la evacuación de trabajadores y visitantes.', `${N02}, 8.1 e)`, ['evacuar', 'yo', 5]),
    E('¿Y el extintor usado?', ['Se recarga después de usarlo', 'Se regresa así', 'Se guarda vacío'], 0, 'Se proporciona la recarga a los extintores después de su uso.', `${N02}, 7.19`)] },
  analisis: [
    { principal: 'freidora', riesgo: 'Quemaduras e incendio por la freidora junto al paso', f: 'D', s: 'III', pista: 'Se pasa junto a ella todo el día y una quemadura puede dejar secuelas.' + fin, control: [
      ctl(true, 'Delimitar el área de la freidora y reubicar el paso del personal', 'Separa a las personas del aceite caliente.', `${N01}, 7.1.2; ${NIOSH}`),
      ctl(false, 'Pedir que pasen con cuidado', 'Depende del comportamiento.', NIOSH),
      ctl(false, 'Solo dar guantes largos', 'EPP: último nivel de la jerarquía.', `${N17}, 5.2; ${NIOSH}`),
      ctl(false, 'Pegar un letrero de "caliente"', 'Control administrativo débil.', NIOSH)] },
    { principal: 'ext_agua', riesgo: 'Fuego de aceite combatido con el extintor equivocado', f: 'C', s: 'IV', pista: 'Solo en un incendio, pero el agua sobre aceite caliente puede agravarlo.' + fin, control: [
      ctl(true, 'Colocar un extintor de químico húmedo (clase K) junto a la freidora', 'El extintor queda acorde a la clase de fuego.', `${N02}, 7.17 a); ${T71}`),
      ctl(false, 'Dejar el de agua y explicar que no se use', 'El equipo sigue siendo inadecuado.', NIOSH),
      ctl(false, 'Tener una cubeta de agua a la mano', 'El agua no sirve para clase K.', T71),
      ctl(false, 'No hacer nada: casi nunca pasa', 'No controla el riesgo.', NIOSH)] }],
});

// ============================================================== BIBLIOTECA
Z.biblioteca = base({ nombre: 'Biblioteca: sala de lectura y acervo', icono: '📚', piso: 0xC8B79E, muro: 0xF4EFE6, rotulo: 'BIBLIOTECA · ACERVO NORMATIVO',
  intro: 'Sala de lectura con anaqueles altos, computadoras de consulta y una ventana grande al fondo.' + fin,
  escena: [['r:anaquel', -8, -6.4, 0], ['r:anaquel', -6, -6.4, 0], ['r:anaquel', -4, -6.4, 0], ['r:anaquel', 4, -6.4, 0], ['r:anaquel', 6, -6.4, 0],
    ['r:mesa', -3, 1.6, 0], ['r:mesa', 3, 1.6, 0], ['r:silla', -3, 2.4, Math.PI], ['r:silla', 3, 2.4, Math.PI], ['r:escritorio', 8, 0.5, -Math.PI / 2], ['r:escalera_guardada', -10.6, -2, Math.PI / 2],
    ['r:senal_salida', 2.2, 7.85, 0], ['r:lampara', -10.85, 4, Math.PI / 2], ['extintor', 10.4, 3.4, -Math.PI / 2], ['r:cable_canalizado', 0, 4.6, 0],
    ['letrero', 0, -7.7, 0, { texto: 'VENTANAL', fondo: '#B3E5FC', color: '#0E3A6B' }]],
  recorrido: [
    R([-6, -4.6], 'Anaqueles', 'Los muebles altos sin anclar pueden volcarse en un sismo; se identifican en el análisis de riesgos.', `${LGPC} fr. XXIII; ${N30}, 6.1 a)`),
    R([-9, -2], 'Escalera portátil', 'Se usan escaleras portátiles con peldaños completos y fijos, apoyos antiderrapantes y, al apoyarlas, un peldaño de separación por cada cuatro de altura.', `${N01}, 7.7.2.3 y 7.7.2.4`),
    R([8, 2], 'Computadoras de consulta', 'En salas de cómputo el nivel mínimo de iluminación es de 500 lx; en aulas y oficinas, de 300 lx.', `${N25}, 7 (Tabla 1)`),
    R([0, 3.4], 'Cables protegidos', 'Los cables que cruzan el paso se protegen con cubrecables para evitar tropiezos y daños.', `${N30}, 6.1 a)`),
    R([9, 3.4], 'Extintor para papel', 'El papel y los libros arden como fuego clase A: sirven, por ejemplo, el extintor de agua o el de polvo químico seco ABC.', `${N02}, 4.11; ${T71}`),
    R([8.6, -5.4], 'Zona de menor riesgo', 'La zona de menor riesgo está junto a columnas y muros de carga, lejos de vidrios que se puedan romper y donde no se almacenan materiales peligrosos.', SGIRPC)],
  peligros: [
    P('anaquel', true, ['r:anaquel', -1, -6.4, 0], '📦', 'Anaquel alto sin anclar con cajas pesadas arriba', 'En un sismo puede volcarse o tirar las cajas.', `${LGPC} fr. XXIII; ${N30}, 6.1 a)`),
    P('escalera_rota', true, ['r:escalera', 5, -5, Math.PI], '🪜', 'Escalera de mano con un peldaño roto', 'Solo se usan escaleras con peldaños completos y fijos.', `${N01}, 7.7.2.4 b)`),
    P('multi', true, ['r:multicontacto', 8.4, 1.8, 0], '🔌', 'Multicontacto sobrecargado con extensiones para las computadoras', 'Las sobrecargas (varias cargas en un solo tomacorriente) se identifican y corrigen.', `${N02}, 7.5.2`),
    P('libros_ruta', true, ['cajas', -0.6, 6.2, 0], '📚', 'Pilas de libros donados en la ruta hacia la salida', 'La ruta de evacuación debe estar libre de obstáculos.', `${N02}, 7.15 b)`),
    P('lector_ventana', true, ['persona', -1, -5.2, Math.PI, { casco: null, ropa: 0x00838F }], '🪟', 'Lector que se refugia junto al ventanal durante el simulacro de sismo', 'La zona de menor riesgo está lejos de vidrios que se puedan romper y caer.', SGIRPC),
    P('escalera_ok', false, ['marca', -10.6, -2, 0, { alto: 2.2 }], '🪜', 'Escalera en buen estado, guardada en su soporte', 'Condición controlada.', `${N01}, 7.7.2.4`),
    P('cable_ok', false, ['marca', 0, 4.6, 0, { alto: 0.4 }], '🟨', 'Cable protegido con cubrecables en el paso', 'Condición controlada.', `${N30}, 6.1 a)`),
    P('salida_ok', false, ['marca', 2.2, 7.85, 0, { alto: 2.6 }], '🟩', 'Señal de salida de emergencia visible', 'Condición controlada.', `${N02}, 7.16 a)`)],
  inspeccion: [
    I('anaquel', '¿Los anaqueles altos están anclados y sin cajas pesadas arriba?', false, 'No: uno está sin anclar.', `${LGPC} fr. XXIII`),
    I('escalera_ok', '¿Hay una escalera portátil en buen estado?', true, 'Sí.', `${N01}, 7.7.2.4`),
    I('escalera_rota', '¿Todas las escaleras en uso tienen peldaños completos?', false, 'No.', `${N01}, 7.7.2.4 b)`),
    I('libros_ruta', '¿La ruta hacia la salida está libre?', false, 'No: hay pilas de libros.', `${N02}, 7.15 b)`),
    I('multi', '¿Los contactos están libres de sobrecargas?', false, 'No.', `${N02}, 7.5.2`),
    I('cable_ok', '¿Los cables del paso están protegidos?', true, 'Sí, con cubrecables.', `${N30}, 6.1 a)`)],
  emergencia: { intro: 'Tiembla sin que haya sonado la alerta sísmica; la biblioteca está en un tercer piso.' + fin, foco: 'anaquel', efecto: 'sismo', pasos: [
    E('Tiembla sin alerta y estás en un tercer piso. ¿Evacuar o replegarte?', ['Replegarme en la zona de menor riesgo hasta que termine el sismo', 'Correr por las escaleras', 'Usar el elevador'], 0, 'Se puede replegar cuando se percibe el sismo sin alerta, en un piso tercero o superior o lejos de la salida.', SGIRPC, ['globo', 'yo', 'Repliegue']),
    E('¿Dónde está la zona de menor riesgo?', ['Junto a columnas y muros de carga, lejos de vidrios y de los anaqueles', 'Junto al ventanal', 'Debajo del anaquel alto'], 0, 'Columnas y muros de carga, lejos de vidrios que puedan caer y donde no se almacenen materiales peligrosos.', SGIRPC, ['ir', 'salida_ok']),
    E('¿Quién indica si se evacua después del sismo?', ['Las personas brigadistas, para permitir la revisión del inmueble', 'Nadie: cada quien decide', 'El último en salir'], 0, 'Después del sismo, en caso de ser necesario, se evacua para permitir la revisión del inmueble; también se replega cuando lo indican los brigadistas.', SGIRPC),
    E('Ya afuera, ¿dónde se reúnen?', ['En el punto de reunión, lejos de edificios, cables, postes y árboles', 'En la banqueta junto al edificio', 'Bajo un árbol'], 0, 'El punto de reunión es la zona de menor riesgo al exterior, alejada de edificios, cables, postes, árboles u objetos que puedan caer.', SGIRPC, ['evacuar', 'yo', 4]),
    E('¿Cuándo regresan a la biblioteca?', ['Cuando se revise el inmueble y se autorice el retorno', 'En cuanto deje de temblar', 'Nunca'], 0, 'Se evacua para permitir la revisión del inmueble antes de regresar.', SGIRPC),
    E('Después del sismo, ¿qué se corrige en la biblioteca?', ['Anclar los anaqueles altos y bajar las cajas pesadas', 'Nada', 'Agregar más anaqueles'], 0, 'Los muebles sin anclar son un riesgo ante un fenómeno geológico.', `${LGPC} fr. XXIII`)] },
  analisis: [
    { principal: 'anaquel', riesgo: 'Golpe o aplastamiento por anaquel que se vuelca en un sismo', f: 'C', s: 'IV', pista: 'Los sismos son ocasionales, pero un anaquel lleno puede ser fatal.' + fin, control: [
      ctl(true, 'Anclar los anaqueles a muros o piso y bajar las cajas pesadas a los niveles inferiores', 'Elimina la posibilidad de vuelco.', `${LGPC} fr. XXIII; ${NIOSH}`),
      ctl(false, 'Pedir que nadie se acerque cuando tiemble', 'Depende de reaccionar a tiempo.', NIOSH),
      ctl(false, 'Poner una señal de "anaquel"', 'No evita el vuelco.', NIOSH),
      ctl(false, 'Llenar más el anaquel para que pese', 'Aumenta el peligro.', NIOSH)] },
    { principal: 'escalera_rota', riesgo: 'Caída desde una escalera dañada', f: 'D', s: 'III', pista: 'Se usa a diario y la caída puede dejar lesiones permanentes.' + fin, control: [
      ctl(true, 'Retirar de uso la escalera dañada y usar una con peldaños completos y apoyos antiderrapantes', 'Elimina el equipo dañado.', `${N01}, 7.7.2.4`),
      ctl(false, 'Pisar con cuidado', 'Depende del comportamiento.', NIOSH),
      ctl(false, 'Usar guantes', 'No corrige la escalera.', NIOSH),
      ctl(false, 'Pegar un letrero', 'No elimina el daño.', NIOSH)] }],
});

// ============================================================== LOTO · BLOQUEO Y ETIQUETADO
// (21/10/2026) Práctica del Edificio LOTO. Los numerales de NOM-004 y NOM-029 se citan SIN número porque su vigencia
// y redacción están pendientes de verificar en el DOF (ANEXO_TECNICO_LOTO.md §8.2); lo que sostiene cada paso mientras
// tanto es el procedimiento de la máquina, que es además lo correcto: no existe una secuencia universal de LOTO.
const N04V = 'NOM-004-STPS-1999 (vigencia y numerales por verificar en el DOF)';
const N29V = 'NOM-029-STPS-2011 (vigencia y numerales por verificar en el DOF)';
const PROC = 'Procedimiento LOTO de la máquina' + fin;
Object.assign(FU, {
  [N04V]: { t: 'NOM-004-STPS-1999, Sistemas de protección y dispositivos de seguridad en la maquinaria y equipo. VIGENCIA Y NUMERALES POR VERIFICAR en el DOF antes de citarlos como ciertos.' },
  [N29V]: { t: 'NOM-029-STPS-2011, Mantenimiento de las instalaciones eléctricas en los centros de trabajo. VIGENCIA Y NUMERALES POR VERIFICAR en el DOF antes de citarlos como ciertos.' },
  [PROC]: { t: 'Procedimiento de bloqueo y etiquetado de la máquina. Es el documento de la empresa: define la secuencia, los puntos de aislamiento y los dispositivos de ESA máquina.' },
});
Z.loto = base({ nombre: 'LOTO: aula y celdas de bloqueo', icono: '🔒', piso: 0xB9BEC3, muro: 0xEDEFF1, rotulo: 'LOTO · BLOQUEO Y ETIQUETADO',
  intro: 'Edificio LOTO al terminar la sesión de la mañana: el aula con la máquina de demostración y, al fondo, las celdas con la prensa P-02 y el transportador T-04.' + fin,
  escena: [['r:tablero', -8.5, -6.5, 0], ['r:prensa', -3.5, -6.2, 0], ['r:compresora', 3.2, -6.8, 0], ['r:cilindro_encadenado', 7.6, -7.0, 0],
    ['r:mesa', -6.5, 1.2, 0], ['r:silla', -6.5, 2.0, Math.PI], ['r:anaquel', 10.2, -2.5, -Math.PI / 2], ['r:senal_salida', 2.2, 7.85, 0],
    ['r:franja', 0, -3.4, 0], ['r:senal_obligacion', -10.4, 1.0, Math.PI / 2], ['extintor', 10.3, 3.2, -Math.PI / 2], ['r:cable_canalizado', 0, 4.6, 0],
    ['letrero', 0, -7.7, 0, { texto: 'CELDAS DE PRÁCTICA', fondo: '#B7791F', color: '#fff' }]],
  recorrido: [
    R([-8.5, -4.8], 'Punto de aislamiento', 'El tablero TB-7 es el punto de aislamiento de la prensa: aquí se abre el interruptor, se coloca el candado personal y encima la tarjeta.', `${PROC}; ${N29V}`),
    R([-3.5, -4.6], 'Aislar no es bloquear', 'Abrir el interruptor aísla; poner el candado bloquea; colgar la tarjeta identifica. Son tres cosas distintas y ninguna sustituye a otra.', `${PROC}; ${N04V}`),
    R([3.2, -5.2], 'Energía almacenada', 'Cerrar la válvula no descarga el acumulador ni la presión atrapada en la línea: hay que liberarlas o contenerlas antes de intervenir.', N04V),
    R([7.6, -5.4], 'Cilindros asegurados', 'Los cilindros de gas se mantienen sujetos para que no caigan, con su válvula protegida.', 'NOM-005-STPS-1998'),
    R([-10.0, 1.0], 'Estación de bloqueo', 'La estación tiene candados personales con llave única, pinza multicandado para el bloqueo grupal y tarjetas. Si no hay dispositivos, la gente improvisa.', PROC),
    R([0, 3.4], 'Ruta de evacuación', 'Las rutas de evacuación están señalizadas y libres de obstáculos.', `${N02}, 7.15 a) y b)`),
    R([9.4, 3.2], 'Extintor', 'Los extintores están visibles, de fácil acceso, libres de obstáculos y señalizados.', `${N02}, 7.2 b) y c)`)],
  peligros: [
    P('tarjeta_sola', true, ['r:puerta_candado', -6.8, -7.2, 0], '🏷️', 'Interruptor con tarjeta de NO OPERAR pero sin candado', 'La etiqueta avisa, pero no impide accionar el dispositivo: nunca sustituye el bloqueo físico.', `${N04V}; ${N29V}`),
    P('guarda_fuera', true, ['r:guarda', -1.2, -6.6, 0], '⚙️', 'Guarda de la transmisión retirada y recargada en la pared', 'Partes móviles accesibles: atrapamiento.', N04V),
    P('acumulador', true, ['r:cilindro', 5.0, -6.9, 0], '🧨', 'Acumulador con presión y sin manómetro a la vista', 'Energía almacenada que no se puede comprobar antes de intervenir.', N04V),
    P('llave_colgada', true, ['r:multicontacto', 8.6, 1.4, 0], '🔑', 'Llaves de los candados personales colgadas en un tablero común', 'Cada persona conserva la llave de su propio candado: si otro la tiene, puede liberar el equipo mientras tú estás adentro.', PROC),
    P('cable_piso', true, ['r:cable', -2.0, 2.4, 0], '🔌', 'Cable de alimentación cruzando el paso del aula', 'Tropiezo y daño al cable.', `${N30}, 6.1 a)`),
    P('franja_ok', false, ['marca', 0, -3.4, 0, { alto: 0.4 }], '🟨', 'Zona de maniobra delimitada con franja amarilla', 'Condición controlada.', `${N26}, 7.1 Tabla 1`),
    P('cadena_ok', false, ['marca', 7.6, -7.0, 0, { alto: 1.2 }], '⛓️', 'Cilindro de respaldo sujeto con cadena', 'Condición controlada.', 'NOM-005-STPS-1998'),
    P('salida_ok', false, ['marca', 2.2, 7.85, 0, { alto: 2.6 }], '🟩', 'Señal de salida de emergencia visible', 'Condición controlada.', `${N02}, 7.16 a)`)],
  inspeccion: [
    I('tarjeta_sola', '¿Todos los puntos de aislamiento tienen candado, no solo tarjeta?', false, 'No: uno tiene únicamente la tarjeta.', `${N04V}; ${PROC}`),
    I('guarda_fuera', '¿Las guardas de las partes móviles están colocadas?', false, 'No: una está retirada.', N04V),
    I('acumulador', '¿Se puede comprobar que el acumulador quedó sin presión?', false, 'No: no tiene manómetro a la vista.', N04V),
    I('llave_colgada', '¿Cada persona conserva la llave de su candado?', false, 'No: están en un tablero común.', PROC),
    I('franja_ok', '¿La zona de maniobra está delimitada?', true, 'Sí, con franja amarilla.', `${N26}, 7.1 Tabla 1`),
    I('salida_ok', '¿La señal de salida es visible?', true, 'Sí.', `${N02}, 7.16 a)`)],
  emergencia: { intro: 'Durante el mantenimiento de la prensa, alguien del turno siguiente cierra el interruptor del TB-7 para "probar si ya quedó".' + fin, foco: 'tarjeta_sola', efecto: 'alarma', pasos: [
    E('La prensa arranca con una persona trabajando adentro. ¿Qué haces primero?', ['Accionar el paro de emergencia y cortar la energía', 'Gritar para que se quite', 'Ir a buscar al supervisor'], 0, 'Primero se detiene la energía que está causando el daño; después se atiende a la persona.', PROC, ['globo', 'yo', '¡Paro!']),
    E('El equipo ya está detenido. ¿Qué sigue?', ['Bloquear el interruptor con candado y verificar ausencia de energía antes de acercarse', 'Entrar de inmediato a sacar a la persona', 'Volver a encender para mover la prensa'], 0, 'Acercarse sin bloquear expone a una segunda víctima; volver a energizar agrava la lesión.', `${PROC}; ${N29V}`, ['ir', 'tarjeta_sola']),
    E('¿A quién se avisa?', ['Al servicio de emergencia y a la persona responsable del centro de trabajo', 'A nadie, para no asustar', 'Solo al turno siguiente'], 0, 'Se activa la respuesta a emergencias del centro de trabajo.', `${N02}, 8.1`),
    E('¿Por qué pudo pasar?', ['El punto de aislamiento tenía tarjeta pero no candado, y la llave estaba en un tablero común', 'Porque la prensa es vieja', 'Porque no había señales'], 0, 'La etiqueta no impide accionar el dispositivo, y una llave compartida permite que otro libere el equipo.', `${N04V}; ${PROC}`, ['ir', 'llave_colgada']),
    E('¿Qué se corrige para que no se repita?', ['Candado personal en cada punto, pinza multicandado para el trabajo en grupo y llave única por persona', 'Poner una tarjeta más grande', 'Pedir que nadie toque el tablero'], 0, 'El bloqueo físico con llave única es la barrera; la etiqueta solo informa.', `${PROC}; ${NIOSH}`),
    E('Ya controlado, ¿cuándo se devuelve el equipo al servicio?', ['Cuando se retiran los dispositivos por la misma persona que los puso y se verifica que no hay nadie expuesto', 'En cuanto se vayan los de mantenimiento', 'Al día siguiente'], 0, 'El retiro del bloqueo y el retorno al servicio también son parte del procedimiento.', PROC)] },
  analisis: [
    { principal: 'tarjeta_sola', riesgo: 'Arranque inesperado durante el mantenimiento por un punto sin bloqueo físico', f: 'B', s: 'IV', pista: 'Pasa seguido cuando faltan candados, y un arranque con alguien adentro puede ser mortal.' + fin, control: [
      ctl(true, 'Candado personal en cada punto de aislamiento, con llave única, y pinza multicandado cuando trabajan varias personas', 'El bloqueo físico impide accionar el dispositivo.', `${N04V}; ${NIOSH}`),
      ctl(false, 'Poner una tarjeta más grande y visible', 'La etiqueta informa, pero no impide cerrar el interruptor.', N04V),
      ctl(false, 'Avisar por radio a todos los turnos', 'Depende de que el mensaje llegue y se recuerde.', NIOSH),
      ctl(false, 'Dar guantes dieléctricos a quien trabaja', 'El EPP no evita el arranque de la máquina.', `${N17}, 5.2`)] },
    { principal: 'guarda_fuera', riesgo: 'Atrapamiento por partes móviles sin guarda', f: 'C', s: 'IV', pista: 'La guarda se retira para el mantenimiento y a veces no se repone.' + fin, control: [
      ctl(true, 'Reponer la guarda antes de devolver el equipo al servicio y verificarlo en la lista de retorno', 'Barrera física entre la persona y la parte móvil.', `${N04V}; ${NIOSH}`),
      ctl(false, 'Marcar el piso para no acercarse', 'La señalización no detiene la transmisión.', NIOSH),
      ctl(false, 'Trabajar con más cuidado', 'Depende solo de la conducta.', NIOSH)] }],
});
})();
