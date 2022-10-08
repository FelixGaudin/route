<template>
    <div class="shop">
        <div class="search">
            <b-field label="Chercher">
                <b-input v-model="query" @input="search()"></b-input>
            </b-field>
        </div>
        <div class="beerList">
            <div v-for="beer in filterBySearch()" :key="beer.name">
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
        balance : 0,
        beers : [],
        query : ''
      }
  },
  methods : {
    search() {this.query = this.query.trim()},
    filterBySearch() {
            if (this.query != '')
                return this.beers.filter((beer) => {
                    return beer.name
                            .toString()
                            .normalize("NFD")
                            .replace(/[\u0300-\u036f]/g, "")
                            .toLowerCase()
                            .indexOf(
                                this.query
                                    .toLowerCase()
                                    .normalize("NFD")
                                    .replace(/[\u0300-\u036f]/g, "")
                                ) >= 0
                    })
            else return this.beers
        },
  },
  beforeMount() {
    this.balance = JSON.parse(this.$route.params.infos).balance;
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
            this.beers = resp.data.filter(b => this.balance >= b.price);
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

.search {
    width: 50vw;
    margin: auto;
}
</style>