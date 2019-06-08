<template>
  <span>
    <button
      v-if="show"
      type="button"
      class="btn btn-danger float-right"
      data-toggle="modal"
      data-target="#ModalBoxDelete"
    >
      Delete
    </button>

    <!-- Modal box to confirm deletion -->
    <modal-box-delete
      v-bind:objectType="'value'"
      v-bind:valueId="valueId"
      v-bind:listId="listId"
      v-bind:graphQlListName="graphQlListName"
    >
    </modal-box-delete>
  </span>
</template>

<script>
import ModalBoxDelete from "../utils/ModalBoxDelete.vue";

export default {
  components: {
    "modal-box-delete": ModalBoxDelete
  },
  props: {
    graphQlListName: String, // Example tableName
    valueId: Number,
    listId: Number
  },
  computed: {
    show() {
      let roles = ["admin", "advanced", "standard"];
      return roles.includes(this.$store.state.currentUser.role);
    }
  }
};
</script>
