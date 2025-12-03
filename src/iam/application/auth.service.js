import { sendToBackend } from "../infrastructure/auth-api";

const API = "http://localhost:3000";

// Registro de usuario → guarda en db.json con plan incluido
export async function registerUser(form) {
    try {
        const res = await fetch(`${API}/users`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });
        if (!res.ok) {
            return { ok: false, message: "No se pudo registrar." };
        }
        const user = await res.json();

        // Guardamos sesión simulada
        localStorage.setItem("authToken", "fake-token");
        localStorage.setItem("userId", user.id);

        return { ok: true, user };
    } catch (err) {
        return { ok: false, message: "Error de conexión con el servidor." };
    }
}

// Login de usuario → valida contra db.json
export async function loginUser({ email, password }) {
    try {
        const res = await fetch(
            `${API}/users?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
        );
        const users = await res.json();
        if (!users.length) {
            return { ok: false, message: "Credenciales inválidas." };
        }
        const user = users[0];
        localStorage.setItem("authToken", "fake-token");
        localStorage.setItem("userId", user.id);
        return { ok: true, user };
    } catch (err) {
        return { ok: false, message: "Error de conexión con el servidor." };
    }
}

// Obtener usuario actual
export async function getCurrentUser() {
    const id = localStorage.getItem("userId");
    if (!id) return null;
    try {
        const res = await fetch(`${API}/users/${id}`);
        if (!res.ok) return null;
        return await res.json();
    } catch (err) {
        return null;
    }
}

// Actualizar perfil → teléfono, contraseña, imagen
export async function updateProfile({ phone, password, profilePicture }) {
    const id = localStorage.getItem("userId");
    if (!id) return { ok: false, message: "No autenticado." };

    const body = {};
    if (phone) body.phone = phone;
    if (password) body.password = password;
    if (profilePicture) body.profilePicture = profilePicture;

    try {
        const res = await fetch(`${API}/users/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        if (!res.ok) return { ok: false, message: "No se pudo actualizar el perfil." };
        return { ok: true };
    } catch (err) {
        return { ok: false, message: "Error de conexión con el servidor." };
    }
}

// Logout → limpia localStorage
export function logoutUser() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
}
