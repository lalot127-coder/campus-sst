# Campus de Simulación SST — carpeta para publicar

Esta carpeta se genera con `python 05_herramientas/publicar_simulador.py`. Contiene el simulador completo
(campus, sub-mundos, biblioteca, cafetería y juegos). **No contiene datos personales**: los resultados de cada
persona se guardan en su propio dispositivo (o en la computadora de la persona instructora cuando se usa el
servidor de aula).

## Publicar gratis en GitHub Pages (una sola vez)
1. Entra a https://github.com con tu cuenta **lalot127-coder** → botón **New** (nuevo repositorio).
2. Nombre: `campus-sst` · **Public** · Create repository.
3. En el repositorio: **Add file → Upload files** → arrastra TODO el contenido de esta carpeta
   (no la carpeta, su contenido: `index.html`, `motor/`, `mundos/`, `biblioteca/`, `recursos/`, `juegos/`) → **Commit changes**.
   Si GitHub no deja subir tantos archivos de una vez, súbelos por carpetas.
4. **Settings → Pages → Branch: main / (root) → Save**. En 1-2 minutos queda en:
   **https://lalot127-coder.github.io/campus-sst/**

## Enlaces para compartir por separado
- Campus completo: `https://lalot127-coder.github.io/campus-sst/`
- Un edificio: `.../campus-sst/index.html?mundo=biblioteca` (hospital, industria, proteccion, laboral, empresa, cafeteria)
- Un sub-mundo: `.../campus-sst/mundos/empresa/rh_checador/index.html`
- Un juego: `.../campus-sst/mundos/cafeteria/memorama.html`
Dentro del simulador, el botón **🔗 Compartir** genera el enlace y el código QR de lo que estás viendo.

## Acceso semanal (QR)
Las puertas se abren con códigos firmados que generas en tu computadora:
`python 05_herramientas/acceso_semanal.py semanal --curso 03_cursos/<curso>` (vence el domingo 23:55, centro de México).
Los códigos NO se suben: viajan en el QR. No hay que volver a publicar cada semana.

## Actualizar
Vuelve a correr el script y sube de nuevo los archivos que cambiaron (GitHub reemplaza los que tengan el mismo nombre).

## Límites (GitHub Pages, verificados 03/10/2026)
Sitio ≤ 1 GB (este pesa lo que indica el script), ~100 GB de transferencia al mes, sitio público (cualquiera con el
enlace lo ve) y no permite cobrar ni poner contraseña. Para venta o acceso privado ver la explicación del agente.
