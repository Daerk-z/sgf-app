import { useState } from "react";
import styles from "./Ventas.module.css";

// La tabla de ventas era una grilla de celdas vacías escritas a mano
// (7 filas x 8 columnas) en el HTML original; se genera con .map() en
// vez de repetir el mismo <div class="cell"> 56 veces.
const ROWS = 7;
const COLS = 8;

export function VentasPage() {
  // Input controlado: el original era un <input> plano sin lógica.
  // Se deja listo para conectar la búsqueda real más adelante.
  const [busqueda, setBusqueda] = useState("");

  return (
    <div className={styles.page}>
      <header className={styles.top}>
        <section className={styles.inputGroup}>
          <div className={styles.label}>ID de la factura actual de la venta</div>
          <input
            className={styles.search}
            type="text"
            placeholder="Lugar para código de barras ó nombre del medicamento a vender"
            aria-label="Código de barras o nombre del medicamento"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <button className={styles.ok} type="button">
            OK
          </button>
        </section>

        <section className={styles.previewWrap}>
          <div className={styles.previewCard}>
            Previsualización del medicamento en base al
            <br />
            código de barras
          </div>
        </section>
      </header>

      <section className={styles.bottom}>
        <div className={styles.facturaPill}>
          Factura física
          <br />
          del ID actual
        </div>

        <div className={styles.grid} role="table" aria-label="Tabla de ventas">
          {Array.from({ length: ROWS }, (_, row) => (
            <div key={row} className={styles.gridRow} role="row">
              {Array.from({ length: COLS }, (_, col) => (
                <div key={col} className={styles.cell} role="cell">
                  &nbsp;
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
