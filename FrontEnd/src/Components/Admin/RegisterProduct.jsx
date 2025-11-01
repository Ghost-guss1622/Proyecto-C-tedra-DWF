import { useState, useEffect } from "react";

const API_BASE_URL = "http://localhost:8080/api";

export default function ProductList() {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null);

    const [form, setForm] = useState({
        name: "",
        description: "",
        category_id: "",
        active: true
    });

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        loadProducts();
        loadCategories();
    }, []);

    const loadProducts = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/products`);
            const data = await res.json();
            setProducts(data);
        } catch {
            setMessage("❌ Error al cargar productos");
        } finally {
            setLoading(false);
        }
    };

    const loadCategories = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/categories`);
            const data = await res.json();
            setCategories(data);
        } catch {
            setMessage("❌ Error al cargar categorías");
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setForm(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);

        if (!form.category_id) {
            setMessage("🔴 Selecciona una categoría");
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/products`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...form,
                    category_id: Number(form.category_id)
                })
            });

            const data = await res.json();

            if (!res.ok) {
                setMessage("❌ " + data.message);
                return;
            }

            setMessage(`✅ Producto '${form.name}' registrado`);
            setForm({ name: "", description: "", category_id: "", active: true });
            loadProducts();

        } catch (e) {
            setMessage("❌ Error al registrar");
        }
    };

    const deleteProduct = async (id) => {
        if (!window.confirm("¿Seguro que deseas eliminar este producto?")) return;

        try {
            const res = await fetch(`${API_BASE_URL}/products/${id}`, {
                method: "DELETE"
            });

            if (!res.ok) throw new Error();

            setMessage("✅ Producto eliminado");
            loadProducts();

        } catch {
            setMessage("❌ No se pudo eliminar");
        }
    };

    return (
        <div style={{ padding: "20px", background: "#222", color: "white" }}>

            <h1>Control de Productosa</h1>

            {message && <p>{message}</p>}

            <h2>Registrar Producto</h2>

            <form
                onSubmit={handleSubmit}
                style={{
                    display: "grid",
                    gap: "10px",
                    background: "#333",
                    padding: "15px",
                    borderRadius: "5px",
                    maxWidth: "400px",
                    marginBottom: "30px"
                }}
            >
                <input
                    name="name"
                    placeholder="Nombre"
                    value={form.name}
                    onChange={handleChange}
                    required
                />

                <textarea
                    name="description"
                    placeholder="Descripción"
                    value={form.description}
                    onChange={handleChange}
                    required
                />

                <select
                    name="category_id"
                    value={form.category_id}
                    onChange={handleChange}
                    required
                >
                    <option value="">-- Categoría --</option>
                    {categories.map(c => (
                        <option key={c.id} value={c.id}>
                            {c.name}
                        </option>
                    ))}
                </select>

                <label>
                    <input
                        type="checkbox"
                        name="active"
                        checked={form.active}
                        onChange={handleChange}
                    />
                    Activo
                </label>

                <button
                    type="submit"
                    style={{
                        padding: "10px",
                        background: "#4da3ff",
                        border: "none",
                        color: "white",
                        cursor: "pointer"
                    }}
                >
                    Registrar
                </button>
            </form>

            <h2>Lista de Productos</h2>

            {loading && <p>Cargando...</p>}

            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                <tr style={{ background: "#333" }}>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Categoría</th>
                    <th>Activo</th>
                    <th>Acción</th>
                </tr>
                </thead>

                <tbody>
                {products.map(p => (
                    <tr key={p.id}>
                        <td>{p.id}</td>
                        <td>{p.name}</td>
                        <td>{p.category_id}</td>
                        <td>{p.active ? "✅" : "❌"}</td>
                        <td>
                            <button
                                onClick={() => deleteProduct(p.id)}
                                style={{
                                    color: "red",
                                    background: "transparent",
                                    border: "none",
                                    cursor: "pointer"
                                }}
                            >
                                Eliminar
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <a href="/admin" style={{ color: "#4da3ff", display: "block", marginTop: "20px" }}>
                Volver al panel
            </a>

        </div>
    );
}
