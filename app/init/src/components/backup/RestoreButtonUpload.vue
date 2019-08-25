<template>
  <button type="button" class="btn btn-success mb-4" v-on:click="startUpload">
    Upload Backup Package
  </button>
</template>

<script>
import findIndex from "lodash/findIndex";
import Mixins from "../utils/Mixins.vue";

export default {
  mixins: [Mixins],
  props: {
    packageType: String,
    files: Array
  },
  methods: {
    uploadUserGroup(headers, userGroupIndex, listIndex, attributeIndex) {
      // Update badge info to Uploading
      this.files[userGroupIndex]["status"] = "Uploading";
      this.files[userGroupIndex]["statusClass"] = "badge-info";

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
            this.resetIdSequence("sys_user_group");

            // Refresh current user groups for current user
            this.refreshCurrentUserGroups();

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
      // Update badge info to Uploading
      this.files[listIndex]["status"] = "Uploading";
      this.files[listIndex]["statusClass"] = "badge-info";

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

            // Reset Id sequence in sys_list table
            this.resetIdSequence("sys_list");

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
      // Update badge info to Uploading
      this.files[attributeIndex]["status"] = "Uploading";
      this.files[attributeIndex]["statusClass"] = "badge-info";

      // Use multiple mutations in one single operation to ensure sequential execution of mutations
      // Query batching could not be used as it triggered some deadlock due to parallelism of mutations executions
      let graphQlCreateMutation = `mutation createAttributes { <mutationCreateAttribute> }`;
      graphQlCreateMutation = graphQlCreateMutation.replace(/<mutationCreateAttribute>/g, this.files[attributeIndex].payloadBatch.join(" "));
      let payload = { query: graphQlCreateMutation };

      this.$http.post(this.$store.state.graphqlUrl, payload, { headers }).then(
        function(response) {
          if (response.data.errors) {
            this.files[attributeIndex]["status"] = "Error";
            this.files[attributeIndex]["statusClass"] = "badge-danger";
            this.files[attributeIndex]["nbRows"] = Object.keys(response.data.data).length - response.data.errors.length;
            this.files[attributeIndex]["nbRowsError"] = response.data.errors.length;
            this.displayError(response, response.data.errors);
          } else {
            this.files[attributeIndex]["status"] = "Complete";
            this.files[attributeIndex]["statusClass"] = "badge-success";
            this.files[attributeIndex]["nbRows"] = Object.keys(response.data.data).length;
            this.files[attributeIndex]["nbRowsError"] = 0;

            // Reset Id sequence in sys_attribute table
            this.resetIdSequence("sys_attribute");
          }
        },
        // Error callback
        function(response) {
          this.displayError(response);
        }
      );
    },
    uploadValue(headers) {
      // For each file execute http request one after each other
      // We use reduce here to ensure files are loaded in order due to referential integrity constraints
      this.files.reduce(
        function(accumulator, file) {
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
                    tableName: file.tableName
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
        }.bind(this),
        this.files[0]
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
        let userGroupIndex = findIndex(this.files, function(file) {
          return file.name == "sys_user_group.csv";
        });
        let listIndex = findIndex(this.files, function(file) {
          return file.name == "sys_list.csv";
        });
        let attributeIndex = findIndex(this.files, function(file) {
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
        // This is not supported yet, listData option is disabled in the UI
        this.uploadValue(headers);
      }
    },
    refreshCurrentUserGroups() {
      // Method to refresh current user's user groups
      let payload = {
        query: this.$store.state.queryGetCurrentUser,
        variables: { email: this.$session.get("email") }
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
            // Prepare list of current user groups
            let memberships = response.data.data.sysUserByEmail.sysUserGroupMembershipsByUserId.nodes;
            let currentUserGroups = [];
            for (let i = 0; i < memberships.length; i++) {
              currentUserGroups.push(memberships[i]["sysUserGroupByUserGroupId"]);
            }

            // Reset current user groups
            this.$session.set("userGroups", currentUserGroups);
            this.$store.state.currentUser.userGroups = currentUserGroups;
          }
        },
        // Error callback
        function(response) {
          this.displayError(response);
        }
      );
    },
    resetIdSequence(table) {
      // Reset Id sequence in table
      let payload = {
        query: this.$store.state.mutationResetIdSequence,
        variables: {
          schema: "base",
          tableName: table
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
