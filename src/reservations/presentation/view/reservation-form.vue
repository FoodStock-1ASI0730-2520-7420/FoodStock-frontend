<!-- path: src/reservations/presentation/view/reservation-form.vue -->
<template>
  <div class="rs-container">
    <header class="rs-header">
      <div class="title-block">
        <h1 class="page-title">Crear Reservación</h1>
      </div>
      <router-link class="rs-btn ghost" to="/reservations">← Volver</router-link>
    </header>

    <form class="rs-form" @submit.prevent="submit">
      <section class="rs-card">
        <h2>Datos del cliente</h2>
        <div class="grid2">
          <label>
            <span>Nombre *</span>
            <input v-model.trim="form.customerName" required />
          </label>
          <label>
            <span>Teléfono</span>
            <input v-model.trim="form.customerPhone" />
          </label>
        </div>
      </section>

      <section class="rs-card">
        <h2>Detalles de la reserva</h2>
        <div class="grid3">
          <label>
            <span>Fecha *</span>
            <input type="date" v-model="form.reservationDate" required @change="refresh" />
          </label>
          <label>
            <span>Hora *</span>
            <div class="dropdown-wrap">
              <select
                  v-model="form.reservationTime"
                  required
                  @change="onTimeChange"
                  @blur="onTimeBlur"
                  @mousedown="onTimeOpen"
                  :class="{ expanded: isTimeExpanded }"
              >
                <option disabled value="">Seleccionar hora</option>
                <option v-for="hour in availableTimes" :key="hour" :value="hour">{{ hour }}</option>
              </select>
            </div>
          </label>
          <label>
            <span>Personas *</span>
            <input
                type="number"
                min="1"
                v-model="form.quantityPeople"
                required
                @input="refresh"
            />
          </label>
          <label>
            <span>Duración (min)</span>
            <input
                type="number"
                min="30"
                step="15"
                v-model="form.durationMinutes"
                @input="refresh"
            />
          </label>
        </div>
      </section>

      <section class="rs-card">
        <h2>Asignar mesa</h2>
        <p class="mini-desc">Selecciona una mesa disponible para {{ safePeople }} persona(s).</p>
        <div class="legend">
          <span><span class="color-box available"></span> Disponible</span>
          <span><span class="color-box blocked"></span> Ocupada</span>
          <span><span class="color-box active-now"></span> En uso (Activa)</span>
        </div>

        <reservation-tables
            :tables="tables"
            :date="form.reservationDate"
            :time="form.reservationTime"
            :duration="safeDuration"
            :people="safePeople"
            :available-table-numbers="availableTableNumbers"
            v-model:selected="form.tableNumber"
        />

        <p v-if="form.tableNumber" class="ok">Mesa seleccionada: {{ form.tableNumber }}</p>
        <p v-else class="warn">Ninguna mesa seleccionada.</p>
      </section>

      <footer class="actions">
        <button type="submit" class="rs-btn primary" :disabled="submitting || !isValid">Guardar</button>
        <button type="button" class="rs-btn" @click="reset">Limpiar</button>
      </footer>
    </form>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, computed } from "vue";
import { reservationsStore } from "../../application/reservations.store.js";
import { tablesStore } from "../../application/tables.store.js"; // <- FIX
import ReservationTables from "./reservation-tables.vue";

const store = reservationsStore;
const tables = ref([]);
const submitting = ref(false);
const today = new Date().toISOString().slice(0, 10);

/* Horas 11:00–23:45 (const inmutable) */
const availableTimes = (() => {
  const out = [];
  for (let h = 11; h <= 23; h++) for (const m of [0,15,30,45]) out.push(`${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`);
  return Object.freeze(out);
})();

/* Form (sin notes) */
const form = reactive({
  customerName: "",
  customerPhone: "",
  reservationDate: today,
  reservationTime: "19:00",
  quantityPeople: 2,
  durationMinutes: Number(import.meta.env.VITE_RESERVATION_DEFAULT_DURATION_MIN ?? 120),
  tableNumber: null,
});

/* Coerciones seguras */
const safePeople = computed(() => {
  const n = Number(form.quantityPeople);
  return Number.isFinite(n) && n > 0 ? n : 0;
});
const safeDuration = computed(() => {
  const n = Number(form.durationMinutes);
  return Number.isFinite(n) && n > 0 ? n : 0;
});

/* Validación */
const isValid = computed(() =>
    !!form.customerName && !!form.reservationDate && !!form.reservationTime &&
    safePeople.value > 0 && safeDuration.value >= 30
);

/* Disponibilidad: reemplaza store.availableTables(...) inexistente */
const availableTableNumbers = computed(() => {
  if (!form.reservationDate || !form.reservationTime || safePeople.value === 0 || safeDuration.value === 0) return [];
  return tables.value
      .filter(t =>
          t.capacity >= safePeople.value &&
          store.isTableAvailable({
            date: form.reservationDate,
            time: form.reservationTime,
            tableNumber: t.number,
            durationMinutes: safeDuration.value,
          })
      )
      .map(t => t.number);
});

/* Sync selección */
function refresh() {
  if (form.tableNumber && !availableTableNumbers.value.includes(form.tableNumber)) form.tableNumber = null;
}

/* Reset */
function reset() {
  Object.assign(form, {
    customerName: "",
    customerPhone: "",
    reservationDate: today,
    reservationTime: "19:00",
    quantityPeople: 2,
    durationMinutes: Number(import.meta.env.VITE_RESERVATION_DEFAULT_DURATION_MIN ?? 120),
    tableNumber: null,
  });
}

/* Submit */
async function submit() {
  submitting.value = true;
  try {
    if (!isValid.value) throw new Error("Completa los datos obligatorios");
    if (!form.tableNumber) throw new Error("Debes seleccionar una mesa disponible");
    await store.createReservation({
      customerName: form.customerName,
      customerPhone: form.customerPhone,
      reservationDate: form.reservationDate,
      reservationTime: form.reservationTime,
      quantityPeople: safePeople.value,
      durationMinutes: safeDuration.value,
      tableNumber: form.tableNumber,
    });
    alert("Reserva creada con éxito ✅");
    reset();
  } catch (e) {
    alert(e?.message || String(e));
  } finally {
    submitting.value = false;
  }
}

/* Load */
const isTimeExpanded = ref(false);
onMounted(async () => {
  await store.loadAll(); // carga reservas + mesas (via tablesStore)
  tables.value = tablesStore.state.tables; // <- FIX: leer del tablesStore
});

/* Dropdown */
function onTimeOpen() { isTimeExpanded.value = true; }
function onTimeBlur() { isTimeExpanded.value = false; }
function onTimeChange(e) { isTimeExpanded.value = false; e.target.blur(); }
</script>

<style scoped>
/* (estilos abreviados y equivalentes) */
.rs-container{max-width:1100px;margin:0 auto;padding:24px}
.rs-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px}
.rs-form{display:flex;flex-direction:column;gap:20px}
.rs-card{background:#fff;border-radius:16px;padding:20px;box-shadow:0 6px 18px rgba(0,0,0,.08);border:1px solid #e2e8f0}
.grid2,.grid3{display:grid;gap:12px}.grid2{grid-template-columns:repeat(2,1fr)}.grid3{grid-template-columns:repeat(3,1fr)}
label{display:flex;flex-direction:column;gap:6px;font-size:15px}
input,select{background:#f8fafc;border:1px solid #cbd5e1;border-radius:12px;padding:12px 14px;font-size:15px}
.dropdown-wrap{position:relative;min-height:40px}
select.expanded{position:absolute;width:100%;max-height:240px;overflow:auto;z-index:50;background:#fff}
.legend{display:flex;flex-wrap:wrap;gap:10px 16px;margin:8px 0 12px;font-size:13px;color:#334155}
.legend .color-box{display:inline-block;width:16px;height:16px;border-radius:4px;margin-right:6px;border:1px solid #cbd5e1}
.legend .available{background:#dcfce7;border-color:#22c55e}.legend .blocked{background:#fee2e2;border-color:#ef4444}.legend .active-now{background:#dbeafe;border-color:#2563eb}
.ok{color:#22c55e;font-weight:600}.warn{color:#ef4444;font-weight:600}
.actions{display:flex;gap:16px;justify-content:flex-end}
.rs-btn{padding:10px 16px;border-radius:12px;border:1px solid #cbd5e1;background:#fff;cursor:pointer}
.rs-btn.primary{background:linear-gradient(135deg,#06b6d4,#22c55e);color:#fff;border:none}
@media (max-width:820px){.grid2,.grid3{grid-template-columns:1fr}}
</style>
