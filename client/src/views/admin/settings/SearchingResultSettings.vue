<template>
  <v-container :style="setToFullScreen" fluid class="px-12 pb-0" id="container">
    <v-row class="pa-0 pt-8">

      <v-col cols="12" md="6" class="pa-0">
        <v-card :style="setToFullScreen">

          <v-col cols="12" class="pa-0">
            <v-card class="pa-0 brown lighten-4">
              <v-card-text class="text-center" style="font-size: 2em;"> Szolgáltatás beállításai </v-card-text>
            </v-card>
          </v-col>

          <form class="pa-6">
            <v-text-field
                    v-model="name"
                    label="Név"
                    required
                    :error-messages="nameErrors"
                    @input="$v.name.$touch()"
                    @blur="$v.name.$touch()"
            ></v-text-field>
            <v-file-input v-model="image" accept="image/*" prepend-icon="" label="Kép"></v-file-input>
            <v-checkbox class="no-hover"
                        v-model="deleteImage"
                        :disabled="!!image"
                        label="Kép törlése"
            ></v-checkbox>
            <v-textarea
                    v-model="description"
                    label="Leírás"
            ></v-textarea>
            <v-switch class="no-hover"
                    color="error"
                    :error="serviceHidden"
                    v-model="serviceHidden"
                    label="Ne jelenjen meg a keresési eredményekben"
            ></v-switch>

            <v-divider class="pb-2"></v-divider>

            <v-form @submit.prevent="save">
              <v-text-field id="password" label="Mentéshez szükséges jelszó" v-model="password" 
                            name="password" type="password" required :error-messages="passwordErrors"
                            @input="$v.password.$touch()" @blur="$v.password.$touch()">
              </v-text-field>

              <v-btn class="mr-4" :disabled="buttonDisabled" type="submit">Mentés</v-btn>
            </v-form>
          </form>

        </v-card>
      </v-col>

      <v-col cols="12" md="6" class="pa-0">
        <v-card :style="setToFullScreen">

          <v-col cols="12" class="pa-0">
            <v-card class=" brown lighten-4">
              <v-card-text class="text-center" style="font-size: 2em;"> Előnézet </v-card-text>
            </v-card>
          </v-col>

          <v-card class="ma-6">
            <v-img :src="imageUrl" class="white--text align-end" gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                   height="200px">
              <v-card-title v-text="name"></v-card-title>
            </v-img>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn icon @click="descriptionVisible = !descriptionVisible" >
                <v-icon>{{ descriptionVisible ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
              </v-btn>
            </v-card-actions>

            <v-expand-transition>
              <div v-show="descriptionVisible">
                <v-divider></v-divider>

                <v-card-text class="description-from-db">
                  {{description}}
                </v-card-text>
              </div>
            </v-expand-transition>
          </v-card>

        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import serviceService from '@/service/serviceService';
  import { required, minLength } from 'vuelidate/lib/validators';
  import { serviceNameRegex } from '@/utils/customValidators';
  import constants from '@/utils/constants';

  const DEFAULT_IMAGE_URL = 'https://res.cloudinary.com/timepicker/image/upload/v1573508434/services/default_service_j961rq.jpg';

  export default {
    name: 'SearchingResultSettings',
    data: () => ({
      name: '',
      serviceHidden: false,
      descriptionVisible: false,
      image: null,
      description: null,
      password: null,
      deleteImage: false,
      imageUrl: DEFAULT_IMAGE_URL,
      buttonDisabled: false,
    }),
    validations: {
      name: {
        required,
        serviceNameRegex,
      },
      password: {
        required,
        minLength: minLength(6),
      },
    },
    watch: {
      image(img) {
        if (img) {
          this.deleteImage = false;
        }
      },
    },
    async mounted() {
      await this.fetchServiceSettings();
    },
    computed: {
      nameErrors() {
        const errors = [];
        if (!this.$v.name.$dirty) {
          return errors;
        }
        !this.$v.name.required && errors.push(constants.validationErrorMessages.required);
        !this.$v.name.serviceNameRegex && errors.push(constants.validationErrorMessages.serviceNameRegex);
        return errors;
      },
      passwordErrors() {
        const errors = [];
        if (!this.$v.password.$dirty) {
          return errors;
        }
        !this.$v.password.minLength && errors.push(constants.validationErrorMessages.passwordMinLength);
        !this.$v.password.required && errors.push(constants.validationErrorMessages.required);
        return errors;
      },
      setToFullScreen() {
        return {
          'min-height': `${window.innerHeight}px`,
        };
      },
    },
    methods: {
      async fetchServiceSettings() {
        this.password = '';
        this.imageUrl = DEFAULT_IMAGE_URL;
        this.$root.$emit('startLoading');
        try {
          await serviceService.getServiceSettings(this.$store.state.ownServiceId).
            then( (service) => {
              this.name = service.data.name;
              this.description = service.data.description;
              this.serviceHidden = service.data.hidden;
              if (service.data.image_url) {
                this.imageUrl = service.data.image_url;
              }
            });
        } catch {
        } finally {
          this.$root.$emit('stopLoading');
        }
      },
      async save() {
        this.$v.$touch();
        if (this.$v.$invalid) {
          return;
        }
        this.buttonDisabled = true;
        this.$root.$emit('startLoading');
        const formData = new FormData();

        formData.append('user_email', this.$store.state.loggedInUserEmail);
        formData.append('name', this.name);
        formData.append('description', this.description);
        formData.append('hidden', this.serviceHidden);
        formData.append('password', this.password);
        formData.append('deleteImage', this.deleteImage);
        if (this.image) {
          formData.append('image', this.image, this.image.name);
        }
        try {
          await serviceService.saveService(formData);
          this.$v.$reset();
          this.fetchServiceSettings();
          this.$store.dispatch('openSnackbar', {
            message: 'Szolgáltatás beállításai mentésre kerültek',
            type: 'success',
          });
        } catch (err) {
          this.$store.dispatch('openSnackbar', {
            message: err.response && _.get(constants.apiValidationMessages, err.response.data.error)
              || 'Hiba történt a mentés során!',
            type: 'error',
          });
        } finally {
          this.buttonDisabled = false;
          this.$root.$emit('stopLoading');
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import '@/assets/styles/variables.scss';

  #container {
    background-color: $_yellow;
  }

</style>
