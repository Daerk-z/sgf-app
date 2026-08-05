package com.sgf.web;

import java.io.IOException;
import java.io.OutputStream;
import java.sql.SQLException;
import java.util.Map;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import com.sgf.dao.UsuarioDAO;
import com.sgf.model.Usuario;
import com.sgf.util.Vista;

/**
 * Maneja la operación "actualizar" del CRUD.
 *
 * GET  (?id=X): muestra el formulario de edición ya cargado con los datos actuales.
 * POST: valida y guarda los cambios en la base de datos.
 */
public class ActualizarHandler implements HttpHandler {

    private final UsuarioDAO usuarioDAO = new UsuarioDAO();

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
            manejarPost(exchange);
        } else {
            manejarGet(exchange);
        }
    }

    private void manejarGet(HttpExchange exchange) throws IOException {
        Map<String, String> query = Formularios.leerQuery(exchange.getRequestURI().getQuery());
        int id = leerId(query.get("id"));

        if (id == -1) {
            redirigir(exchange, "/consultar");
            return;
        }

        Usuario usuario;
        try {
            usuario = usuarioDAO.buscarPorId(id);
        } catch (SQLException e) {
            e.printStackTrace();
            responderHtml(exchange, 500, "<p>No se pudo consultar el usuario.</p>");
            return;
        }

        if (usuario == null) {
            redirigir(exchange, "/consultar");
            return;
        }

        String html = Vista.pagina("Editar usuario", construirFormulario(usuario, null));
        responderHtml(exchange, 200, html);
    }

    private void manejarPost(HttpExchange exchange) throws IOException {
        Map<String, String> datos = Formularios.leerCuerpo(exchange.getRequestBody());

        int id = leerId(datos.get("id"));
        String documento = datos.get("documento");
        String nombre = datos.get("nombre");
        String apellido = datos.get("apellido");
        String correo = datos.get("correo");
        String telefono = datos.get("telefono");

        if (id == -1 || esVacio(documento) || esVacio(nombre) || esVacio(apellido)
                || esVacio(correo) || esVacio(telefono)) {
            redirigir(exchange, "/consultar");
            return;
        }

        Usuario usuario = new Usuario(documento, nombre, apellido, correo, telefono);
        usuario.setId(id);

        try {
            if (usuarioDAO.existeDuplicado(documento, correo, id)) {
                String html = Vista.pagina("Editar usuario",
                        construirFormulario(usuario, "Ya existe otro usuario con ese documento o correo."));
                responderHtml(exchange, 200, html);
                return;
            }

            usuarioDAO.actualizar(usuario);
            redirigir(exchange, "/consultar");

        } catch (SQLException e) {
            e.printStackTrace();
            String html = Vista.pagina("Editar usuario",
                    construirFormulario(usuario, "No se pudo actualizar. Intenta de nuevo."));
            responderHtml(exchange, 200, html);
        }
    }

    private String construirFormulario(Usuario usuario, String mensajeError) {
        StringBuilder contenido = new StringBuilder();
        contenido.append("<h1>Editar usuario</h1>");
        contenido.append("<div class='tarjeta' style='max-width:380px'>");

        if (mensajeError != null) {
            contenido.append("<p style='background:#3a2323;color:#ff8080;font-size:13px;")
                      .append("padding:10px 14px;border-radius:10px;margin-bottom:18px;'>")
                      .append(Vista.escaparHtml(mensajeError)).append("</p>");
        }

        contenido.append("<form method='POST' action='actualizar'>");
        contenido.append("<input type='hidden' name='id' value='").append(usuario.getId()).append("'>");

        contenido.append(campo("documento", "Documento de identidad", "text", usuario.getDocumento()));
        contenido.append(campo("nombre", "Nombre", "text", usuario.getNombre()));
        contenido.append(campo("apellido", "Apellido", "text", usuario.getApellido()));
        contenido.append(campo("correo", "Correo electrónico", "email", usuario.getCorreo()));
        contenido.append(campo("telefono", "Teléfono de contacto", "tel", usuario.getTelefono()));

        contenido.append("<button type='submit' class='btn btn-primario' style='width:100%'>Guardar cambios</button>");
        contenido.append("</form>");
        contenido.append("<p style='margin-top:16px'><a class='enlace-volver' href='consultar'>&larr; Volver al listado</a></p>");
        contenido.append("</div>");

        return contenido.toString();
    }

    private String campo(String nombreCampo, String etiqueta, String tipo, String valor) {
        return "<div class='campo'><label for='" + nombreCampo + "'>" + etiqueta + "</label>"
                + "<input type='" + tipo + "' id='" + nombreCampo + "' name='" + nombreCampo
                + "' value='" + Vista.escaparHtml(valor) + "' required></div>";
    }

    private int leerId(String texto) {
        try {
            return Integer.parseInt(texto);
        } catch (Exception e) {
            return -1;
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

    private void responderHtml(HttpExchange exchange, int codigo, String html) throws IOException {
        byte[] cuerpo = html.getBytes("UTF-8");
        exchange.getResponseHeaders().add("Content-Type", "text/html; charset=UTF-8");
        exchange.sendResponseHeaders(codigo, cuerpo.length);
        try (OutputStream salida = exchange.getResponseBody()) {
            salida.write(cuerpo);
        }
    }
}
