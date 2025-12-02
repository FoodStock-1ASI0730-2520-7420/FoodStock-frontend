<template>
  <div class="auth-wrapper">
    <div class="auth-card">
      <h2>Crear cuenta</h2>

      <div class="form-group">
        <label>Nombre</label>
        <input v-model="form.name" placeholder="Tu nombre completo" />
      </div>

      <div class="form-group">
        <label>Correo</label>
        <input v-model="form.email" type="email" placeholder="ejemplo@correo.com" />
      </div>

      <div class="form-group">
        <label>Contraseña</label>
        <input v-model="form.password" type="password" placeholder="••••••••" />
      </div>

      <div class="form-group">
        <label>Teléfono</label>
        <input v-model="form.phone" placeholder="999999999" />
      </div>

      <div class="form-group">
        <label>Segmento</label>
        <select v-model="form.segment">
          <option disabled value="">Selecciona segmento</option>
          <option value="microempresas">Microempresas</option>
          <option value="emprendedor">Emprendedor</option>
        </select>
      </div>

      <div class="form-group">
        <label>Imagen de perfil</label>
        <input type="file" @change="handleImage" accept="image/*" />
        <img v-if="preview" :src="preview" class="preview" />
      </div>

      <button :disabled="loading" @click="handleRegister">Continuar</button>
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
        segment: "",
        profilePicture: null,
        plan: null
      },
      preview: null,
      loading: false,
      error: ""
    };
  },
  methods: {
    handleImage(e) {
      const file = e.target.files[0];
      if (file) {
        this.form.profilePicture = file.name;
        this.preview = URL.createObjectURL(file);
      }
    },
    async handleRegister() {
      this.error = "";
      if (!this.form.name || !this.form.email || !this.form.password || !this.form.segment) {
        this.error = "Completa los campos requeridos.";
        return;
      }
      this.loading = true;
      const ok = await registerUser(this.form);
      this.loading = false;
      if (!ok) {
        this.error = "No se pudo registrar.";
        return;
      }
      this.$router.push("/choose-plan");
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
  text-align: center;
  margin-bottom: 1rem;
}
.form-group {
  margin-bottom: 1rem;
}
label {
  display: block;
  margin-bottom: 0.3rem;
  font-weight: 500;
}
input,
select {
  width: 100%;
  padding: 0.6rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
}
.preview {
  margin-top: 0.5rem;
  max-width: 100%;
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
