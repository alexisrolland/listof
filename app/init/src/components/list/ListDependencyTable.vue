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
        <tr v-for="dependency in dependencies" v-bind:key="dependency.attributeId">
          <td>
            <router-link v-bind:to="dependency.listId.toString()">
              {{ dependency.listName }}
            </router-link>
          </td>
          <td>
            <router-link v-bind:to="dependency.listId + '/attributes/' + dependency.attributeId">
              {{ dependency.attributeName }}
            </router-link>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    list: {}
  },
  created: function() {},
  computed: {
    dependencies() {
      let dependencies = [];
      for (let i = 0; i < this.list.sysAttributesByListId.nodes.length; i++) {
        for (let j = 0; j < this.list.sysAttributesByListId.nodes[i]["sysAttributesByLinkedAttributeId"]["nodes"].length; j++) {
          let dependency = {
            attributeId: this.list.sysAttributesByListId.nodes[i]["sysAttributesByLinkedAttributeId"]["nodes"][j]["id"],
            attributeName: this.list.sysAttributesByListId.nodes[i]["sysAttributesByLinkedAttributeId"]["nodes"][j]["name"],
            listId: this.list.sysAttributesByListId.nodes[i]["sysAttributesByLinkedAttributeId"]["nodes"][j]["sysListByListId"]["id"],
            listName: this.list.sysAttributesByListId.nodes[i]["sysAttributesByLinkedAttributeId"]["nodes"][j]["sysListByListId"]["name"]
          };
          dependencies.push(dependency);
        }
      }
      return dependencies;
    }
  }
};
</script>
