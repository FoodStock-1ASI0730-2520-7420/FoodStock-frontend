<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-container animate-fade-in">
      <h3 class="modal-title">New Reservation</h3>

      <form @submit.prevent="submit" class="form">
        <input
            v-model="reservation.clientName"
            type="text"
            placeholder="Client Name"
            class="input"
            required
        />

        <input
            v-model.number="reservation.tableNumber"
            type="number"
            min="1"
            placeholder="Table Number"
            class="input"
            required
        />

        <input
            v-model.number="reservation.quantityPeople"
            type="number"
            min="1"
            placeholder="Number of People"
            class="input"
            required
        />

        <input
            v-model="reservation.contact"
            type="text"
            placeholder="Contact Number"
            class="input"
            required
        />

        <input
            v-model="reservation.email"
            type="email"
            placeholder="Email Address"
            class="input"
            required
        />

        <input
            v-model="reservation.reservationDate"
            type="date"
            placeholder="Reservation Date"
            class="input"
            required
        />

        <input
            v-model="reservation.reservationTime"
            type="time"
            placeholder="Reservation Time"
            class="input"
            required
        />

        <select v-model="reservation.status" class="input" required>
          <option value="Confirmed">Confirmed</option>
          <option value="Pending">Pending</option>
        </select>

        <div class="actions">
          <button type="button" @click="$emit('close')" class="btn btn-cancel">
            Cancel
          </button>
          <button type="submit" class="btn btn-save">
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive } from "vue";

const emit = defineEmits(["save", "close"]);

const reservation = reactive({
  clientName: "",
  tableNumber: "",
  quantityPeople: 1,
  contact: "",
  email: "",
  reservationDate: "",
  reservationTime: "",
  status: "Pending",
});

const submit = () => {
  if (
      reservation.clientName &&
      reservation.tableNumber &&
      reservation.quantityPeople &&
      reservation.contact &&
      reservation.email &&
      reservation.reservationDate &&
      reservation.reservationTime &&
      reservation.status
  ) {
    const newReservation = {
      idReservation: Date.now(),
      ...reservation
    };
    // Reset fields after saving
    reservation.clientName = "";
    reservation.tableNumber = "";
    reservation.quantityPeople = 1;
    reservation.contact = "";
    reservation.email = "";
    reservation.reservationDate = "";
    reservation.reservationTime = "";
    reservation.status = "Pending";
    emit("save", newReservation);
  }
};
</script>

<style scoped>

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.65);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-container {
  background: #ffffff;
  padding: 1.8rem;
  border-radius: 0.75rem;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.3);
  max-height: 90vh;
  overflow-y: auto;
  transform: translateY(0);
  transition: all 0.3s ease;
}

.animate-fade-in {
  animation: fadeIn 0.25s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.modal-title { font-size: 1.4rem; font-weight: 600; text-align: center; margin-bottom: 1rem; color: #333; }

.form { display: flex; flex-direction: column; gap: 0.75rem; }

.input { width: 100%; padding: 0.6rem 0.8rem; border: 1px solid #ccc; border-radius: 0.5rem; font-size: 0.95rem; transition: border-color 0.2s, box-shadow 0.2s; background: #f9f9f9; }
.input:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.2); background: #fff; }

.actions { display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 0.5rem; }

.btn { padding: 0.55rem 1.2rem; border: none; border-radius: 0.5rem; font-size: 0.95rem; cursor: pointer; font-weight: 500; transition: background-color 0.2s ease, transform 0.2s ease; }
.btn:hover { transform: translateY(-1px); }

.btn-cancel { background: #e5e7eb; color: #333; }
.btn-cancel:hover { background: #d1d5db; }

.btn-save { background: #3b82f6; color: white; }
.btn-save:hover { background: #2563eb; }

@media (prefers-color-scheme: dark) {
  .modal-container { background: #2b2b2b; color: #f0f0f0; }
  .input { background: #3a3a3a; border: 1px solid #555; color: white; }
  .input:focus { border-color: #60a5fa; box-shadow: 0 0 0 3px rgba(96,165,250,0.25); background: #2e2e2e; }
  .btn-cancel { background: #444; color: #f0f0f0; }
  .btn-cancel:hover { background: #555; }
  .btn-save { background: #2563eb; }
  .btn-save:hover { background: #1e40af; }
}
</style>
