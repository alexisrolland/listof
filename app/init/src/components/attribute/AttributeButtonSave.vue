<template>
    <button type="button" class="btn btn-success" v-on:click="saveAttribute">
        Save
    </button>
</template>

<script>
export default {
    props: {
        listId: Number,
        attribute: Object
    },
    methods: {
        saveAttribute() {
            // Method to create or update an attribute
            // Default dataTypeId to integer if attribute is a linked list
            if (this.attribute.linkedAttributeId) { this.attribute.dataTypeId = 6 }

            // If attribute.id exists, update existing attribute
            if (this.attribute.id) {
                let payload = {
                    'query': this.$store.state.mutationUpdateAttribute,
                    'variables': { 
                        'id': this.attribute.id,
                        'sysAttributePatch': {
                            'name': this.attribute.name,
                            'description': this.attribute.description,
                            'flagUnique': this.attribute.flagUnique,
                            'flagMandatory': this.attribute.flagMandatory,
                            'linkedAttributeId': this.attribute.linkedAttributeId,
                            'dataTypeId': this.attribute.dataTypeId,
                            'defaultValue': this.attribute.defaultValue,
                            'listId': this.listId
                        }
                    }
                };
                let headers = { 'Authorization': 'Bearer ' + this.$session.get('jwt') };
                this.$http.post(this.$store.state.graphqlUrl, payload, {headers}).then (
                    function(response){
                        if(response.data.errors){
                            this.$store.state.errorObject.flag = true;
                            this.$store.state.errorObject.message = response.data.errors[0].message;
                        }
                    }
                );
            }
            // If attribute.id does not exist, create a new attribute
            else {
                let payload = {
                    'query': this.$store.state.mutationCreateAttribute,
                    'variables': {
                        'sysAttribute': {
                            'name': this.attribute.name,
                            'description': this.attribute.description,
                            'flagUnique': this.attribute.flagUnique,
                            'flagMandatory': this.attribute.flagMandatory,
                            'linkedAttributeId': this.attribute.linkedAttributeId,
                            'dataTypeId': this.attribute.dataTypeId,
                            'defaultValue': this.attribute.defaultValue,
                            'listId': this.listId
                        }
                    }
                };
                let headers = { 'Authorization': 'Bearer ' + this.$session.get('jwt') };
                this.$http.post(this.$store.state.graphqlUrl, payload, {headers}).then (
                    function(response){
                        if(response.data.errors){
                            this.$store.state.errorObject.flag = true;
                            this.$store.state.errorObject.message = response.data.errors[0].message;
                        } else {
                            // Capture new attribute Id in case user wants to delete or update it
                            this.attribute.id = response.data.data.createSysAttribute.sysAttribute.id;
                            this.$router.push({
                                name: 'edit-list-attribute',
                                params: {
                                    listId: this.listId,
                                    attributeId: this.attribute.id
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