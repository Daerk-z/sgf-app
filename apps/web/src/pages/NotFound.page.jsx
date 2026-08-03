import { Link } from "react-router";
import styles from "../css/pages/NotFound.module.css";

export function NotFoundPage() {
  return (
    <div className={styles.screen}>
      <div className={styles.card}>
        <p className={styles.code}>404</p>
        <h1 className={styles.title}>Página no encontrada</h1>
        <p className={styles.text}>
          La dirección que abrió no existe o fue movida.
        </p>
        <Link to="/login" className={styles.button}>
          Volver al inicio de sesión
        </Link>
      </div>
    </div>
  );
}
