<template>
  <div class="reservation-card">
    <div class="card-header">
      <h3 class="table-info">
        🪑 Mesa {{ reservation.tableNumber }}
        <span class="people-count">• {{ reservation.quantityPeople }} personas</span>
      </h3>
      <p class="date-info">
        📅 {{ reservation.reservationDate }} | ⏰ {{ reservation.reservationTime }}
      </p>
    </div>

    <div class="divider"></div>

    <div class="actions">
      <button class="btn edit" @click="$emit('editReservation', reservation.idReservation)">
        ✏️ Editar
      </button>
      <button class="btn delete" @click="$emit('deleteReservation', reservation.idReservation)">
        🗑️ Eliminar
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({ reservation: Object });
const emit = defineEmits(["deleteReservation", "editReservation"]);
</script>

<style scoped>
.reservation-card {
  padding: 1rem;
  background-color: #ffffff;
  border-radius: 14px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  width: 270px;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.reservation-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.table-info {
  font-size: 1.2rem;
  font-weight: 600;
  color: #ff7043;
  margin: 0;
}

.people-count {
  font-size: 0.95rem;
  color: #666;
  margin-left: 5px;
}

.date-info {
  font-size: 0.9rem;
  color: #444;
  margin-top: 4px;
}

.divider {
  height: 1px;
  background: #e5e5e5;
  margin: 0.25rem 0;
}

.actions {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  margin-top: auto;
}

.btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  padding: 0.55rem 0.75rem;
  font-size: 0.9rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s ease, transform 0.2s ease;
}

.btn:hover {
  transform: translateY(-2px);
}

.btn.edit {
  background-color: #ffa726;
  color: #fff;
}

.btn.edit:hover {
  background-color: #fb8c00;
}

.btn.delete {
  background-color: #ef5350;
  color: #fff;
}

.btn.delete:hover {
  background-color: #d32f2f;
}

/* Dark Mode */
@media (prefers-color-scheme: dark) {
  .reservation-card {
    background-color: #2d2d2d;
    color: #f0f0f0;
  }

  .people-count,
  .date-info {
    color: #ccc;
  }

  .divider {
    background: #444;
  }
}
</style>
