# Decisiones de arquitectura (ADR)

Un ADR —*Architecture Decision Record*— es una nota corta que registra **una**
decisión estructural: en qué contexto se tomó, qué se decidió, qué otras
opciones se miraron y qué consecuencias tiene.

## Por qué esto y no solo un ARCHITECTURE.md

`ARCHITECTURE.md` cuenta cómo funciona el repositorio **hoy**, y se reescribe
cuando cambia. Eso hace que pierda justo lo que suele hacer falta más tarde: el
razonamiento, y sobre todo lo que se descartó.

El ejemplo lo tenemos en casa. Este repositorio adoptó npm workspaces
([ADR-0002](0002-npm-workspaces-para-javascript.md)) y los quitó tres commits
después ([ADR-0004](0004-sin-orquestador-de-monorepo.md)). Sin los ADR, dentro
de seis meses alguien mira el repositorio, ve un monorepo de JavaScript sin
workspaces, piensa que es un olvido y los vuelve a poner. Con ellos, encuentra
la decisión anterior, marcada como sustituida, y el motivo.

## Reglas

- **Un ADR no se edita ni se borra.** Si una decisión deja de valer, se escribe
  una nueva que la sustituya y se marca la vieja como `Sustituida por ADR-XXXX`.
  El histórico es el valor.
- **Uno por decisión**, no por fichero ni por commit.
- **Solo lo estructural**: lo que sería caro de revertir, o lo que sorprendería
  a alguien que llegue nuevo. Elegir el nombre de una variable no es un ADR.
- Numeración correlativa, `NNNN-titulo-en-kebab-case.md`, en español como el
  resto del repositorio.

## Estados

| Estado                | Significa                                              |
| --------------------- | ------------------------------------------------------ |
| `Aceptada`            | Vigente                                                |
| `Sustituida por ADR-N`| Ya no se aplica; la N explica por qué                  |
| `Propuesta`           | En discusión, todavía no se ha actuado en consecuencia |

## Índice

| ADR | Título | Estado |
| --- | ------ | ------ |
| [0001](0001-estructura-del-monorepo.md) | Estructura del monorepo | Aceptada |
| [0002](0002-npm-workspaces-para-javascript.md) | npm workspaces para JavaScript | Sustituida por ADR-0004 |
| [0003](0003-empaquetado-y-ci-por-aplicacion.md) | Empaquetado y CI por aplicación | Aceptada |
| [0004](0004-sin-orquestador-de-monorepo.md) | Sin orquestador de monorepo | Aceptada |

## Plantilla

```markdown
# ADR-NNNN — Título

- **Estado:** Propuesta | Aceptada | Sustituida por ADR-XXXX
- **Fecha:** AAAA-MM-DD

## Contexto
Qué situación obliga a decidir. Hechos, no opiniones.

## Decisión
Qué se hace, en imperativo y sin rodeos.

## Alternativas consideradas
Una por opción, con el motivo real del descarte y —si lo hay— la condición
que la reabriría.

## Consecuencias
Lo que esto obliga a hacer, lo bueno y lo malo. Aquí es donde se paga la
honestidad: si la decisión tiene un coste, se escribe.
```
