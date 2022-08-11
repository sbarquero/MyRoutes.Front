<template>
  <NavBar />
  <RouterView />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { RouterView } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import NavBar from './components/NavBar.vue';

const auth = useAuthStore();

onMounted(async () => {
  auth.init();
});
</script>

<style>
@import '@/assets/css/base.css';

#app {
  margin: 0;
  padding: 0;
  font-weight: normal;
  height: 100vh;
  width: 100vw;
}
</style>
