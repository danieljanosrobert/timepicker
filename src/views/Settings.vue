<template>
  <v-container :style="setToFullScreen" fluid class="px-12 pb-0" id="container">
    <v-row class="pa-0 pt-8">
      <v-col cols="12" class="py-6">
        <user-personal-settings/>
      </v-col>
      <v-col cols="12" class="py-6">
        <user-password-change/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import userService from '@/service/userService';
import UserPasswordChange from '@/components/settings/UserPasswordChange';
import UserPersonalSettings from '@/components/settings/UserPersonalSettings';

export default {
  name: 'Settings',
  components: {
      UserPasswordChange,
      UserPersonalSettings,
  },
  computed: {
    setToFullScreen() {
      return {
          'min-height': `${window.innerHeight}px`,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
  @import '@/assets/styles/variables.scss';

  #container {
    background-color: $_yellow;
  }

</style>
