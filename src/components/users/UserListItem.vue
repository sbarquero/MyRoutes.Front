<template>
  <div class="list-group-item list-group-item-action">
    <h5>{{ userData?.name }}</h5>
    <h6>{{ userData?.email }}</h6>
  </div>
</template>

<script setup lang="ts">
import type { UserListDto } from '@/interfaces/user.interface';

defineProps<{
  userData: UserListDto;
}>();
</script>

<style scoped>
div.list-group-item {
  border-left-width: 5px;
  user-select: none;
}
div:hover {
  cursor: pointer;
}
</style>
