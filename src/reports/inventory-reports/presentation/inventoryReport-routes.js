// src/reports/inventory/presentation/inventoryReport-routes.js
const inventoryReportList = () => import('./view/inventoryReport-list.vue');
const inventoryReportDetail = () => import('./view/inventoryReport-detail.vue');


const inventoryReportRoutes = [
    { path: '', name: 'inventory-report-list', component: inventoryReportList, meta: { title: 'Inventory Reports' } },
    { path: 'detail/:id', name: 'inventory-report-detail', component: inventoryReportDetail, meta: { title: 'Inventory Report Detail' } },
];


export default inventoryReportRoutes;