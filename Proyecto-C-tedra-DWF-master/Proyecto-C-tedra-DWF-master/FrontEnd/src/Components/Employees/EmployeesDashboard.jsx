import { useEffect, useState } from "react";
import { useAuth } from "../../Auth/AuthContext.jsx";

export default function EmployeesDashboard() {
    const { logout } = useAuth();
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8080/api/employees/tasks')
            .then(r => r.json())
            .then(setTasks)
            .catch(() => setTasks([]));
    }, []);

    return (
        <div className="p-10 space-y-4">
            <nav className="blockbar mb-4">
                <ul className="flex gap-4">
                    <li><a href="#">Registrar ventas</a></li>
                    <li><a href="#">Actualizar stock</a></li>
                    <li><a href="#">Ver productos</a></li>
                    <li><a href="#">Historial de ventas</a></li>
                    <li><a href="#">Alertas de stock</a></li>
                </ul>
            </nav>
            <h1 className="text-2xl font-bold">Panel de Empleado</h1>

            <div className="bg-white p-4 rounded shadow">
                <h2 className="font-bold text-lg">Tareas</h2>
                <ul className="list-disc pl-6">
                    {tasks.map(t => (
                        <li key={t.id}>{t.title}</li>
                    ))}
                </ul>
            </div>

            <button onClick={logout} className="px-6 py-2 bg-red-600 text-white rounded">
                Cerrar
            </button>
        </div>
    );
}