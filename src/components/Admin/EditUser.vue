<template>
    <div class="centered">
        <b-table :data="users">
            <b-table-column
                label="Pseudo"
                v-slot="props"
                field="pseudo"
                width="6vw">
                <b-field>
                    <b-input v-model="props.row.pseudo" placeholder="Pseudo"></b-input>
                </b-field>
            </b-table-column>
            <b-table-column
                label="Nom"
                v-slot="props"
                field="name"
                width="6vw">
                <b-field>
                    <b-input v-model="props.row.name" placeholder="Nom"></b-input>
                </b-field>
            </b-table-column>
            <b-table-column
                label="Prénom"
                v-slot="props"
                field="firstName"
                width="6vw">
                <b-field>
                    <b-input v-model="props.row.firstName" placeholder="Prénom"></b-input>
                </b-field>
            </b-table-column>
            <b-table-column
                label="Totem"
                v-slot="props"
                field="totem"
                width="6vw">
                <b-field>
                    <b-input v-model="props.row.totem" placeholder="Totem"></b-input>
                </b-field>
            </b-table-column>
            <b-table-column
                label="Quali"
                v-slot="props"
                field="quali"
                width="6vw">
                <b-field>
                    <b-input v-model="props.row.quali" placeholder="Quali"></b-input>
                </b-field>
            </b-table-column>
            <b-table-column
                label="Staff"
                v-slot="props"
                field="staff"
                width="6vw">
                <b-field>
                    <b-select 
                        placeholder="Staff" 
                        v-model="props.row.staff">
                        <option 
                            v-for="staff in staffs"
                            :value="staff"
                            :key="staff">
                            {{ staff }}
                        </option>
                    </b-select>
                </b-field>
            </b-table-column>
            <b-table-column
                label="Sexe"
                v-slot="props"
                field="sex"
                width="6vw">
                <b-field>
                    <b-select 
                        placeholder="Sexe" 
                        v-model="props.row.sex">
                        <option value="Homme">Homme</option>
                        <option value="Femme">Femme</option>
                        <option value="Autres">Autre</option>
                    </b-select>
                </b-field>
            </b-table-column>
            <b-table-column
                label="Sexe"
                v-slot="props"
                field="sex"
                width="12vw">
                <b-field>
                    <b-datepicker
                        v-model="props.row.birthday"
                        placeholder="Date d'anniversaire"
                        icon="calendar-today"
                        trap-focus>
                    </b-datepicker>
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
  name: 'EditUser',
  data() {
      return {
          users : [
              {
                pseudo : 'Basenji',
                name : 'Gaudin',
                firstName : 'Félix',
                totem : 'Basenji',
                quali : 'Ayahuasca',
                staff : 'Pi 2',
                sex : 'Homme',
                birthday: undefined,
              },
              {
                pseudo : 'Dibatag',
                name : 'Gaudin',
                firstName : 'Félix',
                totem : 'Basenji',
                quali : 'Ayahuasca',
                staff : 'Pi 2',
                sex : 'Homme',
                birthday: undefined,
              },
              {
                pseudo : 'Lion',
                name : 'Gaudin',
                firstName : 'Félix',
                totem : 'Basenji',
                quali : 'Ayahuasca',
                staff : 'Pi 2',
                sex : 'Homme',
                birthday: undefined,
              },
          ],
          staffs : [
              'Aucun',
              'Broceliande',
              'Petit Bonheur',
              'Mowha',
              'Waigunga',
              'Seeonee',
              'ODC',
              'Orion',
              'Pi 1',
              'Pi 2',
              'Route',
              "Chefs d'u",
              'Ancien'
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
          return this.users.map((e) => {
              return {
                  pseudo : e.pseudo,
                  name : e.name,
                  firstName : e.firstName,
                  totem : e.totem,
                  quali : e.quali,
                  staff : e.staff,
                  sex : e.sex,
                  birthday : e.birthday,
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