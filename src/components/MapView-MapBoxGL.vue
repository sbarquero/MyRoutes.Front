<template>
  <div v-if="!isUserLocationReady" class="loading-map">
    <div class="text-center">
      <h3>{{ t('homeView.mapView.pleaseWait') }}</h3>
      <span>{{ t('homeView.mapView.locating') }}</span>
    </div>
  </div>
  <div v-else class="map-container">
    <div class="map" ref="mapElement"></div>
    <!-- Location tag-->
    <div class="fixed-bottom d-flex justify-content-center">
      <div class="location">
        <b>Location</b> Lng: {{ userLocation[0] }}, Lat: {{ userLocation[1] }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import 'mapbox-gl/dist/mapbox-gl.css';
import { onMounted, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import * as turf from '@turf/turf';
import Mapboxgl from 'mapbox-gl';

import { sleep } from '@/utils/timer';
import { useMapStore } from '@/stores/mapStore';
import { useTrackStore } from '@/stores/trackStore';

const { t } = useI18n();
const { isUserLocationReady, userLocation } = storeToRefs(useMapStore());
const mapStore = useMapStore();
const mapElement = ref<HTMLDivElement>();
const { selectedTrack } = storeToRefs(useTrackStore());

let map: Mapboxgl.Map;

onMounted(async () => {
  mapStore.getInitialLocation();
  while (!isUserLocationReady.value) {
    await sleep(100);
  }
  initMap();
});

watch(selectedTrack, () => {
  flyToCenterOfSelectedTrack();
  fitMapViewToSelectedTrack();

  const sourceId = selectedTrack.value._id;
  const layerId = sourceId + '-layer';
  const source = map.getSource(sourceId);

  if (source) {
    map.removeLayer(layerId);
    map.removeSource(sourceId);
  }
  map.addSource(sourceId, {
    type: 'geojson',
    data: selectedTrack.value.geojsonData,
  });

  map.addLayer({
    id: layerId,
    type: 'line',
    source: sourceId,
    paint: {
      'line-color': 'red',
      'line-width': 3,
    },
  });
});

async function initMap() {
  if (!mapElement.value) throw new Error('Div Element no exists');
  if (!userLocation.value) throw new Error('UserLocation no exists');

  map = new Mapboxgl.Map({
    container: mapElement.value, // container ID
    style: 'mapbox://styles/mapbox/outdoors-v11', // style URL
    // style: 'mapbox://styles/mapbox/streets-v11', // style URL
    // style: 'mapbox://styles/mapbox/satellite-v9', // style URL
    // style: 'mapbox://styles/mapbox/satellite-streets-v11', // style URL
    // style: 'mapbox://styles/mapbox/navigation-day-v1', // style URL
    center: userLocation.value, // starting position [lng, lat]
    zoom: 15, // starting zoom
    accessToken: import.meta.env.MAPBOXGL_ACCESS_TOKEN,
  });

  map.addControl(new Mapboxgl.FullscreenControl(), 'top-right');
  map.addControl(new Mapboxgl.GeolocateControl(), 'top-right');
  map.addControl(new Mapboxgl.NavigationControl(), 'top-right');
  map.addControl(new Mapboxgl.ScaleControl(), 'top-left');

  const myLocationPopup = new Mapboxgl.Popup().setLngLat(userLocation.value).setHTML(`
    <br>
    <h4>Your Location</h4>
    <p class="text-center">Long: ${userLocation.value[0]}</p>
    <p class="text-center">Lat: ${userLocation.value[1]}</p>
  `);

  /* const myLocationMarker = */
  new Mapboxgl.Marker().setLngLat(userLocation.value).setPopup(myLocationPopup).addTo(map);
}

function fitMapViewToSelectedTrack(): void {
  const bounds = turf.bbox(selectedTrack.value.geojsonData);
  const mapboxBound = bounds as Mapboxgl.LngLatBoundsLike;

  map.fitBounds(mapboxBound, { padding: 50 });
}

function flyToCenterOfSelectedTrack(): void {
  map.flyTo({
    center: getCenterOfSelectedTrack(),
    essential: true,
  });
}

function getCenterOfSelectedTrack(): [number, number] {
  const center = turf.center(selectedTrack.value.geojsonData as turf.AllGeoJSON);
  return turf.getCoord(center) as [number, number];
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
