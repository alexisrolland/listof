<template>
  <div>
    <table class="table table-striped table-dark table-hover table-borderless">
      <thead>
        <tr>
          <th>
            Id
            <table-sort v-bind:columnName="'id'" v-bind:sortAttribute="sortAttribute" v-on:sortAttribute="setSortAttribute"></table-sort>
          </th>
          <th v-for="attribute in sortedAttributes" v-bind:key="attribute.id" scope="col">
            {{ attribute.name }}
            <table-sort
              v-if="showTableSort(attribute.linkedAttributeId)"
              v-bind:columnName="attribute.columnName"
              v-bind:sortAttribute="sortAttribute"
              v-on:sortAttribute="setSortAttribute"
            ></table-sort>
          </th>
          <th scope="col">
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="value in values" v-bind:key="value.id">
          <td>
            {{ value.id }}
          </td>
          <td v-for="attribute in sortedAttributes" v-bind:key="attribute.id">
            <!-- If attribute is linked to a list, fetch parent list value -->
            <span v-if="attribute.linkedAttributeId">
              <router-link
                v-if="value[attribute.graphQlAttributeName]"
                v-bind:to="'/lists/' + attribute.sysAttributeByLinkedAttributeId.listId + '/values/' + value[attribute.graphQlAttributeName]"
              >
                {{ value[attribute.graphQlAttributePath][attribute.graphQlLinkedAttributeName] }}
              </router-link>
            </span>
            <span v-else>
              {{ value[attribute.graphQlAttributeName] }}
            </span>
          </td>
          <td>
            <router-link v-if="showEditValue" class="badge badge-secondary" v-bind:to="'values/' + value.id">
              Edit Value
            </router-link>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import TableSort from "../utils/TableSort.vue";

export default {
  components: {
    "table-sort": TableSort
  },
  props: {
    attributes: Array,
    values: Array,
    sortAttribute: Object
  },
  computed: {
    showEditValue() {
      let roles = ["admin", "advanced", "standard"];
      return roles.includes(this.$store.state.currentUser.role);
    },
    sortedAttributes() {
      let lodash = require("lodash");
      return lodash.sortBy(this.attributes, "order");
    }
  },
  methods: {
    showTableSort(linkedAttributeId) {
      if (linkedAttributeId != null) {
        return false;
      } else {
        return true;
      }
    },
    setSortAttribute(attribute) {
      this.$emit("sortAttribute", attribute);
    }
  }
};
</script>

<style>
span.sort {
  cursor: pointer;
  font-size: 0.75rem;
  color: #6c757d;
  background-color: transparent;
}
span.sort:hover {
  color: white;
  background-color: transparent;
}
span.active {
  color: white;
}
</style>
