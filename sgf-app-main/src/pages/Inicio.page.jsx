import styles from "./Inicio.module.css";

// Contenido de ejemplo/mock igual al del HTML original (todavía no hay
// datos reales conectados). Se modela como arrays en vez de repetir el
// mismo bloque JSX a mano, así los 3 pills / 5 alertas / 3 filas por
// tarjeta salen de un único `.map()` con su `key`.
const news = ["Noticia de ejemplo", "Noticia de ejemplo", "Noticia de ejemplo"];

const alertasSanitarias = [
  "Texto sobre alerta de algún módulo",
  "Texto sobre alerta de algún módulo",
  "Texto sobre alerta de algún módulo",
  "Texto sobre alerta de algún módulo",
  "Texto sobre alerta de algún módulo",
];

const vencimientoInfo = ["Información", "Información", "Información"];
const stockInfo = ["Información", "Información", "Información"];

export function InicioPage() {
  return (
    <div className={styles.page}>
      {/* Fila superior: noticias + alertas sanitarias */}
      <section className={styles.top}>
        <div className={styles.newsCard}>
          <h2 className={styles.newsTitle}>Noticias recientes</h2>
          <div className={styles.newsContent}>
            <div className={styles.newsButtons}>
              {news.map((_, i) => (
                <button key={i} className={styles.newsPill} type="button" />
              ))}
            </div>
            <div className={styles.newsList}>
              {news.map((item, i) => (
                <span key={i} className={styles.newsItem}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        <aside className={styles.alertasCol}>
          <h3 className={styles.alertasTitle}>Alertas sanitarias</h3>
          <ul className={styles.alertasList}>
            {alertasSanitarias.map((text, i) => (
              <li key={i} className={styles.alertasItem}>
                <span className={styles.alertDot} />
                <span className={styles.alertText}>{text}</span>
              </li>
            ))}
          </ul>
        </aside>
      </section>

      {/* Fila inferior: alertas de vencimiento / stock */}
      <section className={styles.bottom}>
        <div className={styles.alertCard}>
          <h2 className={styles.alertTitle}>Alertas de vencimiento</h2>
          <div className={styles.alertBody}>
            <div className={styles.alertList}>
              {vencimientoInfo.map((label, i) => (
                <div key={i} className={styles.alertRow}>
                  <span className={styles.alertDot} />
                  <span className={styles.alertLabel}>{label}</span>
                </div>
              ))}
            </div>
            <button className={styles.alertCta} type="button">
              Ir a
              <br />
              Expedición
            </button>
          </div>
        </div>

        <div className={styles.alertCard}>
          <h2 className={styles.alertTitle}>Alertas de Stock</h2>
          <div className={styles.alertBody}>
            <div className={styles.alertList}>
              {stockInfo.map((label, i) => (
                <div key={i} className={styles.alertRow}>
                  <span className={styles.alertDot} />
                  <span className={styles.alertLabel}>{label}</span>
                </div>
              ))}
            </div>
            <button className={styles.alertCta} type="button">
              Ir a
              <br />
              Inventario
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
