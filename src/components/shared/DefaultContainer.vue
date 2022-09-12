<template>
  <div class="map-background">
    <div class="container-fluid container-lg mt-0">
      <h1 class="title"><slot name="title"></slot></h1>
      <div class="card p-4 mt-4">
        <slot name="content"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.map-background {
  background: url('@/assets/img/world-topo-map.png') no-repeat center;
  background-size: cover;
  height: calc(100% - 3rem);
}

.card {
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 10px;
  border-radius: 0.35rem;
}

.title {
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 10px;
  border-radius: 0.35rem;
  display: inline-block;
  margin-top: 1rem;
  padding: 0.1rem 1rem 0.25rem 1rem;
}
</style>
