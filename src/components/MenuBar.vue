<template>
  <v-app-bar app :inverted-scroll=invertedScrollProp>
    <v-toolbar-title class="headline text-uppercase">
      <router-link to="/">
        <span>Pick</span>
        <span class="font-weight-light">a</span>
        <span>Time</span>
      </router-link>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <router-link to="about">
      <span class="mr-2">MENU_1</span>
    </router-link>
  </v-app-bar>
</template>

<script>

  const HOME = 'home';
  export default {
    name: 'MenuBar',
    data: () => ({
      invertedScrollProp: false,
    }),
    mounted() {
      this.isScrollInverted();
    },
    watch: {
      $route(to, from) {
        this.isScrollInverted();
      },
    },
    methods: {
      isScrollInverted() {
        this.invertedScrollProp = this.$route.name === HOME;
      },
    },
  };
</script>

<style scoped>

</style>
