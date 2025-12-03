// Transform data to/from API format
export const ReservationAssembler = {
    toEntity(apiData) {
        return {
            idReservation: apiData.idReservation,
            clientName: apiData.clientName,
            tableNumber: apiData.tableNumber,
            quantityPeople: apiData.quantityPeople,
            contact: apiData.contact,
            email: apiData.email,
            reservationDate: apiData.reservationDate,
            reservationTime: apiData.reservationTime,
            status: apiData.status
        };
    },

    toApiFormat(entity) {
        return {
            idReservation: entity.idReservation,
            clientName: entity.clientName,
            tableNumber: entity.tableNumber,
            quantityPeople: entity.quantityPeople,
            contact: entity.contact,
            email: entity.email,
            reservationDate: entity.reservationDate,
            reservationTime: entity.reservationTime,
            status: entity.status
        };
    }
};
