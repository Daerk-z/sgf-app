import { useState } from "react";
import styles from "../css/pages/Inventario.module.css";

// Grilla de 6 filas x 8 columnas
const ROWS = 6;
const COLS = 8;

export function InventarioPage() {
  const [busqueda, setBusqueda] = useState("");

  return (
    <div className={styles.page}>
      <header className={styles.top}>
        <input
          type="text"
          className={styles.search}
          placeholder="Buscar por nombre o código de barras"
          aria-label="Buscar por nombre o código de barras"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </header>

      <section className={styles.bottom}>
        <div className={styles.grid} role="table" aria-label="Tabla de inventario">
          {Array.from({ length: ROWS }, (_, row) => (
            <div key={row} className={styles.gridRow} role="row">
              {Array.from({ length: COLS }, (_, col) => (
                <div key={col} className={styles.cell} role="cell" />
              ))}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
