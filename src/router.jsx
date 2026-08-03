import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { RegisterPage } from "./pages/Register.page.jsx";
import { LoginPage } from "./pages/Login.page.jsx";
import { DashboardPage } from "./pages/Dashboard.page.jsx";
import { InicioPage } from "./pages/Inicio.page.jsx";
import { VentasPage } from "./pages/Ventas.page.jsx";
import { InventarioPage } from "./pages/Inventario.page.jsx";
import { ExpedicionPage } from "./pages/Expedicion.page.jsx";
import { PedidosPage } from "./pages/Pedidos.page.jsx";
import { ConfiguracionPage } from "./pages/Configuracion.page.jsx";
import { NotFoundPage } from "./pages/NotFound.page.jsx";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* La raíz no tiene pantalla propia: redirige al login.
            `replace` evita dejar "/" en el historial, para que el botón
            atrás desde /login no rebote a la misma redirección. */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route path="/panel" element={<DashboardPage />}>
          <Route index element={<InicioPage />} />
          <Route path="ventas" element={<VentasPage />} />
          <Route path="inventario" element={<InventarioPage />} />
          <Route path="expedicion" element={<ExpedicionPage />} />
          <Route path="pedidos" element={<PedidosPage />} />
          <Route path="configuracion" element={<ConfiguracionPage />} />
        </Route>

        {/* Sin esta ruta, cualquier URL desconocida renderiza una página
            en blanco sin ningún mensaje. */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
