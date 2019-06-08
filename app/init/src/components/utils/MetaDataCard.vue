<template>
  <div class="card text-white bg-secondary small p-2">
    <h5>Meta-data</h5>
    <table>
      <tr>
        <td>Id:</td>
        <td>{{ id }}</td>
      </tr>
      <tr>
        <td>Created Date:</td>
        <td>{{ cleanCreatedDate }}</td>
      </tr>
      <tr>
        <td>Created By:</td>
        <td>{{ createdBy }}</td>
      </tr>
      <tr>
        <td>Updated Date:</td>
        <td>{{ cleanUpdatedDate }}</td>
      </tr>
      <tr>
        <td>Updated By:</td>
        <td>{{ updatedBy }}</td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    id: Number,
    createdDate: String,
    createdBy: String,
    updatedDate: String,
    updatedBy: String
  },
  computed: {
    cleanCreatedDate() {
      return this.createdDate.replace("T", " ").substring(0, 19);
    },
    cleanUpdatedDate() {
      return this.updatedDate.replace("T", " ").substring(0, 19);
    }
  }
};
</script>
