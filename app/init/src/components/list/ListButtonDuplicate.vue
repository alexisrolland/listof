<template>
  <span>
    <button v-if="show" type="button" class="btn btn-secondary" data-toggle="modal" data-target="#ListModalBoxDuplicate">
      Duplicate List
    </button>

    <!-- Modal box to duplicate list -->
    <list-modal-box-duplicate v-bind:list="list"> </list-modal-box-duplicate>
  </span>
</template>

<script>
import ListModalBoxDuplicate from "./ListModalBoxDuplicate.vue";

export default {
  components: {
    "list-modal-box-duplicate": ListModalBoxDuplicate
  },
  props: {
    list: Object
  },
  computed: {
    show() {
      let roles = ["admin", "advanced"];
      return roles.includes(this.$store.state.currentUser.role);
    }
  }
};
</script>
