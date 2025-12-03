<script setup>
import { ref, watch, onMounted } from 'vue';
import { useInventoryStore } from '../../application/useInventoryStore.js';

const props = defineProps({
  dish: { type: Object, required: true },
  isEdit: { type: Boolean, default: false }
});
const emit = defineEmits(['submit','close']);
const store = useInventoryStore();

// ✅ incluir priceUnit en el modelo local
const localDish = ref({ name: '', priceUnit: 0, ingredients: [] });

watch(() => props.dish, (v) => {
  localDish.value = JSON.parse(JSON.stringify(v || { name: '', priceUnit: 0, ingredients: [] }));
}, { immediate: true, deep: true });

onMounted(() => store.fetchProducts());

function toggleIngredient(product) {
  const idx = localDish.value.ingredients.findIndex(i => i.productId === product.id);
  if (idx === -1) {
    localDish.value.ingredients.push({ productId: product.id, quantity: 1, name: product.name });
  } else {
    localDish.value.ingredients.splice(idx,1);
  }
}

function changeQty(productId, q) {
  const ing = localDish.value.ingredients.find(i => i.productId === productId);
  if (ing) ing.quantity = Number(q) || 0;
}

function isSelected(product) {
  return localDish.value.ingredients.some(i => i.productId === product.id);
}

function handleSubmit() {
  emit('submit', localDish.value);
}
</script>

<template>
  <div class="dish-form">
    <form @submit.prevent="handleSubmit">
      <h4>{{ isEdit ? 'Editar Plato' : 'Agregar Plato' }}</h4>
      <div>
        <label>Nombre</label>
        <input v-model="localDish.name" required />
      </div>

      <!-- ✅ campo para priceUnit -->
      <div>
        <label>Precio Unitario</label>
        <input type="number" v-model="localDish.priceUnit" min="0" step="0.01" required />
      </div>

      <div>
        <h5>Ingredientes (selecciona y ajusta cantidad)</h5>
        <div v-if="store.products.length === 0">No hay productos disponibles.</div>
        <div v-for="p in store.products" :key="p.id" style="display:flex;gap:8px;align-items:center;margin:6px 0;">
          <input type="checkbox" :checked="isSelected(p)" @change="toggleIngredient(p)" />
          <div style="flex:1">{{ p.name }} (stock: {{ p.quantity }})</div>
          <input v-if="isSelected(p)" type="number" min="1" style="width:80px"
                 :value="localDish.ingredients.find(i=>i.productId===p.id)?.quantity || 1"
                 @input="e => changeQty(p.id, e.target.value)" />
        </div>
      </div>

      <div style="margin-top:12px;">
        <button type="button" @click="$emit('close')">Cancelar</button>
        <button type="submit">{{ isEdit ? 'Guardar' : 'Crear' }}</button>
      </div>
    </form>
  </div>
</template>
