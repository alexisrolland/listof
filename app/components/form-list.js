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
            <button type="button" class="btn btn-success btn-sm" v-on:click="saveList(list.id)">
                Save
            </button>
            <button type="button" class="btn btn-danger btn-sm">
                Delete
            </button>
            <button type="button" class="btn btn-secondary btn-sm">
                Cancel
            </button>

            <div aria-live="polite" aria-atomic="true" style="position: absolute; top: 0; right: 0; min-width: 300px;">
                <div id="alertToast" class="toast text-dark" style="position: absolute; top: 0; right: 0;">
                    <div class="toast-header">
                        <strong class="mr-auto">
                            {{ alertMessage.title }}
                        </strong>
                        <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
                          <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="toast-body">
                        {{ alertMessage.message }}
                    </div>
                </div>
            </div>
        </div>
    `,
    data: function () {
        return {
            'list': {},
            'alertMessage': {
                'title': String,
                'message': String
            },
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
        var urlParams = new URLSearchParams(window.location.search);
        var listId = parseInt(urlParams.get('listId'));
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
                            if(response.data.errors){
                                  this.alertMessage['title'] = 'Error';
                                  this.alertMessage['message'] = response.data.errors[0].message;
                                  $('#alertToast').toast({ autohide: false }).toast('show');
                            } else {
                                this.list = response.data.data.createSysList.sysList;
                                this.alertMessage['title'] = 'Success';
                                this.alertMessage['message'] = 'Record successfully saved.';
                                $('#alertToast').toast({ autohide: true, delay: 1000 }).toast('show');
                            }
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
