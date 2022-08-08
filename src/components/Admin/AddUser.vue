<template>
    <div class="form">
        <br/>
        <h1 class="title form-row">Ajouter un alcoolique</h1>
        <div class="form-row">
            <!-- Pseudo -->

            <b-field label="Pseudo"
                required
                class="form-field">
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
                    :date-formatter="dateFormatter"
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

const {ipcRenderer} = window.require("electron")

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
                sex : '',
                staff : '',
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
        dateFormatter(date) {
            return new Intl.DateTimeFormat("fr").format(date)
        },
        areInputsValid() {
            // Pseudo (must be unique)
            if (this.isPseudoUnique()) {
                console.log();
            }
            // Name, Firstname, Totem & quali BALEK
        },
        submit() {
            let birthday = this.formInputs['birthday']
            // set l'heure à midi pour éviter les soucis de timezone ?
            let timezoneOffset = birthday.getTimezoneOffset()*60;
            let birthday_formated = Math.floor((birthday / 1000)-timezoneOffset).toString()
            let resp = {
                pseudo    : this.formInputs['pseudo'],
                name      : this.formInputs['name'],
                firstName : this.formInputs['firstName'],
                totem     : this.formInputs['totem'],
                quali     : this.formInputs['quali'],
                staff     : this.formInputs['staff'],
                sex       : this.formInputs['sex'],
                birthday  : birthday_formated,
            }
            console.log(resp);
            ipcRenderer.on('addUserReply', (event, resp) => {
                if (resp.error) {
                    let errMsg;
                    console.log("HERE");
                    console.log(resp.error);
                    if (resp.errorMessage === 19) {
                        this.formInputs.pseudo = '';
                        errMsg = 'Le pseudo est déjà utilisé'
                    } else {
                        errMsg = "Il y a eu une erreur pour ajouter l'utilisateurs, merci de contacter un routier";
                    }
                    this.$buefy.dialog.alert({
                        title: 'ERREUR',
                        message: errMsg,
                        type: 'is-danger',
                        hasIcon: true,
                        icon: 'times-circle',
                        iconPack: 'fa',
                        ariaRole: 'alertdialog',
                        ariaModal: true
                    })
                } else {
                    this.$buefy.toast.open({
                        message: "L'utilisateur a bien été ajouté",
                        type: 'is-success'
                    })
                    this.$router.go()
                }
            })
            ipcRenderer.send('addUser', resp);
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