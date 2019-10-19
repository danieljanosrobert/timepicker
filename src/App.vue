<template>
  <v-app>
    <MenuBar/>
    <Drawer/>
    <router-view/>
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

  export default Vue.extend({
    name: 'App',
    data: () => ({
      //
    }),
    components: {
      Drawer,
      Footer,
      MenuBar,
    },
  });
</script>

<style lang="scss">
  @import 'assets/styles/style.scss';
</style>
