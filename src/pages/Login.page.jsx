import { useState } from "react";
import { useNavigate } from "react-router";
import styles from "../css/pages/Login.module.css";

const initialForm = { correo: "", contrasena: "" };

// El botón "Ingresar" solo navega sin validar (sin backend de auth todavía),
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
          <div className={styles.brandText}>
            <i className={`fas fa-chart-bar ${styles.icon}`} />
            <h1 className={styles.title}>SGF</h1>
          </div>
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

          {/* No navega a nada aún */}
          <button type="button" className={styles.link}>
            ¿Olvidó su contraseña?
          </button>

          <button type="submit" className={styles.button}>
            Ingresar
          </button>

          <button
            type="button"
            className={styles.buttonSecondary}
            onClick={() => navigate("/register")}
          >
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
}
