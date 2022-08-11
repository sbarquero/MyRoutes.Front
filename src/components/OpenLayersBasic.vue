<template>
  <div id="map" class="map" ref="map"></div>
</template>

<script setup lang="ts">
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import { onMounted, ref } from 'vue';
import { useMapStore } from '@/stores/mapStore';

const mapStore = useMapStore();
const map = ref<HTMLDivElement>();

onMounted(() => {
  setTimeout(initMap, 100);
});

const initMap = () => {
  new Map({
    target: 'map',
    layers: [
      new TileLayer({
        source: new OSM(),
      }),
    ],
    view: new View({
      center: fromLonLat(mapStore.userLocation),
      zoom: 15,
      projection: 'EPSG:4326',
    }),
  });
};
</script>

<style scoped>
@import '../../node_modules/ol/ol.css';

.map {
  height: 100%;
  width: 100%;
}
</style>
