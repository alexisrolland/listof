<template>
  <div class="form-group required">
    <label for="dataType" class="col-form-label">
      Data Type:
    </label>
    <select
      class="form-control col-sm"
      id="dataType"
      required="true"
      v-bind:disabled="isReadOnly"
      v-bind:readonly="isReadOnly"
      v-model="dataTypeId"
      v-on:change="change"
    >
      <option v-for="dataType in dataTypes" v-bind:value="dataType.id" v-bind:key="dataType.id">
        {{ dataType.displayName }}
      </option>
    </select>
  </div>
</template>

<script>
import Mixins from "../utils/Mixins.vue";

export default {
  mixins: [Mixins],
  props: {
    value: Number
  },
  data: function() {
    return {
      dataTypes: [],
      dataTypeId: this.value
    };
  },
  computed: {
    attributeId() {
      return this.$route.params.attributeId;
    },
    isReadOnly() {
      return this.attributeId != "new";
    }
  },
  watch: {
    value() {
      this.dataTypeId = this.value;
    }
  },
  methods: {
    change() {
      this.$emit("changeDataType", this.dataTypeId);
    }
  },
  created: function() {
    // Get data types to populate dropdown list
    // If data types already exist in store, fetch them from there
    if (this.$store.state.dataTypes) {
      this.dataTypes = this.$store.state.dataTypes;
      // If data types do not exist in store, fetch them from API and store them
    } else {
      let payload = { query: this.$store.state.queryGetAllDataTypes };
      let headers = {};
      if (this.$session.exists()) {
        headers = { Authorization: "Bearer " + this.$session.get("jwt") };
      }
      this.$http.post(this.$store.state.graphqlUrl, payload, { headers }).then(
        function(response) {
          if (response.data.errors) {
            this.displayError(response);
          } else {
            this.dataTypes = response.data.data.allSysDataTypes.nodes;
            this.$store.state.dataTypes = this.dataTypes;
          }
        },
        // Error callback
        function(response) {
          this.displayError(response);
        }
      );
    }
  }
};
</script>
