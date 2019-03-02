<template>
    <button v-if="show" type="button" class="btn btn-danger float-right" v-on:click="deleteValue">
        Delete
    </button>
</template>

<script>
export default {
    props: {
        graphQlListName: String, // Example tableName
        valueId: Number,
        listId: Number
    },
    methods: {
        deleteValue() {
            // Method to delete a value
            // Upper case first letter of list name
            let graphQlListNameUpperCase = this.graphQlListName.charAt(0).toUpperCase() + this.graphQlListName.slice(1);

            // Build GraphQL delete mutation
            let graphQlMutation = this.$store.state.mutationDeleteValue.replace(/<GraphQlListName>/g, graphQlListNameUpperCase);
            graphQlMutation = graphQlMutation.replace(/<graphQlListName>/g, this.graphQlListName);

            // Build mutation payload
            let payload = {
                'query': this.mutationDeleteValue,
                'variables': { 'id': this.valueId }
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
                        this.$router.push({
                            name: 'view-list-value',
                            params: {
                                listId: this.listId
                            }
                        });
                    }
                }
            );
        }
    },
    computed: {
        show(){
            let roles = ['admin', 'advanced', 'standard']
            return roles.includes(this.$store.state.currentUser.role)
        }
    }
}
</script>