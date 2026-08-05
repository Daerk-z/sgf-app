package com.sgf;

import java.io.IOException;
import java.net.InetSocketAddress;

import com.sun.net.httpserver.HttpServer;

import com.sgf.web.ActualizarHandler;
import com.sgf.web.ArchivoEstaticoHandler;
import com.sgf.web.ConsultaHandler;
import com.sgf.web.EliminarHandler;
import com.sgf.web.RegistroHandler;

/**
 * Punto de entrada del programa.
 *
 * Levanta un servidor HTTP embebido (parte del propio JDK, com.sun.net.httpserver)
 * que sirve el formulario de registro de SGF y sus operaciones CRUD contra
 * la base de datos main_sgf. No requiere instalar Tomcat ni ningún otro
 * servidor de aplicaciones: basta con "java -jar sgf-registro.jar".
 */
public class ServidorSGF {

    private static final int PUERTO = 8080;

    public static void main(String[] args) throws IOException {
        HttpServer servidor = HttpServer.create(new InetSocketAddress(PUERTO), 0);

        servidor.createContext("/registro", new RegistroHandler());
        servidor.createContext("/consultar", new ConsultaHandler());
        servidor.createContext("/actualizar", new ActualizarHandler());
        servidor.createContext("/eliminar", new EliminarHandler());
        servidor.createContext("/", new ArchivoEstaticoHandler());

        servidor.setExecutor(null); // un hilo por petición; de sobra para pruebas locales
        servidor.start();

        System.out.println("Servidor SGF corriendo. Abre esto en el navegador:");
        System.out.println("  http://localhost:" + PUERTO + "/register.html");
        System.out.println("Presiona Ctrl+C para detenerlo.");
    }
}
