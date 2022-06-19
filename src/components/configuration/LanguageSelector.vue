<template>
  <div class="dropdown">
    <button
      class="col-12 btn btn-white dropdown-toggle btn-outline-secondary text-start"
      type="button"
      id="dropdownMenuButton1"
      data-bs-toggle="dropdown"
      aria-expanded="false"
    >
      <span class="icon" v-html="selectedLanguage.icon"></span>
      <span class="ps-3"> {{ selectedLanguage.language }} ({{ selectedLanguage.locale }}) </span>
    </button>
    <ul class="dropdown-menu pointer" aria-labelledby="dropdownMenuButton1">
      <li v-for="lang in languages" :key="`locale-${lang.locale}`" :value="locale">
        <div class="dropdown-item bi-cursor" @click="onSelectLanguage(lang)">
          <span v-html="lang.icon" />
          <span class="ps-3">{{ lang.language }} ({{ lang.locale }})</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import languages from '@/assets/locales/languages.json';

const { locale } = useI18n();

interface Language {
  locale: string;
  language: string;
  icon: string;
}

const selectedLanguage: Language = reactive({
  locale: '',
  language: '',
  icon: '',
});

onMounted(() => {
  selectedLanguage.locale = locale.value;
  selectedLanguage.language = languages.find(x => x.locale == locale.value)?.language || 'en';
  selectedLanguage.icon = languages.find(x => x.locale == locale.value)?.icon || '';
});

function onSelectLanguage(lang: Language) {
  selectedLanguage.locale = lang.locale;
  selectedLanguage.language = lang.language;
  selectedLanguage.icon = lang.icon;
  locale.value = lang.locale;
}
</script>

<style scoped>
.pointer {
  cursor: pointer;
}
</style>
