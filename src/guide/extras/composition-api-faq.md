---
outline: deep
---

# FAQ Composition API {#composition-api-faq}

:::tip
To FAQ zakłada wcześniejsze doświadczenie z Vue - w szczególności doświadczenie z Vue 2 podczas głównie korzystania z Options API.
:::

## Czym jest Composition API? {#what-is-composition-api}

<VueSchoolLink href="https://vueschool.io/lessons/introduction-to-the-vue-js-3-composition-api" title="Darmowa Lekcja Composition API"/>

Composition API to zestaw interfejsów API, który pozwala nam tworzyć komponenty Vue przy użyciu importowanych funkcji zamiast deklarowania opcji. Jest to ogólny termin obejmujący następujące API:

- [Reactivity API](/api/reactivity-core), np. `ref()` i `reactive()`, które pozwalają nam bezpośrednio tworzyć stan reaktywny, stan wyliczany i obserwatory.

- [Hooki Cyklu Życia](/api/composition-api-lifecycle), np. `onMounted()` i `onUnmounted()`, które pozwalają nam programowo wpinać się w cykl życia komponentu.

- [Wstrzykiwanie Zależności](/api/composition-api-dependency-injection), czyli `provide()` i `inject()`, które pozwalają nam wykorzystać system wstrzykiwania zależności Vue podczas korzystania z Reactivity API.

Composition API jest wbudowaną funkcją Vue 3 i [Vue 2.7](https://blog.vuejs.org/posts/vue-2-7-naruto.html). Dla starszych wersji Vue 2 należy użyć oficjalnie wspieranej wtyczki [`@vue/composition-api`](https://github.com/vuejs/composition-api). W Vue 3 jest ono również głównie używane razem ze składnią [`<script setup>`](/api/sfc-script-setup) w Jednoplikowych Komponentach. Oto podstawowy przykład komponentu używającego Composition API:

```vue
<script setup>
import { ref, onMounted } from 'vue'

// stan reaktywny
const count = ref(0)

// funkcje, które mutują stan i wyzwalają aktualizacje
function increment() {
  count.value++
}

// hooki cyklu życia
onMounted(() => {
  console.log(`Początkowa wartość licznika to ${count.value}.`)
})
</script>

<template>
  <button @click="increment">Licznik: {{ count }}</button>
</template>
```

Pomimo stylu API opartego na kompozycji funkcji, **Composition API NIE jest programowaniem funkcyjnym**. Composition API opiera się na mutowalnym, precyzyjnym paradygmacie reaktywności Vue, podczas gdy programowanie funkcyjne kładzie nacisk na niezmienność.

Jeśli jesteś zainteresowany nauką używania Vue z Composition API, możesz ustawić preferencję API dla całej strony na Composition API, używając przełącznika u góry lewego paska bocznego, a następnie przejść przez przewodnik od początku.

## Dlaczego Composition API? {#why-composition-api}

### Lepsza Możliwość Ponownego Użycia Logiki {#better-logic-reuse}

Główną zaletą Composition API jest to, że umożliwia czyste, efektywne ponowne wykorzystanie logiki w formie [funkcji komponowalnych](/guide/reusability/composables). Rozwiązuje [wszystkie wady mixinów](/guide/reusability/composables#vs-mixins), głównego mechanizmu ponownego użycia logiki w Options API.

Możliwość ponownego użycia logiki w Composition API dała początek imponującym projektom społecznościowym, takim jak [VueUse](https://vueuse.org/), stale rosnącej kolekcji narzędzi komponowalnych. Służy również jako czysty mechanizm do łatwego integrowania stanowych usług lub bibliotek zewnętrznych z systemem reaktywności Vue, na przykład [niezmienne dane](/guide/extras/reactivity-in-depth#immutable-data), [maszyny stanów](/guide/extras/reactivity-in-depth#state-machines) i [RxJS](/guide/extras/reactivity-in-depth#rxjs).

### Bardziej Elastyczna Organizacja Kodu {#more-flexible-code-organization}

Wielu użytkowników docenia to, że domyślnie piszemy zorganizowany kod z Options API: wszystko ma swoje miejsce w zależności od opcji, pod którą podlega. Jednak Options API stawia poważne ograniczenia, gdy logika pojedynczego komponentu przekracza pewien próg złożoności. To ograniczenie jest szczególnie widoczne w komponentach, które muszą obsługiwać wiele **logicznych zagadnień**, co zaobserwowaliśmy z pierwszej ręki w wielu produkcyjnych aplikacjach Vue 2.

Weźmy jako przykład komponent eksploratora folderów z GUI Vue CLI: ten komponent jest odpowiedzialny za następujące logiczne zagadnienia:

- Śledzenie bieżącego stanu folderu i wyświetlanie jego zawartości
- Obsługa nawigacji po folderach (otwieranie, zamykanie, odświeżanie...)
- Obsługa tworzenia nowego folderu
- Przełączanie pokazywania tylko ulubionych folderów
- Przełączanie pokazywania ukrytych folderów
- Obsługa zmian bieżącego katalogu roboczego

[Oryginalna wersja](https://github.com/vuejs/vue-cli/blob/a09407dd5b9f18ace7501ddb603b95e31d6d93c0/packages/@vue/cli-ui/src/components/folder/FolderExplorer.vue#L198-L404) komponentu została napisana w Options API. Jeśli nadamy każdej linii kodu kolor w zależności od logicznego zagadnienia, którym się zajmuje, wygląda to tak:

<img alt="folder component before" src="./images/options-api.png" width="129" height="500" style="margin: 1.2em auto">

Zauważ, jak kod zajmujący się tym samym logicznym zagadnieniem jest zmuszony do podziału na różne opcje, znajdujące się w różnych częściach pliku. W komponencie, który ma kilkaset linii, zrozumienie i nawigacja po pojedynczym logicznym zagadnieniu wymaga ciągłego przewijania pliku w górę i w dół, co sprawia, że jest to znacznie trudniejsze niż powinno. Dodatkowo, jeśli kiedykolwiek zechcemy wyodrębnić logiczne zagadnienie do ponownie używalnego narzędzia, wymaga to sporo pracy, aby znaleźć i wyodrębnić odpowiednie fragmenty kodu z różnych części pliku.

Oto ten sam komponent, przed i po [refaktoryzacji do Composition API](https://gist.github.com/yyx990803/8854f8f6a97631576c14b63c8acd8f2e):

![folder component after](./images/composition-api-after.png)

Zauważ, jak kod związany z tym samym logicznym zagadnieniem może być teraz zgrupowany razem: nie musimy już przeskakiwać między różnymi blokami opcji podczas pracy nad konkretnym logicznym zagadnieniem. Co więcej, możemy teraz przenieść grupę kodu do zewnętrznego pliku przy minimalnym wysiłku, ponieważ nie musimy już przegrupowywać kodu, aby go wyodrębnić. Ta zmniejszona trudność refaktoryzacji jest kluczowa dla długoterminowej utrzymywalności w dużych bazach kodu.

### Lepsza inferencja typów {#better-type-inference}

W ostatnich latach coraz więcej programistów frontendowych adaptuje [TypeScript](https://www.typescriptlang.org/), ponieważ pomaga nam pisać bardziej solidny kod, wprowadzać zmiany z większą pewnością i zapewnia świetne doświadczenie programistyczne ze wsparciem IDE. Jednakże Options API, pierwotnie wymyślone w 2013 roku, zostało zaprojektowane bez myśli o inferencji typów. Musieliśmy zaimplementować niektóre [absurdalnie złożone kombinacje typów](https://github.com/vuejs/core/blob/44b95276f5c086e1d88fa3c686a5f39eb5bb7821/packages/runtime-core/src/componentPublicInstance.ts#L132-L165), aby inferencja typów działała z Options API. Nawet przy całym tym wysiłku, inferencja typów dla Options API może nadal zawodzić w przypadku mixinów i wstrzykiwania zależności.

To sprawiło, że wielu programistów, którzy chcieli używać Vue z TS, skłaniało się ku Class API napędzanemu przez `vue-class-component`. Jednak API oparte na klasach mocno polega na dekoratorach ES, funkcjonalności języka, która była tylko propozycją etapu 2, gdy Vue 3 było rozwijane w 2019 roku. Uznaliśmy, że zbyt ryzykowne było oparcie oficjalnego API na niestabilnej propozycji. Od tego czasu propozycja dekoratorów przeszła kolejną całkowitą przebudowę i ostatecznie osiągnęła etap 3 w 2022 roku. Dodatkowo, API oparte na klasach cierpi na ograniczenia ponownego wykorzystania i organizacji logiki podobne do Options API.

W porównaniu, Composition API wykorzystuje głównie zwykłe zmienne i funkcje, które są naturalnie przyjazne dla typów. Kod napisany w Composition API może cieszyć się pełną inferencją typów z niewielką potrzebą ręcznych podpowiedzi typów. W większości przypadków kod Composition API będzie wyglądał prawie identycznie w TypeScript i zwykłym JavaScript. Umożliwia to również użytkownikom zwykłego JavaScript korzystanie z częściowej inferencji typów.

### Mniejszy bundle produkcyjny i mniejszy narzut {#smaller-production-bundle-and-less-overhead}

Kod napisany w Composition API i `<script setup>` jest również bardziej wydajny i przyjazny dla minifikacji niż odpowiednik Options API. Dzieje się tak, ponieważ szablon w komponencie `<script setup>` jest kompilowany jako funkcja wbudowana w tym samym zakresie co kod `<script setup>`. W przeciwieństwie do dostępu do właściwości przez `this`, skompilowany kod szablonu może bezpośrednio uzyskać dostęp do zmiennych zadeklarowanych wewnątrz `<script setup>`, bez pośredniczącego proxy instancji. Prowadzi to również do lepszej minifikacji, ponieważ wszystkie nazwy zmiennych mogą być bezpiecznie skrócone.

## Relacja z Options API {#relationship-with-options-api}

### Kompromisy {#trade-offs}

Niektórzy użytkownicy przechodzący z Options API uznali, że ich kod Composition API jest mniej zorganizowany i doszli do wniosku, że Composition API jest "gorsze" pod względem organizacji kodu. Zalecamy użytkownikom o takich opiniach spojrzenie na ten problem z innej perspektywy.

To prawda, że Composition API nie zapewnia już "barierek", które prowadzą cię do umieszczania kodu w odpowiednich przegródkach. W zamian możesz tworzyć kod komponentów tak, jak pisałbyś normalny JavaScript. Oznacza to, że **możesz i powinieneś stosować wszelkie najlepsze praktyki organizacji kodu do swojego kodu Composition API, tak jak robiłbyś to pisząc normalny JavaScript**. Jeśli potrafisz pisać dobrze zorganizowany JavaScript, powinieneś również być w stanie pisać dobrze zorganizowany kod Composition API.

Options API pozwala ci "mniej myśleć" podczas pisania kodu komponentów, co jest powodem, dla którego wielu użytkowników je kocha. Jednak zmniejszając obciążenie mentalne, zamyka cię również w narzuconym wzorcu organizacji kodu bez możliwości ucieczki, co może utrudnić refaktoryzację lub poprawę jakości kodu w projektach o większej skali. Pod tym względem Composition API zapewnia lepszą skalowalność w dłuższej perspektywie.

### Czy Composition API obejmuje wszystkie przypadki użycia? {#does-composition-api-cover-all-use-cases}

Tak, w zakresie logiki stanowej. Podczas korzystania z Composition API, tylko kilka opcji może być nadal potrzebnych: `props`, `emits`, `name` i `inheritAttrs`.

:::tip

Od wersji 3.3 możesz bezpośrednio używać `defineOptions` w `<script setup>` aby ustawić nazwę komponentu lub właściwość `inheritAttrs`

:::

Jeśli zamierzasz korzystać wyłącznie z Composition API (wraz z wymienionymi powyżej opcjami), możesz zmniejszyć rozmiar paczki produkcyjnej o kilka kb za pomocą [flagi czasu kompilacji](/api/compile-time-flags), która usuwa kod związany z Options API z Vue. Pamiętaj, że wpływa to również na komponenty Vue w twoich zależnościach.

### Czy mogę używać obu API w tym samym komponencie? {#can-i-use-both-apis-in-the-same-component}

Tak. Możesz używać Composition API poprzez opcję [`setup()`](/api/composition-api-setup) w komponencie Options API.

Jednak zalecamy to tylko wtedy, gdy masz istniejącą bazę kodu Options API, która wymaga integracji z nowymi funkcjami / zewnętrznymi bibliotekami napisanymi z użyciem Composition API.

### Czy Options API zostanie zdeprecjonowane? {#will-options-api-be-deprecated}

Nie, nie mamy takich planów. Options API jest integralną częścią Vue i powodem, dla którego wielu programistów je kocha. Zdajemy sobie również sprawę, że wiele korzyści z Composition API ujawnia się tylko w projektach o większej skali, a Options API pozostaje solidnym wyborem dla wielu scenariuszy o niskiej i średniej złożoności.

## Relacja z Class API {#relationship-with-class-api}

Nie zalecamy już używania Class API z Vue 3, biorąc pod uwagę, że Composition API zapewnia świetną integrację z TypeScript wraz z dodatkowymi korzyściami w zakresie ponownego wykorzystania logiki i organizacji kodu.

## Porównanie z React Hooks {#comparison-with-react-hooks}

Composition API zapewnia ten sam poziom możliwości kompozycji logiki co React Hooks, ale z kilkoma istotnymi różnicami.

React Hooks są wywoływane wielokrotnie przy każdej aktualizacji komponentu. Tworzy to szereg pułapek, które mogą dezorientować nawet doświadczonych programistów React. Prowadzi to również do problemów z optymalizacją wydajności, które mogą poważnie wpłynąć na doświadczenie programistyczne. Oto kilka przykładów:

- Hooki są wrażliwe na kolejność wywołań i nie mogą być warunkowe.

- Zmienne zadeklarowane w komponencie React mogą zostać przechwycone przez domknięcie hooka i stać się "nieaktualne", jeśli programista nie przekaże prawidłowej tablicy zależności. Prowadzi to do tego, że programiści React polegają na regułach ESLint, aby zapewnić przekazanie prawidłowych zależności. Jednak reguła często nie jest wystarczająco inteligentna i nadmiernie kompensuje poprawność, co prowadzi do niepotrzebnych unieważnień i problemów przy napotkaniu przypadków brzegowych.

- Kosztowne obliczenia wymagają użycia `useMemo`, co ponownie wymaga ręcznego przekazania prawidłowej tablicy zależności.

- Handlery zdarzeń przekazywane do komponentów potomnych domyślnie powodują niepotrzebne aktualizacje potomków i wymagają jawnego `useCallback` jako optymalizacji. Jest to prawie zawsze potrzebne i ponownie wymaga prawidłowej tablicy zależności. Zaniedbanie tego prowadzi do domyślnego nadmiernego renderowania aplikacji i może powodować problemy z wydajnością bez zdawania sobie z tego sprawy.

- Problem nieaktualnych domknięć, w połączeniu z funkcjami Concurrent, utrudnia zrozumienie, kiedy fragment kodu hooków jest uruchamiany, i sprawia, że praca ze stanem mutowalnym, który powinien utrzymywać się między renderowaniami (poprzez `useRef`) jest kłopotliwa.

> Uwaga: niektóre z powyższych problemów związanych z memoizacją mogą zostać rozwiązane przez nadchodzący [React Compiler](https://react.dev/learn/react-compiler).

W porównaniu, Vue Composition API:

- Wywołuje kod `setup()` lub `<script setup>` tylko raz. Sprawia to, że kod lepiej odpowiada intuicjom idiomatycznego użycia JavaScript, ponieważ nie ma nieaktualnych domknięć, o które trzeba się martwić. Wywołania Composition API nie są również wrażliwe na kolejność wywołań i mogą być warunkowe.

- System reaktywności Vue automatycznie zbiera zależności reaktywne używane we właściwościach obliczeniowych i watcherach, więc nie ma potrzeby ręcznego deklarowania zależności.

- Nie ma potrzeby ręcznego buforowania funkcji callback, aby uniknąć niepotrzebnych aktualizacji potomków. Ogólnie rzecz biorąc, precyzyjny system reaktywności Vue zapewnia, że komponenty potomne aktualizują się tylko wtedy, gdy jest to konieczne. Ręczna optymalizacja aktualizacji potomków rzadko jest problemem dla programistów Vue.

Doceniamy kreatywność React Hooks i jest to główne źródło inspiracji dla Composition API. Jednak wspomniane problemy istnieją w jego projekcie, a my zauważyliśmy, że model reaktywności Vue przypadkowo zapewnia sposób na ich obejście.
