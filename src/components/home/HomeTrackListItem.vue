<template>
  <div
    class="list-group-item"
    @click="onClickTrack"
    :class="props.track._id == trackStore.selectedTrackId ? 'track-selected' : ''"
  >
    <div class="track-item">
      <div :title="t('homeView.sliderBox.trackList.noVisibleButton')" class="track-visible">
        <IconVisible class="icon" v-if="props.track.visible" @click="hideTrack" />
        <IconNoVisible class="icon no-visible" v-else @click="showTrack" />
      </div>
      <div class="track-name">
        {{ props.track.name }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import { useTrackStore } from '@/stores/trackStore';
import IconNoVisible from '../icons/IconNoVisible.vue';
import IconVisible from '../icons/IconVisible.vue';

const { t } = useI18n();

const trackStore = useTrackStore();

const props = defineProps({
  track: { type: Object, required: true },
  index: { type: Number, required: true },
});

async function showTrack(event: Event) {
  await trackStore.selectTrack(props.index);
  event.stopPropagation();
}

async function hideTrack(event: Event) {
  await trackStore.removeTrackLayer(props.index);
  event.stopPropagation();
}

async function onClickTrack(): Promise<void> {
  await trackStore.selectTrack(props.index);
}
</script>

<style lang="scss" scoped>
div.list-group-item {
  border-color: var(--primary-color-50);
  border-left-width: 8px;
  color: var(--color-text);
  cursor: pointer;
  padding: 8px;
  padding-right: 0;
  user-select: none;
  &:hover {
    background-color: var(--primary-color-10);
  }
}
.track-item {
  display: flex;
}
.track-selected {
  background-color: var(--primary-color-10);
  border-left: solid 8px var(--primary-color) !important;
  color: var(--primary-color);
}
.track-name {
  overflow: hidden;
  padding: 8px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.icon {
  color: var(--primary-color);
  height: 2.5rem;
  width: 2.5rem;
  padding: 8px;
  &:hover {
    border-radius: 5px;
    background-color: var(--primary-color);
    color: #ffffff;
  }
}
.no-visible {
  color: var(--primary-color-50);
}
</style>
