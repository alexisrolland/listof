<template>
  <div>
    <h1 class="mt-5">Edit Attribute</h1>

    <form>
      <div class="form-row">
        <div class="col-md-8">
          <!-- Attribute Name -->
          <div class="form-group required">
            <label for="name" class="col-form-label">
              Name:
            </label>
            <input
              class="form-control col-sm"
              id="name"
              type="text"
              required="true"
              v-bind:disabled="isReadOnly"
              v-bind:readonly="isReadOnly"
              placeholder="Type attribute name"
              v-model="attribute.name"
            />
          </div>

          <!-- Attribute Description -->
          <div class="form-group">
            <label for="description" class="col-form-label">
              Description:
            </label>
            <textarea
              class="form-control col-sm"
              id="description"
              v-bind:disabled="isReadOnly"
              v-bind:readonly="isReadOnly"
              placeholder="Type attribute description"
              rows="3"
              v-model="attribute.description"
            />
          </div>

          <!-- Attribute Order -->
          <!-- <div class="form-group">
                        <label for="order" class="col-form-label">
                            Order:
                        </label>
                        <input
                            id="description"
                            class="form-control col-sm"
                            placeholder="Type attribute order"
                            type="number"
                            v-model="attribute.order" />
                    </div> -->

          <div class="form-check form-check-inline">
            <!-- Flag Attribute Mandatory -->
            <div class="custom-control custom-switch mr-4 mt-1 mb-2">
              <input
                class="custom-control-input"
                id="mandatory"
                type="checkbox"
                value=""
                v-bind:disabled="preventUpdate"
                v-model="attribute.flagMandatory"
              />
              <label for="mandatory" class="custom-control-label">
                Mandatory
              </label>
            </div>

            <!-- Flag Attribute Unique -->
            <div class="custom-control custom-switch mr-4 mt-1 mb-2">
              <input
                class="custom-control-input"
                id="unique"
                type="checkbox"
                value=""
                v-bind:disabled="preventUpdate"
                v-model="attribute.flagUnique"
              />
              <label for="unique" class="custom-control-label">
                Unique
              </label>
            </div>
          </div>

          <!-- Linked List -->
          <attribute-select-attribute
            v-if="showLinkedAttribute"
            v-model="attribute.linkedAttributeId"
            v-bind:linkedAttribute="attribute.sysAttributeByLinkedAttributeId"
            v-on:changeLinkedAttribute="getLinkedAttribute"
          >
          </attribute-select-attribute>

          <!-- Attribute Data Type -->
          <attribute-select-data-type
            v-if="showDataType"
            v-model="attribute.dataTypeId"
            v-on:changeDataType="getDataType"
          >
          </attribute-select-data-type>

          <!-- Attribute Default Value -->
          <div class="form-group">
            <!-- Checkbox input, used for data types boolean (id: 2) -->
            <attribute-default-value-input-checkbox
              v-if="[2].includes(attribute.dataTypeId)"
              v-bind:value="attribute.defaultValue"
              v-on:setDefaultValue="setDefaultValue"
            >
            </attribute-default-value-input-checkbox>

            <!-- Date input, used for data types date (id: 3) -->
            <attribute-default-value-input-date
              v-if="[3].includes(attribute.dataTypeId)"
              v-bind:value="attribute.defaultValue"
              v-on:setDefaultValue="setDefaultValue"
            >
            </attribute-default-value-input-date>

            <!-- Timestamp input, used for data types timestamp (id: 9) -->
            <attribute-default-value-input-timestamp
              v-if="[9].includes(attribute.dataTypeId)"
              v-bind:value="attribute.defaultValue"
              v-on:setDefaultValue="setDefaultValue"
            >
            </attribute-default-value-input-timestamp>

            <!-- Text input, used for data types decimal (id: 4) -->
            <attribute-default-value-input-decimal
              v-if="[4].includes(attribute.dataTypeId)"
              v-bind:value="attribute.defaultValue"
              v-on:setDefaultValue="setDefaultValue"
            >
            </attribute-default-value-input-decimal>

            <!-- Number input, used for data types bigint (id: 1), integer (id: 5), smallint (id: 7) -->
            <attribute-default-value-input-integer
              v-if="
                [1, 5, 7].includes(attribute.dataTypeId) &&
                  !attribute.linkedAttributeId
              "
              v-bind:value="parseInt(attribute.defaultValue)"
              v-on:setDefaultValue="setDefaultValue"
            >
            </attribute-default-value-input-integer>

            <!-- Text input, used for data types real (id: 6) -->
            <attribute-default-value-input-real
              v-if="[6].includes(attribute.dataTypeId)"
              v-bind:value="attribute.defaultValue"
              v-on:setDefaultValue="setDefaultValue"
            >
            </attribute-default-value-input-real>

            <!-- Text input, used for all other data types text (id: 8) -->
            <attribute-default-value-input-text
              v-if="[8].includes(attribute.dataTypeId)"
              v-bind:value="attribute.defaultValue"
              v-on:setDefaultValue="setDefaultValue"
            >
            </attribute-default-value-input-text>

            <!-- Select input, used for attributes which are linked to another list -->
            <attribute-default-value-select-dropdown
              v-if="attribute.linkedAttributeId"
              v-bind:linkedAttributeId="attribute.linkedAttributeId"
              v-bind:value="attribute.defaultValue"
              v-on:setDefaultValue="setDefaultValue"
            >
            </attribute-default-value-select-dropdown>
          </div>

          <!-- Button Menu -->
          <div>
            <attribute-button-save
              v-bind:listId="listId"
              v-bind:attribute="attribute"
            >
            </attribute-button-save>

            <attribute-button-close v-bind:listId="listId">
            </attribute-button-close>

            <attribute-button-delete
              v-bind:listId="listId"
              v-if="attribute.id"
              v-bind:attributeId="attribute.id"
            >
            </attribute-button-delete>
          </div>
        </div>
        <div class="col-md-4">
          <attribute-meta-data
            v-if="attribute.id"
            v-bind:id="attribute.id"
            v-bind:createdDate="attribute.createdDate"
            v-bind:createdBy="attribute.sysUserByCreatedById.email"
            v-bind:updatedDate="attribute.updatedDate"
            v-bind:updatedBy="attribute.sysUserByUpdatedById.email"
          ></attribute-meta-data>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import AttributeSelectAttribute from "./AttributeSelectAttribute.vue";
import AttributeSelectDataType from "./AttributeSelectDataType.vue";
import AttributeDefaultValueInputCheckbox from "./AttributeDefaultValueInputCheckbox.vue";
import AttributeDefaultValueInputDate from "./AttributeDefaultValueInputDate.vue";
import AttributeDefaultValueInputDecimal from "./AttributeDefaultValueInputDecimal.vue";
import AttributeDefaultValueInputInteger from "./AttributeDefaultValueInputInteger.vue";
import AttributeDefaultValueInputReal from "./AttributeDefaultValueInputReal.vue";
import AttributeDefaultValueInputText from "./AttributeDefaultValueInputText.vue";
import AttributeDefaultValueInputTimestamp from "./AttributeDefaultValueInputTimestamp.vue";
import AttributeDefaultValueSelectDropdown from "./AttributeDefaultValueSelectDropdown.vue";

import AttributeButtonSave from "./AttributeButtonSave.vue";
import AttributeButtonClose from "./AttributeButtonClose.vue";
import AttributeButtonDelete from "./AttributeButtonDelete.vue";
import MetaDataCard from "../utils/MetaDataCard.vue";
import Mixins from "../utils/Mixins.vue";

export default {
  mixins: [Mixins],
  components: {
    "attribute-select-attribute": AttributeSelectAttribute,
    "attribute-select-data-type": AttributeSelectDataType,
    "attribute-default-value-input-checkbox": AttributeDefaultValueInputCheckbox,
    "attribute-default-value-input-date": AttributeDefaultValueInputDate,
    "attribute-default-value-input-decimal": AttributeDefaultValueInputDecimal,
    "attribute-default-value-input-integer": AttributeDefaultValueInputInteger,
    "attribute-default-value-input-real": AttributeDefaultValueInputReal,
    "attribute-default-value-input-text": AttributeDefaultValueInputText,
    "attribute-default-value-input-timestamp": AttributeDefaultValueInputTimestamp,
    "attribute-default-value-select-dropdown": AttributeDefaultValueSelectDropdown,

    "attribute-button-save": AttributeButtonSave,
    "attribute-button-close": AttributeButtonClose,
    "attribute-button-delete": AttributeButtonDelete,
    "attribute-meta-data": MetaDataCard
  },
  data: function() {
    return {
      attribute: {
        dataTypeId: null,
        linkedAttributeId: null
      }
    };
  },
  computed: {
    listId() {
      return parseInt(this.$route.params.listId);
    },
    attributeId() {
      return this.$route.params.attributeId;
    },
    showLinkedAttribute() {
      if (this.attributeId == "new") {
        return true;
      } else if (this.attribute.linkedAttributeId != null) {
        return true;
      } else {
        return false;
      }
    },
    showDataType() {
      if (this.attribute.linkedAttributeId == null) {
        return true;
      } else {
        return false;
      }
    },
    isReadOnly() {
      let roles = ["admin", "advanced"];
      if (!roles.includes(this.$store.state.currentUser.role)) {
        return true;
      } else {
        return false;
      }
    },
    preventUpdate() {
      if (!this.isReadOnly) {
        if (this.attributeId != "new") {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    }
  },
  methods: {
    getDataType(value) {
      // Get data type from child component
      this.attribute["dataTypeId"] = value;
    },
    getLinkedAttribute(value) {
      // Get linked list from child component
      if (value != null) {
        this.attribute["linkedAttributeId"] = value;
      } else {
        this.attribute["linkedAttributeId"] = null;
      }
    },
    setDefaultValue(value) {
      if (value) {
        this.attribute["defaultValue"] = value;
      } else {
        this.attribute["defaultValue"] = null;
      }
    }
  },
  created: function() {
    // If attributeId != new then get data for existing list
    if (this.attributeId != "new") {
      let payload = {
        query: this.$store.state.queryGetAttribute,
        variables: {
          id: parseInt(this.attributeId)
        }
      };
      let headers = {};
      if (this.$session.exists()) {
        headers = { Authorization: "Bearer " + this.$session.get("jwt") };
      }
      this.$http.post(this.$store.state.graphqlUrl, payload, { headers }).then(
        function(response) {
          if (response.data.errors) {
            this.displayError(response);
          } else {
            this.attribute = response.data.data.sysAttributeById;
          }
        },
        // Error callback
        function(response) {
          this.displayError(response);
        }
      );
    }
  }
};
</script>
