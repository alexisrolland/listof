<template>
  <div class="col-8">
    <h1 class="mt-5">Backup</h1>
    <backup-option></backup-option>

    <h1 class="mt-5">Restore</h1>
    <p>
      In progress
    </p>
  </div>
</template>

<script>
import BackupOption from "./backup/BackupOption.vue";

export default {
  components: {
    "backup-option": BackupOption
  }
};
</script>