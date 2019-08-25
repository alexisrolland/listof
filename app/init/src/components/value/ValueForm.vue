<template>
  <div>
    <h1 class="mt-5">{{ list.name }}</h1>
    <p v-if="list.id">
      User Group: {{ list.sysUserGroupByUserGroupId.name }}
      <br />
      Description: {{ list.description }}
    </p>

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
            <div class="form-group" v-for="attribute in list.attributes" v-bind:key="attribute.id" v-bind:class="{ required: attribute.flagMandatory }">
              <!-- Checkbox input, used for data types boolean (id: 2) -->
              <value-input-checkbox
                v-if="[2].includes(attribute.dataTypeId)"
                v-bind:attribute="attribute"
                v-bind:value="value[attribute.graphQlAttributeName]"
                v-on:changeAttributeValue="getAttributeValue"
              ></value-input-checkbox>

              <!-- Date input, used for data types date (id: 3) -->
              <value-input-date
                v-if="[3].includes(attribute.dataTypeId)"
                v-bind:attribute="attribute"
                v-bind:value="value[attribute.graphQlAttributeName]"
                v-on:changeAttributeValue="getAttributeValue"
              ></value-input-date>

              <!-- Timestamp input, used for data types timestamp (id: 9) -->
              <value-input-timestamp
                v-if="[9].includes(attribute.dataTypeId)"
                v-bind:attribute="attribute"
                v-bind:value="value[attribute.graphQlAttributeName]"
                v-on:changeAttributeValue="getAttributeValue"
              ></value-input-timestamp>

              <!-- Text input, used for data types decimal (id: 4) -->
              <value-input-decimal
                v-if="[4].includes(attribute.dataTypeId)"
                v-bind:attribute="attribute"
                v-bind:value="value[attribute.graphQlAttributeName]"
                v-on:changeAttributeValue="getAttributeValue"
              ></value-input-decimal>

              <!-- Number input, used for data types bigint (id: 1), integer (id: 5), smallint (id: 7) -->
              <value-input-integer
                v-if="[1, 5, 7].includes(attribute.dataTypeId) && !attribute.linkedAttributeId"
                v-bind:attribute="attribute"
                v-bind:value="value[attribute.graphQlAttributeName]"
                v-on:changeAttributeValue="getAttributeValue"
              ></value-input-integer>

              <!-- Text input, used for data types real (id: 6) -->
              <value-input-real
                v-if="[6].includes(attribute.dataTypeId)"
                v-bind:attribute="attribute"
                v-bind:value="value[attribute.graphQlAttributeName]"
                v-on:changeAttributeValue="getAttributeValue"
              ></value-input-real>

              <!-- Text input, used for all other data types text (id: 8) -->
              <value-input-text
                v-if="[8].includes(attribute.dataTypeId)"
                v-bind:attribute="attribute"
                v-bind:value="value[attribute.graphQlAttributeName]"
                v-on:changeAttributeValue="getAttributeValue"
              ></value-input-text>

              <!-- Select input, used for attributes which are linked to another list -->
              <value-select-dropdown
                v-if="[5].includes(attribute.dataTypeId) && attribute.linkedAttributeId"
                v-bind:attribute="attribute"
                v-bind:value="value[attribute.graphQlAttributeName]"
                v-on:changeAttributeValue="getAttributeValue"
              ></value-select-dropdown>
            </div>
          </div>

          <!-- Button Menu -->
          <div>
            <value-button-save v-bind:graphQlListName="list.graphQlListName" v-bind:value="value" v-on:updatedValue="updateMetaData"> </value-button-save>
            <value-button-close v-bind:listId="list.id"></value-button-close>
            <value-button-delete v-if="value.id" v-bind:graphQlListName="list.graphQlListName" v-bind:valueId="value.id" v-bind:listId="list.id">
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
import sortBy from "lodash/sortBy";
import ValueInputCheckbox from "./ValueInputCheckbox.vue";
import ValueInputDate from "./ValueInputDate.vue";
import ValueInputTimestamp from "./ValueInputTimestamp.vue";
import ValueInputDecimal from "./ValueInputDecimal.vue";
import ValueInputInteger from "./ValueInputInteger.vue";
import ValueInputReal from "./ValueInputReal.vue";
import ValueInputText from "./ValueInputText.vue";
import ValueSelectDropdown from "./ValueSelectDropdown.vue";

import ValueButtonAddValue from "./ValueButtonAddValue.vue";
import ValueButtonSave from "./ValueButtonSave.vue";
import ValueButtonClose from "./ValueButtonClose.vue";
import ValueButtonDelete from "./ValueButtonDelete.vue";
import MetaDataCard from "../utils/MetaDataCard.vue";
import Mixins from "../utils/Mixins.vue";

export default {
  mixins: [Mixins],
  components: {
    "value-input-checkbox": ValueInputCheckbox,
    "value-input-date": ValueInputDate,
    "value-input-timestamp": ValueInputTimestamp,
    "value-input-decimal": ValueInputDecimal,
    "value-input-integer": ValueInputInteger,
    "value-input-real": ValueInputReal,
    "value-input-text": ValueInputText,
    "value-select-dropdown": ValueSelectDropdown,

    "value-button-add-value": ValueButtonAddValue,
    "value-button-save": ValueButtonSave,
    "value-button-close": ValueButtonClose,
    "value-button-delete": ValueButtonDelete,
    "value-meta-data": MetaDataCard
  },
  data: function() {
    return {
      list: {},
      value: {}
    };
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
      this.value[obj["attribute"]] = obj["value"];
    },
    updateMetaData(metaData) {
      this.value.updatedDate = metaData.updatedDate;
      this.value.sysUserByUpdatedById.email = metaData.updatedBy;
    }
  },
  created: function() {
    // Get list details
    let payloadList = {
      query: this.$store.state.queryGetList,
      variables: { id: this.listId }
    };
    let headers = {};
    if (this.$session.exists()) {
      headers = { Authorization: "Bearer " + this.$session.get("jwt") };
    }
    this.$http.post(this.$store.state.graphqlUrl, payloadList, { headers }).then(
      function(response) {
        if (response.data.errors) {
          this.displayError(response);
        } else {
          this.list = response.data.data.sysListById;

          // Compute GraphQL names for the list and attributes
          let graphQlListName = this.getGraphQlName(this.list.tableName, "singular"); // Example table_names > tableName
          this.list["graphQlListName"] = graphQlListName;

          // GraphQL attributes name
          let attributeName = "";
          if (this.list.sysAttributesByListId) {
            let attributes = this.list.sysAttributesByListId.nodes;
            for (let i = 0; i < attributes.length; i++) {
              attributes[i]["graphQlAttributeName"] = this.getGraphQlName(attributes[i].columnName); // Example colum_name > columnName
              attributeName = attributes[i]["graphQlAttributeName"] + " " + attributeName;
            }

            // Sort attributes
            this.list["attributes"] = sortBy(attributes, "order");
            delete this.list.sysAttributesByListId;

            // If valueId == new then default attributes in form
            if (this.valueId == "new") {
              for (let i = 0; i < this.list.attributes.length; i++) {
                // Format default value according to data type
                // Data types boolean (id: 2)
                if ([2].includes(this.list.attributes[i].dataTypeId)) {
                  if (this.list.attributes[i].defaultValue == "true") {
                    this.value[this.list.attributes[i].graphQlAttributeName] = true;
                  } else if (this.list.attributes[i].defaultValue == "false") {
                    this.value[this.list.attributes[i].graphQlAttributeName] = false;
                  }
                }
                // Data types bigint (id: 1), integer (id: 5), smallint (id: 7)
                else if ([1, 5, 7].includes(this.list.attributes[i].dataTypeId) && this.list.attributes[i].defaultValue != null) {
                  this.value[this.list.attributes[i].graphQlAttributeName] = parseInt(this.list.attributes[i].defaultValue);
                }
                // Data types real (id: 6)
                else if ([6].includes(this.list.attributes[i].dataTypeId)) {
                  this.value[this.list.attributes[i].graphQlAttributeName] = parseFloat(this.list.attributes[i].defaultValue);
                }
                // Other data types accept strings
                else {
                  this.value[this.list.attributes[i].graphQlAttributeName] = this.list.attributes[i].defaultValue;
                }
              }
            }
            // If valueId != new then get data for existing value
            else {
              // Build GraphQL query
              let graphQlQuery = this.$store.state.queryGetValue.replace(/<graphQlListName>/g, this.list.graphQlListName);
              graphQlQuery = graphQlQuery.replace(/<graphQlAttributeName>/g, attributeName);

              // Execute GraphQL query to get value
              let payloadValue = {
                query: graphQlQuery,
                variables: {
                  id: parseInt(this.valueId)
                }
              };
              let headers = {};
              if (this.$session.exists()) {
                headers = {
                  Authorization: "Bearer " + this.$session.get("jwt")
                };
              }
              this.$http.post(this.$store.state.graphqlUrl, payloadValue, { headers }).then(
                function(response) {
                  if (response.data.errors) {
                    this.displayError(response);
                  } else {
                    this.value = response.data.data[this.list.graphQlListName + "ById"];
                  }
                },
                // Error callback
                function(response) {
                  this.displayError(response);
                }
              );
            }
          }
        }
      },
      // Error callback
      function(response) {
        this.displayError(response);
      }
    );
  }
};
</script>
