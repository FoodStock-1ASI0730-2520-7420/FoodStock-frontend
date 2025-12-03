<script setup>
import { onMounted, ref } from 'vue';
import { useSupplierStore } from '../../application/useSupplierStore.js';
import SuppliersForm from "./suppliersForm.vue";


const store = useSupplierStore();

const isModalVisible = ref(false);
const currentSupplier = ref({});
const isEditMode = ref(false);

function openAddSupplierModal() {
  isEditMode.value = false;
  currentSupplier.value = { idSupplier: null, name: '', contact: '', type: '', email: '' };
  isModalVisible.value = true;
}

function openEditSupplierModal(supplier) {
  isEditMode.value = true;
  currentSupplier.value = JSON.parse(JSON.stringify(supplier));
  isModalVisible.value = true;
}

function closeModal() {
  isModalVisible.value = false;
  currentSupplier.value = {};
}

const handleFormSubmit = async (formData) => {
  try {
    if (isEditMode.value) {
      await store.updateSupplier(formData);
      alert('Proveedor actualizado correctamente!');
    } else {
      await store.addSupplier(formData);
      alert('Proveedor agregado correctamente!');
    }
    closeModal();
  } catch (error) {
    alert(`Error al guardar proveedor: ${error.message}`);
  }
};

const handleDeleteSupplier = async (id) => {
  if (confirm(`¿Seguro que deseas eliminar el proveedor con ID ${id}?`)) {
    try {
      await store.deleteSupplier(id);
      alert('Proveedor eliminado correctamente!');
    } catch (error) {
      alert(`Error al eliminar proveedor: ${error.message}`);
    }
  }
};

onMounted(() => {
  store.fetchSuppliers();
});
</script>

<template>
  <div class="suppliers-management">
    <h2>Proveedores</h2>
    <p>Total: {{ store.suppliers.length }}</p>

    <button @click="openAddSupplierModal">Agregar proveedor</button>

    <div v-if="store.errors.length && !store.suppliersLoaded" class="error-message">
      <p>Error cargando proveedores: {{ store.errors[0].message }}</p>
    </div>

    <table v-if="store.suppliers.length">
      <thead>
      <tr>
        <th>ID</th>
        <th>Nombre</th>
        <th>Contacto</th>
        <th>Tipo</th>
        <th>Email</th>
        <th>Acciones</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="supplier in store.suppliers" :key="supplier.idSupplier">
        <td>{{ supplier.idSupplier }}</td>
        <td>{{ supplier.name }}</td>
        <td>{{ supplier.contact }}</td>
        <td>{{ supplier.type }}</td>
        <td>{{ supplier.email }}</td>
        <td>
          <button @click="openEditSupplierModal(supplier)">Editar</button>
          <button @click="handleDeleteSupplier(supplier.idSupplier)">Eliminar</button>
        </td>
      </tr>
      </tbody>
    </table>

    <p v-else-if="store.suppliersLoaded">No hay proveedores registrados.</p>
    <p v-else>Cargando proveedores...</p>
  </div>

  <div v-if="isModalVisible" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <SuppliersForm
          :supplier="currentSupplier"
          :is-edit="isEditMode"
          @submit="handleFormSubmit"
          @close="closeModal"
      />
    </div>
  </div>
</template>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}
th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}
.error-message {
  color: red;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal-content {
  background: #222;
  color: white;
  padding: 30px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}
</style>
