import {createRouter, createWebHistory, RouterView} from "vue-router";
import Home from "./shared/presentation/views/home.vue";
import InventoryView from './inventory/presentation/views/InventoryView.vue';
import DishesView from './inventory/presentation/views/DishesView.vue';
import ProductsView from './inventory/presentation/views/ProductsView.vue';
import SuppliersView from './suppliers/presentation/views/suppliersView.vue';
import salesRoutes from "./sales/presentation/sale-routes.js";
import reportsRoutes from "./reports/reports.routes.js";
import ReservationView from "./reservation/presentation/views/ReservationView.vue";
// TODO: Define lazy-loaded components for routes
const pageNotFound = () => import('./shared/presentation/views/page-not-found.vue');
const routes = [
    { path: '/home',            name: 'home',       component: Home,        meta: { title: 'Home' } },
    { path: '/',                redirect: '/home' },
    { path: '/sales',            name: 'sales',       children: salesRoutes },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: pageNotFound, meta: { title: 'Page Not Found' } },
    {
        path: '/suppliers',
        name: 'SuppliersManagement',
        component: SuppliersView,
        meta: { title: 'Manage Suppliers' }
    },
    {
        path: '/inventory',
        component: InventoryView,
        children: [
            { path: 'dishes', name: 'InventoryDishes', component: DishesView },
            { path: 'products', name: 'InventoryProducts', component: ProductsView },
            { path: '', redirect: { name: 'InventoryDishes' } }
        ]
    },
    {
        path: '/reservations',
        name: 'reservations',
        component: ReservationView,
        meta: { title: 'Reservations' }
    },
    {
        path: "/reports",
        component: RouterView,
        children: reportsRoutes
    }
];

export const router = createRouter({
    history: createWebHistory(),
    routes

});

router.beforeEach((to, from, next) => {
    console.log(`Navigating from ${from.name} to ${to.name}`);
    // Set the page title
    let baseTitle = 'FoodStock';
    document.title = `${baseTitle} - ${to.meta['title']}`;
    // TODO: Call authentication guard
    next();
});

export default router;