<template>
    <nav class="navbar text-light justify-content-between">
        <span class="navbar-brand">
            <router-link to="/">
                ListOf...
            </router-link>
        </span>

        <form class="form-inline">
            <header-select-user-group></header-select-user-group>
            <header-button-admin></header-button-admin>
            <header-button-login></header-button-login>
            <header-button-logout></header-button-logout>
        </form>
    </nav>
</template>

<script>
import HeaderSelectUserGroup from './HeaderSelectUserGroup.vue';
import HeaderButtonAdmin from './HeaderButtonAdmin.vue';
import HeaderButtonLogin from './HeaderButtonLogin.vue';
import HeaderButtonLogout from './HeaderButtonLogout.vue';

export default {
    components: {
        'header-select-user-group': HeaderSelectUserGroup,
        'header-button-admin': HeaderButtonAdmin,
        'header-button-login': HeaderButtonLogin,
        'header-button-logout': HeaderButtonLogout
    }
}
</script>

<style>
.navbar { background-color: #2C3034; }
</style>