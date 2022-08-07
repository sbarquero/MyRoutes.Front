<script setup lang="ts">
import MapView from '@/components/MapView.vue';
import SliderBox from '@/components/home/SliderBox.vue';
</script>

<template>
  <MapView />
  <SliderBox :visible="false"> Slider box content </SliderBox>
</template>

<style></style>
