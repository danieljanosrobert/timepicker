<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-row class="pa-0">

    <v-col :class="$vuetify.breakpoint.mdAndUp ? 'hide-and-change-position' : 'display'" id="mobile-menu" cols="1">
      <v-menu v-model="mobileMenu">
        <template v-slot:activator="{ on }">
          <v-btn large icon v-on="on" color="white">
            <v-icon color="white" size="24">mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list class="pa-0">
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title id="title" class="text-center">
                {{serviceName}}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item class="text-left" v-for="(item, i) in items" :key="i" link @click.stop="aboutEvent(item.event)">
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ item.text }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-col>

    <v-navigation-drawer dark width="200" fixed class="brown darken-1" style="top: 48px; z-index: 0" permanent
                         :class="$vuetify.breakpoint.mdAndUp ? 'display' : 'hide-and-change-position'">
      <v-list class="pa-0">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title id="title">
              {{serviceName}}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>

        <v-list-item class="text-left" v-for="(item, i) in items" :key="i" link @click.stop="aboutEvent(item.event)">
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.text }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-row>
</template>


<script>
  import serviceService from '@/service/serviceService';

  export default {
    name: 'Sidebar',
    data: () => ({
      items: [
        {
          icon: 'mdi-email',
          text: 'Üzenőfal',
          event: 'messageBoard',
        },
        {
          icon: 'mdi-account-supervisor-circle',
          text: 'Elérhetőségek',
          event: 'about',
        },
        {
          icon: 'mdi-clock-start',
          text: 'Időpontfoglalás',
          event: 'book',
        },
      ],
      mobileMenu: false,
      serviceName: '',
    }),
    async mounted() {
      this.$root.$on('reFetchContent', () => {
        this.getServiceName();
      });
      await this.getServiceName();
    },
    methods: {
      async getServiceName() {
        this.$root.$emit('startLoading');
        try {
          await serviceService.getServiceName(this.$route.params.service_id)
            .then((serviceName) => {
              this.serviceName = serviceName.data;
            });
        } catch {
        } finally {
          this.$root.$emit('stopLoading');
        }
      },
      aboutEvent(event) {
        this.mobileMenu = false;
        this.$root.$emit('aboutEvent', event);
      },
    },
  };
</script>

<style scoped>
  #title {
    white-space: normal;
  }

  #mobile-menu {
    position: fixed;
    right: 0;
    top: -11px;
    z-index: 10;
  }

  .hide-and-change-position {
    position: relative !important;
    display: none;
  }
</style>
