<template>
  <DefaultContainer>
    <template #title>{{ t('userView.title') }}</template>
    <template #content>
      <div class="row">
        <div class="col-12 col-md-5 col-lg-4">
          <UserList />
        </div>
        <div v-if="userStore.userEditing" class="dark"></div>
        <div class="col-12 col-md-7 col-lg-8 mt-5 mt-md-0">
          <UserCard />
        </div>
      </div>
      <AddButton
        v-if="!userStore.userEditing"
        :tooltip="t('userView.addButton.tooltip')"
        @click="onAddUser"
        class="add-button"
      />
    </template>
  </DefaultContainer>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useUserStore } from '@/stores/userStore';
import AddButton from '@/components/shared/AddButton.vue';
import DefaultContainer from '../components/shared/DefaultContainer.vue';
import UserCard from '../components/users/UserCard.vue';
import UserList from '../components/users/UserList.vue';

const { t } = useI18n();
const userStore = useUserStore();

const onAddUser = async () => {
  userStore.newUser();
};
</script>

<style scoped>
.dark {
  background-color: rgba(0, 0, 0, 0.2);
  pointer-events: none;
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
}
.add-button {
  bottom: 1.25rem;
  right: 1.5rem;
  position: absolute;
}
</style>
