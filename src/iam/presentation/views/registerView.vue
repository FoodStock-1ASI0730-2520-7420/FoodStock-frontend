<template>
  <div class="auth-wrapper">
    <div class="auth-card">
      <h2>Registro de usuario</h2>

      <div class="form-grid">
        <!-- Datos personales -->
        <div class="form-section">
          <h3>Datos personales</h3>
          <div class="form-group">
            <label>Nombre</label>
            <input v-model="form.name" placeholder="Tu nombre" />
          </div>
          <div class="form-group">
            <label>Email</label>
            <input v-model="form.email" type="email" placeholder="correo@ejemplo.com" />
          </div>
          <div class="form-group">
            <label>Contraseña</label>
            <input v-model="form.password" type="password" placeholder="********" />
          </div>
          <div class="form-group">
            <label>Teléfono</label>
            <input v-model="form.phone" placeholder="987654321" />
          </div>
          <div class="form-group">
            <label>Segmento</label>
            <select v-model="form.segment">
              <option value="emprendedor">Emprendedor</option>
              <option value="microempresas">Microempresas</option>
            </select>
          </div>
        </div>

        <!-- Imagen de perfil -->
        <div class="form-section">
          <h3>Imagen de perfil</h3>
          <div class="form-group">
            <label>Selecciona una imagen</label>
            <input type="file" @change="handleImageUpload" />
            <p v-if="form.profilePicture">Archivo: {{ form.profilePicture }}</p>
          </div>
        </div>

        <!-- Plan y pago -->
        <div class="form-section">
          <h3>Selecciona tu plan</h3>
          <div class="plan-options">
            <button
                :class="{ active: selectedPlan === 'Estándar-Mensual' }"
                @click="selectPlanOption('Estándar-Mensual', 5)"
            >
              Estándar - $5/mes
            </button>
            <button
                :class="{ active: selectedPlan === 'Premium-Mensual' }"
                @click="selectPlanOption('Premium-Mensual', 25)"
            >
              Premium - $25/mes
            </button>
            <button
                :class="{ active: selectedPlan === 'Estándar-Anual' }"
                @click="selectPlanOption('Estándar-Anual', 60)"
            >
              Estándar - $60/año
            </button>
            <button
                :class="{ active: selectedPlan === 'Premium-Anual' }"
                @click="selectPlanOption('Premium-Anual', 300)"
            >
              Premium - $300/año
            </button>
          </div>

          <div v-if="selectedPlan" class="payment-form">
            <h3>Información de pago</h3>
            <div class="form-group">
              <label>Número de tarjeta</label>
              <input v-model="card.number" placeholder="1234 5678 9012 3456" />
            </div>
            <div class="form-group">
              <label>CVV</label>
              <input v-model="card.cvv" placeholder="123" />
            </div>
            <div class="form-group">
              <label>Fecha de vencimiento</label>
              <input v-model="card.expiry" placeholder="MM/YY" />
            </div>
          </div>
        </div>
      </div>

      <!-- Botón final -->
      <button :disabled="loading" @click="handleRegister">Registrarme y pagar</button>
      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </div>
</template>

<script>
import { registerUser } from "../../application/auth.service";

export default {
  data() {
    return {
      form: {
        name: "",
        email: "",
        password: "",
        phone: "",
        segment: "emprendedor",
        profilePicture: null,
      },
      selectedPlan: null,
      planPrice: 0,
      card: {
        number: "",
        cvv: "",
        expiry: "",
      },
      loading: false,
      error: "",
    };
  },
  methods: {
    selectPlanOption(plan, price) {
      this.selectedPlan = plan;
      this.planPrice = price;
    },
    handleImageUpload(event) {
      const file = event.target.files[0];
      this.form.profilePicture = file ? file.name : null;
    },
    async handleRegister() {
      this.error = "";

      if (!this.form.name || !this.form.email || !this.form.password) {
        this.error = "Completa todos los campos de registro.";
        return;
      }
      if (!this.card.number || !this.card.cvv || !this.card.expiry) {
        this.error = "Completa todos los campos de la tarjeta.";
        return;
      }
      if (!this.selectedPlan) {
        this.error = "Debes seleccionar un plan.";
        return;
      }

      this.loading = true;

      const { ok, message, user } = await registerUser({
        ...this.form,
        plan: this.selectedPlan,
      });

      this.loading = false;

      if (!ok) {
        this.error = message;
        return;
      }

      this.$router.push("/home");
    },
  },
};
</script>

<style scoped>
.auth-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: var(--color-bg);
}
.auth-card {
  background: var(--color-card-bg);
  padding: 2rem;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
  width: 100%;
  max-width: 1080px;
}
h2 {
  text-align: center;
  margin-bottom: 2rem;
}
h3 {
  margin-bottom: 1rem;
}
.form-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}
.form-section {
  background-color: #f9f9f9;
  padding: 1rem;
  border-radius: var(--radius-md);
}
.form-group {
  margin-bottom: 1rem;
}
label {
  display: block;
  margin-bottom: 0.3rem;
  font-weight: 500;
}
input, select {
  width: 100%;
  padding: 0.6rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
}
.plan-options {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.plan-options button {
  padding: 0.6rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background-color: #f0f0f0;
  cursor: pointer;
}
.plan-options button.active {
  border: 2px solid var(--color-primary);
  background-color: var(--color-primary);
  color: white;
}
button {
  width: 100%;
  padding: 0.8rem;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  margin-top: 2rem;
}
button:hover {
  background-color: var(--color-primary-hover);
}
.error {
  color: #d93025;
  margin-top: 0.5rem;
  text-align: center;
}
</style>
