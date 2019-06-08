<template>
  <button type="button" class="btn btn-outline-secondary" v-on:click="close">
    Close
  </button>
</template>

<script>
export default {
  methods: {
    close() {
      this.$router.push({
        name: "view-user-group"
      });
    }
  }
};
</script>
