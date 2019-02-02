<template>
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
            
        </tbody>
    </table>
</template>

<script>


export default {
    data: function () {
        return {
            'list': {},
            'attributes': [],
            'queryGetList': this.$store.state.queryGetList,
        }
    },
    computed: {
        listId() {
            var listId = parseInt(this.$route.params.listId);
            if (isNaN(listId)) { return null; }
            else { return listId; }
        }
    },
    created: function () {
        // Get list Id from URL parameters, verify if it's valid integer
        // If list Id is not NaN then get corresponding list
        if (this.listId) {
            var payload = {
                'query': this.queryGetList,
                'variables': { 'id': this.listId }
            };
            this.$http.post(this.$store.state.graphqlUrl, payload).then (
                function(response){
                    if(response.data.errors){
                        this.$store.state.errorObject.flag = true;
                        this.$store.state.errorObject.message = response.data.errors[0].message;
                    } else {
                        this.list = response.data.data.sysListById;
                        this.attributes = this.list.sysAttributesByListId.nodes;
                    }
                }
            );
        };
    }
}
</script>
