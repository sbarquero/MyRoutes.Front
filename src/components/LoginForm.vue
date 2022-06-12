<template>
  <form class="px-4 py-3" style="min-width: 300px">
    <div class="mb-3">
      <label for="email" class="form-label">Email address</label>
      <input
        type="email"
        class="form-control"
        id="email"
        placeholder="email@example.com"
        v-model="userForm.email"
      />
    </div>
    <div class="mb-3">
      <label for="password" class="form-label">Password</label>
      <input
        type="password"
        class="form-control"
        id="password"
        placeholder="Password"
        v-model="userForm.password"
      />
    </div>
    <div class="mb-3">
      <div class="form-check">
        <input type="checkbox" class="form-check-input" id="dropdownCheck" />
        <label class="form-check-label" for="dropdownCheck"> Remember me </label>
      </div>
    </div>
    <button @click.prevent="onLogin" type="submit" class="btn btn-secondary">Sign in</button>
  </form>
  <div class="dropdown-divider"></div>
  <a class="dropdown-item" href="#">New around here? Sign up</a>
  <a class="dropdown-item" href="#">Forgot password?</a>
</template>

<script setup lang="ts">
import Swal from 'sweetalert2';
import { useAuthStore } from '@/stores/authStore';
import { ref } from 'vue';

interface User {
  email: string;
  password: string;
}

const auth = useAuthStore();
const userForm = ref({
  email: '',
  password: '',
});

async function onLogin() {
  const user: User = {
    email: userForm.value.email,
    password: userForm.value.password,
  };
  const { ok, message } = await auth.login(user);

  if (!ok) {
    Swal.fire({ title: 'Error', text: message, icon: 'error', timer: 3000 });
  }
}
</script>

<style scoped></style>
