<template>
    <div class="card beer">
        <div class="card-image">
            <figure class="image is-4by3">
            <img src="https://bulma.io/images/placeholders/1280x960.png" alt="Placeholder image">
            </figure>
        </div>
        <div class="card-content">
            <div class="media">
                <div class="media-content">
                    <p class="title is-4">{{ name }}</p>
                </div>
                <div class="media-right">
                    {{ degre }}°
                </div>
            </div>

            <div class="content">
                {{ price }} croix
            <br>
            </div>
        </div>
          <footer class="card-footer">
            <b-button class="card-footer-item" type="is-info is-inverted" @click="() => {buyBeer(1)}">Acheter 1</b-button>
            <b-button class="card-footer-item" type="is-info is-inverted" @click="() => {buyBeer(2)}">Acheter 2</b-button>
            <b-button class="card-footer-item" type="is-info is-inverted" @click="setQuantity">Acheter +</b-button>
        </footer>
    </div>
</template>

<script>

const {ipcRenderer} = window.require("electron")

export default {
  name: 'BeerCard',
  props: {
    beerId: Number,
    name: String,
    price: Number,
    degre : Number,
    image : String,
    userId : Number
  },
  methods : {
      buyBeer(quantity) {
        console.log(this.$route.params.userId);
        this.$buefy.dialog.confirm({
            title: 'Veuillez confirmer',
            message: `Êtes vous sûr de vouloir achter ${quantity} ${this.name} ?
            <br>
            (ça vous coutera ${this.price * quantity} croix)`,
            cancelText: 'Non',
            confirmText: 'Oui',
            type: 'is-success',
            onConfirm: () => {
                ipcRenderer.once("buyReply", (event, resp) => {
                    if (resp.error) {
                        this.$buefy.dialog.alert({
                            title: 'ERREUR',
                            message: "Il y a eu une erreur pour acherter le(s) bière(s), merci de contacter un routier",
                            type: 'is-danger',
                            hasIcon: true,
                            icon: 'times-circle',
                            iconPack: 'fa',
                            ariaRole: 'alertdialog',
                            ariaModal: true
                        })

                    } else {
                        this.$buefy.toast.open(`Vous avez bien acheté ${quantity} ${this.name} (${quantity*this.price} croix)`)
                        this.$router.go(-1)
                    }
                })
                ipcRenderer.send("buy", this.$route.params.userId, this.beerId, quantity);

            }
        })
      },
      setQuantity() {
            this.$buefy.dialog.prompt({
                message: `Combien en voulez vous ?`,
                inputAttrs: {
                    type: 'number',
                    placeholder: 'Entrez le nombre',
                    value:  '3',
                    min: 1,
                    max: 69
                },
                type: 'is-success',
                trapFocus: true,
                onConfirm: (value) => this.buyBeer(value)
            })
        },
  }
}
</script>

<style scoped>
.beer {
    margin: 5px;
    width: 20vw;
}
</style>