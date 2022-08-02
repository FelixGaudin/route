<template>
    <div class="form">
        <br/>
        <h1 class="title form-row">Ajouter un alcoolique</h1>
        <div class="form-row">
            <!-- Pseudo -->

            <b-field label="Pseudo"
                required
                class="form-field"
                :type="isPseudoUnique() ? '' : 'is-danger'"
                :message="isPseudoUnique() ? '' : 'Ce pseudo est déjà utilisé'">
                <b-input 
                    size="is-medium" 
                    v-model="formInputs.pseudo"
                    ></b-input>
            </b-field>

            <!-- Staff -->

            <b-field label="Staff" class="form-field">
                <b-select 
                    required
                    size="is-medium" 
                    placeholder="Staff" 
                    v-model="formInputs.staff"
                    class="fix-select">
                    <option 
                        v-for="staff in staffs"
                        :value="staff"
                        :key="staff">
                        {{ staff }}
                    </option>
                </b-select>
            </b-field>
        </div>

        <div class="form-row">
            <!-- Nom -->
            <b-field label="Nom" class="form-field">
                <b-input 
                    required
                    size="is-medium" 
                    v-model="formInputs.name"></b-input>
            </b-field>

            <!-- Prénom -->
            <b-field label="Prénom" class="form-field">
                <b-input 
                    required
                    size="is-medium" 
                    v-model="formInputs.firstName"></b-input>
            </b-field>
        </div>

        <div class="form-row">
            <!-- Totem -->
            <b-field label="Totem" class="form-field">
                <b-input 
                    required 
                    size="is-medium" 
                    v-model="formInputs.totem"></b-input>
            </b-field>

            <!-- Quali -->
            <b-field label="Quali" class="form-field">
                <b-input 
                    required
                    size="is-medium" 
                    v-model="formInputs.quali"></b-input>
            </b-field>
        </div>

        <div class="form-row">
            <!-- Sexe -->
            <b-field label="Sexe" class="form-field">
                <b-select 
                    required
                    size="is-medium" 
                    placeholder="Sexe" 
                    v-model="formInputs.sex">
                    <option value="m">Homme</option>
                    <option value="f">Femme</option>
                    <option value="o">Autre</option>
                </b-select>
            </b-field>

            <!-- Annif -->
            <b-field label="Date d'anniversaire" class="form-field">
                <b-datepicker
                    required
                    size="is-medium"
                    v-model="formInputs.birthday"
                    placeholder="Date d'anniversaire"
                    icon="calendar-today"
                    :icon-right="formInputs.birthday != undefined ? 'close-circle' : ''"
                    icon-right-clickable
                    @icon-right-click="clearDate"
                    trap-focus>
                </b-datepicker>
            </b-field>
        </div>
        <br/>
        <br/>
        <div class="form-row">
            <b-button size="is-medium" @click="submit">Valider</b-button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'AddUser',
    data() {
        return {
            formInputs : {
                pseudo : '',
                name : '',
                firstName : '',
                totem : '',
                quali : '',
                staff : '',
                sex : '',
                birthday: undefined,
            },
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
    methods : {
        clearDate() {this.birthday = undefined},
        isPseudoUnique() {
            return true;
        },
        areInputsValid() {
            // Pseudo (must be unique)
            if (this.isPseudoUnique()) {
                console.log();
            }
            // Name, Firstname, Totem & quali BALEK
        },
        submit() {
            let resp = {
                pseudo    : this.formInputs['pseudo'],
                name      : this.formInputs['name'],
                firstName : this.formInputs['firstName'],
                totem     : this.formInputs['totem'],
                quali     : this.formInputs['quali'],
                staff     : this.formInputs['staff'],
                sex       : this.formInputs['sex'],
                birthday  : this.formInputs['birthday'],
            }
            console.log(resp);
        }
    },
}
</script>

<style>
.form {
    margin: auto;
}
.form-row {
    display: flex;
    flex-direction: row;
    justify-content: center;
    /* max-width: 22vw; */
}
.form-field {
    width: 12vw;
    margin: 10px;
}

select {
    background-color: rgba(0, 0, 0, 0) !important;
}
</style>