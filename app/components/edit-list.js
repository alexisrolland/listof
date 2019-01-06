// Application home page
Vue.component('edit-list', {
    template: `
        <div class="col-7" style="min-width: 1080px;">
            <h1>Edit list...</h1>
            <form>
                <form-menu-button></form-menu-button>
                <form-list></form-list>
                <form-list-attribute></form-list-attribute>
            </form>
        </div>
    `
});