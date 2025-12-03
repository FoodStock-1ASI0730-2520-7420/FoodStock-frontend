// path: src/reservations/application/reservations.store.js
import { ReservationsApi } from "../infrastructure/reservations-api.js";
import { Reservation } from "../domain/model/reservation.entity.js";
import { tablesStore } from "./tables.store.js";

/** Lee duración por defecto (min) desde env, con fallback seguro. */
const DEFAULT_DURATION_MIN = Number(
    (import.meta?.env?.VITE_RESERVATION_DEFAULT_DURATION_MIN ?? 120)
);

/** ----- Utilidades de tiempo/fechas ----- */

/** @param {string} hhmm - "HH:MM" en 24h */
function isValidHHMM(hhmm) {
    // Por qué: evita soltar reservas con horas mal formadas.
    return /^[0-2]\d:[0-5]\d$/.test(hhmm) && Number(hhmm.slice(0, 2)) < 24;
}

/** @param {string} hhmm */
function toMinutes(hhmm) {
    const [h, m] = hhmm.split(":").map(Number);
    return h * 60 + m;
}

/** [aStart,aEnd) overlap [bStart,bEnd) */
function overlaps(aStart, aEnd, bStart, bEnd) {
    return aStart < bEnd && bStart < aEnd;
}

function fmtDate(d) {
    return d.toISOString().slice(0, 10);
}
function fmtTime(d) {
    return d.toTimeString().slice(0, 5);
}

/** Coerce num seguro */
function toNumberOrThrow(val, msg) {
    const n = Number(val);
    if (Number.isNaN(n)) throw new Error(msg);
    return n;
}

/** Normaliza una reserva a tipos consistentes. */
function normalizeReservation(r) {
    const duration =
        r.durationMinutes != null && !Number.isNaN(Number(r.durationMinutes))
            ? Number(r.durationMinutes)
            : DEFAULT_DURATION_MIN;

    return {
        ...r,
        id: r.id ?? r.idReservation ?? r.uuid ?? String(r?.id ?? r?.idReservation ?? ""),
        idReservation: r.idReservation ?? r.id ?? null,
        tableNumber: Number(r.tableNumber),
        quantityPeople: Number(r.quantityPeople),
        durationMinutes: duration,
        reservationDate: r.reservationDate, // "YYYY-MM-DD"
        reservationTime: r.reservationTime, // "HH:MM"
        status: r.status ?? "scheduled",
    };
}

/** Valida forma mínima del payload de creación/edición. */
function validateReservationInput(payload) {
    if (!payload) throw new Error("Payload requerido");
    const {
        reservationDate,
        reservationTime,
        tableNumber,
        quantityPeople,
        durationMinutes,
    } = payload;

    if (!reservationDate) throw new Error("Fecha de reserva requerida");
    if (!reservationTime) throw new Error("Hora de reserva requerida");
    if (!isValidHHMM(reservationTime)) throw new Error("Formato de hora inválido (HH:MM)");

    toNumberOrThrow(tableNumber, "Número de mesa inválido");
    toNumberOrThrow(quantityPeople, "Cantidad de personas inválida");

    if (
        durationMinutes != null &&
        (Number.isNaN(Number(durationMinutes)) || Number(durationMinutes) <= 0)
    ) {
        throw new Error("Duración inválida");
    }
}

export const reservationsStore = {
    /** Estado reactivo mínimo */
    state: {
        reservations: /** @type {Array<any>} */ ([]),
        loading: false,
        error: null,
        filters: /** @type {{date: string|null, time: string|null, durationMinutes: number}} */ ({
            date: null,
            time: null,
            durationMinutes: DEFAULT_DURATION_MIN,
        }),
    },

    /** Carga todas las mesas y reservas. */
    async loadAll() {
        this.state.loading = true;
        this.state.error = null;
        try {
            await tablesStore.loadTables();
            const reservations = await ReservationsApi.listReservations();
            this.state.reservations = reservations.map(normalizeReservation);
        } catch (err) {
            this.state.error = err instanceof Error ? err.message : "Error al cargar reservas";
            throw err;
        } finally {
            this.state.loading = false;
        }
    },

    /** Set parcial de filtros. */
    setFilters(partial) {
        this.state.filters = {
            ...this.state.filters,
            ...partial,
        };
    },

    /** Limpia filtros a defaults. */
    clearFilters() {
        this.state.filters = {
            date: null,
            time: null,
            durationMinutes: DEFAULT_DURATION_MIN,
        };
    },

    /** Devuelve reservas filtradas en memoria (básico y rápido). */
    getFiltered() {
        const { date, time, durationMinutes } = this.state.filters;
        return this.state.reservations.filter((r) => {
            if (date && r.reservationDate !== date) return false;
            if (time) {
                if (!isValidHHMM(time)) return false;
                const s1 = toMinutes(time);
                const e1 = s1 + (durationMinutes ?? DEFAULT_DURATION_MIN);
                const s2 = toMinutes(r.reservationTime);
                const e2 = s2 + r.durationMinutes;
                if (!overlaps(s1, e1, s2, e2)) return false;
            }
            return true;
        });
    },

    /**
     * Chequea disponibilidad de mesa.
     * @param {{date:string,time:string,tableNumber:number|string,durationMinutes:number}} input
     * @param {{excludeId?:string|number}} [opts]
     */
    isTableAvailable(input, opts = {}) {
        validateReservationInput({
            reservationDate: input.date,
            reservationTime: input.time,
            tableNumber: input.tableNumber,
            quantityPeople: 1,
            durationMinutes: input.durationMinutes,
        });

        const tableNumber = Number(input.tableNumber);
        const start = toMinutes(input.time);
        const end = start + Number(input.durationMinutes ?? DEFAULT_DURATION_MIN);
        const excludeId = opts.excludeId != null ? String(opts.excludeId) : null;

        const sameDay = this.state.reservations.filter(
            (r) =>
                r.tableNumber === tableNumber &&
                r.reservationDate === input.date &&
                r.status !== "canceled" &&
                (excludeId ? String(r.id ?? r.idReservation) !== excludeId : true)
        );

        return !sameDay.some((r) => {
            const rStart = toMinutes(r.reservationTime);
            const rEnd = rStart + r.durationMinutes;
            return overlaps(start, end, rStart, rEnd);
        });
    },

    /** Crea una reserva nueva. */
    async createReservation(payload) {
        validateReservationInput(payload);

        const tableNumber = Number(payload.tableNumber);
        const people = Number(payload.quantityPeople);
        const table = tablesStore.state.tables.find((t) => t.number === tableNumber);

        if (!table) throw new Error("La mesa no existe");
        if (people > Number(table.capacity)) throw new Error("Capacidad de mesa insuficiente");

        const now = new Date();
        const entity = new Reservation({
            ...payload,
            tableNumber,
            quantityPeople: people,
            creationDate: fmtDate(now),
            creationTime: fmtTime(now),
            durationMinutes: Number(payload.durationMinutes ?? DEFAULT_DURATION_MIN),
            status: payload.status ?? "scheduled",
        });

        const available = this.isTableAvailable(
            {
                date: entity.reservationDate,
                time: entity.reservationTime,
                tableNumber: entity.tableNumber,
                durationMinutes: entity.durationMinutes,
            },
            { excludeId: null }
        );

        if (!available) throw new Error("Horario no disponible");

        const saved = await ReservationsApi.createReservation(entity);
        const normalized = normalizeReservation(saved);

        this.state.reservations = [...this.state.reservations, normalized];
        return normalized;
    },

    /** Elimina una reserva por id. */
    async deleteReservation(id) {
        await ReservationsApi.removeReservation(id);
        const sid = String(id);
        this.state.reservations = this.state.reservations.filter(
            (x) => String(x.idReservation ?? x.id) !== sid
        );
    },

    /** Actualiza parcialmente una reserva (útil para reprogramar o cambiar mesa). */
    async updateReservation(id, patch) {
        const current = this.getById(id);
        if (!current) throw new Error("Reserva no encontrada");

        // Combinar y validar entrada resultante
        const combined = normalizeReservation({ ...current, ...patch });

        validateReservationInput({
            reservationDate: combined.reservationDate,
            reservationTime: combined.reservationTime,
            tableNumber: combined.tableNumber,
            quantityPeople: combined.quantityPeople,
            durationMinutes: combined.durationMinutes,
        });

        // Revalidar mesa/capacidad si cambian
        const table = tablesStore.state.tables.find((t) => t.number === Number(combined.tableNumber));
        if (!table) throw new Error("La mesa no existe");
        if (Number(combined.quantityPeople) > Number(table.capacity)) {
            throw new Error("Capacidad de mesa insuficiente");
        }

        // Chequeo de disponibilidad excluyéndose a sí misma
        const available = this.isTableAvailable(
            {
                date: combined.reservationDate,
                time: combined.reservationTime,
                tableNumber: combined.tableNumber,
                durationMinutes: combined.durationMinutes,
            },
            { excludeId: combined.id ?? combined.idReservation }
        );
        if (!available) throw new Error("Horario no disponible");

        const updated = await ReservationsApi.updateReservation(id, combined);
        const normalized = normalizeReservation(updated);

        this.state.reservations = this.state.reservations.map((r) =>
            String(r.id ?? r.idReservation) === String(id) ? normalized : r
        );
        return normalized;
    },

    /** Obtiene una reserva por id. */
    getById(id) {
        const sid = String(id);
        return this.state.reservations.find(
            (r) => String(r.id ?? r.idReservation) === sid
        ) || null;
    },
};
