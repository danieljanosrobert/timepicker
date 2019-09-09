<template>
  <v-app>
    <MenuBar/>
    <router-view/>
    <Footer/>
  </v-app>
</template>

<script lang="ts">
  import Vue from 'vue';
  import MenuBar from './components/MenuBar.vue';
  import Footer from './components/Footer.vue';

  export default Vue.extend({
    name: 'App',
    data: () => ({
      //
    }),
    components: {
      Footer,
      MenuBar,
    },
  });
</script>

<style lang="scss">
  @import './assets/styles/style.scss';
</style>
