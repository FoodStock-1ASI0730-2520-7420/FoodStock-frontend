// path: src/reservations/domain/model/table.entity.js
export class Table {
    constructor({ id, number, capacity }) {
        this.id = id ?? null;
        this.number = Number(number);
        this.capacity = Number(capacity);

        if (this.capacity < 2 || this.capacity > 10) {
            throw new Error("La capacidad debe estar entre 2 y 10.");
        }
    }
}
