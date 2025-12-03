<template>
  <div>
    <h2>Reservation List</h2>
    <ul>
      <li v-for="res in reservations" :key="res.idReservation">
        Table: {{ res.tableNumber }}, People: {{ res.quantityPeople }}, Date: {{ res.reservationDate }}, Time: {{ res.reservationTime }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  reservations: Array
});
</script>