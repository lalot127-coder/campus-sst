// Datos de las prácticas por zona de trabajo (12/10/2026). Script clásico: window.PRACTICAS_ZONA = { <zona>: {...} }.
// Cada zona: escena (objetos), recorrido (fichas), peligros (reales y distractores), inspección, emergencia y análisis.
// REGLA: todo dato normativo cita su numeral, verificado en el texto oficial (ver FUENTES). Escenas, personas y
// valores de frecuencia/severidad son [FICTICIO – ejercicio didáctico].
(function () {
const N23 = 'NOM-023-STPS-2012', G23 = 'Guía informativa NOM-023-STPS-2012 (STPS, enero 2021)', N08 = 'NOM-008-STPS-2013', N16 = 'NOM-016-STPS-2001',
  N03 = 'NOM-003-STPS-2023', N31 = 'NOM-031-STPS-2011', N06 = 'NOM-006-STPS-2023', N86 = 'NOM-086-SCT2-2015', N26 = 'NOM-026-STPS-2008',
  N02 = 'NOM-002-STPS-2010', N17 = 'NOM-017-STPS-2024', NIOSH = 'NIOSH, jerarquía de controles (referencia, no obligatoria)';

const FUENTES = {
  [N23]: { t: 'NOM-023-STPS-2012, Minas subterráneas y minas a cielo abierto-Condiciones de seguridad y salud en el trabajo (DOF 11/10/2012).', u: 'https://platiica.economia.gob.mx/normalizacion/wp-content/uploads/sites/2/PDF_Normas_Publicas/023stps2012.pdf' },
  [G23]: { t: 'STPS. Guía informativa NOM-023-STPS-2012: Minas subterráneas y minas a cielo abierto (enero de 2021).', u: 'https://www.gob.mx/cms/uploads/attachment/file/649834/Condiciones_de_Seguridad_y_Salud_en_las_Minas.pdf' },
  [N08]: { t: 'NOM-008-STPS-2013, Actividades de aprovechamiento forestal maderable y en centros de almacenamiento y transformación en su actividad primaria-Condiciones de seguridad y salud en el trabajo (DOF 31/10/2013).', u: 'https://platiica.economia.gob.mx/wp-content/uploads/sites/2/PDF_Normas_Publicas/NOM-008-stps-2013.pdf' },
  [N16]: { t: 'NOM-016-STPS-2001, Operación y mantenimiento de ferrocarriles-Condiciones de seguridad e higiene (DOF 12/07/2001).', u: 'https://platiica.economia.gob.mx/normalizacion/nom-016-stps-2001/' },
  [N03]: { t: 'NOM-003-STPS-2023, Actividades agrícolas-Condiciones de seguridad y salud en el trabajo (DOF 25/01/2024).', u: 'https://platiica.economia.gob.mx/wp-content/uploads/sites/2/PDF_Normas_Publicas/NOM-003-STPS-2023.pdf' },
  [N31]: { t: 'NOM-031-STPS-2011, Construcción-Condiciones de seguridad y salud en el trabajo (DOF 04/05/2011).', u: 'https://dof.gob.mx/normasOficiales/4376/stps/stps.htm' },
  [N06]: { t: 'NOM-006-STPS-2023, Almacenamiento y manejo de materiales mediante el uso de maquinaria-Condiciones de seguridad en el trabajo (DOF 07/03/2024).', u: 'https://dof.gob.mx/normasOficiales/9412/stps/stps.html' },
  [N86]: { t: 'NOM-086-SCT2-2015, Señalamiento y dispositivos para protección en zonas de obras viales (DOF 24/06/2016).', u: 'https://platiica.economia.gob.mx/normalizacion/wp-content/uploads/sites/2/PDF_Normas_Publicas/086sct22015.pdf' },
  [N26]: { t: 'NOM-026-STPS-2008, Colores y señales de seguridad e higiene, e identificación de riesgos por fluidos conducidos en tuberías (DOF 25/11/2008).', u: 'https://www.gob.mx/cms/uploads/attachment/file/807422/GUIA_INFORMATIVA_NOM-026.pdf' },
  [N02]: { t: 'NOM-002-STPS-2010, Condiciones de seguridad-Prevención y protección contra incendios en los centros de trabajo (DOF 09/12/2010).', u: 'https://dof.gob.mx/normasOficiales/4228/stps/stps.htm' },
  [N17]: { t: 'NOM-017-STPS-2024, Equipo de protección personal-Selección, uso y manejo en los centros de trabajo (DOF 28/03/2025).', u: 'https://dof.gob.mx/normasOficiales/9496/stps/stps.html' },
  [NIOSH]: { t: 'NIOSH. Hierarchy of Controls (referencia técnica; no es obligatoria en México).', u: 'https://www.cdc.gov/niosh/hierarchy-of-controls/about/index.html' },
};
const fin = ' [FICTICIO – ejercicio didáctico]';
// opciones de control (jerarquía): la correcta es la más efectiva que se puede aplicar
const ctl = (ok, t, fb, f) => ({ t, ok, fb, f });

window.PRACTICAS_ZONA = {
  // ============================================================== MINA A CIELO ABIERTO
  mina_abierta: {
    nombre: 'Mina a cielo abierto', icono: '⛏️', piso: 0xC9A877, ancho: 34, fondo: 26, cielo: '#7FA6C9',
    intro: 'Tajo con banco, camino de acarreo, cargador, camión y planta de trituración con banda transportadora.' + fin,
    escena: [['banco', 0, -11, 0], ['camino', 0, -2, 0, { largo: 32 }], ['camion', -6, -2.5, Math.PI / 2], ['cargador', 9, -7, -0.6], ['pila', 12, -9.5, 0],
      ['tolva', -11, -8, 0], ['banda', -11, -3.5, 0, { largo: 8 }], ['caseta', 12, 6, Math.PI], ['bordo', 0, 0.4, 0, { largo: 30 }], ['roca', 4, -9, 0], ['roca', -3, -10, 1]],
    recorrido: [
      { at: [0, -10], titulo: 'Tajo y bancos', texto: 'La guía de la STPS indica reconocer las condiciones de seguridad de los tajos en las minas a cielo abierto en cada turno de trabajo.', f: G23 },
      { at: [-6, -2], titulo: 'Camino de acarreo', texto: 'Las áreas de operación de la maquinaria se delimitan y se evita el acceso de trabajadores o personas ajenas a esos trabajos.', f: `${N06}, 8.1 d)` },
      { at: [-11, -4], titulo: 'Banda transportadora', texto: 'Debe haber pasarelas para cruzar por encima o por debajo de los transportadores y se prohíbe cruzar a través de ellos.', f: `${N06}, 8.8.1 f)` },
      { at: [12, 5], titulo: 'Equipo de protección', texto: 'El patrón debe proporcionar a los trabajadores el equipo de protección personal básico.', f: `${N23}, 5.19` }],
    peligros: [
      { id: 'peaton', real: true, obj: ['persona', -2, -1.6, Math.PI / 2, { ropa: 0x1565C0, casco: 0xF2C230 }], icono: '🚶', nombre: 'Trabajador a pie en el camino de acarreo junto a los camiones', fb: 'El área de operación de la maquinaria debe estar delimitada y sin acceso de personas ajenas.', f: `${N06}, 8.1 d)` },
      { id: 'cruce_banda', real: true, obj: ['persona', -11, -3.5, 0, { ropa: 0x6D4C41, casco: 0xF2C230, pose: 'agachado' }], icono: '⚙️', nombre: 'Trabajador cruzando por debajo de la banda transportadora en operación', fb: 'Se prohíbe cruzar a través de los transportadores: se usan pasarelas.', f: `${N06}, 8.8.1 f)` },
      { id: 'sin_epp', real: true, obj: ['persona', 7.6, -5.4, -0.8, { ropa: 0x455A64, casco: null }], icono: '⛑️', nombre: 'Ayudante sin casco junto al cargador', fb: 'El patrón debe proporcionar el equipo de protección personal básico.', f: `${N23}, 5.19` },
      { id: 'senal_vel', real: false, obj: ['letrero', 3, 1.4, 0, { texto: 'RESPETE LA VELOCIDAD MÁXIMA', fondo: '#FFFFFF', color: '#B71C1C' }], icono: '🚧', nombre: 'Señal de velocidad máxima en el camino', fb: 'Es una medida de control: la señalización de la velocidad de la maquinaria es obligatoria.', f: `${N06}, 8.1 e)` },
      { id: 'extintor', real: false, obj: ['extintor', 10.5, 5, 0], icono: '🧯', nombre: 'Extintor señalizado en la caseta', fb: 'Es equipo contra incendio identificado en rojo, no un peligro.', f: `${N26}, Apéndice D (D.1.1)` }],
    inspeccion: [
      { obj: 'bitacora', q: '¿Está registrado el reconocimiento de condiciones del tajo de este turno?', a: true, exp: 'Sí: la bitácora muestra el reconocimiento del turno. La guía de la STPS lo indica en cada turno.', f: G23 },
      { obj: 'senal_vel', q: '¿Hay señal de velocidad máxima para la maquinaria en el camino?', a: true, exp: 'Sí, la señal está colocada.', f: `${N06}, 8.1 e)` },
      { obj: 'peaton', q: '¿El camino de acarreo está libre de personas a pie?', a: false, exp: 'No: hay un trabajador caminando junto a los camiones. El área de operación debe delimitarse.', f: `${N06}, 8.1 d)` },
      { obj: 'cruce_banda', q: '¿Se cruza la banda solo por una pasarela?', a: false, exp: 'No: alguien cruza por debajo de la banda en operación.', f: `${N06}, 8.8.1 f)` }],
    extras: [['bitacora', 13.5, 4.2, Math.PI, { texto: 'RECONOCIMIENTO DEL TAJO · TURNO 1 ✔' }]],
    emergencia: { intro: 'Un camión se salió del camino de acarreo y quedó volcado; el operador está atrapado en la cabina.' + fin, foco: 'camion', efecto: 'volcar', pasos: [
      { q: '¿Qué haces primero?', ops: ['Activar el plan de atención a emergencias y avisar a la brigada', 'Sacarlo tú solo jalándolo de la cabina', 'Seguir operando para no parar la producción'], ok: 0, exp: 'El centro de trabajo debe contar con un plan de atención a emergencias disponible para trabajadores y brigadistas.', f: `${N23}, 5.23`, anim: ['globo', 'camion', '¡Emergencia en el camino de acarreo!'] },
      { q: '¿Qué pasa con el tránsito de la maquinaria?', ops: ['Se detiene y se delimita el área para que nadie ajeno entre', 'Los camiones siguen pasando con cuidado', 'Se acerca el cargador para levantar el camión'], ok: 0, exp: 'Se delimita y se evita el acceso de personas ajenas al área de operación.', f: `${N06}, 8.1 d)`, anim: ['delimitar', 'camion', 5] },
      { q: '¿Quién atiende al operador?', ops: ['El personal capacitado en primeros auxilios, con el botiquín', 'Cualquier persona que pase', 'Nadie: se espera al día siguiente'], ok: 0, exp: 'El procedimiento de emergencias considera el botiquín, el manual y el personal capacitado para los primeros auxilios.', f: `${N06}, 7.6 d)`, anim: ['acudir', 'camion'] }] },
    analisis: { principal: 'peaton', riesgo: 'Atropellamiento por camión en el camino de acarreo', f: 'D', s: 'IV', pista: 'Los camiones pasan varias veces por hora y un golpe puede ser fatal.' + fin, control: [
      ctl(true, 'Separar físicamente la circulación de personas de la de camiones (ruta peatonal delimitada)', 'Control de ingeniería: elimina el cruce de personas con la maquinaria.', `${N06}, 8.1 d); ${NIOSH}`),
      ctl(false, 'Pedirle al trabajador que camine con cuidado', 'Es una medida débil: depende del comportamiento.', NIOSH),
      ctl(false, 'Darle un chaleco reflejante', 'El EPP es el último nivel de la jerarquía: no evita el cruce.', `${N17}, 5.2; ${NIOSH}`),
      ctl(false, 'Colocar un letrero de "precaución"', 'Es un control administrativo: menos efectivo que separar la circulación.', NIOSH)] },
  },

  // ============================================================== MINA SUBTERRÁNEA
  mina_subterranea: {
    nombre: 'Mina subterránea', icono: '🕳️', piso: 0x6B5A4A, ancho: 30, fondo: 24, tunel: true, cielo: '#2B2B2B',
    intro: 'Galería con vía y vagones, control de acceso, ducto de ventilación, refugio y salida de emergencia.' + fin,
    escena: [['galeria', 0, -4, 0, { largo: 26 }], ['via', 0, -4, 0, { largo: 24 }], ['vagon', 5, -4, 0], ['ducto', 0, -6.3, 0, { largo: 22 }],
      ['refugio', -10, -6.6, 0], ['tablero_acceso', 10, 6, Math.PI], ['caseta', 12, 8, Math.PI]],
    recorrido: [
      { at: [10, 5.5], titulo: 'Control de acceso', texto: 'Debe existir un sistema de registro, por cada turno de trabajo, del acceso y salida de los trabajadores.', f: `${N23}, 5.9` },
      { at: [0, -6], titulo: 'Ventilación', texto: 'La ventilación debe suministrar al menos 1.50 metros cúbicos por minuto por cada trabajador.', f: `${N23}, 8.4.4 a) 1)` },
      { at: [-10, -6], titulo: 'Refugio', texto: 'Se deben instalar y tener disponibles refugios en el interior de las minas subterráneas.', f: `${N23}, 5.10` },
      { at: [6, -4], titulo: 'Reconocimiento de frentes', texto: 'Se realiza un reconocimiento de las condiciones de seguridad de las frentes de trabajo de las minas subterráneas.', f: `${N23}, 5.8` }],
    peligros: [
      { id: 'sin_autorrescatador', real: true, obj: ['persona', 3, 2, Math.PI, { ropa: 0x37474F, casco: 0xF2C230 }], icono: '😷', nombre: 'Minero entrando a la galería sin autorrescatador', fb: 'Debe disponerse de un autorrescatador por cada trabajador que se encuentre en el interior de la mina.', f: `${N23}, 5.2 a)` },
      { id: 'sin_registro', real: true, obj: ['persona', 8, 3.5, -2.4, { ropa: 0x5D4037, casco: 0xF2C230 }], icono: '📋', nombre: 'Trabajador que entra sin registrarse en el control de acceso', fb: 'Por cada turno se registra el acceso y la salida de los trabajadores.', f: `${N23}, 5.9` },
      { id: 'ducto_roto', real: true, obj: ['ducto_roto', -5, -6.3, 0], icono: '🌬️', nombre: 'Ducto de ventilación desconectado en la frente', fb: 'Sin ventilación no se garantiza el caudal mínimo de aire por trabajador.', f: `${N23}, 8.4.4 a) 1)` },
      { id: 'refugio_ok', real: false, obj: ['senal', -7.6, -5.8, 0, { senal: 'menor_riesgo' }], icono: '🛖', nombre: 'Refugio señalizado y disponible', fb: 'Es una medida de protección obligatoria, no un peligro.', f: `${N23}, 5.10` },
      { id: 'salida_ok', real: false, obj: ['senal', -12.2, -3.2, Math.PI / 2, { senal: 'salida' }], icono: '🚪', nombre: 'Salida de emergencia señalizada a una obra independiente', fb: 'La mina debe contar con al menos dos salidas independientes a la superficie.', f: `${N23}, 8.2.10 a)` }],
    inspeccion: [
      { obj: 'tablero_acceso', q: '¿Todas las personas dentro de la mina están en el registro de acceso del turno?', a: false, exp: 'No: un trabajador entró sin registrarse.', f: `${N23}, 5.9` },
      { obj: 'sin_autorrescatador', q: '¿Cada trabajador en el interior lleva autorrescatador?', a: false, exp: 'No: un minero no lo trae.', f: `${N23}, 5.2 a)` },
      { obj: 'refugio_ok', q: '¿Hay un refugio disponible en el interior?', a: true, exp: 'Sí, está señalizado y disponible.', f: `${N23}, 5.10` },
      { obj: 'salida_ok', q: '¿Hay una salida de emergencia independiente señalizada?', a: true, exp: 'Sí. La mina debe contar con al menos dos salidas independientes a la superficie.', f: `${N23}, 8.2.10 a)` }],
    emergencia: { intro: 'Sale humo por la galería y el ventilador se detuvo.' + fin, foco: 'ducto_roto', efecto: 'humo', pasos: [
      { q: '¿Qué haces de inmediato?', ops: ['Colocarme el autorrescatador', 'Aguantar la respiración y correr', 'Ir a buscar de dónde sale el humo'], ok: 0, exp: 'Cada trabajador en el interior debe disponer de un autorrescatador.', f: `${N23}, 5.2 a)`, anim: ['globo', 'yo', 'Autorrescatador colocado'] },
      { q: '¿Cómo se organiza la respuesta?', ops: ['Con el plan de atención a emergencias, disponible para trabajadores y brigadistas', 'Cada quien decide por su cuenta', 'Se espera a que el humo se disipe'], ok: 0, exp: 'La mina debe contar con un plan de atención a emergencias.', f: `${N23}, 5.23` },
      { q: '¿Hacia dónde te diriges?', ops: ['A la salida independiente o al refugio señalizado', 'Por la galería llena de humo', 'A un rebaje sin salida'], ok: 0, exp: 'Existen refugios y salidas independientes a la superficie para estos casos.', f: `${N23}, 5.10 y 8.2.10 a)`, anim: ['ir', 'salida_ok'] }] },
    analisis: { principal: 'ducto_roto', riesgo: 'Atmósfera peligrosa por falta de ventilación', f: 'C', s: 'IV', pista: 'Pasa pocas veces, pero la falta de aire o los gases pueden ser fatales.' + fin, control: [
      ctl(true, 'Restablecer la ventilación y aplicar las medidas para cuando se rebasen los límites de gases antes de reingresar', 'Control de ingeniería: devuelve el caudal de aire y verifica la atmósfera.', `${N23}, 8.4.4 a) 1) y 8.4.1 g)`),
      ctl(false, 'Usar cubrebocas de tela', 'No protege contra falta de oxígeno ni gases.', `${N17}, 5.2; ${NIOSH}`),
      ctl(false, 'Trabajar más rápido para salir pronto', 'No reduce el riesgo.', NIOSH),
      ctl(false, 'Colocar un letrero de "precaución"', 'Control administrativo débil.', NIOSH)] },
  },

  // ============================================================== OBRA EN CONSTRUCCIÓN
  construccion: {
    nombre: 'Obra en construcción', icono: '🏗️', piso: 0xBFAE95, ancho: 32, fondo: 26,
    intro: 'Excavación de zanja con retroexcavadora, camión de volteo, acopio de tierra y escalera de acceso.' + fin,
    escena: [['zanja', 0, -6, 0, { largo: 14, ancho: 1.6 }], ['excavadora', -9.5, -6, Math.PI / 2], ['camion', 9, 2, -Math.PI / 2, { volteo: true }], ['pila', 5.5, -4.3, 0], ['barandal', 0, -7.3, 0, { largo: 14 }],
      ['caseta', -12, 8, 0], ['conos', 0, 1, 0, { n: 8, largo: 14 }]],
    recorrido: [
      { at: [0, -5], titulo: 'Zanja', texto: 'En zanjas de 1.20 m o más de profundidad debe haber escalera o rampa; la escalera sobresale 90 cm y está a no más de 7 m del sitio de trabajo.', f: `${N31}, 11.2 j)` },
      { at: [-9.5, -4], titulo: 'Maquinaria de excavación', texto: 'Se prohíbe que los trabajadores permanezcan en el interior de la zanja mientras la maquinaria de excavación esté en operación.', f: `${N31}, 11.2 c)` },
      { at: [5.5, -3.2], titulo: 'Acopio de tierra', texto: 'Se evita el acopio de materiales o tierra a menos de 2 m del borde de la excavación.', f: `${N31}, 11.2 r)` },
      { at: [9, 3.5], titulo: 'Vehículos', texto: 'Los vehículos de transporte de materiales cuentan con alarma de reversa y personal que auxilie al operador en las maniobras de reversa.', f: `${N31}, 15.4 a) y b)` }],
    peligros: [
      { id: 'en_zanja', real: true, obj: ['persona', -2, -6, 0, { ropa: 0x1565C0, casco: 0xF2C230, hundido: 1.0 }], icono: '🕳️', nombre: 'Trabajador dentro de la zanja con la retroexcavadora operando', fb: 'Está prohibido permanecer en la zanja mientras opera la maquinaria de excavación.', f: `${N31}, 11.2 c)` },
      { id: 'acopio', real: true, obj: ['pila', 2, -4.7, 0, { chica: true }], icono: '⛰️', nombre: 'Tierra acopiada junto al borde de la zanja', fb: 'El acopio debe quedar a 2 m o más del borde para no sobrecargar el terreno.', f: `${N31}, 11.2 r)` },
      { id: 'cucharon', real: true, obj: ['persona', -8.4, -4.2, Math.PI / 2, { ropa: 0x6D4C41, casco: 0xF2C230, y: 0.9 }], icono: '🚜', nombre: 'Persona viajando en el cucharón de la máquina', fb: 'Se prohíbe transportar personal en estribos, cajas, botes o cucharones.', f: `${N31}, 15.3` },
      { id: 'escalera', real: false, obj: ['escalera', 4.5, -6, 0], icono: '🪜', nombre: 'Escalera de acceso que sobresale de la zanja', fb: 'Es el medio de entrada y salida que pide la norma.', f: `${N31}, 11.2 j)` },
      { id: 'barandal', real: false, obj: ['letrero', -3, -7.6, 0, { texto: 'BARANDAL PERIMETRAL 90 cm', fondo: '#FFD100', color: '#111' }], icono: '🟨', nombre: 'Barandal rígido en el perímetro de la zanja', fb: 'Las excavaciones de más de 1.5 m se delimitan con barandales rígidos de 90 cm.', f: `${N31}, 11.2 n)` }],
    inspeccion: [
      { obj: 'barandal', q: '¿La zanja (más de 1.5 m) está delimitada con barandal rígido de 90 cm?', a: true, exp: 'Sí, cuenta con barandal.', f: `${N31}, 11.2 n)` },
      { obj: 'acopio', q: '¿El acopio de tierra está a 2 m o más del borde?', a: false, exp: 'No: hay tierra junto al borde.', f: `${N31}, 11.2 r)` },
      { obj: 'en_zanja', q: '¿Nadie está dentro de la zanja mientras opera la retroexcavadora?', a: false, exp: 'No: hay un trabajador adentro.', f: `${N31}, 11.2 c)` },
      { obj: 'camion', q: '¿El camión de volteo circula con la caja abajo?', a: true, exp: 'Sí. Está prohibido que circule con la caja levantada.', f: `${N31}, 15.9` }],
    emergencia: { intro: 'Una pared de la zanja se desprendió y un trabajador quedó atrapado hasta la cintura.' + fin, foco: 'en_zanja', efecto: 'derrumbe', pasos: [
      { q: '¿Qué haces con la retroexcavadora?', ops: ['Detenerla y alejarla del borde', 'Usarla para sacar al trabajador', 'Seguir excavando junto a él'], ok: 0, exp: 'Nadie debe estar en la zanja con la maquinaria operando; además se respeta la distancia de seguridad al borde.', f: `${N31}, 11.2 c) y o)`, anim: ['detener', 'excavadora'] },
      { q: '¿Cómo se organiza la respuesta?', ops: ['Se activa el plan de atención a emergencias de la obra', 'Cada quien ayuda como pueda', 'Se espera a que llegue el residente'], ok: 0, exp: 'La obra debe contar con un plan de atención a emergencias.', f: `${N31}, 19`, anim: ['globo', 'yo', '¡Plan de emergencia activado!'] },
      { q: '¿Bajas a la zanja a ayudarlo?', ops: ['Solo con las paredes reforzadas (puntales/ademes) y por la escalera', 'Sí, de inmediato, sin proteger las paredes', 'Brinco desde arriba'], ok: 0, exp: 'Cuando hay riesgo de derrumbe se refuerzan las paredes con puntales, ademes u otros elementos.', f: `${N31}, 11.2 f)` },
      { q: 'Empieza a acumularse agua en la zanja. ¿Qué se hace?', ops: ['Suspender los trabajos y remover el agua de inmediato', 'Seguir trabajando con botas', 'Taparla con tierra'], ok: 0, exp: 'Se suspenden los trabajos cuando aumenta el nivel de agua y se remueve de inmediato.', f: `${N31}, 11.2 v)` }] },
    analisis: { principal: 'en_zanja', riesgo: 'Sepultamiento por derrumbe o golpe de la máquina en la zanja', f: 'C', s: 'IV', pista: 'Ocurre pocas veces, pero puede ser fatal.' + fin, control: [
      ctl(true, 'Estabilizar las paredes (ademe/puntales) y prohibir permanecer en la zanja mientras opera la máquina', 'Control de ingeniería más medida de organización: atiende la causa del derrumbe y el golpe.', `${N31}, 11.2 c), f) y h)`),
      ctl(false, 'Pedir que trabajen rápido', 'No reduce el riesgo.', NIOSH),
      ctl(false, 'Dar casco al trabajador de la zanja', 'El EPP no protege contra un sepultamiento.', `${N17}, 5.2; ${NIOSH}`),
      ctl(false, 'Poner cinta de precaución', 'La cinta aplica a excavaciones de menos de 1.5 m; no estabiliza las paredes.', `${N31}, 11.2 n)`)] },
  },

  // ============================================================== ASERRADERO
  aserradero: {
    nombre: 'Aserradero', icono: '🪵', piso: 0xA88B64, ancho: 30, fondo: 24,
    intro: 'Nave con sierra principal, patio de trozas (madera en rollo) y área de preparación de mezcla para motosierras.' + fin,
    escena: [['nave', 0, -6, 0], ['sierra', 0, -6, 0], ['troncos', -9, 4, 0], ['troncos', -5, 4, 0, { sinCunas: true }], ['caseta', 11, 7, Math.PI], ['tambo', 9, -2, 0]],
    recorrido: [
      { at: [0, -4.5], titulo: 'Sierra', texto: 'La maquinaria cuenta con protecciones en las partes peligrosas, dispositivos de paro de emergencia y bloqueo de partes mecánicas.', f: `${N08}, 9.6 b), d) y e)` },
      { at: [-9, 5.5], titulo: 'Madera en rollo', texto: 'Se usan cuñas u otros elementos para que la madera en rollo no pueda caer ni rodar accidentalmente.', f: `${N08}, 9.10 a)` },
      { at: [9, -1], titulo: 'Motosierras', texto: 'Se evita fumar al manipular la motosierra y al preparar la mezcla de combustible; se transporta apagada y con funda en la espada.', f: `${N08}, 8.9 a) y d)` },
      { at: [11, 6], titulo: 'Primeros auxilios', texto: 'Se cuenta con un botiquín con el manual y los materiales de curación necesarios.', f: `${N08}, 5.26` }],
    peligros: [
      { id: 'sin_guarda', real: true, obj: ['senal_flotante', 0.8, -5.2, 0, { texto: 'SIN GUARDA' }], icono: '🪚', nombre: 'Sierra principal operando sin su protección', fb: 'Las partes peligrosas deben contar con protecciones de seguridad.', f: `${N08}, 9.6 b)` },
      { id: 'sin_cunas', real: true, obj: ['marca', -5, 4, 0], icono: '🪵', nombre: 'Pila de trozas sin cuñas, a punto de rodar', fb: 'Se requieren cuñas u otros elementos para que no rueden.', f: `${N08}, 9.10 a)` },
      { id: 'fumando', real: true, obj: ['persona', 8, -1, -1.2, { ropa: 0x8D6E63, casco: 0xF2C230, fuma: true }], icono: '🚬', nombre: 'Trabajador fumando mientras prepara la mezcla de combustible', fb: 'Se debe evitar fumar al preparar la mezcla de combustible.', f: `${N08}, 8.9 d)` },
      { id: 'paro', real: false, obj: ['paro', 2.4, -4.6, 0], icono: '🛑', nombre: 'Botón de paro de emergencia de la sierra', fb: 'Es un dispositivo de seguridad obligatorio.', f: `${N08}, 9.6 d)` },
      { id: 'botiquin', real: false, obj: ['botiquin', 9.6, 6.4, Math.PI], icono: '🩹', nombre: 'Botiquín de primeros auxilios', fb: 'Es un recurso obligatorio para emergencias.', f: `${N08}, 5.26` }],
    inspeccion: [
      { obj: 'sin_guarda', q: '¿La sierra tiene su protección en las partes peligrosas?', a: false, exp: 'No: opera sin guarda.', f: `${N08}, 9.6 b)` },
      { obj: 'paro', q: '¿Hay dispositivo de paro de emergencia?', a: true, exp: 'Sí, está al alcance del operador.', f: `${N08}, 9.6 d)` },
      { obj: 'aviso_corte', q: '¿Hay señalización que prohíba operar de frente al sentido de corte?', a: true, exp: 'Sí, está colocada junto a la sierra.', f: `${N08}, 9.7 i) 1)` },
      { obj: 'sin_cunas', q: '¿Toda la madera en rollo tiene cuñas?', a: false, exp: 'No: una pila no tiene cuñas.', f: `${N08}, 9.10 a)` }],
    extras: [['letrero', -2.6, -4.4, 0, { texto: 'PROHIBIDO OPERAR DE FRENTE AL CORTE', fondo: '#FFFFFF', color: '#C62828', id: 'aviso_corte' }]],
    emergencia: { intro: 'Un ayudante se cortó la mano con la sierra al retirar una astilla.' + fin, foco: 'sin_guarda', efecto: 'alarma', pasos: [
      { q: '¿Qué haces primero?', ops: ['Accionar el paro de emergencia de la sierra', 'Seguir cortando para terminar la pieza', 'Meter la mano para sacar la astilla'], ok: 0, exp: 'La maquinaria cuenta con dispositivos de paro de emergencia.', f: `${N08}, 9.6 d)`, anim: ['detener', 'sierra'] },
      { q: '¿Cómo se pide ayuda?', ops: ['Comunicación con los servicios de auxilio según el procedimiento de emergencias', 'Mandarlo solo al centro de salud', 'No avisar a nadie'], ok: 0, exp: 'El procedimiento de emergencias incluye cómo comunicarse con las autoridades o servicios de auxilio.', f: `${N08}, 12.2` },
      { q: '¿Con qué se le atiende en el sitio?', ops: ['Con el botiquín y el manual de primeros auxilios', 'Con aserrín para secar', 'Con aceite de la máquina'], ok: 0, exp: 'Se cuenta con botiquín con manual y materiales de curación.', f: `${N08}, 5.26`, anim: ['acudir', 'sin_guarda'] },
      { q: 'Antes de limpiar o reparar la sierra…', ops: ['Se aplica el procedimiento de señalización y bloqueo de energía', 'Se limpia con la sierra girando', 'Basta con apagar el foco'], ok: 0, exp: 'El mantenimiento se hace con procedimiento de señalización y bloqueo de energía.', f: `${N08}, 9.7 b)` }] },
    analisis: { principal: 'sin_guarda', riesgo: 'Corte o amputación por contacto con la sierra', f: 'D', s: 'III', pista: 'El operador acerca las manos varias veces por turno; la lesión puede dejar incapacidad permanente.' + fin, control: [
      ctl(true, 'Instalar la protección de las partes peligrosas de la sierra', 'Control de ingeniería: aísla la parte cortante.', `${N08}, 9.6 b)`),
      ctl(false, 'Dar guantes al operador', 'El EPP no evita el contacto con la sierra en movimiento.', `${N17}, 5.2; ${NIOSH}`),
      ctl(false, 'Colocar un letrero de "cuidado"', 'Control administrativo débil.', NIOSH),
      ctl(false, 'Pedir que trabaje con más atención', 'Depende del comportamiento: no controla el peligro.', NIOSH)] },
  },

  // ============================================================== FERROCARRIL
  ferrocarril: {
    nombre: 'Ferrocarril', icono: '🚂', piso: 0xA89B86, ancho: 34, fondo: 24,
    intro: 'Patio de maniobras con dos vías, espuela particular, carro tanque y paso peatonal.' + fin,
    escena: [['via', 0, -5, 0, { largo: 32 }], ['via', 0, 1, 0, { largo: 32 }], ['vagon', -6, -5, 0], ['vagon', 2, -5, 0, { tanque: true }], ['locomotora', 11, 1, 0], ['paso', -12, -2, 0], ['caseta', 13, 8, Math.PI], ['semaforo', -14, -1, 0]],
    recorrido: [
      { at: [-12, -2], titulo: 'Tránsito entre vías', texto: 'Debe existir un procedimiento para el tránsito de trabajadores entre vías y un código de señalización visual y audible de advertencia de la proximidad de trenes.', f: `${N16}, 9.4 a) y g)` },
      { at: [0, 3.5], titulo: 'Espuela particular', texto: 'En las espuelas particulares se disponen espacios no menores de 75 centímetros, libres de obstáculos.', f: `${N16}, 8.4` },
      { at: [15, -5], titulo: 'Final de vía', texto: 'Se instalan topes fijos de material resistente al final de las vías.', f: `${N16}, 8.6` },
      { at: [2, -3.5], titulo: 'Materiales peligrosos', texto: 'Los trabajadores deben conocer los avisos y señales y las hojas de datos de seguridad de las sustancias.', f: `${N16}, 8.8` }],
    peligros: [
      { id: 'cruce', real: true, obj: ['persona', 4, -2, Math.PI / 2, { ropa: 0x1565C0, casco: 0xF2C230 }], icono: '🚶', nombre: 'Trabajador cruzando entre vías fuera del paso, con la locomotora en movimiento', fb: 'El tránsito entre vías sigue un procedimiento y la proximidad de trenes se advierte con señales visuales y audibles.', f: `${N16}, 9.4 a) y g)` },
      { id: 'obstaculo', real: true, obj: ['cajas', -2, 2.1, 0], icono: '📦', nombre: 'Material estibado pegado a la espuela', fb: 'Junto a la espuela debe quedar un espacio libre de al menos 75 cm.', f: `${N16}, 8.4` },
      { id: 'sin_tope', real: true, obj: ['marca', 15.5, -5, 0], icono: '⛔', nombre: 'Final de vía sin tope fijo', fb: 'Al final de las vías se instalan topes fijos de material resistente.', f: `${N16}, 8.6` },
      { id: 'tope_ok', real: false, obj: ['tope', 15.5, 1, 0], icono: '🧱', nombre: 'Tope fijo al final de la otra vía', fb: 'Es la medida que pide la norma.', f: `${N16}, 8.6` },
      { id: 'semaforo_ok', real: false, obj: ['marca', -14, -1, 0], icono: '🚦', nombre: 'Señal luminosa y sonora de aproximación de trenes', fb: 'Es parte del código de señalización visual y audible.', f: `${N16}, 9.4 g)` }],
    inspeccion: [
      { obj: 'sin_tope', q: '¿Todas las vías tienen tope fijo al final?', a: false, exp: 'No: una vía no lo tiene.', f: `${N16}, 8.6` },
      { obj: 'obstaculo', q: '¿Hay 75 cm libres junto a la espuela?', a: false, exp: 'No: hay material estibado junto a la vía.', f: `${N16}, 8.4` },
      { obj: 'semaforo_ok', q: '¿Funciona la señal visual y audible de aproximación de trenes?', a: true, exp: 'Sí.', f: `${N16}, 9.4 g)` },
      { obj: 'brigada', q: '¿La brigada de emergencia tiene un jefe y al menos dos brigadistas?', a: true, exp: 'Sí, el tablero de la caseta lo muestra.', f: `${N16}, 10.3` }],
    extras: [['letrero', 11.4, 6.6, Math.PI, { texto: 'BRIGADA: JEFE + 3 BRIGADISTAS', fondo: '#2E7D32', color: '#fff', id: 'brigada' }]],
    emergencia: { intro: 'El carro tanque gotea una sustancia peligrosa en el patio.' + fin, foco: 'vagon2', efecto: 'fuga', pasos: [
      { q: '¿Qué se pone en marcha?', ops: ['El plan de atención de emergencias', 'Nada, se limpia con un trapo', 'Se mueve el tren para "ventilar"'], ok: 0, exp: 'Se debe contar con un plan de atención de emergencias.', f: `${N16}, 10.1`, anim: ['globo', 'vagon2', '¡Fuga! Plan de emergencia'] },
      { q: '¿Cómo identificas qué sustancia es?', ops: ['Con los avisos y señales del carro y su hoja de datos de seguridad', 'Oliéndola', 'Tocándola con la mano'], ok: 0, exp: 'Los trabajadores deben conocer los avisos y señales y las hojas de datos de seguridad.', f: `${N16}, 8.8` },
      { q: '¿Quién atiende la fuga?', ops: ['La brigada (un jefe y al menos dos brigadistas)', 'El primero que llegue, solo', 'Nadie'], ok: 0, exp: 'Cada brigada se integra por un jefe y al menos dos brigadistas.', f: `${N16}, 10.3`, anim: ['acudir', 'vagon2'] },
      { q: '¿Cuándo se reanudan las maniobras?', ops: ['Solo cuando se haya controlado la emergencia', 'En cuanto deje de oler', 'De inmediato'], ok: 0, exp: 'Las actividades se retoman sólo a partir de que se haya controlado la emergencia.', f: `${N16}, 10.1 f)` }] },
    analisis: { principal: 'cruce', riesgo: 'Atropellamiento por locomotora o carros en movimiento', f: 'C', s: 'IV', pista: 'Pocas veces, pero puede ser fatal.' + fin, control: [
      ctl(true, 'Definir pasos para el tránsito entre vías y operar el código de señales visual y audible de aproximación', 'Combina un control físico (paso definido) con la advertencia obligatoria.', `${N16}, 9.4 a) y g)`),
      ctl(false, 'Pedir que crucen corriendo', 'Aumenta el riesgo.', NIOSH),
      ctl(false, 'Dar chaleco reflejante', 'EPP: último nivel, no evita el cruce.', `${N17}, 5.2; ${NIOSH}`),
      ctl(false, 'Poner un letrero de "precaución"', 'Control administrativo débil.', NIOSH)] },
  },

  // ============================================================== CAMPO AGRÍCOLA
  agricola: {
    nombre: 'Campo agrícola', icono: '🚜', piso: 0x8C6A45, ancho: 32, fondo: 26,
    intro: 'Parcela con tractor e implemento, bodega de agroquímicos, área de lavado y comedor con agua potable.' + fin,
    escena: [['surcos', 0, -6, 0], ['tractor', -4, -2, Math.PI / 2], ['bodega', 11, -8, -Math.PI / 2], ['lavado', 11, 2, -Math.PI / 2], ['caseta', -12, 8, 0], ['comedor', 6, 8, 0]],
    recorrido: [
      { at: [-4, -0.5], titulo: 'Tractor', texto: 'El tractor tiene estructura circundante que proteja al operador contra el sol y volcaduras, y guardas en las partes en movimiento.', f: `${N03}, 9.3 a) y f) 5)` },
      { at: [0, -8], titulo: 'Zona tratada', texto: 'Se respeta el tiempo de reentrada a las zonas tratadas con agroquímicos.', f: `${N03}, 6.7` },
      { at: [11, -6.5], titulo: 'Bodega de agroquímicos', texto: 'Los agroquímicos se almacenan en sus envases originales y cerrados, en un área exclusiva.', f: `${N03}, 8.5 h)` },
      { at: [6, 9], titulo: 'Calor', texto: 'Con temperatura ambiente promedio superior a 28 °C: pausas de al menos 10 minutos por cada 2 horas y beber al menos un vaso de agua cada 30 minutos.', f: `${N03}, 7.11 b) y d)` }],
    peligros: [
      { id: 'toma_fuerza', real: true, obj: ['marca', -5.6, -2, 0], icono: '⚙️', nombre: 'Flecha de la toma de fuerza del tractor sin guarda', fb: 'Las partes en movimiento deben contar con guardas o protecciones.', f: `${N03}, 9.3 a)` },
      { id: 'reingreso', real: true, obj: ['persona', 1, -7, 0, { ropa: 0x2E7D32, casco: null }], icono: '🌱', nombre: 'Jornalero entrando a la parcela recién tratada', fb: 'Se respeta el tiempo de reentrada a las zonas tratadas.', f: `${N03}, 6.7` },
      { id: 'sin_epp', real: true, obj: ['persona', 4, -4, -0.6, { ropa: 0x795548, casco: null, mochila: true }], icono: '🧴', nombre: 'Aplicador sin el equipo que indica la etiqueta', fb: 'Se proporciona el EPP indicado en la etiqueta y/o la hoja de datos de seguridad.', f: `${N03}, 5.4` },
      { id: 'bodega_ok', real: false, obj: ['marca', 11, -8, 0], icono: '🏚️', nombre: 'Agroquímicos cerrados en su envase original, en bodega exclusiva', fb: 'Es la forma correcta de almacenarlos.', f: `${N03}, 8.5 h)` },
      { id: 'agua', real: false, obj: ['dispensador', 7.5, 6.8, Math.PI], icono: '🚰', nombre: 'Agua potable disponible en el comedor', fb: 'Es una obligación del patrón, no un peligro.', f: `${N03}, 5.6` }],
    inspeccion: [
      { obj: 'tractor', q: '¿El tractor tiene estructura que proteja al operador contra volcaduras?', a: true, exp: 'Sí, cuenta con ella.', f: `${N03}, 9.3 f) 5)` },
      { obj: 'toma_fuerza', q: '¿La toma de fuerza tiene guarda?', a: false, exp: 'No: la flecha está descubierta.', f: `${N03}, 9.3 a)` },
      { obj: 'lavado', q: '¿Existe un área específica para lavar el EPP y los equipos de aplicación?', a: true, exp: 'Sí, hay área de lavado.', f: `${N03}, 5.3 g)` },
      { obj: 'reingreso', q: '¿Se respeta el tiempo de reentrada en la zona tratada?', a: false, exp: 'No: un jornalero entra antes de tiempo.', f: `${N03}, 6.7` }],
    emergencia: { intro: 'Una mochila aspersora se rompió y el agroquímico salpicó al aplicador.' + fin, foco: 'sin_epp', efecto: 'derrame', pasos: [
      { q: '¿Qué se activa?', ops: ['El plan de atención de emergencias', 'Nada: se sigue aplicando', 'Se le da agua para tomar'], ok: 0, exp: 'El centro de trabajo agrícola cuenta con un plan de atención de emergencias.', f: `${N03}, 5.14`, anim: ['globo', 'sin_epp', '¡Ayuda! Me salpicó'] },
      { q: '¿Dónde se consulta cómo protegerse y qué equipo usar para ayudarlo?', ops: ['En la etiqueta y la hoja de datos de seguridad del producto', 'Se adivina', 'Con el vecino'], ok: 0, exp: 'El EPP es el indicado en la etiqueta y/o la hoja de datos de seguridad.', f: `${N03}, 5.4` },
      { q: '¿Con qué se le atiende en el sitio?', ops: ['Con el botiquín de primeros auxilios del centro de trabajo', 'Con remedios caseros', 'Con nada'], ok: 0, exp: 'Debe haber un botiquín de primeros auxilios para las emergencias.', f: `${N03}, 5.16`, anim: ['acudir', 'sin_epp'] }] },
    analisis: { principal: 'toma_fuerza', riesgo: 'Atrapamiento por la flecha de la toma de fuerza', f: 'C', s: 'IV', pista: 'Pocas veces, pero el atrapamiento puede ser fatal.' + fin, control: [
      ctl(true, 'Colocar la guarda en la flecha de la toma de fuerza', 'Control de ingeniería: aísla la parte en movimiento.', `${N03}, 9.3 a)`),
      ctl(false, 'Usar ropa holgada', 'Aumenta el riesgo de atrapamiento.', NIOSH),
      ctl(false, 'Colocar un letrero', 'Control administrativo débil.', NIOSH),
      ctl(false, 'Trabajar con más cuidado', 'No controla el peligro.', NIOSH)] },
  },

  // ============================================================== PUERTO
  puerto: {
    nombre: 'Puerto', icono: '⚓', piso: 0xB8BCC0, ancho: 34, fondo: 24, agua: true,
    intro: 'Muelle con barco, grúa pórtico, estibas de contenedores, montacargas y cruce de circulación.' + fin,
    escena: [['agua', 0, -14, 0], ['barco', 0, -15.5, 0], ['grua', 0, -6, 0], ['contenedores', -10, 3, 0], ['contenedores', 9, 4, 0, { n: 3 }], ['montacargas', 4, 1, 0.3], ['bolardos', 0, -9.2, 0], ['caseta', 13, 9, Math.PI], ['espejo', -4, 7, 0]],
    recorrido: [
      { at: [0, -5], titulo: 'Grúa', texto: 'El operador mantiene en todo momento a la vista la carga suspendida y el ayudante se sitúa con máxima visibilidad, usando el código de señales.', f: `${N06}, 8.4.2 e) y k)` },
      { at: [4, 2.5], titulo: 'Montacargas', texto: 'El montacargas cuenta con claxon, alarma automática de reversa y luz centellante ámbar cuando está en movimiento.', f: `${N06}, 8.5.1 b) y d)` },
      { at: [-4, 7], titulo: 'Cruce', texto: 'En los cruces donde circula maquinaria se colocan espejos convexos y señalización de velocidad máxima.', f: `${N06}, 8.1 e) y f)` },
      { at: [-10, 4.5], titulo: 'Áreas de operación', texto: 'Las áreas de operación de la maquinaria se delimitan y se evita el acceso de personas ajenas.', f: `${N06}, 8.1 d)` }],
    peligros: [
      { id: 'bajo_carga', real: true, obj: ['persona', 0.6, -6, Math.PI, { ropa: 0xFF9800, casco: 0xFFFFFF }], icono: '⬇️', nombre: 'Trabajador debajo del contenedor suspendido', fb: 'Se impide el paso a las áreas con riesgo de caída de material y se delimitan con barandas y señalización.', f: `${N06}, 8.8.2 g)` },
      { id: 'desatendida', real: true, obj: ['marca', -2.4, -6, 0, { alto: 7 }], icono: '🪝', nombre: 'Carga suspendida con la cabina de la grúa vacía', fb: 'Se prohíbe dejar una carga suspendida desatendida sin la presencia del operador.', f: `${N06}, 8.1 m)` },
      { id: 'sin_alarma', real: true, obj: ['marca', 4, 1, 0], icono: '🔇', nombre: 'Montacargas en reversa sin alarma ni luz ámbar', fb: 'Debe tener alarma automática de reversa y luz centellante ámbar.', f: `${N06}, 8.5.1 b) y d)` },
      { id: 'espejo_ok', real: false, obj: ['marca', -4, 7, 0], icono: '🪞', nombre: 'Espejo convexo en el cruce', fb: 'Es una medida de control obligatoria.', f: `${N06}, 8.1 f)` },
      { id: 'senalero', real: false, obj: ['persona', 4.5, -3, -0.8, { ropa: 0xFF9800, casco: 0xFFFFFF, brazo: true }], icono: '🙋', nombre: 'Ayudante de maniobra a la vista del operador', fb: 'Es lo que pide la norma: máxima visibilidad y código de señales.', f: `${N06}, 8.4.2 e)` }],
    inspeccion: [
      { obj: 'espejo_ok', q: '¿Hay espejo convexo en el cruce de circulación?', a: true, exp: 'Sí.', f: `${N06}, 8.1 f)` },
      { obj: 'bajo_carga', q: '¿El área bajo la carga suspendida está delimitada y sin personas?', a: false, exp: 'No: hay un trabajador debajo.', f: `${N06}, 8.8.2 g)` },
      { obj: 'senal_vel', q: '¿Hay señal de velocidad máxima de la maquinaria?', a: true, exp: 'Sí, en el cruce.', f: `${N06}, 8.1 e)` },
      { obj: 'sin_alarma', q: '¿El montacargas tiene luz ámbar y alarma de reversa funcionando?', a: false, exp: 'No.', f: `${N06}, 8.5.1 b) y d)` }],
    extras: [['letrero', -2, 8.6, 0, { texto: 'VELOCIDAD MÁXIMA SEÑALIZADA', fondo: '#FFFFFF', color: '#B71C1C', id: 'senal_vel' }]],
    emergencia: { intro: 'Una eslinga falló y el contenedor golpeó a un trabajador en el muelle.' + fin, foco: 'bajo_carga', efecto: 'caida', pasos: [
      { q: '¿Qué haces primero?', ops: ['Activar la alarma de emergencia como indica el procedimiento', 'Grabar con el celular', 'Seguir la maniobra'], ok: 0, exp: 'El procedimiento de emergencia define la forma de activar la alarma.', f: `${N06}, 7.6 b)`, anim: ['globo', 'yo', '¡Alarma activada!'] },
      { q: '¿Qué pasa con las demás cargas izadas?', ops: ['Se detienen las maniobras y ninguna carga queda suspendida sin operador', 'Se dejan colgando para atender más rápido', 'Se sueltan'], ok: 0, exp: 'Se prohíbe dejar una carga suspendida desatendida.', f: `${N06}, 8.1 m)`, anim: ['detener', 'grua'] },
      { q: '¿Quién atiende al lesionado?', ops: ['El personal capacitado en primeros auxilios, con el botiquín', 'El operador de la grúa desde la cabina', 'Nadie'], ok: 0, exp: 'Se cuenta con botiquín, manual y personal capacitado para primeros auxilios.', f: `${N06}, 7.6 d)`, anim: ['acudir', 'bajo_carga'] },
      { q: '¿Y el área de la maniobra?', ops: ['Se delimita y se impide el acceso de personas ajenas', 'Queda abierta', 'Se llena de curiosos'], ok: 0, exp: 'Se delimitan las áreas de operación de la maquinaria.', f: `${N06}, 8.1 d)`, anim: ['delimitar', 'bajo_carga', 4] }] },
    analisis: { principal: 'bajo_carga', riesgo: 'Golpe o aplastamiento por caída de la carga suspendida', f: 'C', s: 'IV', pista: 'Pocas veces, pero la caída de un contenedor puede ser fatal.' + fin, control: [
      ctl(true, 'Delimitar con barandas la zona bajo la trayectoria de la carga e impedir el paso', 'Control de ingeniería: nadie queda bajo la carga.', `${N06}, 8.8.2 g)`),
      ctl(false, 'Dar casco al trabajador', 'El casco no protege contra un contenedor.', `${N17}, 5.2; ${NIOSH}`),
      ctl(false, 'Pedirle que esté atento', 'Depende del comportamiento.', NIOSH),
      ctl(false, 'Subir más rápido la carga', 'No reduce el riesgo.', NIOSH)] },
  },

  // ============================================================== CARRETERA EN CONSTRUCCIÓN
  carretera: {
    nombre: 'Carretera en construcción', icono: '🛣️', piso: 0x9E9A8E, ancho: 34, fondo: 26,
    intro: 'Tramo en reparación con un carril cerrado, señalamiento, banderero, zanja de drenaje, retroexcavadora y camión de volteo.' + fin,
    escena: [['carretera', 0, 4, 0, { largo: 34 }], ['zanja', 2, -6, 0, { largo: 12, ancho: 1.4 }], ['excavadora', -8, -6, Math.PI / 2], ['camion', 10, -3, -Math.PI / 2, { volteo: true, levantada: true }],
      ['pila', 4.8, -4.6, 0], ['conos', 0, 2.2, 0, { n: 10, largo: 24 }], ['caseta', -13, -9, 0], ['senal_obra', -14, 6.8, 0, { texto: 'TRAMO EN REPARACIÓN' }]],
    recorrido: [
      { at: [-14, 6.8], titulo: 'Señales preventivas', texto: 'Las señales preventivas son de fondo naranja reflejante y se colocan antes de la zona de transición previa a la zona de trabajo.', f: `${N86}, cap. 6` },
      { at: [-6, 3.5], titulo: 'Banderero', texto: 'El banderero usa casco blanco y chaleco de visibilidad Clase 2 naranja o amarillo fluorescente, y se coloca de frente a la circulación.', f: `${N86}, 7.8.3 y 7.8.4.1` },
      { at: [0, 2.2], titulo: 'Canalización', texto: 'Los conos miden 70 cm de altura, con base cuadrada no menor de 35 cm y franja blanca reflejante. No se permiten mecheros ni linternas de flama.', f: `${N86}, 7.5.1 y 7.7` },
      { at: [2, -5], titulo: 'Zanja de drenaje', texto: 'Las excavaciones de más de 1.5 m se delimitan con barandales rígidos de 90 cm; el acopio de tierra queda a 2 m o más del borde.', f: `${N31}, 11.2 n) y r)` }],
    peligros: [
      { id: 'banderero', real: true, obj: ['persona', -6, 3.2, 0, { ropa: 0x37474F, casco: null, bandera: true }], icono: '🚩', nombre: 'Banderero sin casco blanco ni chaleco de alta visibilidad', fb: 'Debe usar casco blanco y chaleco de visibilidad Clase 2 fluorescente.', f: `${N86}, 7.8.3` },
      { id: 'mechero', real: true, obj: ['mechero', 6, 2.2, 0], icono: '🔥', nombre: 'Mechero de flama usado como luz de advertencia', fb: 'No se permite el uso de mecheros o linternas de flama.', f: `${N86}, 7.7` },
      { id: 'volteo', real: true, obj: ['marca', 10, -3, 0, { alto: 3.4 }], icono: '🚛', nombre: 'Camión de volteo circulando con la caja levantada', fb: 'Se prohíbe que los camiones de volteo circulen con la caja levantada.', f: `${N31}, 15.9` },
      { id: 'conos_ok', real: false, obj: ['marca', -2, 2.2, 0], icono: '🔶', nombre: 'Conos de canalización con franja reflejante', fb: 'Son los dispositivos de canalización de la norma.', f: `${N86}, 7.5.1` },
      { id: 'destello', real: false, obj: ['destello', 12, 2.2, 0], icono: '💡', nombre: 'Lámpara de destello ámbar', fb: 'Es un dispositivo permitido: luz intermitente ámbar a 1.20 m o más.', f: `${N86}, 7.7.2` }],
    inspeccion: [
      { obj: 'banderero', q: '¿El banderero está de frente a la circulación?', a: true, exp: 'Sí, aunque le falta su equipo.', f: `${N86}, 7.8.4.1` },
      { obj: 'destello', q: '¿Hay lámparas de destello ámbar en la zona de trabajo?', a: true, exp: 'Sí.', f: `${N86}, 7.7.2` },
      { obj: 'zanja', q: '¿La zanja está delimitada con barandal rígido de 90 cm?', a: false, exp: 'No: el perímetro está abierto.', f: `${N31}, 11.2 n)` },
      { obj: 'pila', q: '¿La tierra excavada está a 2 m o más del borde?', a: false, exp: 'No: está junto al borde.', f: `${N31}, 11.2 r)` }],
    emergencia: { intro: 'Un automóvil se salió de la canalización, derribó varios conos y quedó cerca de la zanja.' + fin, foco: 'conos_ok', efecto: 'auto', pasos: [
      { q: '¿Qué hace el banderero?', ops: ['Detiene la circulación con la señal ALTO/SIGA o la bandera, de frente al tránsito', 'Se quita del camino y se va', 'Hace señas con la mano sin bandera'], ok: 0, exp: 'El banderero controla la circulación con la señal portátil ALTO/SIGA o con la bandera, de frente a la circulación.', f: `${N86}, 7.8 y 7.8.4.1`, anim: ['globo', 'banderero', 'ALTO'] },
      { q: '¿Cómo se organiza la respuesta en la obra?', ops: ['Se activa el plan de atención a emergencias', 'Cada quien hace lo que puede', 'Nadie hace nada'], ok: 0, exp: 'La obra debe contar con un plan de atención a emergencias.', f: `${N31}, 19` },
      { q: '¿Qué pasa con la retroexcavadora?', ops: ['Se detiene: nadie puede estar en la zanja con la máquina operando', 'Sigue excavando', 'Se usa para empujar el auto'], ok: 0, exp: 'Prohibido permanecer en la zanja mientras opera la maquinaria de excavación.', f: `${N31}, 11.2 c)`, anim: ['detener', 'excavadora'] },
      { q: 'Antes de reabrir el carril…', ops: ['Se reponen los dispositivos de canalización y el señalamiento', 'Se abre sin conos', 'Se dejan los conos tirados'], ok: 0, exp: 'La canalización (conos, tambos o barreras) separa la circulación de la zona de trabajo.', f: `${N86}, 7.2 a 7.6`, anim: ['delimitar', 'conos_ok', 3] }] },
    analisis: { principal: 'banderero', riesgo: 'Atropellamiento de trabajadores por vehículos del tránsito', f: 'C', s: 'IV', pista: 'Pocas veces, pero puede ser fatal.' + fin, control: [
      ctl(true, 'Separar la zona de trabajo del tránsito con barreras canalizadoras tipo New Jersey', 'Control de ingeniería: barrera física entre vehículos y personas.', `${N86}, 7.3.1; ${NIOSH}`),
      ctl(false, 'Solo dar chaleco al banderero', 'Obligatorio, pero el EPP es el último nivel de control.', `${N86}, 7.8.3; ${NIOSH}`),
      ctl(false, 'Pedir a los conductores que bajen la velocidad de palabra', 'No es un control efectivo.', NIOSH),
      ctl(false, 'Trabajar de noche sin iluminación', 'Aumenta el riesgo.', NIOSH)] },
  },
};
window.PRACTICAS_ZONA_FUENTES = FUENTES;
})();
