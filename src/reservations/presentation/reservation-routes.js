// path: reservations/presentation/reservation-routes.js
// Agrega estas rutas a tu router principal
export const reservationRoutes = [
    {
        path: '/reservations',
        name: 'Reservations',
        component: () => import('./view/reservation-list.vue'),
    },
    {
        path: '/reservations/new',
        name: 'ReservationNew',
        component: () => import('./view/reservation-form.vue'),
    },
];
