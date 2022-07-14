<template>
  <nav class="navbar navbar-light bg-light">
    <div class="container-fluid">
      <RouterLink to="/" class="navbar-brand mb-0 h1">{{ t('appName') }}</RouterLink>
      <div class="d-flex">
        <div class="mt-1">{{ auth.userName }}</div>
        <!-- User Dropdown -->
        <div v-if="!auth.isAuthenticated" class="dropdown">
          <OptionBtn
            class="button"
            id="dropdownLoginButton"
            data-bs-toggle="dropdown"
            data-bs-auto-close="inside"
            aria-expanded="false"
            :tooltip="t('navBar.tooltip.login')"
          >
            <LoginIcon class="icon" />
          </OptionBtn>
          <div class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuOffset">
            <LoginView />
          </div>
        </div>

        <!-- Logout Button -->
        <OptionBtn
          v-if="auth.isAuthenticated"
          class="button"
          :tooltip="t('navBar.tooltip.logout')"
          @click="onLogout"
        >
          <LogoutIcon class="icon" />
        </OptionBtn>

        <!-- Menu Dropdown -->
        <div class="dropdown">
          <OptionBtn
            class="button"
            id="dropdownMenuButton"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            :tooltip="t('navBar.tooltip.menu')"
            @click="$emit('selectedOptionLogin')"
          >
            <span class="navbar-toggler-icon icon"></span>
          </OptionBtn>
          <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
            <li>
              <h2 class="dropdown-header bg-secondary text-light">Menu</h2>
            </li>
            <li>
              <RouterLink :to="{ name: 'home' }" class="dropdown-item">
                <MapIcon class="icon" />
                <span class="menu-label">{{ t('navBar.home') }}</span>
              </RouterLink>
            </li>
            <li>
              <hr class="dropdown-divider" />
            </li>
            <li>
              <RouterLink
                :to="{ name: 'users' }"
                class="dropdown-item"
                :class="!auth.isAdmin ? 'disabled' : ''"
              >
                <PeopleIcon class="icon" />
                <span class="menu-label">{{ t('navBar.usersManagement') }}</span>
              </RouterLink>
            </li>
            <li>
              <RouterLink
                :to="{ name: 'configuration' }"
                class="dropdown-item"
                :class="!auth.isAuthenticated ? 'disabled' : ''"
              >
                <GearIcon class="icon" />
                <span class="menu-label">{{ t('navBar.configuration') }}</span>
              </RouterLink>
            </li>
            <li>
              <hr class="dropdown-divider" />
            </li>
            <li>
              <RouterLink :to="{ name: 'about' }" class="dropdown-item">
                <InfoIcon class="icon" />
                <span class="menu-label">{{ t('navBar.about') }}</span>
              </RouterLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';
import Swal from 'sweetalert2';

import { useAuthStore } from '../stores/authStore';
import GearIcon from './icons/IconGear.vue';
import InfoIcon from './icons/IconInfo.vue';
import LoginIcon from './icons/IconLogin.vue';
import LoginView from './LoginForm.vue';
import LogoutIcon from './icons/IconLogout.vue';
import MapIcon from './icons/IconMap.vue';
import OptionBtn from './OptionBtn.vue';
import PeopleIcon from './icons/IconPeople.vue';
import router from '../router';
import { useUserStore } from '@/stores/userStore';
import { showError, showOk } from '@/utils/messages';

const { t } = useI18n();
const auth = useAuthStore();
const userStore = useUserStore();

async function onLogout() {
  Swal.fire({
    title: t('navBar.onLogout.question.title'),
    text: t('navBar.onLogout.question.text'),
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: t('navBar.onLogout.question.confirmButtonText'),
    cancelButtonText: t('navBar.onLogout.question.cancelButtonText'),
  }).then(async result => {
    if (result.isConfirmed) {
      const result = await auth.logout();
      userStore.$reset();
      if (result.ok) {
        showOk(t('navBar.onLogout.success.title'));
      } else {
        showError(result.message);
      }
      router.push('/');
    }
  });
}
</script>

<style scoped>
.button {
  margin-left: 1rem;
}

.icon {
  width: 1.2rem;
  height: 1.2rem;
}

.menu-label {
  align-items: cente;
  margin-left: 1rem;
}
</style>
