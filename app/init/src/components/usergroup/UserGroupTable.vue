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
                    <!-- Allow edit user only if user is not postgres -->
                    <td v-if="userGroup.id!=0">
                        <router-link class="badge badge-secondary" v-bind:to="'/admin/usergroups/' + userGroup.id">
                            Edit User Group
                        </router-link>
                    </td>
                    <td v-else></td>
                </tr>
            </tbody>
        </table>
        
        
    </div>
</template>

<script>
export default {
    props: {
        userGroups: Array
    }
}
</script>