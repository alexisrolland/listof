<template>
  <div>
    <h1 class="mt-5">Edit User Group</h1>

    <form>
      <div class="form-row">
        <div class="col-md-8">
          <!-- User Form -->
          <div class="form-group required">
            <label for="userGroupName" class="col-form-label">
              Name:
            </label>
            <input class="form-control col-sm" id="userGroupName" type="text" required="required" placeholder="Type user group name" v-model="userGroup.name" />
          </div>

          <!-- Button Menu -->
          <div>
            <user-group-button-save v-bind:userGroup="userGroup"> </user-group-button-save>

            <user-group-button-close> </user-group-button-close>
          </div>
        </div>
        <div class="col-md-4">
          <user-group-meta-data
            v-if="userGroup.id"
            v-bind:id="userGroup.id"
            v-bind:createdDate="userGroup.createdDate"
            v-bind:createdBy="userGroup.sysUserByCreatedById.email"
            v-bind:updatedDate="userGroup.updatedDate"
            v-bind:updatedBy="userGroup.sysUserByUpdatedById.email"
          ></user-group-meta-data>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import UserGroupButtonSave from "./UserGroupButtonSave.vue";
import UserGroupButtonClose from "./UserGroupButtonClose.vue";
import MetaDataCard from "../utils/MetaDataCard.vue";
import Mixins from "../utils/Mixins.vue";

export default {
  mixins: [Mixins],
  components: {
    "user-group-meta-data": MetaDataCard,
    "user-group-button-save": UserGroupButtonSave,
    "user-group-button-close": UserGroupButtonClose
  },
  data: function() {
    return {
      userGroup: {}
    };
  },
  computed: {
    userGroupId() {
      return this.$route.params.userGroupId;
    }
  },
  created: function() {
    // If userGroupId != new then get data for existing user group
    if (this.userGroupId != "new") {
      let payload = {
        query: this.$store.state.queryGetUserGroup,
        variables: {
          id: parseInt(this.userGroupId)
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
            this.userGroup = response.data.data.sysUserGroupById;
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
