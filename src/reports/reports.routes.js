// router-report.js
import ReportsView from "./presentation/reportsView.vue";
import { RouterView } from "vue-router"; // Container for child routes
import salesReportRoutes from "./sales-reports/presentation/salesReport-routes.js";
import inventoryReportRoutes from "./inventory-reports/presentation/inventoryReport-routes.js";

const reportsRoutes = [
    {
        path: "",                       // Empty path because parent route provides /reports
        name: "reports-dashboard",       // Unique name for the dashboard
        component: ReportsView,          // Main reports dashboard view
        meta: { title: "Reports Dashboard" },
        children: [
            {
                path: "sales",
                name: "sales-reports",
                component: RouterView,   // Container for child routes
                children: salesReportRoutes,
            },
            {
                path: "inventory",
                name: "inventory-reports",
                component: RouterView,   // Container for child routes
                children: inventoryReportRoutes,
            },
        ],
    },
];

export default reportsRoutes;
