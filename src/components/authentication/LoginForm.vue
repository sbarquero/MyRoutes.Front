<template>
  <form class="px-4 py-3" style="min-width: 300px">
    <div class="form-floating mb-4 mt-2">
      <!-- Email -->
      <input
        type="email"
        class="form-control"
        id="email"
        :placeholder="t('loginForm.emailPlaceholder')"
        v-model="userForm.email"
      />
      <label for="email" class="form-label">{{ t('loginForm.emailAddress') }}</label>
    </div>
    <!-- Password -->
    <div class="form-floating mb-4">
      <input
        type="password"
        class="form-control"
        id="password"
        :placeholder="t('loginForm.passwordPlaceholder')"
        v-model="userForm.password"
      />
      <label for="password" class="form-label">{{ t('loginForm.password') }}</label>
    </div>
    <!-- Login button -->
    <button @click.prevent="onLogin" type="submit" class="btn btn-secondary">
      {{ t('loginForm.loginButton') }}
    </button>
  </form>
  <div class="dropdown-divider"></div>
  <div class="dropdown-item" @click="auth.form = 'register'">{{ t('loginForm.registerLink') }}</div>
  <div class="dropdown-item" @click="auth.form = 'recover'">
    {{ t('loginForm.forgotPassword') }}
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { showError, showOk } from '@/utils/messages';
import { useAuthStore } from '@/stores/authStore';
import router from '@/router';

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
    showError(t('loginForm.loginError'), message);
  }
  showOk(t('loginForm.loginOk'), message);

  const currentRoute = router.currentRoute.value.name;
  if (currentRoute === 'not-authorized') {
    router.push('/');
  }
}
</script>

<style scoped>
.dropdown-item {
  cursor: pointer;
}
</style>
