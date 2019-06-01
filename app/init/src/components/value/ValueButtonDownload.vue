<template>
        <button type="button" class="btn btn-secondary" v-on:click="downloadCsv">
            Download CSV
        </button>
</template>

<script>
import Mixins from '../utils/Mixins.vue';

export default {
    mixins: [Mixins],
    props: {
        list: Object
    },
    methods: {
        buildGraphQlQuery(){
            // Method to build GraphQL query
            // Compute GraphQL names for the list and attributes
            let graphQlListName = this.getGraphQlName(this.list.tableName, 'plural', true);  // Example table_name > TableNames
            let attributes = this.list.sysAttributesByListId.nodes;
            let graphQLAttributeName = '';
            for (let i = 0; i < attributes.length; i++) {
                attributes[i]['graphQlAttributeName'] = this.getGraphQlName(attributes[i].columnName);  // Example colum_name > columnName
                graphQLAttributeName = graphQLAttributeName + ' ' + attributes[i]['graphQlAttributeName'];
            }

            // Build GraphQL query
            let graphQlQuery = this.$store.state.queryDownloadAllValues.replace(/<GraphQlListName>/g, graphQlListName);
            graphQlQuery = graphQlQuery.replace(/<graphQlAttributeName>/g, graphQLAttributeName);
            return { 'listName': graphQlListName, 'query': graphQlQuery };
        },
        downloadCsv(){
            // Build GraphQL query
            let graphQl = this.buildGraphQlQuery();

            // Execute GraphQL query to get values
            let payload = { 'query': graphQl.query };
            let headers = {};
            if (this.$session.exists()) {
                headers = { 'Authorization': 'Bearer ' + this.$session.get('jwt') };
            };
            this.$http.post(this.$store.state.graphqlUrl, payload, {headers}).then (
                function(response){
                    if(response.data.errors) {
                        this.displayError(response);
                    } else {
                        // Convert data to CSV format
                        let data = response.data.data['all' + graphQl.listName].nodes;
                        let papa = require('papaparse');
                        let text = papa.unparse(data);

                        // Change header to snake_case
                        let rows = text.split(/\r\n|\r|\n/);
                        let headers = rows[0].split(',');
                        let lodash = require('lodash');
                        for (let i = 0; i < headers.length; i++) { headers[i] = lodash.snakeCase(headers[i]) }
                        rows[0] = headers.join(',');
                        text = rows.join('\r\n');

                        // Create CSV file
                        let file = new Blob([text], {type: 'text/csv;charset=utf-8;'});
                        let url;
                        if (navigator.msSaveBlob) { url = navigator.msSaveBlob(file, this.list.name + '.csv'); }
                        else { url = window.URL.createObjectURL(file); }
                        let link = document.createElement('a');
                        link.href = url;
                        link.setAttribute('download', this.list.name + '.csv');
                        link.click();
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