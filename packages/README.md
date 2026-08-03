# packages/

Código compartido entre las apps de `apps/`. Está vacío a propósito: no hay
todavía nada que compartir, y sacar un paquete antes de tener dos consumidores
reales solo añade indirección.

Un paquete de aquí **se importa, no se arranca**. Si algo se despliega o se
ejecuta por sí mismo, es una app y va en `apps/`.

Candidatos naturales cuando aparezca el backend:

- Tipos y esquemas de validación del contrato de la API, para que cliente y
  servidor no los declaren por duplicado y se desincronicen.
- Componentes o estilos que compartan la web y la app de escritorio.
- Configuración común de herramientas (ESLint, por ejemplo), hoy declarada
  entera dentro de `apps/web/eslint.config.js`.

## Cómo se añade uno

1. `packages/<nombre>/package.json` con `"name": "@sgf/<nombre>"`,
   `"private": true` y el campo `exports` apuntando a su entrada.
2. Declararlo como dependencia en quien lo use, con la versión que tenga:

   ```jsonc
   // apps/web/package.json
   "dependencies": { "@sgf/<nombre>": "0.0.0" }
   ```

3. `npm install` desde la raíz. npm crea un enlace simbólico al directorio del
   paquete en vez de bajar nada del registro, así que los cambios se ven al
   instante sin publicar ni versionar.

Si el paquete necesita compilarse antes de que lo consuma una app, lleva su
propio script `build`; `npm run build` en la raíz recorre todos los workspaces.
Cuando ese orden empiece a importar es la señal de que al monorepo le hace
falta un orquestador de tareas (Turborepo, Nx) — hoy no, con una sola app.
