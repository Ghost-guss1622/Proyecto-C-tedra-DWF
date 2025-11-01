import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

import { AuthProvider, useAuth } from "./Auth/AuthContext.jsx";
import ProtectedRoute from "./Auth/ProtectedRoute.jsx";

import AdminDashboard from "./Components/Admin/AdminDashboard.jsx";
import EmployeesDashboard from "./Components/Employees/EmployeesDashboard.jsx";
import UserDashboard from "./Components/Users/UserDashboard.jsx";
import RegisterProduct from "./components/Admin/RegisterProduct.jsx";
import StockCount from "./components/Admin/StockCount.jsx";

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { isAuthenticated, login } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            const role = localStorage.getItem('userRole');
            if (role === 'ADMIN') navigate('/admin', { replace: true });
            else if (role === 'EMPLEADO') navigate('/employees', { replace: true });
            else if (role === 'CLIENTE') navigate('/user', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const res = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await res.json();

            if (res.ok) login(data.token, data.role.toUpperCase());
            else setError(data.error || 'Credenciales inválidas');
        } catch {
            setError('Error de conexión con el servidor.');
        }
    };

    if (isAuthenticated) return <div className="text-center p-8">Redirigiendo...</div>;

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white p-8 rounded-xl shadow-2xl space-y-6">
                <h2 className="text-3xl font-bold text-center text-indigo-700">La Puntada Login</h2>

                <input
                    type="text"
                    placeholder="Usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                />

                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                />

                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg">
                    Entrar
                </button>

                {error && (
                    <p className="text-red-600 text-sm text-center bg-red-100 p-2 rounded-lg border border-red-300">
                        {error}
                    </p>
                )}
            </form>
        </div>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<Login />} />

                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute allowedRoles={['ADMIN']}>
                                <AdminDashboard />

                            </ProtectedRoute>
                        }
                    />
                    <Route path="/admin/register-product" element={<RegisterProduct />} />
                    <Route
                        path="/admin/stock/stock-count" // <-- ¡Ruta nueva y única!
                        element={
                            <ProtectedRoute allowedRoles={['ADMIN', 'EMPLEADO']}>
                                <StockCount />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/employees"
                        element={
                            <ProtectedRoute allowedRoles={['EMPLEADO', 'ADMIN']}>
                                <EmployeesDashboard />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/user"
                        element={
                            <ProtectedRoute allowedRoles={['CLIENTE', 'EMPLEADO', 'ADMIN']}>
                                <UserDashboard />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}