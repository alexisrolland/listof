import Vue from 'vue';
import VueResource  from 'vue-resource';
import VueRouter from 'vue-router';
import App from './App.vue';
import Home from './Home.vue';
import List from './List.vue';
import Attribute from './Attribute.vue';
import Value from './Value.vue';
import Record from './Record.vue';

import { store } from './store';

// Tell Vue to use libraries
Vue.use(VueResource);
Vue.use(VueRouter);

// Declare application URLs
const routes = [
    { name: 'home', path: '/', component: Home },
    { name: 'lists', path: '/lists/:listId', component: List },
    { name: 'attributes', path: '/lists/:listId/attributes/:attributeId', component: Attribute },
    { name: 'values', path: '/lists/:listId/values', component: Value },
    { name: 'records', path: '/lists/:listId/values/:recordId', component: Record },
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
