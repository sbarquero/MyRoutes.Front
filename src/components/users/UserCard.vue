<template>
  <h3 class="mb-4 ms-1">{{ t('userView.userCard.title') }}</h3>
  <div v-if="userStore.state._id" class="card p-4">
    <p>
      <b>{{ t('userView.userCard.id') }}:</b> {{ userStore.state._id }}<br />
    </p>
    <p>
      <b>{{ t('userView.userCard.name') }}:</b> {{ userStore.state.name }}<br />
    </p>
    <p>
      <b>{{ t('userView.userCard.email') }}:</b> {{ userStore.state.email }}<br />
    </p>
    <p>
      <b>{{ t('userView.userCard.rol') }}:</b> {{ userStore.state.rol }}<br />
    </p>
    <p>
      <b>{{ t('userView.userCard.createAt') }}:</b> {{ userStore.state.createAt }}<br />
    </p>
    <p>
      <b>{{ t('userView.userCard.updateAt') }}:</b> {{ userStore.state.updateAt }}<br />
    </p>
    <p>
      <b>{{ t('userView.userCard.sessions') }}:</b>
      {{ userStore.state.sessions ? userStore.state.sessions.length : 0 }}
    </p>
  </div>
  <div v-else>
    <h5 class="ms-1">{{ t('userView.userCard.selectUser') }}</h5>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useUserStore } from '@/stores/userStore';

const { t } = useI18n();
const userStore = useUserStore();
</script>

<style scoped></style>
