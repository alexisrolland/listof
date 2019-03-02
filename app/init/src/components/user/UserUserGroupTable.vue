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
                <tr v-for="userGroup in user.sysUserGroupUsersByUserId.nodes" v-bind:key="userGroup.id">
                    <td>
                        {{ userGroup.sysUserGroupByUserGroupId.name }}
                    </td>
                    <td>
                        <span v-if="showRemoveUserGroup" class="badge badge-secondary" v-on:click="removeUserGroup(userGroup.id)">
                            Remove
                        </span>
                    </td>
                </tr>
            </tbody>
        </table>
        
        
    </div>
</template>

<script>
export default {
    props: {
        user: Object
    },
    methods: {
        removeUserGroup(id) {
            // Method to delete a relationship between a user and a user group
            let payload = {
                'query': this.$store.state.mutationDeleteUserGroupUser,
                'variables': { 'id': id }
            };
            let headers = {};
            if (this.$session.exists()) {
                headers = { 'Authorization': 'Bearer ' + this.$session.get('jwt') };
            };
            this.$http.post(this.$store.state.graphqlUrl, payload, {headers}).then (
                function(response){
                    if(response.data.errors){
                        this.$store.state.errorObject.flag = true;
                        this.$store.state.errorObject.message = response.data.errors[0].message;
                    } else {
                        this.$emit("removeUserGroupUser", id);
                    }
                }
            );
        }
    },
    computed: {
        showRemoveUserGroup(){
            let roles = ['admin']
            return roles.includes(this.$store.state.currentUser.role)
        }
    }
}
</script>

<style>
.badge { cursor: pointer }
</style>