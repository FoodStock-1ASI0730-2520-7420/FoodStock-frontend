// path: src/reservations/domain/model/reservation.entity.js
export class Reservation {
    constructor(props = {}) {
        this.idReservation = props.idReservation ?? props.id ?? null;
        this.tableNumber = Number(props.tableNumber);
        this.quantityPeople = Number(props.quantityPeople);
        this.reservationDate = props.reservationDate ?? null; // YYYY-MM-DD
        this.reservationTime = props.reservationTime ?? null; // HH:mm
        this.creationDate = props.creationDate ?? null;
        this.creationTime = props.creationTime ?? null;
        this.durationMinutes = Number(props.durationMinutes ?? 120);
        this.status = props.status ?? 'scheduled';
        this.customerName = props.customerName ?? '';
        this.customerPhone = props.customerPhone ?? '';

    }
}