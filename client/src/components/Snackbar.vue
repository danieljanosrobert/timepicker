<template>
  <v-snackbar class="cursor-pointer" @click.stop="show=false" top v-model="show" :color="snackbarColor">
    {{ snackbarText }}
  </v-snackbar>
</template>

<script>
  import { mapState } from 'vuex';

  export default {
    name: 'Snackbar',
    data: () => ({
      show: false,
    }),
    computed: {
      ...mapState([
        'snackbarText',
        'snackbarVisible',
        'snackbarColor',
      ]),
    },
    mounted() {
      this.$store.dispatch('closeSnackbar');
    },
    watch: {
      snackbarVisible(newValue, oldValue) {
        if (newValue) { this.show = newValue; }
      },
      show(newValue, oldValue) {
        if (!newValue) { this.$store.dispatch('closeSnackbar'); }
      },
    },
  };
</script>

<style scoped>

</style>
