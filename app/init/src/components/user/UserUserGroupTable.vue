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
                    <!-- Allow remove user group only if user group is not Public -->
                    <td v-if="userGroup.userGroupId!=0">
                        <span class="badge badge-secondary" v-on:click="removeUserGroup(userGroup.id)">
                            Remove
                        </span>
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
        user: Object
    },
    methods: {
        removeUserGroup(id) {
            // Method to delete a relationship between a user and a user group
            let payload = {
                'query': this.$store.state.mutationDeleteUserGroupUser,
                'variables': { 'id': id }
            };
            this.$http.post(this.$store.state.graphqlUrl, payload).then (
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
    }
}
</script>

<style>
.badge { cursor: pointer }
</style>