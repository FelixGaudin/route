<template>
    <div>
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
                <b-navbar-item href="#" @click="goToGames">
                    <span>
                        Menu Jeux
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
    </div>
</template>

<script>

const {ipcRenderer} = window.require("electron")

const ModalForm = {
    props: ['user'],
    template: `
        <form action="">
            <div class="modal-card" style="width: auto">
                <header class="modal-card-head">
                    <p class="modal-card-title">Selectioner la personne</p>
                    <button
                        type="button"
                        class="delete"
                        @click="$emit('close')"/>
                </header>
                <section class="modal-card-body">
                    <b-field label="Email">
                        <b-autocomplete
                            v-model="user"
                            :data="filteredDataArray"
                            placeholder="Entrer le pseudo"
                            icon="magnify"
                            clearable
                            @select="option => selected = option">
                            <template #empty>No results found</template>
                        </b-autocomplete>
                    </b-field>
                </section>
                <footer class="modal-card-foot">
                    <b-button
                        label="Annuler"
                        @click="$emit('close')" />
                    <b-button
                        label="Go"
                        type="is-primary" />
                </footer>
            </div>
        </form>
    `
}

export default {
  name: 'Navbar',
  data() {
    return {
        showModal : false,
    }
  },
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
                // this.$buefy.toast.open(`Your message is sending...`)
                // setTimeout(() => {
                //     this.$buefy.toast.open(`Bievenue !`)
                //     close()
                //     this.$router.push('/admin')
                // }, 1000)
                if (value == "Jacuzzi") {
                    this.$buefy.toast.open(`Bienvenue !`)
                    close()
                    this.$router.push('/admin')
                }
            }
        })
    },
    goToGames() {
        // check if in shop 
        //      YES => already have user => to Games
        //      NO  => select user
        if (this.$route.params.infos) {
            this.$route.push("/games/"+this.$route.params.infos)
        } else {
            console.log("No infos :/");
            // this.showModal = true
            this.$buefy.modal.open({
                parent: this,
                component: ModalForm,
                hasModalCard: true,
                customClass: 'custom-class custom-class-2',
                trapFocus: true
            }
            )
        }
    },
    filteredDataArray() {
        return [
            "one","two"
        ]
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