<template>
  <button type="button" class="btn btn-success mb-4 mt-3" v-on:click="downloadBackupPackage">
    Download Backup Package
  </button>
</template>

<script>
import snakeCase from "lodash/snakeCase";
import Mixins from "../utils/Mixins.vue";

export default {
  mixins: [Mixins],
  props: {
    backup: Object
  },
  data: function() {
    return {
      lists: []
    };
  },
  methods: {
    async getDefinitionData() {
      // Create package
      let JSZip = require("jszip");
      let zip = new JSZip();

      let payload = [
        { query: this.$store.state.queryBackupAllUserGroups },
        { query: this.$store.state.queryBackupAllLists },
        { query: this.$store.state.queryBackupAllAttributes }
      ];
      let headers = {};
      if (this.$session.exists()) {
        headers = { Authorization: "Bearer " + this.$session.get("jwt") };
      }
      this.$http.post(this.$store.state.graphqlUrl, payload, { headers }).then(
        function(response) {
          if (response.data.errors) {
            this.displayError(response);
          } else {
            // Convert user group data to CSV format
            let userGroupDataRaw = response.data[0].data["allSysUserGroups"].nodes;
            let userGroupData = userGroupDataRaw.splice(1, userGroupDataRaw.length); // Delete Public user group on first line
            zip.file("sys_user_group.csv", this.createCsvFile(userGroupData));

            // Convert list definition data to CSV format
            let listData = response.data[1].data["allSysLists"].nodes;
            zip.file("sys_list.csv", this.createCsvFile(listData));

            // Convert attributes definition data to CSV format
            let attributeData = response.data[2].data["allSysAttributes"].nodes;
            zip.file("sys_attribute.csv", this.createCsvFile(attributeData));

            //Download file
            let fileSaver = require("file-saver");
            zip.generateAsync({ type: "blob" }).then(function(content) {
              fileSaver.saveAs(content, "listof-definition-data.zip");
            });
          }
        },
        // Error callback
        function(response) {
          this.displayError(response);
        }
      );
    },
    async getListValue() {
      // Create package
      let JSZip = require("jszip");
      let zip = new JSZip();

      // Fetch lists table and column names to build GraphQL queries
      let payload = {
        query: this.$store.state.queryBackupAllListsValues
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
            // Build GraphQL queries
            let payload = response.data.data["allSysLists"].nodes.map(this.buildGraphQlQuery);

            // Execute queries
            let headers = {};
            if (this.$session.exists()) {
              headers = { Authorization: "Bearer " + this.$session.get("jwt") };
            }
            this.$http.post(this.$store.state.graphqlUrl, payload, { headers }).then(
              function(response) {
                // Convert data to CSV format
                for (let i = 0; i < response.data.length; i++) {
                  if (response.data[i].errors) {
                    this.createCsvFile(response.data[i].errors, payload[i].tableName);
                  } else {
                    let data = response.data[i].data["all" + payload[i].graphQlListName].nodes;
                    zip.file(payload[i].tableName + ".csv", this.createCsvFile(data));
                  }
                }

                //Download file
                let fileSaver = require("file-saver");
                zip.generateAsync({ type: "blob" }).then(function(content) {
                  fileSaver.saveAs(content, "listof-lists-data.zip");
                });
              },
              // Error callback
              function(response) {
                this.displayError(response);
              }
            );
          }
        },
        // Error callback
        function(response) {
          this.displayError(response);
        }
      );
    },
    createCsvFile(data) {
      let papa = require("papaparse");
      let text = papa.unparse(data);

      // Change header to snake_case
      let rows = text.split(/\r\n|\r|\n/);
      let headers = rows[0].split(",");
      for (let i = 0; i < headers.length; i++) {
        headers[i] = snakeCase(headers[i]);
      }
      rows[0] = headers.join(",");
      text = rows.join("\r\n");
      return text;
    },
    buildGraphQlQuery(list) {
      // Method to build GraphQL query to fetch values of a list
      // Compute GraphQL names for the list and attributes
      let graphQlListName = this.getGraphQlName(list.tableName, "plural", true); // Example table_name > TableNames
      let attributes = list.sysAttributesByListId.nodes;
      let graphQLAttributeName = "";
      for (let i = 0; i < attributes.length; i++) {
        attributes[i]["graphQlAttributeName"] = this.getGraphQlName(attributes[i].columnName); // Example colum_name > columnName
        graphQLAttributeName = graphQLAttributeName + " " + attributes[i]["graphQlAttributeName"];
      }

      // Build GraphQL query
      let graphQlQuery = this.$store.state.queryDownloadAllValues.replace(/<GraphQlListName>/g, graphQlListName);
      graphQlQuery = graphQlQuery.replace(/<graphQlAttributeName>/g, graphQLAttributeName);
      return { tableName: list.tableName, graphQlListName: graphQlListName, query: graphQlQuery };
    },
    downloadBackupPackage() {
      // Download user groups, lists definitions, lists values
      if (this.backup.definitionData) {
        this.getDefinitionData();
      }

      // Download all values of all lists
      if (this.backup.listData) {
        this.getListValue();
      }
    }
  }
};
</script>
