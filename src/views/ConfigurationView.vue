<template>
  <div class="container container-fluid-md">
    <!-- Configuration Title -->
    <h1>{{ t('configurationView.title') }}</h1>
    <!-- Language -->
    <div class="card mt-5 p-4">
      <div class="row">
        <div class="col-2">
          <label for="languageSelect"> {{ t('configurationView.language') }} </label>
        </div>
        <div class="col-3">
          <language-selector />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import LanguageSelector from '@/components/configuration/LanguageSelector.vue';

const { t } = useI18n();
</script>
