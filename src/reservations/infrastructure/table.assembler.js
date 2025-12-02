// path: src/reservations/infrastructure/table.assembler.js
import { Table } from "../domain/model/table.entity.js";

export function toEntity(dto = {}) {
    return new Table({
        id: dto.id ?? null,
        number: dto.number,
        capacity: dto.capacity
    });
}

export function toDTO(entity = {}) {
    // no envíes id si no existe (POST)
    const out = {
        number: entity.number,
        capacity: entity.capacity
    };
    if (entity.id != null) out.id = entity.id;
    return out;
}
