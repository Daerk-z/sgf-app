# apps/

Aplicaciones ejecutables o desplegables. Cada subdirectorio es un workspace de
npm independiente, con su propio `package.json`, sus dependencias y, si se
despliega, su propio `Dockerfile`.

La regla para decidir si algo va aquí: **una app se arranca o se despliega; un
paquete solo se importa**. Lo segundo va en `packages/`.

| Directorio      | Estado    | Qué es                                          |
| --------------- | --------- | ----------------------------------------------- |
| `web/`          | Existe    | SPA de React + Vite, publicada en GitHub Pages   |
| `api/`          | Pendiente | Backend. Nombre previsto: `@sgf/api`             |
| `desktop/`      | Pendiente | Empaquetado de escritorio (Electron/Tauri) de la web |

Las dos últimas filas son solo la convención acordada: los directorios no
existen todavía y no hay nada que inicializar hasta que se empiecen.

## Convenciones

- Nombre del paquete: `@sgf/<directorio>`, y siempre `"private": true` — nada
  de esto se publica en el registro de npm.
- Scripts esperados, para que los scripts de la raíz funcionen sin tocar nada:
  `dev`, `build` y `lint`. Los que no apliquen se omiten; la raíz los recorre
  con `--if-present`.
- Las dependencias se declaran en el `package.json` de la app, nunca en el de
  la raíz. El de la raíz es solo para herramientas de todo el repositorio.
- Una app no importa ficheros de otra por ruta relativa (`../web/src/...`). Lo
  que se comparte se saca a un paquete de `packages/` y se importa por su
  nombre.
- El `Dockerfile` vive dentro de la app, pero el contexto de build es la raíz
  del monorepo. Ver `apps/web/Dockerfile`, que ya está escrito así.

## Notas por app

**`api/`** — Si acaba siendo Node, entra como workspace y comparte lockfile con
el resto. Si es de otro lenguaje (Python, Java...), el directorio vivirá igual
aquí pero sin `package.json`: `apps/*` no lo recogerá como workspace y se
gestionará con las herramientas de su propio ecosistema. En ese caso su
servicio de `compose.dev.yaml` no lleva los volúmenes de `node_modules`.

**`desktop/`** — Envuelve el bundle que produce `apps/web`, así que dependerá de
él. En desarrollo se ejecuta en el host, no en un contenedor: necesita servidor
gráfico y acceso al hardware. Apunta al dev server que levanta
`compose.dev.yaml` o a `npm run dev`.
