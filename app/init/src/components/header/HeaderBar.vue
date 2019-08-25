<template>
  <nav class="navbar text-light justify-content-between">
    <span class="navbar-brand">
      <router-link to="/">
        ListOf...
      </router-link>
    </span>

    <form class="form-inline">
      <!-- User group is picked when creating lists instead of at session level -->
      <!-- <header-select-user-group></header-select-user-group> -->
      <list-button-create></list-button-create>
      <header-button-admin></header-button-admin>
      <header-button-login></header-button-login>
      <header-button-logout></header-button-logout>
    </form>
  </nav>
</template>

<script>
import ListButtonCreate from "../list/ListButtonCreate.vue";
import HeaderButtonAdmin from "./HeaderButtonAdmin.vue";
import HeaderButtonLogin from "./HeaderButtonLogin.vue";
import HeaderButtonLogout from "./HeaderButtonLogout.vue";

export default {
  components: {
    "list-button-create": ListButtonCreate,
    "header-button-admin": HeaderButtonAdmin,
    "header-button-login": HeaderButtonLogin,
    "header-button-logout": HeaderButtonLogout
  }
};
</script>

<style>
.navbar {
  background-color: #2c3034;
}
</style>
