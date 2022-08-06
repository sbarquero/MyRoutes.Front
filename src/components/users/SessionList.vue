<template>
  <div class="card">
    <div class="card-body">
      <table class="table">
        <thead>
          <tr>
            <th scope="col">
              <b>{{ t('userView.userSession.userId') }}</b>
            </th>
            <th scope="col">
              <b>{{ t('userView.userSession.expireAt') }}</b>
            </th>
            <th scope="col">
              <b>{{ t('userView.userSession.reject') }}</b>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="session in selectedUser.sessions" :key="session._id">
            <td>{{ session._id }}</td>
            <td>{{ d(session.expireAt, 'long') }}</td>
            <td>
              <button
                type="button"
                class="btn btn-secondary btn-sm"
                :title="t('userView.userSession.rejectButtonText')"
                :disabled="session._id === authStore.sessionId"
              >
                <IconDelete />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/authStore';
import { useUserStore } from '@/stores/userStore';
import IconDelete from '../icons/IconDelete.vue';

const { t, d } = useI18n();

const authStore = useAuthStore();
const userStore = useUserStore();
const { selectedUser } = storeToRefs(userStore);
</script>

<style scoped></style>
