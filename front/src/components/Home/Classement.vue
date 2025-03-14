<template>
    <section>
        <b-field label="Chercher">
            <b-input v-model="query" @input="search()"></b-input>
        </b-field>
        <div class="control is-flex">
            <b-field>
                <b-select v-model="selected" placeholder="Type de classement" size="is-default" @input="reloadClassement()">
                    <option value="Total">Total</option>
                    <option value="Soirée">Soirée</option>
                    <option value="Staff">Staff</option>
                    <option value="Homme">Homme</option>
                    <option value="Femme">Femme</option>
                    <option value="Autre">Autre</option>
                </b-select>
            </b-field> 
        </div>
        <b-table 
            :data="filterBySearch()"
            ref="classementTable"
            @sort="sortPressed"
        >
            <b-table-column
                label="N°"
                v-slot="props"
                field="displayedId">
                <div class="centered">
                    {{ props.row.displayedId }}
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
                {{ props.row.balance }}
            </b-table-column>

            <b-table-column
                :visible="isAlcoholLevelDisplayed"
                v-slot="props"
                label="Degré d'alcool (g/L)"
                field="alcool"
                width="10vw"
            >
                <span v-if="props.row.alcoholLevel<0.5">{{ props.row.alcoholLevel.toFixed(2) }}</span>
                <strong v-else style="color:#f14668"> {{ props.row.alcoholLevel.toFixed(2) }} </strong>
            </b-table-column>
        </b-table>
    </section>
</template>
<script>

export default {
    data() {
        // const displayedUsers = []
        return {
            query : '',
            canGoToShop : true,
            isAlcoholLevelDisplayed : false,
            displayedUsers: [],
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
            selected : 'Soirée',
            searchEnable : true
        }
    },
    methods: {
        formatUserInfo(user) {
            return JSON.stringify({
                userId : user.id,
                balance : user.balance
            })
        },
        search() {
            this.query = this.query.trim()
        },
        searchUser(query, user) {
            let out = false;
            [
                'pseudo',
                'name',
                'firstName',
                'totem',
                'quali'
            ].forEach((field) => {
                let tmp = user[field]
                    .toString()
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .toLowerCase()
                    .indexOf(
                        query
                            .toLowerCase()
                            .normalize("NFD")
                            .replace(/[\u0300-\u036f]/g, "")
                        )
                if (tmp >= 0) out = true;
            });
            return out;
        },
        filterBySearch() {
            if (this.query != '')
                return this.displayedUsers.filter((user) => {
                    if (this.canGoToShop) return this.searchUser(this.query, user)
                    else return user.pseudo
                                    .toString()
                                    .normalize("NFD")
                                    .replace(/[\u0300-\u036f]/g, "")
                                    .toLowerCase()
                                    .indexOf(
                                        this.query
                                            .toLowerCase()
                                            .normalize("NFD")
                                            .replace(/[\u0300-\u036f]/g, "")
                                        ) >= 0
                })
            else return this.displayedUsers
        },
        reloadClassement() {
            this.canGoToShop = true;
            this.isAlcoholLevelDisplayed = true;
            switch (this.selected) {
                case "Homme":
                    this.displayedUsers = this.users.filter(u => u.sex == "m");
                    break;
            
                case "Femme":
                    this.displayedUsers = this.users.filter(u => u.sex == "f");
                    break;
                case "Autre":
                    this.displayedUsers = this.users.filter(u => u.sex == "o");
                    break;

                case "Staff":
                    if (!this.staffStats) {
                        // compute it just once
                        let scores = {}
                        this.users.forEach(u => {
                            if (!(u.staff in scores)) {
                                scores[u.staff] = {
                                    croix : 0,
                                    balance : 0,
                                }
                            }
                            scores[u.staff].croix += u.croix
                            scores[u.staff].balance += u.balance
                        })
                        this.staffStats = Object.keys(scores)
                            .sort((a, b) => scores[b].croix - scores[a].croix)
                            .map((k, i) => {return {
                                displayedId : i+1,
                                pseudo : k,
                                croix : scores[k].croix,
                                balance : scores[k].balance,
                            }})
                    }
                    this.displayedUsers = this.staffStats
                    this.canGoToShop = false;
                    this.isAlcoholLevelDisplayed = false;
                    break;
                case "Total":
                    this.isAlcoholLevelDisplayed = false
                    this.displayedUsers = this.users
                    break;
                case "Soirée":
                    this.displayedUsers = this.users.map((u) => {
                        return {
                            id           : u.id,
                            pseudo       : u.pseudo,
                            name         : u.name,
                            firstName    : u.firstName,
                            totem        : u.totem,
                            quali        : u.quali,
                            staff        : u.staff,
                            sex          : u.sex,
                            birthday     : u.birthday,
                            croix        : u.expenses,
                            alcoholLevel : u.alcoholLevel,
                            balance      : u.balance
                        }
                    }).sort((a, b) => b.croix - a.croix)
                    this.displayedUsers.forEach((u, i) => u.displayedId = i+1)
                    break
                default:
                    this.displayedUsers = this.users;
            }
        },
        loadAlcoholLevel : async function() {
            this.$axios.get(this.$backend + "/utils/alcohol-level", {params : {
                    timestamp : new Date() / 1000,
                    tresh : this.$tresh
                }})
                .then(resp => {
                    this.users.forEach((u) => {
                        let tmp = resp.data.find(r => r.userId === u.id);
                        u.alcoholLevel = 0 
                        if (tmp) u.alcoholLevel = tmp.alcoholLevel
                        })
                    this.reloadClassement()
                })
        },
        loadExpenses: async function() {
            this.$axios.get(this.$backend + '/utils/expenses', {params : {
                timestamp : new Date() / 1000,
                tresh : this.$tresh
            }})
            .then(resp => {
                this.users.forEach((u) => {
                    let tmp = resp.data.find(r => r.userId === u.id);
                    u.expenses = 0 
                    if (tmp) u.expenses = tmp.expenses
                    })
                this.reloadClassement()
            })
        }
    },
    beforeMount() {
        this.$axios.get(this.$backend + "/users/list")
            .then(resp => {
                this.users = resp.data.sort((a, b) => b.croix - a.croix);
                this.users.forEach((u, i) => {
                    u.displayedId = i+1;
                    u.balance = u.rond - u.croix
                    })
                this.displayedUsers = this.users;
                this.loadAlcoholLevel()
                this.loadExpenses()
            })
            .catch(() => {
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
            })
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