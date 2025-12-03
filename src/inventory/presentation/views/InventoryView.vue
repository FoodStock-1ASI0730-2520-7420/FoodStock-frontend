<script setup>
// No necesitas useRouter aquí porque no lo usas directamente
</script>

<template>
  <div class="inventory-view">
    <h2>{{ $t('inventory.title') }}</h2>
    <div class="nav-links">
      <router-link to="/inventory/dishes" class="btn">
        {{ $t('inventory.viewDishes') }}
      </router-link>
      <router-link to="/inventory/products" class="btn">
        {{ $t('inventory.viewProducts') }}
      </router-link>
    </div>
    <!-- Aquí se renderizan las subrutas (DishesView, ProductsView) -->
    <router-view />
  </div>
</template>

<style scoped>
.inventory-view { padding: 20px; }
.nav-links { margin-bottom: 15px; }
.btn {
  display:inline-block;
  padding:8px 12px;
  background:#2b7be4;
  color:#fff;
  border-radius:6px;
  text-decoration:none;
  margin-right:8px;
}
</style>
