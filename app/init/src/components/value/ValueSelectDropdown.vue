<template>
  <div>
    <!-- Label -->
    <label class="col-form-label" v-bind:for="attribute.id"> {{ attribute.name }}: </label>

    <!-- Select input, used for attributes which are linked to another list -->
    <treeselect
      v-bind:placeholder="'Select value from ' + attribute.sysAttributeByLinkedAttributeId.sysListByListId.name"
      v-model="selectedValue"
      v-bind:options="options"
      v-bind:multiple="false"
      v-bind:disabled="isReadOnly"
      v-bind:readonly="isReadOnly"
    />

    <!-- Description -->
    <small class="form-text text-muted" v-bind:id="attribute.id">
      {{ attribute.description }}
    </small>
  </div>
</template>

<script>
import Mixins from "../utils/Mixins.vue";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  mixins: [Mixins],
  components: {
    treeselect: Treeselect
  },
  props: {
    attribute: Object,
    value: Number
  },
  data() {
    return {
      selectedValue: this.value,
      options: []
    };
  },
  computed: {
    isReadOnly() {
      let roles = ["admin", "advanced", "standard"];
      return !roles.includes(this.$store.state.currentUser.role);
    }
  },
  watch: {
    value() {
      this.selectedValue = this.value;
    },
    selectedValue(val) {
      let attributeValue = {
        attribute: this.attribute.graphQlAttributeName,
        value: val
      };
      this.$emit("changeAttributeValue", attributeValue);
    }
  },
  created: function() {
    // Compute GraphQL names for the list and attributes
    let graphQlListName = this.getGraphQlName(this.attribute.sysAttributeByLinkedAttributeId.sysListByListId.tableName, "plural", true); // Example table_name > TableNames
    let graphQlAttributeName = this.getGraphQlName(this.attribute.sysAttributeByLinkedAttributeId.columnName); // Example colum_name > columnName

    // Build GraphQL query
    let graphQlQuery = this.$store.state.queryGetLinkedListValues.replace(/<GraphQlListName>/g, graphQlListName);
    graphQlQuery = graphQlQuery.replace(/<graphQlAttributeName>/g, graphQlAttributeName);

    let payload = { query: graphQlQuery };
    let headers = {};
    if (this.$session.exists()) {
      headers = { Authorization: "Bearer " + this.$session.get("jwt") };
    }
    this.$http.post(this.$store.state.graphqlUrl, payload, { headers }).then(
      function(response) {
        if (response.data.errors) {
          this.displayError(response);
        } else {
          this.options = response.data.data["all" + graphQlListName].nodes;
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

<style>
.vue-treeselect {
  color: #666666;
}
</style>
