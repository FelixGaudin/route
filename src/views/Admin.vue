<template>
    <div class="content">
        <!-- <ExAlignments/> TODO:fix this-->
        <div>
            <b-button class="menu-button" size="is-large" @click="() => {setMenu('addRonds')}">Ajouter des croix</b-button>
            <b-button class="menu-button" size="is-large" @click="() => {setMenu('editBeer')}">Modifier les bières</b-button>
            <b-button class="menu-button" size="is-large" @click="() => {setMenu('stats')}"   >Statistiques</b-button>
            <b-button class="menu-button" size="is-large" @click="() => {setMenu('addUser')}" >Nouvel alcoolique</b-button>
            <b-button class="menu-button" size="is-large" @click="() => {setMenu('editUser')}">Modifier les alcooliques</b-button>
        </div>
        <AddRonds v-if="currentSelected == 'addRonds'"/>
        <AddUser  v-if="currentSelected == 'addUser'" />
        <EditBeer v-if="currentSelected == 'editBeer'"/>
        <EditUser v-if="currentSelected == 'editUser'"/>
        <Stats    v-if="currentSelected == 'stats'"   />
    </div>
</template>

<script>
// import ExAlignments from '@/components/BreadCrumRoute.vue'
import AddUser  from '@/components/Admin/AddUser.vue'
import AddRonds from '@/components/Admin/AddRonds.vue'
import EditBeer from '@/components/Admin/EditBeer.vue'
import EditUser from '@/components/Admin/EditUser.vue'
import Stats    from '@/components/Admin/Stats.vue'

export default {
  name: 'Route',
  components: {
    AddUser,
    AddRonds,
    EditBeer,
    EditUser,
    Stats
  },
  data() {
    return {
        currentSelected : undefined
    };
  },
  methods : {
      setMenu(selected) {
          if (selected == this.currentSelected) this.currentSelected = undefined
          else this.currentSelected = selected
      }
  }
};
</script>

<style scoped>
.content {
  margin: auto;
  align-self: center;
  width:fit-content
}
.fixed-width {
    width: 400px;    
}
.menu-button {
    margin: 20px;
}
</style>