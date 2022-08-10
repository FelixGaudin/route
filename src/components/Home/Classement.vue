<template>
    <section>
        {{ brrr }}
        <div class="control is-flex">
            <b-field>
                <b-select v-model="selected" placeholder="Type de classement" size="is-default" @input="onChange($event)">
                    <option value="Total">Total</option>
                    <option value="Soirée">Soirée</option>
                    <option value="Staff">Staff</option>
                    <option value="Homme">Homme</option>
                    <option value="Femme">Femme</option>
                </b-select>
            </b-field> 
            <b-button v-if="tableModified" type="is-warning is-light" class="button" @click="resetSort">Reset</b-button>
            <b-checkbox-button v-model="searchEnable">
                Activer la recherche
            </b-checkbox-button>
        </div>
        <b-table 
            :data="users"
            ref="classementTable"
            @sort="sortPressed"
        >
            <b-table-column
                label="N°"
                v-slot="props"
                field="id"
                sortable>
                <div class="centered">
                    {{ props.row.id }}
                </div>
            </b-table-column>

            <b-table-column
                label="Nom"
                v-slot="props"
                field="name"
                width="20vw"
                sortable
                :searchable="!searchEnable">
                <router-link :to="'/shop/' + props.row.name">
                    <span class="rowName">
                        {{ props.row.name }}
                    </span>
                </router-link>
                
            </b-table-column>

            <b-table-column v-for="(column, index) in columnsTemplate"
                :key="index"
                :label="column.title"
                :field="column.field"
                :visible="column.visible"
                :searchable="!searchEnable"
                width="10vw"
                sortable
                numeric
                v-slot="props">
                    {{ props.row[column.field] }}
            </b-table-column>

            <b-table-column 
                label="Gender" 
                v-slot="props">
                <b-icon pack="fas"
                    :icon="props.row.gender === 'Male' ? 'mars' : 'venus'">
                </b-icon>
            </b-table-column>
        </b-table>
        <b-button @click="clickMe">Click Me</b-button>
    </section>
</template>
<script>
const {ipcRenderer} = window.require("electron")

function randInt() {
    return Math.floor(Math.random() * 101);
}

export default {
    data() {
        const users = [
            { 'id': 1, 'name': 'Meas', 'croix': randInt(), 'ronds': randInt(), 'gender': 'Male' },
            { 'id': 2, 'name': 'Jupiler', 'croix': randInt(), 'ronds': randInt(), 'gender': 'Male' },
            { 'id': 3, 'name': 'Carapils', 'croix': randInt(), 'ronds': randInt(), 'gender': 'Female' },
            { 'id': 4, 'name': 'Chimay bleu', 'croix': randInt(), 'ronds': randInt(), 'gender': 'Male' },
            { 'id': 5, 'name': 'Cuvé des trolls', 'croix': randInt(), 'ronds': randInt(), 'gender': 'Female' }
        ]
        return {
            brrr : '',
            users,
            columnsTemplate: [
                { 
                    title: 'Croix', 
                    field: 'croix', 
                    visible: true 
                },
                { 
                    title: 'Positif', 
                    field: 'rond',
                    visible: true 
                }
            ],
            tableModified : false,
            selected : undefined,
            searchEnable : true
        }
    },
    methods: {
        resetSort(){
            this.tableModified = false;
            this.selected = undefined;
            this.$refs.classementTable.resetMultiSorting()
        },
        sortPressed() {
            this.tableModified = true;
        },
        onChange(event) {
            this.tableModified = true;
            console.log(event);
        },
        clickMe() {
            console.log(this.searchEnable);
        }
    },
    beforeMount() {
        this.brrr = this.$test
        ipcRenderer.on('getUsersReply', (event, resp) => {
            if (resp.error) {
                this.$buefy.dialog.alert({
                    title: 'ERREUR',
                    message: 'Il y a eu une erreur pour récupérer les utilisateurs, merci de contacter un routier',
                    type: 'is-danger',
                    hasIcon: true,
                    icon: 'times-circle',
                    iconPack: 'fa',
                    ariaRole: 'alertdialog',
                    ariaModal: true
                })
            } else {
                this.users = resp.data;
            }
        })
        ipcRenderer.send('getUsers')
    }
}
</script>

<style>
.input, .table {
    background-color: rgba(0, 0, 0, 0) !important;
}
.centered {
    text-align: center;
}
.rowName {
    color: #363636;
}
</style>