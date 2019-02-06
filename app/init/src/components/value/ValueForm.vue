<template>
    <div>
        <h1 class="mt-5">{{ list.name }}</h1>
        <p>{{ list.description }}</p>

        <value-list-button-menu></value-list-button-menu>

        <h1 class="mt-5">Edit Value</h1>

        <div class="form-group"
            v-for="attribute in attributes"
            v-bind:key="attribute.id"
            v-bind:class="{ required: attribute.flagMandatory }">

                <label class="col-form-label"
                    v-bind:for="attribute.id">
                        {{ attribute.name }}:
                </label>

                <!-- Boolean input, used for data types boolean(2) -->
                <div class="form-check form-check-inline"
                    v-if="[2].includes(attribute.dataTypeId)">
                    <input class="form-check-input"
                        type="checkbox"
                        value=""
                        v-bind:id="attribute.id"
                        v-bind:required="attribute.flagMandatory"
                        v-model="value[attribute.graphQlAttributeName]" />
                </div>

                <!-- Date input, used for data types date(4) -->
                <input class="form-control col-sm"
                    type="date"
                    v-if="[4].includes(attribute.dataTypeId)"
                    v-bind:id="attribute.id"
                    v-bind:required="attribute.flagMandatory"
                    v-bind:placeholder="attribute.sysDataTypeByDataTypeId.name"
                    v-model="value[attribute.graphQlAttributeName]" />

                <!-- Date time input, used for data types timestamp(10) -->
                <input class="form-control col-sm"
                    type="datetime-local"
                    v-if="[10].includes(attribute.dataTypeId)"
                    v-bind:id="attribute.id"
                    v-bind:required="attribute.flagMandatory"
                    v-bind:placeholder="attribute.sysDataTypeByDataTypeId.name"
                    v-model="value[attribute.graphQlAttributeName]" />

                <!-- Number input, used for data types bigint(1), smallint(8) -->
                <input class="form-control col-sm"
                    type="number"
                    v-if="[1, 6, 8].includes(attribute.dataTypeId) && !attribute.linkedListId"
                    v-bind:id="attribute.id"
                    v-bind:required="attribute.flagMandatory"
                    v-bind:placeholder="attribute.sysDataTypeByDataTypeId.name"
                    v-model.number="value[attribute.graphQlAttributeName]" />
                
                <!-- Text input, used for non integer data types decimal(5), real(7) -->
                <input class="form-control col-sm"
                    type="text"
                    v-if="[5, 7].includes(attribute.dataTypeId)"
                    v-bind:id="attribute.id"
                    v-bind:required="attribute.flagMandatory"
                    v-bind:placeholder="attribute.sysDataTypeByDataTypeId.name"
                    v-model.number="value[attribute.graphQlAttributeName]" />

                <!-- Text input, used for all other data types char(3), text(9), varchar(11) -->
                <input class="form-control col-sm"
                    type="text"
                    v-if="[3, 9, 11].includes(attribute.dataTypeId)"
                    v-bind:id="attribute.id"
                    v-bind:required="attribute.flagMandatory"
                    v-bind:placeholder="attribute.sysDataTypeByDataTypeId.name"
                    v-model="value[attribute.graphQlAttributeName]" />

                <select class="form-control col-sm"
                    v-if="[6].includes(attribute.dataTypeId) && attribute.linkedListId"
                    id="linkedList"
                    v-model="value[attribute.graphQlAttributeName]">
                        <option v-for="dropdown in attribute.dropdownList"
                            v-bind:value="dropdown.id"
                            v-bind:key="dropdown.id">
                                {{ dropdown[attribute.sysAttributeByLinkedListAttributeId.columnName] }}
                        </option>
                </select>

                <small v-bind:id="attribute.id" class="form-text text-muted">
                    {{ attribute.description }}
                </small>

        </div>

        <value-form-button-menu v-bind:graphQlListName="list.graphQlListName" v-bind:value="value"></value-form-button-menu>
    </div>
</template>

<script>
import ValueListButtonMenu from './ValueListButtonMenu.vue';
import ValueFormButtonMenu from './ValueFormButtonMenu.vue';

export default {
    components: {
        'value-list-button-menu': ValueListButtonMenu,
        'value-form-button-menu': ValueFormButtonMenu
    },
    data: function () {
        return {
            'list': {},
            'attributes': [],
            'queryGetValue': '',
            'value': {}
        }
    },
    computed: {
        listId() {
            var listId = parseInt(this.$route.params.listId);
            if (isNaN(listId)) { return null; }
            else { return listId; }
        },
        valueId() {
            var valueId = parseInt(this.$route.params.valueId);
            if (isNaN(valueId)) { return null; }
            else { return valueId; }
        }
    },
    created: function () {
        this.getList();
    },
    methods: {
        getList: function() {
            // Get list information
            var payload = {
                'query': this.$store.state.queryGetList,
                'variables': { 'id': this.listId }
            };
            this.$http.post(this.$store.state.graphqlUrl, payload).then (
                function(response){
                    if(response.data.errors){
                        this.$store.state.errorObject.flag = true;
                        this.$store.state.errorObject.message = response.data.errors[0].message;
                    } else {
                        this.list = response.data.data.sysListById;

                        // Compute GraphQL list name for the corresponding table name
                        // This is used to build the GraphQL query to get the list value
                        var inflection = require('inflection');
                        var graphQlListName = inflection.singularize(this.list.tableName);
                        graphQlListName = inflection.camelize(graphQlListName, true);
                        this.list['graphQlListName'] = graphQlListName;

                        // Extract attributes and compute their GraphQL column names
                        // This is used to build the GraphQL query to get the list value
                        if (this.list.sysAttributesByListId) {
                            var attributes = this.list.sysAttributesByListId.nodes;
                            for (let i = 0; i < attributes.length; i++) {
                                // Add GraphQl attribute name
                                attributes[i]['graphQlAttributeName'] = inflection.camelize(attributes[i].columnName, true);

                                // If attribute is a link with another list of value
                                // Build GraphQL query to get dropdown list values
                                if (attributes[i].sysListByLinkedListId) {
                                    var linkedTableName = attributes[i].sysListByLinkedListId.tableName;
                                    var linkedColumnName = attributes[i].sysAttributeByLinkedListAttributeId.columnName;
                                    var result = this.getQueryDropdownList(linkedTableName, linkedColumnName);
                                    var graphQlLinkedListName = result[0];
                                    var graphQlQuery = result[1];

                                    // Execute GraphQL query to get dropdown list values
                                    attributes[i]['dropdownList'] = this.getDropdownList(graphQlLinkedListName, graphQlQuery);
                                    var payload = { 'query': graphQlQuery };
                                    this.$http.post(this.$store.state.graphqlUrl, payload).then (
                                        (response) => {
                                            if(response.data.errors){
                                                this.$store.state.errorObject.flag = true;
                                                this.$store.state.errorObject.message = response.data.errors[0].message;
                                            } else {
                                                attributes[i]['dropdownList'] = response.data.data['all' + graphQlLinkedListName].nodes;
                                            }
                                        }
                                    );
                                }
                            }
                            this.attributes = attributes;
                        }

                        // if record exists, build GraphQL queries and get value
                        if (this.valueId) {
                            this.getQueryValue();
                            this.getValue();
                        }
                    }
                }
            );
        },
        getQueryValue: function() {
            // Compute GraphQL query to get value
            var attributeName = '';
            var i;
            for (i = 0; i < this.attributes.length; i++) {
                attributeName = this.attributes[i].graphQlAttributeName + ' ' + attributeName;
            }

            var graphQlQuery = this.$store.state.queryGetValue.replace(/<graphQlListName>/g, this.list.graphQlListName);
            graphQlQuery = graphQlQuery.replace(/<graphQlAttributeName>/g, attributeName);
            this.queryGetValue = graphQlQuery;
        },
        getValue: function() {
            // Execute query to get value if record exists
            var payload = {
                'query': this.queryGetValue,
                'variables': { 'id': this.valueId }
            };
            this.$http.post(this.$store.state.graphqlUrl, payload).then (
                function(response){
                    if(response.data.errors){
                        this.$store.state.errorObject.flag = true;
                        this.$store.state.errorObject.message = response.data.errors[0].message;
                    } else {
                        this.value = response.data.data[this.list.graphQlListName + 'ById'];
                    }
                }
            );
        },
        getQueryDropdownList: function(tableName, columnName) {
            // Compute GraphQL query to get dropdown list values
            var graphQlLinkedListName = tableName;
            var graphQlLinkedListAttribute = columnName;
            var graphQlQuery = this.$store.state.queryGetAllValues;
            var inflection = require('inflection');

            graphQlLinkedListName = inflection.pluralize(graphQlLinkedListName);
            graphQlLinkedListName = inflection.camelize(graphQlLinkedListName);
            graphQlLinkedListAttribute = inflection.camelize(graphQlLinkedListAttribute, true);
            graphQlQuery = graphQlQuery.replace(/<GraphQlListName>/g, graphQlLinkedListName);
            graphQlQuery = graphQlQuery.replace(/<graphQlAttributeName>/g, graphQlLinkedListAttribute);
            return [graphQlLinkedListName, graphQlQuery];

        },
        getDropdownList: function(graphQlLinkedListName, graphQlQuery, attributeIndex) {
            // Execute query to get dropdown lists values
            var payload = { 'query': graphQlQuery };
            this.$http.post(this.$store.state.graphqlUrl, payload).then (
                function(response){
                    if(response.data.errors){
                        this.$store.state.errorObject.flag = true;
                        this.$store.state.errorObject.message = response.data.errors[0].message;
                    } else {
                        return response.data.data['all' + graphQlLinkedListName].nodes;
                    }
                }
            );
        }
    }
}
</script>