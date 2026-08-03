import { NavLink } from "react-router";
import styles from "./NavBar.module.css";

// Ítems de navegación principal ("General" en el HTML original).
// `end: true` en Inicio evita que NavLink lo marque activo cuando en
// realidad estamos en una subruta como /panel/ventas.
const mainNavItems = [
  { to: "/panel", icon: "fa-home", label: "Inicio", end: true },
  { to: "/panel/ventas", icon: "fa-chart-line", label: "Ventas" },
  { to: "/panel/inventario", icon: "fa-boxes", label: "Inventario" },
  { to: "/panel/expedicion", icon: "fa-truck", label: "Expedición" },
  { to: "/panel/pedidos", icon: "fa-clipboard-list", label: "Pedidos" },
];

// "Reportes y seguridad": en el HTML original son ítems informativos sin
// enlace (no tenían <a>), así que se quedan como texto, no como NavLink.
const reportItems = [
  { icon: "fa-exclamation-triangle", label: "Alertas sanitarias" },
  { icon: "fa-shield-alt", label: "Seguridad" },
];

function navItemClassName({ isActive }) {
  return isActive ? `${styles.navItem} ${styles.navItemActive}` : styles.navItem;
}

export function NavBar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.title}>
            <i className="fas fa-chart-bar" /> SGF
          </div>
          <hr className={styles.rule} />
        </div>

        <div className={styles.navSection}>
          <div className={styles.navSectionHeader}>General</div>
          <ul className={styles.navItems}>
            {mainNavItems.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} end={item.end} className={navItemClassName}>
                  <i className={`fas ${item.icon}`} /> {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.navSection}>
          <div className={styles.navSectionHeader}>Reportes y seguridad</div>
          <ul className={styles.subnav}>
            {reportItems.map((item) => (
              <li key={item.label} className={styles.subnavItem}>
                <i className={`fas ${item.icon}`} /> {item.label}
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.bottomBlock}>
          <hr className={styles.dividerLight} />
          <div className={styles.userProfile}>
            <div className={styles.userAvatar}>
              <i className="fas fa-user" />
            </div>
            <div className={styles.userInfo}>
              <div className={styles.userName}>Nombre del usuario</div>
              <div className={styles.userEmail}>
                <i className="fas fa-envelope" /> Correo@gmail.com
              </div>
            </div>
          </div>

          <ul className={styles.footerNav}>
            <li>
              <NavLink to="/panel/configuracion" className={styles.footerItem}>
                <i className="fas fa-cog" /> Configuración
              </NavLink>
            </li>
            <li>
              <NavLink to="/login" className={styles.footerItem}>
                <i className="fas fa-sign-out-alt" /> Salir
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
}
