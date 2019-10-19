<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-navigation-drawer v-model="drawer" app bottom temporary>
      <v-list-item class="pr-1">
        <v-list-item-title class="pa-2 text-center headline text-dark-mahogany text-uppercase">
          <router-link class="link-disable-decoration" to="/">
            <span style="font-size: 28px" class="font-alegreya font-italic">Pick</span>
            <span style="font-size: 20px" class="font-weight-light">a</span>
            <span style="font-size: 26px" class="font-alegreya font-italic">Time</span>
          </router-link>
        </v-list-item-title>

        <v-btn class="text-right" icon @click.stop="drawer = !drawer">
          <v-icon size="40px">mdi-chevron-left</v-icon>
        </v-btn>
      </v-list-item>

      <v-divider></v-divider>

    <v-list>
      <v-list-item v-for="item in items" :key="item.title" link :to="item.url">
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <template v-slot:append>
      <div class="pa-2">
        <v-btn dark block>Logout</v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script>
  export default {
    name: 'Drawer',
    data: () => ({
      drawer: false,
      items: [
        { title: 'Főoldal', icon: 'mdi-view-dashboard', url: '/' },
        { title: 'Keresés', icon: 'mdi-account-box', url: 'search'},
        { title: 'Információk', icon: 'mdi-gavel', url: 'about' },
      ],
    }),
    mounted() {
      this.$root.$on('openDrawer', (data) => {
        this.drawer = data;
      });
    },
  };
</script>

<style scoped>

</style>
