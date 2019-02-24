<template>
    <button class="btn btn-outline-secondary ml-1" v-on:click="logout">
        Logout
    </button>
</template>

<script>
export default {
    methods: {
        logout() {
            this.$session.destroy();
            this.$store.state.isAuthenticated = false;
            this.$router.push({
                name: 'home'
            });
        }
    }
}
</script>
