<template>
    <div>
        <table class="table table-striped table-dark table-hover table-borderless">
            <thead>
                <tr>
                    <th scope="col">
                        Name
                    </th>
                    <th scope="col">
                        Actions
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="userGroup in userGroups" v-bind:key="userGroup.id">
                    <td>
                        {{ userGroup.name }}
                    </td>
                    <td>
                        <router-link v-if="showEditUserGroup" class="badge badge-secondary" v-bind:to="'/admin/usergroups/' + userGroup.id">
                            Edit User Group
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
        userGroups: Array
    },
    computed: {
        showEditUserGroup(){
            let roles = ['admin']
            return roles.includes(this.$store.state.currentUser.role)
        }
    }
}
</script>