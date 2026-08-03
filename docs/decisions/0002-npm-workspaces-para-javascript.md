# ADR-0002 — npm workspaces para JavaScript

- **Estado:** Sustituida por [ADR-0004](0004-sin-orquestador-de-monorepo.md)
- **Fecha:** 2026-08-03

> Esta decisión estuvo vigente unas horas y se revirtió en el mismo trabajo que
> la introdujo. Se conserva porque npm workspaces es la respuesta por defecto
> para un monorepo con JavaScript dentro, y sin este registro es muy probable
> que alguien lo reintroduzca sin saber que ya se probó y por qué se quitó.

## Contexto

Repartido el repositorio en `apps/` y `packages/` ([ADR-0001](0001-estructura-del-monorepo.md)),
quedaba decidir cómo se resolvían las dependencias de JavaScript ahora que el
`package.json` ya no estaba en la raíz.

npm workspaces es la herramienta nativa para esto: viene con npm, no hay nada
que instalar, y es lo que espera encontrar cualquiera que abra un monorepo con
JavaScript.

## Decisión

Declarar la raíz como raíz de workspaces:

```jsonc
// package.json (raíz)
{
  "private": true,
  "workspaces": ["apps/*", "packages/*"],
  "scripts": {
    "dev": "npm run dev --workspace apps/web",
    "build": "npm run build --workspaces --if-present"
  }
}
```

Un único `package-lock.json` en la raíz, `node_modules` elevado allí, y scripts
que delegan en los workspaces.

## Alternativas consideradas

**pnpm workspaces.** Mejor gestión del almacén de paquetes y más estricto con
las dependencias fantasma. Descartada porque el proyecto ya venía con `npm` y
un `package-lock.json`, y el workflow de CI usaba `npm ci`: cambiar de gestor
era un cambio propio, sin relación con la reestructuración.

**Lista explícita de workspaces en vez del glob `apps/*`.** Se consideró por un
riesgo real: cualquier directorio que acabe teniendo un `package.json` entra
como workspace sin que nadie lo pida —incluido un backend que solo lo tuviera
para alguna herramienta suelta—. Se mantuvo el glob por comodidad, anotando el
riesgo. Con [ADR-0004](0004-sin-orquestador-de-monorepo.md) el problema
desaparece por completo.

**Cada app con su propio `package.json` y su lockfile, sin raíz.** Es lo que
finalmente se hizo, pero en este momento se descartó: parecía renunciar a un
lockfile único y a la posibilidad de enlazar paquetes locales de `packages/`.

## Consecuencias

Las consecuencias son, en retrospectiva, el argumento que llevó a revertir la
decisión.

- **El contexto de build de Docker tuvo que subir a la raíz.** El lockfile
  vivía arriba y `npm ci` lo necesita, así que la imagen de la web ya no se
  podía construir desde `apps/web`: pasó a `docker build -f apps/web/Dockerfile .`,
  con `COPY` de rutas separadas para el manifiesto de la raíz y el del
  workspace.
- **El `.dockerignore` tuvo que vivir en la raíz**, y sus patrones necesitaron
  el prefijo `**/`, porque Docker solo lee el del directorio del contexto y sin
  ese prefijo `node_modules` solo casaba en el primer nivel.
- **`compose.dev.yaml` tuvo que montar el monorepo entero** y declarar un
  volumen de `node_modules` por workspace, porque npm eleva parte del árbol a
  la raíz y deja el resto dentro de cada app.
- **A cambio, con una sola app JavaScript, no aportó nada**: no había paquetes
  locales que enlazar ni árbol de dependencias que compartir.

## Cuándo volvería a tener sentido

Cuando `packages/` contenga código JavaScript con **dos consumidores reales**
—por ejemplo componentes compartidos entre `apps/web` y `apps/desktop`—. Ahí
los workspaces sí resuelven algo que no resuelve nada más: enlazar un paquete
local sin publicarlo en ningún registro.

Reintroducirlo es un cambio pequeño y local: un `package.json` en la raíz con
el campo `workspaces`, `npm install` para regenerar el lockfile, y revertir las
consecuencias de arriba. No hay que rediseñar nada.
