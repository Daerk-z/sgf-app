package com.sgf.web;

import java.io.IOException;
import java.net.URLEncoder;
import java.sql.SQLException;
import java.util.Map;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import com.sgf.dao.UsuarioDAO;
import com.sgf.model.Usuario;

/**
 * Maneja la operación "insertar" del CRUD: recibe el formulario de
 * register.html y lo guarda en la base de datos vía UsuarioDAO (JDBC).
 */
public class RegistroHandler implements HttpHandler {

    private final UsuarioDAO usuarioDAO = new UsuarioDAO();

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
            redirigir(exchange, "/register.html");
            return;
        }

        Map<String, String> datos = Formularios.leerCuerpo(exchange.getRequestBody());

        String documento = datos.get("documento");
        String nombre = datos.get("nombre");
        String apellido = datos.get("apellido");
        String correo = datos.get("correo");
        String telefono = datos.get("telefono");

        if (esVacio(documento) || esVacio(nombre) || esVacio(apellido)
                || esVacio(correo) || esVacio(telefono)) {
            redirigirConError(exchange, "Todos los campos son obligatorios.");
            return;
        }

        try {
            if (usuarioDAO.existeDuplicado(documento, correo, null)) {
                redirigirConError(exchange, "Ya existe un usuario con ese documento o correo.");
                return;
            }

            Usuario usuario = new Usuario(documento, nombre, apellido, correo, telefono);
            usuarioDAO.insertar(usuario);

            redirigir(exchange, "/consultar");

        } catch (SQLException e) {
            e.printStackTrace();
            redirigirConError(exchange, "No se pudo conectar con la base de datos. Intenta de nuevo.");
        }
    }

    private boolean esVacio(String texto) {
        return texto == null || texto.trim().isEmpty();
    }

    private void redirigir(HttpExchange exchange, String ruta) throws IOException {
        exchange.getResponseHeaders().add("Location", ruta);
        exchange.sendResponseHeaders(302, -1);
        exchange.close();
    }

    private void redirigirConError(HttpExchange exchange, String mensaje) throws IOException {
        String codificado = URLEncoder.encode(mensaje, "UTF-8");
        redirigir(exchange, "/register.html?error=" + codificado);
    }
}
