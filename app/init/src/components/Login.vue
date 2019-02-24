<template>
    <div class="col-8">
        <h1 class="mt-5">Login</h1>

        <!-- User Form -->
        <div class="form-group w-25">
            <label for="userEmail" class="col-form-label">
                E-mail:
            </label>
            <input class="form-control col-sm"
                id="userEmail"
                type="email"
                required="required"
                placeholder="Type user e-mail"
                v-model="credentials.email" />
        </div>
        <div class="form-group w-25">
            <label for="userPassword" class="col-form-label">
                Password:
            </label>
            <input class="form-control col-sm"
                id="userPassword"
                type="password"
                required="true"
                placeholder="Type user password"
                v-model="credentials.password" />
        </div>
        <button type="button" class="btn btn-success" v-on:click="authenticateUser">
            Login
        </button>
    </div>
</template>

<script>
export default {
    data: function () {
        return {
            'credentials': {}
        }
    },
    methods: {
        authenticateUser() {
            let payload = {
                'query': this.$store.state.mutationAuthenticateUser,
                'variables': { 
                    'userEmail': this.credentials.email,
                    'userPassword': this.credentials.password
                }
            };
            this.$http.post(this.$store.state.graphqlUrl, payload).then (
                function(response){
                    if(response.data.errors){
                        this.$store.state.errorObject.flag = true;
                        this.$store.state.errorObject.message = response.data.errors[0].message;
                    } else {
                        let token = response.data.data.authenticateUser.sysToken
                        if (token) {
                            this.$session.set('jwt', token);
                            this.$store.state.isAuthenticated = true;
                            this.$router.push({
                                name: 'home'
                            });
                        } else {
                            this.$store.state.errorObject.flag = true;
                            this.$store.state.errorObject.message = 'Authentication failed. Login or password incorrect or user account has been inactivated.';
                        }
                    }
                }
            );
        }
    }
}
</script>

