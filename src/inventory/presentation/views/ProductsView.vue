<script setup>
import { ref } from 'vue';
import ProductsForm from './ProductsForm.vue';
import { useInventoryStore } from '../../application/useInventoryStore.js';

const store = useInventoryStore();
const showForm = ref(false);
const isEdit = ref(false);
const selectedProduct = ref({});

function openAddForm() {
  selectedProduct.value = {
    id: null,
    name: '',
    unitPrice: 0,
    quantity: 0,
    expirationDate: null, // ✅ corregido
    category: '',
    deleted: false
  };
  isEdit.value = false;
  showForm.value = true;
}

function openEditForm(product) {
  selectedProduct.value = { ...product };
  isEdit.value = true;
  showForm.value = true;
}

function closeForm() {
  showForm.value = false;
}

async function handleSubmit(product) {
  if (isEdit.value) {
    await store.updateProduct(product);
  } else {
    await store.addProduct(product);
  }
  showForm.value = false;
}

async function handleDelete(id) {
  await store.deleteProduct(id);
}

store.fetchProducts();
</script>

<template>
  <div class="products-view">
    <h3>Lista de Productos</h3>
    <button @click="openAddForm" class="add-button">Agregar Producto</button>
    <table class="products-table">
      <thead>
      <tr>
        <th>ID</th>
        <th>Nombre</th>
        <th>Precio Unitario</th>
        <th>Cantidad</th>
        <th>Precio Total</th> <!-- ✅ agregado -->
        <th>Vencimiento</th>
        <th>Categoría</th>
        <th>Eliminado</th> <!-- ✅ agregado -->
        <th>Acciones</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="product in store.products" :key="product.id">
        <td>{{ product.id }}</td>
        <td>{{ product.name }}</td>
        <td>{{ product.unitPrice }}</td>
        <td>{{ product.quantity }}</td>
        <td>{{ product.totalPrice }}</td> <!-- ✅ -->
        <td>{{ product.expirationDate }}</td>
        <td>{{ product.category }}</td>
        <td>{{ product.deleted ? 'Sí' : 'No' }}</td> <!-- ✅ -->
        <td>
          <button @click="openEditForm(product)" class="edit-button">Editar</button>
          <button @click="handleDelete(product.id)" class="delete-button">Eliminar</button>
        </td>
      </tr>
      </tbody>
    </table>
    <ProductsForm
        v-if="showForm"
        :product="selectedProduct"
        :isEdit="isEdit"
        @submit="handleSubmit"
        @close="closeForm"
    />
  </div>
</template>

<style scoped>
.products-view { padding: 20px; }
.add-button { margin-bottom: 15px; background: #007bff; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; }
.products-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
.products-table th, .products-table td { border: 1px solid #444; padding: 8px; text-align: left; color: #eee; }
.products-table th { background: #222; }
.edit-button { background: #ffc107; color: #222; border: none; padding: 5px 10px; border-radius: 4px; margin-right: 5px; cursor: pointer; }
.delete-button { background: #dc3545; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; }
</style>
