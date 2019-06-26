<template>
  <button type="button" class="btn btn-success mb-4 mt-3" v-on:click="downloadBackupPackage">
    Download Backup Package
  </button>
</template>

<script>
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
    getUserGroup(zip) {
      let payload = {
        query: this.$store.state.queryBackupAllUserGroups
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
            // Convert data to CSV format
            let userGroupData = response.data.data["allSysUserGroups"].nodes;
            let userGroupDataCleaned = userGroupData.splice(1, userGroupData.length); // Delete Public user group in first position
            zip.file("sys_user_group.csv", this.createCsvFile(userGroupDataCleaned));

            // Package other files
            if (this.backup.listDefinition) {
              this.getListDefinition(zip);
            } else if (this.backup.listData) {
              this.getListValue(zip);
            } else {
              //Download file
              let fileSaver = require("file-saver");
              zip.generateAsync({ type: "blob" }).then(function(content) {
                fileSaver.saveAs(content, "listof-backup.zip");
              });
            }
          }
        },
        // Error callback
        function(response) {
          this.displayError(response);
        }
      );
    },
    getListDefinition(zip) {
      let payload = [{ query: this.$store.state.queryBackupAllLists }, { query: this.$store.state.queryBackupAllAttributes }];
      let headers = {};
      if (this.$session.exists()) {
        headers = { Authorization: "Bearer " + this.$session.get("jwt") };
      }
      this.$http.post(this.$store.state.graphqlUrl, payload, { headers }).then(
        function(response) {
          if (response.data.errors) {
            this.displayError(response);
          } else {
            // Convert data to CSV format
            let listData = response.data[0].data["allSysLists"].nodes;
            zip.file("sys_list.csv", this.createCsvFile(listData));

            let attributeData = response.data[1].data["allSysAttributes"].nodes;
            zip.file("sys_attribute.csv", this.createCsvFile(attributeData));

            // Package other files
            if (this.backup.listData) {
              this.getListValue(zip);
            } else {
              //Download file
              let fileSaver = require("file-saver");
              zip.generateAsync({ type: "blob" }).then(function(content) {
                fileSaver.saveAs(content, "listof-backup.zip");
              });
            }
          }
        },
        // Error callback
        function(response) {
          this.displayError(response);
        }
      );
    },
    getListValue(zip) {
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
                  fileSaver.saveAs(content, "listof-backup.zip");
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
      let lodash = require("lodash");
      for (let i = 0; i < headers.length; i++) {
        headers[i] = lodash.snakeCase(headers[i]);
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
      // Create package
      let JSZip = require("jszip");
      let zip = new JSZip();

      // Download user groups, lists definitions, lists values
      if (this.backup.userGroup) {
        this.getUserGroup(zip);
      } else if (this.backup.listDefinition) {
        this.getListDefinition(zip);
      } else if (this.backup.listData) {
        this.getListValue(zip);
      }
    }
  }
};
</script>
