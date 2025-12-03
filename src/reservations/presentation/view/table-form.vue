<!-- path: src/reservations/presentation/view/table-form.vue -->
<template>
  <div class="rs-container">
    <header class="rs-header">
      <div class="title-block">
        <h1 class="page-title">Crear Mesa</h1>
      </div>
      <router-link class="rs-btn ghost" to="/reservations">← Volver</router-link>
    </header>

    <form class="rs-form" @submit.prevent="submit">
      <section class="rs-card">
        <h2>Datos de la mesa</h2>
        <div class="grid2">
          <label>
            <span>Número de mesa *</span>
            <input type="number" min="1" v-model.number="form.number" required placeholder="Ej: 1, 2, 3..." />
          </label>
          <label>
            <span>Capacidad *</span>
            <input type="number" min="2" max="10" v-model.number="form.capacity" required placeholder="Capacidad entre 2 y 10" />
          </label>
        </div>
      </section>

      <footer class="actions">
        <button type="submit" class="rs-btn primary" :disabled="loading">Guardar</button>
        <button type="button" class="rs-btn" @click="reset">Limpiar</button>
      </footer>
    </form>

    <section class="rs-card card-listado">
      <h2>Mesas existentes</h2>
      <ul class="table-list">
        <li v-for="t in tables" :key="t.id" class="table-item">
          <div class="info">
            <strong>Mesa {{ t.number }}</strong>
            <span>Capacidad: {{ t.capacity }}</span>
          </div>
          <button class="rs-btn danger xs" @click="del(t.id)">Eliminar</button>
        </li>
        <li v-if="tables.length === 0" class="empty">No hay mesas registradas.</li>
      </ul>
    </section>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue";
import { tablesStore } from "../../application/tables.store.js";

const form = reactive({ number: null, capacity: 2 });
const tables = ref([]);
const loading = ref(false);

function reset() {
  form.number = null;
  form.capacity = 2;
}

async function submit() {
  loading.value = true;
  try {
    await tablesStore.createTable({
      number: form.number,
      capacity: form.capacity,
    });
    alert("Mesa creada correctamente.");
    reset();
    await loadTables();
  } catch (e) {
    alert(e?.message || "Error al crear mesa");
  } finally {
    loading.value = false;
  }
}

async function del(id) {
  if (!confirm("¿Eliminar esta mesa?")) return;
  // actualización optimista + manejo de errores
  const strId = String(id);
  const prev = [...tables.value];
  tables.value = tables.value.filter(t => String(t.id) !== strId);
  try {
    await tablesStore.deleteTable(strId);
    // opcional: resincroniza con backend
    await loadTables();
  } catch (e) {
    // revertir si falla
    tables.value = prev;
    alert(e?.message || "Error al eliminar mesa");
  }
}

async function loadTables() {
  await tablesStore.loadTables();
  tables.value = [...tablesStore.state.tables];
}

onMounted(loadTables);
</script>

<style scoped>
.rs-container { max-width: 1100px; margin: 0 auto; padding: 24px; }
.rs-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; }
.page-title { font-size: 28px; font-weight: 800; color: #0f172a; }
.rs-form { display: flex; flex-direction: column; gap: 20px; }
.rs-card { background: #ffffff; border-radius: 16px; padding: 20px; border: 1px solid #e2e8f0; box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08); transition: all 0.25s ease; }
.rs-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0, 0, 0, 0.13); }
.grid2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; }
label { display: flex; flex-direction: column; gap: 6px; font-size: 15px; color: #334155; }
input { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 12px; padding: 12px; font-size: 15px; }
.actions { display: flex; justify-content: flex-end; gap: 12px; }
.table-list { list-style: none; padding: 0; margin: 0; display: grid; gap: 10px; }
.table-item { display: flex; justify-content: space-between; align-items: center; background: #f8fafc; border: 1px solid #cbd5e1; padding: 12px 14px; border-radius: 12px; }
.table-item .info { display: flex; flex-direction: column; line-height: 1.2; }
.table-item .info strong { font-size: 16px; color: #0f172a; }
.table-item .info span { font-size: 14px; color: #475569; }
.empty { text-align: center; color: #64748b; padding: 12px; }
.rs-btn { border: 1px solid #cbd5e1; padding: 10px 16px; border-radius: 12px; background: #ffffff; cursor: pointer; transition: all 0.2s; }
.rs-btn:hover { background: #f1f5f9; }
.rs-btn.primary { background: linear-gradient(135deg, #06b6d4, #22c55e); color: white; border: none; }
.rs-btn.ghost { background: transparent; border: none; color: #0f172a; }
.rs-btn.danger { border-color: #ef4444; color: #b91c1c; }
.rs-btn.danger:hover { background: #fee2e2; }
.rs-btn.xs { padding: 6px 10px; font-size: 12px; }
@media (max-width: 820px) { .grid2 { grid-template-columns: 1fr; } }
</style>
