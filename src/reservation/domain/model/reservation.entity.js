// Reservation entity
export class Reservation {
    constructor(idReservation, clientName, tableNumber, quantityPeople, contact, email, reservationDate, reservationTime, status = 'Pending') {
        this.idReservation = idReservation;
        this.clientName = clientName;
        this.tableNumber = tableNumber;
        this.quantityPeople = quantityPeople;
        this.contact = contact;
        this.email = email;
        this.reservationDate = reservationDate;
        this.reservationTime = reservationTime;
        this.status = status;
        this.creationDate = new Date().toISOString().split('T')[0];
        this.creationTime = new Date().toTimeString().split(' ')[0];
    }

    createReservation() {
        console.log("Reservation created:", this);
    }

    editReservation(updatedData) {
        Object.assign(this, updatedData);
        console.log("Reservation updated:", this);
    }

    deleteReservation() {
        console.log("Reservation deleted:", this.idReservation);
    }

    isOverlapping(other) {
        return this.reservationDate === other.reservationDate &&
            this.reservationTime === other.reservationTime &&
            this.tableNumber === other.tableNumber;
    }
}
