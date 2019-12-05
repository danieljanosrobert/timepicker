<template>
  <v-app-bar dense elevation=0 dark class="brown-menu-gradient" app :inverted-scroll=invertedScrollProp>
    <v-row>
      <v-col cols="2" class="align-self-center">
        <v-app-bar-nav-icon @click.stop="openDrawer()"></v-app-bar-nav-icon>
      </v-col>
      <v-col cols="8" class="text-center align-self-center">
        <v-toolbar-title class="headline text-dark-mahogany text-uppercase">
          <router-link class="link-disable-decoration" to="/">
            <span style="font-size: 28px" class="font-alegreya font-italic">Pick</span>
            <span style="font-size: 20px" class="font-weight-light">a</span>
            <span style="font-size: 26px" class="font-alegreya font-italic">Time</span>
          </router-link>
          <span style="font-size: 12px" v-if="userEmail">: {{userEmail}}</span>
        </v-toolbar-title>
      </v-col>
    </v-row>
  </v-app-bar>
</template>

<script>
  import { mapState } from 'vuex';

  const HOME = 'home';
  export default {
    name: 'MenuBar',
    data: () => ({
      invertedScrollProp: false,
      drawer: false,
      userEmail: '',
    }),
    mounted() {
      this.isScrollInverted();
    },
    watch: {
      $route(to, from) {
        this.isScrollInverted();
      },
      email(newValue, oldValue) {
        this.userEmail = _.split(newValue, '@')[0];
      },
    },
    computed: {
      ...mapState({
        email: 'loggedInUserEmail',
      }),
    },
    methods: {
      isScrollInverted() {
        this.invertedScrollProp = this.$route.name === HOME;
      },
      openDrawer() {
        this.$root.$emit('openDrawer', true);
      },
    },
  };
</script>

<style scoped>

</style>
