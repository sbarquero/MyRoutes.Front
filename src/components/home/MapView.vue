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
    <!-- Zoom tag-->
    <div class="zoom"><b>Zoom: </b>{{ zoom }}</div>
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
const trackStore = useTrackStore();
const { hideTrackIndex, selectedTrackIndex } = storeToRefs(useTrackStore());

const initialZoom = 16;
const zoom = ref(initialZoom);

let map: L.Map;

onMounted(async () => {
  mapStore.getInitialLocation();
  while (!isUserLocationReady.value) {
    await sleep(100);
  }
  initMap();
});

watch(selectedTrackIndex, async () => {
  if (selectedTrackIndex.value === -1) return;
  const index = selectedTrackIndex.value;
  let geojsonLayer = new L.GeoJSON();

  if (!trackStore.geojsonLayers[index]) {
    geojsonLayer.addData(trackStore.trackList[index].geojsonData);
    trackStore.geojsonLayers[index] = geojsonLayer;

    geojsonLayer.addTo(map);
  } else {
    geojsonLayer = trackStore.geojsonLayers[index] as L.GeoJSON;
  }
  map.flyToBounds(geojsonLayer.getBounds());
});

watch(hideTrackIndex, () => {
  const index = trackStore.hideTrackIndex;
  map.removeLayer(trackStore.geojsonLayers[index] as L.GeoJSON);
  trackStore.geojsonLayers[index] = undefined;
});

async function initMap() {
  if (!mapElement.value) throw new Error('Div Element no exists');
  if (!userLocation.value) throw new Error('UserLocation no exists');

  // Proveedores para Leaflet
  // https://leaflet-extras.github.io/leaflet-providers/preview/
  // https://github.com/leaflet-extras/leaflet-providers

  const osm = L.tileLayer(
    'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',
    {
      attribution:
        'Map data (c) <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
      minZoom: 2,
      maxZoom: 20,
      id: 'mapbox/streets-v11',
      accessToken: import.meta.env.VITE_MAPBOX_ACCESS_TOKEN,
    },
  );

  // const streets = L.tileLayer(mapboxUrl, {id: 'mapbox/streets-v11', tileSize: 512, zoomOffset: -1, attribution: mapboxAttribution});

  var OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    minZoom: 2,
    maxZoom: 19,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  });

  const openTopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    minZoom: 2,
    maxZoom: 17,
    attribution:
      'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
  });

  const baseMaps = {
    OpenStreetMap: osm,
    // "Mapbox Streets": streets,
    OpenStreetMap_Mapnik: OpenStreetMap_Mapnik,
    'Open topo map': openTopoMap,
  };

  map = L.map(mapElement.value, {
    zoomSnap: 0.25, // Forces the map's zoom level to always be a multiple of this (default = 1)
    zoomDelta: 0.5, // Zoom level using keyboard or zoom controls
    wheelPxPerZoomLevel: 128, // Zoom level in pixels using mouse wheel
  }).setView(userLocation.value, initialZoom);
  osm.addTo(map);

  map.on('zoom', () => {
    zoom.value = map.getZoom();
  });
  L.control.layers(baseMaps).addTo(map);
  L.control.scale().addTo(map);

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
  width: 100vw;
  height: calc(100% - 3rem);
}

.map {
  background-color: rgb(181, 228, 255);
  height: 100%;
  width: 100%;
  z-index: 1;
}

.zoom {
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 0.5rem;
  /* offset-x | offset-y | blur-radius | spread-radius | color */
  box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);
  color: #444;
  font-size: 1rem;
  left: 3.5rem;
  margin: auto;
  padding: 0 0.5rem;
  position: absolute;
  text-align: center;
  top: 3.75rem;
  width: auto;
  z-index: 2;
}

.location {
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 0.5rem;
  bottom: 1.5rem;
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
