import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

// https://vite.dev/config/
export default defineConfig({
  // El sitio se publica en https://daerk-z.github.io/sgf-app/, no en la raíz
  // del dominio: el nombre <usuario>.github.io ya lo ocupa el sitio personal
  // de Daerk-z, así que este repositorio solo puede ser un "project site" y
  // cuelga siempre de /<repo>/. Sin este base, el bundle pediría
  // /assets/index-xxx.js y GitHub devolvería 404 en todos los recursos.
  // Se fija también en desarrollo para que la aplicación se comporte igual en
  // ambos entornos; en local el servidor pasa a servir en /sgf-app/.
  base: '/sgf-app/',
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
})
