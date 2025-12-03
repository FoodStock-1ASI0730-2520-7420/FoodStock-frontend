<script setup>
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ref, computed, onMounted } from "vue";
import { useInventoryReportStore } from "../../application/inventoryReport.store.js";

// Store
const store = useInventoryReportStore();

// Load data when the component is mounted
onMounted(async () => {
  await store.fetchInventoryData?.();
});

// Reactive data
const products = computed(() => store.products || []);
const items = computed(() => store.items || []);
const summary = computed(() => store.summary || {});

// Helper for currency formatting
function formatCurrency(value) {
  const num = Number(value) || 0;
  return `S/. ${num.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
}

// Export to Excel
function exportToExcel() {
  const wb = XLSX.utils.book_new();

  // Sheet 1: General Summary
  const overview = [
    ["Metric", "Value"],
    ["Total Products", summary.value.totalProducts || 0],
    ["Total Quantity", summary.value.totalQuantity || 0],
    ["Total Value", formatCurrency(summary.value.totalValue || 0)],
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(overview), "Summary");

  // Sheet 2: Products with Expiration Date
  const productSheet = [["ID", "Name", "Category", "Quantity", "Expiration Date", "Total Value"]];
  products.value.forEach((p) => {
    productSheet.push([
      p.idProduct,
      p.name,
      p.category || "-",
      p.quantity || 0,
      p.expirationDate || "-",
      formatCurrency(p.totalPrice || p.unitPrice * p.quantity || 0),
    ]);
  });
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(productSheet), "Products");

  // Sheet 3: Items (Final Products)
  const itemsSheet = [["ID", "Name", "Price"]];
  items.value.forEach((i) => {
    itemsSheet.push([i.id, i.name, formatCurrency(i.price)]);
  });
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(itemsSheet), "Items");

  // Save Excel file
  XLSX.writeFile(wb, "Inventory_Report.xlsx");
}

// Export to PDF
function exportToPDF() {
  const doc = new jsPDF();
  let y = 15;

  doc.setFontSize(18);
  doc.text("Inventory Report", 14, y);
  y += 10;

  // Summary table
  autoTable(doc, {
    startY: y,
    head: [["Metric", "Value"]],
    body: [
      ["Total Products", summary.value.totalProducts || 0],
      ["Total Quantity", summary.value.totalQuantity || 0],
      ["Total Value", formatCurrency(summary.value.totalValue || 0)],
    ],
  });

  y = doc.lastAutoTable.finalY + 10;

  // Products table
  autoTable(doc, {
    startY: y,
    head: [["ID", "Name", "Category", "Quantity", "Expiration Date", "Total Value"]],
    body: products.value.map((p) => [
      p.idProduct,
      p.name,
      p.category || "-",
      p.quantity || 0,
      p.expirationDate || "-",
      formatCurrency(p.totalPrice || p.unitPrice * p.quantity || 0),
    ]),
    styles: { fontSize: 8 },
    headStyles: { fillColor: [41, 128, 185] },
  });

  y = doc.lastAutoTable.finalY + 10;

  // Ingredients table
  autoTable(doc, {
    startY: y,
    head: [["ID", "Name", "Price"]],
    body: items.value.map((i) => [i.id, i.name, formatCurrency(i.price)]),
    styles: { fontSize: 8 },
    headStyles: { fillColor: [46, 204, 113] },
  });

  doc.save("Inventory_Report.pdf");
}
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