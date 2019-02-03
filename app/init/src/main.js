import Vue from 'vue';
import VueResource  from 'vue-resource';
import VueRouter from 'vue-router';
import App from './App.vue';
import Home from './components/Home.vue';
import EditList from './components/EditList.vue';
import EditListAttribute from './components/EditListAttribute.vue';
import EditListValue from './components/EditListValue.vue';
import ViewListValue from './components/ViewListValue.vue';

import { store } from './store';

// Tell Vue to use libraries
Vue.use(VueResource);
Vue.use(VueRouter);

// Declare application URLs
const routes = [
    { name: 'home', path: '/', component: Home },
    { name: 'edit-list', path: '/lists/:listId', component: EditList },
    { name: 'edit-list-attribute', path: '/lists/:listId/attributes/:attributeId', component: EditListAttribute },
    { name: 'edit-list-value', path: '/lists/:listId/values/:valueId', component: EditListValue },
    { name: 'view-list-value', path: '/lists/:listId/values', component: ViewListValue },
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
