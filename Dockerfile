# syntax=docker/dockerfile:1.7

# sgf-app es una SPA de React + Vite sin backend: lo que produce `vite build`
# son ficheros estáticos. Node solo hace falta para compilarlos, así que la
# imagen final no lo lleva; se queda en nginx sirviendo dist/. De ahí el build
# multietapa: la imagen resultante pesa decenas de MB en vez de cientos.

ARG NODE_IMAGE=node:22-alpine
ARG NGINX_IMAGE=nginx:1.29-alpine


# --------------------------------------------------------------- build -----
FROM ${NODE_IMAGE} AS build

WORKDIR /app

# Solo el manifiesto y el lockfile: mientras esos dos no cambien, Docker
# reutiliza la capa del `npm ci` aunque se haya tocado cualquier fichero de
# src/. Copiar el proyecto entero antes de instalar reinstalaría las
# dependencias en cada cambio de código.
COPY package.json package-lock.json ./

# `npm ci` instala también devDependencies: vite y sus plugins están ahí y sin
# ellos no hay build. Por eso en esta etapa NO se pone NODE_ENV=production, que
# haría que npm las omitiera y que `npm run build` fallara con "vite: not
# found". El bundle sale igualmente en modo producción porque `vite build` ya
# lo hace por defecto.
# La caché de npm va en un mount: acelera las reconstrucciones sin quedarse
# dentro de ninguna capa de la imagen.
RUN --mount=type=cache,target=/root/.npm \
    npm ci --no-audit --no-fund

COPY . .

# vite.config.js fija base: '/sgf-app/' porque GitHub Pages publica el sitio en
# un subdirectorio del dominio. Un contenedor normalmente sirve en la raíz, así
# que aquí la base se sobrescribe y por defecto vale '/'. La base se congela en
# el bundle durante el build (no es configurable al arrancar), de ahí que sea
# un ARG y no una variable de entorno.
# Para reproducir el despliegue de Pages: --build-arg BASE_PATH=/sgf-app/
ARG BASE_PATH=/
RUN npm run build -- --base="${BASE_PATH}"

# El HTML generado referencia sus assets con rutas absolutas que ya incluyen la
# base, así que los ficheros tienen que colgar de ese mismo prefijo dentro del
# sitio. Además se deja una copia de index.html en la raíz: es la que nginx
# devuelve como fallback de las rutas de react-router y, como sus <script> y
# <link> son absolutos, carga bien esté la base donde esté.
RUN set -eu; \
    base="/${BASE_PATH#/}"; base="${base%/}/"; \
    mkdir -p "/site${base}"; \
    cp -a dist/. "/site${base}"; \
    cp -a dist/index.html /site/index.html


# ------------------------------------------------------------- runtime -----
FROM ${NGINX_IMAGE} AS runtime

# Se sustituye la configuración entera en lugar de añadir un fichero a conf.d:
# así no queda activo el server por defecto del puerto 80 y, sobre todo, se
# pueden mover el pid y los directorios temporales a /tmp, que es lo que
# permite arrancar sin ser root.
RUN cat > /etc/nginx/nginx.conf <<'NGINX'
worker_processes  auto;
pid               /tmp/nginx/nginx.pid;
error_log         /dev/stderr  warn;

events {
    worker_connections  1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    access_log    /dev/stdout;

    # Rutas de escritura fuera de /var: el proceso corre como el usuario nginx
    # y no puede crear nada bajo los directorios por defecto.
    client_body_temp_path  /tmp/nginx/client;
    proxy_temp_path        /tmp/nginx/proxy;
    fastcgi_temp_path      /tmp/nginx/fastcgi;
    uwsgi_temp_path        /tmp/nginx/uwsgi;
    scgi_temp_path         /tmp/nginx/scgi;

    sendfile           on;
    tcp_nopush         on;
    keepalive_timeout  65;
    server_tokens      off;

    gzip              on;
    gzip_comp_level   6;
    gzip_min_length   1024;
    gzip_vary         on;
    gzip_types        text/plain text/css application/javascript
                      application/json image/svg+xml application/manifest+json;

    # index.html tiene que revalidarse en cada carga: si se cachea, tras un
    # despliegue el navegador seguiría pidiendo los assets con el hash viejo,
    # que ya no existen, y la aplicación no arrancaría. Los assets sí llevan
    # hash en el nombre, así que cualquier cambio genera un nombre nuevo y se
    # pueden cachear para siempre.
    # Se resuelve con un map para poder declarar todas las cabeceras a nivel de
    # server: nginx descarta los add_header heredados en cuanto un location
    # define uno propio, y repetirlos en cada bloque se olvida enseguida.
    map $uri $sgf_cache_control {
        default    "public, max-age=31536000, immutable";
        ~*\.html$  "no-cache";
        ~*/$       "no-cache";
    }

    server {
        # 8080 y no 80: los puertos por debajo de 1024 exigen root.
        listen       8080;
        server_name  _;

        root   /usr/share/nginx/html;
        index  index.html;

        add_header  Cache-Control           $sgf_cache_control  always;
        add_header  X-Content-Type-Options  nosniff             always;
        add_header  X-Frame-Options         SAMEORIGIN          always;
        add_header  Referrer-Policy         strict-origin-when-cross-origin  always;

        # Los assets existen o no existen. Si les aplicara el fallback de
        # abajo, un .js que faltara devolvería index.html con un 200 y el
        # navegador se quejaría del MIME type en vez de dar un 404 claro.
        location ~ /assets/ {
            try_files $uri =404;
        }

        # react-router resuelve las rutas en el cliente: /panel/ventas no tiene
        # ningún fichero detrás, así que toda URL sin fichero devuelve
        # index.html y la aplicación decide qué pintar (incluida su propia
        # NotFoundPage). Es el equivalente al `cp dist/index.html
        # dist/404.html` que hace el workflow de GitHub Pages.
        location / {
            try_files $uri $uri/ /index.html;
        }
    }
}
NGINX

# `nginx -t` valida la configuración durante el build: un error de sintaxis
# rompe aquí y no en el primer `docker run`. Los directorios temporales se
# crean y se ceden después, porque el propio test los crearía como root y
# entonces el usuario sin privilegios no podría escribir en ellos.
RUN rm -f /etc/nginx/conf.d/default.conf \
    && nginx -t \
    && mkdir -p /tmp/nginx \
    && chown -R nginx:nginx /tmp/nginx /var/cache/nginx

# Sin --chown: los ficheros se quedan de root y el proceso solo los lee, que es
# todo lo que necesita para servirlos.
COPY --from=build /site /usr/share/nginx/html

USER nginx

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -q --spider http://127.0.0.1:8080/ || exit 1

STOPSIGNAL SIGQUIT

# Se anula el entrypoint de la imagen oficial: sus scripts de
# /docker-entrypoint.d (plantillas envsubst, ajuste de IPv6) asumen root y aquí
# la configuración ya viene resuelta desde el build.
ENTRYPOINT []
CMD ["nginx", "-g", "daemon off;"]
