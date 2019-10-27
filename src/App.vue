<template>
  <v-app class="brown darken-4">
    <MenuBar/>
    <Drawer/>
    <router-view :class="viewHasMargin ? 'pt-12' : ''"></router-view>
    <Footer/>
  </v-app>
</template>

<script lang="ts">
  import Drawer from './components/Drawer.vue';
  import Footer from './components/Footer.vue';
  import MenuBar from './components/MenuBar.vue';
  import Vue from 'vue';
  import VueScrollTo from 'vue-scrollto';

  Vue.use(VueScrollTo, { duration: 650 });

  const HOME = 'home';

  export default Vue.extend({
    name: 'App',
    data: () => ({
      viewHasMargin: false,
    }),
    components: {
      Drawer,
      Footer,
      MenuBar,
    },
    mounted() {
      this.routerViewHasMargin();
    },
    watch: {
      $route(to, from) {
        this.routerViewHasMargin();
      },
    },
    methods: {
      routerViewHasMargin() {
        this.viewHasMargin = this.$route.name !== HOME;
      },
    },
  });
</script>

<style lang="scss">
  @import 'assets/styles/style.scss';
</style>
