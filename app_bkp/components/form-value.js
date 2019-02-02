Vue.component('form-value', {
    template: `
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">

                <!-- Header -->
                <div class="modal-header bg-light text-dark">
                    <h5 class="modal-title" id="valueModalTitle">
                        Edit Value
                    </h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">
                            &times;
                        </span>
                    </button>
                </div>

                <!-- Value Form -->
                <div class="modal-body bg-dark text-light">
                    <form>
                        <div v-for="attribute in attributes.attributes" class="form-group">
                            <label for="attributeName" class="col-form-label">
                                {{ attribute.name }}:
                            </label>
                            <input
                                id="attributeName"
                                type="text"
                                required="true"
                                class="form-control col-sm"
                                 />
                        </div>
                    </form>
                </div>

                <!-- Button Menu -->
                <div class="modal-footer bg-light">
                    <button type="button" class="btn btn-success" v-on:click="saveValue(value.id)">
                        Save
                    </button>

                    <button type="button" class="btn btn-danger" v-on:click="deleteValue(value.id)">
                        Delete
                    </button>

                    <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">
                        Close
                    </button>
                </div>
            </div>
        </div>
    `,
    props: {
        'listId': Number,
        'attributes': Object
    },
    data: function () {
        return {
            'mutationCreateValue': `mutation createAttribute($sysAttribute: SysAttributeInput!) {
                createSysAttribute(input: {sysAttribute: $sysAttribute}) {
                    sysAttribute {
                        id
                        name
                        description
                        flagMandatory
                        flagUnique
                        linkedListId
                        sysDataTypeByDataTypeId {
                            id
                            name
                        }
                        defaultValue
                    }
                }
            }`,
            'mutationUpdateAttribute': `mutation updateAttribute($id: Int!, $sysAttributePatch: SysAttributePatch!) {
                updateSysAttributeById(input: {id: $id, sysAttributePatch: $sysAttributePatch }) {
                    sysAttribute {
                        id
                        name
                        description
                        flagMandatory
                        flagUnique
                        linkedListId
                        sysDataTypeByDataTypeId {
                            id
                            name
                        }
                        defaultValue
                    }
                }
            }`,
            'mutationDeleteAttribute': `mutation deleteAttribute($id: Int!) {
                deleteSysAttributeById(input: {id: $id}){
                    sysAttribute {
                        id
                    }
                }
            }`
        }
    },
    mounted: function () {
        // Build GraphQL mutations
        this.buildMutation();
    },
    methods: {
        buildMutation() {
            
        },
        saveValue(valueId) {
            // Method to add or update a value
            // Verify if valueId is provided
            if (isNaN(valueId)) {
                // Add a new value
                payload = {
                    'query': this.mutationCreateValue,
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
                this.$http.post(Vue.prototype.$graphqlUrl, payload).then (
                    function(response){
                        if(response.status == "200"){
                            if(response.data.errors){
                                $('#alert').append(`
                                    <div class="alert alert-danger alert-dismissable text-danger">
                                        Error: ` + response.data.errors[0].message + `
                                        <button type="button" class="close" data-dismiss="alert" aria-hidden="true">
                                            &times;
                                        </button>
                                    </div>`
                                );
                            } else {
                                this.hideModal('attributeModal');
                                window.location.href = 'edit-list.html?listId=' + this.listId;
                            }
                        }
                    }
                );
            }
            else {
                // Update an existing attribute
                payload = {
                    'query': this.mutationUpdateAttribute,
                    'variables': { 
                        'id': attributeId,
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
                this.$http.post(Vue.prototype.$graphqlUrl, payload).then (
                    function(response){
                        if(response.status == "200"){
                            if(response.data.errors){
                                $('#alert').append(`
                                    <div class="alert alert-danger alert-dismissable text-danger">
                                        Error: ` + response.data.errors[0].message + `
                                        <button type="button" class="close" data-dismiss="alert" aria-hidden="true">
                                            &times;
                                        </button>
                                    </div>`
                                );
                            } else {
                                this.hideModal(this.attribute.id);
                                window.location.href = 'edit-list.html?listId=' + this.listId;
                            }
                        }
                    }
                );
            }
        },
        deleteValue(valueId) {
            // Method to delete an attribute
            payload = {
                'query': this.mutationDeleteAttribute,
                'variables': {
                    'id': attributeId
                }
            };
            this.$http.post(Vue.prototype.$graphqlUrl, payload).then (
                function(response){
                    if(response.status == "200"){
                        if(response.data.errors){
                                $('#alert').append(`
                                    <div class="alert alert-danger alert-dismissable text-danger">
                                        Error: ` + response.data.errors[0].message + `
                                        <button type="button" class="close" data-dismiss="alert" aria-hidden="true">
                                            &times;
                                        </button>
                                    </div>`
                                );
                              
                        } else {
                            this.hideModal(this.attribute.id);
                            window.location.href = 'edit-list.html?listId=' + this.listId;
                        }
                    }
                }
            );
        },
        hideModal(modalId) {
            $('#' + modalId).modal('hide');
        },
    }
});