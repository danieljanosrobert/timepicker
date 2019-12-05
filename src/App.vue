<template>
  <v-app class="brown darken-4">
    <progress-component/>
    <snackbar-component/>
    <menu-bar-component v-if="!isLandingPage"></menu-bar-component>
    <drawer-component v-if="!isLandingPage"></drawer-component>
    <router-view :class="viewHasMargin ? 'pt-12' : ''"></router-view>
    <footer-component v-if="!isLandingPage"></footer-component>
  </v-app>
</template>

<script>
  import DrawerComponent from './components/Drawer.vue';
  import FooterComponent from './components/Footer.vue';
  import MenuBarComponent from './components/MenuBar.vue';
  import SnackbarComponent from './components/Snackbar.vue';
  import ProgressComponent from './components/Progress.vue';
  import Vue from 'vue';
  import VueScrollTo from 'vue-scrollto';
  import Vuelidate from 'vuelidate';
  import * as _ from 'lodash';

  Vue.use(Vuelidate);
  Vue.use(VueScrollTo, { duration: 950 });

  const SUCCESSFULLY_ACTIVATED = 'successfully-activated';
  const HOME = 'home';
  const ABOUT = 'about';
  const LANDING_PAGES = ['register'];

  export default Vue.extend({
    name: 'App',
    data: () => ({
      viewHasMargin: false,
      isLandingPage: false,
    }),
    components: {
      DrawerComponent,
      FooterComponent,
      MenuBarComponent,
      SnackbarComponent,
      ProgressComponent,
    },
    mounted() {
      this.routerViewHasMargin();
      this.routerViewIsLandingPage();
    },
    watch: {
      $route(to, from) {
        this.refreshAboutPageIfServiceChange(to, from);
        this.showActivationSuccessfull(to, from);
        this.routerViewHasMargin();
        this.routerViewIsLandingPage();
      },
    },
    methods: {
      showActivationSuccessfull(to, from) {
        if (to.name === HOME && from.name === SUCCESSFULLY_ACTIVATED) {
          this.$store.dispatch('openSnackbar', {
            message: 'Sikeres művelet',
            type: 'success',
          });
        }
      },
      routerViewHasMargin() {
        this.viewHasMargin = this.$route.name !== HOME;
      },
      routerViewIsLandingPage() {
        this.isLandingPage = _.includes(LANDING_PAGES, this.$route.name);
      },
      refreshAboutPageIfServiceChange(to, from) {
        if (to.name === ABOUT && from.name === ABOUT && from.params && to.params && from.params !== to.params) {
          this.$root.$emit('reFetchContent');
        }
      },
    },
  });
</script>

<style lang="scss">
  @import 'assets/styles/style.scss';
</style>
