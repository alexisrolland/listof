<template>
  <nav class="bg-dark text-light" aria-label="Pages">
    <ul class="pagination">
      <li v-for="page in pages" v-bind:key="page.pageNum" class="page-item">
        <a
          class="page-link text-light"
          v-bind:class="{ active: page.isActive }"
          v-on:click="goToPage(page)"
          >{{ page.pageNum }}</a
        >
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  props: {
    totalCount: Number,
    currentPage: Object
  },
  data: function() {
    return {
      nbItems: 10
    };
  },
  computed: {
    pages() {
      let nbPages = Math.ceil(this.totalCount / this.nbItems);
      return Array.from({ length: nbPages }).map((_, index) => {
        const page = {
          pageNum: index + 1,
          offset: index * this.nbItems,
          nbItems: this.nbItems
        };
        if (this.currentPage.pageNum == index + 1) {
          page["isActive"] = true;
        }
        return page;
      });
    }
  },
  methods: {
    goToPage(page) {
      this.$emit("goToPage", page);
    }
  }
};
</script>

<style>
/*Style for pagination*/
.page-link,
.page-link:hover {
  background-color: #2c3034;
  border-color: #343a40;
}
.active {
  background-color: #6c757d;
}
.active:hover {
  background-color: #6c757d;
}
</style>
