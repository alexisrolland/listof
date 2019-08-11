<template>
  <div class="col-8">
    <h1 class="mt-5">Lists</h1>
    <list-button-create></list-button-create>
    <list-search></list-search>
  </div>
</template>

<script>
import ListButtonCreate from "./list/ListButtonCreate.vue";
import ListSearch from "./list/ListSearch.vue";

export default {
  components: {
    "list-button-create": ListButtonCreate,
    "list-search": ListSearch
  }
};
</script>