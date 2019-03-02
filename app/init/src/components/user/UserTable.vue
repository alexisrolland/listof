<template>
    <div>
        <table class="table table-striped table-dark table-hover table-borderless">
            <thead>
                <tr>
                    <th scope="col">
                        E-mail
                    </th>
                    <th scope="col">
                        Role
                    </th>
                    <th scope="col">
                        Active
                    </th>
                    <th scope="col">
                        Actions
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="user in users" v-bind:key="user.id">
                    <td>
                        {{ user.email }}
                    </td>
                    <td>
                        {{ user.role }}
                    </td>
                    <td>
                        {{ user.flagActive }}
                    </td>
                    <td>
                        <router-link v-if="showEditUser" class="badge badge-secondary" v-bind:to="'/admin/users/' + user.id">
                            Edit User
                        </router-link>
                    </td>
                </tr>
            </tbody>
        </table>
        
        
    </div>
</template>

<script>
export default {
    props: {
        users: Array
    },
    computed: {
        showEditUser(){
            let roles = ['admin']
            return roles.includes(this.$store.state.currentUser.role)
        }
    }
}
</script>