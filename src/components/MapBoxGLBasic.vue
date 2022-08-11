<template>
  <div class="map" ref="mapElement"></div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import Mapboxgl, { GeoJSONSource } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useMapStore } from '@/stores/mapStore';
import { storeToRefs } from 'pinia';
import { sleep } from '@/utils/timer';

const mapElement = ref<HTMLDivElement>();
const { userLocation, isUserLocationReady } = storeToRefs(useMapStore());

onMounted(async () => {
  if (isUserLocationReady) {
    await sleep(200);
    console.log('Paso por onMounted', userLocation.value);
    return initMap();
  }
});

watch(isUserLocationReady, () => {
  console.log('Paso por watch', userLocation.value);
  if (isUserLocationReady) initMap();
});

async function initMap() {
  console.log('initMap');
  if (!mapElement.value) throw new Error('Div Element no exists');
  if (!userLocation.value) throw new Error('UserLocation no exists');

  await Promise.resolve();

  const map = new Mapboxgl.Map({
    container: mapElement.value, // container ID
    // style: 'mapbox://styles/mapbox/streets-v11', // style URL
    style: 'mapbox://styles/mapbox/outdoors-v11', // style URL
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

  map.on('load', () => {
    map.addSource('example', {
      type: 'geojson',
      // Use a URL for the value for the `data` property.
      data: '/geojson/example.geojson',
    });

    map.addLayer({
      id: 'example-layer',
      type: 'line',
      source: 'example',
      paint: {
        'line-color': 'red',
        'line-width': 5,
      },
    });

    map.flyTo({
      center: [-1.5178138, 37.872833],
      essential: true,
    });
  });
}
</script>

<style scoped>
.map {
  position: absolute;
  top: 0;
  bottom: 0;
  background-color: rgb(181, 228, 255);
  height: 100%;
  width: 100%;
}
</style>
