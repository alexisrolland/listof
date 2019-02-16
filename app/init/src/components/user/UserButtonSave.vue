<template>
    <button type="button" class="btn btn-success" v-on:click="saveUser">
        Save
    </button>
</template>

<script>
export default {
    props: {
        user: Object
    },
    methods: {
        saveUser() {
            // Method to create or update a user
            // If user.id exists, update existing user
            if (this.user.id) {
                let payload = {
                    'query': this.$store.state.mutationUpdateUser,
                    'variables': { 
                        'id': this.user.id,
                        'sysUserPatch': {
                            "email": this.user.email,
                            "role": this.user.role,
                            "flagActive": this.user.flagActive
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
            // If user.id does not exist, create a new user
            else {
                let payload = {
                    'query': this.$store.state.mutationCreateUser,
                    'variables': {
                        'sysUser': {
                            "email": this.user.email,
                            "password": this.user.password,
                            "role": this.user.role,
                            "flagActive": this.user.flagActive
                        }
                    }
                };
                this.$http.post(this.$store.state.graphqlUrl, payload).then (
                    function(response){
                        if(response.data.errors){
                            this.$store.state.errorObject.flag = true;
                            this.$store.state.errorObject.message = response.data.errors[0].message;
                        } else {
                            // Capture new list Id in case user wants to delete or update it
                            this.user.id = response.data.data.createSysUser.sysUser.id;
                            this.$router.push({
                                name: 'edit-user',
                                params: {
                                    userId: this.user.id
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