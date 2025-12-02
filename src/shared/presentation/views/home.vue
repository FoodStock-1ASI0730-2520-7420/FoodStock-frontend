<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const router = useRouter();

const user = ref(null);

onMounted(() => {
  const email = localStorage.getItem("userEmail");
  const data = JSON.parse(localStorage.getItem("tempUser"));
  if (data?.email === email) {
    user.value = data;
  }
});

function logout() {
  localStorage.removeItem("authToken");
  localStorage.removeItem("userEmail");
  router.push("/login");
}
</script>

<template>
  <div class="profile-container">
    <!-- Imagen de perfil -->
    <div class="profile-left">
      <div class="image-wrapper">
        <img
            v-if="user?.profilePicture"
            :src="`/images/${user.profilePicture}`"
            alt="Foto de perfil"
        />
        <div v-else class="image-placeholder">Foto de perfil</div>
      </div>
    </div>

    <!-- Datos del usuario -->
    <div class="profile-right">
      <h1>Bienvenido, {{ user?.name }}</h1>

      <div class="info-card">
        <div class="info-row">
          <i class="pi pi-envelope"></i>
          <span>{{ user?.email }}</span>
        </div>
        <div class="info-row">
          <i class="pi pi-phone"></i>
          <span>{{ user?.phone }}</span>
        </div>
        <div class="info-row">
          <i class="pi pi-users"></i>
          <span>{{ user?.segment === 'microempresas' ? 'Microempresas' : 'Emprendedor' }}</span>
        </div>
        <div class="info-row">
          <i class="pi pi-star"></i>
          <span>{{ user?.plan || 'No seleccionado' }}</span>
        </div>
      </div>

      <button class="logout-btn" @click="logout">Cerrar sesión</button>
    </div>
  </div>
</template>

<style scoped>
.profile-container {
  display: flex;
  flex-wrap: wrap;
  padding: 3rem 2rem;
  gap: 2rem;
  background-color: var(--color-bg);
}

.profile-left {
  flex: 1 1 300px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.image-wrapper img {
  width: 280px;
  height: 280px;
  object-fit: cover;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
}

.image-placeholder {
  width: 280px;
  height: 280px;
  background-color: #ccc;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #555;
}

.profile-right {
  flex: 2 1 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

h1 {
  margin-bottom: 1.5rem;
  font-size: 2rem;
  color: var(--color-primary);
}

.info-card {
  background-color: var(--color-card-bg);
  padding: 1.5rem;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 1rem;
  color: var(--color-text);
}

.logout-btn {
  margin-top: 2rem;
  padding: 0.8rem;
  background-color: #d93025;
  color: white;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-weight: 500;
  width: 100%;
}

.logout-btn:hover {
  background-color: #b22222;
}
</style>