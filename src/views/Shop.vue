<template>
    <div class="shop">
        <span>User = {{ $route.params.user }}</span>
        <div class="beerList">
            <div v-for="beer in beers" :key="beer.name">
                <BeerCard :name="beer.name" :price="beer.price" :degre="beer.degre"/>
            </div>
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
        beers : [
        {
            "name": "Barbar",
            "price": 2,
            "image": "barbar.png",
            "degre": 8,
        },
        {
            "name": "Carapils",
            "price": 1,
            "image": "carapils.png",
            "degre": 4.4,
        },
        {
            "name": "Chimay Bleu",
            "price": 3,
            "image": "chimay_bleu.png",
            "degre": 7,
        },
        {
            "name": "Chouffe",
            "price": 3,
            "image": "chouffe.png",
            "degre": 8,
        },
        {
            "name": "Ciney",
            "price": 2,
            "image": "ciney.png",
            "degre": 7,
        },
        {
            "name": "Cuvé des troll",
            "price": 2,
            "image": "cuveTroll.png",
            "degre": 7,
        },
        {
            "name": "Jupiler",
            "price": 1,
            "image": "jupiler.png",
            "degre": 5.2,
        },
        {
            "name": "Kasteel rouge",
            "price": 3,
            "image": "kasteelRouge.png",
            "degre": 8,
        },
        {
            "name": "Kriek",
            "price": 2,
            "image": "kriek.png",
            "degre": 5.2,
        },
        {
            "name": "Maes",
            "price": 1,
            "image": "maes.png",
            "degre": 5.2,
        },
        {
            "name": "Bush Caractère",
            "price": 3,
            "image": "triple_hop.png",
            "degre": 12,
        }
    ],
      }
  },
  methods : {
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