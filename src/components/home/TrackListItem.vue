<template>
  <div class="track">
    <div
      class="track-name selectable"
      @click="onClickTrack(track._id)"
      :title="t('homeView.sliderBox.trackList.noVisibleButton')"
    >
      <span class="track-visible me-2">
        <IconVisible class="icon" v-if="false" />
        <IconNoVisible class="icon" v-else />
      </span>
      {{ props.track.name }}
    </div>
    <div
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
import { useTrackStore } from '@/stores/trackStore';
import IconDelete from '../icons/IconDelete.vue';
import IconNoVisible from '../icons/IconNoVisible.vue';
import IconVisible from '../icons/IconVisible.vue';

const { t } = useI18n();
const trackStore = useTrackStore();

const props = defineProps({
  track: { type: Object, required: true },
  index: { type: Number, required: true },
});

async function onClickTrack(id: string): Promise<void> {
  await trackStore.getTrackById(id);
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
  display: flex;
  overflow: hidden;
  padding: 5px 0;
}

.track-name {
  display: inline-block;
  min-width: 257px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 257px;
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
