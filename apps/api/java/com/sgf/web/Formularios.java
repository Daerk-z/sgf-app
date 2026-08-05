package com.sgf.web;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

/**
 * Lee datos enviados por formularios HTML (POST, application/x-www-form-urlencoded)
 * y por query strings (GET ?clave=valor), ya que sin Servlet API no existe
 * request.getParameter() y hay que parsear esto a mano.
 */
public class Formularios {

    private Formularios() {
    }

    public static Map<String, String> leerCuerpo(InputStream entrada) throws IOException {
        ByteArrayOutputStream buffer = new ByteArrayOutputStream();
        byte[] datos = new byte[1024];
        int leidos;
        while ((leidos = entrada.read(datos)) != -1) {
            buffer.write(datos, 0, leidos);
        }
        return parsear(buffer.toString(StandardCharsets.UTF_8.name()));
    }

    public static Map<String, String> leerQuery(String query) {
        return parsear(query);
    }

    private static Map<String, String> parsear(String texto) {
        Map<String, String> valores = new HashMap<>();
        if (texto == null || texto.isEmpty()) {
            return valores;
        }
        for (String par : texto.split("&")) {
            int igual = par.indexOf('=');
            if (igual == -1) {
                continue;
            }
            String clave = decodificar(par.substring(0, igual));
            String valor = decodificar(par.substring(igual + 1));
            valores.put(clave, valor);
        }
        return valores;
    }

    private static String decodificar(String texto) {
        try {
            return URLDecoder.decode(texto, "UTF-8");
        } catch (java.io.UnsupportedEncodingException e) {
            throw new RuntimeException(e);
        }
    }
}
