<template>
    <div class="content">
        <br/>
        <h1 class="title">Ajouter des croix</h1>
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
            <b-field label="Nombre de croix à ajouter">
                <b-numberinput
                    v-model="number" 
                    size="is-medium" 
                    type="is-light"
                    min="0"
                    step="1"
                    ></b-numberinput>
            </b-field>
            <br/>
            <b-button @click="addCroix">Valider</b-button>
        </div>
    </div>
</template>

<script>
const CROIX_PRIX = 0.7
// https://stackoverflow.com/questions/3885817/how-do-i-check-that-a-number-is-float-or-integer
function isInt(n) {
   return n % 1 === 0;
}
export default {
    name : "AddCroix",
    data() {
        return {
            number : 10,
            query : '',
            selected : undefined,
            users : [
                "Basenji",
                "Baribal",
                "Dibatag",
                "Lion"
            ]
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
        addCroix() {
            if (this.number > 0 && isInt(this.number)) {
                
                this.$buefy.dialog.confirm({
                    title: 'Veuillez confirmer',
                    message: `Êtes vous sûr de vouloir ajouter ${this.number} croix à ${this.selected} ?
                    <br>
                    (ça lui coutera ${this.number * CROIX_PRIX} €)`,
                    cancelText: 'Non',
                    confirmText: 'Oui',
                    type: 'is-success',
                    onConfirm: () => {
                        this.$buefy.toast.open(`Les ${this.number} croix on bien été ajouté à ${this.selected}`)
                        this.selected = undefined
                        this.number = 10
                        this.query = ''
                    }
                })
            }
        }
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