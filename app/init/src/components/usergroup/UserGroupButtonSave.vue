<template>
    <button type="button" class="btn btn-success" v-on:click="saveUserGroup">
        Save
    </button>
</template>

<script>
export default {
    props: {
        userGroup: Object
    },
    methods: {
        saveUserGroup() {
            // Method to create or update a user group
            // If userGroup.id exists, update existing user group
            if (this.userGroup.id) {
                let payload = {
                    'query': this.$store.state.mutationUpdateUserGroup,
                    'variables': { 
                        'id': this.userGroup.id,
                        'sysUserGroupPatch': {
                            "name": this.userGroup.name
                        }
                    }
                };
                this.$http.post(this.$store.state.graphqlUrl, payload).then (
                    function(response){
                        if(response.data.errors){
                            this.$store.state.errorObject.flag = true;
                            this.$store.state.errorObject.message = response.data.errors[0].message;
                        }
                    }
                );
            }
            // If userGroup.id does not exist, create a new user group
            else {
                let payload = {
                    'query': this.$store.state.mutationCreateUserGroup,
                    'variables': {
                        'sysUserGroup': {
                            "name": this.userGroup.name
                        }
                    }
                };
                this.$http.post(this.$store.state.graphqlUrl, payload).then (
                    function(response){
                        if(response.data.errors){
                            this.$store.state.errorObject.flag = true;
                            this.$store.state.errorObject.message = response.data.errors[0].message;
                        } else {
                            // Capture new user group Id in case user wants to delete or update it
                            this.userGroup.id = response.data.data.createSysUserGroup.sysUserGroup.id;
                            this.$router.push({
                                name: 'edit-user-group',
                                params: {
                                    userGroupId: this.userGroup.id
                                }
                            });
                        }
                    }
                );
            }
        }
    }
}
</script>