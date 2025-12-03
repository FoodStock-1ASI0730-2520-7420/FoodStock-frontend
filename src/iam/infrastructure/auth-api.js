// src/iam/infrastructure/auth-api.js
const API = "https://app-251202235518.azurewebsites.net/api/v1";

export async function sendToBackend(endpoint, method = "POST", body = {}) {
    try {
        const res = await fetch(`${API}/${endpoint}`, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        if (!res.ok) {
            return { ok: false, message: `Error en ${method} ${endpoint}` };
        }
        const data = await res.json();
        return { ok: true, data };
    } catch (err) {
        return { ok: false, message: "Error de conexión con el servidor." };
    }
}
