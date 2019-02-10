<template>
    <nav class="navbar bg-light text-dark justify-content-between">
        <span class="navbar-brand">
            <router-link to="/">
                ListOf...
            </router-link>
        </span>

        <form class="form-inline">
            <header-button-create></header-button-create>
            <header-button-admin></header-button-admin>
        </form>
    </nav>
</template>

<script>
import HeaderButtonCreate from './HeaderButtonCreate.vue';
import HeaderButtonAdmin from './HeaderButtonAdmin.vue';

export default {
    components: {
        'header-button-create': HeaderButtonCreate,
        'header-button-admin': HeaderButtonAdmin
    }
}
</script>