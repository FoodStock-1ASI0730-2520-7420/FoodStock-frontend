// path: src/reservations/infrastructure/tables-api.js
import { toEntity as tableFromDto, toDTO as tableToDto } from "./table.assembler.js";

const base =
    import.meta.env.VITE_TABLES_ENDPOINT_PATH ||
    "http://localhost:3000/tables";

async function http(url, options = {}) {
    const res = await fetch(url, {
        headers: { "Content-Type": "application/json" },
        ...options
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.status === 204 ? null : res.json();
}

export const TablesApi = {
    async list() {
        const data = await http(base);
        return data.map(tableFromDto);
    },

    async create(entity) {
        const payload = tableToDto(entity);
        const data = await http(base, {
            method: "POST",
            body: JSON.stringify(payload)
        });
        return tableFromDto(data);
    },

    async remove(id) {
        // id llega como string, la ruta REST lo maneja bien
        await http(`${base}/${String(id)}`, { method: "DELETE" });
    }
};
