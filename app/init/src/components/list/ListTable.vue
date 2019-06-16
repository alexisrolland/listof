<template>
  <table class="table table-striped table-dark table-hover table-borderless">
    <thead>
      <tr>
        <th scope="col">
          Name
          <table-sort v-bind:columnName="'name'" v-bind:sortAttribute="sortAttribute" v-on:sortAttribute="setSortAttribute"></table-sort>
        </th>
        <th scope="col">
          Description
          <table-sort v-bind:columnName="'description'" v-bind:sortAttribute="sortAttribute" v-on:sortAttribute="setSortAttribute"></table-sort>
        </th>
        <th scope="col">
          User Group
        </th>
        <th scope="col">
          Actions
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="list in lists" v-bind:key="list.id">
        <td>
          <router-link v-bind:to="'lists/' + list.id + '/values'">
            {{ list.name }}
          </router-link>
        </td>
        <td>
          {{ list.description.substring(0, 70) + "..." }}
        </td>
        <td>
          {{ list.sysUserGroupByUserGroupId.name }}
        </td>
        <td>
          <router-link v-if="showEditValues" class="badge badge-secondary" v-bind:to="'lists/' + list.id + '/values'">
            Edit Values
          </router-link>
          <router-link v-if="showEditList" class="badge badge-secondary" v-bind:to="'lists/' + list.id">
            Edit List
          </router-link>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import TableSort from "../utils/TableSort.vue";

export default {
  components: {
    "table-sort": TableSort
  },
  props: {
    lists: Array,
    sortAttribute: Object
  },
  computed: {
    showEditValues() {
      let roles = ["admin", "advanced", "standard"];
      return roles.includes(this.$store.state.currentUser.role);
    },
    showEditList() {
      let roles = ["admin", "advanced"];
      return roles.includes(this.$store.state.currentUser.role);
    }
  },
  methods: {
    setSortAttribute(attribute) {
      this.$emit("sortAttribute", attribute);
    }
  }
};
</script>
