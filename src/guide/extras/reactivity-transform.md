# Reactivity Transform {#reactivity-transform}

:::danger Usunięta funkcjonalność eksperymentalna
Reactivity Transform była funkcjonalnością eksperymentalną i została usunięta w najnowszym wydaniu 3.4. Przeczytaj o [powodach tutaj](https://github.com/vuejs/rfcs/discussions/369#discussioncomment-5059028).

Jeśli nadal zamierzasz jej używać, jest teraz dostępna poprzez wtyczkę [Vue Macros](https://vue-macros.sxzz.moe/features/reactivity-transform.html).
:::

:::tip Specyficzne dla Composition API
Reactivity Transform jest funkcjonalnością specyficzną dla Composition API i wymaga dodatkowego kroku w czasie budowania.
:::

## Zmienne Refs vs. Reactive {#refs-vs-reactive-variables}

Od czasu wprowadzenia Composition API, jednym z głównych nierozwiązanych pytań jest użycie refs kontra obiektów reaktywnych. Łatwo jest stracić reaktywność podczas destrukturyzacji obiektów reaktywnych, podczas gdy używanie `.value` wszędzie przy używaniu refs może być uciążliwe. Ponadto, `.value` jest łatwe do przeoczenia, jeśli nie używa się systemu typów.

[Vue Reactivity Transform](https://github.com/vuejs/core/tree/main/packages/reactivity-transform) to transformacja dokonywana w czasie kompilacji, która pozwala nam pisać kod w ten sposób:

```vue
<script setup>
let count = $ref(0)

console.log(count)

function increment() {
  count++
}
</script>

<template>
  <button @click="increment">{{ count }}</button>
</template>
```

Metoda `$ref()` jest tutaj **makrem czasu kompilacji**: nie jest to właściwa metoda która zostanie wywołana w czasie wykonania. Zamiast tego, kompilator Vue używa jej jako wskazówki do traktowania powstałej zmiennej `count` jako **zmiennej reaktywnej.**

Zmienne reaktywne mogą być odczytywane i przypisywane tak jak zwykłe zmienne, ale te operacje są kompilowane do referencji z `.value`. Na przykład, część `<script>` powyższego komponentu jest skompilowana do:

```js{5,8}
import { ref } from 'vue'

let count = ref(0)

console.log(count.value)

function increment() {
  count.value++
}
```

Każde API reaktywności które zwraca referencje będzie miało odpowiednik makra z przedrostkiem `$`. Te API obejmują:

- [`ref`](/api/reactivity-core#ref) -> `$ref`
- [`computed`](/api/reactivity-core#computed) -> `$computed`
- [`shallowRef`](/api/reactivity-advanced#shallowref) -> `$shallowRef`
- [`customRef`](/api/reactivity-advanced#customref) -> `$customRef`
- [`toRef`](/api/reactivity-utilities#toref) -> `$toRef`

Te makra są dostępne globalnie i nie muszą być importowane gdy Transformacja Reaktywności jest włączona, ale możesz opcjonalnie importować je z `vue/macros` jeśli chcesz być bardziej precyzyjny:

```js
import { $ref } from 'vue/macros'

let count = $ref(0)
```

## Destrukturyzacja z `$()` {#destructuring-with}

Powszechne jest, że funkcja kompozycyjna zwraca obiekt referencji i używa destrukturyzacji do pobrania tych referencji. W tym celu transformacja reaktywności zapewnia makro **`$()`**:

```js
import { useMouse } from '@vueuse/core'

const { x, y } = $(useMouse())

console.log(x, y)
```

Skompilowany wynik:

```js
import { toRef } from 'vue'
import { useMouse } from '@vueuse/core'

const __temp = useMouse(),
  x = toRef(__temp, 'x'),
  y = toRef(__temp, 'y')

console.log(x.value, y.value)
```

Zauważ, że jeśli `x` jest już referencją, `toRef(__temp, 'x')` po prostu zwróci ją bez zmian i żadna dodatkowa referencja nie zostanie utworzona. Jeśli zdestrukturyzowana wartość nie jest referencją (np. funkcja), nadal będzie działać - wartość zostanie opakowana w referencję, więc reszta kodu działa zgodnie z oczekiwaniami.

Destrukturyzacja `$()` działa zarówno na obiektach reaktywnych **jak i** zwykłych obiektach zawierających referencje.

## Konwertowanie Istniejących Referencji na Zmienne Reaktywne z `$()` {#convert-existing-refs-to-reactive-variables-with}

W niektórych przypadkach możemy mieć opakowane funkcje, które również zwracają referencje. Jednak kompilator Vue nie będzie w stanie wiedzieć z wyprzedzeniem, że funkcja zwróci referencję. W takich przypadkach makro `$()` może być również używane do konwertowania istniejących referencji na zmienne reaktywne:

```js
function myCreateRef() {
  return ref(0)
}

let count = $(myCreateRef())
```

## Destrukturyzacja Reaktywnych Propsów {#reactive-props-destructure}

Istnieją dwa problematyczne punkty w obecnym użyciu `defineProps()` w `<script setup>`:

1. Podobnie jak w przypadku `.value`, musisz zawsze odwoływać się do propsów jako `props.x`, aby zachować reaktywność. Oznacza to, że nie możesz destrukturyzować `defineProps`, ponieważ wynikowe zdestrukturyzowane zmienne nie są reaktywne i nie będą się aktualizować.

2. Podczas używania [deklaracji propsów tylko z typami](/api/sfc-script-setup#type-only-props-emit-declarations), nie ma prostego sposobu na zadeklarowanie domyślnych wartości dla propsów. Wprowadziliśmy API `withDefaults()` dokładnie w tym celu, ale nadal jest to nieporęczne w użyciu.

Możemy rozwiązać te problemy stosując transformację w czasie kompilacji, gdy `defineProps` jest używany z destrukturyzacją, podobnie jak widzieliśmy wcześniej z `$()`:

```html
<script setup lang="ts">
  interface Props {
    msg: string
    count?: number
    foo?: string
  }

  const {
    msg,
    // wartość domyślna po prostu działa
    count = 1,
    // lokalne aliasy również po prostu działają
    // tutaj aliasujemy `props.foo` na `bar`
    foo: bar
  } = defineProps<Props>()

  watchEffect(() => {
    // zaloguje się za każdym razem gdy propsy się zmienią
    console.log(msg, count, bar)
  })
</script>
```

Powyższy kod zostanie skompilowany do następnego równoważnego kodu w czasie wykonania:

```js
export default {
  props: {
    msg: { type: String, required: true },
    count: { type: Number, default: 1 },
    foo: String
  },
  setup(props) {
    watchEffect(() => {
      console.log(props.msg, props.count, props.foo)
    })
  }
}
```

## Zachowanie Reaktywności Przez Granice Funkcji {#retaining-reactivity-across-function-boundaries}

Chociaż zmienne reaktywne zwalniają nas z konieczności używania `.value` wszędzie, tworzą problem "utraty reaktywności" gdy przekazujemy zmienne reaktywne przez granice funkcji. Może to nastąpić w dwóch przypadkach:

### Przekazywanie do funkcji jako argument {#passing-into-function-as-argument}

Mając funkcję, która oczekuje referencji jako argumentu, np.:

```ts
function trackChange(x: Ref<number>) {
  watch(x, (x) => {
    console.log('x zmienione!')
  })
}

let count = $ref(0)
trackChange(count) // nie działa!
```

Powyższy przypadek nie będzie działać zgodnie z oczekiwaniami, ponieważ kompiluje się do:

```ts
let count = ref(0)
trackChange(count.value)
```

W tym przypadku `count.value` jest przekazywane jako liczba, podczas gdy `trackChange` oczekuje właściwej referencji. Można to naprawić opakowując `count` w `$$()` przed przekazaniem:

```diff
let count = $ref(0)
- trackChange(count)
+ trackChange($$(count))
```

Powyższe kompiluje się do:

```js
import { ref } from 'vue'

let count = ref(0)
trackChange(count)
```

Jak widać, `$$()` jest makrem, które służy jako **podpowiedź ucieczki**: zmienne reaktywne wewnątrz `$$()` nie będą miały dołączonego `.value`.

### Zwracanie wewnątrz zakresu funkcji {#returning-inside-function-scope}

Reaktywność może również zostać utracona, jeśli zmienne reaktywne są używane bezpośrednio w zwracanym wyrażeniu:

```ts
function useMouse() {
  let x = $ref(0)
  let y = $ref(0)

  // nasłuchiwanie zdarzenia ruchu myszką...

  // nie działa!
  return {
    x,
    y
  }
}
```

Powyższa instrukcja return kompiluje się do:

```ts
return {
  x: x.value,
  y: y.value
}
```

Aby zachować reaktywność, powinniśmy zwracać rzeczywiste referencje, a nie obecną wartość w momencie zwracania.

Ponownie, możemy użyć `$$()` aby to naprawić. W tym przypadku, `$$()` może być użyte bezpośrednio na zwracanym obiekcie - każde odwołanie do zmiennych reaktywnych wewnątrz wywołania `$$()` zachowa referencję do ich bazowych refs:

```ts
function useMouse() {
  let x = $ref(0)
  let y = $ref(0)

  // nasłuchiwanie zdarzenia ruchu myszką...

  // naprawione
  return $$({
    x,
    y
  })
}
```

### Używanie `$$()` na destrukturyzowanych propsach {#using-on-destructured-props}

`$$()` działa na destrukturyzowanych propsach, ponieważ one również są zmiennymi reaktywnymi. Kompilator przekonwertuje je przy użyciu `toRef` dla zwiększenia wydajności:

```ts
const { count } = defineProps<{ count: number }>()

passAsRef($$(count))
```

kompiluje się do:

```js
setup(props) {
  const __props_count = toRef(props, 'count')
  passAsRef(__props_count)
}
```

## Integracja z TypeScript <sup class="vt-badge ts" /> {#typescript-integration}

Vue zapewnia typowanie dla tych makr (dostępnych globalnie) i wszystkie typy będą działać zgodnie z oczekiwaniami. Nie ma żadnych niezgodności ze standardową semantyką TypeScript, więc składnia będzie działać ze wszystkimi istniejącymi narzędziami.

Oznacza to również, że makra mogą działać w dowolnych plikach, w których dozwolony jest poprawny JS / TS - nie tylko wewnątrz Vue SFC.

Ponieważ makra są dostępne globalnie, ich typy muszą być jawnie zreferowane (np. w pliku `env.d.ts`):

```ts
/// <reference types="vue/macros-global" />
```
Gdy makro jest jawnie importowane z `vue/macros`, typowanie będzie działać bez globalnej deklaracji.

## Jawne Opt-in {#explicit-opt-in}

:::danger Nie jest dłużej wspierane w podstawie
Dotyczy wyłącznie wersji Vue 3.3 i poniżej. Wsparcie zostało usunięte w podstawie Vue w wersji 3.4 i wyżej oraz `@vitejs/plugin-vue` 5.0 i wyżej. Jeśli chcesz kontynuować używanie transform, prosimy zmigruj do [Vue Macros](https://vue-macros.sxzz.moe/features/reactivity-transform.html) zamiast tego.
:::

### Vite {#vite}

- Wymaga `@vitejs/plugin-vue@>=2.0.0`
- Dotyczy plików SFCs i js(x)/ts(x). Szybkie sprawdzenie użycia jest wykonywane na plikach przed zastosowaniem transformacji, więc nie powinno być żadnego kosztu wydajnościowego dla plików niewykorzystujących makr.
- Zwróć uwagę, że `reactivityTransform` jest teraz opcją na poziomie głównym wtyczki zamiast zagnieżdżoną jako `script.refSugar`, ponieważ wpływa nie tylko na SFC.

```js [vite.config.js]
export default {
  plugins: [
    vue({
      reactivityTransform: true
    })
  ]
}
```

### `vue-cli` {#vue-cli}

- Aktualnie dotyka wyłącznie SFC
- Wymaga `vue-loader@>=17.0.0`

```js [vue.config.js]
module.exports = {
  chainWebpack: (config) => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap((options) => {
        return {
          ...options,
          reactivityTransform: true
        }
      })
  }
}
```

### Czysty `webpack` + `vue-loader` {#plain-webpack-vue-loader}

- Aktualnie dotyka wyłącznie SFC
- Wymaga `vue-loader@>=17.0.0`

```js [webpack.config.js]
module.exports = {
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          reactivityTransform: true
        }
      }
    ]
  }
}
```
