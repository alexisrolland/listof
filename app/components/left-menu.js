Vue.component('left-menu', {
    template: `
        <ul>
            <li v-for="list in lists">
                <a href="#" v-on:click="goToEditValue(list.id)">{{ list.name }}</a>
            </li>
        </ul>
    `,
    data: function () {
        return {
            'lists': [],
            'query': `query getAllLists{
                allSysLists(orderBy:NAME_ASC) {
                    nodes {
                        id
                        name
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
            )
        },
      goToEditValue(listId) {
        window.location.href = 'edit-value.html?listId=' + listId;
      }
    }
});