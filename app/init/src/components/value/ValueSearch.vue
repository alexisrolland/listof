<template>
    <div class="mt-3">
        <!-- Search bar -->
        <div class="input-group mb-4">
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
                        v-on:click="setSearchAttribute('all')">
                            Search all
                    </a>
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
                v-on:keyup.enter="search('asc')">
        </div>

        <!-- List of Values -->
        <value-table
            v-bind:attributes="attributes"
            v-bind:values="values"
            v-on:sortList="sortList"
        ></value-table>

        <!-- Values pagination -->
        <value-pagination
            v-if="showPagination"
            v-bind:totalCount="nbValues"
            v-bind:currentPage="currentPage"
            v-on:goToPage="search"
        ></value-pagination>
    </div>
</template>

<script>
import Mixins from '../utils/Mixins.vue';
import Pagination from '../utils/Pagination.vue';
import ValueTable from './ValueTable.vue';

export default {
    mixins: [Mixins],
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
            'showPagination': true,
            'currentPage': {
                'pageNum': 1,
                'offset': 0,
                'nbItems': 10,
                'isActive': true
            },
            'keyword': null,
            'searchAttribute': {
                'name': 'Search all',
                'columnName': 'search_all'
            }
        }
    },
    created: function () {
        // Compute GraphQL names for the list and attributes
        this.graphQlListName = this.getGraphQlName(this.list.tableName, 'plural', true);  // Example table_name > TableNames

        // GraphQL attributes name
        let attributes = this.list.sysAttributesByListId.nodes;
        this.graphQLAttributeName = '';
        for (let i = 0; i < attributes.length; i++) {
            attributes[i]['graphQlAttributeName'] = this.getGraphQlName(attributes[i].columnName);  // Example colum_name > columnName
            this.graphQLAttributeName = this.graphQLAttributeName + ' ' + attributes[i]['graphQlAttributeName'];

            // If attribute is linked to another list attribute, adjust query to fetch linked attribute value
            if (attributes[i].linkedAttributeId) {
                // Build GraphQL attribute path for the linked attribute
                let attributePath = attributes[i]['sysAttributeByLinkedAttributeId']['sysListByListId']['tableName'];
                attributePath = this.getGraphQlName(attributePath, 'singular');  // Example column_name > columnName
                attributePath = attributePath + "By" + this.getGraphQlName(attributes[i].columnName, null, true);  // Example column_name > ColumnName
                attributes[i]['graphQlAttributePath'] = attributePath;
                
                // Build GraphQL attribute name for the linked attribute
                let attributeName = this.getGraphQlName(attributes[i]['sysAttributeByLinkedAttributeId']['columnName']);  // Example column_name > columnName
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
                        this.displayError(response);
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
                },
                // Error callback
                function(response){
                    this.displayError(response);
                }
            );
        },
        search(sortOrder) {
            // Search values based on keywords
            // If keyword is empty, use GraphQL native query to benefit from pagination
            if (this.keyword == "") {
                // Show pagination since regular query provide pagination feature
                this.showPagination = true;
                this.getAllValues(this.currentPage);
            } else {
                // Do not show pagination since custom search feature does not include pagination
                this.showPagination = false;

                // Build GraphQL mutation
                let graphQlMutationName = this.getGraphQlName(this.list.tableName, null, true);  // Example table_name > TableName
                let graphQlMutationListName = this.getGraphQlName(this.list.tableName, 'plural');  // Example table_name > tableNames

                this.graphQlMutation = this.$store.state.mutationSearchValue.replace(/<GraphQlMutationName>/g, graphQlMutationName);
                this.graphQlMutation = this.graphQlMutation.replace(/<graphQlMutationListName>/g, graphQlMutationListName);
                this.graphQlMutation = this.graphQlMutation.replace(/<graphQlAttributeName>/g, this.graphQLAttributeName);

                let payload = {
                    'query': this.graphQlMutation,
                    'variables': {
                        'columnName': this.searchAttribute.columnName,
                        'keyword': this.keyword,
                        'sortOrder': sortOrder
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
                            this.values = response.data.data['search' + graphQlMutationName][graphQlMutationListName];
                        }
                    },
                    // Error callback
                    function(response){
                        this.displayError(response);
                    }
                );
            }
        },
        setSearchAttribute(attribute) {
            if(attribute == 'all') {
                this.searchAttribute = {
                    'name': 'Search all',
                    'columnName': 'search_all'
                }
            }
            else {
                this.searchAttribute = attribute;
            }
        },
        sortList(payload) {
            this.search(payload.sortOrder);
        }
    }
}
</script>