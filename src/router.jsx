import { BrowserRouter, Route, Routes } from "react-router";
import App from "./App.jsx";
import { RegisterPage } from "./pages/Register.page.jsx";
import { LoginPage } from "./pages/Login.page.jsx";
import { DashboardPage } from "./pages/Dashboard.page.jsx";
import { InicioPage } from "./pages/Inicio.page.jsx";
import { VentasPage } from "./pages/Ventas.page.jsx";
import { InventarioPage } from "./pages/Inventario.page.jsx";
import { ExpedicionPage } from "./pages/Expedicion.page.jsx";
import { PedidosPage } from "./pages/Pedidos.page.jsx";
import { ConfiguracionPage } from "./pages/Configuracion.page.jsx";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />

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
      </Routes>
    </BrowserRouter>
  );
}
