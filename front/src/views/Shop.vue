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
            <h1 v-if="isEmpty()">No results !</h1>
        </div>
    </div>
</template>

<script>
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
    isEmpty() {
        for (const prop in this.filterBySearch()) {
            if (Object.hasOwn(this.filterBySearch(), prop)) {
                return false;
            }
        }
        return true;
    },
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
    this.$axios.get(this.$backend + '/beers/available')
        .then(resp => {
            this.beers = resp.data.filter(b => this.balance >= b.price);
            this.beers.forEach(beer => console.log(beer.name))
        })
        .catch(() => {
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
        })
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