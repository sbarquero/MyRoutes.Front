<template>
  <nav class="navbar navbar-light bg-light">
    <div class="container-fluid">
      <RouterLink to="/" class="navbar-brand mb-0 h1">MyRoutes</RouterLink>
      <div class="d-flex">
        <!-- User Dropdown -->
        <div class="dropdown">
          <OptionBtn
            class="button"
            id="dropdownLoginButton"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            tooltip="Login"
          >
            <LoginIcon class="icon" />
          </OptionBtn>
          <div class="dropdown-menu dropdown-menu-end">
            <form class="px-4 py-3" style="min-width: 300px">
              <div class="mb-3">
                <label for="exampleDropdownFormEmail1" class="form-label"
                  >Email address</label
                >
                <input
                  type="email"
                  class="form-control"
                  id="exampleDropdownFormEmail1"
                  placeholder="email@example.com"
                />
              </div>
              <div class="mb-3">
                <label for="exampleDropdownFormPassword1" class="form-label"
                  >Password</label
                >
                <input
                  type="password"
                  class="form-control"
                  id="exampleDropdownFormPassword1"
                  placeholder="Password"
                />
              </div>
              <div class="mb-3">
                <div class="form-check">
                  <input
                    type="checkbox"
                    class="form-check-input"
                    id="dropdownCheck"
                  />
                  <label class="form-check-label" for="dropdownCheck">
                    Remember me
                  </label>
                </div>
              </div>
              <button type="submit" class="btn btn-primary">Sign in</button>
            </form>
            <div class="dropdown-divider"></div>
            <a class="dropdown-item" href="#">New around here? Sign up</a>
            <a class="dropdown-item" href="#">Forgot password?</a>
          </div>
        </div>

        <!-- Menu Dropdown -->
        <div class="dropdown">
          <OptionBtn
            class="button"
            id="dropdownMenuButton"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            tooltip="Menu"
            @click="$emit('selectedOptionLogin')"
          >
            <span class="navbar-toggler-icon icon"></span>
          </OptionBtn>
          <ul
            class="dropdown-menu dropdown-menu-end"
            aria-labelledby="dropdownMenuButton"
          >
            <li>
              <h2 class="dropdown-header bg-secondary text-light">Menu</h2>
            </li>
            <li>
              <RouterLink :to="{ name: 'home' }" class="dropdown-item">
                <MapIcon class="icon" />
                <span class="menu-label">Home</span>
              </RouterLink>
            </li>
            <li><hr class="dropdown-divider" /></li>
            <li>
              <RouterLink :to="{ name: 'users' }" class="dropdown-item">
                <PeopleIcon class="icon" />
                <span class="menu-label">Users management</span>
              </RouterLink>
            </li>
            <li>
              <RouterLink :to="{ name: 'configuration' }" class="dropdown-item">
                <GearIcon class="icon" />
                <span class="menu-label">Configuration</span>
              </RouterLink>
            </li>
            <li><hr class="dropdown-divider" /></li>
            <li>
              <RouterLink :to="{ name: 'about' }" class="dropdown-item">
                <InfoIcon class="icon" />
                <span class="menu-label">About</span>
              </RouterLink>
            </li>
          </ul>
        </div>
      </div>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item">
            <a class="nav-link active" aria-current="page" href="#">Home</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Features</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Pricing</a>
          </li>
          <li class="nav-item">
            <a class="nav-link disabled">Disabled</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";

import LoginIcon from "./icons/IconLogin.vue";
import MapIcon from "./icons/IconMap.vue";
import OptionBtn from "./OptionBtn.vue";
import PeopleIcon from "./icons/IconPeople.vue";
import GearIcon from "./icons/IconGear.vue";
import InfoIcon from "./icons/IconInfo.vue";
</script>
<style scoped>
.button {
  margin-left: 1rem;
}
.icon {
  width: 1.2rem;
  height: 1.2rem;
}
.menu-label {
  align-items: cente;
  margin-left: 1rem;
}
</style>
