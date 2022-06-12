<template>
  <div v-if="!map.isUserLocationReady" class="loading-map">
    <div class="text-center">
      <h3>Please wait!!</h3>
      <span>Locating...</span>
    </div>
  </div>
  <div v-show="map.isUserLocationReady" class="map-container">
    <h1 class="text-center">Your Location: {{ map.userLocation }}</h1>
  </div>
</template>

<script setup lang="ts">
import { useMapStore } from '@/stores/mapStore';
import { onMounted } from 'vue';

const map = useMapStore();

onMounted(() => {
  map.getInitialLocation();
});
</script>

<style scoped>
.loading-map {
  align-items: center;
  display: flex;
  height: 100vh;
  justify-content: center;
  left: 0;
  position: fixed;
  top: 0px;
  width: 100vw;
  text-align: center;
}

.map-container {
  position: fixed;
  width: 100vw;
  height: 100%;
}
</style>
