<template>
  <div
    class="track"
    :class="props.track._id == trackStore.selectedTrack._id ? 'track-selected' : ''"
  >
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
    <div
      v-if="authStore.isAuthenticated"
      class="track-delete selectable"
      @click="onDeleteTrack"
      :title="t('homeView.sliderBox.trackList.deleteButton')"
    >
      <IconDelete class="icon" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import Swal from 'sweetalert2';

import { showError, showOk } from '@/utils/messages';
import { useAuthStore } from '@/stores/authStore';
import { useTrackStore } from '@/stores/trackStore';
import IconDelete from '../icons/IconDelete.vue';
import IconNoVisible from '../icons/IconNoVisible.vue';
import IconVisible from '../icons/IconVisible.vue';

const { t } = useI18n();

const authStore = useAuthStore();
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

function onDeleteTrack() {
  Swal.fire({
    title: t('homeView.sliderBox.trackList.deleteQuestion'),
    text: props.track.name,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: t('homeView.sliderBox.trackList.confirmDeleteButton'),
    cancelButtonText: t('homeView.sliderBox.trackList.cancelDeleteButton'),
  }).then(async result => {
    if (result.isConfirmed) {
      const result = await trackStore.deleteById(props.track._id);
      trackStore.tracks.splice(props.index, 1);
      if (result.ok) {
        showOk(t('homeView.sliderBox.trackList.deleteSuccess'));
      } else {
        showError(result.message);
      }
    }
  });
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
  overflow: hidden;
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
  min-width: 217px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 217px;
  &:hover {
    background-color: #d0d0d0;
  }
}

.track-delete {
  display: inline-block;
  &:hover {
    background-color: #ff7070;
    color: white;
  }
}

.icon {
  height: 20px;
  width: 20px;
}
</style>
