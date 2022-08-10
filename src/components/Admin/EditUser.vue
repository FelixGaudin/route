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
                        @click="() => {deleteUser(props.row.pseudo)}"
                        />
                    <!-- <b-input v-model="props.row.pseudo" placeholder="Pseudo"></b-input> -->
                </b-field>
            </b-table-column>
            <b-table-column
                label="Pseudo"
                v-slot="props"
                field="pseudo"
                width="6vw">
                <b-field>
                    <b-input v-model="props.row.pseudo" placeholder="Pseudo"></b-input>
                </b-field>
            </b-table-column>
            <b-table-column
                label="Nom"
                v-slot="props"
                field="name"
                width="6vw">
                <b-field>
                    <b-input v-model="props.row.name" placeholder="Nom"></b-input>
                </b-field>
            </b-table-column>
            <b-table-column
                label="Prénom"
                v-slot="props"
                field="firstName"
                width="6vw">
                <b-field>
                    <b-input v-model="props.row.firstName" placeholder="Prénom"></b-input>
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
                        v-model="props.row.sex">
                        <option value="m">Homme</option>
                        <option value="f">Femme</option>
                        <option value="o">Autre</option>
                    </b-select>
                </b-field>
            </b-table-column>
            <b-table-column
                label="Sexe"
                v-slot="props"
                field="sex"
                width="12vw">
                <b-field>
                    <b-datepicker
                        v-model="props.row.birthday"
                        placeholder="Date d'anniversaire"
                        icon="calendar-today"
                        trap-focus>
                    </b-datepicker>
                </b-field>
            </b-table-column>

        </b-table>
        <br/>
        <br/>
        <br/>
        <b-button @click="printBoard" size="is-medium" type="is-success">Valider</b-button>
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
        refreshDisplay() {
            this.displayedUsers = this.users
                .filter(user => !this.toDeleteUsers.has(user.pseudo))
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
                    this.toDeleteUsers.add(pseudo)
                    this.refreshDisplay();
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
        printBoard() {
            console.log(this.getResponses());
        }
    },
    beforeMount() {
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
                // console.log(resp.data);
                this.users = resp.data.map((user) => {
                    user.birthday = new Date(user.birthday*1000);
                    return user;
                });
                // console.log(this.users);
                this.refreshDisplay();
            }
        })
        ipcRenderer.send('getUsers')
    }
}
</script>

<style scoped>
.centered {
    margin: auto;
}
</style>