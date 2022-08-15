<template>
    <div class="centered">
        <b-table :data="displayedBeers">
            <b-table-column
                label="Disponible ?"
                field="delete"
                v-slot="props"
                width="3vw">
                <b-field>
                    <b-switch 
                        v-model="props.row.isAvailable"
                        :value="props.row.isAvailable"
                        type="is-success">
                    </b-switch>
                </b-field>
            </b-table-column>
            <b-table-column
                label="Nom"
                v-slot="props"
                field="name"
                width="15vw">
                <b-field
                    :type="isBeerNameUnique(props.row.name)? '': 'is-danger'"
                    :message="isBeerNameUnique(props.row.name)? '': 'Le nom de la bière est utilisé plusieurs fois'">
                    <b-input 
                        v-model="props.row.name" 
                        placeholder="Nom de la bière">
                    </b-input>
                </b-field>
            </b-table-column>
            <b-table-column
                label="Prix (en croix)"
                v-slot="props"
                field="price"
                width="12vw">
                <b-field>
                    <b-numberinput 
                        v-model="props.row.price" 
                        placeholder="Prix" 
                        type="is-light" 
                        min="0" 
                        step="1">
                    </b-numberinput>
                </b-field>
            </b-table-column>
            <b-table-column
                label="Degré"
                v-slot="props"
                field="degre"
                width="12vw">
                <b-field>
                    <b-numberinput 
                        v-model="props.row.degre" 
                        placeholder="Degré" 
                        type="is-light" 
                        min="0" 
                        step="0.1">
                    </b-numberinput>
                </b-field>     
            </b-table-column>
            <b-table-column
                label="Volume (L)"
                v-slot="props"
                field="volume"
                width="12vw">
                <b-field>
                    <b-numberinput 
                        v-model="props.row.volume" 
                        placeholder="Volume" 
                        type="is-light" 
                        min="0" 
                        step="0.1"
                        min-step="0.01">
                    </b-numberinput>
                </b-field>
            </b-table-column>
            <b-table-column
                label=""
                field="image"
                v-slot="props"
                width="3vw">
                <b-field>
                    <b-button
                        icon-right="image-edit" 
                        @click="() => {launchImageEdit(props.row)}"
                        />
                </b-field>
            </b-table-column>
            <b-table-column
                label=""
                field="delete"
                v-slot="props"
                width="3vw">
                <b-field>
                    <b-button type="is-danger"
                        icon-right="delete" 
                        @click="() => {deleteBeer(props.row.id)}"
                        />
                </b-field>
            </b-table-column>
        </b-table>
        <br/>
        <br/>
        <br/>
        <b-button @click="addBeer" size="is-medium">Ajouter une bière</b-button>
        <b-button @click="apply" size="is-medium" type="is-success">Valider</b-button>
        <b-button @click="clear" size="is-medium" type="is-warning">Annuler</b-button>

        <b-modal v-model="selectedBeer" :width="640" scroll="keep">
            <div class="card">
                <div class="card-image">
                    <figure class="image is-4by3">
                        <img 
                            v-if="selectedImage" 
                            :src="selectedImage" 
                            alt="Error displaying image">
                        <img v-else src="https://bulma.io/images/placeholders/1280x960.png" alt="Image">
                    </figure>
                </div>
                <div class="card-content">
                    <div class="media">
                        <div class="media-content">
                            <p class="title is-4">Changer l'image de la bière</p>
                        </div>
                    </div>

                    <div class="content">
                        <b-field>
                            <b-upload 
                                @input="handleImage"
                                v-model="dropFile"
                                drag-drop
                                >
                                <section class="section">
                                    <div class="content has-text-centered">
                                        <p>
                                            <b-icon
                                                icon="upload"
                                                size="is-large">
                                            </b-icon>
                                        </p>
                                        <p>Clique pour changer l'image</p>
                                    </div>
                                </section>
                            </b-upload>
                        </b-field>
                        <b-button @click="applyImage" size="is-medium" type="is-success">Valider</b-button>
                        <b-button @click="cancelImage" size="is-medium" type="is-warning">Annuler</b-button>
                    </div>
                </div>
            </div>
        </b-modal>
    </div>
</template>

<script>

const {ipcRenderer} = window.require("electron")
const base64Img = window.require("base64-img")

export default {
    name: 'BeerCard',
    data() {
        return {
            beerHashes : {},
            displayedBeers : [],
            beers : [],
            selectedBeer : null,
            dropFile : null,
            selectedImage : null
        }
    },
    methods : {
        isBeerNameUnique(name) {
            return this.displayedBeers
                .filter((beer) => {
                return beer.name
                    .toString()
                    .toLowerCase()
                    .localeCompare(name.toLowerCase()) == 0
            }).length === 1;
        },
        launchImageEdit(beer) {
            this.selectedBeer = beer;
            this.selectedImage = beer.image;
        },
        deleteBeer(beerId) {
            this.$buefy.dialog.confirm({
                title: 'Supprimer un utilisateur',
                message: "Êtes vous sûr de vouloir <b>supprimer</b> la bière ?",
                confirmText: "Supprimer la bière",
                cancelText : "Annuler",
                type: 'is-danger',
                hasIcon: true,
                onConfirm: () => {
                    ipcRenderer.on('removeBeerReply', (event, resp) => {
                        if (resp.error) {
                            this.$buefy.dialog.alert({
                                title: 'ERREUR',
                                message: "Il y a eu une erreur pour supprimer la bière, merci de contacter un routier",
                                type: 'is-danger',
                                hasIcon: true,
                                icon: 'times-circle',
                                iconPack: 'fa',
                                ariaRole: 'alertdialog',
                                ariaModal: true
                            })
                        } else {
                            this.updateList();
                        }
                    })
                    ipcRenderer.send('removeBeer', beerId)
                }
            })
        },
        addBeer() {
            this.displayedBeers.push({
                isAvailable : true,
                name : '',
                price : 1,
                degre : 0,
                volume : 0.25,
                image : ''
            })
        },
        formatBeersForDb(beers) {
            let resp = beers.map(a => {return {...a}})
            resp.forEach(beer => {
                console.log(`${beer.name} <=> ${beer.isAvailable} : ${+beer.isAvailable}`);
                beer.isAvailable = +beer.isAvailable
                });
            return resp;
        },
        apply() {
            let newBeers = this.formatBeersForDb(
                this.displayedBeers.filter((beer) => beer.id === undefined))
            let modifiedBeers = this.formatBeersForDb(this.displayedBeers
                .filter((beer) => 
                    (beer.id !== -1) 
                    && 
                    (JSON.stringify(beer)
                    .localeCompare(this.beerHashes[beer.id]) !== 0)))
            console.log("Modified beers");
            console.log(modifiedBeers);
            ipcRenderer.once('addBeersReply', (event, resp) => {
                if (resp.error) {
                    this.$buefy.dialog.alert({
                        title: 'ERREUR',
                        message: 'Il y a eu une erreur pour ajouter les bières, merci de contacter un routier',
                        type: 'is-danger',
                        hasIcon: true,
                        icon: 'times-circle',
                        iconPack: 'fa',
                        ariaRole: 'alertdialog',
                        ariaModal: true
                    })
                } else {
                    ipcRenderer.once("updateBeersReply", (event, resp) => {
                        if (resp.error) {
                            this.$buefy.dialog.alert({
                                title: 'ERREUR',
                                message: 'Il y a eu une erreur pour modifier les bières, merci de contacter un routier',
                                type: 'is-danger',
                                hasIcon: true,
                                icon: 'times-circle',
                                iconPack: 'fa',
                                ariaRole: 'alertdialog',
                                ariaModal: true
                            })
                        } else {
                            this.$buefy.dialog.alert({
                                title: 'Succes',
                                message: "Le(s) bière(s) ont bien été modifiés",
                                type: 'is-success',
                                ariaRole: 'alertdialog',
                                ariaModal: true,
                                onConfirm : () => {this.updateList()}
                            })
                        }
                    });
                    ipcRenderer.send("updateBeers", modifiedBeers);
                }
            });
            ipcRenderer.send('addBeers', newBeers);

        },
        clear() {
            this.displayedBeers = this.beers
                // https://stackoverflow.com/questions/597588/how-do-you-clone-an-array-of-objects-in-javascript
                .map(a => {return {...a}})
        },
        handleImage(file) {
            console.log("COUCOU");
            console.log(file);
            base64Img.base64(file.path, (err, data) => {
                if (err) console.log(err);
                else {
                    this.selectedImage = data;
                }
            })
        },
        applyImage() {
            this.selectedBeer.image = this.selectedImage;
            this.cancelImage();
        },
        cancelImage() {
            this.selectedBeer = null;
            this.selectedImage = null;
        },
        updateList() {
            ipcRenderer.once('getBeersReply', (event, resp) => {
                if (resp.error) {
                    this.$buefy.dialog.alert({
                        title: 'ERREUR',
                        message: 'Il y a eu une erreur pour récupérer les bières, merci de contacter un routier',
                        type: 'is-danger',
                        hasIcon: true,
                        icon: 'times-circle',
                        iconPack: 'fa',
                        ariaRole: 'alertdialog',
                        ariaModal: true
                    })
                } else {
                    this.beers = resp.data;
                    this.beers.forEach((beer) => {
                        beer.isAvailable = Boolean(beer.isAvailable);
                        this.beerHashes[beer.id] = JSON.stringify(beer);
                        })
                    this.clear();
                }
            })
            ipcRenderer.send('getBeers')
        }
    },
    beforeMount() {
        this.updateList()
    },
}
</script>

<style scoped>
.centered {
    margin: auto;
}
</style>