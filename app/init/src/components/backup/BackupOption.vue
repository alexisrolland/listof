<template>
  <div>
    <p>
      Select data to be added to the backup package.

      <!-- User groups -->
      <div class="custom-control custom-switch">
        <input
          id="userGroup"
          class="custom-control-input"
          type="checkbox"
          value="false"
          v-bind:disabled="isReadOnly"
          v-bind:readonly="isReadOnly"
          v-model="backup.userGroup"
        />
        <label class="custom-control-label" for="userGroup">User groups (all user groups).</label>
      </div>

      <!-- Lists definitions -->
      <div class="custom-control custom-switch">
        <input
          id="listDefinition"
          class="custom-control-input"
          type="checkbox"
          value="false"
          v-bind:disabled="isReadOnly"
          v-bind:readonly="isReadOnly"
          v-model="backup.listDefinition"
        />
        <label class="custom-control-label" for="listDefinition">Lists definitions (all lists definitions with their attributes).</label>
      </div>

      <!-- Lists data -->
      <div class="custom-control custom-switch">
        <input
          id="listData"
          class="custom-control-input"
          type="checkbox"
          value="false"
          v-bind:disabled="isReadOnly"
          v-bind:readonly="isReadOnly"
          v-model="backup.listData"
        />
        <label class="custom-control-label" for="listData">Lists data (all values of all lists).</label>
      </div>
    </p>

    <!-- Download package -->
    <backup-button-download v-bind:backup="backup"></backup-button-download>
  </div>
</template>

<script>
import BackupButtonDownload from "./BackupButtonDownload.vue";

export default {
  components: {
    "backup-button-download": BackupButtonDownload
  },
  data: function() {
    return {
      backup: {
        listDefinition: false,
        listData: false,
        userGroup: false
      }
    };
  },
  computed: {
    isReadOnly() {
      let roles = ["admin"];
      return !roles.includes(this.$store.state.currentUser.role);
    }
  },
  methods: {
    setSortAttribute(attribute) {
      this.$emit("sortAttribute", attribute);
    }
  }
};
</script>
