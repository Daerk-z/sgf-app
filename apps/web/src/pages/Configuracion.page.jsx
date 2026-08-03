import styles from "../css/pages/Configuracion.module.css";

const paletteColors = ["#111111", "#444444", "#666666", "#888888", "#d9d9d9"];

export function ConfiguracionPage() {
  return (
    <div className={styles.page}>
      <div className={styles.table}>
        {/* Configuración */}
        <section className={styles.row}>
          <div className={styles.cell}>
            <h2 className={styles.title}>Configuración</h2>
            <ul className={styles.list}>
              <li>* Mantener la última sesión abierta durante 24 horas</li>
              <li>Aceleración de hardware para mayor rendimiento</li>
              <li>* Prevención contra cuelgues o cierres inesperados</li>
              <li>Cambiar paleta de colores</li>
            </ul>
          </div>
          <div className={styles.cell}>
            <div className={styles.controls}>
              <div className={styles.pillSelect}>
                <span>Sí</span>
                <span>▼</span>
              </div>
              <div className={styles.pillSelect}>
                <span>Sí</span>
                <span>▼</span>
              </div>
              <div className={styles.pillSelect}>
                <span>Sí</span>
                <span>▼</span>
              </div>
              <div className={styles.palette}>
                {paletteColors.map((color, i) => (
                  <div
                    key={color}
                    className={i === 0 ? `${styles.paletteDot} ${styles.paletteDotActive}` : styles.paletteDot}
                    style={{ background: color }}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className={styles.spacer} />

        {/* Accesibilidad */}
        <section className={styles.row}>
          <div className={styles.cell}>
            <h2 className={styles.title}>Accesibilidad</h2>
            <ul className={styles.list}>
              <li>Cambiar texto por íconos</li>
            </ul>
          </div>
          <div className={styles.cell}>
            <div className={styles.controls}>
              <div className={styles.pillSelect}>
                <span>Sí</span>
                <span>▼</span>
              </div>
            </div>
          </div>
        </section>

        <div className={styles.spacer} />

        {/* Control general */}
        <section className={styles.row}>
          <div className={styles.cell}>
            <h2 className={styles.title}>Control general</h2>
            <ul className={styles.list}>
              <li>* Cada cuánto tiempo deberá eliminarse la DB de auditoría</li>
              <li>* Enlaces web para APIs de proveedor y alertas sanitarias</li>
            </ul>
          </div>
          <div className={styles.cell}>
            <div className={styles.controls}>
              <div className={styles.pillSelect}>
                <span>6M</span>
                <span>▼</span>
              </div>
              <div className={styles.linkPill}>Proveedor: https://wwww...</div>
              <div className={styles.linkPill}>Alertas: https://wwww...</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
