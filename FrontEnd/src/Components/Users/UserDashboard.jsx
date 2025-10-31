import { useEffect, useState } from "react";
import { useAuth } from "../../Auth/AuthContext.jsx";

export default function UserDashboard() {
    const { logout } = useAuth();
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        fetch('http://localhost:8080/api/user/profile', {
            headers: { Authorization: 'Bearer ' + localStorage.getItem('userToken') }
        })
            .then(r => r.json())
            .then(setProfile)
            .catch(() => setProfile(null));
    }, []);

    return (
        <div className="p-10 space-y-4">
            <h1 className="text-2xl font-bold">Panel de Cliente</h1>

            <div className="bg-white p-4 rounded shadow">
                {profile ? (
                    <div>
                        <p><b>Nombre:</b> {profile.name}</p>
                        <p><b>Email:</b> {profile.email}</p>
                    </div>
                ) : (
                    <p>Cargando...</p>
                )}
            </div>

            <button onClick={logout} className="px-6 py-2 bg-red-600 text-white rounded">
                Cerrar
            </button>
        </div>
    );
}