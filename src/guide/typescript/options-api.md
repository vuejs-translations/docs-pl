# TypeScript z Options API {#typescript-with-options-api}

> Ta strona zakłada, że przeczytałeś już [Używanie Vue z TypeScript](./overview).

:::tip
Mimo że Vue wspiera użycie TypeScript z Options API, zalecane jest używanie Vue z TypeScript poprzez Composition API, ponieważ oferuje prostsze, wydajniejsze i bardziej niezawodne wnioskowanie typów.
:::

## Typowanie propsów komponentu {#typing-component-props}

Wnioskowanie typów dla propsów w Options API wymaga owinięcia komponentu w `defineComponent()`. Dzięki temu Vue jest w stanie wywnioskować typy dla propsów na podstawie opcji `props`, biorąc pod uwagę dodatkowe opcje takie jak `required: true` i `default`:

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  // wnioskowanie typów włączone
  props: {
    name: String,
    id: [Number, String],
    msg: { type: String, required: true },
    metadata: null
  },
  mounted() {
    this.name // typ: string | undefined
    this.id // typ: number | string | undefined
    this.msg // typ: string
    this.metadata // typ: any
  }
})
```

Jednakże opcje `props` wykonywane w czasie działania wspierają jedynie użycie funkcji konstruktora jako typ propa - nie ma możliwości określenia złożonych typów, takich jak obiekty z zagnieżdżonymi właściwościami lub sygnaturami wywołania funkcji.

Aby opisać złożone typy propsów, możemy użyć typu pomocniczego `PropType`:

```ts
import { defineComponent } from 'vue'
import type { PropType } from 'vue'

interface Book {
  title: string
  author: string
  year: number
}

export default defineComponent({
  props: {
    book: {
      // podaj bardziej szczegółowy typ dla `Object`
      type: Object as PropType<Book>,
      required: true
    },
    // można również opisać funkcje
    callback: Function as PropType<(id: number) => void>
  },
  mounted() {
    this.book.title // string
    this.book.year // number

    // Błąd TS: argument typu 'string' nie jest
    // przypisywalny do parametru typu 'number'
    this.callback?.('123')
  }
})
```

### Zastrzeżenia {#caveats}

Jeśli używasz wersji TypeScript niższej niż `4.7`, musisz zachować ostrożność używając wartości funkcji dla opcji propów `validator` i `default` - upewnij się, że używasz funkcji strzałkowych:

```ts
import { defineComponent } from 'vue'
import type { PropType } from 'vue'

interface Book {
  title: string
  year?: number
}

export default defineComponent({
  props: {
    bookA: {
      type: Object as PropType<Book>,
      // Upewnij się, że używasz funkcji strzałkowych jeśli Twoja wersja TypeScript jest niższa niż 4.7
      default: () => ({
        title: 'Wyrażenie Funkcji Strzałkowej'
      }),
      validator: (book: Book) => !!book.title
    }
  }
})
```

Zapobiega to konieczności wnioskowania przez TypeScript typu `this` wewnątrz tych funkcji, co niestety może powodować niepowodzenie wnioskowania typów. Było to wcześniejsze [ograniczenie projektowe](https://github.com/microsoft/TypeScript/issues/38845), które zostało ulepszone w [TypeScript 4.7](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-7.html#improved-function-inference-in-objects-and-methods).

## Typowanie emitów komponentu {#typing-component-emits}

Możemy zadeklarować oczekiwany typ payload'u dla emitowanego zdarzenia używając składni obiektowej opcji `emits`. Dodatkowo, wszystkie niezadeklarowane emitowane zdarzenia będą powodować błąd typu podczas wywoływania:

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  emits: {
    addBook(payload: { bookName: string }) {
      // wykonaj walidację w czasie wykonania
      return payload.bookName.length > 0
    }
  },
  methods: {
    onSubmit() {
      this.$emit('addBook', {
        bookName: 123 // Błąd typu!
      })

      this.$emit('non-declared-event') // Błąd typu!
    }
  }
})
```

## Typowanie właściwości obliczanych {#typing-computed-properties}

Właściwość obliczana wywnioskuje swój typ na podstawie zwracanej wartości:

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  data() {
    return {
      message: 'Witaj!'
    }
  },
  computed: {
    greeting() {
      return this.message + '!'
    }
  },
  mounted() {
    this.greeting // typ: string
  }
})
```

W niektórych przypadkach możesz chcieć jawnie opisać typ właściwości obliczanej, aby upewnić się, że jej implementacja jest poprawna:

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  data() {
    return {
      message: 'Witaj!'
    }
  },
  computed: {
    // jawnie opisz typ zwracany
    greeting(): string {
      return this.message + '!'
    },

    // opisywanie zapisywalnej właściwości obliczanej
    greetingUppercased: {
      get(): string {
        return this.greeting.toUpperCase()
      },
      set(newValue: string) {
        this.message = newValue.toUpperCase()
      }
    }
  }
})
```

Jawne adnotacje mogą być również wymagane w niektórych skrajnych przypadkach, gdy TypeScript nie może wywnioskować typu właściwości obliczanej z powodu cyklicznych pętli wnioskowania.

## Typowanie Obsługi Zdarzeń {#typing-event-handlers}

Podczas pracy z natywnymi zdarzeniami DOM, może być przydatne poprawne typowanie argumentu, który przekazujemy do funkcji obsługującej. Przyjrzyjmy się temu przykładowi:

```vue
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  methods: {
    handleChange(event) {
      // `event` niejawnie ma typ `any`
      console.log(event.target.value)
    }
  }
})
</script>

<template>
  <input type="text" @change="handleChange" />
</template>
```

Bez adnotacji typu, argument `event` będzie miał niejawnie typ `any`. Spowoduje to błąd TS jeśli `"strict": true` lub `"noImplicitAny": true` są używane w `tsconfig.json`. Dlatego zaleca się jawne oznaczenie argumentu handlera zdarzeń. Dodatkowo może być konieczne użycie asercji typu podczas uzyskiwania dostępu do właściwości `event`:

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  methods: {
    handleChange(event: Event) {
      console.log((event.target as HTMLInputElement).value)
    }
  }
})
```

## Rozszerzanie Właściwości Globalnych {#augmenting-global-properties}

Niektóre wtyczki instalują globalnie dostępne właściwości dla wszystkich instancji komponentów poprzez [`app.config.globalProperties`](/api/application#app-config-globalproperties). Na przykład, możemy zainstalować `this.$http` do pobierania danych lub `this.$translate` do internacjonalizacji. Aby działało to poprawnie z TypeScript, Vue udostępnia interfejs `ComponentCustomProperties` zaprojektowany do rozszerzania poprzez [rozszerzanie modułów TypeScript](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation):

```ts
import axios from 'axios'

declare module 'vue' {
  interface ComponentCustomProperties {
    $http: typeof axios
    $translate: (key: string) => string
  }
}
```

Zobacz także:

- [Testy jednostkowe TypeScript dla rozszerzeń typów komponentów](https://github.com/vuejs/core/blob/main/packages-private/dts-test/componentTypeExtensions.test-d.tsx)

### Umiejscowienie Rozszerzenia Typów {#type-augmentation-placement}

Możemy umieścić to rozszerzenie typów w pliku `.ts` lub w ogólnoprojektowym pliku `*.d.ts`. W obu przypadkach upewnij się, że jest ono uwzględnione w `tsconfig.json`. Dla autorów bibliotek/wtyczek, ten plik powinien być określony we właściwości `types` w `package.json`.

Aby skorzystać z rozszerzenia modułu, musisz upewnić się, że rozszerzenie jest umieszczone w [module TypeScript](https://www.typescriptlang.org/docs/handbook/modules.html). Oznacza to, że plik musi zawierać co najmniej jeden `import` lub `export` na najwyższym poziomie, nawet jeśli jest to tylko `export {}`. Jeśli rozszerzenie zostanie umieszczone poza modułem, nadpisze oryginalne typy zamiast je rozszerzać!

```ts
// Nie działa, nadpisuje oryginalne typy.
declare module 'vue' {
  interface ComponentCustomProperties {
    $translate: (key: string) => string
  }
}
```

```ts
// Działa poprawnie
export {}

declare module 'vue' {
  interface ComponentCustomProperties {
    $translate: (key: string) => string
  }
}
```

## Rozszerzanie Opcji Niestandardowych {#augmenting-custom-options}

Niektóre wtyczki, na przykład `vue-router`, zapewniają wsparcie dla niestandardowych opcji komponentów, takich jak `beforeRouteEnter`:

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  beforeRouteEnter(to, from, next) {
    // ...
  }
})
```

Bez odpowiedniego rozszerzenia typów, argumenty tego hooka będą miały niejawnie typ `any`. Możemy rozszerzyć interfejs `ComponentCustomOptions`, aby obsługiwał te niestandardowe opcje:

```ts
import { Route } from 'vue-router'

declare module 'vue' {
  interface ComponentCustomOptions {
    beforeRouteEnter?(to: Route, from: Route, next: () => void): void
  }
}
```

Teraz opcja `beforeRouteEnter` będzie miała właściwe typy. Zauważ, że to tylko przykład - dobrze typowane biblioteki jak `vue-router` powinny automatycznie wykonywać te rozszerzenia w swoich własnych definicjach typów.

Umiejscowienie tego rozszerzenia podlega [tym samym ograniczeniom](#type-augmentation-placement) co rozszerzenia właściwości globalnych.

Zobacz także:

- [Testy jednostkowe TypeScript dla rozszerzeń typów komponentów](https://github.com/vuejs/core/blob/main/packages-private/dts-test/componentTypeExtensions.test-d.tsx)

## Typowanie globalnych dyrektyw niestandardowych {#typing-global-custom-directives}

Zobacz: [Typowanie globalnych dyrektyw niestandardowych](/guide/typescript/composition-api#typing-global-custom-directives) <sup class="vt-badge ts" />
