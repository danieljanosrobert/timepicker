<template>
  <v-container fluid class="text-justify pa-0">
      <v-row>

        <v-col cols="12">
          <v-card class=" brown lighten-4">
              <v-card-text class="text-center" style="font-size: 2em;"> Üzenőfal </v-card-text>
          </v-card>
        </v-col>

        <v-col v-for="(item, i) in messages" :key="i" cols="12">
          <v-card class="pb-2 ">
            <v-card-title v-text="item.title"></v-card-title>
            <div class="mx-4">
              <span v-text="item.sub"></span>
            </div>
            <div class="mx-6 my-2">
              <v-card-text class="pre-wrap grey--text text--darken-2" v-text="item.content">
              </v-card-text>
            </div>
          </v-card>
        </v-col>
      </v-row>
  </v-container>
</template>
<script>
  export default {
    data: () => ({
      messages: [
        {
          title: 'Újra támad és terjed a tuberkulózis 2',
          sub: 'Világ',
          content: 'A TBC-s betegeknek, legalább fél éven át többféle antibiotikum-kezelés kell kapniuk - és még ez is (sok esetben) csak korlátozott sikerrel jár. Gyakran a szervezetet gyengítő mellékhatásokkal.\n' +
            '\n' +
            'Ahogy csökken a hatékony gyógyszerek száma, a világnak úgy kell frissítenie eszköztárát: újj diagnosztikai módszerekkel, oltásokkal, progresszív kezelésekkel.\n' +
            '\n' +
            'A tuberkulózis összefüggésben áll a helytelen táplálkozással és a rossz életkörülményekkel, ezért a nyomor betegségének nevezik. A szegény országokban a legsúlyosabb a helyzet - ahol a vállalatok kevés ösztönzést találnak a beruházásokra.\n' +
            '\n' +
            'A Johnson & Johnson 2012-ben, 40 év után elsőként állt elő egy új gyógyszerrel.\n' +
            '\n' +
            '- Ez nagyon drága. Ugyanolyan hosszú és drága kutatási folyamat, mint egy rákgyógyszer, vagy egy immungyógyszer kifejlesztése. Ugyanannyi erőfeszítés szükséges. De ha nincs valódi piaca, akkor nagyon nehéz egymilliárd dollárt tenni egy TBC elleni fejlesztési program mögé - állítja a gyógyszercég kutatási igazgatója.\n' +
            '\n' +
            'Ám ha túl súlyossá válik a probléma, nem lehet azt a szőnyeg alá söpörni.\n' +
            '\n' +
            'A gyógyszer-rezisztens TBC-vírusok és baktériumok negyedmillió ember életébe kerülnek évente.\n' +
            '\n' +
            'Európában a gyógyszereknek ellenálló baktériumok aránya Ukrajnában, Moldovában, Oroszországban és Fehéroroszországban a legmagasabb. És gyorsan terjed. Néhol az új esetek több, mint negyede immunis a jelenlegi gyógyszerekre.\n' +
            '\n' +
            'Az ENSZ Közgyűlése tavaly kötelezettséget vállalt a küzdelem fokozására, arra, hogy a TBC-járványt 2030-ig felszámolja.\n' +
            '\n' +
            'A Global Fund szerint a világ jelenleg nem e felé halad.',
        },
        {
          title: 'Újra támad és terjed a tuberkulózis 1',
          sub: 'Világ',
          content: 'Tartós köhögés, kimerültség, súlyvesztés. Gyanús, de nem egyértelmű jelei ezek a tuberkulózisnak. Emiatt halnak meg hárman percenként a gümőkórnak is nevezett betegségben világszerte.\n' +
              '\n' +
              'A TBC egy alattomos, bakteriális, fertőző betegség. Szakértők becslése szerint a betegek harmadát nem látja orvos, így kezelés nélkül fertőznek köhögésükkel környezetükben.\n' +
              '\n' +
              'Mások kezelés alatt állnak ugyan, de állapotuk nem javul, mert a kórokozó egyre ellenállóbb a gyógyszereknek.\n' +
              '\n' +
              'A Global Fund arra figyelmeztet, a TBC potenciálisan végzetes kockázatot jelent a világ egészségbiztonságára.\n' +
              '\n' +
              '- A gümőkór cseppfertőzéssel terjed. Bárhol, bármikor megfertőződhet. Úgy gondolom, a megelőzés legjobb módja - bárhol is éljen -, ha ott harcolunk a TBC-vel, ahonnan érkezik. Mert a bevándorlás miatt a baktérium bárhová eljuthat. Fel kell végre ébrednünk ahhoz, hogy a célt, a betegség megszüntetését 2030-ra elérjük - fogalmaz a Global Fund vezető koordinátora.\n' +
              '\n' +
              'Az antibiotikum-ellenálló fajok terjedése, valamint a nem megfelelően variált gyógyszeradagolás elősegítette az új járvány kialakulását.',
        },
      ],
    }),
  };
</script>

<style scoped>
  .pre-wrap {
    line-height: 1.4;
    white-space: pre-wrap;
  }
</style>
