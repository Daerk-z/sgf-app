# apps/

Aplicaciones ejecutables o desplegables. Cada una vive en su subdirectorio con
su propio manifiesto de dependencias, su propia cadena de construcción y, si se
despliega, su propio `Dockerfile`.

La regla para decidir si algo va aquí: **una app se arranca o se despliega; un
paquete solo se importa**. Lo segundo va en `packages/`.

| Directorio      | Estado    | Herramientas                                    |
| --------------- | --------- | ----------------------------------------------- |
| `web/`          | Existe    | npm + Vite. Publicada en GitHub Pages            |
| `web-legacy/`   | Existe    | Ninguna: HTML, CSS y JS sueltos                  |
| `api/`          | Pendiente | Backend, previsiblemente Java (Gradle o Maven)   |
| `desktop/`      | Pendiente | Empaquetado de escritorio (Electron/Tauri)       |

Las dos últimas filas son solo la convención acordada: los directorios no
existen todavía y no hay nada que inicializar hasta que se empiecen.

## Convenciones

- **Autonomía.** Una app tiene que poder construirse y ejecutarse desde su
  propio directorio, con las herramientas de su lenguaje y sin nada de la raíz
  del monorepo. Quien trabaje en `api/` no debería necesitar Node instalado.
- **Nada compartido implícitamente.** No hay manifiesto ni lockfile en la raíz.
  Las dependencias se declaran dentro de cada app.
- **Nada de rutas relativas entre apps.** Una app no importa ficheros de otra
  con `../web/src/...`. Lo que se comparta se saca a `packages/` y se consume
  como una dependencia declarada.
- **Un `Dockerfile` por app**, en su directorio, y el contexto de build es ese
  mismo directorio: `docker build -t <imagen> apps/<nombre>`.
- **Un workflow de CI por app**, filtrado con `paths: apps/<nombre>/**`. No hay
  un pipeline único, porque no hay una construcción única.

## Notas por app

**`web-legacy/`** — La excepción a casi todo lo anterior: no tiene manifiesto,
no se compila y no se despliega. Se conserva como referencia de la migración a
React.

**`api/`** — Si acaba siendo Java, trae su propio `gradlew`/`mvnw` y no
comparte absolutamente nada con la web salvo la red de `compose.dev.yaml`. Su
servicio ahí no lleva volúmenes de `node_modules` sino de caché de Gradle; hay
una plantilla comentada.

Cuando el contrato de la API se estabilice, el sitio natural para no
mantenerlo por duplicado en los dos lenguajes es una especificación OpenAPI en
`packages/`, generando desde ella los tipos de TypeScript y los DTO de Java.

**`desktop/`** — Envuelve el bundle que produce `apps/web`, así que dependerá
de él. En desarrollo se ejecuta en el host, no en un contenedor: necesita
servidor gráfico y acceso al hardware. Apunta al dev server que levanta
`compose.dev.yaml` o a `npm run dev`.
