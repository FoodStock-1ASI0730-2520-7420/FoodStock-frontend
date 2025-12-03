<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue';

const props = defineProps({
  supplier: {
    type: Object,
    required: true
  },
  isEdit: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['submit', 'close']);

const localSupplier = ref({});

watch(() => props.supplier, (newSupplier) => {
  localSupplier.value = JSON.parse(JSON.stringify(newSupplier));
}, { immediate: true, deep: true });

function handleSubmit() {
  emit('submit', localSupplier.value);
}
</script>

<template>
  <div class="supplier-form-container">
    <form @submit.prevent="handleSubmit">
      <h4>{{ isEdit ? 'Editar proveedor' : 'Agregar proveedor' }}</h4>
      <div class="form-field">
        <label for="name">Nombre</label>
        <input id="name" type="text" v-model="localSupplier.name" required />
      </div>
      <div class="form-field">
        <label for="contact">Contacto</label>
        <input id="contact" type="text" v-model="localSupplier.contact" />
      </div>
      <div class="form-field">
        <label for="type">Tipo</label>
        <input id="type" type="text" v-model="localSupplier.type" />
      </div>
      <div class="form-field">
        <label for="email">Email</label>
        <input id="email" type="email" v-model="localSupplier.email" />
      </div>
      <div class="form-actions">
        <button type="button" @click="$emit('close')" class="cancel-button">Cancelar</button>
        <button type="submit" class="submit-button">
          {{ isEdit ? 'Guardar' : 'Agregar proveedor' }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.supplier-form-container { padding: 10px; }
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
