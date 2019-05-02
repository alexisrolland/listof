<template>
    <!-- Use router-link rather than v-on:click to allow user to open page in new window -->
    <router-link v-if="show" v-bind:to="listId + '/attributes/new'">
        <button type="button" class="btn btn-success">
            Add Attribute
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
            let roles = ['admin', 'advanced']
            return roles.includes(this.$store.state.currentUser.role)
        }
    }
}
</script>