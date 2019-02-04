<template>
    <div>
        <button type="button" class="btn btn-success" v-on:click="saveAttribute()">
            Save
        </button>

        <router-link v-bind:to="'/lists/' + listId">
            <button type="button" class="btn btn-outline-secondary">
                Close
            </button>
        </router-link>

        <router-link v-if="attribute.id" v-bind:to="'/lists/' + listId">
            <button type="button" class="btn btn-danger float-right" v-on:click="deleteAttribute()">
                Delete
            </button>
        </router-link>
    </div>
</template>

<script>
export default {
    props: {
        attribute: Object
    },
    computed: {
        listId() {
            return parseInt(this.$route.params.listId);
        }
    },
    methods: {
        saveAttribute() {
            // Method to create or update an attribute
            if (this.attribute.id) {
                // Update an existing attribute
                // Compute data type Id default value
                var dataTypeId;
                if (this.attribute.linkedListId) { dataTypeId = 6 } else { dataTypeId = this.attribute.dataTypeId }
                console.log(dataTypeId);
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
                            'dataTypeId': dataTypeId,
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
                // Create a new attribute
                // Compute data type Id default value
                var dataTypeId;
                if (this.attribute.linkedListId) { dataTypeId = 6 } else { dataTypeId = this.attribute.dataTypeId }

                var payload = {
                    'query': this.$store.state.mutationCreateAttribute,
                    'variables': {
                        'sysAttribute': {
                            'name': this.attribute.name,
                            'description': this.attribute.description,
                            'flagUnique': this.attribute.flagUnique,
                            'flagMandatory': this.attribute.flagMandatory,
                            'linkedListId': this.attribute.linkedListId,
                            'dataTypeId': dataTypeId,
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
                            // Capture new attribute Id in case user wants to delete or update it
                            this.attribute.id = response.data.data.createSysAttribute.sysAttribute.id;
                            this.$router.push({ name: 'edit-list-attribute', params: { attributeId: this.attribute.id } });
                        }
                    }
                );
            }
        },
        deleteAttribute() {
            // Method to delete an attribute
            if (this.attribute.id) {
                var payload = {
                    'query': this.$store.state.mutationDeleteAttribute,
                    'variables': { 
                        'id': this.attribute.id
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