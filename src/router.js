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

// IAM views
import LoginView from "./iam/presentation/views/loginView.vue";
import RegisterView from "./iam/presentation/views/registerView.vue";
import ChoosePlanView from "./iam/presentation/views/choosePlanView.vue";
import {reservationRoutes} from "./reservations/presentation/reservation-routes.js";

const routes = [
    // Entrada dinámica: redirige según sesión
    {
        path: "/",
        name: "RootRedirect",
        component: { render: () => null },
        beforeEnter: (to, from, next) => {
            const token = localStorage.getItem("authToken");
            next(token ? "/home" : "/login");
        },
    },

    // IAM públicas
    { path: "/login", name: "Login", component: LoginView, meta: { title: "Login" } },
    { path: "/register", name: "Register", component: RegisterView, meta: { title: "Registro" } },
    { path: "/choose-plan", name: "ChoosePlan", component: ChoosePlanView, meta: { title: "Elegir Plan" } },

    // Home (privada)
    { path: "/home", name: "home", component: Home, meta: { title: "Home", requiresAuth: true } },

    // Inventory (privada)
    {
        path: "/inventory",
        component: InventoryView,
        meta: { requiresAuth: true },
        children: [
            { path: "dishes", name: "InventoryDishes", component: DishesView },
            { path: "products", name: "InventoryProducts", component: ProductsView },
            { path: "", redirect: { name: "InventoryDishes" } },
        ],
    },

    // Suppliers (privada)
    {
        path: "/suppliers",
        name: "SuppliersManagement",
        component: SuppliersView,
        meta: { title: "Manage Suppliers", requiresAuth: true },
    },

    // Reservations (privada)
    {
        path: '/reservations',
        name: 'reservations',
        component: RouterView, // <- esto permite que se muestren las rutas hijas del módulo
        children: reservationRoutes,
    },

    // Sales (privada)
    {
        path: "/sales",
        name: "sales",
        meta: { requiresAuth: true },
        children: salesRoutes,
    },

    // Reports (privada)
    {
        path: "/reports",
        component: RouterView,
        meta: { requiresAuth: true },
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

router.beforeEach((to, from, next) => {
    console.log(`Navigating from ${from.name} to ${to.name}`);

    // Título dinámico
    const baseTitle = "FoodStock";
    document.title = `${baseTitle} - ${to.meta.title || ""}`;

    // Autenticación
    const token = localStorage.getItem("authToken");
    const publicPages = ["/login", "/register", "/choose-plan"];

    if (to.meta?.requiresAuth && !token) return next("/login");
    if (token && publicPages.includes(to.path)) return next("/home");

    next();
});

export default router;