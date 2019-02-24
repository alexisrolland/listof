<template>
    <nav class="navbar text-light justify-content-between">
        <span class="navbar-brand">
            <router-link to="/">
                ListOf...
            </router-link>
        </span>

        <form class="form-inline">
            <list-button-create v-if="isAuthenticated"></list-button-create>
            <header-button-admin v-if="isAuthenticated"></header-button-admin>
            <header-button-login v-if="!isAuthenticated"></header-button-login>
            <header-button-logout v-if="isAuthenticated"></header-button-logout>
        </form>
    </nav>
</template>

<script>
import ListButtonCreate from '../list/ListButtonCreate.vue';
import HeaderButtonAdmin from './HeaderButtonAdmin.vue';
import HeaderButtonLogin from './HeaderButtonLogin.vue';
import HeaderButtonLogout from './HeaderButtonLogout.vue';

export default {
    components: {
        'list-button-create': ListButtonCreate,
        'header-button-admin': HeaderButtonAdmin,
        'header-button-login': HeaderButtonLogin,
        'header-button-logout': HeaderButtonLogout
    },
    props: {
        isAuthenticated: Boolean
    }
}
</script>

<style>
.navbar { background-color: #2C3034; }
</style>