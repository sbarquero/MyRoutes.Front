<template>
  <MapView />
  <SliderBox :visible="false" v-if="authStore.isAuthenticated">
    <h4 class="m-1 mb-4">{{ t('homeView.routes') }}</h4>
    <div class="accordion" id="accordionRoute">
      <div class="accordion-item">
        <h2 class="accordion-header" id="headingOne">
          <button
            class="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapseOne"
            aria-expanded="false"
            aria-controls="collapseOne"
          >
            <h6>{{ t('homeView.trackUpload') }}</h6>
          </button>
        </h2>
        <div
          id="collapseOne"
          class="accordion-collapse collapse"
          aria-labelledby="headingOne"
          data-bs-parent="#accordionRoute"
        >
          <div class="accordion-body p-0 m-0">
            <TrackUpload />
          </div>
        </div>
      </div>
      <div class="accordion-item">
        <h3 class="accordion-header" id="headingTwo">
          <button
            class="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapseTwo"
            aria-expanded="false"
            aria-controls="collapseTwo"
          >
            <h6>{{ t('homeView.trackList') }}</h6>
          </button>
        </h3>
        <div
          id="collapseTwo"
          class="accordion-collapse collapse"
          aria-labelledby="headingTwo"
          data-bs-parent="#accordionRoute"
        >
          <div class="accordion-body p-0 m-0">
            <TrackList />
          </div>
        </div>
      </div>
    </div>
  </SliderBox>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import { useAuthStore } from '@/stores/authStore';
import MapView from '@/components/MapView.vue';
import SliderBox from '@/components/home/SliderBox.vue';
import TrackList from '../components/home/TrackList.vue';
import TrackUpload from '../components/home/TrackUpload.vue';

const { t } = useI18n();

const authStore = useAuthStore();
</script>

<style scoped></style>
