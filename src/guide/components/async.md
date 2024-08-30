# Komponenty asynchroniczne {#async-components}

## Podstawowe użycie {#basic-usage}

W dużych aplikacjach może zajść potrzeba podzielenia aplikacji na mniejsze części i ładowania komponentów z serwera tylko wtedy, gdy są potrzebne. Aby to umożliwić, Vue posiada funkcję [`defineAsyncComponent`](/api/general#defineasynccomponent):

```js
import { defineAsyncComponent } from 'vue'

const AsyncComp = defineAsyncComponent(() => {
  return new Promise((resolve, reject) => {
    // ...załaduj komponent z serwera
    resolve(/* załadowany komponent */)
  })
})
// ... używaj `AsyncComp` jak normalnego komponentu
```

Jak widać, `defineAsyncComponent` przyjmuje funkcję ładującą, która zwraca Promise. Wywołanie funkcji `resolve` w Promise powinno nastąpić, gdy definicja komponentu zostanie pobrana z serwera. Możesz również wywołać `reject(reason)`, aby wskazać, że ładowanie nie powiodło się.

[Dynamiczny import modułów ES](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) również zwraca Promise, więc najczęściej będziemy używać go w połączeniu z `defineAsyncComponent`. Bundlery takie jak Vite i webpack również wspierają tę składnię (i będą jej używać jako punktów podziału bundli), dzięki czemu możemy używać jej do importowania komponentów Vue SFC:

```js
import { defineAsyncComponent } from 'vue'

const AsyncComp = defineAsyncComponent(() =>
  import('./components/MyComponent.vue')
)
```

Powstały `AsyncComp` jest komponentem opakowującym, który wywołuje funkcję ładującą tylko wtedy, gdy jest faktycznie renderowany na stronie. Dodatkowo, przekazuje wszystkie propsy i sloty do wewnętrznego komponentu, dzięki czemu możesz użyć asynchronicznego wrappera do płynnego zastąpienia oryginalnego komponentu, zachowując ładowanie leniwe.

Podobnie jak w przypadku zwykłych komponentów, komponenty asynchroniczne mogą być [rejestrowane globalnie](/guide/components/registration#global-registration) przy użyciu `app.component()`:

```js
app.component('MyComponent', defineAsyncComponent(() =>
  import('./components/MyComponent.vue')
))
```

<div class="options-api">

Możesz również użyć `defineAsyncComponent` podczas [lokalnej rejestracji komponentu](/guide/components/registration#local-registration):

```vue
<script>
import { defineAsyncComponent } from 'vue'

export default {
  components: {
    AdminPage: defineAsyncComponent(() =>
      import('./components/AdminPageComponent.vue')
    )
  }
}
</script>

<template>
  <AdminPage />
</template>
```

</div>

<div class="composition-api">

Mogą być również zdefiniowane bezpośrednio wewnątrz komponentu nadrzędnego:

```vue
<script setup>
import { defineAsyncComponent } from 'vue'

const AdminPage = defineAsyncComponent(() =>
  import('./components/AdminPageComponent.vue')
)
</script>

<template>
  <AdminPage />
</template>
```

</div>

## Stany ładowania i błędów {#loading-and-error-states}

Operacje asynchroniczne nieuchronnie wiążą się ze stanami ładowania i błędów - `defineAsyncComponent()` wspiera obsługę tych stanów poprzez zaawansowane opcje:

```js
const AsyncComp = defineAsyncComponent({
  // funkcja ładująca
  loader: () => import('./Foo.vue'),

  // Komponent używany podczas ładowania komponentu asynchronicznego
  loadingComponent: LoadingComponent,
  // Opóźnienie przed pokazaniem komponentu ładowania. Domyślnie: 200ms.
  delay: 200,

  // Komponent używany w przypadku błędu ładowania
  errorComponent: ErrorComponent,
  // Komponent błędu zostanie wyświetlony, jeśli przekroczony
  // zostanie określony limit czasu. Domyślnie: Infinity.
  timeout: 3000
})
```

Jeśli dostarczony jest komponent ładowania, będzie on wyświetlany jako pierwszy podczas ładowania komponentu wewnętrznego. Domyślnie występuje 200ms opóźnienia przed pokazaniem komponentu ładowania - dzieje się tak, ponieważ w szybkich sieciach natychmiastowy stan ładowania może zostać zastąpiony zbyt szybko i wyglądać jak migotanie.

Jeśli dostarczony jest komponent błędu, zostanie on wyświetlony, gdy Promise zwrócony przez funkcję ładującą zostanie odrzucony. Możesz również określić limit czasu, aby pokazać komponent błędu, gdy żądanie trwa zbyt długo.

## Leniwa Hydratacja <sup class="vt-badge" data-text="3.5+" /> {#lazy-hydration}

> Ta sekcja może być istotna jedynie jeśli korzystasz z [renderowania po stronie serwera](/guide/scaling-up/ssr).

W Vue 3.5+, komponenty asynchroniczne mogą kontrolować kiedy mają przejść proces hydratacji poprzez przekazywanie odpowiedniej strategii hydratacji.

- Vue dostarcza wiele wbudowanych strategii hydratacji. Te wbudowane strategie muszą być importowane wedle potrzeb, aby były pominięte poprzez tree-shaking jeśli nie są używane.

- Zaprojektowane one zostały celowo na niskim poziomie, aby były bardziej elastyczne. W przyszłości może pojawić się cukier syntaktyczny w samym frameworku lub narzędziach wyższego poziomu (jak np. Nuxt).

### Hydratacja gdy przeglądarka jest idle

Dokonuje hydratacji poprzez `requestIdleCallback`:

```js
import { defineAsyncComponent, hydrateOnIdle } from 'vue'

const AsyncComp = defineAsyncComponent({
  loader: () => import('./Comp.vue'),
  hydrate: hydrateOnIdle(/* opcjonalnie przekaż maksymalny timeout */)
})
```

### Hydratacja gdy widoczny

Element(y) przejdą hydratację gdy będą uznane za widoczne poprzez `IntersectionObserver`.

```js
import { defineAsyncComponent, hydrateOnVisible } from 'vue'

const AsyncComp = defineAsyncComponent({
  loader: () => import('./Comp.vue'),
  hydrate: hydrateOnVisible()
})
```

Opcjonalnie, możemy przekazać też obiekt z opcjami dla obserwatora:

```js
hydrateOnVisible({ rootMargin: '100px' })
```

### Hydratacja zależna od Media Query

Hydratacja odbędzie się gdy media query zostanie spełnione.

```js
import { defineAsyncComponent, hydrateOnMediaQuery } from 'vue'

const AsyncComp = defineAsyncComponent({
  loader: () => import('./Comp.vue'),
  hydrate: hydrateOnMediaQuery('(max-width:500px)')
})
```

### Hydratacja na interakcji

Hydratacja odbędzie się gdy dane zdarzenie (lub zdarzenia) są wywołane przez elementy komponentu. Zdarzenia te zostaną wywołane na nowo, gdy hydratacja się zakończy.

```js
import { defineAsyncComponent, hydrateOnInteraction } from 'vue'

const AsyncComp = defineAsyncComponent({
  loader: () => import('./Comp.vue'),
  hydrate: hydrateOnInteraction('click')
})
```

Może to być również lista wielu różnych typów zdarzeń:

```js
hydrateOnInteraction(['wheel', 'mouseover'])
```

### Własna strategia

```ts
import { defineAsyncComponent, type HydrationStrategy } from 'vue'

const myStrategy: HydrationStrategy = (hydrate, forEachElement) => {
  // forEachElement to helper służący do iterowania się przez elementy
  // nadrzędne drzewa DOM komponentu przed hydratacją, gdyż mogą to być
  // fragmenty a nie jeden konkretny element
  forEachElement(el => {
    // ...
  })
  // wywołaj `hydrate` gdy gotowe
  hydrate()
  return () => {
    // zwróć funkcję do wywołania przy demontażu jeśli potrzeba
  }
}

const AsyncComp = defineAsyncComponent({
  loader: () => import('./Comp.vue'),
  hydrate: myStrategy
})
```

## Używanie z Suspense {#using-with-suspense}

Komponenty asynchroniczne mogą być używane z wbudowanym komponentem `<Suspense>`. Interakcja między `<Suspense>` a komponentami asynchronicznymi jest udokumentowana w [dedykowanym rozdziale dla `<Suspense>`](/guide/built-ins/suspense).
