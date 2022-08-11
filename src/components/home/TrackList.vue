<template>
  <div class="card mt-3 p-2">
    <ul>
      <li v-for="track in tracks" :key="track._id" @click="onClickTrack(track._id)">
        {{ track.name }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

import { useAuthStore } from '@/stores/authStore';
import { useTrackStore } from '@/stores/trackStore';
import { storeToRefs } from 'pinia';

const authStore = useAuthStore();
const trackStore = useTrackStore();

const { tracks } = storeToRefs(useTrackStore());

onMounted(async () => {
  await trackStore.getTrackListByUserId(authStore.userId);
});

async function onClickTrack(id: string): Promise<void> {
  await trackStore.getTrackById(id);
}
</script>

<style scoped>
ul {
  list-style: none;
  text-align: left;
  padding-left: 0;
}

li {
  cursor: pointer;
}
</style>
