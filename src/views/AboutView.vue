<template>
  <div>
    <h1>This is the About page</h1>
    <h4>Vite environment variables</h4>
    <ul>
      <li>
        import.meta.env.MODE: <b>{{ MODE }}</b>
      </li>
      <li>
        import.meta.env.BASE_URL: <b>{{ BASE_URL }}</b>
      </li>
      <li>
        import.meta.env.DEV: <b>{{ DEV }}</b>
      </li>
      <li>
        import.meta.env.PROD: <b>{{ PROD }}</b> (opposite of import.meta.env.DEV)
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
const MODE = import.meta.env.MODE;
const BASE_URL = import.meta.env.BASE_URL;
const DEV = import.meta.env.DEV;
const PROD = import.meta.env.PROD;
</script>

<style></style>
