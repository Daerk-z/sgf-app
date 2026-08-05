package com.sgf.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import com.sgf.db.ConexionBD;
import com.sgf.model.Usuario;

/**
 * Acceso a datos (JDBC) para la tabla `usuarios` de la base main_sgf.
 * Centraliza aquí todo el SQL para que los servlets solo se encarguen de HTTP.
 *
 * Esta clase solo lee/escribe las columnas documento, nombre, apellido,
 * correo y telefono. No toca usuario, contrasena, rol ni estado.
 */
public class UsuarioDAO {

    public void insertar(Usuario usuario) throws SQLException {
        String sql = "INSERT INTO usuarios (documento, nombre, apellido, correo, telefono) "
                + "VALUES (?, ?, ?, ?, ?)";

        try (Connection conexion = ConexionBD.obtenerConexion();
             PreparedStatement stmt = conexion.prepareStatement(sql)) {

            stmt.setString(1, usuario.getDocumento());
            stmt.setString(2, usuario.getNombre());
            stmt.setString(3, usuario.getApellido());
            stmt.setString(4, usuario.getCorreo());
            stmt.setString(5, usuario.getTelefono());
            stmt.executeUpdate();
        }
    }

    public List<Usuario> listar() throws SQLException {
        List<Usuario> usuarios = new ArrayList<>();
        String sql = "SELECT id_usuario, documento, nombre, apellido, correo, telefono "
                + "FROM usuarios ORDER BY id_usuario DESC";

        try (Connection conexion = ConexionBD.obtenerConexion();
             PreparedStatement stmt = conexion.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                usuarios.add(mapearUsuario(rs));
            }
        }
        return usuarios;
    }

    public Usuario buscarPorId(int id) throws SQLException {
        String sql = "SELECT id_usuario, documento, nombre, apellido, correo, telefono "
                + "FROM usuarios WHERE id_usuario = ?";

        try (Connection conexion = ConexionBD.obtenerConexion();
             PreparedStatement stmt = conexion.prepareStatement(sql)) {

            stmt.setInt(1, id);

            try (ResultSet rs = stmt.executeQuery()) {
                return rs.next() ? mapearUsuario(rs) : null;
            }
        }
    }

    public void actualizar(Usuario usuario) throws SQLException {
        String sql = "UPDATE usuarios SET documento = ?, nombre = ?, apellido = ?, "
                + "correo = ?, telefono = ? WHERE id_usuario = ?";

        try (Connection conexion = ConexionBD.obtenerConexion();
             PreparedStatement stmt = conexion.prepareStatement(sql)) {

            stmt.setString(1, usuario.getDocumento());
            stmt.setString(2, usuario.getNombre());
            stmt.setString(3, usuario.getApellido());
            stmt.setString(4, usuario.getCorreo());
            stmt.setString(5, usuario.getTelefono());
            stmt.setInt(6, usuario.getId());
            stmt.executeUpdate();
        }
    }

    public void eliminar(int id) throws SQLException {
        String sql = "DELETE FROM usuarios WHERE id_usuario = ?";

        try (Connection conexion = ConexionBD.obtenerConexion();
             PreparedStatement stmt = conexion.prepareStatement(sql)) {

            stmt.setInt(1, id);
            stmt.executeUpdate();
        }
    }

    /**
     * Valida si ya existe un usuario con el mismo documento o correo
     * (requisito de la guía: "validación de existencia de datos repetidos").
     *
     * idExcluir se usa al actualizar, para no comparar el registro consigo
     * mismo; pásalo en null al insertar un usuario nuevo.
     */
    public boolean existeDuplicado(String documento, String correo, Integer idExcluir) throws SQLException {
        String sql = "SELECT COUNT(*) FROM usuarios WHERE (documento = ? OR correo = ?)"
                + (idExcluir != null ? " AND id_usuario <> ?" : "");

        try (Connection conexion = ConexionBD.obtenerConexion();
             PreparedStatement stmt = conexion.prepareStatement(sql)) {

            stmt.setString(1, documento);
            stmt.setString(2, correo);
            if (idExcluir != null) {
                stmt.setInt(3, idExcluir);
            }

            try (ResultSet rs = stmt.executeQuery()) {
                rs.next();
                return rs.getInt(1) > 0;
            }
        }
    }

    private Usuario mapearUsuario(ResultSet rs) throws SQLException {
        Usuario usuario = new Usuario();
        usuario.setId(rs.getInt("id_usuario"));
        usuario.setDocumento(rs.getString("documento"));
        usuario.setNombre(rs.getString("nombre"));
        usuario.setApellido(rs.getString("apellido"));
        usuario.setCorreo(rs.getString("correo"));
        usuario.setTelefono(rs.getString("telefono"));
        return usuario;
    }
}
