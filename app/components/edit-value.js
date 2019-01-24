// Application home page
Vue.component('edit-value', {
    template: `
        <div class="col-8">

            <h1 class="mt-5">
                {{ list.name }}
            </h1>

            <p class="lead">
                {{ list.description }}
            </p>

            <!-- Button Menu -->
            <button type="button" class="btn btn-secondary" data-toggle="modal" data-target="#attributeModal">
                Add Value
            </button>

            <button type="button" class="btn btn-secondary" v-on:click="goToEditList(list.id)">
                Edit List
            </button>

            <button type="button" class="btn btn-outline-secondary" v-on:click="goToHome()">
                Close
            </button>

            <!-- List Values -->
            <h1 class="mt-5">Values</h1>

            <table class="table table-striped table-dark table-hover table-borderless">
                <thead>
                    <tr>
                        <th v-for="attribute in attributes" scope="col">
                            {{ attribute.name }}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    
                </tbody>
            </table>
        </div>
    `,
    data: function () {
        return {
            'list': Object,
            'attributes': Array,
            'graphQlQueryName': String,
            'graphQlAttributeNames': Array,
            'values': Object,
            'queryGetList': `query getList($id: Int!) {
                sysListById(id: $id) {
                    id
                    name
                    description
                    tableName
                    sysAttributesByListId {
                        nodes {
                            name
                            columnName
                        }
                    }
                }
            }`,
            'queryGetAllValues': `query getAllValues {
                graphQlQueryName {
                    nodes {
                        id
                        createdDate
                        updatedDate
                        graphQlAttributeNames
                    }
                }
            }`
        }
    },
    mounted: function () {
        // Get list Id from URL parameters
        var urlParams = new URLSearchParams(window.location.search);
        var listId = parseInt(urlParams.get('listId'));

        // Get list meta data
        this.getList(listId);

        // Build query to get list values
        this.buildQuery();
      },
    methods: {
        getList(listId) {
            // Method to get a list
            payload = {
                'query': this.queryGetList,
                'variables': { 'id': listId }
            };
            this.$http.post(Vue.prototype.$graphqlUrl, payload).then (
                function(response){
                    if(response.status == "200"){
                        this.list = response.data.data.sysListById;
                        this.attributes = this.list.sysAttributesByListId.nodes;

                        // Convert list table name to GraphQL name
                        var wordsList = this.list.tableName.split('_');
                        for (var i = 0; i < wordsList.length; i++) {
                            wordsList[i] = wordsList[i].charAt(0).toUpperCase() + wordsList[i].slice(1);
                        };
                        this.graphQlQueryName = 'all' + wordsList.join('') + 's';

                        // Convert attributes column name to GraphQL name
                        this.graphQlAttributeNames = [];
                        for (var i = 0; i < this.attributes.length; i++) {
                            var wordsList = this.attributes[i].columnName.split('_');
                            for (var j = 1; j < wordsList.length; j++) {
                                wordsList[j] = wordsList[j].charAt(0).toUpperCase() + wordsList[j].slice(1);
                            };
                            this.graphQlAttributeNames.push(wordsList.join(''));
                        };

                        // Build GraphQL query
                        this.queryGetAllValues = this.queryGetAllValues.replace('graphQlQueryName', this.graphQlQueryName);
                        this.queryGetAllValues = this.queryGetAllValues.replace('graphQlAttributeNames', this.graphQlAttributeNames.join(' '));
                    };
                }
            );
        },
        getValues() {
            // Method to get a list
            payload = {
                'query': this.queryGetAllValues
            };
            this.$http.post(Vue.prototype.$graphqlUrl, payload).then (
                function(response){
                    if(response.status == "200"){
                        this.list = response.data.data.sysListById;
                        this.attributes = this.list.sysAttributesByListId.nodes;
                    };
                }
            );
        },
        showModal(modalId) {
            $('#' + modalId).modal('show');
        },
        goToEditList(listId) {
            // Method to navigate to edit value page
            window.location.href = 'edit-list.html?listId=' + listId;
        },
        goToHome() {
            // Method to navigate to home page
            window.location.href = 'index.html';
        }
    }
});
