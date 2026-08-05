package com.sgf.util;

/**
 * Genera el HTML de las páginas que devuelven los handlers (consulta,
 * edición, etc.), reutilizando el mismo estilo visual (tema oscuro) que
 * el resto de la app SGF.
 */
public class Vista {

    private static final String ESTILO =
        "body{margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;"
        + "background:#000000;color:#ffffff;padding:32px 16px;}"
        + ".contenedor{max-width:900px;margin:0 auto;}"
        + ".tarjeta{background:#282828;border-radius:24px;padding:32px 40px;}"
        + ".logo{display:flex;align-items:center;gap:8px;margin-bottom:4px;}"
        + ".logo-marca{width:10px;height:10px;border-radius:2px;background:#4a4a4a;}"
        + ".logo-texto{font-weight:700;font-size:14px;letter-spacing:.14em;color:#4a4a4a;}"
        + "h1{font-size:22px;margin:16px 0 18px;color:#ffffff;}"
        + "table{width:100%;border-collapse:collapse;font-size:14px;}"
        + "th,td{text-align:left;padding:12px 8px;border-bottom:1px solid #3a3a3a;color:#ffffff;}"
        + "th{color:#999999;font-size:12px;text-transform:uppercase;letter-spacing:.04em;}"
        + ".acciones{display:flex;gap:8px;}"
        + ".btn{display:inline-block;padding:8px 14px;border-radius:8px;font-size:13px;"
        + "font-weight:600;text-decoration:none;border:none;cursor:pointer;font-family:inherit;}"
        + ".btn-editar{background:#343434;color:#ffffff;}"
        + ".btn-eliminar{background:#3a2323;color:#ff8080;}"
        + ".btn-primario{background:#4a4a4a;color:#000000;padding:12px 18px;}"
        + ".btn-primario:hover{background:#5a5a5a;}"
        + "label{display:block;font-size:12px;color:#CCCCCC;margin-bottom:6px;}"
        + ".campo{margin-bottom:16px;}"
        + "input{width:100%;padding:14px 18px;border:none;border-radius:12px;"
        + "font-size:15px;font-family:inherit;color:#ffffff;background:#343434;box-sizing:border-box;}"
        + "input:focus{outline:none;background:#3a3a3a;}"
        + ".enlace-volver{color:#CCCCCC;font-size:13px;text-decoration:none;font-weight:600;}"
        + ".enlace-volver:hover{color:#ffffff;}"
        + ".barra-superior{display:flex;justify-content:space-between;align-items:center;margin-bottom:18px;}"
        + ".vacio{color:#999999;font-size:14px;padding:24px 0;text-align:center;}";

    private Vista() {
        // Clase utilitaria: no se instancia.
    }

    /**
     * Envuelve el contenido dado en una página HTML completa con el
     * estilo del sistema SGF.
     */
    public static String pagina(String titulo, String contenidoHtml) {
        StringBuilder html = new StringBuilder();
        html.append("<!DOCTYPE html><html lang='es'><head><meta charset='UTF-8'>");
        html.append("<meta name='viewport' content='width=device-width, initial-scale=1.0'>");
        html.append("<title>").append(titulo).append(" · SGF</title>");
        html.append("<link rel='icon' href='/assets/img/LogoSGF.png' type='image/png'>");
        html.append("<style>").append(ESTILO).append("</style></head><body>");
        html.append("<div class='contenedor'>");
        html.append("<div class='logo'><span class='logo-marca'></span><span class='logo-texto'>SGF</span></div>");
        html.append(contenidoHtml);
        html.append("</div></body></html>");
        return html.toString();
    }

    /** Escapa texto para insertarlo de forma segura dentro de HTML. */
    public static String escaparHtml(String texto) {
        if (texto == null) {
            return "";
        }
        return texto.replace("&", "&amp;")
                     .replace("<", "&lt;")
                     .replace(">", "&gt;")
                     .replace("\"", "&quot;");
    }
}
