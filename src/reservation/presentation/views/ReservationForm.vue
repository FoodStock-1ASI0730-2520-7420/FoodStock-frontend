<template>
  <div class="reservation-form">
    <h2 class="form-title">New Reservation</h2>
    <form @submit.prevent="submitForm" class="form-body">
      <div class="form-group">
        <label>Table</label>
        <input
            type="number"
            v-model="tableNumber"
            placeholder="Table Number"
            required
        />
      </div>

      <div class="form-group">
        <label>People</label>
        <input
            type="number"
            v-model="quantityPeople"
            placeholder="Number of People"
            required
        />
      </div>

      <div class="form-group">
        <label>Date</label>
        <input type="date" v-model="reservationDate" required />
      </div>

      <div class="form-group">
        <label>Time</label>
        <input type="time" v-model="reservationTime" required />
      </div>

      <button type="submit" class="btn-primary">
        Add Reservation
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const emit = defineEmits(['addReservation']);

const tableNumber = ref('');
const quantityPeople = ref('');
const reservationDate = ref('');
const reservationTime = ref('');

function submitForm() {
  emit('addReservation', {
    idReservation: Date.now(),
    tableNumber: tableNumber.value,
    quantityPeople: quantityPeople.value,
    reservationDate: reservationDate.value,
    reservationTime: reservationTime.value
  });

  tableNumber.value = '';
  quantityPeople.value = '';
  reservationDate.value = '';
  reservationTime.value = '';
}
</script>

<style scoped>
.reservation-form {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  max-width: 420px;
  margin: 2rem auto;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.reservation-form:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.form-title {
  text-align: center;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #ff7043;
}

.form-body {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.form-group label {
  font-size: 0.95rem;
  font-weight: 500;
  color: #333;
}

.form-group input {
  padding: 0.6rem 0.8rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  font-size: 0.95rem;
  transition: all 0.2s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #ff7043;
  box-shadow: 0 0 0 3px rgba(255, 112, 67, 0.2);
}

.btn-primary {
  background-color: #ff7043;
  color: white;
  font-weight: 100;
  font-size: 1rem;
  padding: 0.75rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.1s ease, box-shadow 0.1s ease;
  box-shadow: 0 4px #d35400;
}

.btn-primary:hover {
  background-color: #e64a19;
}

.btn-primary:active {
  transform: translateY(2px);
  box-shadow: 0 2px #d35400;
}

/* Support for dark mode */
@media (prefers-color-scheme: dark) {
  .reservation-form {
    background: #2d2d2d;
    color: #f0f0f0;
  }
  .form-group label {
    color: #f0f0f0;
  }
  .form-group input {
    background: #444;
    color: white;
    border: 1px solid #666;
  }
  .form-group input:focus {
    border-color: #ff7043;
    box-shadow: 0 0 0 3px rgba(255, 112, 67, 0.3);
  }
}
</style>