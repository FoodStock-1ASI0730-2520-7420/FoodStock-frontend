// path: src/reservations/infrastructure/tables-api.js
import { BaseApi } from "../../shared/infrastructure/base-api.js";
import { BaseEndpoint } from "../../shared/infrastructure/base-endpoint.js";

const RAW_PATH = import.meta.env.VITE_TABLES_ENDPOINT_PATH || "/tables";
const PATH = RAW_PATH?.startsWith("/") ? RAW_PATH : `/${RAW_PATH || ""}`;

// helpers locales (sin crear archivos nuevos)
function unwrapList(payload) {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.items)) return payload.items;
    if (Array.isArray(payload?.results)) return payload.results;
    return [];
}
function normalizeTable(t) {
    return {
        id: Number(t.id ?? t.Id ?? 0),
        number: Number(t.number ?? t.Number ?? 0),
        capacity: Number(t.capacity ?? t.Capacity ?? 0),
    };
}

export class TablesApiService extends BaseApi {
    #endpoint;
    constructor() {
        super();
        this.#endpoint = new BaseEndpoint(this, PATH);
    }
    async getTables() {
        const res = await this.#endpoint.getAll();
        return unwrapList(res).map(normalizeTable);
    }
    getTableById(id) {
        return this.#endpoint.getById(id).then(normalizeTable);
    }
    createTable(resource) {
        return this.#endpoint.create(resource).then(normalizeTable);
    }
    updateTable(resource) {
        return this.#endpoint.update(resource.id, resource).then(normalizeTable);
    }
    deleteTable(id) {
        return this.#endpoint.delete(id);
    }
}

const tablesService = new TablesApiService();

export const TablesApi = {
    list() {
        return tablesService.getTables(); // SIEMPRE Array normalizado
    },
    create(entity) {
        return tablesService.createTable(entity);
    },
    remove(id) {
        return tablesService.deleteTable(id);
    },
};
