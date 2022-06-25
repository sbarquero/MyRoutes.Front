<template>
  <div class="list-group-item list-group-item-action">
    <h5 class="ms-1 text-capitalize"><slot name="name"></slot></h5>
    <h6 class="ms-1 text-lowercase fst-italic"><slot name="email"></slot></h6>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
div.list-group-item {
  border-left-width: 5px;
  user-select: none;
}
div:hover {
  cursor: pointer;
}
</style>
