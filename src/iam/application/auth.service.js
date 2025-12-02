// src/iam/application/auth.service.js
export async function registerUser(form) {
    localStorage.setItem('tempUser', JSON.stringify(form));
    return true;
}

export async function loginUser({ email, password }) {
    const user = JSON.parse(localStorage.getItem('tempUser'));
    if (!user || user.email !== email || user.password !== password) {
        return { ok: false, message: 'Credenciales inválidas' };
    }
    localStorage.setItem('authToken', 'fake-token');
    localStorage.setItem('userEmail', email);
    return { ok: true };
}

export function logoutUser() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
}
