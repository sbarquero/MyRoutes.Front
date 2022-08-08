<script setup lang="ts">
import MapView from '@/components/MapView.vue';
import SliderBox from '@/components/home/SliderBox.vue';
import MapRoutesList from '../components/home/MapRoutesList.vue';
import FileUpload from '../components/home/FileUpload.vue';
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore();
</script>

<template>
  <MapView />
  <SliderBox :visible="false" v-if="authStore.isAuthenticated">
    <h4>Routes</h4>
    <FileUpload />
    <MapRoutesList />
  </SliderBox>
</template>

<style></style>
