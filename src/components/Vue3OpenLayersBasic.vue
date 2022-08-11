<template>
  <ol-map class="map">
    <ol-view
      ref="view"
      :center="center"
      :rotation="rotation"
      :zoom="zoom"
      :projection="projection"
    />
    <ol-tile-layer>
      <ol-source-osm />
    </ol-tile-layer>
  </ol-map>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { sleep } from '@/utils/timer';
import { useMapStore } from '@/stores/mapStore';

const mapStore = useMapStore();

const center = ref([0, 0]);
const projection = ref('EPSG:4326');
const zoom = ref(12);
const rotation = ref(0);

onMounted(async () => {
  await sleep(100);
  center.value = mapStore.userLocation;
});
</script>

<style scoped>
.map {
  height: 100%;
  width: 100%;
}
</style>
