// path: src/reservations/infrastructure/reservations-api.js
import { reservationFromDto, reservationToDto } from "./reservation.assembler.js";

const base = import.meta.env.VITE_RESERVATIONS_ENDPOINT_PATH || "http://localhost:3000/reservations";

async function http(url, options = {}) {
    const res = await fetch(url, { headers: { "Content-Type": "application/json" }, ...options });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.status === 204 ? null : res.json();
}

export const ReservationsApi = {
    async listReservations() {
        const data = await http(base);
        return data.map(reservationFromDto);
    },

    async createReservation(entity) {
        const payload = reservationToDto(entity);
        return reservationFromDto(await http(base, {
            method: "POST",
            body: JSON.stringify(payload)
        }));
    },

    async updateReservation(id, entity) {
        const payload = reservationToDto(entity);
        return reservationFromDto(await http(`${base}/${id}`, {
            method: "PUT",
            body: JSON.stringify(payload)
        }));
    },

    async removeReservation(id) {
        await http(`${base}/${id}`, { method: "DELETE" });
    }
};
