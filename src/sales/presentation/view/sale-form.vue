<script setup>
import {useI18n} from "vue-i18n";
import {useRoute, useRouter} from "vue-router";
import {computed, onMounted, ref, watch} from "vue";
import useSalesStore from "../../application/sales.store.js";
import {Sale} from "../../domain/model/sale.entity.js";
import {Button as PvButton, InputNumber as PvInputNumber, InputText as PvInputText, Select as PvSelect} from "primevue";
import {SaleItem} from "../../domain/model/saleItem.entity.js";
import {InventoryApi} from "../../../inventory/infrastructure/inventory-api.js";

const {t} = useI18n();
const route = useRoute();
const router = useRouter();
const inventoryApi = new InventoryApi();
const saleId = Number(route.params.id);
const store = useSalesStore();
const {errors, sales, salesLoaded, addSale, updateSale, fetchSales} = store;

const saleType = [
  { label: "In-Person", value: 'in-person' },
  { label: "Delivery", value: 'delivery' }
]

const paymentMethods = [
  { label: "Cash", value: 'cash' },
  { label: "Card", value: 'card' },
  { label: "Transfer", value: 'transfer' }
]

const form = ref({saleType: '', paymentMethod: '', waiter: '', saleItems: []});
const isEdit = computed(() => !!route.params.id);
const items = ref([]);
const itemsLoaded = ref(false);

const saleItemForm = ref({dishId: null, quantity: 1});

onMounted(async() => {
  if (!salesLoaded) fetchSales();
  if (isEdit.value) {
    const sale = getSaleById(route.params.id);
    if (sale) {
      Object.assign(form.value, sale);
    } else router.push({name: 'sales-list'});
  }
  items.value = await inventoryApi.getDishes();
  itemsLoaded.value = true;
});

const totalFinal = computed(() => {
  const saleItems = form.value.saleItems.map(item => new SaleItem(item))
  console.log('saleItems', saleItems);
  const sale = new Sale({...form.value, saleItems})
  return sale.totalCount;
})

function getSaleById(id) {
  return store.getSaleById(id);
}

const saveSale = async () => {
  const saleItemsData = form.value.saleItems.map(item => ({
    dishId: item.dishId,
    name: item.name,
    priceUnit: item.priceUnit,
    quantity: item.quantity
  }));
  const saleToSave = {
    id: isEdit.value ? route.params.id : null,
    saleType: form.value.saleType,
    paymentMethod: form.value.paymentMethod,
    waiter: form.value.waiter,
    saleItems: saleItemsData
  };
  if (isEdit.value) {
    await updateSale(saleToSave);
  } else {
    await addSale(saleToSave);
  }
  navigateBack();
  };

const editingIndex = ref(null);

const selectedItem = computed(() =>
    items.value.find(item => item.id == saleItemForm.value.dishId));

const addSaleItem = () => {
  if(!selectedItem.value) return;

  const saleItemData = {
    dishId: selectedItem.value.id,
    name: selectedItem.value.name,
    priceUnit: selectedItem.value.price,
    quantity: saleItemForm.value.quantity
  };
  if(editingIndex.value !== null){
    form.value.saleItems[editingIndex.value] = saleItemData;
    editingIndex.value = null;
  }else{
    form.value.saleItems.push(saleItemData)
  }
  saleItemForm.value = {dishId: null, quantity: 1};
}

const editSaleItem = (index) => {
  editingIndex.value = index;
  saleItemForm.value = { ...form.value.saleItems[index]};
}

const removeSaleItem = (index) => {
  form.value.saleItems.splice(index, 1);
}

const navigateBack = () => {
  router.push({name: 'sales-list'});
};
</script>

<template>
  <div class="p-4">
    <h1>{{ isEdit ? t('sale.edit-title') : t('sale.new-title') }}</h1>
    <form @submit.prevent="saveSale">
      <div class="field mb-3">
        <label for="saleType">{{ t('sale.saleType') }}</label>
        <pv-select
            id="saleType"
            v-model="form.saleType"
            :options="saleType"
            optionLabel="label"
            optionValue="value"
            :placeholder="t('sale.selectTypeSale')"
            class="w-full"
        />
      </div>
      <div class="field mb-3">
        <label for="paymentMethod">{{ t('sale.paymentMethod') }}</label>
        <pv-select
            id="paymentMethod"
            v-model="form.paymentMethod"
            :options="paymentMethods"
            optionLabel="label"
            optionValue="value"
            :placeholder="t('sale.selectPaymentMethod')"
            class="w-full"
        />
      </div>
      <div class="field mb-3">
        <label for="waiter">{{ t('sale.waiter') }}</label>
        <pv-input-text id="waiter" v-model="form.waiter" class="w-full" />
      </div>

      <div class="mb-4">
        <h2>{{ t('sale.addItem')}}</h2>
          <div class="field mb-2">
            <label for="name">{{ t('sale.name') }}</label>
            <pv-select
                id="item"
                v-model="saleItemForm.dishId"
                :options="items"
                optionLabel="name"
                optionValue="id"
                :placeholder="t('sale.selectItem')"
                class="w-full"
            />
          </div>
          <div class="field mb-2">
            <label for="price">{{ t('sale.price') }}</label>
            <br>
            <span class="font-bold">{{selectedItem?.price}}</span>
          </div>
          <div class="field mb-2">
            <label for="quantity">{{ t('sale.quantity') }}</label>
            <pv-input-number id="quantity" v-model="saleItemForm.quantity" class="w-full"/>
          </div>
        <pv-button type="button" :label="t('sale.add')" icon="pi pi-plus" @click="addSaleItem"></pv-button>
        </div>
      <div v-if="form.saleItems.length">
        <h3>{{ t('sale.itemList')}}</h3>
        <ul>
          <li v-for="(item, index) in form.saleItems" :key="index" class="mb-2 border p-2 rounded">
            {{ item.name}} - {{ new SaleItem(item).subtotal}}
            <pv-button type="button" icon="pi pi-pencil" @click="editSaleItem(index)"></pv-button>
            <pv-button type="button" icon="pi pi-trash" severity="danger" @click="removeSaleItem(index)"></pv-button>
          </li>
        </ul>
      </div>
      <div class="field mb-3">
        <label class="font-bold">{{ t('sale.total')}}: </label>
        <br>
        <span>{{ totalFinal}}</span>
      </div>
      <pv-button type="submit" :label="t('sale.save')" icon="pi pi-save" />
      <pv-button :label="t('sale.cancel')" severity="secondary" class="ml-2" @click="navigateBack" />
    </form>
    <div v-if="errors.length" class="text-red-500 mt-3">
      {{ t('errors.occurred') }}: {{ errors.map(e => e.message).join(', ') }}
    </div>
  </div>
</template>

<style scoped>

</style>