
// path: src/reservations/application/reservations.store.js

import { ReservationsApi } from '../infrastructure/reservations-api.js';
import { Reservation } from '../domain/model/reservation.entity.js';

const DEFAULT_DURATION = Number(import.meta.env.VITE_RESERVATION_DEFAULT_DURATION_MIN ?? 120);

function toMinutes(hhmm) {
    if (!hhmm) return 0;
    const [h, m] = hhmm.split(':').map(Number);
    return h * 60 + m;
}
function overlaps(aStart, aEnd, bStart, bEnd) { return aStart < bEnd && bStart < aEnd; }
function fmtDate(d) { return d.toISOString().slice(0, 10); }
function fmtTime(d) { return d.toTimeString().slice(0, 5); }
const getId = (r) => r?.idReservation ?? r?.id ?? null;

export const reservationsStore = {
    state: {
        reservations: [],
        tables: [],
        loading: false,
        filters: { date: null, time: null, durationMinutes: DEFAULT_DURATION },
    },

    async loadAll() {
        this.state.loading = true;
        try {
            const [tables, reservations] = await Promise.all([
                ReservationsApi.listTables(),
                ReservationsApi.listReservations(),
            ]);

            this.state.tables = (tables || []).map((t) => ({
                ...t, number: Number(t.number), capacity: Number(t.capacity),
            }));

            this.state.reservations = (reservations || []).map((r) => ({
                ...r,
                tableNumber: Number(r.tableNumber),
                durationMinutes: Number(r.durationMinutes || DEFAULT_DURATION),
            }));
        } finally {
            this.state.loading = false;
        }
    },

    isTableAvailable({ date, time, tableNumber, durationMinutes = DEFAULT_DURATION, excludeId = null }) {
        const start = toMinutes(time);
        const end = start + durationMinutes;
        const sameDay = this.state.reservations.filter(
            (r) =>
                r.reservationDate === date &&
                r.tableNumber === Number(tableNumber) &&
                r.status !== 'canceled' &&
                r.status !== 'completed',
        );
        return !sameDay.some((r) => {
            const rid = getId(r);
            if (excludeId && rid === excludeId) return false;
            const rStart = toMinutes(r.reservationTime);
            const rEnd = rStart + (r.durationMinutes || DEFAULT_DURATION);
            return overlaps(start, end, rStart, rEnd);
        });
    },

    availableTables({ date, time, quantityPeople, durationMinutes = DEFAULT_DURATION, excludeId = null }) {
        return this.state.tables.filter(
            (t) =>
                t.capacity >= Number(quantityPeople) &&
                this.isTableAvailable({ date, time, tableNumber: t.number, durationMinutes, excludeId }),
        );
    },

    async createReservation(payload) {
        const now = new Date();
        const entity = new Reservation({
            idReservation: null,
            tableNumber: Number(payload.tableNumber),
            quantityPeople: Number(payload.quantityPeople),
            reservationDate: payload.reservationDate,
            reservationTime: payload.reservationTime,
            creationDate: fmtDate(now),
            creationTime: fmtTime(now),
            durationMinutes: Number(payload.durationMinutes || DEFAULT_DURATION),
            status: 'scheduled',
            customerName: payload.customerName || '',
            customerPhone: payload.customerPhone || '',
        });

        const table = this.state.tables.find((t) => t.number === entity.tableNumber);
        if (!table) throw new Error('La mesa no existe');
        if (entity.quantityPeople > table.capacity) throw new Error('La mesa no soporta esa cantidad de personas');

        const available = this.isTableAvailable({
            date: entity.reservationDate,
            time: entity.reservationTime,
            tableNumber: entity.tableNumber,
            durationMinutes: entity.durationMinutes,
        });
        if (!available) throw new Error('Horario no disponible para esa mesa');

        const saved = await ReservationsApi.createReservation(entity);
        this.state.reservations = [...this.state.reservations, saved];
        return saved;
    },

    async editReservation(id, payload) {
        const existing = this.state.reservations.find((r) => getId(r) === id);
        if (!existing) throw new Error('Reserva no encontrada');

        const updated = new Reservation({
            ...existing,
            ...payload,
            idReservation: getId(existing),
            tableNumber: Number(payload.tableNumber ?? existing.tableNumber),
            quantityPeople: Number(payload.quantityPeople ?? existing.quantityPeople),
            durationMinutes: Number(payload.durationMinutes ?? existing.durationMinutes),
        });

        const ok = this.isTableAvailable({
            date: updated.reservationDate,
            time: updated.reservationTime,
            tableNumber: updated.tableNumber,
            durationMinutes: updated.durationMinutes,
            excludeId: updated.idReservation,
        });
        if (!ok) throw new Error('Conflicto de horario/mesa');

        const saved = await ReservationsApi.updateReservation(updated.idReservation, updated);
        this.state.reservations = this.state.reservations.map((r) => (getId(r) === getId(saved) ? saved : r));
        return saved;
    },

    async cancelReservation(id) {
        const r = this.state.reservations.find((x) => getId(x) === id);
        if (!r) throw new Error('Reserva no encontrada');
        const updated = new Reservation({ ...r, status: 'canceled' });
        const saved = await ReservationsApi.updateReservation(getId(updated), updated);
        this.state.reservations = this.state.reservations.map((x) => (getId(x) === id ? saved : x));
        return saved;
    },

    async deleteReservation(id) {
        await ReservationsApi.removeReservation(id);
        this.state.reservations = this.state.reservations.filter((r) => getId(r) !== id);
    },

    async autoCompleteAndCleanup({ deleteCompleted = false } = {}) {
        const now = new Date();
        for (const r of this.state.reservations) {
            const start = new Date(`${r.reservationDate}T${r.reservationTime}${r.reservationTime?.length === 5 ? ':00' : ''}`);
            const end = new Date(start.getTime() + (r.durationMinutes || DEFAULT_DURATION) * 60000);
            const ended = now >= end;
            if (ended && r.status !== 'completed' && r.status !== 'canceled') {
                const updated = new Reservation({ ...r, status: 'completed' });
                await ReservationsApi.updateReservation(getId(updated), updated);
            }
        }
        await this.loadAll();
        if (deleteCompleted) {
            for (const r of this.state.reservations.filter((x) => x.status === 'completed')) {
                await this.deleteReservation(getId(r));
            }
        }
    },
};