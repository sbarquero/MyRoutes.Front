<template>
  <div class="card mt-3 p-3 pb-2 text-center overflow-hidden">
    <form @submit.prevent>
      <div class="d-flex justify-content-between">
        <label class="btn btn-secondary" for="file"> {{ t('fileUpload.selectFile') }} </label>
        <!-- File Input not visible -->
        <input
          ref="fileInput"
          type="file"
          accept=".kml"
          id="file"
          class="d-none"
          name="file"
          @change="handleFileUpload($event)"
        />
        <button
          id="uploadBtn"
          class="btn btn-secondary"
          :title="t('fileUpload.uploadBtn')"
          type="button"
          @click="onFileUpload"
          :disabled="state.file === ''"
        >
          <IconUpload />
        </button>
      </div>
      <div id="file-name" class="mt-1 text-start d-flex justify-content-start">
        {{ state.fileName }}
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/authStore';
import IconUpload from '../icons/IconUpload.vue';
import fileApi from '@/api/fileApi';
import { showError, showOk } from '@/utils/messages';

const authStore = useAuthStore();

const { t } = useI18n();

const fileInput = ref();
const state = reactive({
  file: '',
  fileName: '',
});

const onFileUpload = async () => {
  const formData = new FormData();
  formData.append('userId', authStore.userId);
  formData.append('file', state.file);
  try {
    await fileApi.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    showOk(t('fileUpload.uploadOk'), state.fileName);

    initializeForm();
  } catch (error: any) {
    showError(t('fileUpload.uploadError'), error);
  }
};

function handleFileUpload(event: any) {
  state.file = event.target.files[0];
  state.fileName = event.target.files[0].name;
}

function initializeForm() {
  state.file = '';
  state.fileName = '';
  document.forms[0].reset();
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
