<template>
    <v-card>

      <v-col offset="0" cols="12" offset-md="8" md="4" class="pb-6">
      <v-text-field v-model="search" append-icon="fa-search" label="Keresés" single-line hide-details></v-text-field>
      </v-col>

      <v-row class="pa-4 ma-0">
        <v-col v-for="(item, i) in searching" :key="i" cols="12" md="4">
          <v-card>
            <v-img :src="item.src" class="white--text align-end" gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                    height="200px">
              <v-card-title v-text="item.title"></v-card-title>
            </v-img>

            <v-card-actions>
              <v-btn text @click.stop="openAboutPage(item.title)" color="brown darken-2">
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
  export default {
    name: 'DataCards',
    data: () => ({
      search: '',
      items: [
        { id: 1, title: 'Pre-fab homes', src: 'https://cdn.vuetifyjs.com/images/cards/house.jpg', show: false,
        description: 'I\'m a thing. But, like most politicians, he promised more than he could deliver. ' +
              'You won\'t have time for sleeping, soldier, not with all the bed making you\'ll be doing. ' +
              'Then we\'ll go with that data file! Hey, you add a one and two zeros to that or we walk! ' +
              'You\'re going to do his laundry? I\'ve got to find a way to escape.' },
        { id: 2, title: 'Favorite road trips', src: 'https://cdn.vuetifyjs.com/images/cards/road.jpg', show: false,
          description: 'I\'m a thing. But, like most politicians, he promised more than he could deliver. ' +
              'You won\'t have time for sleeping, soldier, not with all the bed making you\'ll be doing. ' +
              'Then we\'ll go with that data file! Hey, you add a one and two zeros to that or we walk! ' +
              'You\'re going to do his laundry? I\'ve got to find a way to escape.' },
        { id: 3, title: 'Best airlines', src: 'https://cdn.vuetifyjs.com/images/cards/plane.jpg', show: false,
          description: 'I\'m a thing. But, like most politicians, he promised more than he could deliver. ' +
              'You won\'t have time for sleeping, soldier, not with all the bed making you\'ll be doing. ' +
              'Then we\'ll go with that data file! Hey, you add a one and two zeros to that or we walk! ' +
              'You\'re going to do his laundry? I\'ve got to find a way to escape.' },
        { id: 4, title: 'Kutya Cica', src: 'https://cdn.vuetifyjs.com/images/cards/road.jpg', show: false,
          description: 'I\'m a thing. But, like most politicians, he promised more than he could deliver. ' +
              'You won\'t have time for sleeping, soldier, not with all the bed making you\'ll be doing. ' +
              'Then we\'ll go with that data file! Hey, you add a one and two zeros to that or we walk! ' +
              'You\'re going to do his laundry? I\'ve got to find a way to escape.' },
        { id: 5, title: 'Salamon Peter', src: 'https://cdn.vuetifyjs.com/images/cards/road.jpg', show: false,
          description: 'I\'m a thing. But, like most politicians, he promised more than he could deliver. ' +
              'You won\'t have time for sleeping, soldier, not with all the bed making you\'ll be doing. ' +
              'Then we\'ll go with that data file! Hey, you add a one and two zeros to that or we walk! ' +
              'You\'re going to do his laundry? I\'ve got to find a way to escape.' },
      ],
    }),
    methods: {
      openAboutPage(param) {
        this.$store.dispatch('openAboutPage', param);
        this.$router.push('/about');
      },
    },
    computed: {
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
          return this.items;
        }
        const search = this.search.toLowerCase();

        return this.items.filter( (item) => {
          const text = item.title.toLowerCase();
          return text.indexOf(search) > -1;
        });
      },
    },
  };
</script>

<style scoped>

</style>
