<template>
  <div class="round-btn" :title="tooltip">
    <AddIcon class="icon" />
  </div>
</template>

<script setup lang="ts">
import AddIcon from '../icons/IconAdd.vue';

defineProps<{
  tooltip: string;
}>();
</script>

<style lang="scss" scoped>
.round-btn {
  background-color: #333;
  border-radius: 50%;
  box-shadow: var(--btn-shadow);
  color: white;
  cursor: pointer;
  width: 3.5rem;
  height: 3.5rem;
  padding: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    box-shadow: var(--btn-shadow-hover);
  }
}
</style>
