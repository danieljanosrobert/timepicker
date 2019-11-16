<template>
  <v-container :style="setToFullScreen" fluid class="px-12 pb-0" id="container">
    <v-row class="pa-0 pt-8">

      <v-col cols="12" md="9" class="pa-0">
        <v-card :style="setToFullScreen">

          <v-col cols="12" class="pa-0">
            <v-card class="pa-0 brown lighten-4">
              <v-card-text class="text-center" style="font-size: 2em;"> Elérhetőségek beállításai </v-card-text>
            </v-card>
          </v-col>

          <form class="pa-6">
            <v-text-field
                    v-model="name"
                    label="Megjelenített név"
            ></v-text-field>

            <v-file-input v-model="image" accept="image/*" prepend-icon="" label="Profilkép"></v-file-input>
            <v-checkbox class="no-hover"
                        v-model="deleteImage"
                        :disabled="!!image"
                        label="Kép törlése"
            ></v-checkbox>

            <v-divider class="pb-6"></v-divider>

            <v-row class="pb-4">
              <v-col cols="12">
                <span class="headers">Telefon</span>
              </v-col>
              <v-row v-if="phoneNumbers[0]">
                <v-col v-for="(item, i) in phoneNumbers" :key="i" cols="12" class="py-0">
                  <v-row>
                    <v-col cols="5" class="py-0">
                      <v-text-field label="Telefonszám" v-model="item.number"></v-text-field>
                    </v-col>
                    <v-col cols="5" class="py-0">
                      <v-text-field label="Megjegyzés (Munkahelyi, mobil, ...)" v-model="item.comment"></v-text-field>
                    </v-col>
                    <v-col cols="6" sm="2" class="text-right ma-auto">
                      <v-btn block small outlined color="error" @click.stop="deletePhoneNumber(i)">Törlés</v-btn>
                    </v-col>
                  </v-row>
                  <v-divider></v-divider>
                </v-col>
              </v-row>

              <v-col cols="12" class="pb-0">
                <v-btn text @click.stop="addPhoneNumber()">+ Telefonszám hozzáadása</v-btn>
              </v-col>
            </v-row>

            <v-divider class="pb-6"></v-divider>

            <v-row class="pb-4">
              <v-col cols="12">
                <span class="headers">E-mail</span>
              </v-col>
              <v-row v-if="emails[0]">
                <v-col v-for="(item, i) in emails" :key="i" cols="12" class="py-0">
                  <v-row>
                    <v-col cols="5" class="py-0">
                      <v-text-field label="E-mail" v-model="item.email"></v-text-field>
                    </v-col>
                    <v-col cols="5" class="py-0">
                      <v-text-field label="Megjegyzés (Munkahelyi, otthoni, ...)" v-model="item.comment"></v-text-field>
                    </v-col>
                    <v-col cols="6" sm="2" class="text-right ma-auto">
                      <v-btn block small outlined color="error" @click.stop="deleteEmail(i)">Törlés</v-btn>
                    </v-col>
                  </v-row>
                  <v-divider></v-divider>
                </v-col>
              </v-row>

              <v-col cols="12" class="pb-0">
                <v-btn text @click.stop="addEmail()">+ E-mail hozzáadása</v-btn>
              </v-col>
            </v-row>

            <v-divider class="pb-6"></v-divider>

            <v-row class="pb-4">
              <v-col cols="12">
                <span class="headers">Cím</span>
              </v-col>
              <v-row v-if="addresses[0]">
                <v-col v-for="(item, i) in addresses" :key="i" cols="12" class="py-0">
                  <v-row>
                    <v-col cols="2" class="py-0">
                      <v-text-field label="Irányítószám" v-model="item.stateNumber"></v-text-field>
                    </v-col>
                    <v-col cols="4" class="py-0">
                      <v-text-field label="Város" v-model="item.city"></v-text-field>
                    </v-col>
                    <v-col cols="4" class="py-0">
                      <v-text-field label="Utca, házszám" v-model="item.streetAndNumber"></v-text-field>
                    </v-col>
                    <v-col cols="6" sm="2" class="text-right ma-auto">
                      <v-btn block small outlined color="error" @click.stop="deleteAddress(i)">Törlés</v-btn>
                    </v-col>
                  </v-row>
                  <v-divider></v-divider>
                </v-col>
              </v-row>

              <v-col cols="12" class="pb-0">
                <v-btn text @click.stop="addAddress()">+ Cím hozzáadása</v-btn>
              </v-col>
            </v-row>

            <v-divider class="pb-2"></v-divider>

            <v-text-field id="password" label="Mentéshez szükséges jelszó" v-model="password" name="password"
                          type="password"></v-text-field>

            <v-btn class="mr-4" @click="save">Mentés</v-btn>
          </form>

        </v-card>
      </v-col>

      <v-col cols="12" md="3" class="pa-0">
        <v-container class="pa-0">

          <v-col cols="12" class="pa-0">
            <v-card class=" brown lighten-4">
              <v-card-text class="text-center" style="font-size: 2em;"> Előnézet </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" class="contact-width-400">
            <v-card>
              <v-img :src="imageUrl" width="400px" height="300px" dark>

                <v-row dense class="float-right fill-height">
                  <v-col cols="12" class="text-right align-self-end">
                    <v-card-title class="white--text contact-name">
                      <div class="display-1">{{name}}</div>
                    </v-card-title>
                  </v-col>
                </v-row>
              </v-img>

              <v-list two-line>
                <template v-if="phoneNumbers[0]">
                  <v-list-item v-for="(item, i) in phoneNumbers" :key="`${i}${item.number}`">
                    <v-list-item-icon v-if="i === 0">
                      <v-icon color="indigo">mdi-phone</v-icon>
                    </v-list-item-icon>

                    <v-list-item-action v-else></v-list-item-action>

                    <v-list-item-content>
                      <v-list-item-title>{{item.number}}</v-list-item-title>
                      <v-list-item-subtitle>{{item.comment}}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </template>

                <v-divider inset></v-divider>

                <template v-if="emails[0]">
                  <v-list-item v-for="(item, i) in emails" :key="`${i}${i}${item.email}`">
                    <v-list-item-icon v-if="i === 0">
                      <v-icon color="indigo">mdi-email</v-icon>
                    </v-list-item-icon>

                    <v-list-item-action v-else></v-list-item-action>

                    <v-list-item-content>
                      <v-list-item-title>{{item.email}}</v-list-item-title>
                      <v-list-item-subtitle>{{item.comment}}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </template>

                <v-divider inset></v-divider>

                <template v-if="addresses[0]">
                  <v-list-item v-for="(item, i) in addresses" :key="`${i}${i}${i}${item.streetAndNumber}`">
                    <v-list-item-icon v-if="i === 0">
                      <v-icon color="indigo">mdi-map-marker</v-icon>
                    </v-list-item-icon>

                    <v-list-item-action v-else></v-list-item-action>

                    <v-list-item-content>
                      <v-list-item-title>{{item.streetAndNumber}}</v-list-item-title>
                      <v-list-item-subtitle>{{item.stateNumber}} {{item.city}} </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </template>
              </v-list>

              <v-divider></v-divider>

            </v-card>
          </v-col>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import settingsService from '@/service/settingsService';

  const DEFAULT_IMAGE_URL = 'https://res.cloudinary.com/timepicker/image/upload/v1573509010/profiles/profile_tcgkwt.png';

  export default {
    name: 'ContactSettings',
    data: () => ({
      name: '',
      image: null,
      password: null,
      deleteImage: false,
      imageUrl: DEFAULT_IMAGE_URL,
      phoneNumbers: [],
      emails: [],
      addresses: [],
    }),
    watch: {
      image(img) {
        if (img) {
          this.deleteImage = false;
        }
      },
    },
    async mounted() {
      await this.fetchContactSettings();
    },
    computed: {
      setToFullScreen() {
        return {
          'min-height': `${window.innerHeight}px`,
        };
      },
    },
    methods: {
      async fetchContactSettings() {
        this.password = '';
        this.imageUrl = DEFAULT_IMAGE_URL;
        await settingsService.getContactSettings({
          user_email: this.$store.state.loggedInUserEmail,
        }).then( (contact) => {
          this.name = contact.data.name;
          this.phoneNumbers = contact.data.phoneNumbers;
          this.emails = contact.data.emails;
          this.addresses = contact.data.addresses;
          if (contact.data.image_url) {
            this.imageUrl = contact.data.image_url;
          }
        });
      },
      addPhoneNumber() {
        this.phoneNumbers.push({number: '', comment: ''});
      },
      addEmail() {
        this.emails.push({email: '', comment: ''});
      },
      addAddress() {
        this.addresses.push({stateNumber: '', city: '', streetAndNumber: ''});
      },
      deletePhoneNumber(index) {
        this.phoneNumbers.splice(index, 1);
      },
      deleteEmail(index) {
        this.emails.splice(index, 1);
      },
      deleteAddress(index) {
        this.addresses.splice(index, 1);
      },
      async save() {
        const formData = new FormData();

        formData.append('user_email', this.$store.state.loggedInUserEmail);
        formData.append('name', this.name);
        formData.append('phoneNumbers', JSON.stringify(this.phoneNumbers));
        formData.append('emails', JSON.stringify(this.emails));
        formData.append('addresses', JSON.stringify(this.addresses));
        formData.append('password', this.password);
        formData.append('deleteImage', this.deleteImage);
        if (this.image) {
          formData.append('image', this.image, this.image.name);
        }

        await settingsService.saveContact(formData);
        this.fetchContactSettings();
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/styles/variables.scss';

  #container {
    background-color: $_yellow;
  }

  .headers{
    font-size: 1.3em;
  }

  .contact-width-400 {
    width: 400px;
    margin: auto;
  }

</style>
