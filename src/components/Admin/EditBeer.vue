<template>
    <div class="centered">
        <b-table :data="beers">
            <b-table-column
                label="N°"
                v-slot="props"
                field="id"
                width="6vw">
                <div class="centered">
                    {{ props.row.id }}
                </div>
            </b-table-column>
            <b-table-column
                label="Nom"
                v-slot="props"
                field="name"
                width="15vw">
                <b-field>
                    <b-input v-model="props.row.name" placeholder="Nom de la bière"></b-input>
                </b-field>
            </b-table-column>
            <b-table-column
                label="Prix"
                v-slot="props"
                field="price"
                width="12vw">
                <b-field>
                    <b-numberinput v-model="props.row.price" placeholder="Prix" type="is-light" min="0" step="1"></b-numberinput>
                </b-field>
            </b-table-column>
            <b-table-column
                label="Degré"
                v-slot="props"
                field="degre"
                width="12vw">
                <b-field>
                    <b-numberinput v-model="props.row.degre" placeholder="Degré" type="is-light" min="0" step="0.1"></b-numberinput>
                </b-field>     
            </b-table-column>
            <b-table-column
                label="Volume (L)"
                v-slot="props"
                field="volume"
                width="12vw">
                <b-field>
                    <b-numberinput v-model="props.row.degre" placeholder="Volume" type="is-light" min="0" step="0.01"></b-numberinput>
                </b-field>
            </b-table-column>
        </b-table>
        <br/>
        <br/>
        <br/>
        <b-button @click="printBoard" size="is-medium" type="is-success">Valider</b-button>
    </div>
</template>

<script>
export default {
  name: 'BeerCard',
  data() {
      return {
          beers : [
              {id:0, name:"Jupiler", price:2, degre:5.2, volume:0.25},
              {id:1, name:"Jupiler", price:2, degre:5.2, volume:0.25},
              {id:2, name:"Jupiler", price:2, degre:5.2, volume:0.25},
              {id:3, name:"Jupiler", price:2, degre:5.2, volume:0.25},
              {id:4, name:"Jupiler", price:2, degre:5.2, volume:0.25},
              {id:5, name:"Jupiler", price:2, degre:5.2, volume:0.25},
              {id:6, name:"Jupiler", price:2, degre:5.2, volume:0.25},
              {id:7, name:"Jupiler", price:2, degre:5.2, volume:0.25},
          ]
      }
  },
  props: {
    // name: String,
    // price: Number,
    // degre : Number,
  },
  methods : {
      getResponses() {
          return this.beers.map((e) => {
              return {
                  id : e.id,
                  name : e.name,
                  price : e.price,
                  degre : e.degre,
                  volume : e.volume
              }
          })
      },
      printBoard() {
          console.log(this.getResponses());
      }
  }
}
</script>

<style scoped>
.centered {
    margin: auto;
}
</style>