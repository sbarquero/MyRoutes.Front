<template>
  <h3 class="mb-4 ms-1">{{ t('userView.userList.title') }}</h3>
  <div class="list-group">
    <template v-for="user in state.users" v-bind:key="user._id">
      <UserListItem
        @click="onUserSelect(user._id)"
        :class="user._id === userStore.state._id ? 'disabled' : ''"
      >
        <template #name>{{ user.name }}</template>
        <template #email>{{ user.email }}</template>
      </UserListItem>
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import { useUserStore } from '@/stores/userStore';
import type { UserListDto } from '@/interfaces/user.interface';
import userApi from '@/api/userApi';
import UserListItem from './UserListItem.vue';

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

const onUserSelect = (id: string) => {
  userStore.getUser(id);
};
</script>

<style scoped>
.disabled {
  background-color: #eee;
  border-left: solid 5px #888;
  cursor: pointer;
}
</style>
