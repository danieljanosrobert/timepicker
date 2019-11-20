<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-navigation-drawer v-model="drawer" app bottom temporary>
    <user-register-dialog/>
      <v-list-item class="pr-1">
        <v-list-item-title class="pa-2 text-center headline text-dark-mahogany text-uppercase">
          <router-link class="link-disable-decoration" to="/">
            <span style="font-size: 28px" class="font-alegreya font-italic">Pick</span>
            <span style="font-size: 20px" class="font-weight-light">a</span>
            <span style="font-size: 26px" class="font-alegreya font-italic">Time</span>
          </router-link>
        </v-list-item-title>
        <v-btn class="text-right" icon @click.stop="drawer = !drawer">
          <v-icon size="40px">mdi-chevron-left</v-icon>
        </v-btn>
      </v-list-item>

      <v-divider></v-divider>

    <v-list>
      <v-list-item v-for="item in essentials" :key="item.title" link :to="item.url">
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list v-if="!isLoggedIn">
      <v-subheader>Felhasználó</v-subheader>
      <v-menu v-model="userLoginMenu" :close-on-content-click="false" offset-x>
        <template v-slot:activator="{ on }">
          <v-list-item link v-on="on">
            <v-list-item-icon>
              <v-icon> mdi-account </v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title> Belépés </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
        <user-login-menu></user-login-menu>
      </v-menu>

      <v-list-item link @click.stop="openRegisterDialog()">
        <v-list-item-icon>
          <v-icon> mdi-account-key </v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title> Regisztráció </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      
      <v-divider/>

    <v-subheader>Szolgáltató</v-subheader>
      <v-menu v-model="adminLoginMenu" :close-on-content-click="false" offset-x>
        <template v-slot:activator="{ on }">
          <v-list-item link v-on="on">
            <v-list-item-icon>
              <v-icon> mdi-gavel </v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title> belépés </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
        <AdminLoginMenu></AdminLoginMenu>
      </v-menu>
    </v-list>

    <v-list v-if="userLoggedInAsUser">
      <v-list-item v-for="item in userItems" :key="item.title" link :to="item.url">
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-list v-if="userLoggedInAsAdmin">
      <template v-for="item in adminItems">

        <v-list-group v-if="item.subItems" :key="item.title">
          <template v-slot:activator>
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </template>
          <v-list-item class="pl-12" v-for="subItem in item.subItems" :key="subItem.title" link :to="subItem.url">
            <v-list-item-icon>
              <v-icon> {{subItem.icon}} </v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title> {{subItem.title}} </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>

        <v-list-item v-else :key="item.title" link :to="item.url">
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

      </template>

    </v-list>

    <template v-if="isLoggedIn" v-slot:append>
      <div class="pa-2">
        <v-btn dark block @click.stop="logout">Logout</v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script>
  import AdminLoginMenu from '@/components/menu/AdminLoginMenu.vue';
  import UserLoginMenu from '@/components/menu/UserLoginMenu.vue';
  import UserRegisterDialog from '@/components/menu/UserRegisterDialog.vue';
  import { mapState } from 'vuex';

  export default {
    name: 'Drawer',
    components: {
      AdminLoginMenu,
      UserLoginMenu,
      UserRegisterDialog,
    },
    data: () => ({
        adminLoginMenu: false,
        userLoginMenu: false,
        drawer: false,
        home: 'home',
        essentials: [
          {title: 'Főoldal', icon: 'mdi-view-dashboard', url: '/'},
          {title: 'Keresés', icon: 'mdi-book-search', url: '/search'},
        ],
        userItems: [
          {title: 'Kedvencek', icon: 'mdi-account', url: '/favorites'},
          {title: 'Beállítások', icon: 'mdi-settings', url: '/settings'},
        ],
        adminItems: [
          {title: 'Saját oldal', icon: 'mdi-book-open-page-variant', url: ''},
          {
            title: 'Beállítások', icon: 'mdi-settings', url: '', subItems: [
              {title: 'Szolgáltatás', icon: 'mdi-book', url: '/settings/service'},
              {title: 'Foglalás', icon: 'mdi-clock-start', url: '/settings/book'},
              {title: 'Üzenőfal', icon: 'mdi-email', url: '/settings/message-board'},
              {title: 'Elérhetőségek', icon: 'mdi-account-supervisor-circle', url: '/settings/contact'},
              {title: 'Jelszó megváltoztatása', icon: 'mdi-lock', url: '/settings/change-password'},
            ],
          },
          {title: 'Galléria', icon: 'mdi-image-album', url: '/about'},
        ],
    }),
    computed: {
      ...mapState({
        userLoggedInAsAdmin: 'loggedInAsAdmin',
        userLoggedInAsUser: 'loggedInAsUser',
        usersServiceId: 'ownServiceId',
      }),
      isLoggedIn() {
        return this.userLoggedInAsUser || this.userLoggedInAsAdmin;
      },
    },
    watch: {
      usersServiceId(newValue, oldValue) {
        this.adminItems[0].url = `/about/${newValue}`;
      },
    },
    mounted() {
      this.$root.$on('openDrawer', (data) => {
        this.drawer = data;
      });
      this.$root.$on('loggedIn', () => {
        this.adminLoginMenu = false;
        this.userLoginMenu = false;
      });
      this.adminItems[0].url = `/about/${this.usersServiceId}`;
    },
    methods: {
      logout() {
        this.$store.dispatch('logout');
        if (this.$router.currentRoute.path !== '/') {
          this.$router.push('/');
        }
        this.$store.dispatch('openSnackbar', {
          message: 'Sikeres kijelentkezés',
          type: 'warning',
        });
      },
      openRegisterDialog() {
        this.$root.$emit('openRegisterDialog');
      },
    },
  };
</script>

<style scoped>

</style>
