# @sgf/web

Frontend de SGF: SPA de React 19 + Vite, con el React Compiler activado y
`react-router` resolviendo las rutas en el cliente. Es la migración a React del
sitio estático que se conserva en `apps/web-legacy/`.

## Comandos

Se ejecutan desde la raíz del monorepo, que es donde vive el lockfile:

```bash
npm run dev                              # dev server -> http://localhost:5173/sgf-app/
npm run build --workspace apps/web       # bundle en apps/web/dist
npm run lint --workspace apps/web
npm run preview --workspace apps/web     # sirve el bundle ya compilado
```

Desde `apps/web/` los scripts cortos (`npm run dev`) también funcionan: npm
encuentra los binarios en el `node_modules` de la raíz.

## Base de las rutas

`vite.config.js` fija `base: '/sgf-app/'`. GitHub Pages publica el sitio en un
subdirectorio del dominio, no en la raíz, y sin esa base el bundle pediría
`/assets/...` y todos los recursos darían 404. Se aplica también en desarrollo
para que la aplicación se comporte igual en ambos entornos.

La base se congela en el bundle al compilar, así que no es configurable al
arrancar el contenedor: se pasa como argumento de build.

## Docker

El `Dockerfile` de esta carpeta compila con Node y sirve el resultado con nginx
—sin Node en la imagen final—, en el puerto 8080 y como usuario sin
privilegios. Se construye **desde la raíz del monorepo**, porque el `npm ci`
necesita el lockfile de allí:

```bash
docker build -f apps/web/Dockerfile -t sgf-web .
docker build -f apps/web/Dockerfile --build-arg BASE_PATH=/sgf-app/ -t sgf-web .
```

## Estructura

```
src/
├── main.jsx           Punto de entrada
├── router.jsx         Rutas de react-router
├── pages/             Una página por ruta        (*.page.jsx)
├── components/        Componentes reutilizables  (*.component.jsx)
├── css/               CSS Modules, espejo de pages/ y components/
├── index.css          Estilos globales
└── assets/            Imágenes que importa el código
```
