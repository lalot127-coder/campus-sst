# Reporte de cambios — rama `assets-modulos` (05/10/2026)

Campus de Simulación SST · CERS. **Nada se publicó**: los cambios están en la rama `assets-modulos` del repositorio
local `Documents/proyectos/campus-sst` (sin `push`). La fuente sigue siendo `AGENTE/04_simulador`.

## 1. Códigos de acceso
- Se **anularon todas las llaves**: la llave privada anterior y las 13 tarjetas/códigos de prueba emitidos
  (semanales, de cliente, anual y permanente) se enviaron a la **Papelera de reciclaje** de Windows (recuperables).
- Se creó un **par de llaves nuevo** (`python 05_herramientas/acceso_semanal.py llaves --forzar`): la llave pública nueva
  está en `motor/acceso.js`; la privada solo en `00_privado/` (no se publica). Ningún código anterior funciona.
- La pantalla **"Tengo un código"** sigue activa y lista: los códigos nuevos se emiten con `acceso_semanal.py`.
- Los códigos **no viven en el sitio**: cada código lleva su firma digital; el sitio solo tiene la llave pública
  (sirve para comprobar, no para crear). Límite: no se puede anular UN código sin cambiar la llave (se anulan todos).
  Para revocar códigos individuales o proteger de verdad las páginas haría falta un servicio con servidor
  (p. ej. Cloudflare Access, lista de revocación en línea); GitHub Pages solo sirve archivos.
- Nuevo: las salas de módulo se protegen con el id `<edificio>/<módulo>` (p. ej. `industria/alturas`).

## 2. Archivos nuevos
| Archivo | Para qué |
|---|---|
| `assets/<kit>/<kit>.glb` (14) | Modelos por módulo/zona, Meshopt + WebP, carga diferida |
| `assets/texturas/*.webp` | Pisos/muros (ambientCG) y sprites de fuego/humo (Kenney) |
| `assets/INVENTARIO_ASSETS.csv`, `CREDITOS.md`, `creditos.json`, `RESUMEN_BUSQUEDA.txt` | Entregables |
| `motor/kit3d.js` | Cargador GLTF + Meshopt con caché y versión (`VERSION`) |
| `motor/props.js` | 23 objetos propios (extintores, arnés, LOTO, camilla…) |
| `motor/navegacion.js` | Rutas A*: el avatar rodea obstáculos y prefiere caminos y pasillos |
| `motor/interior.js` | Interiores caminables de edificios y casetas |
| `motor/zonas.js` | Mina a cielo abierto, mina subterránea, obra, aserradero, ferrocarril y campo agrícola |
| `motor/letreros.js` | Letreros SVG propios con colores NOM-026 |
| `motor/xr_campus.js` | Realidad virtual del campus (Quest 3S) |
| `motor/modulos.js` + `mundos/modulos/index.html` | 6 salas de módulo |
| `mundos/informacion/creditos.html`, `galeria.html` | Créditos CC-BY y galería 3D |

## 3. Archivos modificados
- `index.html` (campus): mundo de 175 m con hueco del tajo; fachadas con **entrada principal** (puerta 3D, marquesina,
  letrero); al entrar el avatar **camina adentro**; navegación A*; zonas; botón 🗺️ Mapa (teletransporte); 🥽 VR;
  multijugador por lugar (plaza o interior); 6 puertas de sala + puertas **pendiente** de NOM; modo de prueba `?qa`.
  La lista de puertas de **Laboral STPS** (NOM-035, de otra sesión) se respetó sin cambios.
- `motor/avatar.js`: posturas *sentado* y *mirando*. `motor/senales.js`: 8 señales nuevas (B.5, B.7, B.9, B.10, C.12,
  C.13, C.17, A.8 de la NOM-026-STPS-2008). `motor/acceso.js`: llave nueva e id de salas de módulo.
- `biblioteca/catalogo.js`: 10 NOM verificadas (liga oficial). `mundos/informacion/index.html`: liga a créditos.
- `02_fuentes_verificadas/registro_fuentes.md`: 13 filas nuevas (NOM verificadas en el DOF hoy).

## 4. Puertas creadas
- **Salas de módulo (6):** Hospital → Primeros auxilios · Protección civil → Extintores y fuego · Industria → Alturas,
  Espacios confinados, Seguridad eléctrica, LOTO.
- **Pendiente (NOM STPS sin curso):** Industria 005, 006-2023, 010, 011, 013, 014, 015, 018, 020, 022, 024, 025, 027, 028;
  Hospital 012; Empresa · RH 001, 017-2024, 019-2011, 026-2008, 030-2009, 034, 037.
- **Zonas (próximamente):** mina a cielo abierto (3), mina subterránea (3: incl. NOM-032), obra (3), aserradero (2),
  ferrocarril (2), campo agrícola (1, pendiente NOM-003-STPS-2023).

## 5. Mundos existentes mejorados
- **Los 7 edificios**: ahora tienen interior caminable (recepción, sala de espera con sillas, pasillo con ruta y flechas
  de evacuación, señales NOM-026/NOM-003 tocables, extintor, logo CERS, directorio) y puertas 3D que se abren.
- **Exterior**: mundo ampliado, caminos a las zonas, árboles fuera de los caminos, cuarto de máquinas bloqueado.
- No se modificaron los sub-mundos existentes (camilleros, higiene de manos, extintores, evacuación, RH, laboral,
  biblioteca, cafetería): siguen abriendo desde sus puertas.

## 6. Pruebas hechas (navegador del equipo, 05/10/2026)
- Campus, 13 interiores, 6 salas, galería y créditos: **sin errores de consola** (solo el aviso esperado de que no hay
  servidor de aula). 30 fps en la vista de prueba.
- Recorrido: plaza → caminar a Industria → entrar → sentarse → ver señal → abrir puerta → sala Alturas → Atrás.
- Multijugador con `servidor_aula.py`: dos jugadores se ven; al entrar a un edificio solo se ven dentro.
- Vista celular (375×812): plaza e interiores con etiquetas de puertas visibles.
- **Tiempos de carga (servidor local)**: arranque del campus 0.5 s; descarga inicial ≈ 1.0 MB (649 KB propios +
  314 KB de Three.js por CDN); kit de cada sala 40–300 ms; zonas 20–470 ms. Con 4G real se espera más (el arranque
  ≈ 1 MB y cada kit ≤ 460 KB), **pendiente de medir en tu celular**.
- **No probado por mí**: el visor Meta Quest 3S (WebXR solo se activa en el visor) y tablets reales.

## 7. Cómo probar (pasos para ti)
**PC**: abre `04_simulador/index.html` con el servidor (`campus-simulador`) o, ya publicado, el enlace del campus.
1. Toca un edificio → el avatar camina y **entra**; recorre el pasillo, toca una silla y una señal.
2. Industria → puerta "Trabajos en alturas" → sala → ⬅ Atrás. Repite con las otras 5 salas.
3. 🗺️ Mapa → cada zona (mina, mina subterránea, obra, aserradero, ferrocarril, agrícola); toca los marcadores y la caseta.
4. ℹ️ Info → Fuentes → 📜 Créditos y 🧊 Galería.

**Celular y tablet** (mismo wifi con el servidor de aula, o el sitio publicado): repite 1–3 tocando la pantalla;
gira el teléfono en horizontal y vertical; anota el tiempo que tarda en aparecer cada zona.

**Meta Quest 3S** (navegador del visor, sitio publicado con https): botón **🥽 VR** → apunta al piso y aprieta el
gatillo para teletransportarte; apunta a puertas/sillas/señales; joystick izquierda/derecha para girar; prueba con
las manos (pellizco). Dentro de un edificio y en una sala de módulo vuelve a probar el botón VR.

**Acceso**: en el sitio publicado todas las puertas con candado piden código (no hay códigos válidos). Para probar,
emite uno: `python 05_herramientas/acceso_semanal.py cliente --nombre "Pruebas" --puertas "*" --dias 7`.
