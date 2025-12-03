import { createRouter, createWebHistory, RouterView } from "vue-router";

// Shared views
import Home from "./shared/presentation/views/home.vue";
const pageNotFound = () => import("./shared/presentation/views/page-not-found.vue");

// Inventory
import InventoryView from "./inventory/presentation/views/InventoryView.vue";
import DishesView from "./inventory/presentation/views/DishesView.vue";
import ProductsView from "./inventory/presentation/views/ProductsView.vue";

// Suppliers
import SuppliersView from "./suppliers/presentation/views/suppliersView.vue";

// Sales & Reports
import salesRoutes from "./sales/presentation/sale-routes.js";
import reportsRoutes from "./reports/reports.routes.js";

// Reservations
import { reservationRoutes } from "./reservations/presentation/reservation-routes.js";

const routes = [
    // ✅ Redirección desde raíz
    { path: "/", redirect: "/home" },

    // Home
    { path: "/home", name: "home", component: Home, meta: { title: "Home" } },

    // Inventory
    {
        path: "/inventory",
        component: InventoryView,
        children: [
            { path: "dishes", name: "InventoryDishes", component: DishesView },
            { path: "products", name: "InventoryProducts", component: ProductsView },
            { path: "", redirect: { name: "InventoryDishes" } },
        ],
    },

    // Suppliers
    {
        path: "/suppliers",
        name: "SuppliersManagement",
        component: SuppliersView,
        meta: { title: "Manage Suppliers" },
    },

    // Reservations
    {
        path: "/reservations",
        name: "reservations",
        component: RouterView,
        children: reservationRoutes,
    },

    // Sales
    {
        path: "/sales",
        name: "sales",
        children: salesRoutes,
    },

    // Reports
    {
        path: "/reports",
        component: RouterView,
        children: reportsRoutes,
    },

    // Página no encontrada
    {
        path: "/:pathMatch(.*)*",
        name: "not-found",
        component: pageNotFound,
        meta: { title: "Page Not Found" },
    },
];

export const router = createRouter({
    history: createWebHistory(),
    routes,
});

// ✅ Guard simplificado: solo título dinámico
router.beforeEach((to, from, next) => {
    console.log(`Navigating from ${from.name} to ${to.name}`);

    const baseTitle = "FoodStock";
    document.title = `${baseTitle} - ${to.meta.title || ""}`;

    next();
});

export default router;
