<template>
    <div>
        <h2 class="mt-5">Values</h2>

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
                        <!-- If attribute is linked to a list, fetch parent list value -->
                        <span v-if="attribute.linkedAttributeId">
                            <router-link v-if="value[attribute.graphQlAttributeName]"
                                v-bind:to="'/lists/' + attribute.sysAttributeByLinkedAttributeId.listId + '/values/' + value[attribute.graphQlAttributeName]">
                                    {{ value[attribute.graphQlAttributePath][attribute.graphQlLinkedAttributeName] }}
                            </router-link>
                        </span>
                        <span v-else>
                            {{ value[attribute.graphQlAttributeName] }}
                        </span>
                    </td>
                    <td>
                        <router-link v-if="showEditValue" class="badge badge-secondary" v-bind:to="'values/' + value.id">
                            Edit Value
                        </router-link>
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- Values pagination -->
        <value-pagination
            v-bind:totalCount="nbValues"
            v-bind:currentPage="currentPage"
            v-on:goToPage="getAllValues"
        ></value-pagination>
    </div>
</template>

<script>
import Pagination from '../utils/Pagination.vue';

export default {
    components: {
        'value-pagination': Pagination
    },
    props: {
        list: Object,
    },
    data: function () {
        return {
            'graphQlQuery': null,
            'graphQlListName': null,
            'attributes': [],
            'values': [],
            'nbValues': null,
            'currentPage': {
                'pageNum': 1,
                'offset': 0,
                'nbItems': 10,
                'isActive': true
            }
        }
    },
    created: function () {
        // Compute GraphQL names for the list and attributes
        let inflection = require('inflection');

        // GraphQL list name
        this.graphQlListName = inflection.pluralize(this.list.tableName); // Example table_name > table_names
        this.graphQlListName = inflection.camelize(this.graphQlListName); // Example table_names > TableNames

        // GraphQL attributes name
        let attributes = this.list.sysAttributesByListId.nodes;
        let graphQLAttributeName = '';
        for (let i = 0; i < attributes.length; i++) {
            attributes[i]['graphQlAttributeName'] = inflection.camelize(attributes[i].columnName, true); // Example colum_name > columnName
            graphQLAttributeName = graphQLAttributeName + ' ' + attributes[i]['graphQlAttributeName'];

            // If attribute is linked to another list attribute, adjust query to fetch linked attribute value
            if (attributes[i].linkedAttributeId) {
                // Build GraphQL attribute path for the linked attribute
                let attributePath = attributes[i]['sysAttributeByLinkedAttributeId']['sysListByListId']['tableName'];
                attributePath = inflection.singularize(attributePath);
                attributePath = inflection.camelize(attributePath, true);
                attributePath = attributePath + "By" + inflection.camelize(attributes[i].columnName);
                attributes[i]['graphQlAttributePath'] = attributePath;
                
                // Build GraphQL attribute name for the linked attribute
                let attributeName = inflection.camelize(attributes[i]['sysAttributeByLinkedAttributeId']['columnName'], true);
                attributes[i]['graphQlLinkedAttributeName'] = attributeName;

                // Add attribute path and name to the query
                graphQLAttributeName = graphQLAttributeName + ' ' + attributePath + "{" + attributeName + "}";
            }
        }
        this.attributes = attributes;

        // Build GraphQL query
        this.graphQlQuery = this.$store.state.queryGetAllValues.replace(/<GraphQlListName>/g, this.graphQlListName);
        this.graphQlQuery = this.graphQlQuery.replace(/<graphQlAttributeName>/g, graphQLAttributeName);
        this.getAllValues(this.currentPage);
    },
    methods: {
        getAllValues(page) {
            // Execute GraphQL query to get values
            let payload = {
                'query': this.graphQlQuery,
                'variables': {
                    'first': page.nbItems,
                    'offset': page.offset
                }
            };
            let headers = {};
            if (this.$session.exists()) {
                headers = { 'Authorization': 'Bearer ' + this.$session.get('jwt') };
            };
            this.$http.post(this.$store.state.graphqlUrl, payload, {headers}).then (
                function(response){
                    if(response.data.errors){
                        this.$store.state.errorObject.flag = true;
                        this.$store.state.errorObject.message = response.data.errors[0].message;
                    } else {
                        this.values = response.data.data['all' + this.graphQlListName].nodes;
                        this.nbValues = response.data.data['all' + this.graphQlListName].totalCount;

                        // Set current page
                        this.currentPage = {
                            'pageNum': page.pageNum,
                            'offset': page.offset,
                            'nbItems': page.nbItems,
                            'isActive': page.isActive
                        }
                    }
                }
            );
        }
    },
    computed: {
        showEditValue(){
            let roles = ['admin', 'advanced', 'standard']
            return roles.includes(this.$store.state.currentUser.role)
        }
    }
}
</script>