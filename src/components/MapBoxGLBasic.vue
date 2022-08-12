<template>
  <div class="map" ref="mapElement"></div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import Mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import * as turf from '@turf/turf';

import { useMapStore } from '@/stores/mapStore';
import { storeToRefs } from 'pinia';
import { sleep } from '@/utils/timer';
import { useTrackStore } from '@/stores/trackStore';

const mapElement = ref<HTMLDivElement>();
const { userLocation, isUserLocationReady } = storeToRefs(useMapStore());
const { selectedTrack } = storeToRefs(useTrackStore());

let map: Mapboxgl.Map;

onMounted(async () => {
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
.map {
  position: absolute;
  top: 0;
  bottom: 0;
  background-color: rgb(181, 228, 255);
  height: 100%;
  width: 100%;
}
</style>
