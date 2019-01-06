// Application left menu
Vue.component('left-menu', {
    template: `
        <ul>
            <li v-for="item in lists">
                {{ item.name }}
            </li>
        </ul>
    `,
    data: function () {
        return {
            'lists': [],
            'query': ` {
                allSysLists(orderBy:NAME_ASC) {
                    nodes {
                        name
                    }
                }
            }`
        }
    },
    created: function () {
      this.post();
    },
    methods: {
      post() {
        // Method to get list of lists
        this.$http.post(Vue.prototype.$graphqlUrl, { 'query': this.query }).then (
          function(response){
            if(response.status == "200"){
              this.lists = response.data.data.allSysLists.nodes;
            }
          }
        )
      }
    }
});