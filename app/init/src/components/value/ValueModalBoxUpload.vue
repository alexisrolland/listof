<template>
    <div class="modal fade" id="ModalBoxUpload" tabindex="-1" role="dialog" aria-labelledby="Upload" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div class="modal-content bg-dark text-light">
                <div class="modal-header">
                    <h5 class="modal-title">Upload CSV</h5>
                    <button type="button" class="close" v-on:click="resetModalBox" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>

                <div class="modal-body bg-secondary text-light">
                    <ul>
                        <li>Maximum file size allowed is <b>3 Mb</b>. Split your files in smaller ones if they are too big.</li>
                        <li>Use template below to ensure headers are correct. Columns not in the template will be ignored.</li>
                        <li>If the column <b>id</b> contains a valid id, the corresponding entry will be updated, else a new entry will be created.</li>
                    </ul>

                    <!-- Input of type file -->
                    <div class="input-group">
                        <div class="custom-file">
                            <input type="file" id="selectedFiles" class="custom-file-input" accept=".csv" ref="selectedFiles" v-on:change="previewFiles" multiple>
                            <label class="custom-file-label" for="selectedFiles">Choose files...</label>
                        </div>
                    </div>
                </div>

                <!-- Files -->
                <table class="table table-striped table-dark table-hover table-borderless">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>File</th>
                            <th>Size</th>
                            <th>Nb Rows Success</th>
                            <th>Nb Rows Error</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="file in files" v-bind:key="file.id">
                            <td>{{ file.id + 1 }}</td>
                            <td>{{ file.name }}</td>
                            <td>{{ file.size }}</td>
                            <td>{{ file.nbRows }}</td>
                            <td>{{ file.nbRowsError }}</td>
                            <td>
                                <span class="badge" v-bind:class="[ file.statusClass ]">
                                    {{ file.status }}
                                    <span v-show="(file.status == 'Uploading')" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <!-- Footer -->
                <div class="modal-footer">
                    <value-button-download-template
                        v-if="list.id"
                        v-bind:listName="this.list.name"
                        v-bind:columnNames="columnNames"
                    ></value-button-download-template>
                    <button type="button" class="btn btn-success" v-on:click="parseFiles">Upload</button>
                    <button type="button" class="btn btn-secondary" v-on:click="resetModalBox" data-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Mixins from '../utils/Mixins.vue';
import ValueButtonDownloadTemplate from './ValueButtonDownloadTemplate';

export default {
    mixins: [Mixins],
    components: {
        'value-button-download-template': ValueButtonDownloadTemplate
    },
    props: {
        list: Object
    },
    data: function () {
        return {
            'files': []
        }
    },
    computed:{
        graphQlAttributeNames() {
            // Prepare GraphQL attributes names to filter out invalid columns from CSV
            let graphQlAttributeNames = [{ 'graphQlAttributeName': 'id', 'dataTypeId': 5 }];
            this.list.sysAttributesByListId.nodes.map(function (obj) {
                graphQlAttributeNames.push({ 'graphQlAttributeName': obj.graphQlAttributeName, 'dataTypeId': obj.dataTypeId });
            });
            return graphQlAttributeNames;
        },
        columnNames() {
            // Prepare column names to download CSV template
            let columnNames = { 'id': '' };
            this.list.sysAttributesByListId.nodes.map(function (obj) {
                columnNames[obj.columnName] = '';
            });
            return [ columnNames ];
        }
    },
    methods: {
        previewFiles() {
            this.files = [];
            let files = this.$refs.selectedFiles.files;
            for (let i = 0; i < files.length; i++) {
                let file = {
                    'id': i,
                    'name': files[i]['name'],
                    'size': this.formatSize(files[i]['size']),
                    'status': 'Ready',
                    'statusClass': 'badge-secondary'
                }
                this.files.push(file);
            }
        },
        formatSize(size) {
            if (size > 1024 * 1024 * 1024 * 1024) {
                return (size / 1024 / 1024 / 1024 / 1024).toFixed(2) + ' Tb'
            } else if (size > 1024 * 1024 * 1024) {
                return (size / 1024 / 1024 / 1024).toFixed(2) + ' Gb'
            } else if (size > 1024 * 1024) {
                return (size / 1024 / 1024).toFixed(2) + ' Mb'
            } else if (size > 1024) {
                return (size / 1024).toFixed(2) + ' Kb'
            }
            return size.toString() + ' bytes'
        },
        parseFiles() {
            let papa = require('papaparse');
            $('input[type=file]').parse({
                config: {
                    header: true,
                    transformHeader: this.getGraphQlName,
                    complete: this.uploadFiles
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
        uploadFiles(results, file) {
            //Find file index in files list
            let lodash = require('lodash');
            let fileIndex = lodash.findIndex(this.files, function(obj) { return obj.name == file.name; });
            this.files[fileIndex]['status'] = 'Uploading';
            this.files[fileIndex]['statusClass'] = 'badge-info';
            this.files[fileIndex]['nbRows'] = '';
            
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
            let payloadBatch = results.data.map(function(row) {
                // Loop over each column of the record
                for (let key in row) {
                    // Drop invalid column if it's not in graphQlAttributeNames
                    let i = lodash.findIndex(this.graphQlAttributeNames, function(obj) { return obj.graphQlAttributeName == key; });
                    if (i == -1) { delete row[key]; }

                    // Format column value according to attribute data type
                    else {
                        let dataTypeId = this.graphQlAttributeNames[i]['dataTypeId'];
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

                // Drop id column if it is empty
                if (isNaN(row['id'])) { delete row['id']; }

                // Build update or create mutation payload
                let payload = {};
                let variables = {};
                if (row.hasOwnProperty('id')) {
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

                return payload;
            }.bind(this));

            // Execute http request
            this.$http.post(this.$store.state.graphqlUrl, payloadBatch, {headers}).then (
                function(response){
                    // Get queries which returned an error
                    let errors = response.data.filter(function(obj) {return obj.hasOwnProperty('errors'); });
                    if (errors.length > 0) {
                        this.files[fileIndex]['status'] = 'Error';
                        this.files[fileIndex]['statusClass'] = 'badge-danger';
                        this.files[fileIndex]['nbRows'] = response.data.length - errors.length;
                        this.files[fileIndex]['nbRowsError'] = errors.length;
                        this.displayError(response, errors);
                        this.$root.$emit('fileUploaded', {}); // Send event to root to be accessed by sibling component ValueSearch to refresh table
                    } else {
                        // Update file status
                        this.files[fileIndex]['status'] = 'Complete';
                        this.files[fileIndex]['statusClass'] = 'badge-success';
                        this.files[fileIndex]['nbRows'] = response.data.length;
                        this.files[fileIndex]['nbRowsError'] = 0;
                        this.$root.$emit('fileUploaded', {}); // Send event to root to be accessed by sibling component ValueSearch to refresh table
                    }
                },
                // Error callback
                function(response){
                    this.displayError(response);
                }
            );
        },
        resetModalBox() {
            this.files = [];
            document.getElementById('selectedFiles').value = "";
        }
    }
}
</script>

<style>
.modal-header { border: 0px; }
.modal-footer { border: 0px; }
</style>
