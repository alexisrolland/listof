<template>
    <button v-if="show" type="button" class="btn btn-success" v-on:click="saveAttribute">
        Save
    </button>
</template>

<script>
import Mixins from '../utils/Mixins.vue';

export default {
    mixins: [Mixins],
    props: {
        listId: Number,
        attribute: Object
    },
    methods: {
        saveAttribute() {
            // Method to create or update an attribute
            // Clean inputs
            if (this.attribute.order) { this.attribute.order = parseInt(this.attribute.order) }
            if (this.attribute.linkedAttributeId) { this.attribute.dataTypeId = 6 }  // Default dataTypeId to integer if attribute is a linked list

            // If attribute.id exists, update existing attribute
            if (this.attribute.id) {
                let payload = {
                    'query': this.$store.state.mutationUpdateAttribute,
                    'variables': { 
                        'id': this.attribute.id,
                        'sysAttributePatch': {
                            'name': this.attribute.name,
                            'description': this.attribute.description,
                            'order': this.attribute.order,
                            'flagUnique': this.attribute.flagUnique,
                            'flagMandatory': this.attribute.flagMandatory,
                            'linkedAttributeId': this.attribute.linkedAttributeId,
                            'dataTypeId': this.attribute.dataTypeId,
                            'defaultValue': this.attribute.defaultValue,
                            'listId': this.listId
                        }
                    }
                };
                let headers = {};
                if (this.$session.exists()) {
                    headers = { 'Authorization': 'Bearer ' + this.$session.get('jwt') };
                };
                this.$http.post(this.$store.state.graphqlUrl, payload, {headers}).then (
                    function(response){
                        if(response.data.errors){
                            this.displayError(response);
                        } else {
                            this.attribute.updatedDate = response.data.data.updateSysAttributeById.sysAttribute.updatedDate;
                            this.attribute.sysUserByUpdatedById.email = response.data.data.updateSysAttributeById.sysAttribute.sysUserByUpdatedById.email;
                        }
                    },
                    // Error callback
                    function(response){
                        this.displayError(response);
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
                            'order': this.attribute.order,
                            'flagUnique': this.attribute.flagUnique,
                            'flagMandatory': this.attribute.flagMandatory,
                            'linkedAttributeId': this.attribute.linkedAttributeId,
                            'dataTypeId': this.attribute.dataTypeId,
                            'defaultValue': this.attribute.defaultValue,
                            'listId': this.listId
                        }
                    }
                };
                let headers = {};
                if (this.$session.exists()) {
                    headers = { 'Authorization': 'Bearer ' + this.$session.get('jwt') };
                };
                this.$http.post(this.$store.state.graphqlUrl, payload, {headers}).then (
                    function(response){
                        if(response.data.errors){
                            this.displayError(response);
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
                    },
                    // Error callback
                    function(response){
                        this.displayError(response);
                    }
                );
            }
        },
    },
    computed: {
        show(){
            let roles = ['admin', 'advanced']
            return roles.includes(this.$store.state.currentUser.role)
        }
    }
}
</script>