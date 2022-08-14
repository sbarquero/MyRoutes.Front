<template>
  <div class="p-2 pt-3 pb-4 overflow-hidden bg-light">
    <form @submit.prevent ref="form">
      <div class="card p-2">
        <div class="d-flex justify-content-between">
          <label class="btn btn-secondary" for="file">
            {{ t('homeView.sliderBox.trackUpload.selectFile') }}
          </label>
          <!-- File Input not visible -->
          <input
            type="file"
            accept=".kml"
            id="file"
            class="d-none"
            name="file"
            @click="initializeForm"
            @change="handleFileUpload($event)"
          />
          <!-- Upload button -->
          <button
            id="uploadBtn"
            class="btn btn-secondary"
            :title="t('homeView.sliderBox.trackUpload.uploadBtn')"
            type="button"
            @click="onTrackUpload"
            :disabled="state.file === ''"
          >
            <IconUpload />
          </button>
        </div>
        <!-- File name -->
        <div v-if="state.fileName" id="file-name" class="mt-1 p-0">
          <small> {{ state.fileName }} </small>
        </div>
      </div>
      <!-- Infomation -->
      <div v-if="state.file" class="card p-2 mt-3">
        <h6>{{ t('homeView.sliderBox.trackUpload.editInformation') }}</h6>
        <div class="form-check mt-0 mb-2">
          <label class="form-check-label" for="public">{{
            t('homeView.sliderBox.trackUpload.public')
          }}</label>
          <input class="form-check-input" type="checkbox" id="public" v-model="state.isPublic" />
        </div>
        <!-- Name input -->
        <div class="form-floating mb-3">
          <input type="text" class="form-control form-control-sm" id="name" v-model="state.name" />
          <label for="name">{{ t('homeView.sliderBox.trackUpload.name') }}</label>
        </div>
        <!-- Description -->
        <div class="form-floating mb-3">
          <textarea
            type="text"
            class="form-control form-control-sm"
            id="description"
            v-model="state.description"
          />
          <label for="description">{{ t('homeView.sliderBox.trackUpload.description') }}</label>
        </div>
        <!-- File creation date -->
        <div class="form-floating mb-1">
          <input
            type="datetime-local"
            class="form-control form-control-sm"
            id="createAt"
            v-model="state.createAt"
          />
          <label for="createAt">{{ t('homeView.sliderBox.trackUpload.creationDate') }}</label>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useI18n } from 'vue-i18n';

import { showError, showOk } from '@/utils/messages';
import { useAuthStore } from '@/stores/authStore';
import { useTrackStore } from '@/stores/trackStore';
import IconUpload from '../icons/IconUpload.vue';
import trackApi from '@/api/trackApi';
import type { TrackList } from '@/interfaces/track.interface';

const authStore = useAuthStore();
const trackStore = useTrackStore();

const { t } = useI18n();

const state = reactive({
  name: '',
  description: '',
  isPublic: false,
  createAt: '',
  file: '',
  fileName: '',
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function handleFileUpload(event: any) {
  state.file = event.target.files[0];
  state.fileName = event.target.files[0].name;
  const date: Date = event.target.files[0].lastModifiedDate;
  state.createAt = date.toISOString().substring(0, 19);

  const reader = new FileReader();
  reader.onload = e => getNameAndDescriptionFromKML(e.target?.result);
  reader.readAsText(event.target.files[0]);
}

const onTrackUpload = async () => {
  const formData = new FormData();
  formData.append('name', state.name);
  formData.append('description', state.description);
  formData.append('userId', authStore.userId);
  formData.append('isPublic', state.isPublic.toString());
  formData.append('fileName', state.fileName);
  formData.append('createAt', state.createAt.toString());
  formData.append('file', state.file);
  try {
    const track = await trackApi.post('/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    trackStore.tracks.push(track.data as TrackList);
    showOk(t('homeView.sliderBox.trackUpload.uploadOk'), state.fileName);

    initializeForm();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    showError(t('homeView.sliderBox.trackUpload.uploadError'), error);
  }
};

function initializeForm() {
  state.name = '';
  state.description = '';
  state.isPublic = false;
  state.createAt = '';
  state.file = '';
  state.fileName = '';
  document.forms[0].reset();
}

function getNameAndDescriptionFromKML(xmlString: string | ArrayBuffer | null | undefined) {
  if (xmlString) {
    const xmlDOM = new DOMParser().parseFromString(xmlString as string, 'text/xml');
    state.name = xmlDOM.getElementsByTagName('name')[0].childNodes[0].textContent || state.fileName;
    state.description =
      xmlDOM.getElementsByTagName('description')[0].childNodes[0].textContent || '';
  }
}
</script>

<style scoped>
#file-name {
  padding-bottom: 0.15rem;
  white-space: nowrap;
  overflow-y: hidden;
  overflow-x: visible;
}

/* width */
::-webkit-scrollbar {
  height: 0.65rem;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #999;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #777;
}
</style>
