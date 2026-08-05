package com.sgf.model;

/**
 * Representa un registro de la tabla `usuarios` (base de datos main_sgf).
 * Solo mapea las columnas que usa el formulario de registro: id_usuario,
 * documento, nombre, apellido, correo y telefono. La tabla real tiene
 * columnas adicionales (usuario, contrasena, rol, estado) que este
 * formulario no gestiona.
 */
public class Usuario {

    private int id;
    private String documento;
    private String nombre;
    private String apellido;
    private String correo;
    private String telefono;

    public Usuario() {
    }

    public Usuario(String documento, String nombre, String apellido, String correo, String telefono) {
        this.documento = documento;
        this.nombre = nombre;
        this.apellido = apellido;
        this.correo = correo;
        this.telefono = telefono;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getDocumento() {
        return documento;
    }

    public void setDocumento(String documento) {
        this.documento = documento;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellido() {
        return apellido;
    }

    public void setApellido(String apellido) {
        this.apellido = apellido;
    }

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }
}
