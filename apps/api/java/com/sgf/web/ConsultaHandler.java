package com.sgf.web;

import java.io.IOException;
import java.io.OutputStream;
import java.sql.SQLException;
import java.util.List;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import com.sgf.dao.UsuarioDAO;
import com.sgf.model.Usuario;
import com.sgf.util.Vista;

/**
 * Maneja la operación "consultar" del CRUD: muestra en una tabla todos
 * los usuarios guardados en la base de datos.
 */
public class ConsultaHandler implements HttpHandler {

    private final UsuarioDAO usuarioDAO = new UsuarioDAO();

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        List<Usuario> usuarios;
        try {
            usuarios = usuarioDAO.listar();
        } catch (SQLException e) {
            e.printStackTrace();
            responderHtml(exchange, 500, "<p>No se pudo consultar la base de datos.</p>");
            return;
        }

        String html = Vista.pagina("Usuarios registrados", construirContenido(usuarios));
        responderHtml(exchange, 200, html);
    }

    private String construirContenido(List<Usuario> usuarios) {
        StringBuilder contenido = new StringBuilder();

        contenido.append("<div class='barra-superior'>");
        contenido.append("<h1>Usuarios registrados</h1>");
        contenido.append("<a class='btn btn-primario' href='register.html'>+ Nuevo usuario</a>");
        contenido.append("</div>");

        contenido.append("<div class='tarjeta'>");

        if (usuarios.isEmpty()) {
            contenido.append("<p class='vacio'>Todavía no hay usuarios registrados.</p>");
        } else {
            contenido.append("<table><thead><tr>");
            contenido.append("<th>Documento</th><th>Nombre</th><th>Apellido</th>");
            contenido.append("<th>Correo</th><th>Teléfono</th><th>Acciones</th>");
            contenido.append("</tr></thead><tbody>");

            for (Usuario usuario : usuarios) {
                contenido.append("<tr>");
                contenido.append("<td>").append(Vista.escaparHtml(usuario.getDocumento())).append("</td>");
                contenido.append("<td>").append(Vista.escaparHtml(usuario.getNombre())).append("</td>");
                contenido.append("<td>").append(Vista.escaparHtml(usuario.getApellido())).append("</td>");
                contenido.append("<td>").append(Vista.escaparHtml(usuario.getCorreo())).append("</td>");
                contenido.append("<td>").append(Vista.escaparHtml(usuario.getTelefono())).append("</td>");
                contenido.append("<td class='acciones'>");
                contenido.append("<a class='btn btn-editar' href='actualizar?id=").append(usuario.getId())
                          .append("'>Editar</a>");
                contenido.append("<form method='POST' action='eliminar' style='display:inline' ")
                          .append("onsubmit=\"return confirm('¿Eliminar este usuario?');\">");
                contenido.append("<input type='hidden' name='id' value='").append(usuario.getId()).append("'>");
                contenido.append("<button type='submit' class='btn btn-eliminar'>Eliminar</button>");
                contenido.append("</form>");
                contenido.append("</td>");
                contenido.append("</tr>");
            }

            contenido.append("</tbody></table>");
        }

        contenido.append("</div>");
        return contenido.toString();
    }

    private void responderHtml(HttpExchange exchange, int codigo, String html) throws IOException {
        byte[] cuerpo = html.getBytes("UTF-8");
        exchange.getResponseHeaders().add("Content-Type", "text/html; charset=UTF-8");
        exchange.sendResponseHeaders(codigo, cuerpo.length);
        try (OutputStream salida = exchange.getResponseBody()) {
            salida.write(cuerpo);
        }
    }
}
