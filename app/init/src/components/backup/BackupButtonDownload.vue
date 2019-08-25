<template>
  <button type="button" class="btn btn-success mb-4 mt-3" v-on:click="downloadBackupPackage">
    Download Backup Package
  </button>
</template>

<script>
import flatten from "lodash/flatten";
import papa from "papaparse";
import snakeCase from "lodash/snakeCase";
import TopologicalSort from "topological-sort";
import uniq from "lodash/uniq";
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
            // Rework response objects to prepare topological sort
            let nodes = new Map();
            let edges = [];
            response.data.data["allSysLists"].nodes.forEach(
              function(obj) {
                // Flatten child lists in array
                obj.childSysLists = obj.childSysLists.nodes.map(function(obj) {
                  return obj.sysAttributesByLinkedAttributeId.nodes.map(function(obj) {
                    return obj.sysListByListId.tableName;
                  });
                });
                obj.childSysLists = flatten(obj.childSysLists);

                // Remove potential duplicates in child lists
                obj.childSysLists = uniq(obj.childSysLists);

                // Push parent child relationship to edges
                obj.childSysLists.forEach(function(child) {
                  edges.push([obj.tableName, child]);
                });

                // Build GraphQL query
                let node = this.buildGraphQlQuery(obj);

                // Send node to map object
                nodes.set(node.tableName, node);
              }.bind(this)
            );

            // Provide nodes and edges to topological sort constructor
            let sortOperator = new TopologicalSort(nodes);
            edges.forEach(function(obj) {
              if (obj[0] != obj[1]) {
                sortOperator.addEdge(obj[0], obj[1]);
              }
            });

            // Apply topological sort
            let sortedNodes = sortOperator.sort();

            // Build batch query payload with sorted lists in sequence order
            let payload = [];
            sortedNodes.forEach(function(value) {
              payload.push(value.node.payload);
            });

            // Execute queries
            let headers = {};
            if (this.$session.exists()) {
              headers = { Authorization: "Bearer " + this.$session.get("jwt") };
            }
            this.$http.post(this.$store.state.graphqlUrl, payload, { headers }).then(
              function(response) {
                // Convert data to CSV format
                response.data.forEach(
                  function(obj, index) {
                    if (obj.errors) {
                      this.createCsvFile(obj.errors, payload[index].tableName);
                    } else {
                      let nbRows = obj.data["all" + payload[index].graphQlListName].totalCount;
                      let data = obj.data["all" + payload[index].graphQlListName].nodes;
                      if (nbRows > 0) {
                        let fileName = index + "_" + payload[index].tableName + ".csv";
                        zip.file(fileName, this.createCsvFile(data));
                      }
                    }
                  }.bind(this)
                );

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
      list["payload"] = { tableName: list.tableName };

      // Compute GraphQL names for the list and attributes
      let graphQlListName = this.getGraphQlName(list.tableName, "plural", true); // Example table_name > TableNames
      list.payload["graphQlListName"] = graphQlListName;

      // Convert column names into GraphQL names
      let attributes = list.sysAttributesByListId.nodes;
      let graphQLAttributeName = "";
      for (let i = 0; i < attributes.length; i++) {
        attributes[i]["graphQlAttributeName"] = this.getGraphQlName(attributes[i].columnName); // Example colum_name > columnName
        graphQLAttributeName = graphQLAttributeName + " " + attributes[i]["graphQlAttributeName"];
      }

      // Build GraphQL query
      let graphQlQuery = this.$store.state.queryDownloadAllValues.replace(/<GraphQlListName>/g, graphQlListName);
      graphQlQuery = graphQlQuery.replace(/<graphQlAttributeName>/g, graphQLAttributeName);
      list.payload["query"] = graphQlQuery;

      delete list.sysAttributesByListId;
      return list;
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
