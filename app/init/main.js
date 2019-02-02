// Global variables
Vue.prototype.$hostName = 'https://localhost';
Vue.prototype.$baseUrl = Vue.prototype.$hostName + '/listof/api';
Vue.prototype.$graphqlUrl = Vue.prototype.$baseUrl + '/v1/graphql';

// Declare application
var app = new Vue({ 
    el: '#app',
    data: {}
});