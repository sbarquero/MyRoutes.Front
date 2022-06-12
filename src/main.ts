import { createApp } from 'vue';
import { createPinia } from 'pinia';

// Imports Bootstrap
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap';
import 'sweetalert2/dist/sweetalert2.all.min.js';
// import "sweetalert2/dist/sweetalert2.min.css";

import App from './App.vue';
import router from './router';

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount('#app');
