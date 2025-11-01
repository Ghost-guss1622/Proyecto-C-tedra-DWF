import { useEffect, useState } from "react";
import { useAuth } from "../../Auth/AuthContext.jsx";   

const API = "http://localhost:8080/api";

export default function StockCount() {
    const { token } = useAuth();

    const [variants, setVariants] = useState([]);
    const [products, setProducts] = useState([]);
    const [message, setMessage] = useState(null);

    const [form, setForm] = useState({
        product_id: "",
        sku: "",
        size: "",
        color: "",
        price: "",
        cost: "",
        barcode: "",
        active: true
    });

    const getProductName = (productId) => {
        const product = products.find(p => p.id === productId);
        return product ? product.name : `ID: ${productId}`;
    };

    const loadProducts = async () => {
        const headers = {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            const res = await fetch(`${API}/products`, { headers }); // Enviar el token

            if (res.status === 401 || res.status === 403) {
                setMessage("❌ Error: Necesitas iniciar sesión para ver los productos.");
                setProducts([]);
                return;
            }
            const data = await res.json();
            setProducts(data);
        } catch (e) {
            setMessage("❌ Error al cargar productos.");
        }
    };

    const loadVariants = async () => {
        const headers = {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            const res = await fetch(`${API}/variants`, { headers }); // Enviar el token

            if (res.status === 401 || res.status === 403) {
                setMessage("❌ Error: Necesitas iniciar sesión para ver las variantes.");
                setVariants([]);
                return;
            }
            const data = await res.json();
            setVariants(data);
        } catch (e) {
            setMessage("❌ Error al cargar variantes.");
        }
    };

    useEffect(() => {
        if (token) {
            loadProducts();
            loadVariants();
        } else {
            setMessage("🟡 Esperando autenticación para cargar el inventario...");
        }
    }, [token]);

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

        const headers = {
            "Content-Type": "application/json"
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            const res = await fetch(`${API}/variants`, {
                method: "POST",
                headers: headers, // Usar los headers con el token
                body: JSON.stringify({
                    ...form,
                    product_id: Number(form.product_id),
                    price: Number(form.price) || 0,
                    cost: Number(form.cost) || 0
                })
            });

            const data = await res.json();

            if (res.status === 401 || res.status === 403) {
                setMessage("❌ Registro fallido: Permiso denegado.");
                return;
            }

            if (!res.ok) {
                setMessage("❌ " + data.message);
                return;
            }

            setMessage("✅ Variante registrada correctamente");
            loadVariants();

            setForm({
                product_id: "",
                sku: "",
                size: "",
                color: "",
                price: "",
                cost: "",
                barcode: "",
                active: true
            });

        } catch (error) {
            setMessage("❌ Error al registrar variante");
        }
    };

    return (
        <div style={{ padding: "20px", color: "white" }}>
            <h1>Conteo de Stock</h1>

            {message && <p>{message}</p>}

            <h2>Registrar Variante de Producto</h2>

            <form onSubmit={handleSubmit}
                  style={{
                      display: "grid",
                      gap: "10px",
                      background: "#333",
                      padding: "15px",
                      maxWidth: "450px",
                      borderRadius: "5px"
                  }}
            >
                <select
                    name="product_id"
                    value={form.product_id}
                    onChange={handleChange}
                    required
                >
                    <option value="">-- Seleccionar producto --</option>
                    {products.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                </select>

                <input name="sku" placeholder="SKU" value={form.sku} onChange={handleChange} required />
                <input name="size" placeholder="Talla / Size" value={form.size} onChange={handleChange} required />
                <input name="color" placeholder="Color" value={form.color} onChange={handleChange} required />

                <input
                    name="price"
                    type="number"
                    step="0.01"
                    placeholder="Precio"
                    value={form.price}
                    onChange={handleChange}
                    required
                />

                <input
                    name="cost"
                    type="number"
                    step="0.01"
                    placeholder="Costo"
                    value={form.cost}
                    onChange={handleChange}
                    required
                />

                <input name="barcode" placeholder="Código de barras" value={form.barcode} onChange={handleChange} />

                <label>
                    <input type="checkbox" name="active" checked={form.active} onChange={handleChange} />
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
                    Registrar Variante
                </button>
            </form>

            <h2>Variantes Registradas</h2>

            <table style={{ width: "100%", marginTop: "20px", borderCollapse: "collapse" }}>
                <thead>
                <tr style={{ background: "#333" }}>
                    <th>ID</th>
                    <th>Producto</th>
                    <th>SKU</th>
                    <th>Talla</th>
                    <th>Color</th>
                    <th>Precio</th>
                    <th>Costo</th>
                    <th>Activo</th>
                </tr>
                </thead>

                <tbody>
                {variants.map(v => (
                    <tr key={v.id}>
                        <td>{v.id}</td>
                        {/* 🛑 Mostrar el nombre del producto en lugar del ID */}
                        <td>{getProductName(v.product_id)}</td>
                        <td>{v.sku}</td>
                        <td>{v.size}</td>
                        <td>{v.color}</td>
                        <td>${v.price}</td>
                        <td>${v.cost}</td>
                        <td>{v.active ? "✅" : "❌"}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}