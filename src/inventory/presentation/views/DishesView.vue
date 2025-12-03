<script setup>
import { ref, onMounted } from 'vue';
import { useInventoryStore } from '../../application/useInventoryStore.js';
import DishesForm from './DishesForm.vue';

const store = useInventoryStore();
const isModalVisible = ref(false);
const currentDish = ref({});
const isEditMode = ref(false);

function openAdd() {
  isEditMode.value = false;
  currentDish.value = { id: null, name: '', priceUnit: 0, ingredients: [] }; // ✅ incluir priceUnit
  isModalVisible.value = true;
}
function openEdit(d) {
  isEditMode.value = true;
  currentDish.value = JSON.parse(JSON.stringify(d));
  isModalVisible.value = true;
}
function closeModal() {
  isModalVisible.value = false;
  currentDish.value = {};
}

async function submit(d) {
  try {
    if (isEditMode.value) await store.updateDish(d);
    else await store.addDish(d);
    closeModal();
  } catch (e) { alert(e.message || e); }
}

async function remove(id) {
  if (!confirm('Confirm delete?')) return;
  await store.deleteDish(id);
}

onMounted(() => {
  store.fetchDishes();
  store.fetchProducts();
});
</script>

<template>
  <div>
    <h2>Platos (Dishes)</h2>
    <p>Total: {{ store.dishes.length }}</p>
    <button @click="openAdd">Agregar Plato</button>

    <table v-if="store.dishes.length">
      <thead>
      <tr>
        <th>ID</th>
        <th>Nombre</th>
        <th>Precio Unitario</th> <!-- ✅ mostrar priceUnit -->
        <th>Ingredientes</th>
        <th>Acciones</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="d in store.dishes" :key="d.id">
        <td>{{ d.id }}</td>
        <td>{{ d.name }}</td>
        <td>{{ d.priceUnit }}</td> <!-- ✅ -->
        <td>
          <ul>
            <li v-for="ing in d.ingredients" :key="ing.productId">
              <!-- ⚠️ backend solo devuelve productId y quantity -->
              {{ ing.productId }} x{{ ing.quantity }}
            </li>
          </ul>
        </td>
        <td>
          <button @click="openEdit(d)">Editar</button>
          <button @click="remove(d.id)">Eliminar</button>
        </td>
      </tr>
      </tbody>
    </table>

    <p v-else>Sin platos.</p>

    <div v-if="isModalVisible" class="modal" @click.self="closeModal">
      <div class="modal-content">
        <DishesForm
            :dish="currentDish"
            :is-edit="isEditMode"
            @submit="submit"
            @close="closeModal"
        />
      </div>
    </div>
  </div>
</template>
