Vue.component('form-list', {
    template: `
        <div>
            <div class="form-group row">
                <label for="listName" class="col-sm-2 col-form-label">
                    Name:
                </label>
                <input
                    id="listName"
                    type="text"
                    class="form-control form-control-sm col-sm"
                    placeholder="List name"
                    v-model="list.name" />
            </div>

            <div class="form-group row">
                <label for="listDescription" class="col-sm-2 col-form-label">
                    Description:
                </label>
                <textarea 
                    id="listDescription" 
                    class="form-control form-control-sm col-sm"
                    placeholder="List description"
                    rows="3"
                    v-model="list.description" />
            </div>

            <!-- Button Menu -->
            <button type="submit" class="btn btn-success btn-sm" v-on:click="saveList(list.id)">
                Save
            </button>
            <button type="submit" class="btn btn-danger btn-sm">
                Delete
            </button>
            <button type="button" class="btn btn-secondary btn-sm">
                Cancel
            </button>
        </div>
    `,
    data: function () {
        return {
            'list': {},
            'queryGetList': `query getList($id: Int!) {
                sysListById(id: $id) {
                    id
                    name
                    description
                }
            }`,
            'mutationCreateList': `mutation createList($sysList: SysListInput!) {
                createSysList(input: {sysList: $sysList}) {
                    sysList {
                        id
                        name
                        description
                    }
                }
            }`
        }
    },
    mounted: function () {
        // Get list Id from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const listId = parseInt(urlParams.get('listId'));
        if (!isNaN(listId)) {
            this.getList(listId);
        }
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
                    }
                }
            );
        },
        saveList(listId) {
            // Method to create or update a list
            // Create a new list
            if (isNaN(listId)) {
                payload = {
                    'query': this.mutationCreateList,
                    'variables': {
                        'sysList': {
                            'name': this.list.name,
                            'description': this.list.description
                        }
                    }
                };
                this.$http.post(Vue.prototype.$graphqlUrl, payload).then (
                    function(response){
                        if(response.status == "200"){
                            this.list = response.data.data.createSysList;
                        }
                    }
                );
            }
            // Update an existing list
            else {
                alert('update list');
            }
        }
    }
});