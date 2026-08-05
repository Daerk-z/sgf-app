package com.sgf.web;

import java.io.IOException;
import java.sql.SQLException;
import java.util.Map;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import com.sgf.dao.UsuarioDAO;

/**
 * Maneja la operación "eliminar" del CRUD: recibe el id por POST (desde el
 * botón "Eliminar" en la tabla de consulta) y borra ese registro.
 */
public class EliminarHandler implements HttpHandler {

    private final UsuarioDAO usuarioDAO = new UsuarioDAO();

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        Map<String, String> datos = Formularios.leerCuerpo(exchange.getRequestBody());
        int id = leerId(datos.get("id"));

        if (id != -1) {
            try {
                usuarioDAO.eliminar(id);
            } catch (SQLException e) {
                e.printStackTrace();
                // Si falla el borrado, igual devolvemos al listado; el registro
                // simplemente seguirá apareciendo porque no se eliminó.
            }
        }

        exchange.getResponseHeaders().add("Location", "/consultar");
        exchange.sendResponseHeaders(302, -1);
        exchange.close();
    }

    private int leerId(String texto) {
        try {
            return Integer.parseInt(texto);
        } catch (Exception e) {
            return -1;
        }
    }
}
