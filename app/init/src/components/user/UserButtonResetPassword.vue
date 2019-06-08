<template>
  <button
    v-if="show"
    type="button"
    class="btn btn-secondary"
    v-on:click="resetPassword"
  >
    Reset Password
  </button>
</template>

<script>
export default {
  props: {
    userId: String
  },
  methods: {
    resetPassword() {
      this.$emit("resetPassword", true);
    }
  },
  computed: {
    show() {
      return this.userId != "new";
    }
  }
};
</script>
