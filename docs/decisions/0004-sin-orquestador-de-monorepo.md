# ADR-0004 — Sin orquestador de monorepo

- **Estado:** Aceptada
- **Fecha:** 2026-08-03
- **Sustituye a:** [ADR-0002](0002-npm-workspaces-para-javascript.md)

## Contexto

El repositorio se había montado con npm workspaces ([ADR-0002](0002-npm-workspaces-para-javascript.md)),
la respuesta por defecto para un monorepo con JavaScript. Al plantear la
llegada del backend apareció el dato que lo cambia todo: **será
previsiblemente Java**.

Eso obliga a separar dos capas que se confunden con facilidad:

1. **Resolución de dependencias.** npm resuelve JavaScript; Gradle o Maven
   resuelven Java. Estas dos capas no se unifican, y no interesa que lo hagan:
   ninguna herramienta seria intenta que Gradle baje paquetes de npm.
2. **Orquestación de tareas.** «Construye todo», «pasa los tests de lo que ha
   cambiado», «cachea entre ejecuciones de CI». Aquí sí cabría una herramienta
   por encima de las dos.

La pregunta real no era «¿npm workspaces sí o no?», sino **si la capa 2
necesita herramienta a esta escala**. Hoy: dos aplicaciones, ningún código
compartido y `packages/` vacío.

## Decisión

**No adoptar ninguna herramienta de orquestación, y quitar npm workspaces.**

Cada aplicación es autónoma: se construye y se ejecuta desde su propio
directorio, con las herramientas de su lenguaje, sin nada en la raíz. La raíz
no tiene manifiesto de dependencias de ningún tipo.

Tres reglas, en orden de importancia:

1. **Cada app se construye sola con su herramienta nativa.** Quien trabaje en
   el backend no necesita Node instalado; quien trabaje en la web no necesita
   un JDK.
2. **Si algún día hace falta un lanzador de tareas en la raíz, será una
   fachada, nunca una dependencia.** Se borra el fichero y todo sigue
   construyéndose a mano. Esa propiedad es exactamente lo que quitan Bazel y
   Nx.
3. **Lo único común es `compose.dev.yaml`**, y solo para levantar los
   servicios juntos.

## Alternativas consideradas

### Mantener npm workspaces

Lo que estaba puesto. Descartada porque con **una** app JavaScript y
`packages/` vacío no enlazaba ningún paquete local ni compartía ningún árbol de
dependencias: solo aportaba las consecuencias listadas en
[ADR-0002](0002-npm-workspaces-para-javascript.md) —contexto de Docker en la
raíz, `.dockerignore` con `**/`, un volumen de `node_modules` por workspace—.
Quitarlo simplificó las tres.

> **Reabrir si:** `packages/` pasa a tener código JS con dos consumidores
> reales.

### npm como orquestador de la raíz

Tentadora por coste cero: los scripts del `package.json` de la raíz llamando a
`./gradlew`.

```jsonc
"scripts": { "build:api": "cd apps/api && ./gradlew build" }
```

Descartada por un motivo concreto: **haría de Node una dependencia obligatoria
para compilar Java**. Un desarrollador de backend tendría que instalar npm para
construir su propia aplicación. Rompe la regla 1, que es la que sostiene todo
lo demás.

### Bazel (o Pants)

Verdaderamente polyglot y verdaderamente correcto: grafo de dependencias
explícito, builds herméticos y reproducibles, caché y ejecución remotas.

Descartada, y conviene precisar por qué, porque «es demasiado» se queda corto:

- **Sus ventajas se activan por escala.** Resuelven «¿qué hay que reconstruir?»
  cuando el grafo es lo bastante profundo como para que la respuesta no sea
  evidente. Con dos apps sin código compartido, la respuesta es mirarlo. El
  beneficio no es menor a esta escala: es aproximadamente nulo.
- **Sus costes son de entrada y permanentes.** Se reescribe cada build en
  Starlark, y quien llegue nuevo ya no puede limitarse a `npm install`.
- **Caería de forma asimétrica sobre este stack.** Java es su punto fuerte
  —Bazel nace del monorepo Java de Google—, pero JavaScript es el flojo:
  `rules_nodejs` quedó obsoleto, la vía viva es `rules_js` de Aspect, y Vite en
  particular no es camino trillado. Lo más probable es acabar envolviendo
  `vite build` en una regla que hace `sh`, que es precisamente renunciar al
  hermetismo por el que se pagó el peaje.

No es un superconjunto de herramientas más simples: resuelve **un** problema
—corrección y velocidad de build a escala—. Sin ese problema, no da nada a
cambio.

> **Reabrir si:** decenas de aplicaciones, grafo de dependencias profundo entre
> ellas y tiempos de CI intratables. No antes. Hay organizaciones con muchos
> más servicios que este proyecto que nunca lo necesitan.

### Nx

Soporte polyglot real, con complemento para Gradle incluido. Descartada por
proporción: es un motor de grafo y caché que quiere gobernar el repositorio
entero, adoptado para coordinar dos comandos.

> **Reabrir si:** el mismo disparador que Bazel, y es la opción menos abrupta
> de las dos.

### Turborepo

Descartada por forma, no por tamaño. Está centrado en paquetes npm: las tareas
se declaran en `package.json` y su modelo de caché razona en esos términos. Se
puede invocar `gradlew` desde un script, pero entonces el backend Java queda
disfrazado de aplicación JavaScript para que la herramienta lo reconozca. Es
exactamente el acoplamiento que este ADR evita.

### Moon

La opción polyglot razonable si se quisiera herramienta: pensado desde el
principio para varios lenguajes y bastante más ligero que Bazel. Descartada
igualmente porque sigue siendo un framework que aprender y mantener para un
problema que hoy no existe.

### Lanzador de tareas fino en la raíz (Make, Taskfile, just)

**No descartada: aplazada.** Es la respuesta correcta el día que haga falta un
único «construye todo», y encaja con la regla 2 porque es una fachada: delega
en `npm` y en `./gradlew`, y borrarla no rompe nada.

No se añade hoy porque con una sola aplicación real sería indirección pura: un
fichero cuyo único objetivo redirige a un comando.

Cuando toque, la preferencia es **Taskfile** sobre Make: `compose.dev.yaml` ya
lleva notas para Windows y WSL2, señal de que alguien del equipo trabaja en
Windows, donde Make se comporta mal. Taskfile es un binario de Go que funciona
igual en todas partes. Si todo el equipo estuviera en Linux, Make sirve y ya
está instalado.

## Consecuencias

- **No existe un comando que construya todo el repositorio.** Es la
  contrapartida honesta de esta decisión: hay que entrar en cada app. Con dos,
  se asume; es justo lo que resuelve el lanzador aplazado.
- Desaparecen de la raíz `package.json` y `package-lock.json`. La web tiene el
  suyo en `apps/web/`.
- El `Dockerfile` de la web vuelve a construirse con `apps/web` como contexto,
  que era lo natural: lo único que obligaba a usar la raíz era el lockfile
  compartido.
- El workflow de Pages necesita `cache-dependency-path: apps/web/package-lock.json`;
  sin eso `setup-node` busca el lockfile en la raíz y el job falla.
- Desaparece el riesgo del glob `apps/*` anotado en
  [ADR-0002](0002-npm-workspaces-para-javascript.md): ya no hay lista de
  workspaces que pueda recoger un directorio por sorpresa.
- **El caso que sí pedirá coordinación entre lenguajes es el contrato de la
  API.** Mantener a mano los tipos de TypeScript y los DTO de Java es
  garantizar que diverjan. La respuesta prevista no es un orquestador, sino un
  artefacto neutro —una especificación OpenAPI en `packages/`— del que cada
  lado genere su código con su propio generador, dentro de su propia
  construcción. Cuando los endpoints se estabilicen, no antes.
