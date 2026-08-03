# packages/

Código compartido entre las apps de `apps/`. Está vacío a propósito: no hay
todavía nada que compartir, y sacar un paquete antes de tener dos consumidores
reales solo añade indirección.

Un paquete de aquí **se importa, no se arranca**. Si algo se despliega o se
ejecuta por sí mismo, es una app y va en `apps/`.

Candidatos naturales cuando aparezca el backend:

- La especificación OpenAPI del contrato de la API, generando desde ella los
  tipos de TypeScript para la web y los DTO de Java para el backend. Es el caso
  más claro: un único artefacto compartido del que dependen dos lenguajes, en
  lugar de mantener las dos mitades a mano y verlas divergir.
- Componentes o estilos que compartan la web y la app de escritorio.
- Configuración común de herramientas (ESLint, por ejemplo), hoy declarada
  entera dentro de `apps/web/eslint.config.js`.

## Cómo se comparte, según el lenguaje

No hay un mecanismo único, igual que no hay una herramienta única para el
monorepo. Depende de quién consuma el paquete:

- **Solo JavaScript.** Al haber más de un consumidor, es el momento de
  reintroducir npm workspaces: un `package.json` en la raíz con
  `"workspaces": ["apps/*", "packages/*"]` y el paquete declarado como
  dependencia de quien lo use. npm enlaza el directorio en vez de bajar nada
  del registro. Se quitó precisamente porque con una sola app JS no aportaba
  nada; volver a ponerlo es un cambio pequeño y local.
- **Solo Java.** Un módulo más del proyecto Gradle o Maven de `apps/api`, no un
  directorio aquí.
- **Los dos lenguajes.** El paquete guarda el artefacto neutro -un `.yaml` de
  OpenAPI, un esquema JSON- y cada lado genera su código a partir de él con su
  propio generador, dentro de su propia construcción.

Lo que no conviene es inventar un mecanismo propio de compartición que ninguna
de las dos cadenas de construcción entienda.
