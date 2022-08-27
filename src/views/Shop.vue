<template>
    <div class="shop">
        <div class="beerList">
            <div v-for="beer in beers" :key="beer.name">
                <BeerCard 
                    :name="beer.name" 
                    :price="beer.price" 
                    :degre="beer.degre" 
                    :beerId="beer.id" 
                    :image="beer.image"
                    />
            </div>
        </div>
    </div>
</template>

<script>

const {ipcRenderer} = window.require("electron")

import BeerCard from '@/components/Shop/BeerCard.vue'

export default {
  name: 'Shop',
  components: {
    BeerCard
  },
  data() {
      return {
        rondLeft : 0,
        beers : [],
      }
  },
  methods : {
  },
  beforeMount() {
    this.rondLeft = JSON.parse(this.$route.params.infos).rondLeft;
    ipcRenderer.once("getAvailableBeersReply", (event, resp) => {
        if (resp.error) {
            this.$buefy.dialog.alert({
                title: 'ERREUR',
                message: "Il y a eu une erreur pour recupérer les bières, merci de contacter un routier",
                type: 'is-danger',
                hasIcon: true,
                icon: 'times-circle',
                iconPack: 'fa',
                ariaRole: 'alertdialog',
                ariaModal: true
            })
        } else {
            this.beers = resp.data.filter(b => this.rondLeft >= b.price);
        }
    });
    ipcRenderer.send("getAvailableBeers");
  }
}
</script>

<style>
.beerList {
    width: 70vw;
    margin: auto;
    margin-top: 30px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
}
.beer {
    margin: 10px;
    width: 300px;
    /* min-width: 100px; */
    /* max-height: 25vw; */
}
</style>