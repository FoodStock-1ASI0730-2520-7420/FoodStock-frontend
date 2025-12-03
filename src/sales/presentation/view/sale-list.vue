<script setup>
import {useI18n} from "vue-i18n";
import {useRouter} from "vue-router";
import {useConfirm} from "primevue";
import {onMounted} from "vue";
import useSalesStore from "../../application/sales.store.js";

const { t } = useI18n();
const router = useRouter();
const confirm = useConfirm();
const store = useSalesStore();
const { sales, salesLoaded, errors, fetchSales, deleteSale} = store;

onMounted(() => {
  if (!salesLoaded) fetchSales();
  console.log(sales);
});

const navigateToNew = () => {
  router.push({ name: 'sale-new' });
};

const navigateToEdit = (id) => {
  console.log(id);
  router.push({ name: 'sale-edit', params: { id } });
};

const navigateToSaleItems = (id) => {
  console.log(id);
  router.push({ name: 'sale-items', params: { id } });
};

const confirmDelete = (sale) => {
  confirm.require({
    message: t('sales.confirm-delete'),
    header: t('sales.delete-header'),
    icon: 'pi pi-exclamation-triangle',
    accept: () => { deleteSale(sale); },
  });
};
</script>

<template>
  <div class="p-4">
    <h1>{{ t('sales.title') }}</h1>
    <pv-button :label="t('sales.new')" icon="pi pi-plus" class="mb-3" @click="navigateToNew" />
    <pv-data-table
        :value="sales"
        :loading="!salesLoaded"
        striped-rows
        table-style="min-width: 50rem"
        paginator
        :rows="6"
        :rows-per-page-options="[5, 10, 20]"
    >
      <pv-column field="id" header="ID" sortable />
      <pv-column field="saleType" :header="t('sale.saleType')" />
      <pv-column field="paymentMethod" :header="t('sale.paymentMethod')" />
      <pv-column field="total" :header="t('sales.totalFinal')" sortable />
      <pv-column field="creationDate" :header="t('sales.date')" sortable />
      <pv-column field="creationTime" :header="t('sales.time')" sortable />
      <pv-column :header="t('sales.actions')">
        <template #body="slotProps">
          <pv-button icon="pi pi-eye" text rounded @click="navigateToSaleItems(slotProps.data.id)" />
          <pv-button icon="pi pi-pencil" text rounded @click="navigateToEdit(slotProps.data.id)" />
          <pv-button icon="pi pi-trash" text rounded severity="danger" @click="confirmDelete(slotProps.data)" />
        </template>
      </pv-column>
    </pv-data-table>
    <div v-if="errors.length" class="text-red-500 mt-3">
      {{ t('errors.occurred') }}: {{ errors.map(e => e.message).join(', ') }}
    </div>
    <pv-confirm-dialog />
  </div>
</template>

<style scoped>

</style>