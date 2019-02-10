<template>
    <button type="button" class="btn btn-success" v-on:click="saveValue">
        Save
    </button>
</template>

<script>
export default {
    props: {
        graphQlListName: String, // Example tableName
        value: Object
    },
    methods: {
        saveValue() {
            // Method to create or update a value
            // Upper case first letter of list name
            let graphQlListNameUpperCase = this.graphQlListName.charAt(0).toUpperCase() + this.graphQlListName.slice(1);

            // If value.id exists, update existing value
            if (this.value.id) {
                // Build GraphQL update mutation
                let graphQlMutation = this.$store.state.mutationUpdateValue.replace(/<GraphQlListName>/g, graphQlListNameUpperCase);
                graphQlMutation = graphQlMutation.replace(/<graphQlListName>/g, this.graphQlListName);

                // Build mutation payload
                let variables = { 'id': this.value.id };
                variables[this.graphQlListName + 'Patch'] = this.value;
                let payload = {
                    'query': graphQlMutation,
                    'variables': variables
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
            else {
                // Build GraphQL create mutation
                let graphQlMutation = this.$store.state.mutationCreateValue.replace(/<GraphQlListName>/g, graphQlListNameUpperCase);
                graphQlMutation = graphQlMutation.replace(/<graphQlListName>/g, this.graphQlListName);

                // Build mutation payload
                let variables = {};
                variables[this.graphQlListName] = this.value;
                var payload = {
                    'query': graphQlMutation,
                    'variables': variables
                };
                this.$http.post(this.$store.state.graphqlUrl, payload).then (
                    function(response){
                        if(response.data.errors){
                            this.$store.state.errorObject.flag = true;
                            this.$store.state.errorObject.message = response.data.errors[0].message;
                        } else {
                            // Capture new value Id in case user wants to delete or update it
                            this.value.id = response.data.data['create' + graphQlListNameUpperCase][this.graphQlListName].id;
                            this.$router.push({
                                name: 'edit-list-value',
                                params: {
                                    valueId: this.value.id
                                }
                            });
                        }
                    }
                );
            }
        },
    }
}
</script>