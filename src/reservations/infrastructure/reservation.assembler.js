
// path: src/reservations/infrastructure/reservation.assembler.js
const toInt = (v, def = 0) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : def;
};

export function reservationFromDto(dto = {}) {
    const {
        idReservation, id,
        tableNumber, quantityPeople,
        reservationDate, reservationTime,
        creationDate, creationTime,
        durationMinutes, status,
        customerName, customerPhone,
        ...rest
    } = dto;

    return {
        ...rest,
        idReservation: idReservation ?? id ?? null,
        tableNumber: toInt(tableNumber, null),
        quantityPeople: toInt(quantityPeople, 0),
        reservationDate: reservationDate ?? null,
        reservationTime: reservationTime ?? null,
        creationDate: creationDate ?? null,
        creationTime: creationTime ?? null,
        durationMinutes: toInt(durationMinutes, 120),
        status: status ?? 'scheduled',
        customerName: customerName ?? '',
        customerPhone: customerPhone ?? '',
    };
}

export function reservationToDto(entity = {}) {
    const {
        idReservation, id,
        tableNumber, quantityPeople,
        reservationDate, reservationTime,
        creationDate, creationTime,
        durationMinutes, status,
        customerName, customerPhone,
        ...rest
    } = entity;

    return {
        ...rest,
        idReservation: idReservation ?? id ?? null,
        tableNumber: toInt(tableNumber, null),
        quantityPeople: toInt(quantityPeople, 0),
        reservationDate: reservationDate ?? null,
        reservationTime: reservationTime ?? null,
        creationDate: creationDate ?? null,
        creationTime: creationTime ?? null,
        durationMinutes: toInt(durationMinutes, 120),
        status: status ?? 'scheduled',
        customerName: customerName ?? '',
        customerPhone: customerPhone ?? '',
    };
}