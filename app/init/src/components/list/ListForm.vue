<template>
    <div>
        <h1 class="mt-5">Edit list</h1>

        <form>
            <div class="form-row">
                <div class="col-md-8">
                    <!-- List Form -->
                    <div class="form-group required">
                        <label for="listName" class="col-form-label">
                            Name:
                        </label>
                        <input class="form-control col-sm"
                            id="listName"
                            type="text"
                            required="required"
                            placeholder="Type list name"
                            v-model="list.name" />
                    </div>
                    <div class="form-group required">
                        <label for="listDescription" class="col-form-label">
                            Description:
                        </label>
                        <textarea class="form-control col-sm"
                            id="listDescription"
                            required="true"
                            placeholder="Type list description"
                            rows="3"
                            v-model="list.description" />
                    </div>

                    <!-- Button Menu -->
                    <div>
                        <list-button-save
                            v-bind:list="list">
                        </list-button-save>

                        <list-button-add-attribute
                            v-if="list.id"
                            v-bind:listId="list.id">
                        </list-button-add-attribute>

                        <list-button-edit-value
                            v-if="list.id"
                            v-bind:listId="list.id">
                        </list-button-edit-value>

                        <list-button-close>
                        </list-button-close>

                        <list-button-delete
                            v-if="list.id"
                            v-bind:listId="list.id">
                        </list-button-delete>
                    </div>
                </div>
                <div class="col-md-4">
                    <p v-if="list.id" class="text-secondary small p-2 mt-4">
                        Created date: {{list.createdDate}} <br>
                        Created by: {{list.sysUserByCreatedById.email}} <br>
                        Updated date: {{list.updatedDate}} <br>
                        Updated by: {{list.sysUserByUpdatedById.email}}
                    </p>
                </div>
            </div>
        </form>

        <!-- List Attributes -->
        <list-attribute-table v-if="list.id" v-bind:list="list"></list-attribute-table>
    </div>
</template>

<script>
import ListButtonSave from './ListButtonSave.vue';
import ListButtonAddAttribute from './ListButtonAddAttribute.vue';
import ListButtonEditValue from './ListButtonEditValue.vue';
import ListButtonClose from './ListButtonClose.vue';
import ListButtonDelete from './ListButtonDelete.vue';
import ListAttributeTable from './ListAttributeTable.vue';

export default {
    components: {
        'list-button-save': ListButtonSave,
        'list-button-add-attribute': ListButtonAddAttribute,
        'list-button-edit-value': ListButtonEditValue,
        'list-button-close': ListButtonClose,
        'list-button-delete': ListButtonDelete,
        'list-attribute-table': ListAttributeTable
    },
    data: function () {
        return {
            'list': {},
        }
    },
    computed: {
        listId() {
            return this.$route.params.listId;
        }
    },
    created: function () {
        // If listId != new then get data for existing list
        if (this.listId != 'new') {
            let payload = {
                'query': this.$store.state.queryGetList,
                'variables': {
                    'id': this.listId
                }
            };
            let headers = {};
            if (this.$session.exists()) {
                headers = { 'Authorization': 'Bearer ' + this.$session.get('jwt') };
            };
            this.$http.post(this.$store.state.graphqlUrl, payload, {headers}).then (
                function(response){
                    if(response.data.errors){
                        this.$store.state.errorObject.flag = true;
                        this.$store.state.errorObject.message = response.data.errors[0].message;
                    } else {
                        this.list = response.data.data.sysListById;
                    }
                }
            );
        };
    }
}
</script>