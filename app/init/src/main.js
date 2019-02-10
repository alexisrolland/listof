import Vue from 'vue';
import VueResource  from 'vue-resource';
import VueRouter from 'vue-router';
import App from './App.vue';
import { store } from './store';

// Custom components
import Home from './components/Home.vue';
import EditList from './components/EditList.vue';
import EditListAttribute from './components/EditListAttribute.vue';
import ViewListValue from './components/ViewListValue.vue';
import EditListValue from './components/EditListValue.vue';
import Admin from './components/Admin.vue';

// Tell Vue to use libraries
Vue.use(VueResource);
Vue.use(VueRouter);

// Declare application URLs
const routes = [
    { name: 'home', path: '/', component: Home },
    { name: 'edit-list', path: '/lists/:listId', component: EditList },
    { name: 'edit-list-attribute', path: '/lists/:listId/attributes/:attributeId', component: EditListAttribute },
    { name: 'view-list-value', path: '/lists/:listId/values', component: ViewListValue },
    { name: 'edit-list-value', path: '/lists/:listId/values/:valueId', component: EditListValue },
    { name: 'admin', path: '/admin', component: Admin },
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
