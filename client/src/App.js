import { Routes, Navigate, Route } from "react-router-dom";
import AuthMiddleware from "./middlewares/AuthMiddleware";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Home from "./pages/Home";
import User from "./pages/auth/User";
import PersistLogin from "./components/PersistLogin";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/dashboard/Dashboard";
import FinanceAI from "./pages/finance-ai/FinanceAI";
import CargaMaterialBoston from "./pages/boston/CargaMaterialBoston";
import ResumenCargaTXT from "./pages/boston/ResumenCargaTXT";
import AgregarProductos from "./pages/boston/AgregarProductos";
import AgregarClientes from "./pages/boston/AgregarClientes";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<PersistLogin />}>
          <Route index exact element={<Home />}></Route>
          <Route path="/auth">
            <Route path="login" element={<Login />}></Route>

            <Route path="user" element={<AuthMiddleware />}>
              <Route index element={<User />}></Route>
              <Route path="register" element={<Register />}></Route>

              <Route path="dashboard" element={<Dashboard />} />
              <Route path="finance-ai" element={<FinanceAI />} />
              <Route path="boston" element={<CargaMaterialBoston />} />
              <Route path="resumen-carga" element={<ResumenCargaTXT />} />
              <Route path="carga-productos" element={<AgregarProductos />} />
              <Route path="carga-clientes" element={<AgregarClientes />} />
              <Route path="user" element={<User />} />
            </Route>
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" />}></Route>
      </Routes>
    </>
  );
}

export default App;
