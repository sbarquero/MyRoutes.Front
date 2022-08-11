import { createApp } from 'vue';
import { createPinia } from 'pinia';

// Imports Bootstrap
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap';

// Imports Sweetalert2
import 'sweetalert2/dist/sweetalert2.all.min.js';
// import "sweetalert2/dist/sweetalert2.min.css";

// Imports Vue3-Openlayers
// import OpenLayersMap from 'vue3-openlayers';
// import 'vue3-openlayers/dist/vue3-openlayers.css';

// MapBox
import mapboxgl from 'mapbox-gl';
mapboxgl.accessToken = import.meta.env.VITE_MAPBOXGL_ACCESS_TOKEN;

import App from './App.vue';
import i18n from './i18n/i18n';
import router from './router';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(i18n);
// app.use(OpenLayersMap);

app.mount('#app');
