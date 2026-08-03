import { useState } from "react";
import { useNavigate } from "react-router";
import styles from "./Login.module.css";

const initialForm = { correo: "", contrasena: "" };

// Migrado de legacy/inicio-sesion.html. El botón "Ingresar" original era
// un <a href="index.html">, es decir, no validaba nada, solo navegaba.
// Se mantiene ese mismo comportamiento (sin backend de auth todavía),
// pero como una navegación de react-router en vez de una recarga de página.
export function LoginPage() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.correo || !form.contrasena) {
      setError("Correo y contraseña son obligatorios");
      return;
    }
    setError("");
    navigate("/panel");
  };

  return (
    <div className={styles.screen}>
      <div className={styles.card}>
        <div className={styles.brand}>
          <i className={`fas fa-chart-bar ${styles.icon}`} />
          <h1 className={styles.title}>SGF</h1>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            type="email"
            name="correo"
            className={styles.input}
            placeholder="correo@gmail.com"
            value={form.correo}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="contrasena"
            className={styles.input}
            placeholder="contraseña123"
            value={form.contrasena}
            onChange={handleChange}
            required
          />

          {/* Antes era <a href="#">; sin destino real, un botón es el
              elemento correcto en vez de un enlace que no navega a nada */}
          <button type="button" className={styles.link}>
            ¿Olvidó su contraseña?
          </button>

          <button type="submit" className={styles.button}>
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
}
