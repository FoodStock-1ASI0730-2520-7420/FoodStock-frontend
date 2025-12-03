<!-- presentation/view/salesReport-detail.vue -->
<template>
  <div>
    <h1></h1>
    <p> </p>
    <pre>{{ example }}</pre>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
const example = ref('Select a report or use filters to show details.');
onMounted(() => {

});
</script>
