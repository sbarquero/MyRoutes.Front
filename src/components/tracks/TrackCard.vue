<template>
  <h3 class="mb-4 ms-1">{{ t('trackView.trackCard.title') }}</h3>
  <div v-if="trackStore.selectedTrack._id || trackStore.isNewTrack" class="card p-4">
    <form
      @submit.prevent
      autocomplete="chrome-off"
      class="row gx-3 gy-2 needs-validation align-baseline"
      id="trackform"
      novalidate
    >
      <!-- File Upload -->
      <div v-if="trackStore.isNewTrack" class="col-12 col-lg-9">
        <div class="d-flex align-items-center">
          <!-- Select file button -->
          <label class="btn btn-primary" for="file">
            <IconSelectFile class="me-1" />
            {{ t('homeView.sliderBox.trackUpload.selectFile') }}
          </label>
          <span v-if="trackStore.fileName" id="file-name" class="text-primary py-auto ps-3">
            {{ trackStore.fileName }}
          </span>
          <!-- File Input not visible -->
          <input
            type="file"
            accept=".kml"
            id="file"
            class="d-none"
            name="file"
            @change="handleFileUpload($event)"
          />
        </div>
      </div>
      <!-- Track Id -->
      <div v-else class="col-12 col-lg-9">
        <div class="col-12 col-lg-7">
          <div class="form-floating mb-3">
            <input
              class="form-control"
              disabled
              id="trackId"
              type="text"
              v-model="trackStore.selectedTrack._id"
              :placeholder="t('trackView.trackCard.id')"
            />
            <label for="trackId">{{ t('trackView.trackCard.id') }}</label>
          </div>
        </div>
        <div class="col-0 col-lg-5"></div>
      </div>
      <!-- Public -->
      <div class="col-12 col-lg-3 d-flex justify-content-end align-items-center">
        <div class="form-check">
          <input
            class="form-check-input"
            id="isPublic"
            type="checkbox"
            :disabled="!trackStore.trackEditing"
            v-model="selectedTrack.isPublic"
          />
          <label for="isPublic" class="form-check-label ms-2">
            {{ t('trackView.trackCard.public') }}
          </label>
        </div>
      </div>
      <!-- Name -->
      <div class="col-12 mt-4">
        <div class="form-floating mb-3">
          <input
            autocomplete="new-route-name"
            class="form-control"
            id="routeName"
            type="text"
            v-model="selectedTrack.name"
            :disabled="!trackStore.trackEditing"
            :class="v$.name.$error ? 'is-invalid' : ''"
            :placeholder="t('trackView.trackCard.name')"
            @blur="v$.name.$touch"
          />
          <label for="routeName">{{ t('trackView.trackCard.name') }}</label>
          <div v-if="v$.name.$error" class="invalid-feedback">
            {{ v$.name.$errors[0].$message }}
          </div>
        </div>
      </div>
      <!-- Description -->
      <div class="col-8">
        <div class="col-12">
          <div class="form-floating mb-3">
            <textarea
              class="form-control"
              id="description"
              rows="5"
              v-model="selectedTrack.description"
              :disabled="!trackStore.trackEditing"
              :placeholder="t('trackView.trackCard.description')"
            />
            <label for="description">{{ t('trackView.trackCard.description') }}</label>
          </div>
        </div>
      </div>
      <!-- Dates -->
      <div class="col-4">
        <!-- Creation date -->
        <div class="form-floating mb-3">
          <input
            class="form-control"
            id="createAt"
            type="datetime-local"
            :disabled="!trackStore.trackEditing"
            v-model="trackStore.creationDate"
          />
          <label for="createAt">{{ t('trackView.trackCard.createAt') }}</label>
        </div>
        <!-- Upload date -->
        <div class="form-floating mb-3">
          <input
            class="form-control"
            disabled
            id="uploadAt"
            type="text"
            :value="d(trackStore.uploadDate, 'long')"
          />
          <label for="uploadAt">{{ t('trackView.trackCard.uploadAt') }}</label>
        </div>
        <!-- Update date -->
        <div class="form-floating mb-3">
          <input
            class="form-control"
            disabled
            id="updateAt"
            type="text"
            :value="d(trackStore.updateDate, 'long')"
          />
          <label for="updateAt">{{ t('trackView.trackCard.updateAt') }}</label>
        </div>
      </div>
      <div class="d-flex justify-content-between mt-3">
        <!-- Delete button -->
        <div>
          <button
            v-if="!trackStore.isNewTrack"
            @click="onDeleteTrack"
            type="button"
            class="btn btn-danger"
            :title="t('trackView.trackCard.delete')"
          >
            <IconDelete />
          </button>
        </div>
        <!-- Save/Upload & cancel buttons -->
        <div>
          <!-- Save modified track button -->
          <button
            v-if="!trackStore.isNewTrack"
            @click="onUpdateTrack"
            type="button"
            class="btn btn-primary"
          >
            <IconSave class="me-1" />
            {{ t('trackView.trackCard.save') }}
          </button>
          <!-- Upload new track button -->
          <button
            v-if="trackStore.isNewTrack"
            @click="onTrackUpload"
            :disabled="trackStore.file === ''"
            type="button"
            class="btn btn-primary"
          >
            <IconUpload class="me-1" />
            {{ t('trackView.trackCard.uploadNewTrack') }}
          </button>
          <button @click="onCancelTrack" type="button" class="btn btn-light border-primary ms-3">
            {{ t('trackView.trackCard.cancel') }}
          </button>
        </div>
      </div>
    </form>
  </div>
  <div v-else>
    <h5 class="alert alert-primary ms-1">{{ t('trackView.trackCard.selectTrack') }}</h5>
  </div>
</template>

<script setup lang="ts">
import { helpers, minLength, required } from '@vuelidate/validators';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import Swal from 'sweetalert2';
import useVuelidate from '@vuelidate/core';

import { convertDateToLocaleDateString } from '@/utils/date';
import { showError, showOk } from '@/utils/messages';
import { useAuthStore } from '@/stores/authStore';
import { useTrackStore } from '@/stores/trackStore';
import IconDelete from '../icons/IconDelete.vue';
import IconSave from '../icons/IconSave.vue';
import IconSelectFile from '../icons/IconSelectFile.vue';
import IconUpload from '../icons/IconUpload.vue';

const { t, d } = useI18n();

const authStore = useAuthStore();
const trackStore = useTrackStore();
const { selectedTrack } = storeToRefs(trackStore);

function initializeForm(): void {
  trackStore.clearTrack();
  v$.value.$reset();
}

const rules = {
  name: {
    required: helpers.withMessage(t('trackView.trackCard.errorMsg.nameRequired'), required),
    minLength: helpers.withMessage(t('trackView.trackCard.errorMsg.nameMinLength'), minLength(3)),
  },
};

const v$ = useVuelidate(rules, selectedTrack);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function handleFileUpload(event: any): void {
  trackStore.trackEditing = true;
  trackStore.file = event.target.files[0];
  trackStore.fileName = event.target.files[0].name;
  const date: Date = event.target.files[0].lastModifiedDate;
  trackStore.selectedTrack.createAt = date;
  trackStore.creationDate = convertDateToLocaleDateString(date);

  const reader = new FileReader();
  reader.onload = e => getNameAndDescriptionFromKML(e.target?.result);
  reader.readAsText(event.target.files[0]);
}

const onTrackUpload = async (): Promise<void> => {
  if (!(await isValidInput())) return;
  try {
    trackStore.uploadTrack();
    showOk(t('trackView.trackCard.trackUpload.uploadOk'), trackStore.fileName);
    initializeForm();
  } catch (error: Error) {
    showError(t('trackView.trackCard.trackUpload.uploadError'), error);
  }
};

const onUpdateTrack = async (): Promise<void> => {
  if (!isValidInput()) return;
  try {
    await trackStore.updateTrack();
    showOk(t('trackView.trackCard.trackUpdate.updateOk'), trackStore.fileName);
    await trackStore.getTrackListByUserId(authStore.userId);
    initializeForm();
  } catch (error: Error) {
    showError(t('trackView.trackCard.trackUpdate.updateError'), error.message);
  }
};

const onCancelTrack = (): void => {
  if (trackHasChanged()) {
    confirmTrackCancellation();
  } else {
    initializeForm();
  }
};

const onDeleteTrack = async (): Promise<void> => {
  Swal.fire({
    title: t('homeView.sliderBox.trackList.deleteQuestion'),
    text: selectedTrack.value.name,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: t('homeView.sliderBox.trackList.confirmDeleteButton'),
    cancelButtonText: t('homeView.sliderBox.trackList.cancelDeleteButton'),
  }).then(async result => {
    if (result.isConfirmed) {
      const result = await trackStore.deleteById(selectedTrack.value._id);
      trackStore.getTrackListByUserId(authStore.userId);
      initializeForm();
      if (result.ok) {
        showOk(t('homeView.sliderBox.trackList.deleteSuccess'));
      } else {
        showError(result.message);
      }
    }
  });
};

const trackHasChanged = (): boolean => {
  return trackStore.trackInitialState !== trackStore.getTrackState;
};

const confirmTrackCancellation = (): void => {
  Swal.fire({
    title: t('trackView.trackCard.cancellation.title'),
    text: t('trackView.trackCard.cancellation.text'),
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: t('trackView.trackCard.cancellation.confirmButtonText'),
    cancelButtonText: t('trackView.trackCard.cancellation.cancelButtonText'),
  }).then(result => {
    if (result.isConfirmed) {
      initializeForm();
    }
  });
};

function getNameAndDescriptionFromKML(xmlString: string | ArrayBuffer | null | undefined): void {
  if (xmlString) {
    const xmlDOM = new DOMParser().parseFromString(xmlString as string, 'text/xml');
    trackStore.selectedTrack.name =
      xmlDOM.getElementsByTagName('name')[0].childNodes[0].textContent || trackStore.fileName;
    trackStore.selectedTrack.description =
      xmlDOM.getElementsByTagName('description')[0].childNodes[0].textContent || '';
  }
}

async function isValidInput(): Promise<boolean> {
  const valid = await v$.value.$validate();
  if (!valid) {
    showError(
      t('trackView.trackCard.formValidation.errorTitle'),
      t('trackView.trackCard.formValidation.errorText'),
    );
  }
  return valid;
}
</script>

<style scoped>
#description {
  height: 13rem;
  resize: none;
}

#file-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>