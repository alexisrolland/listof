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
                            <li v-for="uploadedFile in uploadedFiles" v-bind:key="uploadedFile">
                                {{ uploadedFile.fileName }} - {{ uploadedFile.fileSize }} - Number of records uploaded
                            </li>
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
                    complete: this.startUpload
                },
                before: function(file, inputElement, ) {
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
        startUpload(results, file) {
            // Update list of uploaded files
            let uploadedFile = {
                'fileName': file.name,
                'fileSize': this.formatSize(file.size),
                'fileStatus': 'Uploading'
            }
            console.log(uploadedFile);
            //this.uploadedFiles.push(uploadedFile);

            // Prepare GraphQL attributes names for the list
            let graphQlAttributeNames = [{ 'graphQlAttributeName': 'id', 'dataTypeId': 5 }];
            this.list.sysAttributesByListId.nodes.map(function (obj) {
                graphQlAttributeNames.push({ 'graphQlAttributeName': obj.graphQlAttributeName, 'dataTypeId': obj.dataTypeId });
            });
            
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

            // Loop over each record of the data set
            let lodash = require('lodash');
            results.data.forEach(function(row) {
                // Loop over each column of the record
                for (let key in row) {
                    // Drop invalid column if it's not in graphQlAttributeNames
                    let i = lodash.findIndex(graphQlAttributeNames, function(obj) { return obj.graphQlAttributeName == key; });
                    if (i == -1) { delete row[key]; }

                    // Format column value according to attribute data type
                    else {
                        let dataTypeId = graphQlAttributeNames[i]['dataTypeId'];
                        // Format to boolean
                        if ([2].includes(dataTypeId)) {
                            row[key] = (row[key] == 'true');
                        }
                        // Format to bigint, integer, smallint 
                        else if ([1, 5, 7].includes(dataTypeId)) {
                            row[key] = parseInt(row[key]);
                        }
                        // Format to real
                        else if ([6].includes(dataTypeId)) {
                            row[key] = parseFloat(row[key]);
                        }
                    }
                }

                // Verify if it is a new or existing record
                let recordExists = false;
                if (row['id'] != '' && row['id'] != null) { recordExists = true; }

                // Build mutation payload
                let payload = {};
                let variables = {};
                if (recordExists) {
                    variables = { 'id': row['id'] };
                    let patch = Object.assign({}, row); // Clone object
                    variables[graphQlListName + 'Patch'] = patch;
                    payload = {
                        'query': graphQlUpdateMutation,
                        'variables': variables
                    };
                }
                else {
                    variables = {};
                    variables[graphQlListName] = row;
                    payload = {
                        'query': graphQlCreateMutation,
                        'variables': variables
                    };
                }

                // Execute http request
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
                
            }.bind(this));
        },
        resetModalBox() {
            this.uploadedFiles = [];
            document.getElementById('selectedFiles').value = "";
        },
        formatSize(size) {
            if (size > 1024 * 1024 * 1024 * 1024) {
                return (size / 1024 / 1024 / 1024 / 1024).toFixed(2) + 'Tb'
            } else if (size > 1024 * 1024 * 1024) {
                return (size / 1024 / 1024 / 1024).toFixed(2) + 'Gb'
            } else if (size > 1024 * 1024) {
                return (size / 1024 / 1024).toFixed(2) + 'Mb'
            } else if (size > 1024) {
                return (size / 1024).toFixed(2) + 'Kb'
            }
            return size.toString() + ' bytes'
        }
    },
}
</script>

<style>
.modal-header { border: 0px; }
.modal-footer { border: 0px; }
</style>