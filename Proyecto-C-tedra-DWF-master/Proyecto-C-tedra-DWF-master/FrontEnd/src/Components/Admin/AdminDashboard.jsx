import { useAuth } from "../../Auth/AuthContext.jsx";

import UsersCRUD from "./UsersCRUD";
function AdminDashboard() {
  return (
    <div>
      <h1>Dashboard Admin</h1>
      <UsersCRUD />
    </div>
  );
export default AdminDashboard;
}

export default function AdminDashboard() {
    const { logout } = useAuth();

    return (
        <div style={{ padding: "20px" }}>
            <nav className="blockbar">
                <ul>
                    <li><a href="/admin/register-product">Registrar productos</a></li>
                    <li><a href="/admin/stock-count">Conteo de stock</a></li>
                    <li><a href="/admin/users">Ver usuarios</a></li>
                    <li><a href="/admin/reports">Reportes</a></li>
                    <li><a href="/admin/about">Quienes somos</a></li>
                </ul>
            </nav>

            <h1>Panel de Administrador</h1>
            <p>Aquí puedes ver información general del sistema.</p>

            <hr />

            <h2>Información del sistema</h2>
            <p><b>Usuarios activos:</b> 12</p>
            <p><b>Stock total estimado:</b> 1480 unidades</p>

            <hr />

            <h2>¿Quiénes somos?</h2>
            <p>
                La Puntada es un sistema pensado para facilitar el control de inventario,
                administración de productos y gestión general dentro de la empresa.
            </p>

            <br />
            <button onClick={logout}>Cerrar sesión</button>

        </div>
    );
}