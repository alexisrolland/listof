<template>
    <div class="modal fade" id="ModalBoxUpload" tabindex="-1" role="dialog" aria-labelledby="Upload" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content bg-dark text-light">
                <div class="modal-header">
                    <h5 class="modal-title">Upload CSV</h5>
                    <button type="button" class="close" v-on:click="resetModalBox" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>

                <div class="modal-body bg-secondary text-light">
                    <input type="file" id="selectedFiles" multiple="">
                    <div class="mt-3" v-show="uploadedFiles.length > 0">Number of files processed: {{ uploadedFiles.length }}
                        <ul>
                            <li v-for="uploadedFile in uploadedFiles" v-bind:key="uploadedFile">{{ uploadedFile }}</li>
                        </ul>
                    </div>
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-success" v-on:click="uploadFiles">Upload</button>
                    <button type="button" class="btn btn-secondary" v-on:click="resetModalBox" data-dismiss="modal">Close</button>
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
            'uploadedFiles': []
        }
    },
    methods: {
        uploadFiles() {
            let papa = require('papaparse');
            $('input[type=file]').parse({
                config: {
                    header: true,
                    transformHeader: this.getGraphQlName,
                    complete: this.getData
                },
                before: function(file, inputElement) {
                    // executed before parsing each file begins
                    // what you return here controls the flow
                },
                error: function(error, file, inputElement, reason) {
                    // executed if an error occurs while loading the file,
                    // or if before callback aborted for some reason
                },
                complete: function() {
                    // executed after all files are complete
                }
            });
        },
        getData(results, file){
            // Get valid attributes GraphQL names from list
            let graphQlAttributeNames = this.list.sysAttributesByListId.nodes.map(function (obj) {
                return obj.graphQlAttributeName;
            });
            graphQlAttributeNames = graphQlAttributeNames + [ 'id', 'createdDate', 'updatedDate', 'createdById', 'updatedById' ];

            // Drop invalid attributes
            results.data.map(
                function(row) {
                    for (let key in row) {
                        if (!graphQlAttributeNames.includes(key)) { delete row[key]; }
                    }
                    return row;
                }
            );
            console.log(results.data);

            // Build GraphQL update mutation
            let graphQlListName = this.getGraphQlName(this.list.tableName, 'singular')
            let graphQlListNameUpperCase = this.getGraphQlName(this.list.tableName, 'singular', true)
            let graphQlUpdateMutation = this.$store.state.mutationUpdateValue.replace(/<GraphQlListName>/g, graphQlListNameUpperCase);
            graphQlUpdateMutation = graphQlUpdateMutation.replace(/<graphQlListName>/g, graphQlListName);

            // Build GraphQL create mutation
            let graphQlCreateMutation = this.$store.state.mutationCreateValue.replace(/<GraphQlListName>/g, graphQlListNameUpperCase);
            graphQlCreateMutation = graphQlCreateMutation.replace(/<graphQlListName>/g, graphQlListName);
            
            // Prepare http requests
            let headers = {};
            if (this.$session.exists()) {
                headers = { 'Authorization': 'Bearer ' + this.$session.get('jwt') };
            };

            // Execute http request for each record in the file
            for (let i = 0; i < results.data.length; i++) {
                // Verify if it's a new or existing value
                let existingValue = false;
                for (let key in results.data[i]) {
                    if (key == 'id' && results.data[i][key] != '' && results.data[i][key] != null) { existingValue = true; }
                }
                
                // Build mutation payload
                let payload = {};
                let variables = {};
                if (existingValue) {
                    variables[graphQlListName] = results.data[i];
                    payload = {
                        'query': graphQlCreateMutation,
                        'variables': variables
                    }
                    console.log(payload);
                }

                // Execute request
                this.$http.post(this.$store.state.graphqlUrl, payload, {headers}).then (
                    function(response){
                        if(response.data.errors){
                            this.displayError(response);
                        } else {
                            
                        }
                    },
                    // Error callback
                    function(response){
                        this.displayError(response);
                    }
                );
            }

            // Update list of uploaded files
            this.uploadedFiles.push(file.name);
        },
        resetModalBox() {
            this.uploadedFiles = [];
            document.getElementById('selectedFiles').value = "";
        }
    },
}
</script>

<style>
.modal-header { border: 0px; }
.modal-footer { border: 0px; }
</style>