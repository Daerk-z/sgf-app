package com.sgf.db;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * Centraliza la conexión JDBC a la base de datos del sistema SGF.
 * Soporta MySQL y PostgreSQL: cambia MOTOR_ACTIVO para elegir el motor.
 */
public class ConexionBD {

    public enum MotorBD {
        MYSQL,
        POSTGRESQL
    }

    // Cambia esta constante para elegir qué motor usar
    private static final MotorBD MOTOR_ACTIVO = MotorBD.POSTGRESQL;

    // --- Configuración MySQL ---
    private static final String MYSQL_URL = "jdbc:mysql://localhost:3306/main_sgf?useSSL=false&serverTimezone=UTC";
    private static final String MYSQL_USUARIO = "root";
    private static final String MYSQL_CONTRASENA = "3222942283Cbjm__";

    // --- Configuración PostgreSQL ---
    private static final String POSTGRES_URL = "jdbc:postgresql://localhost:5432/proyecto?currentSchema=sgf2";
    private static final String POSTGRES_USUARIO = "DaerK";
    private static final String POSTGRES_CONTRASENA = "3203102882";

    static {
        try {
            if (MOTOR_ACTIVO == MotorBD.MYSQL) {
                Class.forName("com.mysql.cj.jdbc.Driver");
            } else if (MOTOR_ACTIVO == MotorBD.POSTGRESQL) {
                Class.forName("org.postgresql.Driver");
            }
        } catch (ClassNotFoundException e) {
            throw new RuntimeException(
                    "No se encontró el driver JDBC para " + MOTOR_ACTIVO
                            + ". Verifica la dependencia en el pom.xml.", e);
        }
    }

    private ConexionBD() {
        // Clase utilitaria: no se instancia.
    }

    public static Connection obtenerConexion() throws SQLException {
        if (MOTOR_ACTIVO == MotorBD.MYSQL) {
            return DriverManager.getConnection(MYSQL_URL, MYSQL_USUARIO, MYSQL_CONTRASENA);
        } else {
            return DriverManager.getConnection(POSTGRES_URL, POSTGRES_USUARIO, POSTGRES_CONTRASENA);
        }
    }
}