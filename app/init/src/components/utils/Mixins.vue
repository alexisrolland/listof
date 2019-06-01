<script>

export default {
    methods: {
        displayError(response, batchErrors = null) {
            // Method to display error message
            this.$store.state.errorObject.flag = true;
            // PostGraphile errors return status 200 with error message
            if (response.status == 200) {
                // Batch queries
                if (batchErrors) { this.$store.state.errorObject.message = batchErrors; }
                // Single query
                else { this.$store.state.errorObject.message = response.data.errors[0].message; }
            }
            // Nginx errors return a proper error status code
            else { this.$store.state.errorObject.message = response.bodyText; }
        },
        getGraphQlName(name, number = null, upperFirst = false) {
            // Method to compute GraphQL queries, mutations and fields names based on tables and columns names
            // Use case is to transform the input: my_list
            // In an output such as: allMyLists, myListById, etc...

            let inflection = require('inflection');
            let lodash = require('lodash');

            // Apply number
            if (number == 'singular') {
                name = inflection.singularize(name);  // Example: my_lists > my_list
            } else if (number == 'plural') {
                name = inflection.pluralize(name);  // Example: my_list > my_lists
            }

            // Camel case
            name = lodash.camelCase(name);

            // Upper case first letter
            if (upperFirst == true) {
                name = lodash.upperFirst(name);
            }

            return name;
        }
    }
}
</script>

