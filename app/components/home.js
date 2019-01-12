// Application home page
Vue.component('home', {
    template: `
        <div class="col-8">

            <form class="mt-5 mb-5">
                <input class="form-control form-control-lg" type="search" placeholder="Search" aria-label="Search">
            </form>
            

            <table class="table table-striped table-dark table-hover table-borderless">
                <thead>
                    <tr>
                        <th scope="col">
                            Name
                        </th>
                        <th scope="col">
                            Description
                        </th>
                        <th scope="col">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="list in lists">
                        <td>
                            <a href="#" v-on:click="goToEditValue(list.id)">{{ list.name }}</a>
                        </td>
                        <td>
                            {{ list.description }}
                        </td>
                        <td>
                            <a href="#" class="badge badge-secondary" v-on:click="goToEditValue(list.id)">
                                Edit Values
                            </a>
                            <a href="#" class="badge badge-secondary" v-on:click="goToEditList(list.id)">
                            Edit List
                            </a>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    `,
    data: function () {
        return {
            'lists': [],
            'query': `query getAllLists{
                allSysLists(orderBy:NAME_ASC) {
                    nodes {
                        id
                        name
                        description
                    }
                }
            }`
        }
    },
    created: function () {
        this.getAllLists();
    },
    methods: {
        getAllLists() {
            // Method to get list of lists
            this.$http.post(Vue.prototype.$graphqlUrl, { 'query': this.query }).then (
                function(response){
                    if(response.status == "200"){
                        this.lists = response.data.data.allSysLists.nodes;
                    }
                }
            );
        },
        goToEditList(listId) {
            window.location.href = 'edit-list.html?listId=' + listId;
        },
        goToEditValue(listId) {
            // Method to navigate to the edit value page
            window.location.href = 'edit-value.html?listId=' + listId;
        }
    }
});