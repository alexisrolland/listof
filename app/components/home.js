// Application home page
Vue.component('home', {
    template: `
        <div class="col" style="min-width: 1080px;">
            <h1 class="mt-2">
                ListOf...
            </h1>
            <p class="lead">
                Create a new list of values...
            </p>
            <button class="btn btn-success btn-lg" v-on:click="goToEditList">
                Create
            </button>
        </div>
    `,
    methods: {
      goToEditList() {
        window.location.href = 'edit-list.html';
      }
    }
});