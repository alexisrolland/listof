<template>
    <!-- Use router-link rather than v-on:click to allow user to open page in new window -->
    <router-link v-if="show" v-bind:to="listId + '/values'">
        <button type="button" class="btn btn-secondary">
            View Values
        </button>
    </router-link>
</template>

<script>
export default {
    props: {
        listId: Number
    },
    computed: {
        show(){
            let roles = ['admin', 'advanced', 'standard']
            return roles.includes(this.$store.state.currentUser.role)
        }
    }
}
</script>