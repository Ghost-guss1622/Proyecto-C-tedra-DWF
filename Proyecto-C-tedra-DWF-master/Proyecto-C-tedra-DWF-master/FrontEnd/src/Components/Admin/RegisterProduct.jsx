import { useState, useEffect } from "react";

export default function RegisterProduct() {

    // --- ESTADOS DEL FORMULARIO ---
    const [form, setForm] = useState({
        name: "",
        description: "",
        category_id: "",
        active: true
    });

    const [message, setMessage] = useState(""); // Mensajes de éxito/error
    const [categories, setCategories] = useState([]); // Lista de categorías
    const [loadingCategories, setLoadingCategories] = useState(true); // Estado de carga
    const [categoryError, setCategoryError] = useState(null); // Error al cargar categorías

    // --- FUNCION PARA CARGAR CATEGORÍAS DESDE LA API ---
    useEffect(() => {
        const fetchCategories = async () => {
            setLoadingCategories(true);
            setCategoryError(null);
            try {
                const API_URL = "http://localhost:8080/api/categories";
                const res = await fetch(API_URL);

                if (!res.ok) {
                    throw new Error(`Error HTTP: ${res.status}. Verifica tu servidor.`);
                }

                const data = await res.json();

                if (Array.isArray(data)) {
                    setCategories(data);
                } else {
                    throw new Error("Formato de datos incorrecto.");
                }

            } catch (error) {
                console.error("Error al cargar categorías:", error);
                setCategoryError(`No se pudieron cargar las categorías: ${error.message}`);
            } finally {
                setLoadingCategories(false);
            }
        };

        fetchCategories();
    }, []);

    // --- MANEJADOR DE CAMBIOS EN INPUTS ---
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({
            ...form,
            [name]: type === "checkbox" ? checked : value
        });
    };

    // --- MANEJADOR DE ENVÍO DEL FORMULARIO ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        if (!form.category_id) {
            setMessage("Por favor, selecciona una categoría.");
            return;
        }

        try {
            const res = await fetch("http://localhost:8080/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });

            // Si la respuesta no es OK
            if (!res.ok) {
                let errorMessage = "Error al registrar producto";
                try {
                    const errorData = await res.json();
                    errorMessage = errorData.message || errorMessage;
                } catch {
                }
                throw new Error(errorMessage);
            }

            const data = await res.json();
            setMessage(`✅ Producto registrado correctamente: ${data.name}`);
            setForm({ name: "", description: "", category_id: "", active: true });

        } catch (error) {
            setMessage(`❌ Error al registrar producto: ${error.message || 'Intente de nuevo.'}`);
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1>Registrar Producto</h1>
            <form onSubmit={handleSubmit}>
                <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Nombre del Producto"
                    required
                />
                <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Descripción del Producto"
                    required
                />

                {loadingCategories ? (
                    <p>Cargando categorías...</p>
                ) : categoryError ? (
                    <p style={{ color: 'red', fontWeight: 'bold' }}>{categoryError}</p>
                ) : categories.length === 0 ? (
                    <p>No hay categorías disponibles.</p>
                ) : (
                    <select
                        name="category_id"
                        value={form.category_id}
                        onChange={handleChange}
                        required
                    >
                        <option value="" disabled>Selecciona una Categoría</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                )}

                <label style={{ display: 'block', margin: '10px 0' }}>
                    Activo:
                    <input
                        type="checkbox"
                        name="active"
                        checked={form.active}
                        onChange={handleChange}
                        style={{ marginLeft: '10px' }}
                    />
                </label>

                <button
                    type="submit"
                    disabled={loadingCategories || categoryError || categories.length === 0}
                >
                    Registrar Producto
                </button>
            </form>

            {message && <p style={{ marginTop: '15px', fontWeight: 'bold' }}>{message}</p>}

            <a href="/admin" style={{ display: 'block', marginTop: '20px' }}>Volver al panel</a>
        </div>
    );
}
