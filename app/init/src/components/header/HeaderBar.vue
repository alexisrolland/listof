<template>
    <nav class="navbar text-light justify-content-between">
        <span class="navbar-brand">
            <router-link to="/">
                ListOf...
            </router-link>
        </span>

        <form class="form-inline">
            <list-button-create></list-button-create>
            <header-button-admin></header-button-admin>
        </form>
    </nav>
</template>

<script>
import ListButtonCreate from '../list/ListButtonCreate.vue';
import HeaderButtonAdmin from './HeaderButtonAdmin.vue';

export default {
    components: {
        'list-button-create': ListButtonCreate,
        'header-button-admin': HeaderButtonAdmin
    }
}
</script>

<style>
.navbar { background-color: #2C3034; }
</style>