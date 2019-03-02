<template>
    <router-link v-if="show" to="/lists/new">
        <button class="btn btn-success">
            Create List
        </button>
    </router-link>
</template>

<script>
export default {
    computed: {
        show(){
            let roles = ['admin', 'advanced']
            return roles.includes(this.$store.state.currentUser.role)
        }
    }
}
</script>