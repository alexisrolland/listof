<template>
    <div class="modal fade" id="ListModalBoxDuplicate" tabindex="-1" role="dialog" aria-labelledby="Duplicate" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content bg-dark text-light">
                <div class="modal-header">
                    <h5 class="modal-title">Duplicate List</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body bg-secondary text-light">
                    <form>
                        <div class="form-row">
                            <div class="col-md-12">
                                <!-- New List Name -->
                                <div class="form-group required">
                                    <label for="listName" class="col-form-label">
                                        New List Name:
                                    </label>
                                    <input class="form-control"
                                        id="listName"
                                        type="text"
                                        required="required"
                                        placeholder="Type new list name"
                                        v-model="listName" />
                                </div>

                                <!-- Duplicate Data -->
                                <div class="custom-control custom-switch mr-4 mt-1 mb-2">
                                    <input class="custom-control-input"
                                        id="duplicateData"
                                        type="checkbox"
                                        value=""
                                        v-model="duplicateData"/>
                                    <label for="duplicateData" class="custom-control-label">
                                        Duplicate Data
                                    </label>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-success" v-on:click="duplicateList" data-dismiss="modal">Duplicate</button>
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Mixins from '../utils/Mixins.vue';

export default {
    mixins: [Mixins],
    props: {
        list: Object
    },
    data: function () {
        return {
            'listId': '',
            'listName': '',
            'duplicateData': false
        }
    },
    methods: {
        duplicateList() {
            // Duplicate list
            let payload = {
                'query': this.$store.state.mutationCreateList,
                'variables': {
                    'sysList': {
                        'name': this.listName,
                        'description': this.list.description,
                        "userGroupId": this.list.userGroupId
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
                        // Capture new list Id
                        this.listId = response.data.data.createSysList.sysList.id;

                        // Duplicate attributes
                        if (this.list.sysAttributesByListId.nodes.lentgh > 0) {
                            this.duplicateAttributes(headers, this.list.sysAttributesByListId.nodes);
                        }
                        else {
                            // Reroute to duplicated list
                            this.$router.push({
                                name: 'edit-list',
                                params: {
                                    listId: this.listId
                                }
                            });
                        }
                    }
                },
                // Error callback
                function(response){
                    this.displayError(response);
                }
            );
        },
        duplicateAttributes(headers, attributes) {
            for (let i = 0; i < attributes.length; i++) {
                let payload = {
                    'query': this.$store.state.mutationCreateAttribute,
                    'variables': {
                        'sysAttribute': {
                            'name': attributes[i].name,
                            'description': attributes[i].description,
                            'order': attributes[i].order,
                            'flagUnique': attributes[i].flagUnique,
                            'flagMandatory': attributes[i].flagMandatory,
                            'linkedAttributeId': attributes[i].linkedAttributeId,
                            'dataTypeId': attributes[i].dataTypeId,
                            'defaultValue': attributes[i].defaultValue,
                            'listId': this.listId
                        }
                    }
                };
                this.$http.post(this.$store.state.graphqlUrl, payload, {headers}).then (
                    function(response){
                        if(response.data.errors){
                            this.displayError(response);
                        } else {
                            if (i == attributes.length-1) {
                                // Once last attribute is created, populate new list with data
                                if (this.duplicateData == true) {
                                    this.duplicateValues(headers);
                                } else {
                                    // Reroute to duplicated list
                                    this.$router.push({
                                        name: 'edit-list',
                                        params: {
                                            listId: this.listId
                                        }
                                    });
                                }
                            }
                        }
                    },
                    // Error callback
                    function(response){
                        this.displayError(response);
                    }
                );
            }
        },
        duplicateValues(headers) {
            let payload = {
                'query': this.$store.state.mutationDuplicateListValue,
                'variables': {
                    'sourceListId': this.list.id,
                    'targetListId': this.listId
                }
            };
            this.$http.post(this.$store.state.graphqlUrl, payload, {headers}).then (
                function(response){
                    if(response.data.errors){
                        this.displayError(response);
                    } else {
                        // Reroute to duplicated list
                        this.$router.push({
                            name: 'edit-list',
                            params: {
                                listId: this.listId
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
    }
}
</script>

<style>
.modal-header { border: 0px; }
.modal-footer { border: 0px; }
</style>