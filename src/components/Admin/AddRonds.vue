<template>
    <div class="content">
        <br/>
        <h1 class="title">Ajouter des ronds</h1>
        <b-field label="Trouver un utilisateur">
            <b-autocomplete
                v-model="query"
                :data="filteredDataArray"
                icon="magnify"
                open-on-focus="true"
                size="is-medium" 
                clearable
                @select="option => selected = option">
                <template #empty>No results found</template>
            </b-autocomplete>
        </b-field>
        <div v-if="selected != undefined">
            <br/>
            <b-field :label="`Nombre de ronds à ajouter (1 rond = ${prixRond.toString()} €)`">
                <b-numberinput
                    v-model="number" 
                    size="is-medium" 
                    type="is-light"
                    min="0"
                    step="1"
                    ></b-numberinput>
            </b-field>
            <br/>
            <b-button @click="addRonds">Valider</b-button>
        </div>
    </div>
</template>

<script>

const {ipcRenderer} = window.require("electron")

// https://stackoverflow.com/questions/3885817/how-do-i-check-that-a-number-is-float-or-integer
function isInt(n) {
   return n % 1 === 0;
}
export default {
    name : "AddRonds",
    data() {
        return {
            prixRond : 0.7,
            number : 10,
            query : '',
            selected : undefined,
            users : []
        }
    },
    computed: {
        filteredDataArray() {
            return this.users.filter((option) => {
                return option
                    .toString()
                    .toLowerCase()
                    .indexOf(this.query.toLowerCase()) >= 0
            })
        }
    },
    methods: {
        addRonds() {
            if (this.number > 0 && isInt(this.number)) {
                this.$buefy.dialog.confirm({
                    title: 'Veuillez confirmer',
                    message: `Êtes vous sûr de vouloir ajouter ${this.number} croix à ${this.selected} ?
                    <br>
                    (ça lui coutera ${this.number * this.prixRond} €)`,
                    cancelText: 'Non',
                    confirmText: 'Oui',
                    type: 'is-success',
                    onConfirm: () => {
                        ipcRenderer.once('addRondReply', (event, resp) => {
                            if (resp.error) {
                                this.$buefy.dialog.alert({
                                    title: 'ERREUR',
                                    message: 'Il y a eu une erreur pour ajouter les ronds, merci de contacter un routier',
                                    type: 'is-danger',
                                    hasIcon: true,
                                    icon: 'times-circle',
                                    iconPack: 'fa',
                                    ariaRole: 'alertdialog',
                                    ariaModal: true
                                })
                            } else {
                                this.$buefy.toast.open(`Les ${this.number} croix on bien été ajouté à ${this.selected}`)
                                this.selected = undefined
                                this.number = 10
                                this.query = ''
                            }
                        });
                        ipcRenderer.send('addRond', this.selected, this.number);
                    }
                })
            }
        }
    },
    beforeMount() {
        ipcRenderer.on('getPseudosReply', (event, resp) => {
            if (resp.error) {
                this.$buefy.dialog.alert({
                    title: 'ERREUR',
                    message: 'Il y a eu une erreur récupérer les pseudos, merci de contacter un routier',
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
        ipcRenderer.send('getPseudos')
    }
}
</script>

<style scoped>
.content {
    margin: auto;
    align-items: center;
    text-align: center;
}
</style>