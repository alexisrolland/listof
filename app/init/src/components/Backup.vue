<template>
  <div class="col-8">
    <backup-option></backup-option>
    <restore-form></restore-form>
  </div>
</template>

<script>
import BackupOption from "./backup/BackupOption.vue";
import RestoreForm from "./backup/RestoreForm.vue";

export default {
  components: {
    "backup-option": BackupOption,
    "restore-form": RestoreForm
  }
};
</script>