<script setup>
import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>

<template>
  <div class="home-container">
    <h1>{{ t("option.home") }}</h1>
    <p>Has entrado correctamente a FoodStock 🚀</p>
  </div>
</template>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
  background-color: var(--color-bg);
}

h1 {
  margin-bottom: 1.5rem;
  font-size: 2.5rem;
  color: var(--color-primary);
}

p {
  font-size: 1.2rem;
  color: var(--color-text);
}
</style>
