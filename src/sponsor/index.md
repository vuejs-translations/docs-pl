---
sidebar: false
ads: false
editLink: false
sponsors: false
---

<script setup>
import SponsorsGroup from '@theme/components/SponsorsGroup.vue'
import { load, data } from '@theme/components/sponsors'
import { onMounted } from 'vue'

onMounted(load)
</script>

# Zostań sponsorem Vue.js {#become-a-vue-js-sponsor}

Vue.js to projekt typu open source na licencji MIT i jest całkowicie darmowy w użyciu.
Ogromny nakład pracy potrzebny do utrzymania tak dużego ekosystemu i opracowywania nowych funkcjonalności dla projektu jest możliwy tylko dzięki hojnemu wsparciu finansowemu naszych sponsorów.

## Jak sponsorować {#how-to-sponsor}

Sponsorowanie można realizować poprzez [GitHub Sponsors](https://github.com/sponsors/yyx990803) lub [OpenCollective](https://opencollective.com/vuejs). Faktury można uzyskać za pośrednictwem systemu płatności GitHub. Akceptowane są zarówno comiesięczne, cykliczne sponsoringi, jak i jednorazowe darowizny. Cykliczne sponsoringi uprawniają do umieszczenia logo zgodnie z poziomami sponsoringu określonymi w sekcji [Poziomy Sponsoringu](#tier-benefits).

W przypadku pytań dotyczących poziomów, płatności lub danych dotyczących sponsorów, prosimy o kontakt pod adresem [sponsor@vuejs.org](mailto:sponsor@vuejs.org?subject=Vue.js%20sponsorship%20inquiry).

## Sponsorowanie Vue jako firma {#sponsoring-vue-as-a-business}

Sponsorowanie Vue zapewnia doskonałą ekspozycję na ponad **2 milionów** programistów Vue na całym świecie za pośrednictwem naszej strony internetowej i plików README projektu GitHub. Jest to nie tylko źródło generujące leady, ale również zwiększa świadomość Twojej marki jako biznesu, któremu  zależy na Open Source. Jest to niemierzalny ale bardzo ważny atut dla firm budujących produkty dla deweloperów, gdyż zwiększa konwersję.

Jeśli używasz Vue do budowania produktu generującego przychody, sponsorowanie rozwoju Vue ma sens biznesowy: **zapewnia, że projekt, od którego zależy Twój produkt, pozostaje zdrowy i aktywnie utrzymywany**. Ekspozycja i pozytywny wizerunek marki w społeczności Vue ułatwiają również przyciąganie i rekrutację programistów Vue.

Jeśli budujesz produkt, którego docelowymi klientami są programiści, dzięki ekspozycji sponsoringowej zyskasz wysokiej jakości ruch, ponieważ wszyscy nasi odwiedzający to programiści. Sponsorowanie buduje również rozpoznawalność marki i poprawia konwersję.

## Sponsorowanie Vue jako osoba prywatna {#sponsoring-vue-as-an-individual}

Jeśli jesteś indywidualnym użytkownikiem i cieszysz się wydajnością korzystania z Vue, rozważ przekazanie darowizny jako wyraz uznania - jak kupowanie nam kawy od czasu do czasu. Wielu członków naszego zespołu akceptuje sponsoring i darowizny za pośrednictwem GitHub Sponsors. Poszukaj przycisku "Sponsor" na profilu każdego członka zespołu na naszej [stronie zespołu](/about/team).

Możesz również spróbować przekonać swojego pracodawcę do sponsorowania Vue jako firma. Może to nie być łatwe, ale sponsoring biznesowy zazwyczaj ma znacznie większy wpływ na zrównoważony rozwój projektów Open Source Software (OSS) niż indywidualne darowizny, więc pomożesz nam znacznie bardziej, jeśli Ci się uda.

## Korzyści wynikające z poziomów sponsoringu {#tier-benefits}

- **Globalny sponsor specjalny**:
  - Ograniczone do **jednego** sponsora globalnie. <span v-if="!data?.special">Obecnie puste. [Skontaktuj się](mailto:sponsor@vuejs.org?subject=Vue.js%20special%20sponsor%20inquiry)!</span><span v-else>(Obecnie zajęte)</span>
  - (Ekskluzywne) Umieszczenie logo **above the fold** na pierwszej stronie serwisu [vuejs.org](/).
  - (Ekskluzywne) Specjalny shoutout i regularne podania dalej wszystkich ważnych premier produktów poprzez [oficjalne konto Vue na X](https://twitter.com/vuejs) (320 tyś obserwujących).
  - Najbardziej widoczne logo we wszystkich lokalizacjach na niższych poziomach.
- **Platynowy (2000 USD/miesiąc)**:
  - Wyraźne umieszczenie logo na pierwszej stronie serwisu [vuejs.org](/).
  - Wyraźne umieszczenie logo na pasku bocznym wszystkich stron z treścią.
  - Wyraźne umieszczenie logo w README [`vuejs/core`](https://github.com/vuejs/core) oraz [`vuejs/vue`](https://github.com/vuejs/core).
- **Złoty (500 USD/miesiąc)**:
  - Duże logo umieszczone na pierwszej stronie [vuejs.org](/).
  - Duże logo umieszczone w README `vuejs/core` oraz `vuejs/vue`.
- **Srebrny (250 USD/miesiąc)**:
  - Średnie logo umieszczone w pliku `BACKERS.md` dla `vuejs/core` i `vuejs/vue`.
- **Brązowy (100 USD/miesiąc)**:
  - Małe logo umieszczone w pliku `BACKERS.md` dla `vuejs/core` i `vuejs/vue`.
- **Hojny wspierający (50 USD/mies.)**:
  - Nazwa wymieniona w pliku `BACKERS.md` dla `vuejs/core` i `vuejs/vue`, ponad innymi indywidualnymi wspierającymi.
- **Indywidualny wspierający (5 USD/mies.)**:
  - Nazwa wymieniona w pliku `BACKERS.md` dla `vuejs/core` i `vuejs/vue`.

## Obecni sponsorzy {#current-sponsors}

### Globalny sponsor specjalny {#special-global-sponsor}

<SponsorsGroup tier="special" placement="page" />

### Platyna {#platinum}

<SponsorsGroup tier="platinum" placement="page" />

### Platyna (Chiny) {#platinum-china}

<SponsorsGroup tier="platinum_china" placement="page" />

### Złoto {#gold}

<SponsorsGroup tier="gold" placement="page" />

### Srebro {#silver}

<SponsorsGroup tier="silver" placement="page" />
