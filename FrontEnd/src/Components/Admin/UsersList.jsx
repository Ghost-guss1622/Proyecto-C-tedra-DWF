import { useEffect, useState } from "react";

export default function UsersList() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8080/api/users")
            .then(res => res.json())
            .then(data => setUsers(data));
    }, []);

    return (
        <div style={{ padding: "20px", color: "white" }}>
            <h1>Usuarios Registrados</h1>

            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                <tr style={{ background: "#333" }}>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Username</th>
                    <th>Rol</th>
                </tr>
                </thead>

                <tbody>
                {users.map(u => (
                    <tr key={u.id}>
                        <td>{u.id}</td>
                        <td>{u.nombre} {u.apellido}</td>
                        <td>{u.username}</td>
                        <td>{u.rol}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
