// path: src/reservations/infrastructure/reservations-api.js
import { reservationFromDto, reservationToDto } from './reservation.assembler.js';
import { tableFromDto } from './table.assembler.js';

const reservationsEndpointPath =
    import.meta.env.VITE_RESERVATIONS_ENDPOINT_PATH || 'http://localhost:3000/reservations';
const tablesEndpointPath =
    import.meta.env.VITE_TABLES_ENDPOINT_PATH || 'http://localhost:3000/tables';

async function http(url, options = {}) {
    const res = await fetch(url, { headers: { 'Content-Type': 'application/json' }, ...options });
    if (!res.ok) {
        const text = await res.text().catch(()=>'');
        throw new Error(`HTTP ${res.status}: ${text}`);
    }
    if (res.status === 204) return null;
    return res.json();
}

export const ReservationsApi = {
    async listReservations(params = {}) {
        const query = new URLSearchParams(Object.entries(params).filter(([,v])=>v!=null && `${v}`.length>0)).toString();
        try {
            const data = await http(`${reservationsEndpointPath}${query ? `?${query}` : ''}`);
            return Array.isArray(data) ? data.map(reservationFromDto) : [];
        } catch (e) {
            console.warn('[API] listReservations fallback:', e.message);
            return [];
        }
    },
    async getReservation(id) {
        const data = await http(`${reservationsEndpointPath}/${id}`);
        return reservationFromDto(data);
    },
    async createReservation(entity) {
        const payload = reservationToDto(entity);
        try {
            const data = await http(reservationsEndpointPath, { method: 'POST', body: JSON.stringify(payload) });
            return reservationFromDto(data);
        } catch {
            throw new Error('No se pudo crear la reserva (backend no disponible).');
        }
    },
    async updateReservation(id, entity) {
        const payload = reservationToDto(entity);
        try {
            const data = await http(`${reservationsEndpointPath}/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
            return reservationFromDto(data);
        } catch {
            throw new Error('No se pudo actualizar la reserva (backend no disponible).');
        }
    },
    async removeReservation(id) {
        try {
            await http(`${reservationsEndpointPath}/${id}`, { method: 'DELETE' });
            return true;
        } catch {
            throw new Error('No se pudo eliminar (backend no disponible).');
        }
    },
    async listTables() {
        try {
            const data = await http(tablesEndpointPath);
            return Array.isArray(data) ? data.map(tableFromDto) : [];
        } catch (e) {
            console.warn('[API] listTables fallback:', e.message);
            return [];
        }
    },
};
