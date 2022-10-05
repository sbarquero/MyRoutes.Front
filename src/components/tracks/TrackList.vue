<template>
  <h3 class="mb-4 ms-1">{{ t('trackView.trackList.title') }}</h3>
  <div class="list-group">
    <TrackListItem
      v-for="(track, index) in tracks"
      :key="track._id"
      :track="track"
      :index="index"
      @click="onTrackSelect(track._id)"
      :class="
        track._id === trackStore.selectedTrack._id
          ? 'selected'
          : trackStore.trackEditing || trackStore.isNewTrack
          ? 'editing'
          : ''
      "
    >
      <template #name>
        <span :title="track.name">{{ track.name }}</span>
      </template>
      <template v-if="track.description" #description>
        <span :title="track.description">{{ track.description }}</span>
      </template>
      <template v-else #description>{{ t('trackView.trackList.noDescription') }}</template>
    </TrackListItem>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';

import { onMounted } from 'vue';
import { showError } from '@/utils/messages';
import { useAuthStore } from '@/stores/authStore';
import { useTrackStore } from '@/stores/trackStore';
import TrackListItem from './TrackListItem.vue';

const { t } = useI18n();

const authStore = useAuthStore();
const trackStore = useTrackStore();
const { tracks } = storeToRefs(trackStore);

onMounted(async () => {
  trackStore.getTrackListByUserId(authStore.userId);
});

const onTrackSelect = async (id: string) => {
  const response = await trackStore.getTrackById(id);
  trackStore.trackEditing = true;
  if (!response.ok) {
    showError(response.message);
  }
};
</script>

<style scoped>
.list-group {
  border: solid 1px var(--list-group-border-color);
  height: 67vh;
  overflow-y: auto;
}
.selected {
  border-color: var(--primary-color) !important;
  cursor: pointer;
  pointer-events: none;
}
.editing {
  opacity: 0.3;
  pointer-events: none;
}
</style>
