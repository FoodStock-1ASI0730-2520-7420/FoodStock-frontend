<!-- path: src/reservations/presentation/view/reservation-tables.vue -->
<template>
  <div class="board">
    <div
        v-for="t in tables"
        :key="t.number"
        class="cell"
        :class="[tableClass(t), { 'is-selected': modelValue === t.number }]"
        @click="handleClick($event, t)"
        :title="tooltipFor(t)"
    >
      <div class="num">Mesa {{ t.number }}</div>
      <div class="cap">Capacidad: {{ t.capacity }}</div>
    </div>
  </div>

  <teleport to="body">
    <div v-if="popover.open" class="rs-popover-backdrop" @click="closePopover"></div>
    <div
        v-if="popover.open"
        class="rs-popover"
        :style="{ top: popover.y + 'px', left: popover.x + 'px' }"
        role="dialog"
        aria-modal="true"
    >
      <header class="rs-popover-hd">
        <strong>Mesa {{ popover.table?.number }}</strong>
        <button class="rs-popover-close" @click="closePopover" aria-label="Cerrar">×</button>
      </header>

      <div v-if="popover.info?.status === 'active' " class="rs-popover-body">
        <div class="kv"><span class="k">Estado</span><span class="v badge blue">En uso</span></div>
        <div class="kv"><span class="k">Reserva</span><span class="v">#{{ popover.info.id }}</span></div>
        <div class="kv"><span class="k">Cliente</span><span class="v">{{ popover.info.customerName }} ({{ popover.info.quantityPeople }}p)</span></div>
        <div class="kv"><span class="k">Horario</span><span class="v">{{ popover.info.start }}–{{ popover.info.end }}</span></div>
        <div class="kv"><span class="k">Resta</span><span class="v mono">{{ popover.info.leftLabel }}</span></div>
      </div>

      <div v-else-if="popover.info?.status === 'blocked' " class="rs-popover-body">
        <div class="kv"><span class="k">Estado</span><span class="v badge red">Ocupada</span></div>
        <div class="kv"><span class="k">Choque</span><span class="v">#{{ popover.info.id }} · {{ popover.info.start }}–{{ popover.info.end }}</span></div>
        <div class="kv"><span class="k">Cliente</span><span class="v">{{ popover.info.customerName }} ({{ popover.info.quantityPeople }}p)</span></div>
        <div class="kv" v-if="popover.info.reason"><span class="k">Motivo</span><span class="v">{{ popover.info.reason }}</span></div>
      </div>

      <div v-else class="rs-popover-body">
        <div class="kv"><span class="k">Estado</span><span class="v badge green">Disponible</span></div>
        <div v-if="popover.info?.next" class="kv">
          <span class="k">Próxima</span>
          <span class="v">#{{ popover.info.next.id }} · {{ popover.info.next.start }} ({{ popover.info.next.customerName }}, {{ popover.info.next.quantityPeople }}p)</span>
        </div>
        <div class="muted" v-else>Sin próximas reservas para la fecha seleccionada.</div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { computed, reactive, onBeforeUnmount } from 'vue';
import { reservationsStore } from '../../application/reservations.store.js';

const store = reservationsStore;

const props = defineProps({
  tables: { type: Array, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  duration: { type: Number, required: true },
  people: { type: Number, required: true },
  availableTableNumbers: { type: Array, required: true },
  selected: { type: Number, default: null },
});
const emit = defineEmits(['update:selected']);
const modelValue = computed(() => props.selected);

function tryPick(number) {
  if (!props.availableTableNumbers.includes(number)) return;
  if (props.people < 1) return;
  emit('update:selected', number);
}

function handleClick(evt, t) {
  const isAvailable = props.availableTableNumbers.includes(t.number) && props.people <= t.capacity;
  if (isAvailable) {
    tryPick(t.number);
    closePopover();
  } else {
    openPopover(evt, t);
  }
}

function tooltipFor(t) {
  if (props.people > t.capacity) return 'Capacidad insuficiente';
  return props.availableTableNumbers.includes(t.number) ? 'Disponible' : 'Ocupada por otra reserva';
}

function toMinutes(hhmm) { const [h, m] = hhmm.split(':').map(Number); return h * 60 + m; }
function pad2(n) { return String(n).padStart(2, '0'); }
function addMinutes(hhmm, mins) { const m = toMinutes(hhmm) + mins; const h2 = Math.floor((m % (24*60))/60); const m2 = m % 60; return `${pad2(h2)}:${pad2(m2)}`; }
function fmtLeft(ms) { const s = Math.max(0, Math.floor(ms/1000)); return `${pad2(Math.floor(s/3600))}:${pad2(Math.floor((s%3600)/60))}:${pad2(s%60)}`; }
function overlaps(aStart,aEnd,bStart,bEnd){ return aStart < bEnd && aEnd > bStart; }

function tableClass(t) {
  const available = props.availableTableNumbers.includes(t.number);
  if (!props.date || !props.time) return (available && props.people <= t.capacity) ? 'available' : 'blocked';

  const sameDay = store.state.reservations.filter(
      (r) =>
          r.tableNumber === t.number &&
          r.reservationDate === props.date &&
          r.status !== 'canceled' &&
          r.status !== 'completed'
  );

  const selMin = toMinutes(props.time);
  for (const r of sameDay) {
    const start = toMinutes(r.reservationTime);
    const end = start + (r.durationMinutes || 120);
    if (selMin >= start && selMin < end) return 'active-now';
  }
  return (available && props.people <= t.capacity) ? 'available' : 'blocked';
}

/* ---------- POPOVER ---------- */
const popover = reactive({ open: false, table: null, x: 0, y: 0, info: null });

function buildInfo(table) {
  const selectedInstant = new Date(`${props.date}T${props.time}:00`);
  const sel = toMinutes(props.time);
  const reqStart = sel;
  const reqEnd = sel + (props.duration || 120);

  const sameDay = store.state.reservations
      .filter((r) =>
          r.tableNumber === table.number &&
          r.reservationDate === props.date &&
          r.status !== 'canceled' &&
          r.status !== 'completed'
      )
      .sort((a, b) => a.reservationTime.localeCompare(b.reservationTime));

  for (const r of sameDay) {
    const rStart = toMinutes(r.reservationTime);
    const rEnd = rStart + (r.durationMinutes || 120);
    if (sel >= rStart && sel < rEnd) {
      const endStr = addMinutes(r.reservationTime, r.durationMinutes || 120);
      const leftMs = new Date(`${props.date}T${endStr}:00`).getTime() - selectedInstant.getTime();
      return {
        status: 'active',
        id: r.idReservation ?? r.id,
        customerName: r.customerName,
        quantityPeople: r.quantityPeople,
        start: r.reservationTime,
        end: endStr,
        leftLabel: fmtLeft(leftMs),
      };
    }
  }

  const conflict = sameDay.find((r) => {
    const rStart = toMinutes(r.reservationTime);
    const rEnd = rStart + (r.durationMinutes || 120);
    return overlaps(rStart, rEnd, reqStart, reqEnd);
  });
  if (conflict) {
    return {
      status: 'blocked',
      id: conflict.idReservation ?? conflict.id,
      customerName: conflict.customerName,
      quantityPeople: conflict.quantityPeople,
      start: conflict.reservationTime,
      end: addMinutes(conflict.reservationTime, conflict.durationMinutes || 120),
      reason: `Cruza con tu rango ${addMinutes(props.time,0)}–${addMinutes(props.time, props.duration || 120)}`,
    };
  }

  const next = sameDay.find((r) => toMinutes(r.reservationTime) > sel);
  return {
    status: 'available',
    next: next ? {
      id: next.idReservation ?? next.id,
      start: next.reservationTime,
      customerName: next.customerName,
      quantityPeople: next.quantityPeople,
    } : null,
  };
}

function openPopover(evt, t) {
  popover.table = t;
  popover.info = buildInfo(t);
  const m = 12, rect = evt.currentTarget.getBoundingClientRect();
  const vw = window.innerWidth, vh = window.innerHeight;
  const estW = 320, estH = 200;
  let x = rect.right + m, y = rect.top;
  if (x + estW > vw) x = rect.left - estW - m;
  if (x < m) x = m;
  if (y + estH > vh) y = vh - estH - m;
  if (y < m) y = m;
  popover.x = Math.round(x); popover.y = Math.round(y); popover.open = true;
  window.addEventListener('keydown', onKeydown, { passive: true });
}
function closePopover() { popover.open = false; popover.table = null; popover.info = null; window.removeEventListener('keydown', onKeydown); }
function onKeydown(e){ if(e.key==='Escape') closePopover(); }
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown));
</script>

<style scoped>
.board { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 10px; margin-top: 8px; }
.cell { background: #ffffff; border: 2px solid #d1d5db; border-radius: 14px; padding: 12px; color: #111827; cursor: pointer; position: relative; transition: all 0.25s ease; text-align: center; }
.cell:hover { transform: translateY(-3px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
.cell.available { border-color: #22c55e; background: #dcfce7; }
.cell.blocked { background: #fee2e2; border-color: #ef4444; color: #991b1b; opacity: 0.9; cursor: not-allowed; }
.cell.active-now { border-color: #2563eb; background: #dbeafe; box-shadow: 0 0 0 3px rgba(37,99,235,0.25); }
.cell.is-selected { box-shadow: 0 0 0 4px rgba(16,185,129,0.35); }
.rs-popover-backdrop { position: fixed; inset: 0; background: transparent; z-index: 999; }
.rs-popover { position: fixed; width: 320px; max-width: calc(100vw - 24px); background: #ffffff; color: #0f172a; border: 1px solid #e2e8f0; border-radius: 14px; box-shadow: 0 16px 40px rgba(2,6,23,0.18); z-index: 1000; overflow: hidden; }
.rs-popover-hd { display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; border-bottom: 1px solid #e2e8f0; background: #f8fafc; }
.rs-popover-close { border: none; background: transparent; font-size: 18px; line-height: 1; cursor: pointer; color: #334155; }
.rs-popover-body { padding: 12px; display: grid; gap: 8px; font-size: 14px; }
.kv { display: grid; grid-template-columns: 110px 1fr; gap: 8px; align-items: center; }
.k { color: #475569; } .v { color: #0f172a; } .muted { color: #6b7280; }
.badge { display: inline-block; padding: 2px 8px; border-radius: 999px; font-size: 12px; line-height: 1.4; font-weight: 600; }
.badge.blue { background: #dbeafe; color: #1e3a8a; }
.badge.green { background: #dcfce7; color: #166534; }
.badge.red { background: #fee2e2; color: #991b1b; }
.mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace; }
</style>
