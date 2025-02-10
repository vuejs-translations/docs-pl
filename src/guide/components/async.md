# Komponenty Asynchroniczne {#async-components}

## Podstawowe Użycie {#basic-usage}

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

## Stany Ładowania i Błędów {#loading-and-error-states}

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

## Używanie z Suspense {#using-with-suspense}

Komponenty asynchroniczne mogą być używane z wbudowanym komponentem `<Suspense>`. Interakcja między `<Suspense>` a komponentami asynchronicznymi jest udokumentowana w [dedykowanym rozdziale dla `<Suspense>`](/guide/built-ins/suspense).
