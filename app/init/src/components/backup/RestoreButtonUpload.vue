<template>
  <button type="button" class="btn btn-success mb-4" v-on:click="startUpload">
    Upload Backup Package
  </button>
</template>

<script>
import Mixins from "../utils/Mixins.vue";

export default {
  mixins: [Mixins],
  props: {
    packageType: String,
    files: Array
  },
  methods: {
    uploadUserGroup(headers, userGroupIndex, listIndex, attributeIndex) {
      this.$http.post(this.$store.state.graphqlUrl, this.files[userGroupIndex].payloadBatch, { headers }).then(
        function(response) {
          // Get queries which returned an error
          let errors = response.data.filter(function(obj) {
            return obj.hasOwnProperty("errors");
          });
          if (errors.length > 0) {
            this.files[userGroupIndex]["status"] = "Error";
            this.files[userGroupIndex]["statusClass"] = "badge-danger";
            this.files[userGroupIndex]["nbRows"] = response.data.length - errors.length;
            this.files[userGroupIndex]["nbRowsError"] = errors.length;
            this.displayError(response, errors);
          } else {
            // Update file status
            this.files[userGroupIndex]["status"] = "Complete";
            this.files[userGroupIndex]["statusClass"] = "badge-success";
            this.files[userGroupIndex]["nbRows"] = response.data.length;
            this.files[userGroupIndex]["nbRowsError"] = 0;

            // Reset Id sequence in sys_user_group table
            let payload = {
              query: this.$store.state.mutationResetIdSequence,
              variables: {
                schema: "base",
                tableName: "sys_user_group"
              }
            };
            this.$http.post(this.$store.state.graphqlUrl, payload, { headers }).then(
              function(response) {
                if (response.data.errors) {
                  this.displayError(response);
                }
              },
              // Error callback
              function(response) {
                this.displayError(response);
              }
            );

            // Upload following files
            if (listIndex != -1) {
              this.uploadList(headers, listIndex, attributeIndex);
            } else if (attributeIndex != -1) {
              this.uploadAttribute(headers, attributeIndex);
            } else {
              this.uploadValue(headers);
            }
          }
        },
        // Error callback
        function(response) {
          this.displayError(response);
        }
      );
    },
    uploadList(headers, listIndex, attributeIndex) {
      this.$http.post(this.$store.state.graphqlUrl, this.files[listIndex].payloadBatch, { headers }).then(
        function(response) {
          // Get queries which returned an error
          let errors = response.data.filter(function(obj) {
            return obj.hasOwnProperty("errors");
          });
          if (errors.length > 0) {
            this.files[listIndex]["status"] = "Error";
            this.files[listIndex]["statusClass"] = "badge-danger";
            this.files[listIndex]["nbRows"] = response.data.length - errors.length;
            this.files[listIndex]["nbRowsError"] = errors.length;
            this.displayError(response, errors);
          } else {
            // Update file status
            this.files[listIndex]["status"] = "Complete";
            this.files[listIndex]["statusClass"] = "badge-success";
            this.files[listIndex]["nbRows"] = response.data.length;
            this.files[listIndex]["nbRowsError"] = 0;

            // Reset Id sequence in sys_user_group table
            let payload = {
              query: this.$store.state.mutationResetIdSequence,
              variables: {
                schema: "base",
                tableName: "sys_list"
              }
            };
            this.$http.post(this.$store.state.graphqlUrl, payload, { headers }).then(
              function(response) {
                if (response.data.errors) {
                  this.displayError(response);
                }
              },
              // Error callback
              function(response) {
                this.displayError(response);
              }
            );

            // Upload following files
            if (attributeIndex != -1) {
              this.uploadAttribute(headers, attributeIndex);
            } else {
              this.uploadValue(headers);
            }
          }
        },
        // Error callback
        function(response) {
          this.displayError(response);
        }
      );
    },
    uploadAttribute(headers, attributeIndex) {
      // Use loop instead of query batching to avoid deadlock
      let results = this.files[attributeIndex].payloadBatch.map(
        function(payload) {
          let row = this.$http.post(this.$store.state.graphqlUrl, payload, { headers }).then(
            function(response) {
              let result = {};
              if (response.data.errors) {
                result["status"] = "Error";
                result["errors"] = response.data.errors;
                return result;
              } else {
                result["status"] = "Complete";
                return result;
              }
            },
            // Error callback
            function(response) {
              this.displayError(response);
            }
          );
          return row;
        }.bind(this)
      );

      // Fetch results from promise
      Promise.all(results).then(
        function(row) {
          let errors = row.filter(function(obj) {
            return obj.hasOwnProperty("errors");
          });

          if (errors.length > 0) {
            this.files[attributeIndex]["status"] = "Error";
            this.files[attributeIndex]["statusClass"] = "badge-danger";
            this.files[attributeIndex]["nbRows"] = row.length - errors.length;
            this.files[attributeIndex]["nbRowsError"] = errors.length;
          } else {
            this.files[attributeIndex]["status"] = "Complete";
            this.files[attributeIndex]["statusClass"] = "badge-success";
            this.files[attributeIndex]["nbRows"] = row.length;
            this.files[attributeIndex]["nbRowsError"] = 0;
          }
        }.bind(this)
      );
    },
    uploadValue(headers) {
      this.files.map(
        function(file) {
          this.$http.post(this.$store.state.graphqlUrl, file.payloadBatch, { headers }).then(
            function(response) {
              // Get queries which returned an error
              let errors = response.data.filter(function(obj) {
                return obj.hasOwnProperty("errors");
              });
              if (errors.length > 0) {
                file["status"] = "Error";
                file["statusClass"] = "badge-danger";
                file["nbRows"] = response.data.length - errors.length;
                file["nbRowsError"] = errors.length;
                this.displayError(response, errors);
              } else {
                // Update file status
                file["status"] = "Complete";
                file["statusClass"] = "badge-success";
                file["nbRows"] = response.data.length;
                file["nbRowsError"] = 0;

                // Reset Id sequence in sys_user_group table
                let payload = {
                  query: this.$store.state.mutationResetIdSequence,
                  variables: {
                    schema: "public",
                    tableName: file["name"].slice(0, -4)
                  }
                };
                this.$http.post(this.$store.state.graphqlUrl, payload, { headers }).then(
                  function(response) {
                    if (response.data.errors) {
                      this.displayError(response);
                    }
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
        }.bind(this)
      );
    },
    startUpload() {
      // Prepare http request header
      let headers = {};
      if (this.$session.exists()) {
        headers = { Authorization: "Bearer " + this.$session.get("jwt") };
      }
      if (this.packageType == "definitionData") {
        // Find if list of files contains user group, list, attribute files
        let lodash = require("lodash");
        let userGroupIndex = lodash.findIndex(this.files, function(file) {
          return file.name == "sys_user_group.csv";
        });
        let listIndex = lodash.findIndex(this.files, function(file) {
          return file.name == "sys_list.csv";
        });
        let attributeIndex = lodash.findIndex(this.files, function(file) {
          return file.name == "sys_attribute.csv";
        });

        // Execute http requests in order, user group, list, attribute
        if (userGroupIndex != -1) {
          this.uploadUserGroup(headers, userGroupIndex, listIndex, attributeIndex);
        } else if (listIndex != -1) {
          this.uploadList(headers, listIndex, attributeIndex);
        } else if (attributeIndex != -1) {
          this.uploadAttribute(headers, attributeIndex);
        }
      } else if (this.packageType == "listData") {
        // Execute http requests to load values
        this.uploadValue(headers);
      }
    }
  }
};
</script>
