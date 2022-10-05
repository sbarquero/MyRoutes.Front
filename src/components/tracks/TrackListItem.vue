<template>
  <div class="list-group-item list-group-item-action">
    <h5 id="track-name" class="text-capitalize"><slot name="name"></slot></h5>
    <p id="track-description" class="fst-italic mb-0"><slot name="description"></slot></p>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
div.list-group-item {
  border-color: var(--primary-color-50);
  border-left-width: 8px;
  user-select: none;
}
div:hover {
  cursor: pointer;
  color: var(--color-text);
}
#track-name,
#track-description {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
