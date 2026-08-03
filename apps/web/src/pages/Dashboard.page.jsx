import { Outlet } from "react-router";
import { NavBar } from "../components/NavBar.component";
import styles from "../css/pages/Dashboard.module.css";

// Migrado de legacy/index.html. El <iframe name="sgf-frame"> que cargaba
// contenido.html según el link del sidebar se reemplaza por rutas
// anidadas de react-router: cada opción del NavBar navega a una
// subruta de /panel y el <Outlet /> renderiza la página correspondiente
// aquí mismo, sin recargar documentos HTML sueltos.
export function DashboardPage() {
  return (
    <div className={styles.appLayout}>
      <NavBar />
      <main className={styles.main}>
        <div className={styles.frame}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
