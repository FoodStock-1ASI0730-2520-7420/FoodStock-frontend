
// path: src/reservations/infrastructure/table.assembler.js
const toInt = (v, def = 0) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : def;
};
export function tableFromDto(dto = {}) {
    const { number, capacity, ...rest } = dto;
    return { ...rest, number: toInt(number, null), capacity: toInt(capacity, 0) };
}