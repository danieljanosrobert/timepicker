<template>
  <v-row class="pa-0">
    <v-navigation-drawer dark fixed width="200" class="brown darken-1" style="top: 48px; z-index: 0" permanent>
      <v-list class="pa-0">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title id="title">
              {{$store.state.aboutPage}}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>

        <v-list-item v-for="(item, i) in items" :key="i" link @click.stop="aboutEvent(item.event)">
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.text }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-row>
</template>


<script>
  export default {
    name: 'Sidebar',
    data: () => ({
      items: [
        {
          icon: 'mdi-email',
          text: 'Üzenőfal',
          event: 'messageBoard',
        },
        {
          icon: 'mdi-account-supervisor-circle',
          text: 'Adatlap',
          event: 'about',
        },
        {
          icon: 'mdi-clock-start',
          text: 'Időpontfoglalás',
          event: 'book',
        },
      ],
    }),
    methods: {
      aboutEvent(event) {
        this.$root.$emit('aboutEvent', event);
      },
    },
  };
</script>

<style scoped>
  #title {
    white-space: normal;
  }
</style>
