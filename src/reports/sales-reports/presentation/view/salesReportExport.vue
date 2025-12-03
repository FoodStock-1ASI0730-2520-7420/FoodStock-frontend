<script setup>
import { ref, computed } from "vue";
import { useSalesReportStore } from "../../application/salesReport.store.js";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const store = useSalesReportStore();
const fromDate = ref("");
const toDate = ref("");

// Format currency
const formatCurrency = (value) => {
  const num = Number(value) || 0;
  return `S/. ${num.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
};

// Computed data
const reportData = computed(() => store.reports || {});
const saleItems = computed(() => store.saleItems || []);
const paymentSummary = computed(() => store.paymentSummary || []);

// Calculate total amount across all payment methods
const totalAmountAllMethods = computed(() =>
    paymentSummary.value.reduce(
        (sum, method) => sum + (Number(method.total) || 0),
        0
    )
);

// Computed for general totals including expenses
const salesSummary = computed(() => {
  const reports = store.reports || [];

  const totalRevenue = reports.reduce((sum, r) => sum + (Number(r.total) || 0), 0);

  // Assuming each report has an "expenses" field (if not, you can set a fixed number for demo)
  const totalExpenses = reports.reduce((sum, r) => sum + (Number(r.expenses) || 0), 0);

  const totalProfit = totalRevenue - totalExpenses; // Net Profit
  const totalSales = reports.length;

  return { totalRevenue, totalExpenses, totalProfit, totalSales };
});
const totalExpenses = 200; // Only for testing

// Export to Excel
const exportToExcel = () => {
  const wb = XLSX.utils.book_new();

  // General Overview
  const overview = [
    ["General Overview"], // Title
    [], // Empty row for spacing
    ["Metric", "Value"],
    ["Total Revenue", formatCurrency(salesSummary.value.totalRevenue)],
    ["Total Expenses", formatCurrency(salesSummary.value.totalExpenses)],
    ["Net Profit", formatCurrency(salesSummary.value.totalProfit)],
    ["Total Sales", salesSummary.value.totalSales],
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(overview), "Overview");

  // Payment Methods
  const paymentSheet = [
    ["Popular Payment Methods"], // Title
    [], // Empty row for spacing
    ["Payment Method", "Transactions", "Total Amount"],
  ];
  paymentSummary.value.forEach((p) => {
    paymentSheet.push([p.method, p.transactions, formatCurrency(p.total)]);
  });
  paymentSheet.push(["TOTAL", "", formatCurrency(totalAmountAllMethods.value)]);
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(paymentSheet), "Payment Methods");

  // Transactions
  const transactionsSheet = [
    ["All Payment Transactions"], // Title
    [], // Empty row for spacing
    ["ID", "Date", "Time", "Sale Type", "Payment Method", "Total", "Waiter"],
  ];
  store.reports.forEach((s) => {
    transactionsSheet.push([
      s.id,
      s.creationDate,
      s.creationTime,
      s.saleType,
      s.paymentMethod,
      formatCurrency(s.total),
      s.waiter,
    ]);
  });
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(transactionsSheet), "Transactions");

  // Best Selling Dishes
  const dishesSheet = [
    ["Best Selling Dishes"], // Title
    [], // Empty row for spacing
    ["Dish", "Item ID", "Category", "Quantity", "Profit", "Sales (%)"],
  ];
  saleItems.value.forEach((d) => {
    dishesSheet.push([
      d.name,
      d.id,
      d.category || "N/A",
      d.quantity,
      formatCurrency(d.subtotal),
      d.salesPercent + "%",
    ]);
  });
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(dishesSheet), "Best Selling Dishes");

  // Save file
  XLSX.writeFile(wb, "Sales_Report.xlsx");
};

// Export to PDF
const exportToPDF = () => {
  const doc = new jsPDF();
  let y = 15;

  doc.setFontSize(18);
  doc.text("Sales Report", 14, y);
  y += 10;

  doc.setFontSize(12);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, y);
  y += 10;

  // General Overview
  doc.setFontSize(12);
  doc.text("General Overview", 14, y);
  y += 5;
  autoTable(doc, {
    startY: y,
    head: [["Metric", "Value"]],
    body: [
      ["Total Revenue", formatCurrency(salesSummary.value.totalRevenue)],
      ["Total Expenses", formatCurrency(salesSummary.value.totalExpenses)],
      ["Net Profit", formatCurrency(salesSummary.value.totalProfit)],
      ["Total Sales", salesSummary.value.totalSales],
    ],
    styles: { fontSize: 8 },
  });

  y = doc.lastAutoTable.finalY + 10;

  // Payment Methods
  doc.setFontSize(12);
  doc.text("Popular Payment Methods", 14, y);
  y += 5;
  autoTable(doc, {
    startY: y,
    head: [["Payment Method", "Transactions", "Total Amount"]],
    body: [
      ...paymentSummary.value.map((p) => [
        p.method,
        p.transactions,
        formatCurrency(p.total),
      ]),
      ["TOTAL", "", formatCurrency(totalAmountAllMethods.value)],
    ],
    styles: { fontSize: 8 },
  });
  y = doc.lastAutoTable.finalY + 10;

  // Transactions
  doc.setFontSize(12);
  doc.text("All Payment Transactions", 14, y);
  y += 5;
  autoTable(doc, {
    startY: y,
    head: [["ID", "Date", "Time", "Sale Type", "Payment Method", "Total", "Waiter"]],
    body: store.reports.map((s) => [
      s.id,
      s.creationDate,
      s.creationTime,
      s.saleType,
      s.paymentMethod,
      formatCurrency(s.total),
      s.waiter,
    ]),
    styles: { fontSize: 8 },
  });
  y = doc.lastAutoTable.finalY + 10;

  // Best Selling Dishes
  doc.setFontSize(12);
  doc.text("Best Selling Dishes", 14, y);
  y += 5;
  autoTable(doc, {
    startY: y,
    head: [["Dish", "Item ID", "Category", "Quantity", "Profit", "Sales (%)"]],
    body: saleItems.value.map((d) => [
      d.name,
      d.id,
      d.category || "N/A",
      d.quantity,
      formatCurrency(d.subtotal),
      d.salesPercent + "%",
    ]),
    styles: { fontSize: 8 },
  });

  doc.save("Sales_Report.pdf");
};
</script>

<template>
  <section class="card export">
    <h3>Export Inventory</h3>
    <div class="export-grid">
      <button class="excel" @click="exportToExcel">Export to Excel</button>
      <button class="pdf" @click="exportToPDF">Export to PDF</button>
    </div>
  </section>
</template>

<style scoped>
.export-grid {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

button.excel {
  background: #007bff;
  color: white;
  padding: 8px 14px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 500;
}

button.pdf {
  background: #dc3545;
  color: white;
  padding: 8px 14px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 500;
}

button:hover {
  opacity: 0.9;
}
</style>