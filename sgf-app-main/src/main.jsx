import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from "react-router";
import './index.css'
import App from './App.jsx'
import { RegisterPage } from './pages/Register.page.jsx';
import { LoginPage } from './pages/Login.page.jsx';
import { DashboardPage } from './pages/Dashboard.page.jsx';
import { InicioPage } from './pages/Inicio.page.jsx';
import { VentasPage } from './pages/Ventas.page.jsx';
import { InventarioPage } from './pages/Inventario.page.jsx';
import { ExpedicionPage } from './pages/Expedicion.page.jsx';
import { PedidosPage } from './pages/Pedidos.page.jsx';
import { ConfiguracionPage } from './pages/Configuracion.page.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />

        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Antes era legacy/index.html: sidebar fijo + iframe cargando
            legacy/frames/*.html según el link clickeado. Ahora es un
            layout con rutas anidadas: DashboardPage pone el NavBar y
            un <Outlet /> donde cada subruta renderiza su página. */}
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
  </StrictMode>,
)
