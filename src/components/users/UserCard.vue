<template>
  <h3 class="mb-4 ms-1">{{ t('userView.userCard.title') }}</h3>
  <div v-if="userStore.selectedUser._id || userStore.isNewUser" class="card p-4">
    <form
      @submit.prevent
      autocomplete="chrome-off"
      class="row gx-3 gy-2 needs-validation"
      id="userform"
      novalidate
    >
      <!-- User Id -->
      <div class="col-12 col-lg-5">
        <div class="form-floating mb-3">
          <input
            class="form-control"
            disabled
            id="userIdInput"
            type="text"
            v-model="userStore.selectedUser._id"
            :placeholder="t('userView.userCard.id')"
          />
          <label for="userIdInput">{{ t('userView.userCard.id') }}</label>
        </div>
      </div>
      <!-- Email -->
      <div class="col-12 col-lg-5">
        <div class="form-floating mb-3">
          <input
            :disabled="userStore.selectedUser._id !== '' && !userStore.isNewUser"
            autocomplete="off"
            class="form-control"
            :class="v$.email.$error ? 'is-invalid' : ''"
            id="emailInput"
            required
            type="email"
            v-model="selectedUser.email"
            @blur="v$.email.$touch"
            :placeholder="t('userView.userCard.email')"
          />
          <label for="emailInput">{{ t('userView.userCard.email') }}</label>
          <div v-if="v$.email.$error" class="invalid-feedback">
            {{ v$.email.$errors[0].$message }}
          </div>
        </div>
      </div>
      <!-- Active -->
      <div class="col-12 col-lg-2">
        <div class="form-check my-3">
          <input
            class="form-check-input"
            id="activeInput"
            type="checkbox"
            v-model="selectedUser.active"
          />
          <label class="form-check-label" for="flexCheckDefault">
            {{ t('userView.userCard.active') }}
          </label>
        </div>
      </div>
      <!-- Name -->
      <div class="col-12 col-lg-8">
        <div class="form-floating mb-3">
          <input
            autocomplete="new-name"
            class="form-control"
            id="nameInput"
            type="text"
            v-model="selectedUser.name"
            :class="v$.name.$error ? 'is-invalid' : ''"
            :placeholder="t('userView.userCard.name')"
            @blur="v$.name.$touch"
          />
          <label for="nameInput">{{ t('userView.userCard.name') }}</label>
          <div v-if="v$.name.$error" class="invalid-feedback">
            {{ v$.name.$errors[0].$message }}
          </div>
        </div>
      </div>
      <!-- Rol -->
      <div class="col-12 col-lg-4">
        <div class="form-floating mb-3">
          <select
            v-model="selectedUser.rol"
            class="form-select"
            :aria-label="t('userView.userCard.rol')"
            id="rolSelectInput"
          >
            <option value="admin">{{ t('userView.userCard.roles.admin') }}</option>
            <option value="user">{{ t('userView.userCard.roles.user') }}</option>
          </select>
          <label for="floatingSelect">{{ t('userView.userCard.rol') }}</label>
        </div>
      </div>
      <!-- Password -->
      <div class="col-12 col-lg-6">
        <div class="form-floating mb-3">
          <input
            autocomplete="new-password"
            v-model="state.password"
            type="password"
            class="form-control"
            id="passwordInput"
            :class="state.passwordError ? 'is-invalid' : ''"
            :placeholder="t('userView.userCard.password')"
            @input="onPasswordInput"
            @blur="onPasswordInput"
          />
          <label for="floatingInput">{{ t('userView.userCard.password') }}</label>
          <div v-if="state.passwordError" class="invalid-feedback">
            {{ state.passwordErrorMessage }}
          </div>
        </div>
      </div>
      <!-- ConfirmPassword -->
      <div class="col-12 col-lg-6">
        <div class="form-floating mb-3">
          <input
            v-model="state.confirmPassword"
            type="password"
            class="form-control"
            id="confirmPasswordInput"
            :class="state.confirmPasswordError ? 'is-invalid' : ''"
            :placeholder="t('userView.userCard.confirmPassword')"
            @input="onRepeatPasswordInput"
            @blur="onRepeatPasswordInput"
          />
          <label for="floatingInput">{{ t('userView.userCard.confirmPassword') }}</label>
          <div v-if="state.confirmPasswordError" class="invalid-feedback">
            {{ state.confirmPasswordErrorMessage }}
          </div>
        </div>
      </div>
      <!-- Created at & update at info -->
      <div v-if="!userStore.isNewUser" class="col-12 mb-3">
        <div class="card p-3">
          <div>
            <b>{{ t('userView.userCard.createAt') }}: </b>
            {{ d(userStore.createDate, 'long') }}<br />
          </div>
          <div class="mt-2">
            <b>{{ t('userView.userCard.updateAt') }}: </b>
            {{ d(userStore.upateDate, 'long') }}<br />
          </div>
        </div>
      </div>
      <!-- Session info -->
      <div
        v-if="
          !userStore.isNewUser &&
          userStore.selectedUser.sessions &&
          userStore.selectedUser.sessions.length > 0
        "
      >
        <UserSessions />
      </div>
      <!-- Save & cancel buttons -->
      <div class="mt-3">
        <button @click="onSaveUser" type="button" class="btn btn-secondary">
          {{ t('userView.userCard.save') }}
        </button>
        <button @click="onCancelUser" type="button" class="btn btn-light border-secondary ms-3">
          {{ t('userView.userCard.cancel') }}
        </button>
      </div>
    </form>
  </div>
  <div v-else>
    <h5 class="alert alert-secondary ms-1">{{ t('userView.userCard.selectUser') }}</h5>
  </div>
</template>

<script setup lang="ts">
import { email, helpers, minLength, required } from '@vuelidate/validators';
import { reactive } from 'vue';
import { storeToRefs } from 'pinia';
import Swal from 'sweetalert2';
import useVuelidate from '@vuelidate/core';
import { useI18n } from 'vue-i18n';
import { useUserStore } from '@/stores/userStore';
import { showError, showOk } from '@/utils/messages';
import UserSessions from './UserSessions.vue';

const { t, d } = useI18n();

const userStore = useUserStore();
const { selectedUser } = storeToRefs(userStore);

const state = reactive({
  password: '',
  confirmPassword: '',
  passwordError: false,
  passwordErrorMessage: '',
  confirmPasswordError: false,
  confirmPasswordErrorMessage: '',
});

function initialize() {
  state.password = '';
  state.confirmPassword = '';
  state.passwordError = false;
  state.passwordErrorMessage = '';
  state.confirmPasswordError = false;
  state.confirmPasswordErrorMessage = '';
  userStore.userEditing = false;
  userStore.clearUser();
  v$.value.$reset();
}

const rules = {
  name: {
    required: helpers.withMessage(t('userView.userCard.errorMsg.nameRequired'), required),
    minLength: helpers.withMessage(t('userView.userCard.errorMsg.nameMinLength'), minLength(3)),
  },
  email: {
    required: helpers.withMessage(t('userView.userCard.errorMsg.emailRequired'), required),
    email: helpers.withMessage(t('userView.userCard.errorMsg.emailValid'), email),
  },
};

const v$ = useVuelidate(rules, selectedUser);

const onPasswordInput = () => {
  validatePassword();
};

const onRepeatPasswordInput = () => {
  validateConfirmPassword();
};

const validatePassword = () => {
  state.passwordError = false;
  if (userStore.isNewUser && state.password.length === 0) {
    state.passwordError = true;
    state.passwordErrorMessage = t('userView.userCard.errorMsg.passwordRequired');
  } else if (state.password.length > 0 && state.password.length < 6) {
    state.passwordError = true;
    state.passwordErrorMessage = t('userView.userCard.errorMsg.passwordMinLength');
  } else {
    if (state.password === state.confirmPassword) {
      state.confirmPasswordError = false;
    } else {
      state.confirmPasswordError = true;
      state.confirmPasswordErrorMessage = t('userView.userCard.errorMsg.passwordDifferent');
    }
  }
};

const validateConfirmPassword = () => {
  state.confirmPasswordError = false;
  if (userStore.isNewUser && state.confirmPassword.length === 0) {
    state.confirmPasswordError = true;
    state.confirmPasswordErrorMessage = t('userView.userCard.errorMsg.passwordRequired');
  } else if (state.confirmPassword.length > 0 && state.confirmPassword.length < 6) {
    state.confirmPasswordError = true;
    state.confirmPasswordErrorMessage = t('userView.userCard.errorMsg.passwordMinLength');
  } else if (state.confirmPassword.length >= 6 && state.password != state.confirmPassword) {
    state.confirmPasswordError = true;
    state.confirmPasswordErrorMessage = t('userView.userCard.errorMsg.passwordDifferent');
  } else {
    if (state.password != state.confirmPassword) {
      state.confirmPasswordError = true;
      state.confirmPasswordErrorMessage = t('userView.userCard.errorMsg.passwordDifferent');
      validatePassword();
    } else {
      state.passwordError = false;
      state.confirmPasswordError = false;
    }
  }
};

const onSaveUser = async () => {
  const validInput = await v$.value.$validate();
  validatePassword();
  validateConfirmPassword();
  if (!validInput || state.passwordError || state.confirmPasswordError) {
    showError(
      t('userView.userCard.formValidation.errorTitle'),
      t('userView.userCard.formValidation.errorText'),
    );
    return;
  }
  if (userStore.isNewUser) {
    await createUser();
  } else {
    await updateUser();
  }
  await userStore.getUserList();
  initialize();
};

const onCancelUser = () => {
  if (userHasChanged()) confirmUserCancellation();
  else {
    initialize();
  }
};

const userHasChanged = () => {
  if (
    userStore.userInitialState !== userStore.getUserState ||
    state.password !== '' ||
    state.confirmPassword !== ''
  )
    return true;

  return false;
};

const confirmUserCancellation = () => {
  Swal.fire({
    title: t('userView.userCard.cancellation.title'),
    text: t('userView.userCard.cancellation.text'),
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: t('userView.userCard.cancellation.confirmButtonText'),
    cancelButtonText: t('userView.userCard.cancellation.cancelButtonText'),
  }).then(result => {
    if (result.isConfirmed) {
      initialize();
    }
  });
};

const createUser = async () => {
  userStore.selectedUser.password = state.password;
  const result = await userStore.createUser();
  if (result.ok) {
    showOk(
      t('userView.userCard.formValidation.createTitle'),
      t('userView.userCard.formValidation.createText'),
    );
  } else {
    showError(t('error'), result.message);
  }
};

const updateUser = async () => {
  userStore.selectedUser.password = state.password;
  const result = await userStore.updateUser();
  if (result.ok) {
    showOk(
      t('userView.userCard.formValidation.updateTitle'),
      t('userView.userCard.formValidation.updateText'),
    );
  } else {
    showError(t('error'), result.message);
  }
};
</script>

<style scoped></style>
