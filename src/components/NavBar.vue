<template>
  <nav class="navbar navbar-light bg-light">
    <div class="container-fluid">
      <RouterLink to="/" class="navbar-brand mb-0 h1">MyRoutes</RouterLink>
      <div class="d-flex">
        <!-- User Dropdown -->
        <div v-if="!auth.isAuthenticated" class="dropdown">
          <OptionBtn
            class="button"
            id="dropdownLoginButton"
            data-bs-toggle="dropdown"
            data-bs-auto-close="inside"
            aria-expanded="false"
            tooltip="Login"
          >
            <LoginIcon class="icon" />
          </OptionBtn>
          <div class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuOffset">
            <LoginView />
          </div>
        </div>

        <!-- Logout Button -->
        <OptionBtn v-if="auth.isAuthenticated" class="button" tooltip="Logout" @click="onLogout">
          <LogoutIcon class="icon" />
        </OptionBtn>

        <!-- Menu Dropdown -->
        <div class="dropdown">
          <OptionBtn
            class="button"
            id="dropdownMenuButton"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            tooltip="Menu"
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
                <span class="menu-label">Home</span>
              </RouterLink>
            </li>
            <li>
              <hr class="dropdown-divider" />
            </li>
            <li>
              <RouterLink
                :to="{ name: 'users' }"
                class="dropdown-item"
                :class="auth.rol != 'admin' ? 'disabled' : ''"
              >
                <PeopleIcon class="icon" />
                <span class="menu-label">Users management</span>
              </RouterLink>
            </li>
            <li>
              <RouterLink :to="{ name: 'configuration' }" class="dropdown-item">
                <GearIcon class="icon" />
                <span class="menu-label">Configuration</span>
              </RouterLink>
            </li>
            <li>
              <hr class="dropdown-divider" />
            </li>
            <li>
              <RouterLink :to="{ name: 'about' }" class="dropdown-item">
                <InfoIcon class="icon" />
                <span class="menu-label">About</span>
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
import Swal from 'sweetalert2';

import GearIcon from './icons/IconGear.vue';
import InfoIcon from './icons/IconInfo.vue';
import LoginIcon from './icons/IconLogin.vue';
import LoginView from './LoginForm.vue';
import LogoutIcon from './icons/IconLogout.vue';
import MapIcon from './icons/IconMap.vue';
import OptionBtn from './OptionBtn.vue';
import PeopleIcon from './icons/IconPeople.vue';
import { useAuthStore } from '../stores/authStore';
import router from '../router';

const auth = useAuthStore();

function onLogout() {
  Swal.fire({
    title: 'Are you sure you want to logout?',
    text: 'Your user will be logged out.',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, logout!',
  }).then(result => {
    if (result.isConfirmed) {
      Swal.fire({
        title: 'You are logged out.',
        icon: 'success',
        showConfirmButton: false,
        timer: 1500,
      });
      auth.logout();
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
