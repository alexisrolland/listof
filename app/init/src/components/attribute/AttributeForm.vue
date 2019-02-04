<template>
    <div>
        <h1 class="mt-5">Edit Attribute</h1>

        <!-- Attribute Name -->
        <div class="form-group required">
            <label for="name" class="col-form-label">
                Name:
            </label>
            <input class="form-control col-sm"
                id="name"
                type="text"
                required="true"
                placeholder="Attribute name"
                v-model="attribute.name" />
        </div>

        <!-- Attribute Description -->
        <div class="form-group">
            <label for="description" class="col-form-label">
                Description:
            </label>
            <textarea
                id="description"
                class="form-control col-sm"
                placeholder="Attribute description"
                rows="3"
                v-model="attribute.description" />
        </div>

        <!-- Flag Attribute Mandatory -->
        <div class="form-group">
            <label for="mandatory" class="col-form-label">
                Mandatory:
            </label>
            <div class="form-check form-check-inline">
                <input class="form-check-input"
                    id="mandatory"
                    type="checkbox" value=""
                    v-model="attribute.flagMandatory" />
            </div>
        </div>

        <!-- Flag Attribute Unique -->
        <div class="form-group">
            <label for="unique" class="col-form-label">
                Unique:
            </label>
            <div class="form-check form-check-inline">
                <input class="form-check-input"
                    id="unique"
                    type="checkbox"
                    value=""
                    v-model="attribute.flagUnique" />
            </div>
        </div>

        <!-- Linked List -->
        <div class="form-group">
            <label for="linkedList" class="col-form-label">
                Linked List:
            </label>
            <select class="form-control col-sm"
                id="linkedList"
                v-model="attribute.linkedListId">
                    <option selected value></option>
                    <option v-for="linkedList in linkedLists"
                        v-bind:value="linkedList.id"
                        v-bind:key="linkedList.id">
                            {{ linkedList.name }}
                    </option>
            </select>
        </div>

        <!-- Linked List Attribute -->
        <div v-show="attribute.linkedListId" class="form-group required">
            <label for="linkedListAttribute" class="col-form-label">
                Linked List Attribute:
            </label>
            <select class="form-control col-sm"
                id="linkedListAttribute"
                v-model="attribute.linkedListAttributeId">
                    <option selected value></option>
                    <option v-for="linkedListAttribute in linkedListAttributes[attribute.linkedListId]"
                        v-bind:value="linkedListAttribute.id"
                        v-bind:key="linkedListAttribute.id">
                            {{ linkedListAttribute.name }}
                    </option>
            </select>
        </div>

        <!-- Attribute Data Type -->
        <div v-show="!attribute.linkedListId" class="form-group required">
            <label for="dataType" class="col-form-label">
                Data Type:
            </label>
            <select class="form-control col-sm"
                id="dataType"
                required="true"
                v-model="attribute.dataTypeId">
                    <option selected value></option>
                    <option v-for="dataType in dataTypes" v-bind:value="dataType.id" v-bind:key="dataType.id">
                        {{ dataType.name }}
                    </option>
            </select>
        </div>

        <!-- Attribute Default Value -->
        <div v-if="!attribute.linkedListId" class="form-group">
            <label for="defaultValue" class="col-form-label">
                Default Value:
            </label>
            <input class="form-control col-sm"
                id="defaultValue"
                type="text"
                placeholder="Attribute default value"
                v-model="attribute.defaultValue" />
        </div>

        <attribute-form-button-menu v-bind:attribute="attribute"></attribute-form-button-menu>
    </div>
</template>

<script>
import AttributeFormButtonMenu from './AttributeFormButtonMenu.vue';

export default {
    components: {
        'attribute-form-button-menu': AttributeFormButtonMenu
    },
    data: function () {
        return {
            'attribute': {},
            'linkedListAttributes': {} // Used to generate the linked list attributes dropdown box
        }
    },
    computed: {
        attributeId() {
            var attributeId = parseInt(this.$route.params.attributeId);
            if (isNaN(attributeId)) { return null; }
            else { return attributeId; }
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
                'query': this.$store.state.queryGetAttribute,
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
        var payload = { 'query': this.$store.state.queryGetAllDataTypes };
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
        var payload = { 'query': this.$store.state.queryGetAllLists };
        this.$http.post(this.$store.state.graphqlUrl, payload).then (
            function(response){
                if(response.data.errors){
                    this.$store.state.errorObject.flag = true;
                    this.$store.state.errorObject.message = response.data.errors[0].message;
                } else {
                    this.$store.state.lists = response.data.data.allSysLists.nodes;

                    // Prepare attributes for each list in order to populate the dropdown box
                    var i;
                    var linkedLists = this.$store.state.lists;
                    for (i = 0; i < linkedLists.length; i++) {
                        this.linkedListAttributes[linkedLists[i]['id']] = linkedLists[i]['sysAttributesByListId']['nodes'];
                    }
                }
            }
        );
    }
}
</script>