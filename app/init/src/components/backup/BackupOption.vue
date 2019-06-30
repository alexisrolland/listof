<template>
  <div>
    <h1 class="mt-5">Backup</h1>
    <p>
      Select data to backup. A zip package will be generated for each selected option.
    </p>

    <!-- Definition data (user groups, lists, attributes)-->
    <div class="custom-control custom-switch">
      <input
        id="definitionData"
        class="custom-control-input"
        type="checkbox"
        value="false"
        v-bind:disabled="isReadOnly"
        v-bind:readonly="isReadOnly"
        v-model="backup.definitionData"
      />
      <label class="custom-control-label" for="definitionData">Definition data (user groups, lists definition and their attributes)</label>
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
      <label class="custom-control-label" for="listData">Lists data (all values of all lists)</label>
    </div>

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
        definitionData: false,
        listData: false
      }
    };
  },
  computed: {
    isReadOnly() {
      let roles = ["admin"];
      return !roles.includes(this.$store.state.currentUser.role);
    }
  }
};
</script>
