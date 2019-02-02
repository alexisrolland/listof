<template>
    <div>
        <button type="button" class="btn btn-success" v-on:click="saveValue()">
            Save
        </button>

        <router-link v-bind:to="'/lists/' + listId + '/values'">
            <button type="button" class="btn btn-outline-secondary">
                Close
            </button>
        </router-link>

        <router-link v-if="value.id" v-bind:to="'/lists/' + listId + '/values'">
            <button type="button" class="btn btn-danger float-right" v-on:click="deleteValue()">
                Delete
            </button>
        </router-link>
    </div>
</template>

<script>
export default {
    props: {
        graphQlListName: String,
        value: Object
    },
    computed: {
        listId() {
            return parseInt(this.$route.params.listId);
        },
        valueId() {
            return parseInt(this.$route.params.valueId);
        },
        mutationCreateValue() {
            // Compute GraphQL mutation to delete value
            if (this.graphQlListName) {
                var GraphQlListName = this.graphQlListName.charAt(0).toUpperCase() + this.graphQlListName.slice(1);  // Upper case first letter of list name
                var graphQlMutation = this.$store.state.mutationCreateValue.replace(/<GraphQlListName>/g, GraphQlListName);
                graphQlMutation = graphQlMutation.replace(/<graphQlListName>/g, this.graphQlListName);
                return graphQlMutation;
            }
        },
        mutationUpdateValue() {
            // Compute GraphQL mutation to delete value
            if (this.graphQlListName) {
                var GraphQlListName = this.graphQlListName.charAt(0).toUpperCase() + this.graphQlListName.slice(1);  // Upper case first letter of list name
                var graphQlMutation = this.$store.state.mutationUpdateValue.replace(/<GraphQlListName>/g, GraphQlListName);
                graphQlMutation = graphQlMutation.replace(/<graphQlListName>/g, this.graphQlListName);
                return graphQlMutation;
            }
        },
        mutationDeleteValue() {
            // Compute GraphQL mutation to delete value
            if (this.graphQlListName) {
                var GraphQlListName = this.graphQlListName.charAt(0).toUpperCase() + this.graphQlListName.slice(1);  // Upper case first letter of list name
                var graphQlMutation = this.$store.state.mutationDeleteValue.replace(/<GraphQlListName>/g, GraphQlListName);
                graphQlMutation = graphQlMutation.replace(/<graphQlListName>/g, this.graphQlListName);
                return graphQlMutation;
            }
        }
    },
    methods: {
        saveValue() {
            // Method to create or update a value
            if (this.value.id) {
                // Update an existing value
                var variables = {};
                variables['id'] = this.value.id;
                variables[this.graphQlListName + 'Patch'] = this.value;
                var payload = {
                    'query': this.mutationUpdateValue,
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
                // Create a new value
                var variables = {};
                variables[this.graphQlListName] = this.value;
                var payload = {
                    'query': this.mutationCreateValue,
                    'variables': variables
                };
                this.$http.post(this.$store.state.graphqlUrl, payload).then (
                    function(response){
                        if(response.data.errors){
                            this.$store.state.errorObject.flag = true;
                            this.$store.state.errorObject.message = response.data.errors[0].message;
                        } else {
                            // Capture new value Id in case user wants to delete or update it
                            var GraphQlListName = this.graphQlListName.charAt(0).toUpperCase() + this.graphQlListName.slice(1);  // Upper case first letter of list name
                            this.value.id = response.data.data['create' + GraphQlListName][this.graphQlListName].id;
                            this.$router.push({ name: 'value', params: { valueId: this.value.id } });
                        }
                    }
                );
            }
        },
        deleteValue() {
            // Method to delete a value
            if (this.value.id) {
                var payload = {
                    'query': this.mutationDeleteValue,
                    'variables': { 
                        'id': this.value.id
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
        }
    }
}
</script>