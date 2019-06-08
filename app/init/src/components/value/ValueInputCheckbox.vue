<template>
  <!-- Checkbox input, used for data types boolean (id: 2) -->
  <div class="custom-control custom-switch">
    <input
      class="custom-control-input"
      type="checkbox"
      value=""
      v-bind:id="attribute.id"
      v-bind:required="attribute.flagMandatory"
      v-bind:disabled="isReadOnly"
      v-bind:readonly="isReadOnly"
      v-model="inputValue"
      v-on:change="change"
    />

    <!-- Label -->
    <label class="custom-control-label" v-bind:for="attribute.id">
      {{ attribute.name }}
    </label>

    <!-- Description -->
    <small class="form-text text-muted" v-bind:id="attribute.id">
      {{ attribute.description }}
    </small>
  </div>
</template>

<script>
export default {
  props: {
    attribute: Object,
    value: Boolean
  },
  data: function() {
    return {
      inputValue: this.value
    };
  },
  computed: {
    isReadOnly() {
      let roles = ["admin", "advanced"];
      return !roles.includes(this.$store.state.currentUser.role);
    }
  },
  watch: {
    value(val) {
      this.inputValue = this.value;
    }
  },
  methods: {
    change(val) {
      let attributeValue = {
        attribute: this.attribute.graphQlAttributeName,
        value: this.inputValue
      };
      this.$emit("changeAttributeValue", attributeValue);
    }
  }
};
</script>
