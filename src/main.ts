import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createI18n } from 'vue-i18n';

// Imports Bootstrap
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap';

// Imports Sweetalert2
import 'sweetalert2/dist/sweetalert2.all.min.js';
// import "sweetalert2/dist/sweetalert2.min.css";

import App from './App.vue';
import router from './router';

// Imports for i18n
import en from '@/assets/locales/en.json';
import es from '@/assets/locales/es.json';

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.use(
  createI18n({
    locale: 'es', // set locale
    fallbackLocale: 'en', // set fallback locale
    messages: { en, es }, // set locale messages
  }),
);

app.mount('#app');
