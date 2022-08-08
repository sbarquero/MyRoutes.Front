<template>
  <div class="card mt-3 p-3 pb-1 text-center">
    <form @submit.prevent>
      <div class="d-flex justify-content-between">
        <label class="btn btn-secondary" for="file"> {{ t('fileUpload.selectFile') }} </label>
        <!-- File Input not visible -->
        <input
          ref="fileInput"
          type="file"
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
      <div id="file-name" class="mt-1 text-start">{{ state.fileName }}</div>
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

  const { status, data } = await fileApi.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  if (status !== 200) {
    showError(t('fileUpload.uploadError'), data.message);
  }
  showOk(t('fileUpload.uploadOk'), state.fileName);

  initializeForm();
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

<style scoped></style>
