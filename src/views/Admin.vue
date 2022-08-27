<template>
    <div class="content">
        <!-- <ExAlignments/> TODO:fix this-->
            <b-tabs v-model="activeTab" position="is-centered">
              <b-tab-item label="Ajouter des ronds">
                <AddRonds/>
              </b-tab-item>
              <b-tab-item label="Modifier les bières">
                <EditBeer/>
              </b-tab-item>
              <b-tab-item label="Statistiques">
                <Stats/>
              </b-tab-item>
              <b-tab-item label="Nouvel alcoolique">
                <AddUser/>
              </b-tab-item>
              <b-tab-item label="Modifier les alcooliques">
                  <EditUser/>
              </b-tab-item>
            </b-tabs>
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
        activeTab : 0,
    };
  }
};
</script>

<style scoped>
.content {
  margin: auto;
  align-self: center;
  width:fit-content
}
</style>