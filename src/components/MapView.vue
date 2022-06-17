<template>
  <div v-if="!map.isUserLocationReady" class="loading-map">
    <div class="text-center">
      <h3>{{ t('mapView.pleaseWait') }}</h3>
      <span>{{ t('mapView.locating') }}</span>
    </div>
  </div>
  <div v-show="map.isUserLocationReady" class="map-container">
    <h1 class="text-center">Your Location: {{ map.userLocation }}</h1>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

import { useMapStore } from '@/stores/mapStore';

const { t } = useI18n();
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
