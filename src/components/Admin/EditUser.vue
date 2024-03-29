<template>
    <div class="centered">
        <b-field label="Chercher">
            <b-input v-model="query" @input="search()"></b-input>
        </b-field>
        <b-table :data="filterBySearch()">
            <b-table-column
                label=""
                field="delete"
                v-slot="props"
                width="6vw">
                <b-field>
                    <b-button type="is-danger"
                        icon-right="delete" 
                        @click="() => {deleteUser(props.row.id)}"
                        />
                </b-field>
            </b-table-column>
            <b-table-column
                label="Pseudo"
                v-slot="props"
                field="pseudo"
                width="10vw">
                <b-field
                    :type="isPseudoUnique(props.row.pseudo)? '': 'is-danger'"
                    :message="isPseudoUnique(props.row.pseudo)? '': 'Le pseudo est utilisé plusieurs fois'"
                    >
                    <b-input 
                        v-model="props.row.pseudo" 
                        placeholder="Pseudo"
                        required></b-input>
                </b-field>
            </b-table-column>
            <b-table-column
                label="Nom"
                v-slot="props"
                field="name"
                width="6vw">
                <b-field>
                    <b-input 
                        v-model="props.row.name" 
                        placeholder="Nom"
                        required></b-input>
                </b-field>
            </b-table-column>
            <b-table-column
                label="Prénom"
                v-slot="props"
                field="firstName"
                width="6vw">
                <b-field>
                    <b-input 
                        v-model="props.row.firstName" 
                        placeholder="Prénom"
                        required></b-input>
                </b-field>
            </b-table-column>
            <b-table-column
                label="Totem"
                v-slot="props"
                field="totem"
                width="6vw">
                <b-field>
                    <b-input v-model="props.row.totem" placeholder="Totem"></b-input>
                </b-field>
            </b-table-column>
            <b-table-column
                label="Quali"
                v-slot="props"
                field="quali"
                width="6vw">
                <b-field>
                    <b-input v-model="props.row.quali" placeholder="Quali"></b-input>
                </b-field>
            </b-table-column>
            <b-table-column
                label="Staff"
                v-slot="props"
                field="staff"
                width="6vw">
                <b-field>
                    <b-select 
                        placeholder="Staff" 
                        v-model="props.row.staff">
                        <option 
                            v-for="staff in staffs"
                            :value="staff"
                            :key="staff">
                            {{ staff }}
                        </option>
                    </b-select>
                </b-field>
            </b-table-column>
            <b-table-column
                label="Sexe"
                v-slot="props"
                field="sex"
                width="6vw">
                <b-field>
                    <b-select 
                        placeholder="Sexe" 
                        v-model="props.row.sex"
                        required>
                        <option value="m">Homme</option>
                        <option value="f">Femme</option>
                        <option value="o">Autre</option>
                    </b-select>
                </b-field>
            </b-table-column>
            <b-table-column
                label="Anniversaire"
                v-slot="props"
                field="sex"
                width="10vw">
                <b-field>
                    <b-datepicker
                        v-model="props.row.birthday"
                        placeholder="Date d'anniversaire"
                        icon="calendar-today"
                        trap-focus
                        required>
                    </b-datepicker>
                </b-field>
            </b-table-column>

        </b-table>
        <br/>
        <br/>
        <br/>
        <b-button @click="applyChanges" size="is-medium" type="is-success">Valider</b-button>
        <b-button @click="clear" size="is-medium" type="is-warning">Annuler</b-button>
    </div>
</template>

<script>

export default {
    name: 'EditUser',
    data() {
        return {
            // list of the "hashes" of the users before being modified
            query : '',
            usersHashes : {},
            users : [],
            displayedUsers : [],
            staffs : [
                'Aucun',
                'Broceliande',
                'Petit Bonheur',
                'Mowha',
                'Waingunga',
                'Seeonee',
                'ODC',
                'Orion',
                'Pi 1',
                'Pi 2',
                'Route',
                "Chefs d'u",
                'Ancien'
                ]
        }
    },
    methods : {
        search() {this.query = this.query.trim()},
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
                    return this.searchUser(this.query, user)
                    })
            else return this.displayedUsers
        },
        isPseudoUnique(pseudo) {
            let v = this.displayedUsers
                .filter((user) => {
                return user.pseudo
                    .toString()
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .toLowerCase()
                    .localeCompare(
                        pseudo
                            .toLowerCase()
                            .normalize("NFD")
                            .replace(/[\u0300-\u036f]/g, "")
                        ) == 0
            }).length;
            return v === 1;
        },
        clear() {
            this.displayedUsers = this.users
                // https://stackoverflow.com/questions/597588/how-do-you-clone-an-array-of-objects-in-javascript
                .map(a => {return {...a}}) 
        },
        deleteUser(userId) {
            this.$buefy.dialog.confirm({
                title: 'Supprimer un utilisateur',
                message: "Êtes vous sûr de vouloir <b>supprimer</b> l'utilisateur ?",
                confirmText: "Supprimer l'utilisateur",
                cancelText : "Annuler",
                type: 'is-danger',
                hasIcon: true,
                onConfirm: () => {
                    this.$axios.delete(this.$backend + '/users/delete/' + userId)
                        .then(() => this.updateList())
                        .catch(() => {
                            this.$buefy.dialog.alert({
                                title: 'ERREUR',
                                message: "Il y a eu une erreur pour supprimer l'utilisateur, merci de contacter un routier",
                                type: 'is-danger',
                                hasIcon: true,
                                icon: 'times-circle',
                                iconPack: 'fa',
                                ariaRole: 'alertdialog',
                                ariaModal: true
                            })
                        })
                }
            })
        },
        askApplyChanges() {
                this.$buefy.dialog.confirm({
                    message: 'Êtes vous sûr de vos changements ?',
                    onConfirm: () => this.applyChanges(),
                    confirmText: "Supprimer l'utilisateur",
                    cancelText : "Annuler",
                })
        },
        applyChanges() {
            let toModifyUsers = this.displayedUsers
                // Get modified users
                .filter((user) => 
                    JSON.stringify(user)
                    .localeCompare(this.usersHashes[user.id]) !== 0)
                // Deepcopy those users
                .map(a => {return {...a}})
                // Format the date
                .map((user) => {
                    let birthday = user.birthday
                    let timezoneOffset = birthday.getTimezoneOffset()*60;
                    user.birthday = Math.floor((birthday / 1000)-timezoneOffset)
                    return user;
                })
            this.$axios.put(this.$backend + '/users/update', {data: {
                    toModifyUsers : toModifyUsers
                }})
                .then(() => {
                    this.$buefy.dialog.alert({
                        title: 'Succes',
                        message: "Le(s) utilisateur(s) ont bien été modifiés",
                        type: 'is-success',
                        ariaRole: 'alertdialog',
                        ariaModal: true,
                        onConfirm : () => {this.updateList()}
                    })
                })
                .catch(() => {
                    this.$buefy.dialog.alert({
                        title: 'ERREUR',
                        message: "Il y a eu une erreur pour modifier l'utilisateurs, merci de contacter un routier",
                        type: 'is-danger',
                        hasIcon: true,
                        icon: 'times-circle',
                        iconPack: 'fa',
                        ariaRole: 'alertdialog',
                        ariaModal: true
                    })
                })
        },
        updateList() {
            this.$axios.get(this.$backend + '/users/list')
                .then(resp => {
                    this.users = resp.data
                            .sort((a, b) => a.pseudo.localeCompare(b.pseudo))
                            .map((user) => {
                                user.birthday = new Date(user.birthday*1000);
                                this.usersHashes[user.id] = JSON.stringify(user);
                                return user;
                            });
                    this.clear();
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
    },
    beforeMount() {
        this.updateList()
    }
}
</script>

<style scoped>
.centered {
    margin: auto;
}
</style>