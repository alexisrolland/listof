// Application home page
Vue.component('form-list-attribute', {
    template: `
        <div class="form-group">
            <label>
                Attributes:
            </label>
            <button type="button" class="btn btn-secondary btn-sm float-right">
                Add
            </button>
            <div class="form-row">
                <div class="col-2">
                    <input id="attributeName" class="form-control form-control-sm" type="text" placeholder="Attribute name" />
                </div>
                <div class="col-2">
                    <input id="attributeDescription" class="form-control form-control-sm" type="text" placeholder="Attribute description" />
                </div>
                <div class="col-2">
                    <select id="attributeDataType" class="form-control form-control-sm">
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                    </select>
                </div>
                 <div class="col-2">
                    <input id="attributeDefaultValue" class="form-control form-control-sm" type="text" placeholder="Default value" />
                </div>
                <div class="col-2">
                    <select id="attributeListOfValue" class="form-control form-control-sm">
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                    </select>
                </div>
                <div class="col form-inline">
                    <input id="attributeUnique" class="form-control mr-1" type="checkbox" value="">
                    <small id="attributeUniqueHelp" class="form-text text-muted">
                        Unique
                    </small>
                </div>
                <div class="col form-inline">
                    <input id="attributeMandatory" class="form-control mr-1" type="checkbox" value="">
                    <small id="attributeMandatoryHelp" class="form-text text-muted">
                        Mandatory
                    </small>
                </div>
            </div>
        </div>
    `
});