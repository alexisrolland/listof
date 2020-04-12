import Vue from "vue";
import VueResource from "vue-resource";
import VueRouter from "vue-router";
import VueSession from "vue-session";
import App from "./App.vue";
import { store } from "./store";

// Custom components
import Login from "./components/Login.vue";
import Backup from "./components/Backup.vue";
import EditList from "./components/EditList.vue";
import EditListAttribute from "./components/EditListAttribute.vue";
import EditListValue from "./components/EditListValue.vue";
import EditUser from "./components/EditUser.vue";
import EditUserGroup from "./components/EditUserGroup.vue";
import ViewList from "./components/ViewList.vue";
import ViewListValue from "./components/ViewListValue.vue";
import ViewUser from "./components/ViewUser.vue";
import ViewUserGroup from "./components/ViewUserGroup.vue";

// Tell Vue to use libraries
Vue.use(VueResource);
Vue.use(VueRouter);
Vue.use(VueSession, { persist: true });

// Declare application URLs
const routes = [
  { name: "home", path: "/", component: ViewList },
  { name: "login", path: "/login", component: Login },
  { name: "view-list", path: "/lists", component: ViewList },
  { name: "edit-list", path: "/lists/:listId", component: EditList },
  { name: "edit-list-attribute", path: "/lists/:listId/attributes/:attributeId", component: EditListAttribute },
  { name: "view-list-value", path: "/lists/:listId/values", component: ViewListValue },
  { name: "edit-list-value", path: "/lists/:listId/values/:valueId", component: EditListValue },
  { name: "backup", path: "/admin/backup", component: Backup },
  { name: "view-user", path: "/admin/users", component: ViewUser },
  { name: "edit-user", path: "/admin/users/:userId", component: EditUser },
  { name: "view-user-group", path: "/admin/usergroups", component: ViewUserGroup },
  { name: "edit-user-group", path: "/admin/usergroups/:userGroupId", component: EditUserGroup }
];

// Configure router
const router = new VueRouter({
  routes,
  mode: "hash"
});

Vue.config.productionTip = false; // Not sure what this is for
// Create Vue instance
new Vue({
  el: "#app",
  router,
  store,
  render: h => h(App)
}).$mount("#app");
