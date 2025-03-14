<template>
    <div class="centered">
        <b-datetimepicker v-model="datetime" inline></b-datetimepicker>
        <b-button @click="apply" size="is-medium" type="is-success">Valider</b-button>
    </div>
</template>

<script>
export default {
    name:"Stats",
    data() {
        return {
            datetime: new Date()
        }
    },
    methods: {
        apply() {
            this.$axios.post(this.$backend + '/time', {
                datetime : this.datetime
            })
            .then(() => {
                this.$buefy.dialog.alert({
                    title: 'Succes',
                    message: "La date et l'heure ont été changé",
                    type: 'is-success',
                    ariaRole: 'alertdialog',
                    ariaModal: true,
                    onConfirm : () => {this.datetime = new Date()}
                })
            })
            .catch(() => {
                this.$buefy.dialog.alert({
                    title: 'ERREUR',
                    message: "Erreur",
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
}
</script>