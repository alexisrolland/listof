// Application home page
Vue.component('edit-value', {
    template: `
        <div class="col" style="min-width: 1080px;">
            <h1 class="mt-2">
                {{ list.name }}
            </h1>
            <p class="lead">
                {{ list.description }}
            </p>
        </div>
    `,
    data: function () {
        return {
            'list': {},
            'query': `query getList($id: Int!) {
                sysListById(id: $id) {
                    id
                    name
                    description
                }
            }`
        }
    },
    mounted: function () {
        // Get list Id from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const listId = parseInt(urlParams.get('listId'));
        this.getList(listId);
      },
    methods: {
        getList(listId) {
            // Method to get a list
            payload = {
                'query': this.query,
                'variables': { 'id': listId }
            };
            this.$http.post(Vue.prototype.$graphqlUrl, payload).then (
                function(response){
                    if(response.status == "200"){
                        this.list = response.data.data.sysListById;
                    }
                }
            )
        }
    }
});