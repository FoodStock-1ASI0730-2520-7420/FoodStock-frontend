<template>
  <div class="reservation-page p-6">
    <!-- Header -->
    <div class="mb-4">
      <h2 class="text-5xl font-extrabold text-gray-800 dark:text-gray-100">
        Reservations
      </h2>
    </div>

    <div class="flex justify-center mb-6">
      <button
          class="btn btn-primary"
          @click="openModal"
      >
        Add Reservation
      </button>
    </div>

    <!-- Reservation Table -->
    <div class="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
      <table class="min-w-full border-collapse">
        <thead class="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100">
        <tr>
          <th class="th">Client Name</th>
          <th class="th">Table Number</th>
          <th class="th">People</th>
          <th class="th">Contact</th>
          <th class="th">Email</th>
          <th class="th">Date</th>
          <th class="th">Time</th>
          <th class="th">Status</th>
          <th class="th text-center">Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr
            v-for="(reservation, index) in reservations"
            :key="reservation.id"
            class="hover:bg-gray-50 dark:hover:bg-gray-700 transition"
        >
          <td class="td">{{ reservation.clientName }}</td>
          <td class="td">{{ reservation.tableNumber }}</td>
          <td class="td">{{ reservation.quantityPeople }}</td>
          <td class="td">{{ reservation.contact }}</td>
          <td class="td">{{ reservation.email }}</td>
          <td class="td">{{ reservation.reservationDate }}</td>
          <td class="td">{{ reservation.reservationTime }}</td>
          <td class="td">
              <span
                  :class="[
                    'px-2 py-1 rounded-full text-sm font-semibold',
                    reservation.status === 'Confirmed'
                      ? 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200'
                      : reservation.status === 'Pending'
                      ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-200'
                      : 'bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200'
                  ]"
              >
                {{ reservation.status }}
              </span>
          </td>
          <td class="td text-center space-x-2">
            <button
                class="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                @click="changeStatus(index, 'Confirmed')"
            >
              Confirm
            </button>
            <button
                class="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                @click="changeStatus(index, 'Canceled')"
            >
              Cancel
            </button>
            <button
                class="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700"
                @click="deleteReservation(index)"
            >
              Delete
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- Reservation Modal Component -->
    <ReservationModal
        v-if="showModal"
        @close="closeModal"
        @save="saveReservation"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import ReservationModal from "./ReservationModal.vue";
import {ReservationAPI} from "../../infrastructure/reservation-api.js";

const reservations = ref([]);
const showModal = ref(false);

// Open modal
const openModal = () => showModal.value = true;

// Close modal
const closeModal = () => showModal.value = false;

// Fetch reservations when component is mounted
onMounted(async () => {
  reservations.value = await ReservationAPI.fetchReservations();
});

// Save a new reservation
const saveReservation = async (newReservation) => {
  // Send to API (without id, json-server generates it)
  const saved = await ReservationAPI.saveReservation(newReservation);
  reservations.value.push(saved); // Update local list
  closeModal();
};

// Delete a reservation
const deleteReservation = async (index) => {
  const reservation = reservations.value[index];
  const success = await ReservationAPI.deleteReservation(reservation.id); // Use json-server id
  if (success) reservations.value.splice(index, 1);
};

// Change reservation status
const changeStatus = async (index, newStatus) => {
  const reservation = reservations.value[index];
  reservation.status = newStatus;
  await ReservationAPI.updateReservation(reservation.id, reservation);
};
</script>

<style scoped>
.th { padding: 12px; text-align: left; font-weight: 600; }
.td { padding: 10px; border-top: 1px solid #e5e7eb; }
</style>
