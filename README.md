# sgf-app

Monorepo de SGF. Hoy contiene una sola aplicación —el frontend web— pero la
estructura ya está preparada para que convivan con ella un backend y un
empaquetado de escritorio sin volver a mover nada de sitio.

## Estructura

```
.
├── apps/                 Aplicaciones ejecutables o desplegables
│   ├── web/              SPA de React + Vite
│   └── web-legacy/       Sitio estático original, previo a React. Referencia
│                         histórica: no se compila ni se despliega.
├── packages/             Código compartido entre apps (todavía vacío)
└── compose.dev.yaml      Levanta el conjunto en desarrollo
```

## Cómo funciona: cada app es autónoma

No hay ninguna herramienta que orqueste el monorepo, y es deliberado. **Cada
aplicación se construye y se ejecuta con las herramientas de su propio
lenguaje, desde su propio directorio.** El backend será previsiblemente Java,
así que cualquier capa por encima -npm workspaces, Nx, Bazel- tendría que
cubrir dos ecosistemas que no se mezclan, a cambio de una complejidad que a
esta escala no se paga sola.

De ahí tres reglas que conviene mantener:

1. **Nada en la raíz gestiona dependencias.** No hay `package.json` arriba. Las
   de la web están en `apps/web/package.json`, con su propio lockfile; las del
   futuro backend estarán en su `build.gradle`/`pom.xml`.
2. **Cada app tiene que poder construirse sola, con su herramienta nativa.**
   Quien trabaje en el backend no debería necesitar Node instalado, ni quien
   trabaje en la web necesitar un JDK.
3. **Lo único común es `compose.dev.yaml`**, y solo para levantarlas juntas en
   una misma red. No compila nada.

Si algún día hace falta un `task build` que lo construya todo de una vez, la
respuesta es un lanzador de tareas fino en la raíz (`Taskfile.yml`, `Makefile`)
que delegue en `npm` y en `./gradlew`. Nunca una herramienta que reemplace a
ninguna de las dos.

## La aplicación web

Requisitos: Node >= 22.22.0 (lo exige `react-router` 8) y npm 10.

```bash
cd apps/web
npm install
npm run dev          # -> http://localhost:5173/sgf-app/
npm run build        # bundle en apps/web/dist
npm run lint
```

La ruta lleva `/sgf-app/` porque el sitio se publica en un subdirectorio de
GitHub Pages y la base se fija igual en desarrollo, para que la aplicación se
comporte igual en los dos entornos.

Ver `apps/web/README.md` para el detalle.

### Sin instalar Node: Docker

```bash
docker compose -f compose.dev.yaml up web
docker compose -f compose.dev.yaml run --rm web npm run lint
```

Este es el comando que se ejecuta desde la raíz; el resto de apps se añadirán
como servicios del mismo fichero.

## Imagen de producción

Cada app trae su propio Dockerfile y se construye desde su propio directorio:

```bash
docker build -t sgf-web apps/web
docker run --rm -p 8080:8080 sgf-web            # http://localhost:8080/
```

La imagen de `apps/web` es un build multietapa: compila con Node y sirve el
resultado con nginx como usuario sin privilegios, así que no lleva Node dentro.
Para reproducir exactamente lo que se publica en Pages,
`--build-arg BASE_PATH=/sgf-app/`.

## Despliegue

`.github/workflows/deploy.yml` compila `apps/web` y lo publica en GitHub Pages
en cada push a `main`. En los pull requests solo compila y pasa el linter, sin
publicar.

Ese workflow es exclusivo de la web. Cada app que se añada traerá el suyo: no
hay un pipeline único, igual que no hay un build único.

## Añadir una aplicación nueva

1. Crear `apps/<nombre>/` con el manifiesto que le corresponda a su lenguaje
   (`package.json`, `pom.xml`, `build.gradle.kts`...). No hay que registrarla
   en ninguna lista de la raíz, porque no existe tal lista.
2. Si se despliega, su `Dockerfile` va dentro de ese mismo directorio y se
   construye con `docker build -t <imagen> apps/<nombre>`.
3. Si necesita levantarse en desarrollo junto al resto, añadir el servicio en
   `compose.dev.yaml`: hay una plantilla comentada para el backend.
4. Si tiene CI, un workflow propio en `.github/workflows/`, filtrado por
   `paths: apps/<nombre>/**` para que no se dispare con cambios ajenos.

Ver `apps/README.md` y `packages/README.md` para el reparto entre una carpeta
y otra.
