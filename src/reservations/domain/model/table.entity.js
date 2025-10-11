// path: reservations/domain/model/table.entity.js
export class Table {
    constructor({ id, number, capacity }) {
        this.id = id ?? null;
        this.number = Number(number);
        this.capacity = Number(capacity);
        if (this.capacity <= 0) throw new Error('La capacidad debe ser > 0');
    }
}
