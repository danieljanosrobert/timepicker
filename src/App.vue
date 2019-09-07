<template>
  <v-app>
    <MenuBar></MenuBar>
    <router-view/>
  </v-app>
</template>

<script lang="ts">
  import Vue from 'vue';
  import MenuBar from './components/MenuBar.vue';

  export default Vue.extend({
    name: 'App',
    data: () => ({
      //
    }),
    components: {
      MenuBar,
    },
  });
</script>

<style>
  @import './assets/styles/style.scss';
</style>
