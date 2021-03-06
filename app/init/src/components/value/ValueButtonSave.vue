<template>
  <button v-if="show" type="button" class="btn btn-success" v-on:click="saveValue">
    Save
  </button>
</template>

<script>
import omit from "lodash/omit";
import Mixins from "../utils/Mixins.vue";

export default {
  mixins: [Mixins],
  props: {
    graphQlListName: String, // Example tableName
    value: Object
  },
  methods: {
    saveValue() {
      // Method to create or update a value
      // Upper case first letter of list name
      let graphQlListNameUpperCase = this.graphQlListName.charAt(0).toUpperCase() + this.graphQlListName.slice(1);

      // If value.id exists, update existing value
      if (this.value.id) {
        // Build GraphQL update mutation
        let graphQlMutation = this.$store.state.mutationUpdateValue.replace(/<GraphQlListName>/g, graphQlListNameUpperCase);
        graphQlMutation = graphQlMutation.replace(/<graphQlListName>/g, this.graphQlListName);

        // Set undefined properties to null to ensure GraphQL keep them in the payload
        for (let property in this.value) {
          if (this.value.hasOwnProperty(property) && this.value[property] == undefined) {
            this.value[property] = null;
          }
        }

        // Build mutation payload
        let variables = { id: this.value.id };
        let patch = omit(this.value, ["createdDate", "sysUserByCreatedById", "updatedDate", "sysUserByUpdatedById"]);
        variables[this.graphQlListName + "Patch"] = patch;
        let payload = {
          query: graphQlMutation,
          variables: variables
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
              // Send updates to parent component
              let metaData = {
                updatedDate: response.data.data["update" + graphQlListNameUpperCase + "ById"][this.graphQlListName].updatedDate,
                updatedBy: response.data.data["update" + graphQlListNameUpperCase + "ById"][this.graphQlListName].sysUserByUpdatedById.email
              };
              this.$emit("updatedValue", metaData);
            }
          },
          // Error callback
          function(response) {
            this.displayError(response);
          }
        );
      } else {
        // Build GraphQL create mutation
        let graphQlMutation = this.$store.state.mutationCreateValue.replace(/<GraphQlListName>/g, graphQlListNameUpperCase);
        graphQlMutation = graphQlMutation.replace(/<graphQlListName>/g, this.graphQlListName);

        // Build mutation payload
        let variables = {};
        variables[this.graphQlListName] = this.value;
        var payload = {
          query: graphQlMutation,
          variables: variables
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
              // Capture new value Id in case user wants to delete or update it
              this.value.id = response.data.data["create" + graphQlListNameUpperCase][this.graphQlListName].id;
              this.$router.push({
                name: "edit-list-value",
                params: {
                  valueId: this.value.id
                }
              });
            }
          },
          // Error callback
          function(response) {
            this.displayError(response);
          }
        );
      }
    }
  },
  computed: {
    show() {
      let roles = ["admin", "advanced", "standard"];
      return roles.includes(this.$store.state.currentUser.role);
    }
  }
};
</script>
