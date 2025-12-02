<template>
  <div class="auth-wrapper">
    <div class="auth-card">
      <h2>Iniciar sesión</h2>

      <div class="form-group">
        <label>Correo</label>
        <input v-model="form.email" type="email" placeholder="ejemplo@correo.com" />
      </div>

      <div class="form-group">
        <label>Contraseña</label>
        <input v-model="form.password" type="password" placeholder="••••••••" />
      </div>

      <button :disabled="loading" @click="handleLogin">Ingresar</button>

      <p class="link-text">
        ¿No tienes cuenta?
        <router-link to="/register">Regístrate aquí</router-link>
      </p>

      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </div>
</template>

<script>
import { loginUser } from "../../application/auth.service";

export default {
  data() {
    return { form: { email: "", password: "" }, loading: false, error: "" };
  },
  methods: {
    async handleLogin() {
      this.error = "";
      this.loading = true;
      const { ok, message } = await loginUser(this.form); // ahora devuelve {ok, user, message}
      this.loading = false;
      if (!ok) {
        this.error = message;
        return;
      }
      this.$router.push("/home");
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
  max-width: 400px;
}
h2 {
  margin-bottom: 1rem;
  text-align: center;
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
.link-text {
  margin-top: 1rem;
  text-align: center;
}
.error {
  color: #d93025;
  margin-top: 0.5rem;
  text-align: center;
}
</style>
