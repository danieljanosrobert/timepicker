<template>
  <v-app class="brown darken-4">
    <Snackbar/>
    <MenuBar v-if="!isLandingPage"></MenuBar>
    <Drawer v-if="!isLandingPage"></Drawer>
    <router-view :class="viewHasMargin ? 'pt-12' : ''"></router-view>
    <Footer v-if="!isLandingPage"></Footer>
  </v-app>
</template>

<script lang="ts">
  import Drawer from './components/Drawer.vue';
  import Footer from './components/Footer.vue';
  import MenuBar from './components/MenuBar.vue';
  import Snackbar from './components/Snackbar.vue';
  import Vue from 'vue';
  import VueScrollTo from 'vue-scrollto';
  import * as _ from 'lodash';

  Vue.use(VueScrollTo, { duration: 950 });

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
      Drawer,
      Footer,
      MenuBar,
      Snackbar,
    },
    mounted() {
      this.routerViewHasMargin();
      this.routerViewIsLandingPage();
    },
    watch: {
      $route(to, from) {
        this.refreshAboutPageIfServiceChange(to, from);
        this.routerViewHasMargin();
        this.routerViewIsLandingPage();
      },
    },
    methods: {
      routerViewHasMargin() {
        this.viewHasMargin = this.$route.name !== HOME;
      },
      routerViewIsLandingPage() {
        this.isLandingPage = _.includes(LANDING_PAGES, this.$route.name);
      },
      refreshAboutPageIfServiceChange(to: any, from: any) {
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
