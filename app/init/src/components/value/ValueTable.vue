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
            'values': []
        }
    },
    computed: {
        attributes() {
            // Extract attributes and compute GraphQL column names
            if (this.list.sysAttributesByListId) {
                var inflection = require('inflection');
                var attributes = this.list.sysAttributesByListId.nodes;
                var i;
                for (i = 0; i < attributes.length; i++) {
                    attributes[i]['graphQlAttributeName'] = inflection.camelize(attributes[i].columnName, true);
                }
                return attributes;
            }
        },
        graphQlListName() {
            // Compute GraphQL table name
            if (this.list.tableName) {
                var inflection = require('inflection');
                var graphQlListName = inflection.pluralize(this.list.tableName);
                graphQlListName = inflection.camelize(graphQlListName);
                return graphQlListName;
            }
        },
        queryGetAllValues() {
            // Compute GraphQL query
            if (this.graphQlListName && this.attributes) {
                var attributeName = '';
                var i;
                for (i = 0; i < this.attributes.length; i++) {
                    attributeName = this.attributes[i].graphQlAttributeName + ' ' + attributeName;
                }

                var graphQlQuery = this.$store.state.queryGetAllValues.replace(/<GraphQlListName>/g, this.graphQlListName);
                graphQlQuery = graphQlQuery.replace(/<graphQlAttributeName>/g, attributeName);
                return graphQlQuery;
            }
        }
    },
    watch: {
        // Execute query to get all values
        queryGetAllValues: function() {
            if (this.queryGetAllValues) {
                var payload = { 'query': this.queryGetAllValues };
                this.$http.post(this.$store.state.graphqlUrl, payload).then (
                    function(response){
                        if(response.data.errors){
                            this.$store.state.errorObject.flag = true;
                            this.$store.state.errorObject.message = response.data.errors[0].message;
                        } else {
                            this.values = response.data.data['all' + this.graphQlListName].nodes;
                        }
                    }
                );
            }
        }
    }
}
</script>