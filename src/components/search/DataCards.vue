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
              <v-card-title v-text="item.name"></v-card-title>
            </v-img>

            <v-card-actions>
              <v-btn text @click.stop="openAboutPage(item.service_id)" color="brown darken-2">
                Tovább
              </v-btn>

              <v-spacer></v-spacer>

              <!--<v-btn icon>
                <v-icon>mdi-heart</v-icon>
              </v-btn>

              <v-btn icon>
                <v-icon>mdi-bookmark</v-icon>
              </v-btn>

              <v-btn icon>
                <v-icon>mdi-share-variant</v-icon>
              </v-btn>-->

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

  const DEFAULT_IMAGE_URL = 'https://res.cloudinary.com/timepicker/image/upload/v1573508434/services/default_service_j961rq.jpg';
  
  export default {
    name: 'DataCards',
    data: () => ({
      search: '',
      isThereSearchingResult: false,
      services: [],
    }),
    async mounted() {
      this.$root.$on('reFetchContent', () => {
        this.fetchServices();
      });
      await this.fetchServices();
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
        await serviceService.getAvailableServices()
            .then((services) => {
              this.services = services.data;
              this.services.forEach((service) => this.$set(service, 'show', false));
            });
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
