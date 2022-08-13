<script setup lang="ts">
import MapView from '@/components/MapView.vue';
import SliderBox from '@/components/home/SliderBox.vue';
import TrackList from '../components/home/TrackList.vue';
import TrackUpload from '../components/home/TrackUpload.vue';
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore();
</script>

<template>
  <MapView />
  <SliderBox :visible="false" v-if="authStore.isAuthenticated">
    <h4>Routes</h4>
    <TrackUpload />
    <TrackList />
  </SliderBox>
</template>

<style></style>
