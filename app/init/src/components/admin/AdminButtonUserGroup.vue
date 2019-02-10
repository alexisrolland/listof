<template>
    <button type="button" class="btn btn-secondary" v-on:click="gotoUserGroup">
        User Groups
    </button>
</template>

<script>
export default {
   methods: {
        gotoUserGroup() {
            this.$router.push({
                name: 'admin-user-group'
            });
        }
   }
}
</script>