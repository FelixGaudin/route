<template>
    <b-navbar class="navbar" shadow="true" style="height : 5rem" transparent="true">
        <template #brand>
            <b-navbar-item tag="router-link" :to="{ path: '/' }">
                <img
                    class="navbar-img"
                    src="@/assets/routeicon.png"
                    alt="La route"
                >
            </b-navbar-item>
        </template>
        <template #start>
            <b-navbar-item tag="router-link" :to="{ path: '/' }">
                <span>
                    Classement
                </span>
            </b-navbar-item>
            <b-navbar-item href="#" @click="goToRoutier">
                <span>
                    Menu routier
                </span>
            </b-navbar-item>
        </template>

        <template #end>
            <b-navbar-item tag="div">
                <div class="buttons">
                    <a class="button is-danger" @click="close">
                        <span>
                            <strong>Quitter</strong>
                        </span>
                    </a>
                </div>
            </b-navbar-item>
        </template>
    </b-navbar>
</template>

<script>

const {ipcRenderer} = window.require("electron")


export default {
  name: 'Navbar',
  methods : {
    goToRoutier() {
        this.$buefy.dialog.prompt({
            message: 'Entrez le mot de passe routier',
            inputAttrs: {
                type: 'password',
                placeholder: 'My message is...',
            },
            cancelText: 'Retour',
            confirmText: 'Valider',
            trapFocus: true,
            closeOnConfirm: false,
            onConfirm: (value, {close}) => {
                this.$buefy.toast.open(`Your message is sending...`)
                setTimeout(() => {
                    this.$buefy.toast.open(`Bievenue !`)
                    close()
                    this.$router.push('/admin')
                }, 1000)
            }
        })
    },
    close() {
        ipcRenderer.send('close')
    }
  }
}
</script>

<style scoped>
.navbar-img {
    width: 4.5rem;
    height: 4.5rem
}
.navbar-item img {
    max-height: 4.5rem !important;
}
.navbar {
    margin-bottom: 5vh;
}

</style>