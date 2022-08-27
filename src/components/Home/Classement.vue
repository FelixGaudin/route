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
            :data="showedUsers"
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
                <router-link 
                    :is="canGoToShop?'router-link':'span'"
                    :to="'/shop/' + formatUserInfo(props.row)">
                    <span class="rowName">
                        {{ props.row.pseudo }}
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
                    :icon="props.row.sex === 'm' ? 'mars' : 'venus'">
                </b-icon>
            </b-table-column>
        </b-table>
    </section>
</template>
<script>
const {ipcRenderer} = window.require("electron")

export default {
    data() {
        // const showedUsers = []
        return {
            brrr : '',
            canGoToShop : true,
            showedUsers: [],
            users : [],
            staffStats : undefined,
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
        formatUserInfo(user) {
            return JSON.stringify({
                userId : user.id,
                rondLeft : user.rond - user.croix
            })
        },
        resetSort(){
            this.showedUsers = this.users
            this.tableModified = false;
            this.canGoToShop = true;
            this.selected = undefined;
            this.$refs.classementTable.resetMultiSorting()
        },
        sortPressed() {
            this.tableModified = true;
        },
        onChange(event) {
            this.tableModified = true;
            switch (event) {
                case "Homme":
                    this.canGoToShop = true;
                    this.showedUsers = this.users.filter(u => u.sex == "m");
                    break;
            
                case "Femme":
                    this.canGoToShop = true;
                    this.showedUsers = this.users.filter(u => u.sex == "f");
                    break;

                case "Staff":
                    if (!this.staffStats) {
                        // if not set compute it (just once)
                        let scores = {}
                        this.users.forEach(u => {
                            if (!(u.staff in scores)) {
                                scores[u.staff] = {
                                    croix : 0,
                                    rond : 0
                                }
                                scores[u.staff].croix += u.croix
                                scores[u.staff].rond += u.rond
                            }
                        })
                        console.log(scores);
                        this.staffStats = Object.keys(scores)
                            .sort((a, b) => scores[a].croix - scores[b].croix)
                            .map((k, i) => {return {
                                id : i+1,
                                pseudo : k,
                                croix : scores[k].croix,
                                rond : scores[k].rond
                            }})
                    }
                    this.showedUsers = this.staffStats
                    this.canGoToShop = false;
                    break;

                default:
                    this.showedUsers = this.users;
            }
        }
    },
    beforeMount() {
        // this.brrr = this.$test
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
                this.users = resp.data.sort((a, b) => a.croix - b.croix);
                this.showedUsers = this.users;
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