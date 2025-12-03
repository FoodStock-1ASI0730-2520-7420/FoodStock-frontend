// src/sales-reports/presentation/salesReport-routes.js

// ✅ Lazy-loaded components (same pattern as sales routes)
const salesReportList = () => import('./view/salesReport-list.vue');
const salesReportDetail = () => import('./view/salesReport-detail.vue');

// ✅ Export route definitions
const salesReportRoutes = [
    { path: '',               name: 'sales-report-list',    component: salesReportList,   meta: { title: 'Sales Reports' } },
    { path: 'detail/:id',     name: 'sales-report-detail',  component: salesReportDetail, meta: { title: 'Report Detail' } },
];

export default salesReportRoutes;
