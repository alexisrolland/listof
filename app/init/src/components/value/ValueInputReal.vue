<template>
  <div>
    <!-- Label -->
    <label class="col-form-label" v-bind:for="attribute.id"> {{ attribute.name }}: </label>

    <!-- Number input, used for data type real (id: 6) -->
    <input
      class="form-control col-sm"
      type="number"
      v-bind:id="attribute.id"
      v-bind:required="attribute.flagMandatory"
      v-bind:disabled="isReadOnly"
      v-bind:readonly="isReadOnly"
      v-bind:placeholder="attribute.sysDataTypeByDataTypeId.name"
      v-model="inputValue"
      v-on:change="change"
    />

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
    value: Number
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
        value: parseFloat(this.inputValue)
      };
      this.$emit("changeAttributeValue", attributeValue);
    }
  }
};
</script>
