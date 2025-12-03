// path: src/reservations/infrastructure/reservations-api.js
import { BaseApi } from "../../shared/infrastructure/base-api.js";
import { BaseEndpoint } from "../../shared/infrastructure/base-endpoint.js";

const RAW_PATH = import.meta.env.VITE_RESERVATIONS_ENDPOINT_PATH || "/reservations";
const PATH = RAW_PATH?.startsWith("/") ? RAW_PATH : `/${RAW_PATH || ""}`;

// helpers locales
function unwrapList(payload) {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.items)) return payload.items;
    if (Array.isArray(payload?.results)) return payload.results;
    return [];
}
function normalizeReservation(r) {
    return {
        id: Number(r.id ?? r.Id ?? 0),
        tableNumber: Number(r.tableNumber ?? r.TableNumber ?? 0),
        quantityPeople: Number(r.quantityPeople ?? r.QuantityPeople ?? 0),
        reservationDate: r.reservationDate ?? r.ReservationDate ?? null,
        reservationTime: r.reservationTime ?? r.ReservationTime ?? null,
        creationDate: r.creationDate ?? r.CreationDate ?? null,
        creationTime: r.creationTime ?? r.CreationTime ?? null,
        durationMinutes: Number(r.durationMinutes ?? r.DurationMinutes ?? 120),
        status: r.status ?? r.Status ?? "scheduled",
        customerName: r.customerName ?? r.CustomerName ?? "",
        customerPhone: r.customerPhone ?? r.CustomerPhone ?? "",
    };
}

export class ReservationsApiService extends BaseApi {
    #endpoint;
    constructor() {
        super();
        this.#endpoint = new BaseEndpoint(this, PATH);
    }
    async getReservations() {
        const res = await this.#endpoint.getAll();
        return unwrapList(res).map(normalizeReservation);
    }
    getReservationById(id) {
        return this.#endpoint.getById(id).then(normalizeReservation);
    }
    createReservation(resource) {
        return this.#endpoint.create(resource).then(normalizeReservation);
    }
    updateReservation(resource) {
        return this.#endpoint.update(resource.id, resource).then(normalizeReservation);
    }
    deleteReservation(id) {
        return this.#endpoint.delete(id);
    }
}

const reservationsService = new ReservationsApiService();

export const ReservationsApi = {
    listReservations() {
        return reservationsService.getReservations(); // SIEMPRE Array normalizado
    },
    createReservation(entity) {
        return reservationsService.createReservation(entity);
    },
    updateReservation(id, entity) {
        return reservationsService.updateReservation({ ...entity, id });
    },
    removeReservation(id) {
        return reservationsService.deleteReservation(id);
    },
};
