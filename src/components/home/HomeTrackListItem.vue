<template>
  <div class="track" :class="props.track._id == trackStore.selectedTrackId ? 'track-selected' : ''">
    <div
      :title="t('homeView.sliderBox.trackList.noVisibleButton')"
      class="track-visible selectable"
    >
      <IconVisible class="icon" v-if="props.track.visible" @click="hideTrack" />
      <IconNoVisible class="icon" v-else @click="showTrack" />
    </div>
    <div class="track-name selectable" @click="onClickTrack">
      {{ props.track.name }}
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

async function showTrack() {
  await trackStore.selectTrack(props.index);
}

async function hideTrack() {
  await trackStore.removeTrackLayer(props.index);
}

async function onClickTrack(): Promise<void> {
  await trackStore.selectTrack(props.index);
}
</script>

<style lang="scss" scoped>
.selectable {
  border-radius: 5px;
  padding: 8px;
  &:hover {
    cursor: pointer;
  }
}
.track {
  border-bottom: 1px solid #ccc;
  border-left: solid 5px transparent;
  display: flex;
  padding: 5px 0;
}

.track-selected {
  border-left: solid 5px #888;
}

.track-visible:hover {
  background-color: #d0d0d0;
}

.track-name {
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: calc(100% - 45px);
  &:hover {
    background-color: #d0d0d0;
  }
}

.icon {
  height: 20px;
  width: 20px;
}
</style>
