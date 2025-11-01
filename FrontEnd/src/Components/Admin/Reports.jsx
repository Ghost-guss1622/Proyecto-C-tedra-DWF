import { useEffect, useState } from "react";

export default function Reports() {
    return (
        <div style={{ padding: "20px", color: "white" }}>
            <h1>Reportes del Sistema</h1>

            <p>En esta sección podrás ver los reportes generados del inventario.</p>
            <ul>
                <li>📊 Productos más registrados</li>
                <li>📉 Productos inactivos</li>
                <li>📦 Movimientos recientes</li>
            </ul>

            <p>Los reportes avanzados serán añadidos en futuras versiones.</p>
        </div>
    );
}