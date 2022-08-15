<template>
  <div class="card p-3">
    <TrackListItem
      v-for="(track, index) in tracks"
      :key="track._id"
      :track="track"
      :index="index"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/stores/authStore';
import { useTrackStore } from '@/stores/trackStore';
import TrackListItem from './TrackListItem.vue';

const authStore = useAuthStore();
const trackStore = useTrackStore();

const { tracks } = storeToRefs(useTrackStore());

onMounted(async () => {
  await trackStore.getTrackListByUserId(authStore.userId);
});
</script>

<style scoped></style>
