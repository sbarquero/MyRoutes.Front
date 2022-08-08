<template>
  <div class="card mt-3 p-2">
    <ul>
      <li v-for="route in mapRoutes" :key="route.id" @click="onClickRoute(route.geojsonFile)">
        {{ route.name }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'MapRoutesList',
  setup() {
    const isVisible = ref(true);
    const mapRoutes = ref([
      {
        id: '1',
        name: 'Route one',
        geojsonFile: '/uploads/demo.gpx',
      },
      {
        id: '2',
        name: 'Route two',
        geojsonFile: '/ruta2',
      },
      {
        id: '1',
        name: 'Route three',
        geojsonFile: '/ruta3',
      },
    ]);

    return {
      isVisible,
      mapRoutes,

      onClickRoute(url: string) {
        console.log('click', url);
      },
    };
  },
});

// interface MapRoute {
//   id: string,
//   name: string,
//   geojsonFile: URL,
// }
</script>

<style lang="scss" scoped>
ul {
  list-style: none;
  text-align: left;
  padding-left: 0;
}
li {
  cursor: pointer;
}
</style>
