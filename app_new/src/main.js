import Vue from 'vue';
import VueResource  from 'vue-resource';
import VueRouter from 'vue-router';
import App from './App.vue';
import Home from './Home.vue';
import List from './List.vue';
import Value from './Value.vue';

import { store } from './store';

// Tell Vue to use libraries
Vue.use(VueResource);
Vue.use(VueRouter);

// Declare application URLs
const routes = [
    { path: '/', component: Home },
    { path: '/lists/:listId', component: List },
    { path: '/lists/:listId/values', component: Value }
];

// Configure router
const router = new VueRouter ({
    routes,
    mode: 'history'
});

// Create Vue instance
new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})
