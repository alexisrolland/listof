<template>
    <button type="button" class="btn btn-secondary" v-on:click="gotoUser">
        Users
    </button>
</template>

<script>
export default {
   methods: {
        gotoUser() {
            this.$router.push({
                name: 'admin-user'
            });
        }
   }
}
</script>