<template>
    <div class="centered">
        <b-table :data="displayedUsers">
            <b-table-column
                label=""
                field="delete"
                v-slot="props"
                width="6vw">
                <b-field>
                    <b-button type="is-danger"
                        icon-right="delete" 
                        @click="() => {deleteUser(props.row.oldPseudo)}"
                        />
                    <!-- <b-input v-model="props.row.pseudo" placeholder="Pseudo"></b-input> -->
                </b-field>
            </b-table-column>
            <b-table-column
                label="Pseudo"
                v-slot="props"
                field="pseudo"
                width="6vw">
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
                width="12vw">
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

const {ipcRenderer} = window.require("electron")

export default {
    name: 'EditUser',
    data() {
        return {
            // to remove list
            // modified list
            // list of the "hashes" of the users before being modified
            usersHashes : {},
            users : [],
            displayedUsers : [],
            toDeleteUsers : new Set(),
            staffs : [
                'Aucun',
                'Broceliande',
                'Petit Bonheur',
                'Mowha',
                'Waigunga',
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
    props: {
        // name: String,
        // price: Number,
        // degre : Number,
    },
    methods : {
        isPseudoUnique(pseudo) {
            let v = this.displayedUsers
                .filter((user) => {
                return user.pseudo
                    .toString()
                    .toLowerCase()
                    .localeCompare(pseudo.toLowerCase()) == 0
            }).length;
            return v === 1;
        },
        refreshDisplay() {
            this.displayedUsers = this.users
                // https://stackoverflow.com/questions/597588/how-do-you-clone-an-array-of-objects-in-javascript
                .map(a => {return {...a}}) 
        },
        clear() {
            this.toDeleteUsers = new Set();
            this.refreshDisplay()
        },
        deleteUser(pseudo) {
            this.$buefy.dialog.confirm({
                title: 'Supprimer un utilisateur',
                message: "Êtes vous sûr de vouloir <b>supprimer</b> l'utilisateur ?",
                confirmText: "Supprimer l'utilisateur",
                cancelText : "Annuler",
                type: 'is-danger',
                hasIcon: true,
                onConfirm: () => {
                    ipcRenderer.on('removeUserReply', (event, resp) => {
                        if (resp.error) {
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
                        } else {
                            this.updateList();
                        }
                    })
                    ipcRenderer.send('removeUser', pseudo)
                }
            })
        },
        getResponses() {
            return this.users.map((e) => {
                return {
                    pseudo : e.pseudo,
                    name : e.name,
                    firstName : e.firstName,
                    totem : e.totem,
                    quali : e.quali,
                    staff : e.staff,
                    sex : e.sex,
                    birthday : e.birthday,
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
            let toModifyUser = this.displayedUsers
                // Get modified users
                .filter((user) => JSON.stringify(user).localeCompare(this.usersHashes[user.oldPseudo]) !== 0)
                // Deepcopy those users
                .map(a => {return {...a}})
                // Format the date
                .map((user) => {
                    let birthday = user.birthday
                    let timezoneOffset = birthday.getTimezoneOffset()*60;
                    user.birthday = Math.floor((birthday / 1000)-timezoneOffset)
                    return user;
                })
            ipcRenderer.once('updateUsersReply', (event, resp) => {
                if (resp.error) {
                    let errMsg;
                    if (resp.errorMessage === 19) {
                        this.formInputs.pseudo = '';
                        errMsg = 'Un pseudo est déjà utilisé'
                    } else {
                        errMsg = "Il y a eu une erreur pour modifier l'utilisateurs, merci de contacter un routier";
                    }
                    this.$buefy.dialog.alert({
                        title: 'ERREUR',
                        message: errMsg,
                        type: 'is-danger',
                        hasIcon: true,
                        icon: 'times-circle',
                        iconPack: 'fa',
                        ariaRole: 'alertdialog',
                        ariaModal: true
                    })
                } else {
                    this.$buefy.dialog.alert({
                        title: 'Succes',
                        message: "Le(s) utilisateur(s) ont bien été modifiés",
                        type: 'is-success',
                        ariaRole: 'alertdialog',
                        ariaModal: true,
                        onConfirm : () => {this.$router.go()}
                    })
                }
            })
            ipcRenderer.send('updateUsers', toModifyUser)
        },
        updateList() {
            ipcRenderer.once('getUsersReply', (event, resp) => {
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
                    this.users = resp.data.map((user) => {
                        user.birthday = new Date(user.birthday*1000);
                        user.oldPseudo = user.pseudo;
                        this.usersHashes[user.pseudo] = JSON.stringify(user);
                        return user;
                    });
                    this.refreshDisplay();
                }
            })
            ipcRenderer.send('getUsers')
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