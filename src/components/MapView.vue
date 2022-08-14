<template>
  <div v-if="!map.isUserLocationReady" class="loading-map">
    <div class="text-center">
      <h3>{{ t('homeView.mapView.pleaseWait') }}</h3>
      <span>{{ t('homeView.mapView.locating') }}</span>
    </div>
  </div>
  <div v-show="map.isUserLocationReady" class="map-container">
    <!-- <OpenLayersBasic /> -->
    <!-- <Vue3OpenLayersBasic /> -->
    <MapBoxGLBasic />
  </div>
  <!-- Location tag-->
  <div class="fixed-bottom d-flex justify-content-center">
    <div class="location">
      <b>Location</b> Lng: {{ map.userLocation[0] }}, Lat: {{ map.userLocation[1] }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

import { useMapStore } from '@/stores/mapStore';
// import OpenLayersBasic from './OpenLayersBasic.vue';
// import Vue3OpenLayersBasic from './Vue3OpenLayersBasic.vue';
import MapBoxGLBasic from './MapBoxGLBasic.vue';

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
  position: absolute;
  width: 100vw;
  height: calc(100% - 3rem);
}

.location {
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 0.5rem;
  bottom: 1rem;
  /* offset-x | offset-y | blur-radius | spread-radius | color */
  box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);
  color: #444;
  margin: auto;
  padding: 0rem 1rem;
  position: absolute;
  font-size: 1rem;
  z-index: 2;
}
</style>
