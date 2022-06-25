<template>
  <div class="container mt-5">
    <h1>{{ t('userView.title') }}</h1>
    <div class="card p-4 mt-5">
      <div class="row">
        <div class="col-4">
          <UserList />
        </div>
        <div class="col-8">
          <UserCard />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import UserList from '../components/users/UserList.vue';
import UserCard from '../components/users/UserCard.vue';

const { t } = useI18n();
</script>

<style scoped></style>
