---
outline: deep
---

<script setup>
import SpreadSheet from './demos/SpreadSheet.vue'
</script>

# Reaktywność w szczegółach {#reactivity-in-depth}

Jedną z najbardziej charakterystycznych cech Vue jest nienarzucający się system reaktywności. Stan komponentu składa się z reaktywnych obiektów JavaScript. Kiedy je modyfikujesz, widok się aktualizuje. Sprawia to, że zarządzanie stanem jest proste i intuicyjne, ale ważne jest również zrozumienie jak to działa, aby uniknąć typowych pułapek. W tej sekcji zagłębimy się w niektóre szczegóły niskopoziomowe systemu reaktywności Vue.

## Czym jest reaktywność? {#what-is-reactivity}

Ten termin pojawia się ostatnio dość często w programowaniu, ale co ludzie mają na myśli, kiedy o nim mówią? Reaktywność jest paradygmatem programowania, który pozwala nam dostosowywać się do zmian w sposób deklaratywny. Kanonicznym przykładem, który ludzie zwykle pokazują, ponieważ jest świetny, jest arkusz kalkulacyjny Excel:

<SpreadSheet />

Tutaj komórka A2 jest zdefiniowana formułą `= A0 + A1` (możesz kliknąć na A2, aby wyświetlić lub edytować formułę), więc arkusz kalkulacyjny daje nam 3. Nic zaskakującego. Ale jeśli zaktualizujesz A0 lub A1, zauważysz, że A2 również automatycznie się aktualizuje.

JavaScript zwykle nie działa w ten sposób. Gdybyśmy mieli napisać coś podobnego w JavaScript:

```js
let A0 = 1
let A1 = 2
let A2 = A0 + A1

console.log(A2) // 3

A0 = 2
console.log(A2) // wciąż 3
```

Kiedy zmieniamy `A0`, `A2` nie zmienia się automatycznie.

Więc jak moglibyśmy to zrobić w JavaScript? Po pierwsze, aby ponownie uruchomić kod, który aktualizuje `A2`, opakujmy go w funkcję:

```js
let A2

function update() {
  A2 = A0 + A1
}
```

Następnie musimy zdefiniować kilka terminów:

- Funkcja `update()` tworzy **efekt uboczny**, lub w skrócie **efekt**, ponieważ modyfikuje stan programu.

- `A0` i `A1` są uznawane za **zależności** efektu, ponieważ ich wartości są używane do wykonania efektu. Mówi się, że efekt jest **subskrybentem** swoich zależności.

Potrzebujemy magicznej funkcji, która może wywołać `update()` (**efekt**) za każdym razem, gdy `A0` lub `A1` (**zależności**) się zmieniają:

```js
whenDepsChange(update)
```

Ta funkcja `whenDepsChange()` ma następujące zadania:

1. Śledzenie kiedy zmienna jest odczytywana. Np. podczas oceny wyrażenia `A0 + A1`, zarówno `A0` jak i `A1` są odczytywane.

2. Jeśli zmienna jest odczytywana gdy istnieje aktualnie uruchomiony efekt, uczyń ten efekt subskrybentem tej zmiennej. Np. ponieważ `A0` i `A1` są odczytywane gdy `update()` jest wykonywane, `update()` staje się subskrybentem zarówno `A0` jak i `A1` po pierwszym wywołaniu.

3. Wykrywanie kiedy zmienna jest mutowana. Np. gdy `A0` jest przypisana nowa wartość, powiadom wszystkie jej efekty-subskrybentów aby wykonały się ponownie.

## Jak działa reaktywność w Vue {#how-reactivity-works-in-vue}

Nie możemy tak naprawdę śledzić odczytywania i zapisywania lokalnych zmiennych jak w przykładzie. Po prostu nie ma mechanizmu do tego w czystym JavaScript. Co **możemy** zrobić, to przechwycić odczytywanie i zapisywanie **właściwości obiektów**.

Istnieją dwa sposoby przechwytywania dostępu do właściwości w JavaScript: [gettery](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get#description) / [settery](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/set#description) oraz [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy). Vue 2 używało wyłącznie getterów / setterów ze względu na ograniczenia wsparcia przeglądarek. W Vue 3, Proxy są używane dla obiektów reaktywnych, a gettery / settery są używane dla refs. Oto pseudo-kod, który ilustruje jak to działa:

```js{4,9,17,22}
function reactive(obj) {
  return new Proxy(obj, {
    get(target, key) {
      track(target, key)
      return target[key]
    },
    set(target, key, value) {
      target[key] = value
      trigger(target, key)
    }
  })
}

function ref(value) {
  const refObject = {
    get value() {
      track(refObject, 'value')
      return value
    },
    set value(newValue) {
      value = newValue
      trigger(refObject, 'value')
    }
  }
  return refObject
}
```

:::tip
Fragmenty kodu tutaj i poniżej mają na celu wyjaśnienie podstawowych koncepcji w najprostszej możliwej formie, więc wiele szczegółów jest pominiętych, a przypadki brzegowe zignorowane.
:::

To wyjaśnia kilka [ograniczeń obiektów reaktywnych](/guide/essentials/reactivity-fundamentals#limitations-of-reactive), które omówiliśmy w sekcji podstaw:

- Kiedy przypisujesz lub destrukturyzujesz właściwość obiektu reaktywnego do zmiennej lokalnej, dostęp lub przypisanie do tej zmiennej nie jest reaktywne, ponieważ nie wywołuje już pułapek get / set proxy na obiekcie źródłowym. Zauważ, że to "rozłączenie" wpływa tylko na wiązanie zmiennej - jeśli zmienna wskazuje na wartość nie-prymitywną, taką jak obiekt, mutowanie obiektu pozostanie reaktywne.

- Zwrócone proxy z `reactive()`, mimo że zachowuje się tak samo jak oryginał, ma inną tożsamość, jeśli porównamy je z oryginałem za pomocą operatora `===`.

Wewnątrz `track()` sprawdzamy, czy aktualnie działa jakiś efekt. Jeśli tak, wyszukujemy efekty subskrybentów (przechowywane w Set) dla śledzonej właściwości i dodajemy efekt do Set:

```js
// To zostanie ustawione tuż przed tym, jak efekt
// ma zostać uruchomiony. Zajmiemy się tym później.
let activeEffect

function track(target, key) {
  if (activeEffect) {
    const effects = getSubscribersForProperty(target, key)
    effects.add(activeEffect)
  }
}
```

Subskrypcje efektów są przechowywane w globalnej strukturze danych `WeakMap<target, Map<key, Set<effect>>>`. Jeśli nie znaleziono zestawu efektów subskrybujących dla właściwości (śledzonej po raz pierwszy), zostanie on utworzony. To właśnie robi funkcja `getSubscribersForProperty()` w skrócie. Dla uproszczenia pominiemy jej szczegóły.

Wewnątrz `trigger()` ponownie wyszukujemy efekty subskrybentów dla właściwości. Ale tym razem zamiast tego je wywołujemy:

```js
function trigger(target, key) {
  const effects = getSubscribersForProperty(target, key)
  effects.forEach((effect) => effect())
}
```

Teraz wróćmy do funkcji `whenDepsChange()`:

```js
function whenDepsChange(update) {
  const effect = () => {
    activeEffect = effect
    update()
    activeEffect = null
  }
  effect()
}
```

Opakowuje surową funkcję `update` w efekt, który ustawia siebie jako aktualnie aktywny efekt przed uruchomieniem właściwej aktualizacji. Umożliwia to wywołaniom `track()` podczas aktualizacji zlokalizowanie aktualnie aktywnego efektu.

W tym momencie stworzyliśmy efekt, który automatycznie śledzi swoje zależności i uruchamia się ponownie, gdy zależność ulega zmianie. Nazywamy to **Efektem Reaktywnym**.

Vue udostępnia API, które pozwala na tworzenie efektów reaktywnych: [`watchEffect()`](/api/reactivity-core#watcheffect). W rzeczywistości być może zauważyłeś, że działa bardzo podobnie do magicznego `whenDepsChange()` w przykładzie. Możemy teraz przepracować oryginalny przykład używając faktycznych API Vue:

```js
import { ref, watchEffect } from 'vue'

const A0 = ref(0)
const A1 = ref(1)
const A2 = ref()

watchEffect(() => {
  // śledzi A0 i A1
  A2.value = A0.value + A1.value
})

// wyzwala effect
A0.value = 2
```

Używanie efektu reaktywnego do mutowania ref-a nie jest najbardziej interesującym przypadkiem użycia - w rzeczywistości użycie właściwości obliczanej czyni to bardziej deklaratywnym:

```js
import { ref, computed } from 'vue'

const A0 = ref(0)
const A1 = ref(1)
const A2 = computed(() => A0.value + A1.value)

A0.value = 2
```

Wewnętrznie `computed` zarządza swoją nieważnością i ponownym obliczaniem za pomocą efektu reaktywnego.

Więc jaki jest przykład powszechnego i użytecznego efektu reaktywnego? Cóż, aktualizacja DOM-u! Możemy zaimplementować prostą "reaktywną renderowanie" w ten sposób:

```js
import { ref, watchEffect } from 'vue'

const count = ref(0)

watchEffect(() => {
  document.body.innerHTML = `Licznik: ${count.value}`
})

// aktualizuje DOM
count.value++
```

W rzeczywistości jest to dość zbliżone do tego, jak komponent Vue utrzymuje synchronizację stanu i DOM-u - każda instancja komponentu tworzy efekt reaktywny do renderowania i aktualizacji DOM-u. Oczywiście, komponenty Vue używają znacznie wydajniejszych sposobów aktualizacji DOM-u niż `innerHTML`. Jest to omówione w [Mechanizm Renderowania](./rendering-mechanism).

<div class="options-api">

API `ref()`, `computed()` i `watchEffect()` są częścią Composition API. Jeśli do tej pory używałeś tylko Options API z Vue, zauważysz, że Composition API jest bliższe temu, jak system reaktywności Vue działa pod maską. W rzeczywistości w Vue 3 Options API jest zaimplementowane na bazie Composition API. Każdy dostęp do właściwości instancji komponentu (`this`) wywołuje gettery / settery do śledzenia reaktywności, a opcje takie jak `watch` i `computed` wewnętrznie wywołują swoje odpowiedniki z Composition API.

</div>

## Reaktywność w czasie wykonania vs. w czasie kompilacji {#runtime-vs-compile-time-reactivity}

System reaktywności Vue jest przede wszystkim oparty na czasie wykonania: śledzenie i wyzwalanie są wykonywane podczas bezpośredniego działania kodu w przeglądarce. Zaletami reaktywności w czasie wykonania są możliwość działania bez etapu budowania oraz mniejsza liczba przypadków brzegowych. Z drugiej strony, sprawia to, że jest ograniczona przez składniowe ograniczenia JavaScript, prowadząc do potrzeby stosowania kontenerów wartości takich jak Vue refs.

Niektóre frameworki, takie jak [Svelte](https://svelte.dev/), wybierają pokonanie tych ograniczeń poprzez implementację reaktywności podczas kompilacji. Analizują i transformują kod w celu symulowania reaktywności. Etap kompilacji pozwala frameworkowi na zmianę semantyki samego JavaScriptu - na przykład, niejawne wstrzykiwanie kodu, który wykonuje analizę zależności i wyzwalanie efektów wokół dostępu do lokalnie zdefiniowanych zmiennych. Wadą jest to, że takie transformacje wymagają etapu budowania, a zmiana semantyki JavaScriptu to w zasadzie tworzenie języka, który wygląda jak JavaScript, ale kompiluje się w coś innego.

Zespół Vue zbadał ten kierunek za pomocą eksperymentalnej funkcji zwanej [Transformacją Reaktywności](/guide/extras/reactivity-transform), ale ostatecznie zdecydowaliśmy, że nie będzie to dobre rozwiązanie dla projektu z powodu [uzasadnienia tutaj](https://github.com/vuejs/rfcs/discussions/369#discussioncomment-5059028).

## Debugowanie reaktywności {#reactivity-debugging}

To świetnie, że system reaktywności Vue automatycznie śledzi zależności, ale w niektórych przypadkach możemy chcieć dokładnie ustalić, co jest śledzone lub co powoduje ponowne renderowanie komponentu.

### Hooki debugowania komponentów {#component-debugging-hooks}

Możemy debugować, jakie zależności są używane podczas renderowania komponentu i która zależność wywołuje aktualizację, używając hooków cyklu życia <span class="options-api">`renderTracked`</span><span class="composition-api">`onRenderTracked`</span> i <span class="options-api">`renderTriggered`</span><span class="composition-api">`onRenderTriggered`</span>. Oba hooki otrzymają zdarzenie debugowania, które zawiera informacje o danej zależności. Zaleca się umieszczenie instrukcji `debugger` w callbackach, aby interaktywnie sprawdzać zależność:

<div class="composition-api">

```vue
<script setup>
import { onRenderTracked, onRenderTriggered } from 'vue'

onRenderTracked((event) => {
  debugger
})

onRenderTriggered((event) => {
  debugger
})
</script>
```

</div>
<div class="options-api">

```js
export default {
  renderTracked(event) {
    debugger
  },
  renderTriggered(event) {
    debugger
  }
}
```

</div>

:::tip
Hooki do debugowania komponentów działają wyłącznie w trybie deweloperskim.
:::

Obiekty zdarzeń debugowania mają następujący typ:

<span id="debugger-event"></span>

```ts
type DebuggerEvent = {
  effect: ReactiveEffect
  target: object
  type:
    | TrackOpTypes /* 'get' | 'has' | 'iterate' */
    | TriggerOpTypes /* 'set' | 'add' | 'delete' | 'clear' */
  key: any
  newValue?: any
  oldValue?: any
  oldTarget?: Map<any, any> | Set<any>
}
```

### Debugowanie computed {#computed-debugging}

<!-- TODO options API equivalent -->

Możemy debugować właściwości computed poprzez przekazanie do `computed()` drugiego obiektu opcji z callbackami `onTrack` i `onTrigger`:

- `onTrack` zostanie wywołany, gdy właściwość reaktywna lub ref jest śledzona jako zależność.
- `onTrigger` zostanie wywołany, gdy callback watchera jest wyzwalany przez mutację zależności.

Oba callbacki otrzymają zdarzenia debugowania w [tym samym formacie](#debugger-event) co hooki debugowania komponentów:

```js
const plusOne = computed(() => count.value + 1, {
  onTrack(e) {
    // wyzwalane gdy count.value jest śledzone jako zależność
    debugger
  },
  onTrigger(e) {
    // wyzwalane gdy count.value jest mutowane
    debugger
  }
})

// dostęp do plusOne, powinno wyzwolić onTrack
console.log(plusOne.value)

// mutacja count.value, powinno wyzwolić onTrigger
count.value++
```

:::tip
Opcje `onTrack` i `onTrigger` działają wyłącznie w trybie deweloperskim.
:::

### Debugowanie watcher {#watcher-debugging}

<!-- TODO options API equivalent -->

Podobnie do `computed()`, watchers wspierają opcje `onTrack` i `onTrigger`:

```js
watch(source, callback, {
  onTrack(e) {
    debugger
  },
  onTrigger(e) {
    debugger
  }
})

watchEffect(callback, {
  onTrack(e) {
    debugger
  },
  onTrigger(e) {
    debugger
  }
})
```

:::tip
Opcje `onTrack` i `onTrigger` działają wyłącznie w trybie deweloperskim.
:::

## Integracja z zewnętrznymi systemami stanu {#integration-with-external-state-systems}

System reaktywności Vue działa poprzez głęboką konwersję zwykłych obiektów JavaScript na reaktywne proxy. Głęboka konwersja może być niepotrzebna lub czasami niepożądana podczas integracji z zewnętrznymi systemami zarządzania stanem (np. jeśli zewnętrzne rozwiązanie również używa Proxy).

Ogólna idea integracji systemu reaktywności Vue z zewnętrznym rozwiązaniem zarządzania stanem polega na przechowywaniu zewnętrznego stanu w [`shallowRef`](/api/reactivity-advanced#shallowref). Płytki ref jest reaktywny tylko wtedy, gdy następuje dostęp do jego właściwości `.value` - wewnętrzna wartość pozostaje nietknięta. Gdy zmienia się stan zewnętrzny, zastępujemy wartość ref-a, aby wywołać aktualizacje.

### Dane niezmienne {#immutable-data}

Jeśli implementujesz funkcję cofnij / ponów, prawdopodobnie chcesz wykonywać snapshot stanu aplikacji przy każdej edycji użytkownika. Jednak mutowalny system reaktywności Vue nie jest najlepiej dostosowany do tego, jeśli drzewo stanu jest duże, ponieważ serializacja całego obiektu stanu przy każdej aktualizacji może być kosztowna zarówno pod względem CPU, jak i pamięci.

[Niezmienne struktury danych](https://en.wikipedia.org/wiki/Persistent_data_structure) rozwiązują to poprzez nigdy niemutowanie obiektów stanu - zamiast tego tworzą nowe obiekty, które współdzielą te same, niezmienione części ze starymi. Istnieją różne sposoby używania niezmiennych danych w JavaScript, ale zalecamy używanie [Immer](https://immerjs.github.io/immer/) z Vue, ponieważ pozwala on na używanie niezmiennych danych, zachowując bardziej ergonomiczną, mutowalną składnię.

Możemy zintegrować Immer z Vue za pomocą prostego composable:

```js
import { produce } from 'immer'
import { shallowRef } from 'vue'

export function useImmer(baseState) {
  const state = shallowRef(baseState)
  const update = (updater) => {
    state.value = produce(state.value, updater)
  }

  return [state, update]
}
```

[Wypróbuj to w Playground](https://play.vuejs.org/#eNp9VMFu2zAM/RXNl6ZAYnfoTlnSdRt66DBsQ7vtEuXg2YyjRpYEUU5TBPn3UZLtuE1RH2KLfCIfycfsk8/GpNsGkmkyw8IK4xiCa8wVV6I22jq2Zw3CbV2DZQe2srpmZ2km/PmMK8a4KrRCxxbCQY1j1pgyd3DrD0s27++OFh689z/0OOEkTBlPvkNuFfvbAE/Gra/UilzOko0Mh2A+ufcHwd9ij8KtWUjwMsAqlxgjcLU854qrVaMKJ7RiTleVDBRHQpWwO4/xB8xHoRg2v+oyh/MioJepT0ClvTsxhnSUi1LOsthN6iMdCGgkBacTY7NGhjd9ScG2k5W2c56M9rG6ceBPdbOWm1AxO0/a+uiZFjJHpFv7Fj10XhdSFBtyntTJkzaxf/ZtQnYguoFNJkUkmAWGs2xAm47onqT/jPWHxjjYuUkJhba57+yUSaFg4tZWN9X6Y9eIcC8ZJ1FQkzo36QNqRZILQXjroAqnXb+9LQzVD3vtnMFpljXKbKq00HWU3/X7i/QivcxKgS5aUglVXjxNAGvK8KnWZSNJWa0KDoGChzmk3L28jSVcQX1o1d1puwfgOpdSP97BqsfQxhCCK9gFTC+tXu7/coR7R71rxRWXBL2FpHOMOAAeYVGJhBvFL3s+kGKIkW5zSfKfd+RHA2u3gzZEpML9y9JS06YtAq5DLFmOMWXsjkM6rET1YjzUcSMk2J/G1/h8TKGOb8HmV7bdQbqzhmLziv0Bd3Govywg2O1x8Umvua3ARffN/Q/S1sDZDfMN5x2glo3nGGFfGlUS7QEusL0NcxWq+o03OwcKu6Ke/+fwhIb89Y3Sj3Qv0w+9xg7/AWfvyMs=)

### Maszyny stanu {#state-machines}

[Maszyna stanów](https://en.wikipedia.org/wiki/Finite-state_machine) to model opisujący wszystkie możliwe stany, w których może znajdować się aplikacja, oraz wszystkie możliwe sposoby przejścia z jednego stanu do drugiego. Chociaż może być to przesadą dla prostych komponentów, może pomóc uczynić złożone przepływy stanów bardziej solidnymi i łatwiejszymi w zarządzaniu.

Jedną z najpopularniejszych implementacji maszyny stanów w JavaScript jest [XState](https://xstate.js.org/). Oto composable, który się z nią integruje:

```js
import { createMachine, interpret } from 'xstate'
import { shallowRef } from 'vue'

export function useMachine(options) {
  const machine = createMachine(options)
  const state = shallowRef(machine.initialState)
  const service = interpret(machine)
    .onTransition((newState) => (state.value = newState))
    .start()
  const send = (event) => service.send(event)

  return [state, send]
}
```

[Wypróbuj to w Playground](https://play.vuejs.org/#eNp1U81unDAQfpWRL7DSFqqqUiXEJumhyqVVpDa3ugcKZtcJjC1syEqId8/YBu/uIRcEM9/P/DGz71pn0yhYwUpTD1JbMMKO+o6j7LUaLMwwGvGrqk8SBSzQDqqHJMv7EMleTMIRgGOt0Fj4a2xlxZ5EsPkHhytuOjucbApIrDoeO5HsfQCllVVHUYlVbeW0xr2OKcCzHCwkKQAK3fP56fHx5w/irSyqbfFMgA+h0cKBHZYey45jmYfeqWv6sKLXHbnTF0D5f7RWITzUnaxfD5y5ztIkSCY7zjwKYJ5DyVlf2fokTMrZ5sbZDu6Bs6e25QwK94b0svgKyjwYkEyZR2e2Z2H8n/pK04wV0oL8KEjWJwxncTicnb23C3F2slabIs9H1K/HrFZ9HrIPX7Mv37LPuTC5xEacSfa+V83YEW+bBfleFkuW8QbqQZDEuso9rcOKQQ/CxosIHnQLkWJOVdept9+ijSA6NEJwFGePaUekAdFwr65EaRcxu9BbOKq1JDqnmzIi9oL0RRDu4p1u/ayH9schrhlimGTtOLGnjeJRAJnC56FCQ3SFaYriLWjA4Q7SsPOp6kYnEXMbldKDTW/ssCFgKiaB1kusBWT+rkLYjQiAKhkHvP2j3IqWd5iMQ+M=)

### RxJS {#rxjs}

[RxJS](https://rxjs.dev/) jest biblioteką do pracy ze strumieniami zdarzeń asynchronicznych. Biblioteka [VueUse](https://vueuse.org/) udostępnia dodatek [`@vueuse/rxjs`](https://vueuse.org/rxjs/readme.html) do łączenia strumieni RxJS z systemem reaktywności Vue.

## Powiązanie z Sygnałami {#connection-to-signals}

Wiele innych frameworków wprowadziło prymitywy reaktywności podobne do refs z Vue Composition API, pod pojęciem "sygnałów":

- [Solid Signals](https://www.solidjs.com/docs/latest/api#createsignal)
- [Angular Signals](https://angular.io/guide/signals)
- [Preact Signals](https://preactjs.com/guide/v10/signals/)
- [Qwik Signals](https://qwik.builder.io/docs/components/state/#usesignal)

Fundamentalnie, sygnały są tym samym rodzajem prymitywu reaktywności co Vue refs. Jest to kontener wartości, który zapewnia śledzenie zależności podczas dostępu i wyzwalanie efektów ubocznych podczas mutacji. Ten paradygmat oparty na prymitywach reaktywności nie jest szczególnie nowym konceptem w świecie frontendu: sięga implementacji takich jak [Knockout observables](https://knockoutjs.com/documentation/observables.html) i [Meteor Tracker](https://docs.meteor.com/api/tracker.html) sprzed ponad dekady. Vue Options API i biblioteka zarządzania stanem React [MobX](https://mobx.js.org/) również bazują na tych samych zasadach, ale ukrywają prymitywy za właściwościami obiektów.

Choć nie jest to cecha niezbędna, aby coś kwalifikowało się jako sygnały, obecnie koncepcja ta jest często omawiana wraz z modelem renderowania, w którym aktualizacje są wykonywane poprzez precyzyjne subskrypcje. Ze względu na użycie Virtual DOM, Vue obecnie [polega na kompilatorach, aby osiągnąć podobne optymalizacje](/guide/extras/rendering-mechanism#compiler-informed-virtual-dom). Jednak badamy również nową strategię kompilacji inspirowaną Solid, zwaną [Vapor Mode](https://github.com/vuejs/core-vapor), która nie opiera się na Virtual DOM i lepiej wykorzystuje wbudowany system reaktywności Vue.

### Kompromisy w Projektowaniu API {#api-design-trade-offs}

Projekt sygnałów Preact i Qwik jest bardzo podobny do Vue [shallowRef](/api/reactivity-advanced#shallowref): wszystkie trzy zapewniają mutowalny interfejs poprzez właściwość `.value`. Skupimy się na omówieniu sygnałów Solid i Angular.

#### Solid Signals {#solid-signals}

Projekt API `createSignal()` w Solid kładzie nacisk na rozdzielenie odczytu/zapisu. Sygnały są eksponowane jako gettery tylko do odczytu i oddzielny setter:

```js
const [count, setCount] = createSignal(0)

count() // dostęp do wartości
setCount(1) // aktualizacja wartości
```

Zauważ, że sygnał `count` może być przekazywany bez settera. Zapewnia to, że stan nigdy nie może być zmutowany, chyba że setter jest również jawnie wyeksponowany. To, czy ta gwarancja bezpieczeństwa uzasadnia bardziej rozwlekłą składnię, może zależeć od wymagań projektu i osobistych preferencji - ale jeśli preferujesz ten styl API, możesz łatwo go odtworzyć w Vue:

```js
import { shallowRef, triggerRef } from 'vue'

export function createSignal(value, options) {
  const r = shallowRef(value)
  const get = () => r.value
  const set = (v) => {
    r.value = typeof v === 'function' ? v(r.value) : v
    if (options?.equals === false) triggerRef(r)
  }
  return [get, set]
}
```

[Wypróbuj to w Playground](https://play.vuejs.org/#eNpdUk1TgzAQ/Ss7uQAjgr12oNXxH+ix9IAYaDQkMV/qMPx3N6G0Uy9Msu/tvn2PTORJqcI7SrakMp1myoKh1qldI9iopLYwQadpa+krG0TLYYZeyxGSojSSs/d7E8vFh0ka0YhOCmPh0EknbB4mPYfTEeqbIelD1oiqXPRQCS+WjoojAW8A1Wmzm1A39KYZzHNVYiUib85aKeCx46z7rBuySqQe6h14uINN1pDIBWACVUcqbGwtl17EqvIiR3LyzwcmcXFuTi3n8vuF9jlYzYaBajxfMsDcomv6E/m9E51luN2NV99yR3OQKkAmgykss+SkMZerxMLEZFZ4oBYJGAA600VEryAaD6CPaJwJKwnr9ldR2WMedV1Dsi6WwB58emZlsAV/zqmH9LzfvqBfruUmNvZ4QN7VearjenP4aHwmWsABt4x/+tiImcx/z27Jqw==)

#### Angular Signals {#angular-signals}

Angular przechodzi fundamentalne zmiany, rezygnując z dirty-checkingu i wprowadzając własną implementację prymitywu reaktywności. API Angular Signal wygląda następująco:

```js
const count = signal(0)

count() // dostęp do wartości
count.set(1) // ustawienie nowej wartości
count.update((v) => v + 1) // aktualizacja bazująca na poprzedniej wartości
```
Ponownie, możemy bardzo łatwo zreplikować to API we Vue:

```js
import { shallowRef } from 'vue'

export function signal(initialValue) {
  const r = shallowRef(initialValue)
  const s = () => r.value
  s.set = (value) => {
    r.value = value
  }
  s.update = (updater) => {
    r.value = updater(r.value)
  }
  return s
}
```

[Wypróbuj to w Playground](https://play.vuejs.org/#eNp9Ul1v0zAU/SuWX9ZCSRh7m9IKGHuAB0AD8WQJZclt6s2xLX+ESlH+O9d2krbr1Df7nnPu17k9/aR11nmgt7SwleHaEQvO6w2TvNXKONITyxtZihWpVKu9g5oMZGtUS66yvJSNF6V5lyjZk71ikslKSeuQ7qUj61G+eL+cgFr5RwGITAkXiyVZb5IAn2/IB+QWeeoHO8GPg1aL0gH+CCl215u7mJ3bW9L3s3IYihyxifMlFRpJqewL1qN3TknysRK8el4zGjNlXtdYa9GFrjryllwvGY18QrisDLQgXZTnSX8pF64zzD7pDWDghbbI5/Hoip7tFL05eLErhVD/HmB75Edpyd8zc9DUaAbso3TrZeU4tjfawSV3vBR/SuFhSfrQUXLHBMvmKqe8A8siK7lmsi5gAbJhWARiIGD9hM7BIfHSgjGaHljzlDyGF2MEPQs6g5dpcAIm8Xs+2XxODTgUn0xVYdJ5RxPhKOd4gdMsA/rgLEq3vEEHlEQPYrbgaqu5APNDh6KWUTyuZC2jcWvfYswZD6spXu2gen4l/mT3Icboz3AWpgNGZ8yVBttM8P2v77DH9wy2qvYC2RfAB7BK+NBjon32ssa2j3ix26/xsrhsftv7vQNpp6FCo4E5RD6jeE93F0Y/tHuT3URd2OLwHyXleRY=)

W porównaniu do Vue refs, styl API oparty na getterach w Solid i Angular oferuje kilka interesujących kompromisów podczas użycia w komponentach Vue:

- `()` jest nieco mniej rozwlekłe niż `.value`, ale aktualizacja wartości jest bardziej rozwlekła.
- Nie ma odpakowywania ref: dostęp do wartości zawsze wymaga `()`. Sprawia to, że dostęp do wartości jest spójny wszędzie. Oznacza to również, że możesz przekazywać surowe sygnały jako właściwości komponentów.

To, czy te style API ci odpowiadają, jest do pewnego stopnia subiektywne. Naszym celem jest zademonstrowanie podstawowego podobieństwa i kompromisów między tymi różnymi projektami API. Chcemy również pokazać, że Vue jest elastyczne: nie jesteś tak naprawdę ograniczony do istniejących API. W razie potrzeby możesz stworzyć własne API prymitywów reaktywności, aby spełnić bardziej specyficzne potrzeby.
