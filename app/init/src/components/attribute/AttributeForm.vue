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
                placeholder="Type attribute name"
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
                placeholder="Type attribute description"
                rows="3"
                v-model="attribute.description" />
        </div>

        <div class="form-check form-check-inline">
            <!-- Flag Attribute Mandatory -->
            <div class="custom-control custom-switch mr-4 mt-1 mb-2">
                <input class="custom-control-input"
                    id="mandatory"
                    type="checkbox"
                    value=""
                    v-model="attribute.flagMandatory"/>
                <label for="mandatory" class="custom-control-label">
                    Mandatory
                </label>
            </div>

            <!-- Flag Attribute Unique -->
            <div class="custom-control custom-switch mr-4 mt-1 mb-2">
                <input class="custom-control-input"
                    id="unique"
                    type="checkbox"
                    value=""
                    v-model="attribute.flagUnique"/>
                <label for="unique" class="custom-control-label">
                    Unique
                </label>
            </div>
        </div>

        <!-- Linked List -->
        <attribute-select-attribute
            v-model="attribute.linkedListAttributeId"
            v-on:changeLinkedListAttribute="getLinkedListAttribute">
        </attribute-select-attribute>

        <!-- Attribute Data Type -->
        <attribute-select-data-type
            v-if="showDataType"
            v-model="attribute.dataTypeId"
            v-on:changeDataType="getDataType">
        </attribute-select-data-type>

        <!-- Attribute Default Value -->
        <div class="form-group" v-if="showDataType">
            <label for="defaultValue" class="col-form-label">
                Default Value:
            </label>
            <input class="form-control col-sm"
                id="defaultValue"
                type="text"
                placeholder="Attribute default value"
                v-model="attribute.defaultValue" />
        </div>

        <!-- Button Menu -->
        <div>
            <attribute-button-save
                v-bind:listId="listId"
                v-bind:attribute="attribute">
            </attribute-button-save>

            <attribute-button-close
                v-bind:listId="listId">
            </attribute-button-close>

            <attribute-button-delete
                v-bind:listId="listId"
                v-if="attribute.id"
                v-bind:attributeId="attribute.id">
            </attribute-button-delete>
        </div>
    </div>
</template>

<script>
import AttributeSelectAttribute from './AttributeSelectAttribute.vue';
import AttributeSelectDataType from './AttributeSelectDataType.vue';
import AttributeButtonSave from './AttributeButtonSave.vue';
import AttributeButtonClose from './AttributeButtonClose.vue';
import AttributeButtonDelete from './AttributeButtonDelete.vue';

export default {
    components: {
        'attribute-select-attribute': AttributeSelectAttribute,
        'attribute-select-data-type': AttributeSelectDataType,
        'attribute-button-save': AttributeButtonSave,
        'attribute-button-close': AttributeButtonClose,
        'attribute-button-delete': AttributeButtonDelete
    },
    data: function () {
        return {
            'attribute': {
                'dataTypeId': null,
                'linkedListAttributeId': null
            }
        }
    },
    computed: {
        listId() {
            return parseInt(this.$route.params.listId);
        },
        attributeId() {
            return this.$route.params.attributeId;
        },
        showDataType() {
            if(this.attribute.linkedListAttributeId == null){ return true; }
            else { return false;}
        }
    },
    methods: {
        getDataType(value) {
            // Get data type from child component
            this.attribute['dataTypeId'] = value;
        },
        getLinkedListAttribute(value) {
            // Get linked list from child component
            if (value != null) {
                this.attribute['linkedListAttributeId'] = value;
            } else {
                this.attribute['linkedListAttributeId'] = null;
            }
        }
    },
    created: function () {
        // If attributeId != new then get data for existing list
        if (this.attributeId != 'new') {
            let payload = {
                'query': this.$store.state.queryGetAttribute,
                'variables': {
                    'id': this.attributeId
                }
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
    }
}
</script>