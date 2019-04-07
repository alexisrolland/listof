<template>
    <div class="mt-5">
        <!-- Search bar -->
        <div class="input-group mb-5">
            <!-- Selected attribute to search -->
            <div id="inputGroupPrepend" class="dropdown input-group-prepend">
                <button class="btn btn-secondary dropdown-toggle"
                    type="button"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false">
                    {{ searchAttribute.name }}
                </button>
                <!-- Attributes to search -->
                <div class="dropdown-menu dropdown-menu-lg-right" aria-labelledby="admin">
                    <a class="dropdown-item"
                        href="#"
                        v-for="attribute in attributes"
                        v-bind:key="attribute.id"
                        v-on:click="setSearchAttribute(attribute)">
                            {{ attribute.name }}
                    </a>
                </div>
            </div>
            <input class="form-control form-control-lg"
                type="search"
                aria-label="Search"
                aria-describedby="inputGroupPrepend"
                placeholder="Search values"
                v-model="keyword"
                v-on:keyup.enter="search">
        </div>

        <!-- List of Values -->
        <value-table
            v-bind:attributes="attributes"
            v-bind:values="values"
        ></value-table>

        <!-- Values pagination -->
        <value-pagination
            v-bind:totalCount="nbValues"
            v-bind:currentPage="currentPage"
            v-on:goToPage="getAllValues"
        ></value-pagination>
    </div>
</template>

<script>
import ValueTable from './ValueTable.vue';
import Pagination from '../utils/Pagination.vue';

export default {
    components: {
        'value-table': ValueTable,
        'value-pagination': Pagination
    },
    props: {
        list: Object,
    },
    data: function () {
        return {
            'graphQlQuery': null,
            'graphQlListName': null,
            'graphQlAttributeName': null,
            'graphQlMutation': null,
            'attributes': [],
            'values': [],
            'nbValues': null,
            'currentPage': {
                'pageNum': 1,
                'offset': 0,
                'nbItems': 10,
                'isActive': true
            },
            'keyword': null,
            'searchAttribute': {
                'name': 'Search Attribute'
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
        this.graphQLAttributeName = '';
        for (let i = 0; i < attributes.length; i++) {
            attributes[i]['graphQlAttributeName'] = inflection.camelize(attributes[i].columnName, true); // Example colum_name > columnName
            this.graphQLAttributeName = this.graphQLAttributeName + ' ' + attributes[i]['graphQlAttributeName'];

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
                this.graphQLAttributeName = this.graphQLAttributeName + ' ' + attributePath + "{" + attributeName + "}";
            }
        }
        this.attributes = attributes;

        // Build GraphQL query
        this.graphQlQuery = this.$store.state.queryGetAllValues.replace(/<GraphQlListName>/g, this.graphQlListName);
        this.graphQlQuery = this.graphQlQuery.replace(/<graphQlAttributeName>/g, this.graphQLAttributeName);
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
        },
        search() {
            // Search values based on keywords
            // If keyword is empty, use GraphQL native query to benefit from pagination
            if (this.keyword == "") {
                this.getAllValues(this.currentPage);
            } else {
                // Build GraphQL mutation
                let inflection = require('inflection');
                let graphQlMutationName = inflection.camelize(this.list.tableName); // Example table_name > TableName
                let graphQlMutationListName = inflection.pluralize(this.list.tableName); // Example table_name > table_names
                graphQlMutationListName = inflection.camelize(graphQlMutationListName, true); // Example table_names > tableNames

                this.graphQlMutation = this.$store.state.mutationSearchValue.replace(/<GraphQlMutationName>/g, graphQlMutationName);
                this.graphQlMutation = this.graphQlMutation.replace(/<graphQlMutationListName>/g, graphQlMutationListName);
                this.graphQlMutation = this.graphQlMutation.replace(/<graphQlAttributeName>/g, this.graphQLAttributeName);

                let payload = {
                    'query': this.graphQlMutation,
                    'variables': {
                        'columnName': this.searchAttribute.columnName,
                        'keyword': this.keyword
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
                            this.values = response.data.data['search' + graphQlMutationName][graphQlMutationListName];
                            this.nbValuess = this.values.length;

                            // Set current page to first page
                            this.currentPage = {
                                'pageNum': 1,
                                'offset': 0,
                                'nbItems': 10,
                                'isActive': true
                            }
                        }
                    }
                );
            }
        },
        setSearchAttribute(attribute) {
            this.searchAttribute = attribute;
        }
    }
}
</script>