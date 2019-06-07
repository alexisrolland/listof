<template>
  <div class="col-8">
    <value-form></value-form>
  </div>
</template>

<script>
import ValueForm from "./value/ValueForm.vue";

export default {
  components: {
    "value-form": ValueForm
  }
};
</script>
