<template>
  <form class="px-4 py-3" style="min-width: 300px">
    <div class="mb-3">
      <label for="email" class="form-label">{{ t('loginForm.emailAddress') }}</label>
      <input
        type="email"
        class="form-control"
        id="email"
        :placeholder="t('loginForm.emailAddress')"
        v-model="userForm.email"
      />
    </div>
    <div class="mb-4">
      <label for="password" class="form-label">{{ t('loginForm.password') }}</label>
      <input
        type="password"
        class="form-control"
        id="password"
        :placeholder="t('loginForm.passwordPlaceholder')"
        v-model="userForm.password"
      />
    </div>
    <button @click.prevent="onLogin" type="submit" class="btn btn-secondary">
      {{ t('loginForm.loginButton') }}
    </button>
  </form>
  <div class="dropdown-divider"></div>
  <a class="dropdown-item" href="#">{{ t('loginForm.registerLink') }}</a>
  <a class="dropdown-item" href="#">{{ t('loginForm.forgotPassword') }}</a>
</template>

<script setup lang="ts">
import Swal from 'sweetalert2';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { useAuthStore } from '@/stores/authStore';

interface User {
  email: string;
  password: string;
}

const { t } = useI18n();
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
