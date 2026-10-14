# Pendientes del campus 3D (14/10/2026)

Rama de trabajo en GitHub: `mejoras-campus-2026-10-12` (NO está en `main` ni publicada).

## Hecho y verificado el 14/10/2026
- Sonidos de pasos, de puertas y de alarma (procedurales, Web Audio, sin archivos externos).
- Chat en sala multijugador: nube sobre la cabeza y emojis (PeerJS y `servidor_aula.py`, campo `msg` de máx. 80 caracteres).
- Dentro de un edificio, tocar la puerta de salida pide confirmación.
- RCP/DEA: ciclo de 30 compresiones a 100–120/min con 2 ventilaciones (30:2). Después de los parches el jugador presiona DESCARGA y luego responde qué sigue (reanudar compresiones).
- Lavado de manos: anillo y reloj visibles con halo; las manos realizan cada paso.
- Avatar del jugador con más detalle: ojos, cejas, cabello, codos, rodillas y ropa.
- Letreros y descripciones con letra más gruesa; pasto mate.
- Extintores con etiqueta por agente y clase (A/B/C/K), según NOM-002-STPS-2010, 7.2 l).
- Barco en el puerto.
- Prácticas ampliadas en las 8 zonas y nueva práctica en 7 edificios, cada una con 5 modos.
- QA:
  - 15 prácticas × 5 modos al 100 %.
  - 75 páginas sin errores.

## Pendiente
1. Ampliar los **juegos** de los cursos. Esta vez solo se ampliaron las prácticas de simulación.
2. Registrar las fuentes nuevas en `registro_fuentes.md`:
   - NOM-045-SSA2-2005, NOM-003-SEGOB-2011, NOM-036-1-STPS-2018.
   - GRE 2024 (Guías 115 y 128).
   - Tríptico de sismo de la SGIRPC.
   - AHA 2025 e IFRC 2025.
3. Verificar sin internet la fuente MSDF del panel A-Frame (hidrocarburos).
4. Ejecutar `/actualizar-hospedaje` y publicar SOLO con autorización expresa ("publica").
5. Copiar `servidor_aula.py` actualizado a los equipos del aula que lo usen.
