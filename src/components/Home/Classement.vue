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
                    <option value="Autre">Autre</option>
                </b-select>
            </b-field> 
            <!-- <b-button v-if="tableModified" type="is-warning is-light" class="button" @click="resetSort">Reset</b-button> -->
            <!-- <b-checkbox-button v-model="searchEnable">
                Activer la recherche
            </b-checkbox-button> -->
        </div>
        <b-table 
            :data="showedUsers"
            ref="classementTable"
            @sort="sortPressed"
        >
            <b-table-column
                label="N°"
                v-slot="props"
                field="showedId">
                <div class="centered">
                    {{ props.row.showedId }}
                </div>
            </b-table-column>

            <b-table-column
                label="Nom"
                v-slot="props"
                field="name"
                width="20vw">
                <router-link 
                    :is="canGoToShop?'router-link':'span'"
                    :to="'/shop/' + formatUserInfo(props.row)">
                    <span class="rowName">
                        <strong>{{ props.row.pseudo }}</strong>
                    </span>
                </router-link>
                
            </b-table-column>

            <b-table-column
                label="Croixs"
                v-slot="props"
                field="croix"
                width="10vw">
                {{ props.row.croix }}
            </b-table-column>

            <b-table-column
                label="Positif"
                v-slot="props"
                field="balance"
                width="10vw">
                {{ props.row.rond - props.row.croix }}
            </b-table-column>

            <b-table-column
                label="Degre d'alcool"
                field="alcool"
                width="8vw"
            >
                Pas assez
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
                    field: 'balance',
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
        onChange(event) {
            // this.tableModified = true;
            switch (event) {
                case "Homme":
                    this.canGoToShop = true;
                    this.showedUsers = this.users.filter(u => u.sex == "m");
                    break;
            
                case "Femme":
                    this.canGoToShop = true;
                    this.showedUsers = this.users.filter(u => u.sex == "f");
                    break;
                case "Autre":
                    this.canGoToShop = true;
                    this.showedUsers = this.users.filter(u => u.sex == "o");
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
                            }
                            scores[u.staff].croix += u.croix
                            scores[u.staff].rond += u.rond
                        })
                        this.staffStats = Object.keys(scores)
                            .sort((a, b) => scores[b].croix - scores[a].croix)
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
                    this.canGoToShop = true;
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
                this.users = resp.data.sort((a, b) => b.croix - a.croix);
                this.users.forEach((u, i) => {u.showedId = i+1})
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