<!-- path: src/reservations/presentation/view/reservation-list.vue -->
<template>
  <div class="rs-container">
    <header class="rs-header">
      <h1>Reservaciones</h1>
      <div class="header-actions">
        <router-link class="rs-btn primary" to="/reservations/new">
          + Reservación
        </router-link>

        <router-link class="rs-btn" style="margin-left:10px;" to="/reservations/table/new">
          + Mesa
        </router-link>
      </div>
    </header>

    <!-- MESAS ARRIBA -->
    <section class="rs-card combined-card">
      <!-- Filtros -->
      <div class="filters">
        <div class="grid2">
          <label>
            <span>Fecha</span>
            <input type="date" v-model="filters.date" />
          </label>
          <label class="time-label">
            <span>Hora (opcional)</span>
            <div class="dropdown-wrap">
              <select
                  v-model="filters.time"
                  @focus="onTimeOpen"
                  @mousedown="onTimeOpen"
                  @blur="onTimeBlur"
                  @change="onTimeChange"
                  :size="isTimeExpanded ? 6 : 1"
                  :class="{ expanded: isTimeExpanded }"
              >
                <option value="">(Cualquier hora)</option>
                <option v-for="hour in availableTimes" :key="hour" :value="hour">
                  {{ hour }}
                </option>
              </select>
            </div>
          </label>
        </div>
        <p class="muted">El tablero refleja disponibilidad actual según filtros.</p>
      </div>

      <div class="divider"></div>

      <!-- Tablero -->
      <div class="tables-section">
        <h2>Tablero de mesas</h2>
        <div class="legend">
          <span><span class="color-box available"></span> Disponible</span>
          <span><span class="color-box blocked"></span> Ocupada</span>
          <span><span class="color-box active-now"></span> En uso (Activa)</span>
        </div>

        <reservation-tables
            :tables="tables"
            :date="filters.date || today"
            :time="filters.time || '19:00'"
            :duration="store.state.filters.durationMinutes"
            :people="2"
            :available-table-numbers="availableNow"
            :selected="null"
        />
      </div>
    </section>

    <!-- LISTADO ABAJO -->
    <section class="rs-card">
      <h2>Listado</h2>
      <table class="tbl">
        <thead>
        <tr>
          <th>#</th>
          <th>Cliente</th>
          <th>Personas</th>
          <th>Mesa</th>
          <th>Fecha</th>
          <th>Hora</th>
          <th>Duración</th>
          <th>Estado</th>
          <th>Reloj</th>
          <th>Acciones</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="r in filtered" :key="r.idReservation ?? r.id">
          <td>{{ r.idReservation ?? r.id }}</td>
          <td>
            <div class="cellv">
              <strong>{{ r.customerName || '—' }}</strong>
              <small>{{ r.customerPhone || '—' }}</small>
            </div>
          </td>
          <td>{{ r.quantityPeople }}</td>
          <td>Mesa {{ r.tableNumber }}</td>
          <td>{{ r.reservationDate }}</td>
          <td>{{ r.reservationTime }}</td>
          <td>{{ r.durationMinutes }} min</td>
          <td><span class="badge" :class="computeStatus(r)">{{ computeStatus(r) }}</span></td>
          <td><Countdown :reservation="r" /></td>
          <td class="actions-cell">
            <button
                class="rs-btn xs"
                @click="cancel(r)"
                :disabled="r.status === 'canceled' || computeStatus(r) === 'completed'"
            >Cancelar</button>
            <button class="rs-btn xs danger" @click="del(r)">Eliminar</button>
          </td>
        </tr>
        <tr v-if="filtered.length === 0">
          <td colspan="10" style="text-align:center; color:#64748b; padding:14px;">
            No hay reservaciones que coincidan con los filtros.
          </td>
        </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, h, onBeforeUnmount } from 'vue';
import { reservationsStore } from '../../application/reservations.store.js';
import { tablesStore } from '../../application/tables.store.js'; // ← FIX: importar tablesStore
import ReservationTables from './reservation-tables.vue';

const store = reservationsStore;

const reservations = ref([]);
const tables = ref([]);
const filters = ref({ date: new Date().toISOString().slice(0, 10), time: '' });
const today = new Date().toISOString().slice(0, 10);

/* horas 11:00–23:45 (const) */
const availableTimes = (() => {
  const out = [];
  for (let h = 11; h <= 23; h++) for (const m of [0, 15, 30, 45]) out.push(`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`);
  return Object.freeze(out);
})();

const isTimeExpanded = ref(false);

/* reloj reactivo */
const now = ref(new Date());
const tickId = setInterval(() => (now.value = new Date()), 60_000);
onBeforeUnmount(() => clearInterval(tickId));

/* mini componente */
function fmt(ms) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const h2 = String(Math.floor(s / 3600)).padStart(2, '0');
  const m2 = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
  const ss = String(s % 60).padStart(2, '0');
  return `${h2}:${m2}:${ss}`;
}
const Countdown = {
  name: 'Countdown',
  props: { reservation: { type: Object, required: true } },
  data() { return { now: new Date() }; },
  mounted() { this.timer = setInterval(() => (this.now = new Date()), 1000); },
  unmounted() { clearInterval(this.timer); },
  computed: {
    label() {
      const r = this.reservation;
      if (!r) return '—';
      const start = new Date(`${r.reservationDate}T${r.reservationTime}${r.reservationTime?.length === 5 ? ':00' : ''}`);
      if (isNaN(start.getTime())) return '—';
      const end = new Date(start.getTime() + (r.durationMinutes || 120) * 60000);
      if (r.status === 'canceled') return 'Cancelada';
      if (this.now < start) return `Empieza en ${fmt(start - this.now)}`;
      if (this.now < end) return `Termina en ${fmt(end - this.now)}`;
      return 'Finalizada';
    },
  },
  render() { return h('span', this.label); },
};

/* disponibilidad actual en tablero */
const availableNow = computed(() => {
  const date = filters.value.date || today;
  const time = filters.value.time || '19:00';
  return tables.value
      .filter((t) =>
          // opcional: incluir capacidad si lo deseas -> && t.capacity >= 2
          store.isTableAvailable({
            date,
            time,
            tableNumber: t.number,
            durationMinutes: store.state.filters.durationMinutes,
          })
      )
      .map((t) => t.number);
});

function toMinutes(hhmm) {
  const [h, m] = (hhmm || '00:00').split(':').map(Number);
  return h * 60 + m;
}

/* estado */
function computeStatus(r) {
  const start = new Date(`${r.reservationDate}T${r.reservationTime}${r.reservationTime?.length === 5 ? ':00' : ''}`);
  if (isNaN(start.getTime())) return 'completed';
  const end = new Date(start.getTime() + (r.durationMinutes || 120) * 60000);
  if (r.status === 'canceled') return 'canceled';
  if (now.value < start) return 'scheduled';
  if (now.value >= start && now.value < end) return 'active';
  return 'completed';
}

/* filtro listado */
const filtered = computed(() => {
  const selectedDate = filters.value.date;
  const selectedTime = filters.value.time;
  return reservations.value
      .filter((r) => {
        if (selectedDate && r.reservationDate !== selectedDate) return false;
        if (!selectedTime) return true;
        const sel = toMinutes(selectedTime);
        const start = toMinutes(r.reservationTime);
        const end = start + (r.durationMinutes || 120);
        return sel >= start && sel < end;
      })
      .sort((a, b) => (a.reservationDate + a.reservationTime).localeCompare(b.reservationDate + b.reservationTime));
});

async function cancel(r) {
  if (!confirm('¿Cancelar esta reservación?')) return;
  try {
    // FIX: cancelReservation no existe
    await store.updateReservation(r.idReservation ?? r.id, { status: 'canceled' });
    await loadAll();
  } catch (e) {
    alert(e?.message || 'Error al cancelar');
  }
}
async function del(r) {
  if (!confirm('¿Eliminar esta reservación?')) return;
  try {
    await store.deleteReservation(r.idReservation ?? r.id);
    await loadAll();
  } catch (e) {
    alert(e?.message || 'Error al eliminar');
  }
}

async function loadAll() {
  await store.loadAll(); // carga reservas y tablesStore
  reservations.value = [...store.state.reservations];
  tables.value = [...tablesStore.state.tables]; // ← FIX: mesas desde tablesStore
}
onMounted(async () => { await loadAll(); });

/* dropdown */
function onTimeOpen() { isTimeExpanded.value = true; }
function onTimeBlur() { isTimeExpanded.value = false; }
function onTimeChange(e) { isTimeExpanded.value = false; e.target.blur(); }
</script>

<style scoped>
.rs-container { max-width: 1800px; margin: 0 auto; padding: 24px; color: #0b0b0b; }
.rs-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }

/* Tarjetas apiladas */
.rs-card { width: 100%; background: #f6f7f9; color: #1e293b; border-radius: 16px; padding: 18px; box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08); transition: all 0.3s ease; }
.rs-card + .rs-card { margin-top: 24px; }
.rs-card:hover { transform: translateY(-3px); box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15); }
.combined-card { display: flex; flex-direction: column; gap: 18px; }
.divider { height: 1px; background: #d1d5db; }

.filters .grid2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
label { display: flex; flex-direction: column; gap: 6px; font-size: 14px; color: #111827; }
input, select { background: #ffffff; color: #1f2937; border: 1px solid #cbd5e1; border-radius: 10px; padding: 10px 12px; transition: border 0.2s; }
input:focus, select:focus { border-color: #06b6d4; outline: none; }

.dropdown-wrap { position: relative; min-height: 40px; }
.dropdown-wrap select.expanded { position: absolute; inset: 0 auto auto 0; width: 100%; z-index: 50; background: #ffffff; max-height: 240px; overflow: auto; }

/* tabla */
.tbl { width: 100%; border-collapse: collapse; }
.tbl th, .tbl td { padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: left; }
.tbl th { color: #334155; font-weight: 600; }
.cellv { display: flex; flex-direction: column; line-height: 1.3; }
.cellv strong { font-weight: 600; color: #111827; }
.cellv small { color: #64748b; font-size: 13px; margin-top: 2px; display: block; }

.badge { padding: 4px 8px; border-radius: 8px; font-size: 12px; text-transform: capitalize; font-weight: 500; }
.badge.scheduled { background: #dbeafe; color: #1e40af; }
.badge.active { background: #dcfce7; color: #166534; }
.badge.completed { background: #f3f4f6; color: #374151; }
.badge.canceled { background: #fee2e2; color: #991b1b; }

.rs-btn { border: 1px solid #cbd5e1; padding: 8px 12px; border-radius: 10px; background: #ffffff; color: #111827; cursor: pointer; transition: all 0.2s; }
.rs-btn:hover { background: #f1f5f9; }
.rs-btn.primary { background: linear-gradient(135deg, #06b6d4, #22c55e); color: white; border: none; }
.rs-btn.xs { padding: 6px 8px; font-size: 12px; }
.rs-btn.danger { border-color: #ef4444; color: #b91c1c; }
.rs-btn.danger:hover { background: #fee2e2; }

.legend { display: flex; flex-wrap: wrap; gap: 10px 16px; margin: 8px 0 12px; font-size: 13px; color: #334155; align-items: center; }
.legend .color-box { display: inline-block; width: 16px; height: 16px; border-radius: 4px; margin-right: 6px; border: 1px solid #cbd5e1; vertical-align: middle; }
.legend .available { background: #dcfce7; border-color: #22c55e; }
.legend .blocked { background: #fee2e2; border-color: #ef4444; }
.legend .active-now { background: #dbeafe; border-color: #2563eb; }

@media (max-width: 900px) {
  .filters .grid2 { grid-template-columns: 1fr; }
}
</style>
