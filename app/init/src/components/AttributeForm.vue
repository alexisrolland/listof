<template>
    <div>
        <h1 class="mt-5">Edit Attribute</h1>

        <div class="form-group">
            <label for="attributeName" class="col-form-label">
                Name:
            </label>
            <input
                id="attributeName"
                type="text"
                required="true"
                class="form-control col-sm"
                placeholder="Attribute name"
                v-model="attribute.name" />
        </div>

        <div class="form-group">
            <label for="attributeDescription" class="col-form-label">
                Description:
            </label>
            <textarea
                id="attributeDescription"
                class="form-control col-sm"
                placeholder="Attribute description"
                rows="3"
                v-model="attribute.description" />
        </div>

        <div class="form-group">
            <label for="attributeMandatory" class="col-form-label">
                Mandatory:
            </label>
            <div class="form-check form-check-inline">
                <input
                    id="attributeMandatory"
                    class="form-check-input"
                    type="checkbox" value=""
                    v-model="attribute.flagMandatory" />
            </div>
        </div>

        <div class="form-group">
            <label for="attributeUnique" class="col-form-label">
                Unique:
            </label>
            <div class="form-check form-check-inline">
                <input
                    id="attributeUnique"
                    class="form-check-input"
                    type="checkbox"
                    value=""
                    v-model="attribute.flagUnique" />
            </div>
        </div>

        <div class="form-group">
            <label for="attributeLinkedList" class="col-form-label">
                Linked List:
            </label>
            <select
                id="attributeLinkedList"
                class="form-control col-sm"
                v-model="attribute.linkedListId">
                    <option selected></option>
                    <option v-for="linkedList in linkedLists" v-bind:value="linkedList.id" v-bind:key="linkedList.id">
                        {{ linkedList.name }}
                    </option>
            </select>
        </div>

        <div v-if="!attribute.linkedListId" class="form-group">
            <label for="attributeDataType" class="col-form-label">
                Data Type:
            </label>
            <select
                id="attributeDataType"
                required="true"
                class="form-control col-sm"
                v-model="attribute.dataTypeId">
                    <option v-for="dataType in dataTypes" v-bind:value="dataType.id" v-bind:key="dataType.id">
                        {{ dataType.name }}
                    </option>
            </select>
        </div>

        <div class="form-group">
            <label for="attributeDefaultValue" class="col-form-label">
                Default Value:
            </label>
            <input
                id="attributeDefaultValue"
                class="form-control col-sm"
                type="text"
                placeholder="Attribute default value"
                v-model="attribute.defaultValue" />
        </div>
        <attribute-button-menu v-bind:attribute="attribute"></attribute-button-menu>
    </div>
</template>

<script>
import AttributeButtonMenu from './AttributeButtonMenu.vue';

export default {
    components: {
        'attribute-button-menu': AttributeButtonMenu
    },
    data: function () {
        return {
            'attribute': {},
            'queryGetAttribute': this.$store.state.queryGetAttribute,
            'queryGetAllDataTypes': this.$store.state.queryGetAllDataTypes,
            'queryGetAllLists': this.$store.state.queryGetAllLists,
        }
    },
    computed: {
        listId() {
            return parseInt(this.$route.params.listId);
        },
        attributeId() {
            var attributeId = parseInt(this.$route.params.attributeId);
            if (isNaN(attributeId)) {
                return null;
            } else {
                return attributeId;
            }
        },
        dataTypes() {
            return this.$store.state.dataTypes;
        },
        linkedLists() {
            return this.$store.state.lists;
        }
    },
    created: function () {
        // Get attribute Id from URL parameters, verify if it's valid integer
        // If attribute Id is not NaN then get corresponding attribute
        var attributeId = parseInt(this.$route.params.attributeId);
        if (!isNaN(attributeId)) {
            var payload = {
                'query': this.queryGetAttribute,
                'variables': { 'id': attributeId }
            };
            this.$http.post(this.$store.state.graphqlUrl, payload).then (
                function(response){
                    if(response.data.errors){
                        this.$store.state.errorObject.flag = true;
                        this.$store.state.errorObject.message = response.data.errors[0].message;
                    } else {
                        this.attribute = response.data.data.sysAttributeById;
                    }
                }
            );
        };

        // Get data types to populate dropdown box
        var payload = { 'query': this.queryGetAllDataTypes };
        this.$http.post(this.$store.state.graphqlUrl, payload).then (
            function(response){
                if(response.data.errors){
                    this.$store.state.errorObject.flag = true;
                    this.$store.state.errorObject.message = response.data.errors[0].message;
                } else {
                    this.$store.state.dataTypes = response.data.data.allSysDataTypes.nodes;
                }
            }
        );

        // Get all linked lists to populate dropdown box
        var payload = { 'query': this.queryGetAllLists };
        this.$http.post(this.$store.state.graphqlUrl, payload).then (
            function(response){
                if(response.data.errors){
                    this.$store.state.errorObject.flag = true;
                    this.$store.state.errorObject.message = response.data.errors[0].message;
                } else {
                    this.$store.state.lists = response.data.data.allSysLists.nodes;
                }
            }
        );
    }
}
</script>
