<template>
  <div class="mt-5">
    <!-- Search bar -->
    <input
      class="form-control form-control-lg mb-4"
      type="search"
      aria-label="Search"
      placeholder="Search lists"
      v-model="searchKeyword"
      v-on:keyup.enter="search"
    />

    <!-- Lists table -->
    <list-table v-bind:lists="lists" v-bind:sortAttribute="sortAttribute" v-on:sortAttribute="setSortAttribute"></list-table>

    <!-- Lists pagination -->
    <list-pagination v-if="showPagination" v-bind:totalCount="nbLists" v-bind:currentPage="currentPage" v-on:goToPage="getAllLists"></list-pagination>
  </div>
</template>

<script>
import ListTable from "./ListTable.vue";
import Pagination from "../utils/Pagination.vue";
import Mixins from "../utils/Mixins.vue";

export default {
  mixins: [Mixins],
  components: {
    "list-table": ListTable,
    "list-pagination": Pagination
  },
  data: function() {
    return {
      searchKeyword: null,
      lists: [],
      nbLists: null,
      showPagination: true,
      currentPage: {
        pageNum: 1,
        offset: 0,
        nbItems: 10,
        isActive: true
      },
      sortAttribute: {
        columnName: "name",
        sortOrder: "asc"
      }
    };
  },
  methods: {
    getAllLists(page) {
      let lodash = require("lodash");
      let payload = {
        query: this.$store.state.queryGetAllLists,
        variables: {
          first: page.nbItems,
          offset: page.offset,
          orderBy: [lodash.toUpper(this.sortAttribute.columnName + "_" + this.sortAttribute.sortOrder)]
        }
      };
      let headers = {};
      if (this.$session.exists()) {
        headers = { Authorization: "Bearer " + this.$session.get("jwt") };
      }
      this.$http.post(this.$store.state.graphqlUrl, payload, { headers }).then(
        function(response) {
          if (response.data.errors) {
            this.displayError(response);
          } else {
            this.lists = response.data.data.allSysLists.nodes;
            this.nbLists = response.data.data.allSysLists.totalCount;

            // Set current page
            this.currentPage = {
              pageNum: page.pageNum,
              offset: page.offset,
              nbItems: page.nbItems,
              isActive: page.isActive
            };
          }
        },
        // Error callback
        function(response) {
          this.displayError(response);
        }
      );
    },
    search() {
      // Search list based on keywords
      // If keyword is empty, use GraphQL native query to benefit from pagination
      if (this.searchKeyword == "" || this.searchKeyword == null) {
        // Show pagination since regular query provide pagination feature
        this.showPagination = true;
        this.getAllLists(this.currentPage);
      } else {
        // Do not show pagination since custom search feature does not include pagination
        this.showPagination = false;
        let payload = {
          query: this.$store.state.mutationSearchList,
          variables: {
            searchKeyword: this.searchKeyword,
            sortAttribute: this.sortAttribute.columnName,
            sortOrder: this.sortAttribute.sortOrder
          }
        };
        let headers = {};
        if (this.$session.exists()) {
          headers = { Authorization: "Bearer " + this.$session.get("jwt") };
        }
        this.$http.post(this.$store.state.graphqlUrl, payload, { headers }).then(
          function(response) {
            if (response.data.errors) {
              this.displayError(response);
            } else {
              this.lists = response.data.data.searchList.sysLists;
            }
          },
          // Error callback
          function(response) {
            this.displayError(response);
          }
        );
      }
    },
    setSortAttribute(attribute) {
      this.sortAttribute = {
        columnName: attribute.columnName,
        sortOrder: attribute.sortOrder
      };
      this.search();
    }
  },
  created: function() {
    this.getAllLists(this.currentPage);
  }
};
</script>
