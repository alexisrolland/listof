// Application home page
Vue.component('form-list', {
    template: `
        <div>
            <div class="form-group">
                <label for="listName">
                    Name:
                </label>
                <input id="listName" type="text" class="form-control form-control-sm" placeholder="List name" />
                <small id="listNameHelp" class="form-text text-muted">
                    Avoid special characters as the list name will be used to generate a database table name.
                </small>
            </div>

            <div class="form-group">
                <label for="listDescription">
                    Description:
                </label>
                <textarea id="listDescription" class="form-control form-control-sm"  placeholder="List description" rows="3" />
            </div>
        </div>
    `
});