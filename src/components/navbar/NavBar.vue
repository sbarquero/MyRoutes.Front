<template>
  <nav class="navbar navbar-light bg-light" :class="globalStore.isEditing ? 'navbar-disabled' : ''">
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
            data-bs-auto-close="outside"
            aria-expanded="false"
            :tooltip="t('navBar.tooltip.login')"
            @click="auth.form = 'login'"
          >
            <LoginIcon class="icon" />
          </OptionBtn>
          <div class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuOffset">
            <div v-if="auth.form === 'login'">
              <LoginForm />
            </div>
            <div v-else-if="auth.form === 'recover'">
              <RecoverForm />
            </div>
            <div v-else-if="auth.form === 'register'">
              <RegisterForm />
            </div>
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
          <ul
            class="dropdown-menu dropdown-menu-end mt-0 pt-0"
            aria-labelledby="dropdownMenuButton"
          >
            <li>
              <h2 class="dropdown-header bg-primary bg-opacity-50 text-light">Menu</h2>
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
              <RouterLink :to="{ name: 'users' }" class="dropdown-item" v-if="auth.isAdmin">
                <PeopleIcon class="icon" />
                <span class="menu-label">{{ t('navBar.usersManagement') }}</span>
              </RouterLink>
            </li>
            <li>
              <RouterLink
                :to="{ name: 'tracks' }"
                class="dropdown-item"
                :class="!auth.isAuthenticated ? 'disabled' : ''"
              >
                <MapIcon class="icon" />
                <span class="menu-label">{{ t('navBar.trackManagement') }}</span>
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
  <!-- if there is an edit in progress, the navbar will be disabled -->
  <div v-if="globalStore.isEditing" class="navbar-filter-disabled"></div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';
import Swal from 'sweetalert2';

import { showError, showOk } from '@/utils/messages';
import { useAuthStore } from '../../stores/authStore';
import { useGlobalStore } from '../../stores/globalStore';
import { useTrackStore } from '@/stores/trackStore';
import { useUserStore } from '@/stores/userStore';
import GearIcon from '../icons/IconGear.vue';
import InfoIcon from '../icons/IconInfo.vue';
import LoginForm from '../authentication/LoginForm.vue';
import LoginIcon from '../icons/IconLogin.vue';
import LogoutIcon from '../icons/IconLogout.vue';
import MapIcon from '../icons/IconMap.vue';
import OptionBtn from '../shared/OptionBtn.vue';
import PeopleIcon from '../icons/IconPeople.vue';
import RecoverForm from '../authentication/RecoverForm.vue';
import RegisterForm from '../authentication/RegisterForm.vue';
import router from '../../router';

const { t } = useI18n();
const auth = useAuthStore();
const globalStore = useGlobalStore();
const trackStore = useTrackStore();
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
      trackStore.$reset();
      if (result.ok) {
        showOk(t('navBar.onLogout.success.title'));
      } else {
        showError(result.message);
      }
      await router.push({ name: 'home' });
      router.go(0);
    }
  });
}
</script>

<style scoped>
.navbar {
  /* offset-x | offset-y | blur-radius | spread-radius | color */
  box-shadow: var(--navbar-shadow);
  height: 3rem;
  padding: 0.25rem;
  z-index: 3;
}
.navbar-disabled {
  opacity: 0.5;
}

.navbar-filter-disabled {
  background-color: var(--navbar-disabled-filter-background-color);
  cursor: not-allowed;
  height: 3rem;
  left: 0;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 4;
}

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