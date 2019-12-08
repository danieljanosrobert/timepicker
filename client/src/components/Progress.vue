<template>
  <v-overlay :value="overlay" color="white" z-index="202">
    <v-progress-circular color="brown darken-2" indeterminate size="128" width="10">
      Betöltés...
    </v-progress-circular>
  </v-overlay>
</template>

<script>
  export default {
    name: 'Progress',
    data: () => ({
      overlay: false,
      loadingCounter: 0,
    }),
    watch: {
      loadingCounter(newValue, oldValue) {
        if (newValue > 0) {
          this.overlay = true;
        } else {
          this.overlay = false;
        }
      },
    },
    mounted() {
      this.$root.$on('startLoading', () => {
        this.loadingCounter++;
      });
      this.$root.$on('stopLoading', () => {
        this.loadingCounter--;
      });
    },
  };
</script>