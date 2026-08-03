# sgf-app

Monorepo de SGF. Hoy contiene una sola aplicación —el frontend web— pero la
estructura ya está preparada para que convivan con ella un backend y un
empaquetado de escritorio sin volver a mover nada de sitio.

## Estructura

```
.
├── apps/                 Aplicaciones desplegables (cada una con su Dockerfile)
│   ├── web/              SPA de React + Vite  ->  @sgf/web
│   └── web-legacy/       Sitio estático original, previo a React. Referencia
│                         histórica: no se compila ni se despliega.
├── packages/             Código compartido entre apps (todavía vacío)
├── compose.dev.yaml      Entorno de desarrollo de todo el monorepo
├── package.json          Raíz de npm workspaces: no tiene código propio
└── package-lock.json     Único lockfile del repositorio
```

El repositorio usa [npm workspaces][workspaces], que viene con npm y no
necesita instalar nada más. Las dependencias se declaran en el `package.json`
de cada workspace, pero se resuelven en un único árbol y un único lockfile en
la raíz: por eso `npm install` se ejecuta siempre desde aquí arriba, y por eso
el contexto de los `docker build` es también la raíz.

[workspaces]: https://docs.npmjs.com/cli/using-npm/workspaces

## Requisitos

Node >= 22.22.0 (lo exige `react-router` 8) y npm 10. Alternativamente, Docker:
con `compose.dev.yaml` no hace falta tener Node instalado en la máquina.

## Puesta en marcha

```bash
npm install                 # instala TODOS los workspaces, desde la raíz
npm run dev                 # dev server de la web -> http://localhost:5173/sgf-app/
```

La ruta lleva `/sgf-app/` porque el sitio se publica en un subdirectorio de
GitHub Pages y la base se fija igual en desarrollo, para que la aplicación se
comporte igual en los dos entornos.

### Con Docker, sin instalar Node

```bash
docker compose -f compose.dev.yaml up web
docker compose -f compose.dev.yaml run --rm web npm run lint
```

## Scripts de la raíz

| Script            | Qué hace                                                  |
| ----------------- | --------------------------------------------------------- |
| `npm run dev`     | Dev server de `apps/web`                                   |
| `npm run build`   | Compila todos los workspaces que tengan script `build`     |
| `npm run build:web` | Compila solo `apps/web` (deja el bundle en `apps/web/dist`) |
| `npm run lint`    | Pasa el linter por todos los workspaces                    |
| `npm run preview` | Sirve el bundle ya compilado de `apps/web`                 |

Para trabajar contra un workspace concreto, sin moverse de la raíz:

```bash
npm run <script> --workspace apps/web
npm install <paquete> --workspace apps/web   # dependencia de la app, no de la raíz
```

Una dependencia instalada en la raíz sin `--workspace` es una herramienta del
repositorio (linters, formateadores), no de las aplicaciones.

## Imagen de producción

Cada app trae su propio Dockerfile, pero **se construyen desde la raíz**: el
`npm ci` de dentro necesita el lockfile del monorepo, que no es visible desde
el subdirectorio de la app.

```bash
docker build -f apps/web/Dockerfile -t sgf-web .
docker run --rm -p 8080:8080 sgf-web            # http://localhost:8080/
```

La imagen de `apps/web` es un build multietapa: compila con Node y sirve el
resultado con nginx como usuario sin privilegios, así que no lleva Node dentro.
Para reproducir exactamente lo que se publica en Pages,
`--build-arg BASE_PATH=/sgf-app/`.

## Despliegue

`.github/workflows/deploy.yml` compila `apps/web` y lo publica en GitHub Pages
en cada push a `main`. En los pull requests el workflow solo compila y pasa el
linter, sin publicar.

## Añadir una aplicación nueva

1. Crear `apps/<nombre>/package.json` con `"name": "@sgf/<nombre>"` y
   `"private": true`. El glob `apps/*` de la raíz la recoge sola: no hay que
   registrarla en ninguna lista.
2. `npm install` desde la raíz para que entre en el lockfile.
3. Si se despliega, su `Dockerfile` va dentro de `apps/<nombre>/` y se
   construye con `-f apps/<nombre>/Dockerfile .` desde la raíz.
4. Si necesita levantarse en desarrollo junto al resto, añadir el servicio en
   `compose.dev.yaml`: ahí hay una plantilla comentada, con la nota sobre el
   volumen de `node_modules` que hace falta por workspace.

Ver `apps/README.md` y `packages/README.md` para el reparto entre una carpeta
y otra.
