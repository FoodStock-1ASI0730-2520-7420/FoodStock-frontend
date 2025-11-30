<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue';
import Select from "primevue/select"; // ✅ corregido import

const props = defineProps({
  product: { type: Object, required: true },
  isEdit: { type: Boolean, default: false }
});

const categories = [
  { label: 'Fruta', value: 'Fruta' },
  { label: 'Verdura', value: 'Verdura' },
  { label: 'Especias', value: 'Especias' },
  { label: 'Proteinas', value: 'Proteinas' },
  { label: 'Lacteos', value: 'Lacteos' }
];

const emit = defineEmits(['submit', 'close']);
const localProduct = ref({
  id: null,
  name: '',
  unitPrice: 0,
  quantity: 0,
  expirationDate: null,
  category: ''
});

watch(() => props.product, (newProduct) => {
  localProduct.value = JSON.parse(JSON.stringify(newProduct || {
    id: null,
    name: '',
    unitPrice: 0,
    quantity: 0,
    expirationDate: null,
    category: ''
  }));
}, { immediate: true, deep: true });

function handleSubmit() {
  emit('submit', localProduct.value);
}
</script>

<template>
  <div class="product-form-container">
    <form @submit.prevent="handleSubmit">
      <h4>{{ isEdit ? 'Editar Producto' : 'Agregar Producto' }}</h4>
      <div class="form-field">
        <label for="name">Nombre</label>
        <input id="name" type="text" v-model="localProduct.name" required />
      </div>
      <div class="form-field">
        <label for="unitPrice">Precio Unitario</label>
        <input id="unitPrice" type="number" step="0.01" v-model.number="localProduct.unitPrice" required />
      </div>
      <div class="form-field">
        <label for="quantity">Cantidad</label>
        <input id="quantity" type="number" v-model.number="localProduct.quantity" required />
      </div>
      <div class="form-field">
        <label for="expirationDate">Fecha de Vencimiento</label>
        <input id="expirationDate" type="date" v-model="localProduct.expirationDate" />
      </div>
      <div class="form-field">
        <label for="category">Categoría</label>
        <Select id="category"
                v-model="localProduct.category"
                :options="categories"
                option-label="label"
                option-value="value"
                placeholder="Selecciona categoría" />
      </div>
      <div class="form-actions">
        <button type="button" @click="$emit('close')" class="cancel-button">Cancelar</button>
        <button type="submit" class="submit-button">
          {{ isEdit ? 'Guardar Cambios' : 'Agregar Producto' }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.product-form-container { padding: 10px; }
.form-field { margin-bottom: 15px; }
label { display: block; font-weight: bold; margin-bottom: 5px; color: #ccc; }
input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  background-color: #333;
  border: 1px solid #555;
  color: white;
}
.form-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; }
.submit-button { background-color: #28a745; color: white; border: none; padding: 10px 20px; cursor: pointer; border-radius: 4px;}
.cancel-button { background-color: #6c757d; color: white; border: none; padding: 10px 20px; cursor: pointer; border-radius: 4px;}
</style>
