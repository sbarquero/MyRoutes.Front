<template>
  <div v-if="!isUserLocationReady" class="loading-map">
    <div class="text-center">
      <h3>{{ t('homeView.mapView.pleaseWait') }}</h3>
      <span>{{ t('homeView.mapView.locating') }}</span>
    </div>
  </div>
  <div v-else class="map-container">
    <!-- Map Div -->
    <div id="mapContainer" class="map" ref="mapElement"></div>
    <!-- Location tag-->
    <div class="fixed-bottom d-flex justify-content-center">
      <div class="location">
        <b>Location</b> Lng: {{ userLocation[0] }}, Lat: {{ userLocation[1] }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { onMounted, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';

import { sleep } from '@/utils/timer';
import { useMapStore } from '@/stores/mapStore';
import { useTrackStore } from '@/stores/trackStore';

const { t } = useI18n();
const { isUserLocationReady, userLocation } = storeToRefs(useMapStore());
const mapStore = useMapStore();
const mapElement = ref<HTMLDivElement>();
const { selectedTrack, previousTrack } = storeToRefs(useTrackStore());

let map: L.Map;

onMounted(async () => {
  mapStore.getInitialLocation();
  while (!isUserLocationReady.value) {
    await sleep(100);
  }
  initMap();
});

watch(selectedTrack, async () => {
  const geoJson = L.geoJSON(selectedTrack.value.geojsonData); //.addTo(map);

  previousTrack.value = geoJson;

  geoJson.addTo(map);
  map.flyToBounds(geoJson.getBounds());
});

async function initMap() {
  if (!mapElement.value) throw new Error('Div Element no exists');
  if (!userLocation.value) throw new Error('UserLocation no exists');

  map = L.map(mapElement.value).setView(userLocation.value, 16);
  L.tileLayer(
    'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',
    {
      attribution:
        'Map data (c) <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox/streets-v11',
      accessToken:
        'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw',
    },
  ).addTo(map);

  L.marker(userLocation.value).addTo(map).bindPopup('<h5>My Location</h5>').openPopup();
}
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
  z-index: 2;
}

.map-container {
  position: absolute;
  width: 100vw;
  height: calc(100% - 3rem);
}

.map {
  position: absolute;
  top: 0;
  bottom: 0;
  background-color: rgb(181, 228, 255);
  height: 100%;
  width: 100%;
  z-index: 1;
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
