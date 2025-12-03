// path: src/reservations/application/tables.store.js
import { TablesApi } from "../infrastructure/tables-api.js";
import { Table } from "../domain/model/table.entity.js";

export const tablesStore = {
    state: { tables: [], loading: false },

    async loadTables() {
        this.state.loading = true;
        try {
            const data = await TablesApi.list();
            const arr = Array.isArray(data) ? data : []; // defensa
            this.state.tables = arr.map(t => ({
                ...t,
                id: String(t.id),
                number: Number(t.number),
                capacity: Number(t.capacity)
            }));
        } finally {
            this.state.loading = false;
        }
    },

    async createTable(payload) {
        const exists = this.state.tables.some(t => Number(t.number) === Number(payload.number));
        if (exists) throw new Error(`La mesa ${payload.number} ya existe.`);

        const entity = new Table({ id: null, number: Number(payload.number), capacity: Number(payload.capacity) });
        const saved = await TablesApi.create(entity);
        saved.id = String(saved.id);
        this.state.tables.push(saved);
        return saved;
    },

    async deleteTable(id) {
        const strId = String(id);
        await TablesApi.remove(strId);
        this.state.tables = this.state.tables.filter(t => String(t.id) !== strId);
    }
};
