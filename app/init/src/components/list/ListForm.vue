<template>
  <div>
    <h1 class="mt-5">Edit List</h1>

    <form>
      <div class="form-row">
        <div class="col-md-8">
          <!-- List Form -->
          <div class="form-group required">
            <label for="listName" class="col-form-label">
              Name:
            </label>
            <input
              class="form-control col-sm"
              id="listName"
              type="text"
              required="required"
              v-bind:disabled="isReadOnly"
              v-bind:readonly="isReadOnly"
              placeholder="Type list name"
              v-model="list.name"
            />
          </div>

          <div class="form-group required">
            <label for="listDescription" class="col-form-label">
              Description:
            </label>
            <textarea
              class="form-control col-sm"
              id="listDescription"
              required="true"
              v-bind:disabled="isReadOnly"
              v-bind:readonly="isReadOnly"
              placeholder="Type list description"
              rows="3"
              v-model="list.description"
            />
          </div>

          <list-select-user-group v-model="list.userGroupId" v-on:changeUserGroup="getUserGroup"> </list-select-user-group>

          <!-- Button Menu -->
          <div>
            <list-button-save v-bind:list="list"> </list-button-save>

            <list-button-duplicate v-if="list.id" v-bind:list="list"> </list-button-duplicate>

            <list-button-view-value v-if="list.id" v-bind:listId="list.id"> </list-button-view-value>

            <list-button-close> </list-button-close>

            <list-button-delete v-if="list.id" v-bind:listId="list.id"> </list-button-delete>
          </div>
        </div>
        <div class="col-md-4">
          <list-meta-data
            v-if="list.id"
            v-bind:id="list.id"
            v-bind:createdDate="list.createdDate"
            v-bind:createdBy="list.sysUserByCreatedById.email"
            v-bind:updatedDate="list.updatedDate"
            v-bind:updatedBy="list.sysUserByUpdatedById.email"
          ></list-meta-data>
        </div>
      </div>
    </form>

    <!-- List Attributes -->
    <list-attribute-table v-if="list.id" v-bind:list="list"></list-attribute-table>

    <!-- List Dependencies -->
    <list-dependency-table v-if="list.id" v-bind:list="list"></list-dependency-table>
  </div>
</template>

<script>
import ListSelectUserGroup from "./ListSelectUserGroup.vue";
import ListButtonSave from "./ListButtonSave.vue";
import ListButtonDuplicate from "./ListButtonDuplicate.vue";
import ListButtonViewValue from "./ListButtonViewValue.vue";
import ListButtonClose from "./ListButtonClose.vue";
import ListButtonDelete from "./ListButtonDelete.vue";
import ListAttributeTable from "./ListAttributeTable.vue";
import ListDependencyTable from "./ListDependencyTable.vue";
import MetaDataCard from "../utils/MetaDataCard.vue";
import Mixins from "../utils/Mixins.vue";

export default {
  mixins: [Mixins],
  components: {
    "list-select-user-group": ListSelectUserGroup,
    "list-button-save": ListButtonSave,
    "list-button-duplicate": ListButtonDuplicate,
    "list-button-view-value": ListButtonViewValue,
    "list-button-close": ListButtonClose,
    "list-button-delete": ListButtonDelete,
    "list-attribute-table": ListAttributeTable,
    "list-dependency-table": ListDependencyTable,
    "list-meta-data": MetaDataCard
  },
  data: function() {
    return {
      list: {}
    };
  },
  computed: {
    listId() {
      return this.$route.params.listId;
    },
    isReadOnly() {
      let roles = ["admin", "advanced"];
      return !roles.includes(this.$store.state.currentUser.role);
    }
  },
  created: function() {
    // If listId != new then get data for existing list
    if (this.listId != "new") {
      let payload = {
        query: this.$store.state.queryGetList,
        variables: {
          id: parseInt(this.listId)
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
            this.list = response.data.data.sysListById;
          }
        },
        // Error callback
        function(response) {
          this.displayError(response);
        }
      );
    }
  },
  methods: {
    getUserGroup(value) {
      // Get user group from child component
      if (value != null) {
        this.list["userGroupId"] = value;
      } else {
        this.list["userGroupId"] = null;
      }
    }
  }
};
</script>
