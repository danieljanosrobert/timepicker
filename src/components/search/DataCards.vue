<template>
    <v-card :style="setToFullScreen">

      <v-col offset="0" cols="12" offset-md="8" md="4" class="pb-6">
      <v-text-field v-model="search" append-icon="fa-search" label="Keresés" single-line hide-details></v-text-field>
      </v-col>

      <v-row class="pa-4 ma-0">
        <v-col class="text-center" cols="12" v-if="!searching[0]">
          Nem létezik ilyen szolgáltatás.
        </v-col>
        <v-col v-for="(item, i) in searching" :key="i" cols="12" md="4">
          <v-card>
            <v-img :src="getImageForService(item.image)" class="white--text align-end" gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                    height="200px">
                    <v-col v-if="$store.state.loggedInAsUser" cols="12">
                      <v-btn :disabled="flagsDisabled" absolute top right icon @click.stop="toggleFlagged(item)">
                        <v-icon dark :color="item.flagged? 'warning lighten-4' : ''">mdi-flag</v-icon>
                      </v-btn>
                    </v-col>
                    <v-col cols="12">
                      <v-card-title v-text="item.name"></v-card-title>
                    </v-col>
            </v-img>

            <v-card-actions>
              <v-btn text @click.stop="openAboutPage(item.service_id)" color="brown darken-2">
                Tovább
              </v-btn>

              <v-spacer></v-spacer>

              <v-btn icon @click="item.show = !item.show" >
                <v-icon>{{ item.show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
              </v-btn>
            </v-card-actions>

            <v-expand-transition>
              <div v-show="item.show">
                <v-divider></v-divider>

                <v-card-text>
                  {{item.description}}
                </v-card-text>
              </div>
            </v-expand-transition>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
</template>

<script>
  import serviceService from '@/service/serviceService';
  import flagService from '@/service/flagService';
  import { Base64 } from 'js-base64';

  const DEFAULT_IMAGE_URL = 'https://res.cloudinary.com/timepicker/image/upload/v1573508434/services/default_service_j961rq.jpg';
  
  export default {
    name: 'DataCards',
    data: () => ({
      search: '',
      isThereSearchingResult: false,
      services: [],
      flagsDisabled: false,
    }),
    async mounted() {
      this.$root.$on('reFetchContent', () => {
        this.fetchServices();
      });
      await this.fetchServices();
      if (this.$store.getters.userAuth) {
         this.fetchUserFlags();
      }
    },
    methods: {
      getImageForService(url) {
        if (url) {
          return url;
        }
        return DEFAULT_IMAGE_URL;
      },
      openAboutPage(serviceId) {
        this.$router.push({name: 'about', params: { service_id: serviceId }});
      },
      async fetchServices() {
        this.$root.$emit('startLoading');
        try {
          await serviceService.getAvailableServices()
            .then((services) => {
              this.services = _.sortBy(services.data, (service) => _.lowerCase(service.name));
              this.services.forEach((service) => this.$set(service, 'show', false));
            });
        } catch {
        } finally {
          this.$root.$emit('stopLoading');
        }
      },
      async fetchUserFlags() {
        this.$root.$emit('startLoading');
        try {
          await flagService.getUsersFlags(Base64.encode(this.$store.state.loggedInUserEmail))
            .then( (flags) => {
              _.forEach(flags.data, (flag) => {
                const flaggedService = _.find(this.services, {service_id: flag.service_id});
                this.$set(flaggedService, 'flagged', true);
              });
          });
        } catch {
        } finally {
          this.$root.$emit('stopLoading');
        }
      },
      async toggleFlagged(service) {
        this.flagsDisabled = true;
        this.$root.$emit('startLoading');
        try {
          await flagService.toggleFlagService({
            user_email: this.$store.state.loggedInUserEmail,
            service_id: service.service_id,
          });
          service.flagged = this.$set(service, 'flagged', !service.flagged);
          this.$store.dispatch('openSnackbar', {
            message: service.flagged ? 'Szolgáltatás mentve a mentett szolgáltatások közé'
              : 'Szolgáltatás törölve a mentett szolgáltatások közül',
            type: service.flagged ? 'success' : 'warning',
          });
        } catch {
          this.$store.dispatch('openSnackbar', {
            message: 'Hiba történt mentés során. Kérem próbálja újra később',
            type: 'error',
          });
        } finally {
          this.flagsDisabled = false;
          this.$root.$emit('stopLoading');
        }
      },
    },
    computed: {
      setToFullScreen() {
        return {
          'min-height': `${window.innerHeight}px`,
        };
      },
      keywords() {
        if (!this.search) {
          return [];
        }
        const keywords = [];

        for (const search of this.searching) {
          keywords.push(search.keyword);
        }

        return keywords;
      },
      searching() {
        if (!this.search) {
          return this.services;
        }
        const search = this.search.toLowerCase();

        return this.services.filter( (item) => {
          const text = item.name.toLowerCase();
          return text.indexOf(search) > -1;
        });
      },
    },
  };
</script>

<style scoped>

</style>
