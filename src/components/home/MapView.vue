<template>
  <div class="map-container">
    <!-- Map Div -->
    <div id="mapContainer" class="map" ref="mapElement"></div>
    <!-- Zoom tag-->
    <div class="zoom"><b>Zoom: </b>{{ zoom }}</div>
    <!-- Location tag-->
    <div v-if="isUserLocationReady" class="fixed-bottom d-flex justify-content-center">
      <div class="location">
        <b>{{ t('homeView.mapView.myLocation') }}</b> Lng: {{ userLocation[0] }}, Lat:
        {{ userLocation[1] }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';

import { useMapStore } from '@/stores/mapStore';
import { useTrackStore } from '@/stores/trackStore';
import mapsProviders from '@/components/home/mapsProviders';
import type { Track } from '@/interfaces/track.interface';

const { t } = useI18n();
const { initialLocation, isUserLocationReady, userLocation, zoom } = storeToRefs(useMapStore());
const mapStore = useMapStore();
const mapElement = ref<HTMLDivElement>();
const trackStore = useTrackStore();
const { hideTrackIndex, selectedTrackIndex } = storeToRefs(useTrackStore());

let map: L.Map;

let geojsonLayers: L.GeoJSON[];

onMounted(async () => {
  mapStore.getUserLocation();
  initMap();
  geojsonLayers = [];
});

onUnmounted(() => {
  trackStore.unselectTrack();
  map.remove();
});

watch(selectedTrackIndex, async () => {
  if (selectedTrackIndex.value === -1) return;
  const index = selectedTrackIndex.value;

  if (!geojsonLayers[index]) {
    geojsonLayers[index] = new L.GeoJSON(trackStore.trackList[index].geojsonData);
  }
  geojsonLayers[index].addTo(map);
  map.flyToBounds(geojsonLayers[index].getBounds());
});

watch(hideTrackIndex, () => {
  if (hideTrackIndex.value === -1) return;
  const index = trackStore.hideTrackIndex;
  map.removeLayer(geojsonLayers[index]);
});

watch(userLocation, () => {
  L.marker(userLocation.value)
    .addTo(map)
    .bindPopup(
      `<div style="text-align: center">
        <h5>${t('homeView.mapView.myLocation')}</h5>
        <b>${t('homeView.mapView.latitude')}:</b> ${userLocation.value[0]}<br/>
        <b>${t('homeView.mapView.longitude')}:</b> ${userLocation.value[1]}
      </div>`,
    )
    .openPopup();
  map.flyTo(userLocation.value, 15);
});

async function initMap() {
  if (!mapElement.value) throw new Error('Div Element no exists');
  if (!userLocation.value) throw new Error('UserLocation no exists');

  const baseMaps = {
    'MapBox - OpenStreetMap': mapsProviders.mapboxOsm,
    'OpenStreetMap - Mapnik': mapsProviders.openStreetMapMapnik,
    OpenTopoMap: mapsProviders.openTopoMap,
    MtbMap: mapsProviders.mtbMap,
    'ESRI WordImagery': mapsProviders.esriWorldImagery,
    'ESRI WordTopoMap': mapsProviders.esriWorldTopoMap,
  };

  map = L.map(mapElement.value, {
    zoomSnap: 0.25, // Forces the map's zoom level to always be a multiple of this (default = 1)
    zoomDelta: 0.5, // Zoom level using keyboard or zoom controls
    zoomControl: false, // zoom control off
    wheelPxPerZoomLevel: 128, // Zoom level in pixels using mouse wheel
  }).setView(initialLocation.value, zoom.value);
  map.addLayer(mapsProviders.mapboxOsm);

  map.on('zoom', () => {
    zoom.value = map.getZoom();
  });

  L.control.layers(baseMaps).addTo(map);
  L.control.scale().addTo(map);
  L.control
    .zoom({
      position: 'topleft',
      zoomInTitle: t('homeView.mapView.zoomControl.zoomInTitle'),
      zoomOutTitle: t('homeView.mapView.zoomControl.zoomOutTitle'),
    })
    .addTo(map);
}
</script>

<style scoped>
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
