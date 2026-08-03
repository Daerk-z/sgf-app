# @sgf/web

Frontend de SGF: SPA de React 19 + Vite, con el React Compiler activado y
`react-router` resolviendo las rutas en el cliente. Es la migración a React del
sitio estático que se conserva en `apps/web-legacy/`.

## Comandos

La app es autónoma: su `package.json`, su lockfile y su `node_modules` están
aquí, y no depende de nada de la raíz del monorepo. Todo se ejecuta desde este
directorio:

```bash
npm install
npm run dev          # dev server -> http://localhost:5173/sgf-app/
npm run build        # bundle en apps/web/dist
npm run lint
npm run preview      # sirve el bundle ya compilado
```

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
privilegios. El contexto de build es este directorio, así que desde la raíz del
repositorio:

```bash
docker build -t sgf-web apps/web
docker build --build-arg BASE_PATH=/sgf-app/ -t sgf-web apps/web
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
