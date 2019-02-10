<template>
    <div>
        <h1 class="mt-5">Values</h1>

        <table class="table table-striped table-dark table-hover table-borderless">
            <thead>
                <tr>
                    <th v-for="attribute in attributes" v-bind:key="attribute.id" scope="col">
                        {{ attribute.name }}
                    </th>
                    <th scope="col">
                        Actions
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="value in values" v-bind:key="value.id">
                    <td v-for="attribute in attributes" v-bind:key="attribute.id">
                        {{ value[attribute.graphQlAttributeName] }}
                    </td>
                    <td>
                        <router-link class="badge badge-secondary" v-bind:to="'values/' + value.id">
                            Edit Value
                        </router-link>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
    props: {
        list: Object,
    },
    data: function () {
        return {
            attributes: [],
            values: []
        }
    },
    created: function () {
        // Compute GraphQL names for the list and attributes
        let inflection = require('inflection');

        // GraphQL list name
        let graphQlListName = inflection.pluralize(this.list.tableName); // Example table_name > table_names
        graphQlListName = inflection.camelize(graphQlListName); // Example table_names > TableNames

        // GraphQL attributes name
        let attributes = this.list.sysAttributesByListId.nodes;
        let attributeName = '';
        for (let i = 0; i < attributes.length; i++) {
            attributes[i]['graphQlAttributeName'] = inflection.camelize(attributes[i].columnName, true); // Example colum_name > columnName
            attributeName = attributes[i]['graphQlAttributeName'] + ' ' + attributeName;
        }
        this.attributes = attributes;

        // Build GraphQL query
        let graphQlQuery = this.$store.state.queryGetAllValues.replace(/<GraphQlListName>/g, graphQlListName);
        graphQlQuery = graphQlQuery.replace(/<graphQlAttributeName>/g, attributeName);

        // Execute GraphQL query to get values
        let payload = { 'query': graphQlQuery };
        this.$http.post(this.$store.state.graphqlUrl, payload).then (
            function(response){
                if(response.data.errors){
                    this.$store.state.errorObject.flag = true;
                    this.$store.state.errorObject.message = response.data.errors[0].message;
                } else {
                    this.values = response.data.data['all' + graphQlListName].nodes;
                }
            }
        );
    }
}
</script>