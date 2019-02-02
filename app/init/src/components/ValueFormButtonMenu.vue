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
        mutationDeleteValue() {
            // Compute GraphQL mutation to delete value
            if (this.graphQlListName) {
                var GraphQlListName = this.graphQlListName.charAt(0).toUpperCase() + this.graphQlListName.slice(1);  // Upper case first letter of list name
                var graphQlMutation = this.$store.state.mutationDeleteValue.replace('<GraphQlListName>', GraphQlListName);
                graphQlMutation = graphQlMutation.replace('<graphQlListName>', this.graphQlListName);
                return graphQlMutation;
            }
        }
    },
    methods: {
        saveValue() {
            // Method to create or update a value
            if (this.value.id) {
                // Update an existing value
                var payload = {
                    'query': this.$store.state.mutationUpdateAttribute,
                    'variables': { 
                        'id': this.attribute.id,
                        'sysAttributePatch': {
                            'name': this.attribute.name,
                            'description': this.attribute.description,
                            'flagUnique': this.attribute.flagUnique,
                            'flagMandatory': this.attribute.flagMandatory,
                            'linkedListId': this.attribute.linkedListId,
                            'dataTypeId': this.attribute.dataTypeId,
                            'defaultValue': this.attribute.defaultValue,
                            'listId': this.listId
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
            else {
                // Create a new value
                var payload = {
                    'query': this.$store.state.mutationCreateAttribute,
                    'variables': {
                        'sysAttribute': {
                            'name': this.attribute.name,
                            'description': this.attribute.description,
                            'flagUnique': this.attribute.flagUnique,
                            'flagMandatory': this.attribute.flagMandatory,
                            'linkedListId': this.attribute.linkedListId,
                            'dataTypeId': this.attribute.dataTypeId,
                            'defaultValue': this.attribute.defaultValue,
                            'listId': this.listId
                        }
                    }
                };
                this.$http.post(this.$store.state.graphqlUrl, payload).then (
                    function(response){
                        if(response.data.errors){
                            this.$store.state.errorObject.flag = true;
                            this.$store.state.errorObject.message = response.data.errors[0].message;
                        } else {
                            // Capture new value Id in case user wants to delete or update it
                            this.attribute.id = response.data.data.createSysAttribute.sysAttribute.id;
                            this.$router.push({ name: 'attributes', params: { attributeId: this.attribute.id } });
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