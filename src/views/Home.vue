<template>
  <v-container fluid class="pa-0 noselect">
    <v-col dark absolute class="z-1 nav-icon-without-app-bar">
      <v-app-bar-nav-icon dark :class="isAtTop ? 'display' : 'hide'" @click.stop="openDrawer()"></v-app-bar-nav-icon>
    </v-col>
    <Parallax/>
    <Carousel id="carousel"></Carousel>
    <Features/>
  </v-container>
</template>

<script lang="ts">
  import Vue from 'vue';
  import Parallax from '@/components/home/Parallax.vue';
  import Carousel from '@/components/home/Carousel.vue';
  import Features from '@/components/home/Features.vue';

  export default Vue.extend({
    name: 'Home',
    data: () => ({
      isAtTop: false,
    }),
    components: {Parallax, Carousel, Features},
    mounted() {
      this.isPageAtTop();
    },
    methods: {
      isPageAtTop(): void {
        if (this.isAtTop) {
          this.isAtTop = false;
        }
        if (document.documentElement.scrollTop === 0) {
          this.isAtTop = true;
        }
      },
      openDrawer() {
        this.$root.$emit('openDrawer', true);
      },
    },
    created() {
      window.addEventListener('scroll', this.isPageAtTop);
    },
    destroyed() {
      window.removeEventListener('scroll', this.isPageAtTop);
    },
  });
</script>

<style scoped>
  .nav-icon-without-app-bar {
    position: absolute;
    padding-left: 21px;
    padding-top: 8px;
  }
</style>
