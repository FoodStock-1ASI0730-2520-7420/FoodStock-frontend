import { Reservation } from "../domain/model/reservation.entity.js";

// Service to manage reservations
export class ReservationService {
    constructor() {
        this.reservations = [];
    }

    addReservation(data) {
        const reservation = new Reservation(
            data.idReservation,
            data.clientName,
            data.tableNumber,
            data.quantityPeople,
            data.contact,
            data.email,
            data.reservationDate,
            data.reservationTime,
            data.status
        );

        const overlapping = this.reservations.some(r => r.isOverlapping(reservation));
        if (overlapping) throw new Error('This table is already reserved at this time.');

        reservation.createReservation();
        this.reservations.push(reservation);
        return reservation;
    }

    updateReservation(id, updatedData) {
        const reservation = this.reservations.find(r => r.idReservation === id);
        if (reservation) reservation.editReservation(updatedData);
        return reservation;
    }

    removeReservation(id) {
        const index = this.reservations.findIndex(r => r.idReservation === id);
        if (index >= 0) {
            this.reservations[index].deleteReservation();
            this.reservations.splice(index, 1);
        }
    }

    listReservations() {
        return this.reservations;
    }
}
