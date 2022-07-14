<template>
  <h3 class="mb-4 ms-1">{{ t('userView.userList.title') }}</h3>
  <div class="list-group">
    <template v-for="user in state.users" v-bind:key="user._id">
      <UserListItem
        @click="onUserSelect(user._id)"
        :class="
          user._id === userStore.selectedUser._id
            ? 'selected'
            : userStore.userEditing
            ? 'editing'
            : ''
        "
      >
        <template #name>{{ user.name }}</template>
        <template #email>{{ user.email }}</template>
      </UserListItem>
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, useAttrs } from 'vue';
import { useI18n } from 'vue-i18n';
import { useUserStore } from '@/stores/userStore';
import type { UserListDto } from '@/interfaces/user.interface';
import userApi from '@/api/userApi';
import UserListItem from './UserListItem.vue';
import { showError } from '@/utils/messages';

const { t } = useI18n();
const userStore = useUserStore();

const state = reactive({
  users: [] as UserListDto[],
});

onMounted(async () => {
  const token = localStorage.getItem('token');
  const response = await userApi.get('', {
    headers: { Authorization: `Bearer ${token}` },
  });
  state.users = response.data;
});

const onUserSelect = async (id: string) => {
  const response = await userStore.getUser(id);
  userStore.userEditing = true;
  if (!response.ok) {
    showError(response.message);
  }
};
</script>

<style scoped>
.list-group {
  border: solid 1px #ccc;
  height: 70vh;
  overflow-y: auto;
}
.selected {
  background-color: #eee;
  border-left: solid 5px #888;
  cursor: pointer;
  pointer-events: none;
}
.editing {
  opacity: 0.3;
  pointer-events: none;
}
</style>
