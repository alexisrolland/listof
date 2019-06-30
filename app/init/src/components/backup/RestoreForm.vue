<template>
  <div>
    <h1 class="mt-5">Restore</h1>
    <p>
      Select a zip package to restore. <b>Note definition data must be imported before lists data.</b>
    </p>
    
    <div class="form-check">
      <input
        class="form-check-input"
        type="radio"
        name="packageType"
        id="definitionData"
        value="definitionData"
        v-bind:disabled="isReadOnly"
        v-bind:readonly="isReadOnly"
        v-model="packageType"
        v-on:change="files = []">
      <label class="form-check-label" for="definitionData">
        Definition data (user groups, lists definition and their attributes).
      </label>
    </div>
    <div class="form-check">
      <input
        class="form-check-input"
        type="radio"
        name="packageType"
        id="listData"
        value="listData"
        v-bind:disabled="isReadOnly"
        v-bind:readonly="isReadOnly"
        v-model="packageType"
        v-on:change="files = []">
      <label class="form-check-label" for="listData">
        Lists data (all values of all lists)
      </label>
    </div>

    <p id="info" class="card bg-secondary small p-2 mt-3">
      The restore process follows the logic below:
      <ul>
        <li>Restore does <b>insert only</b>. Unicity constraints apply and insert fails in case of duplicates.</li>
        <li>The <b>Created By</b> and <b>Updated By</b> information is replaced by the user doing the restore.</li>
        <li>Other information remains unchanged and is inserted as defined in the backup files, including meta-data: <b>Id</b>, <b>Created Date</b>, <b>Updated Date</b>.</li>
      </ul>
    </p>

    <!-- Input of type file -->
    <div v-if="showFileTable" class="input-group form-group w-25">
      <div class="custom-file">
        <input type="file" id="selectedZipFile" class="custom-file-input" accept=".zip" ref="selectedZipFile" v-on:change="previewZipFile" />
        <label class="custom-file-label" for="selectedZipFile">Choose file...</label>
      </div>
    </div>

    <!-- Files -->
    <table v-if="showFileTable" class="table table-striped table-dark table-hover table-borderless">
      <thead>
        <tr>
          <th>#</th>
          <th>File</th>
          <th>Size</th>
          <th>Nb Rows Success</th>
          <th>Nb Rows Error</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="file in files" v-bind:key="file.id">
          <td>{{ file.id + 1 }}</td>
          <td>{{ file.name }}</td>
          <td>{{ file.size }}</td>
          <td>{{ file.nbRows }}</td>
          <td>{{ file.nbRowsError }}</td>
          <td>
            <span class="badge" v-bind:class="[file.statusClass]">
              {{ file.status }}
              <span v-show="['Uploading', 'Unpacking'].includes(file.status)" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            </span>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Download package -->
    <restore-button-upload v-if="showUploadButton" v-bind:files="files" v-bind:packageType="packageType"></restore-button-upload>
  </div>
</template>

<script>
import Mixins from "../utils/Mixins.vue";
import RestoreButtonUpload from "./RestoreButtonUpload.vue";

export default {
  mixins: [Mixins],
  components: {
    "restore-button-upload": RestoreButtonUpload
  },
  data: function() {
    return {
      packageType: "",
      files: []
    };
  },
  computed: {
    isReadOnly() {
      let roles = ["admin"];
      return !roles.includes(this.$store.state.currentUser.role);
    },
    showFileTable() {
      return ["definitionData", "listData"].includes(this.packageType);
    },
    showUploadButton() {
      return this.files.length > 0;
    }
  },
  methods: {
    formatSize(size) {
      // Format file size to human readable format
      if (size > 1024 * 1024 * 1024 * 1024) {
        return (size / 1024 / 1024 / 1024 / 1024).toFixed(2) + " Tb";
      } else if (size > 1024 * 1024 * 1024) {
        return (size / 1024 / 1024 / 1024).toFixed(2) + " Gb";
      } else if (size > 1024 * 1024) {
        return (size / 1024 / 1024).toFixed(2) + " Mb";
      } else if (size > 1024) {
        return (size / 1024).toFixed(2) + " Kb";
      }
      return size.toString() + " bytes";
    },
    previewZipFile() {
      this.files = [];
      let JSZip = require("jszip");
      let papa = require("papaparse");
      let zip = new JSZip();

      // Read zip package
      zip.loadAsync(this.$refs.selectedZipFile.files[0]).then(
        function(zipContent) {
          // For each file in zip package convert zip object to file object blob
          let i = 0;
          for (let key in zipContent.files) {
            //for (const [key, value] of Object.entries(zipContent.files)) {
            zipContent
              .file(key)
              .async("blob")
              .then(
                function(blob) {
                  // Convert blob to file object
                  let fileObject = new File([blob], key);

                  // Fetch metadata
                  let file = {
                    id: i,
                    name: key,
                    size: this.formatSize(fileObject["size"]),
                    status: "Unpacking",
                    statusClass: "badge-info",
                    nbRows: ""
                  };
                  this.files.push(file);

                  // Convert CSV to JSON
                  if (this.packageType == "definitionData" && ["sys_user_group.csv", "sys_list.csv", "sys_attribute.csv"].includes(key)) {
                    papa.parse(fileObject, {
                      header: true,
                      transformHeader: this.getGraphQlName,
                      complete: this.prepareHttpRequest
                    });
                    i = i + 1;
                  } else if (this.packageType == "listData") {
                    papa.parse(fileObject, {
                      header: true,
                      transformHeader: this.getGraphQlName,
                      complete: this.prepareHttpRequest
                    });
                    i = i + 1;
                  } else {
                    this.files[i].status = "Invalid file name";
                    this.files[i].statusClass = "badge-danger";
                    i = i + 1;
                  }
                }.bind(this)
              );
          }
        }.bind(this)
      );
    },
    buildPayloadUserGroup(results, graphQlListName, graphQlCreateMutation, fileIndex) {
      let lodash = require("lodash");
      let payloadBatch = results.data.map(function(row) {
        // Build create mutation payload if row is not empty
        if (!lodash.isEmpty(row)) {
          // Format columns
          row["id"] = parseInt(row["id"]);

          // Build create mutation
          let payload = {};
          let variables = {};
          variables[graphQlListName] = row;
          payload = {
            query: graphQlCreateMutation,
            variables: variables
          };
          return payload;
        }
      });

      // Update file status in table
      this.files[fileIndex]["payloadBatch"] = payloadBatch;
      this.files[fileIndex]["status"] = "Ready";
      this.files[fileIndex]["statusClass"] = "badge-secondary";
    },
    buildPayloadList(results, graphQlListName, graphQlCreateMutation, fileIndex) {
      let lodash = require("lodash");
      let payloadBatch = results.data.map(function(row) {
        // Build create mutation payload if row is not empty
        if (!lodash.isEmpty(row)) {
          // Format columns
          row["id"] = parseInt(row["id"]);
          row["userGroupId"] = parseInt(row["userGroupId"]);

          // Build create mutation
          let payload = {};
          let variables = {};
          variables[graphQlListName] = row;
          payload = {
            query: graphQlCreateMutation,
            variables: variables
          };
          return payload;
        }
      });

      // Update file status in table
      this.files[fileIndex]["payloadBatch"] = payloadBatch;
      this.files[fileIndex]["status"] = "Ready";
      this.files[fileIndex]["statusClass"] = "badge-secondary";
    },
    buildPayloadAttribute(results, graphQlListName, graphQlCreateMutation, fileIndex) {
      let lodash = require("lodash");
      let payloadBatch = results.data.map(function(row) {
        // Build create mutation payload if row is not empty
        if (!lodash.isEmpty(row)) {
          // Format columns
          row["id"] = parseInt(row["id"]);
          row["order"] = parseInt(row["order"]);
          row["flagUnique"] = row["flagUnique"].toLowerCase() == "true";
          row["flagMandatory"] = row["flagMandatory"].toLowerCase() == "true";
          row["userGroupId"] = parseInt(row["userGroupId"]);
          row["listId"] = parseInt(row["listId"]);
          row["dataTypeId"] = parseInt(row["dataTypeId"]);

          // Description
          if (row["description"] == "") {
            delete row["description"];
          }

          // Default value
          if (row["defaultValue"] != "") {
            if (row["linkedAttributeId"] != "") {
              row["defaultValue"] = parseInt(row["defaultValue"]);
            }
          } else {
            delete row["defaultValue"];
          }

          // Linked attribute
          if (row["linkedAttributeId"] != "") {
            row["linkedAttributeId"] = parseInt(row["linkedAttributeId"]);
          } else {
            delete row["linkedAttributeId"];
          }

          // Build create mutation
          let payload = {};
          let variables = {};
          variables[graphQlListName] = row;
          payload = {
            query: graphQlCreateMutation,
            variables: variables
          };
          return payload;
        }
      });

      // Update file status in table
      this.files[fileIndex]["payloadBatch"] = payloadBatch;
      this.files[fileIndex]["status"] = "Ready";
      this.files[fileIndex]["statusClass"] = "badge-secondary";
    },
    buildPayloadValue(results, graphQlListName, graphQlCreateMutation, fileIndex, tableName) {
      // Method to get the attributes of a list to validate CSV file header
      let lodash = require("lodash");
      let payload = {
        query: this.$store.state.queryRestoreGetList,
        variables: {
          tableName: tableName
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
            // Fetch list of attributes to valide CSV file header
            let attributes = response.data.data.allSysLists.nodes;
            if (attributes.length > 0) {
              let graphQlAttributeNames = attributes[0].sysAttributesByListId.nodes.map(
                function(attribute) {
                  attribute = {
                    graphQlAttributeName: this.getGraphQlName(attribute.columnName),
                    dataTypeId: attribute.sysDataTypeByDataTypeId.id
                  };
                  return attribute;
                }.bind(this)
              );

              // Add standard attributes
              graphQlAttributeNames.push({ graphQlAttributeName: "id", dataTypeId: 5 });
              graphQlAttributeNames.push({ graphQlAttributeName: "createdDate", dataTypeId: 8 });
              graphQlAttributeNames.push({ graphQlAttributeName: "updatedDate", dataTypeId: 8 });

              let payloadBatch = results.data.map(
                function(row) {
                  // Build create mutation payload if row is not empty
                  if (!lodash.isEmpty(row)) {
                    // Loop over each column of the record
                    for (let key in row) {
                      // Drop invalid column if it's not in list attributes definition
                      let i = lodash.findIndex(graphQlAttributeNames, function(obj) {
                        return obj.graphQlAttributeName == key;
                      });

                      if (i == -1) {
                        delete row[key];
                      } else {
                        // Format column value according to attribute data type
                        let dataTypeId = graphQlAttributeNames[i]["dataTypeId"];
                        // Format to boolean
                        if ([2].includes(dataTypeId)) {
                          row[key] = row[key].toLowerCase() == "true";
                        }
                        // Format to bigint, integer, smallint
                        else if ([1, 5, 7].includes(dataTypeId)) {
                          row[key] = parseInt(row[key]);
                        }
                        // Format to real
                        else if ([6].includes(dataTypeId)) {
                          row[key] = parseFloat(row[key]);
                        }
                      }
                    }

                    // Build create mutation payload if row is not empty
                    let payload = {};
                    let variables = {};
                    variables[graphQlListName] = row;
                    payload = {
                      query: graphQlCreateMutation,
                      variables: variables
                    };

                    return payload;
                  }
                }.bind(this)
              );

              // Update file status in table
              this.files[fileIndex]["payloadBatch"] = payloadBatch;
              this.files[fileIndex]["status"] = "Ready";
              this.files[fileIndex]["statusClass"] = "badge-secondary";
            } else {
              // Update file status in table
              this.files[fileIndex]["status"] = "List does not exist";
              this.files[fileIndex]["statusClass"] = "badge-danger";
            }
          }
        }.bind(this),
        // Error callback
        function(response) {
          this.displayError(response);
        }
      );
    },
    prepareHttpRequest(results, file) {
      //Find file index in files list
      let lodash = require("lodash");
      let fileIndex = lodash.findIndex(this.files, function(obj) {
        return obj.name == file.name;
      });

      // Build GraphQL create mutation
      let tableName = file.name.slice(0, -4); // Remove file extension .csv
      let graphQlListName = this.getGraphQlName(tableName, "singular");
      let graphQlListNameUpperCase = this.getGraphQlName(tableName, "singular", true);
      let graphQlCreateMutation = this.$store.state.mutationCreateValue.replace(/<GraphQlListName>/g, graphQlListNameUpperCase);
      graphQlCreateMutation = graphQlCreateMutation.replace(/<graphQlListName>/g, graphQlListName);

      // Loop over each record of the file data to prepare payload
      if (this.packageType == "definitionData") {
        if (file.name == "sys_user_group.csv") {
          this.buildPayloadUserGroup(results, graphQlListName, graphQlCreateMutation, fileIndex);
        } else if (file.name == "sys_list.csv") {
          this.buildPayloadList(results, graphQlListName, graphQlCreateMutation, fileIndex);
        } else if (file.name == "sys_attribute.csv") {
          this.buildPayloadAttribute(results, graphQlListName, graphQlCreateMutation, fileIndex);
        } else {
          // Error
          this.displayError("Definition data must include one of the following files: sys_user_group.csv, sys_list.csv, sys_attribute.csv");
        }
      } else if (this.packageType == "listData") {
        // Fetch attributes of a list to prepare payload
        this.buildPayloadValue(results, graphQlListName, graphQlCreateMutation, fileIndex, tableName);
      }
    }
  }
};
</script>
