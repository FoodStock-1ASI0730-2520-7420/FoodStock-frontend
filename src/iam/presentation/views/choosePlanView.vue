<template>
  <div class="auth-wrapper">
    <div class="auth-card">
      <h2>Selecciona tu plan</h2>

      <!-- Opciones de plan -->
      <div class="plan-options">
        <button
            :class="{ active: selectedPlan === 'Estándar' }"
            @click="selectPlan('Estándar')"
        >
          Estándar - $5/mes
        </button>
        <button
            :class="{ active: selectedPlan === 'Premium' }"
            @click="selectPlan('Premium')"
        >
          Premium - $25/mes
        </button>
      </div>

      <!-- Formulario de pago -->
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

        <button :disabled="loading" @click="confirmPayment">Confirmar y continuar</button>
        <p v-if="error" class="error">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedPlan: null,
      card: {
        number: "",
        cvv: "",
        expiry: ""
      },
      loading: false,
      error: ""
    };
  },
  methods: {
    selectPlan(plan) {
      this.selectedPlan = plan;
    },
    async confirmPayment() {
      this.error = "";

      // Validación básica
      if (!this.card.number || !this.card.cvv || !this.card.expiry) {
        this.error = "Completa todos los campos de la tarjeta.";
        return;
      }

      this.loading = true;

      // Simular guardado del plan en el usuario
      const user = JSON.parse(localStorage.getItem("tempUser"));
      if (user) {
        user.plan = this.selectedPlan;
        localStorage.setItem("tempUser", JSON.stringify(user));
      }

      this.loading = false;
      this.$router.push("/login");
    }
  }
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
  max-width: 480px;
}
h2 {
  margin-bottom: 1rem;
  text-align: center;
}
h3 {
  margin-top: 1.5rem;
  margin-bottom: 1rem;
}
.plan-options {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 1rem;
}
.plan-options button {
  padding: 0.8rem 1.2rem;
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
.payment-form {
  margin-top: 1rem;
}
.form-group {
  margin-bottom: 1rem;
}
label {
  display: block;
  margin-bottom: 0.3rem;
  font-weight: 500;
}
input {
  width: 100%;
  padding: 0.6rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
}
button {
  width: 100%;
  padding: 0.8rem;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
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
