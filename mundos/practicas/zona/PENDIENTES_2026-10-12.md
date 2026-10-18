# Cambios del 12-13/10/2026 (hechos desde el chat en la nube) y pendientes para el agente

## Qué cambió en 04_simulador
- motor/enviar_resultados.js: barra «⬅ Regresar · 🏙️ Campus · 🚪 Salir» en juegos y páginas sin barra propia. El campus abre cada puerta con ?volver=.
- motor/motor.js: caras automáticas en las figuras; animaciones (W.animar, W.globo); recorrido a pie con clic y ruta A* que rodea objetos (W.recorrido); muros que se vuelven transparentes; sonido (W.sonido, W.efecto). Se corrigió un carácter invisible que impedía activar el modo de pruebas ?qa.
- motor/sonido.js (nuevo): sonidos generados por código (Web Audio), sin archivos ni licencias. Botón 🔊/🔇.
- motor/avatar.js: nariz, cejas y orejas.
- hospital/rcp_dea: rescatista de rodillas; la escena actúa cada respuesta correcta; hombros separados del pecho y del cuello.
- hospital/atragantamiento_hemorragia y camilleros: animaciones y caras.
- industria/riesgo_es_riesgo, riesgo_mitigacion y riesgo_normativa: salas más grandes y recorrido a pie.
- riesgo/analisis: salas de 10.5 × 8.5 m, muros transparentes y recorrido con el motor.
- practicas/hidrocarburos: caminar con clic esquivando objetos, señalética NOM-026 / NOM-003-SEGOB, panel siempre visible, Regresar/Campus/Salir y sonidos.
- practicas/zona (nuevo): práctica por zona (recorrido, peligros, inspección, emergencia y análisis) para mina a cielo abierto, mina subterránea, obra, aserradero, ferrocarril, agrícola, puerto y carretera en construcción. Los datos y las fuentes con numerales están en datos.js.
- motor/zonas.js: zonas nuevas de puerto y carretera en construcción, y dos puertas de práctica en cada zona de trabajo.

## Pendientes (según CLAUDE.md)
1. Correr /actualizar-hospedaje (sincronizar_hospedaje.py) para que los juegos de 03_cursos reciban la nueva barra de salida (insertar_enviar_resultados.py).
2. Registrar en 02_fuentes_verificadas/registro_fuentes.md: NOM-086-SCT2-2015 (DOF 24/06/2016) y la Guía informativa NOM-023-STPS-2012 (STPS, enero de 2021). Las demás NOM ya estaban registradas.
3. Agregar las zonas de trabajo (mina_abierta … carretera) a mundos/riesgo/catalogo.js, si también se quieren en la puerta «Análisis de riesgo» por edificio. Las prácticas ya traen su propio análisis.
4. Agregar las puertas nuevas a INVENTARIO_PUERTAS.md. Todas usan la puerta de acceso practicas/zona.
5. Siguiente mejora: grabaciones reales CC0 (motosierra, silbato de tren, ambiente de puerto) y modelos 3D CC0 para las zonas, verificando licencias en assets/INVENTARIO_ASSETS.csv y CREDITOS.md.
6. Publicar cuando lo revises: publicar_campus.py. Está respaldado también en GitHub, en la rama mejoras-campus-2026-10-12, que no se publica.
