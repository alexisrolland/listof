Vue.component('edit-list', {
    template: `
        <div class="col-7" style="min-width: 1080px;">
                
            <h1 class="mt-2">Edit list</h1>
            <form>
                <form-list></form-list>
            </form>

            <h1 class="mt-2">Attributes</h1>
            <form>
                <form-attribute></form-attribute>
            </form>
        </div>
    `
});