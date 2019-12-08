<template>
  <v-container :style="setToFullScreen" fluid class="font-alegreya pa-0">
    <v-parallax id="parallax" class="full-height" src="@/assets/images/parallax.jpg">
      <v-row align="center" class="logo text-dark-mahogany" justify="center">
        <span class="logo-pick font-alegreya font-italic">Pick </span>
        <span class="logo-a font-weight-light pl-2">a</span>
        <span class="logo-time font-alegreya font-italic">Time</span>
      </v-row>
      <v-row align="center" justify="center">
        <h1 class="text-center font-alegreya font-weight-thick mb-12 text-dark-blue shadow-text-light-blue logo-middle">Időpontok egyszerűen kezelve</h1>
      </v-row>
      <v-row align="center" justify="center" class="text-dark-mahogany points">
        <div align="center">
          <p>
            Rugalmas időpontok
            <v-icon>mdi-circle-medium</v-icon>
            Ütemezett foglalások
            <v-icon>mdi-circle-medium</v-icon>
            Egyszerű hirdetés
          </p>
          <p>
            Foglalás nyitvatartási időn kívül is
          </p>
        </div>
      </v-row>
      <v-row align="end" justify="center" class="text-black">
        <v-col class="pa-0 d-none d-sm-none d-md-inline">
          <div @mouseover="hover = true"
               @mouseleave="hover = false"
               align="center">
            <p class="pa-0 hoverable more-arrow-label" style="font-size: 20px" :class="hover ? 'display' : 'hide'">Tudjon meg többet!</p>
            <v-icon v-scroll-to="'#carousel'"
                    :class="{ jumping: hover }" class="chevron-down pa-0 cursor-pointer ma-0">mdi-chevron-down
            </v-icon>
          </div>
        </v-col>

        <v-col class="pa-0 d-inline d-sm-inline d-md-none">
          <div align="center">
            <p class="more-text pa-0 hoverable more-arrow-label">Tudjon meg többet!</p>
            <v-icon v-scroll-to="'#carousel'"
                    :class="{ jumping: hover }" class="chevron-down pa-0 cursor-pointer ma-0">mdi-chevron-down
            </v-icon>
          </div>
        </v-col>
      </v-row>
    </v-parallax>
  </v-container>
</template>

<script type="ts">
  export default {
    name: 'Parallax',
    data: () => ({
      hover: false,
    }),
    computed: {
      setToFullScreen() {
        return {
          height: `${window.innerHeight}px`,
        };
      },
    },
  };
</script>

<style lang="scss">
  .more-arrow-label {
    margin-bottom: -10%;
  }

  #parallax .logo {
    padding-top: 20px;
  }
  #parallax .logo-pick {
    font-size: 56px;
  }
  #parallax .logo-a {
    font-size: 40px;
  }
  #parallax .logo-time {
    font-size: 52px;
  }

  #parallax .points {
    font-size: 26px;
  }

  #parallax .chevron-down {
    font-size: 75px;
  }

  #parallax > .v-parallax__image-container {
    top: -140% !important;
  }

  @media (min-width: 768px) {
    #parallax > .v-parallax__image-container {
      top: -100% !important;
    }

    #parallax .logo {
      padding-top: 20px;
    }
    #parallax .logo-pick {
      font-size: 112px;
    }
    #parallax .logo-a {
      font-size: 80px;
    }
    #parallax .logo-time {
      font-size: 104px;
    }

    #parallax .logo-middle {
      font-size: 80px;
    }

    #parallax .points {
      font-size: 35px;
    }

    #parallax .chevron-down {
      font-size: 150px;
    }
  }

  @media (max-height: 450px) {
    #parallax > .v-parallax__image-container {
      top: 0!important;
      img {
        top: -245%!important;
      }
    }

    #parallax .logo {
      padding-top: 20px;
    }
    #parallax .logo-pick {
      font-size: 56px;
    }
    #parallax .logo-a {
      font-size: 40px;
    }
    #parallax .logo-time {
      font-size: 52px;
    }

    #parallax .logo-middle {
      font-size: 20px;
      margin-bottom: 10px !important;
    }

    #parallax .points {
      font-size: 18px;
    }

    #parallax .chevron-down {
      padding-top: 0;
      font-size: 50px;
    }

    #parallax .more-text {
      font-size: 10px;
    }
  }

</style>
