<template>
    <div>
        <h1 class="mt-5">{{ list.name }}</h1>
        <p>User Group: {{ list.sysUserGroupByUserGroupId.name }}<br>
        Description: {{ list.description }}</p>

        <!-- Button Menu -->
        <div>
            <value-button-add-value v-bind:listId="list.id"></value-button-add-value>
        </div>

        <h1 class="mt-5">Edit Value</h1>
        <form>
            <div class="form-row">
                <div class="col-md-8">

                    <!-- Value Form -->
                    <div v-if="list.attributes">
                        <!-- Loop for each attribute of the list -->
                        <div class="form-group"
                            v-for="attribute in list.attributes"
                            v-bind:key="attribute.id"
                            v-bind:class="{ required: attribute.flagMandatory }">

                                <!-- Checkbox input, used for data types boolean (id: 2) -->
                                <value-input-checkbox
                                    v-if="[2].includes(attribute.dataTypeId)"
                                    v-bind:attribute="attribute"
                                    v-model="value[attribute.graphQlAttributeName]"
                                    v-on:changeAttributeValue="getAttributeValue">
                                </value-input-checkbox>

                                <!-- Date input, used for data types date (id: 4) -->
                                <value-input-date
                                    v-if="[4].includes(attribute.dataTypeId)"
                                    v-bind:attribute="attribute"
                                    v-model="value[attribute.graphQlAttributeName]"
                                    v-on:changeAttributeValue="getAttributeValue">
                                </value-input-date>

                                <!-- Timestamp input, used for data types timestamp (id: 10) -->
                                <value-input-timestamp
                                    v-if="[10].includes(attribute.dataTypeId)"
                                    v-bind:attribute="attribute"
                                    v-model="value[attribute.graphQlAttributeName]"
                                    v-on:changeAttributeValue="getAttributeValue">
                                </value-input-timestamp>

                                <!-- Text input, used for data types decimal (id: 5) -->
                                <value-input-decimal
                                    v-if="[5].includes(attribute.dataTypeId)"
                                    v-bind:attribute="attribute"
                                    v-model="value[attribute.graphQlAttributeName]"
                                    v-on:changeAttributeValue="getAttributeValue">
                                </value-input-decimal>
                                
                                <!-- Number input, used for data types bigint (id: 1), integer (id: 6), smallint (id:8) -->
                                <value-input-integer
                                    v-if="[1, 6, 8].includes(attribute.dataTypeId) && !attribute.linkedAttributeId"
                                    v-bind:attribute="attribute"
                                    v-model="value[attribute.graphQlAttributeName]"
                                    v-on:changeAttributeValue="getAttributeValue">
                                </value-input-integer>

                                <!-- Text input, used for data types real (id: 7) -->
                                <value-input-real
                                    v-if="[7].includes(attribute.dataTypeId)"
                                    v-bind:attribute="attribute"
                                    v-model="value[attribute.graphQlAttributeName]"
                                    v-on:changeAttributeValue="getAttributeValue">
                                </value-input-real>

                                <!-- Text input, used for all other data types char (id: 3), text (id: 9), varchar (id: 11) -->
                                <value-input-text
                                    v-if="[3, 9, 11].includes(attribute.dataTypeId)"
                                    v-bind:attribute="attribute"
                                    v-model="value[attribute.graphQlAttributeName]"
                                    v-on:changeAttributeValue="getAttributeValue">
                                </value-input-text>

                                <!-- Select input, used for attributes which are linked to another list -->
                                <value-select-dropdown
                                    v-if="[6].includes(attribute.dataTypeId) && attribute.linkedAttributeId"
                                    v-bind:attribute="attribute"
                                    v-model="value[attribute.graphQlAttributeName]"
                                    v-on:changeAttributeValue="getAttributeValue">
                                </value-select-dropdown>
                        </div>
                    </div>

                    <!-- Button Menu -->
                    <div>
                        <value-button-save
                            v-bind:graphQlListName="list.graphQlListName"
                            v-bind:value="value">
                        </value-button-save>
                        
                        <value-button-close
                            v-bind:listId="list.id">
                        </value-button-close>
                        
                        <value-button-delete
                            v-if="value.id"
                            v-bind:graphQlListName="list.graphQlListName"
                            v-bind:valueId="value.id"
                            v-bind:listId="list.id"
                            >
                        </value-button-delete>
                    </div>
            </div>
                <div class="col-md-4">
                    <value-meta-data
                        v-if="value.id"
                        v-bind:id="value.id"
                        v-bind:createdDate="value.createdDate"
                        v-bind:createdBy="value.sysUserByCreatedById.email"
                        v-bind:updatedDate="value.updatedDate"
                        v-bind:updatedBy="value.sysUserByUpdatedById.email"
                    ></value-meta-data>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
import ValueInputCheckbox from './ValueInputCheckbox.vue';
import ValueInputDate from './ValueInputDate.vue';
import ValueInputTimestamp from './ValueInputTimestamp.vue';
import ValueInputDecimal from './ValueInputDecimal.vue';
import ValueInputInteger from './ValueInputInteger.vue';
import ValueInputReal from './ValueInputReal.vue';
import ValueInputText from './ValueInputText.vue';
import ValueSelectDropdown from './ValueSelectDropdown.vue';

import ValueButtonAddValue from './ValueButtonAddValue.vue';
import ValueButtonSave from './ValueButtonSave.vue';
import ValueButtonClose from './ValueButtonClose.vue';
import ValueButtonDelete from './ValueButtonDelete.vue';
import MetaDataCard from '../utils/MetaDataCard.vue';

export default {
    components: {
        'value-input-checkbox': ValueInputCheckbox,
        'value-input-date': ValueInputDate,
        'value-input-timestamp': ValueInputTimestamp,
        'value-input-decimal': ValueInputDecimal,
        'value-input-integer': ValueInputInteger,
        'value-input-real': ValueInputReal,
        'value-input-text': ValueInputText,
        'value-select-dropdown': ValueSelectDropdown,

        'value-button-add-value': ValueButtonAddValue,
        'value-button-save': ValueButtonSave,
        'value-button-close': ValueButtonClose,
        'value-button-delete': ValueButtonDelete,
        'value-meta-data': MetaDataCard
    },
    data: function () {
        return {
            'list': {},
            'value': {}
        }
    },
    computed: {
        listId() {
            return parseInt(this.$route.params.listId);
        },
        valueId() {
            return this.$route.params.valueId;
        }
    },
    methods: {
        getAttributeValue(obj) {
            // Get attribute value from child component
            this.value[obj['attribute']] = obj['value'];
        }
    },
    created: function () {
        // Get list details
        let payloadList = {
            'query': this.$store.state.queryGetList,
            'variables': { 'id': this.listId }
        };
        let headers = {};
        if (this.$session.exists()) {
            headers = { 'Authorization': 'Bearer ' + this.$session.get('jwt') };
        };
        this.$http.post(this.$store.state.graphqlUrl, payloadList, {headers}).then (
            function(response){
                if(response.data.errors){
                    this.$store.state.errorObject.flag = true;
                    this.$store.state.errorObject.message = response.data.errors[0].message;
                } else {
                    this.list = response.data.data.sysListById;

                    // Compute GraphQL names for the list and attributes
                    let inflection = require('inflection');

                    // GraphQL list name
                    let graphQlListName = inflection.singularize(this.list.tableName); // Example table_names > table_name
                    graphQlListName = inflection.camelize(graphQlListName, true); // Example table_name > tableName
                    this.list['graphQlListName'] = graphQlListName;

                    // GraphQL attributes name
                    let attributeName = '';
                    if (this.list.sysAttributesByListId) {
                        let attributes = this.list.sysAttributesByListId.nodes;
                        for (let i = 0; i < attributes.length; i++) {
                            attributes[i]['graphQlAttributeName'] = inflection.camelize(attributes[i].columnName, true); // Example colum_name > columnName
                            attributeName = attributes[i]['graphQlAttributeName'] + ' ' + attributeName;
                        }
                        this.list['attributes'] = attributes;
                        delete this.list.sysAttributesByListId;
                    }

                    // If valueId != new then get data for existing value
                    if (this.valueId != 'new') {
                        // Build GraphQL query
                        let graphQlQuery = this.$store.state.queryGetValue.replace(/<graphQlListName>/g, this.list.graphQlListName);
                        graphQlQuery = graphQlQuery.replace(/<graphQlAttributeName>/g, attributeName);

                        // Execute GraphQL query to get value
                        let payloadValue = {
                            'query': graphQlQuery,
                            'variables': {
                                'id': parseInt(this.valueId)
                            }
                        };
                        let headers = {};
                        if (this.$session.exists()) {
                            headers = { 'Authorization': 'Bearer ' + this.$session.get('jwt') };
                        };
                        this.$http.post(this.$store.state.graphqlUrl, payloadValue, {headers}).then (
                            function(response){
                                if(response.data.errors){
                                    this.$store.state.errorObject.flag = true;
                                    this.$store.state.errorObject.message = response.data.errors[0].message;
                                } else {
                                    this.value = response.data.data[this.list.graphQlListName + 'ById'];
                                }
                            }
                        );
                    }
                }
            }
        );
    }
}
</script>