export const ReservationAPI = {
    fetchReservations: async () => {
        const res = await fetch('http://localhost:3000/reservations');
        return await res.json();
    },

    saveReservation: async (reservation) => {
        const { idReservation, ...data } = reservation;
        const res = await fetch('http://localhost:3000/reservations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return await res.json();
    },

    updateReservation: async (id, updatedData) => {
        const res = await fetch(`http://localhost:3000/reservations/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData),
        });
        return await res.json();
    },

    deleteReservation: async (id) => {
        const res = await fetch(`http://localhost:3000/reservations/${id}`, { method: 'DELETE' });
        return res.ok;
    }
};
