<template>
  <v-card>
    <v-img :src="imageUrl" width="400px" height="300px" dark>

      <v-row dense class="float-right fill-height">
        <v-col cols="12" class="text-right pa-2">
          <v-btn dark icon v-if="isUserServiceOwner()" @click.stop="$router.push('/settings/contact')">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </v-col>
        <v-col cols="12" class="text-right align-self-end">
          <v-card-title class="white--text contact-name">
            <div class="display-1">{{name}}</div>
          </v-card-title>
        </v-col>
      </v-row>
    </v-img>

    <v-list two-line>
      <template v-if="phoneNumbers[0]">
        <v-list-item v-for="(item, i) in phoneNumbers" :key="`${i}${item.number}`">
          <v-list-item-icon v-if="i === 0">
            <v-icon color="indigo">mdi-phone</v-icon>
          </v-list-item-icon>

          <v-list-item-action v-else></v-list-item-action>

          <v-list-item-content>
            <v-list-item-title>{{item.number}}</v-list-item-title>
            <v-list-item-subtitle>{{item.comment}}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </template>

      <v-divider inset></v-divider>

      <template v-if="emails[0]">
        <v-list-item v-for="(item, i) in emails" :key="`${i}${i}${item.email}`">
          <v-list-item-icon v-if="i === 0">
            <v-icon color="indigo">mdi-email</v-icon>
          </v-list-item-icon>

          <v-list-item-action v-else></v-list-item-action>

          <v-list-item-content>
            <v-list-item-title>{{item.email}}</v-list-item-title>
            <v-list-item-subtitle>{{item.comment}}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </template>

      <v-divider inset></v-divider>

      <template v-if="addresses[0]">
        <v-list-item v-for="(item, i) in addresses" :key="`${i}${i}${i}${item.streetAndNumber}`">
          <v-list-item-icon v-if="i === 0">
            <v-icon color="indigo">mdi-map-marker</v-icon>
          </v-list-item-icon>

          <v-list-item-action v-else></v-list-item-action>

          <v-list-item-content>
            <v-list-item-title>{{item.streetAndNumber}}</v-list-item-title>
            <v-list-item-subtitle>{{item.stateNumber}} {{item.city}} </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list>

    <v-divider></v-divider>

  </v-card>
</template>

<script>
  const DEFAULT_IMAGE_URL = 'https://res.cloudinary.com/timepicker/image/upload/v1573509010/profiles/profile_tcgkwt.png';
  import contactService from '@/service/contactService';

  export default {
    name: 'Contact',
    data: () =>  ({
      imageUrl: DEFAULT_IMAGE_URL,
      name: '',
      phoneNumbers: [],
      emails: [],
      addresses: [],
    }),
    async mounted() {
      this.$root.$on('reFetchContent', () => {
        this.fetchContact();
      });
      await this.fetchContact();
    },
    methods: {
      async fetchContact() {
        await contactService.getContact(this.$route.params.service_id).then((contact) => {
          this.name = contact.data.name;
          this.phoneNumbers = contact.data.phoneNumbers;
          this.emails = contact.data.emails;
          this.addresses = contact.data.addresses;
          if (contact.data.image_url) {
            this.imageUrl = contact.data.image_url;
          }
        });
      },
      isUserServiceOwner() {
        return this.$store.state.loggedInAsAdmin && this.$store.state.ownServiceId === this.$route.params.service_id;
      },
    },
  };
</script>

<style scoped>
  .contact-name {
    display: block;
  }
</style>
