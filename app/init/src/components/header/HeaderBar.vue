<template>
    <nav class="navbar bg-light text-dark">
        <span class="navbar-brand">
            <router-link to="/">
                ListOf...
            </router-link>
        </span>
        <header-button-create></header-button-create>
    </nav>
</template>

<script>
import HeaderButtonCreate from './HeaderButtonCreate.vue';

export default {
    components: {
        'header-button-create': HeaderButtonCreate
    }
}
</script>