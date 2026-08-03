# ADR-0001 — Estructura del monorepo

- **Estado:** Aceptada
- **Fecha:** 2026-08-03

## Contexto

El repositorio contenía una única aplicación de Vite en la raíz: `src/`,
`index.html`, `vite.config.js` y `package.json` colgando directamente del
directorio del proyecto.

Está previsto que convivan con ella un backend y un empaquetado de escritorio.
Que el proyecto sea un monorepo es un requisito de partida, no algo que se
debatiera aquí: lo que había que decidir era **la distribución interna**, y
hacerlo antes de que existiera código nuevo, porque mover directorios con tres
aplicaciones dentro cuesta mucho más que con una.

## Decisión

Dos directorios de primer nivel, con un criterio único para repartir:

```
apps/       Se arranca o se despliega
packages/   Solo se importa
```

- La aplicación de Vite pasa a `apps/web/`, con todo lo suyo dentro: código,
  manifiesto, configuración de Vite, del linter y su `Dockerfile`.
- `packages/` se crea vacío, con un README que explica qué va ahí. No se
  inicializa ningún paquete: sacar código compartido antes de tener dos
  consumidores reales solo añade indirección.
- El sitio estático anterior a React pasa a `apps/web-legacy/`.
- No se inicializa ninguna aplicación que no exista. La estructura queda
  preparada; el código, cuando toque.

## Alternativas consideradas

**Dejar la web en la raíz y colgar solo las apps nuevas de `apps/`.** Evitaba
mover ficheros hoy, a cambio de una asimetría permanente: la web sería «la app
de verdad» y el resto, invitadas. Cada herramienta que mirase la raíz —linter,
Docker, CI— tendría que distinguir entre ficheros del proyecto y ficheros de la
web. Descartada: el coste de moverla solo crece con el tiempo.

**`legacy/` en la raíz, fuera de `apps/`.** Fue la primera opción, con el
argumento de que es un artefacto histórico de todo el producto y no una
aplicación viva. Se descartó por simetría: es el frontend anterior, y tenerlo
al mismo nivel que `apps/` sugería una categoría que no existe. Ahora es
`apps/web-legacy/`, con una excepción documentada —no tiene manifiesto, no se
construye y no se despliega—.

**`frontend/` y `backend/` en la raíz, sin `apps/`.** Plano y legible con dos
piezas, pero no tiene sitio para el código compartido ni para una tercera
aplicación que no sea ninguna de las dos cosas. Descartada.

## Consecuencias

- Todas las rutas relativas a la raíz cambian de golpe: `Dockerfile`,
  `.dockerignore`, workflow de CI y documentación. Se hizo en un solo commit,
  con `git mv` para que el histórico siga los ficheros.
- `apps/` deja de ser homogéneo desde el primer día: `web-legacy/` no se
  construye. Está documentado en `apps/README.md` para que nadie intente
  «arreglarlo».
- La raíz queda como estructura, sin código propio. Qué puede vivir ahí lo
  acota [ADR-0004](0004-sin-orquestador-de-monorepo.md).
