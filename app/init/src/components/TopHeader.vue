<template>
    <nav class="navbar bg-light text-dark">
        <span class="navbar-brand">
            <router-link to="/">
                ListOf...
            </router-link>
        </span>
        <list-button-create></list-button-create>
    </nav>
</template>

<script>
import ListButtonCreate from './ListButtonCreate.vue';

export default {
    components: {
        'list-button-create': ListButtonCreate
    }
}
</script>