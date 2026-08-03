# ADR-0003 — Empaquetado y CI por aplicación

- **Estado:** Aceptada
- **Fecha:** 2026-08-03

## Contexto

Cada aplicación del monorepo se despliega por su cuenta y con tecnología
distinta: la web es un bundle estático servido por nginx y publicado además en
GitHub Pages; el backend será un servicio de larga vida sobre la JVM; el
empaquetado de escritorio produce binarios por sistema operativo.

No comparten ni artefacto, ni cadencia de despliegue, ni destino.

## Decisión

**Un `Dockerfile` por aplicación, dentro de su directorio, y el contexto de
build es ese mismo directorio.**

```bash
docker build -t sgf-web apps/web
```

**Un workflow de CI por aplicación.** No hay un pipeline único que construya
todo el repositorio. `.github/workflows/deploy.yml` es exclusivo de la web:
compila, pasa el linter y publica en Pages.

**Un único fichero común, `compose.dev.yaml`, en la raíz**, y solo para
levantar los servicios juntos en desarrollo, en una misma red y con un mismo
ciclo de vida. No compila nada: cada servicio arranca la app con su propia
herramienta.

## Alternativas consideradas

**Un `Dockerfile` en la raíz con etapas por aplicación.** Permite compartir
etapas base y construir todo desde un sitio. Descartada: acopla los ciclos de
vida —tocar el backend invalida capas del frontend— y obliga a que el contexto
de build sea el repositorio entero, con lo que cualquier fichero modificado en
cualquier app invalida la caché de todas.

**Un workflow único con jobs por aplicación.** Más fácil de leer al principio.
Descartada porque cada app necesita su propio entorno —`setup-node` frente a
`setup-java`—, sus propios disparadores y sus propios permisos; y porque un
fallo del backend bloquearía el despliegue del frontend sin motivo.

**Compose también para producción.** Descartada: el despliegue de la web es
GitHub Pages, que no ejecuta contenedores. `compose.dev.yaml` lleva el `dev` en
el nombre precisamente para que no se confunda.

## Consecuencias

- Cada app nueva trae tres cosas suyas: `Dockerfile`, workflow y —si aplica—
  servicio en `compose.dev.yaml`. Hay una plantilla comentada para el backend.
- Hay duplicación entre workflows: la versión de Node, por ejemplo, aparece en
  el workflow de Pages, en el `ARG NODE_IMAGE` del `Dockerfile` y en
  `compose.dev.yaml`. Es deliberado —cada fichero describe un entorno distinto—
  pero **si divergen se estaría desarrollando sobre un Node distinto del que
  compila lo que se publica**. Al subir de versión mayor hay que tocar los
  tres.
- **Pendiente:** mientras solo haya un workflow no hace falta filtrarlo, pero
  en cuanto exista un segundo, cada uno debe llevar `paths:` (`apps/web/**`,
  `apps/api/**`). Sin eso, un cambio solo de backend dispararía el build del
  frontend, y al revés.
- El workflow de la web usa `defaults.run.working-directory: apps/web`. Ojo:
  eso afecta únicamente a los pasos `run`. Las entradas de los pasos `uses`
  —`cache-dependency-path`, la ruta del artefacto— siguen siendo relativas a la
  raíz del repositorio y llevan el prefijo `apps/web` escrito a mano. Es un
  fallo fácil de cometer al añadir el workflow del backend.
