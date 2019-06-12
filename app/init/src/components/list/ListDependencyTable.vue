<template>
  <div>
    <h1 class="mt-5">Dependencies</h1>
    <p>Lists which have attributes linked to {{ list.name }}.</p>

    <table class="table table-striped table-dark table-hover table-borderless">
      <thead>
        <tr>
          <th scope="col">
            List
          </th>
          <th scope="col">
            Attribute
          </th>
        </tr>
      </thead>
      <tbody v-if="dependencies">
        <tr
          v-for="dependency in dependencies"
          v-bind:key="dependency.attributeId"
        >
          <td>
            <router-link v-bind:to="dependency.listId.toString()">
              {{ dependency.listName }}
            </router-link>
          </td>
          <td>
            <router-link
              v-bind:to="
                dependency.listId + '/attributes/' + dependency.attributeId
              "
            >
              {{ dependency.attributeName }}
            </router-link>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import flatten from "lodash/flatten";

export default {
  props: {
    list: {}
  },
  created: function() {},
  computed: {
    dependencies() {
      const attributes = this.list.sysAttributesByListId.nodes;
      const nestedList = attributes.map(attribute => {
        const linkedAttributes =
          attribute.sysAttributesByLinkedAttributeId.nodes;
        return linkedAttributes.map(linkedAttribute => ({
          attributeId: linkedAttribute.id,
          attributeName: linkedAttribute.name,
          listId: linkedAttribute.sysListByListId.id,
          listName: linkedAttribute.sysListByListId.name
        }));
      });
      return flatten(nestedList);
    }
  }
};
</script>
