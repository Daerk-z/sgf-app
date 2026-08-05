package com.sgf.web;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

/**
 * Sirve los archivos estáticos (HTML, CSS, imágenes) que están empaquetados
 * dentro del jar, en src/main/resources/webapp. Así el .jar queda
 * autocontenido: no hace falta llevar carpetas sueltas junto a él.
 */
public class ArchivoEstaticoHandler implements HttpHandler {

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        String ruta = exchange.getRequestURI().getPath();

        if (ruta.equals("/")) {
            ruta = "/register.html";
        }

        String recurso = "/webapp" + ruta;

        try (InputStream entrada = getClass().getResourceAsStream(recurso)) {
            if (entrada == null) {
                responderNoEncontrado(exchange, ruta);
                return;
            }

            byte[] contenido = leerTodo(entrada);
            exchange.getResponseHeaders().add("Content-Type", tipoContenido(ruta));
            exchange.sendResponseHeaders(200, contenido.length);
            try (OutputStream salida = exchange.getResponseBody()) {
                salida.write(contenido);
            }
        }
    }

    private byte[] leerTodo(InputStream entrada) throws IOException {
        java.io.ByteArrayOutputStream buffer = new java.io.ByteArrayOutputStream();
        byte[] datos = new byte[4096];
        int leidos;
        while ((leidos = entrada.read(datos)) != -1) {
            buffer.write(datos, 0, leidos);
        }
        return buffer.toByteArray();
    }

    private void responderNoEncontrado(HttpExchange exchange, String ruta) throws IOException {
        String mensaje = "404 - No encontrado: " + ruta;
        byte[] cuerpo = mensaje.getBytes("UTF-8");
        exchange.sendResponseHeaders(404, cuerpo.length);
        try (OutputStream salida = exchange.getResponseBody()) {
            salida.write(cuerpo);
        }
    }

    private String tipoContenido(String ruta) {
        if (ruta.endsWith(".html")) {
            return "text/html; charset=UTF-8";
        }
        if (ruta.endsWith(".css")) {
            return "text/css";
        }
        if (ruta.endsWith(".js")) {
            return "application/javascript";
        }
        if (ruta.endsWith(".png")) {
            return "image/png";
        }
        if (ruta.endsWith(".jpg") || ruta.endsWith(".jpeg")) {
            return "image/jpeg";
        }
        if (ruta.endsWith(".svg")) {
            return "image/svg+xml";
        }
        return "application/octet-stream";
    }
}
