<!-- path: src/layouts/Layout.vue -->
<script setup>
import LanguageSwitcher from "./language-switcher.vue";
import FooterContent from "./footer-content.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

// Navegación principal
const items = [
  { label: "option.home", to: "/home" },
  { label: "option.inventory", to: "/inventory/dishes" },
  { label: "option.sales", to: "/sales/list" },
  { label: "option.suppliers", to: "/suppliers" },
  { label: "option.reservation", to: "/reservations" },
  { label: "option.reports", to: "/reports" }
];
</script>

<template>
  <div class="layout">
    <!-- HEADER -->
    <header class="header">
      <div class="header-inner">

        <!-- IZQUIERDA -->
        <div class="brand">FoodStock</div>

        <!-- DERECHA (MENÚ + IDIOMAS) -->
        <div class="right-group">
          <nav class="nav">
            <router-link
                v-for="item in items"
                :key="item.label"
                :to="item.to"
                class="nav-link"
            >
              {{ t(item.label) }}
            </router-link>
          </nav>

          <language-switcher />
        </div>

      </div>
    </header>

    <!-- CONTENIDO -->
    <main class="main-content">
      <router-view />
    </main>

    <!-- FOOTER -->
    <footer class="footer">
      <footer-content />
    </footer>
  </div>
</template>

<style scoped>
/* Layout global */
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--color-bg);
}

/* Header Base */
.header {
  width: 100%;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
}

.header-inner {
  max-width: 1450px;
  margin: 0 auto;
  height: 72px;
  display: flex;
  align-items: center;
  padding: 0 32px;
}

/* IZQUIERDA */
.brand {
  font-size: 22px;
  font-weight: 800;
  color: #1a1a1a;
}

/* CONTENEDOR DERECHO */
.right-group {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 32px;
}

/* Navegación derecha */
.nav {
  display: flex;
  gap: 26px;
}

.nav-link {
  color: #4a4a4a;
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;
  padding: 4px 0;
  transition: color 0.25s ease;
}

.nav-link:hover {
  color: #111;
}

/* Contenido */
.main-content {
  flex: 1;
  padding: 40px 32px 90px;
}

/* Footer */
.footer {
  background: #ffffff;
  border-top: 1px solid #e5e7eb;
  padding: 16px;
  text-align: center;
  color: #666;
}
</style>
