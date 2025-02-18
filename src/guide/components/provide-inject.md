# Provide / Inject (Dostarczanie / Wstrzykiwanie) {#provide-inject}

> Ta strona zakłada, że przeczytałeś już [Podstawy Komponentów](/guide/essentials/component-basics). Przeczytaj je najpierw, jeśli dopiero zaczynasz pracę z komponentami.

## Przekazywanie właściwości (Prop Drilling) {#prop-drilling}

Zazwyczaj, gdy potrzebujemy przekazać dane z komponentu nadrzędnego do potomnego, używamy [właściwości (props)](/guide/components/props). Jednakże, wyobraź sobie przypadek, w którym mamy rozbudowane drzewo komponentów, a głęboko zagnieżdżony komponent potrzebuje czegoś od bardzo odległego komponentu przodka. Używając tylko właściwości (props), musielibyśmy przekazywać tę samą właściwość przez cały łańcuch komponentów nadrzędnych:

![schemat przekazywania właściwości](./images/prop-drilling.png)

<!-- https://www.figma.com/file/yNDTtReM2xVgjcGVRzChss/prop-drilling -->

Zauważ, że chociaż komponent `<Footer>` może w ogóle nie potrzebować tych właściwości, to nadal musi je zadeklarować i przekazać dalej, aby `<DeepChild>` mógł uzyskać do nich dostęp. Jeśli łańcuch komponentów nadrzędnych jest dłuższy, więcej komponentów zostałoby dotkniętych po drodze. Jest to nazywane "props drilling" (przekazywaniem właściwości) i zdecydowanie nie jest przyjemne w obsłudze.

Możemy rozwiązać problem przekazywania właściwości za pomocą `provide` i `inject`. Komponent nadrzędny może służyć jako **dostawca zależności** dla wszystkich swoich potomków. Każdy komponent w drzewie potomnym, niezależnie od tego, jak głęboko się znajduje, może **wstrzykiwać** (inject) zależności dostarczone przez komponenty w jego łańcuchu nadrzędnym.

![schemat Provide/inject](./images/provide-inject.png)

<!-- https://www.figma.com/file/PbTJ9oXis5KUawEOWdy2cE/provide-inject -->

## Provide (Dostarczanie) {#provide}

<div class="composition-api">

Aby dostarczyć dane do komponentów potomnych, użyj funkcji [`provide()`](/api/composition-api-dependency-injection#provide):

```vue
<script setup>
import { provide } from 'vue'

provide(/* klucz */ 'message', /* wartość */ 'hello!')
</script>
```

Jeśli nie używasz `<script setup>`, upewnij się, że `provide()` jest wywoływane synchronicznie wewnątrz `setup()`:

```js
import { provide } from 'vue'

export default {
  setup() {
    provide(/* klucz */ 'message', /* wartość */ 'hello!')
  }
}
```

Funkcja `provide()` przyjmuje dwa argumenty. Pierwszy argument nazywany jest **kluczem wstrzykiwania** i może być ciągiem znaków (string) lub `Symbol`. Klucz wstrzykiwania jest używany przez komponenty potomne do wyszukiwania żądanej wartości do wstrzyknięcia. Pojedynczy komponent może wielokrotnie wywoływać `provide()` z różnymi kluczami wstrzykiwania, aby dostarczyć różne wartości.

Drugim argumentem jest dostarczana wartość. Wartość może być dowolnego typu, włączając w to stan reaktywny, taki jak refs:

```js
import { ref, provide } from 'vue'

const count = ref(0)
provide('key', count)
```

Dostarczanie wartości reaktywnych pozwala komponentom potomnym, które używają dostarczonej wartości, na ustanowienie reaktywnego połączenia z komponentem dostarczającym.

</div>

<div class="options-api">

Aby dostarczyć dane do komponentów potomnych, użyj opcji [`provide`](/api/options-composition#provide):

```js
export default {
  provide: {
    message: 'hello!'
  }
}
```

Dla każdej właściwości w obiekcie `provide`, klucz jest używany przez komponenty potomne do zlokalizowania odpowiedniej wartości do wstrzyknięcia, podczas gdy wartość jest tym, co zostanie ostatecznie wstrzyknięte.

Jeśli potrzebujemy dostarczyć stan per-instancję, na przykład dane zadeklarowane przez `data()`, wtedy `provide` musi użyć wartości funkcji:

```js{7-12}
export default {
  data() {
    return {
      message: 'hello!'
    }
  },
  provide() {
    // użyj składni funkcji, aby uzyskać dostęp do `this`
    return {
      message: this.message
    }
  }
}
```

Należy jednak zauważyć, że **nie** sprawia to, że wstrzyknięcie staje się reaktywne. Omówimy [jak sprawić, by wstrzyknięcia były reaktywne](#working-with-reactivity) poniżej.

</div>

## Dostarczanie na poziomie aplikacji (App-level Provide) {#app-level-provide}

Oprócz dostarczania danych w komponencie możemy także dostarczać je na poziomie aplikacji:

```js
import { createApp } from 'vue'

const app = createApp({})

app.provide(/* klucz */ 'message', /* wartość */ 'hello!')
```

Wartości dostarczone na poziomie aplikacji są dostępne dla wszystkich komponentów renderowanych w aplikacji. Jest to szczególnie przydatne podczas pisania [wtyczek](/guide/reusability/plugins), ponieważ wtyczki zazwyczaj nie mogłyby dostarczać wartości za pomocą komponentów.

## Wstrzykiwanie (Inject) {#inject}

<div class="composition-api">

Aby wstrzyknąć dane dostarczone przez komponent nadrzędny, użyj funkcji [`inject()`](/api/composition-api-dependency-injection#inject):

```vue
<script setup>
import { inject } from 'vue'

const message = inject('message')
</script>
```

Jeśli dostarczona wartość jest referencją (ref), zostanie wstrzyknięta bez zmian i **nie** zostanie automatycznie rozpakowana. Pozwala to komponentowi wstrzykującemu zachować połączenie reaktywności z komponentem dostarczającym.

[Pełny przykład provide + inject z reaktywnością](https://play.vuejs.org/#eNqFUUFugzAQ/MrKF1IpxfeIVKp66Kk/8MWFDXYFtmUbpArx967BhURRU9/WOzO7MzuxV+fKcUB2YlWovXYRAsbBvQije2d9hAk8Xo7gvB11gzDDxdseCuIUG+ZN6a7JjZIvVRIlgDCcw+d3pmvTglz1okJ499I0C3qB1dJQT9YRooVaSdNiACWdQ5OICj2WwtTWhAg9hiBbhHNSOxQKu84WT8LkNQ9FBhTHXyg1K75aJHNUROxdJyNSBVBp44YI43NvG+zOgmWWYGt7dcipqPhGZEe2ef07wN3lltD+lWN6tNkV/37+rdKjK2rzhRTt7f3u41xhe37/xJZGAL2PLECXa9NKdD/a6QTTtGnP88LgiXJtYv4BaLHhvg==)

Ponownie, jeśli nie używasz `<script setup>`, `inject()` powinno być wywoływane tylko synchronicznie wewnątrz `setup()`:

```js
import { inject } from 'vue'

export default {
  setup() {
    const message = inject('message')
    return { message }
  }
}
```

</div>

<div class="options-api">

By wstrzyknąć dane dostarczone przez nadrzędny komponent, użyj opcji [`inject`](/api/options-composition#inject):

```js
export default {
  inject: ['message'],
  created() {
    console.log(this.message) // wstrzyknięta wartość
  }
}
```

Wstrzyknięcia są rozwiązywane **przed** utworzeniem stanu komponentu, więc możesz uzyskać dostęp do wstrzykniętych właściwości w `data()`:

```js
export default {
  inject: ['message'],
  data() {
    return {
      // initial data based on injected value
      fullMessage: this.message
    }
  }
}
```

Jeśli wielu rodziców dostarcza dane z tym samym kluczem, inject dostarczy dane od pierwszego w kolejności rodzica.

[Pełny przykład provide + inject](https://play.vuejs.org/#eNqNkcFqwzAQRH9l0EUthOhuRKH00FO/oO7B2JtERZaEvA4F43+vZCdOTAIJCImRdpi32kG8h7A99iQKobs6msBvpTNt8JHxcTC2wS76FnKrJpVLZelKR39TSUO7qreMoXRA7ZPPkeOuwHByj5v8EqI/moZeXudCIBL30Z0V0FLXVXsqIA9krU8R+XbMR9rS0mqhS4KpDbZiSgrQc5JKQqvlRWzEQnyvuc9YuWbd4eXq+TZn0IvzOeKr8FvsNcaK/R6Ocb9Uc4FvefpE+fMwP0wH8DU7wB77nIo6x6a2hvNEME5D0CpbrjnHf+8excI=)

### Aliasy wstrzyknięć \* {#injection-aliasing}

Podczas używania składni tablicowej dla `inject`, wstrzyknięte właściwości są udostępniane w instancji komponentu przy użyciu tego samego klucza. W powyższym przykładzie właściwość została dostarczona pod kluczem `"message"` i wstrzyknięta jako `this.message`. Lokalny klucz jest taki sam jak klucz wstrzyknięcia.

Jeśli chcemy wstrzyknąć właściwość używając innego klucza lokalnego, musimy użyć składni obiektowej dla opcji `inject`:

```js
export default {
  inject: {
    /* lokalny klucz */ localMessage: {
      from: /* klucz wstrzykiwany */ 'message'
    }
  }
}
```

W tym przypadku komponent zlokalizuje właściwość dostarczoną z kluczem `"message"`, a następnie udostępni ją jako `this.localMessage`.

</div>

### Domyślne wartości wstrzyknięć {#injection-default-values}

By default, `inject` assumes that the injected key is provided somewhere in the parent chain. In the case where the key is not provided, there will be a runtime warning.

If we want to make an injected property work with optional providers, we need to declare a default value, similar to props:

<div class="composition-api">

```js
// `value` przyjmie wartość "domyślna wartość"
// jeśli nie zostanie dodana wartość dla "message"
const value = inject('message', 'domyślna wartość')
```

W niektórych przypadkach wartość domyślna może wymagać utworzenia poprzez wywołanie funkcji lub utworzenie nowej instancji klasy. Aby uniknąć niepotrzebnych obliczeń lub efektów ubocznych w przypadku, gdy opcjonalna wartość nie jest używana, możemy użyć funkcji fabrykującej do utworzenia wartości domyślnej:

```js
const value = inject('key', () => new ExpensiveClass(), true)
```

Trzeci parametr wskazuje, że wartość domyślna powinna być traktowana jako funkcja fabrykująca.

</div>

<div class="options-api">

```js
export default {
  // składnia obiektowa jest wymagana
  // podczas deklarowania wartości domyślnych dla wstrzyknięć
  inject: {
    message: {
      from: 'message', // jest to opcjonalne jeśli używamy tego samego klucza do wstrzyknięcia
      default: 'wartość domyślna'
    },
    user: {
      // użyj funkcji fabrykującej dla wartości nieprymitywnych, których utworzenie
      // jest kosztowne lub takich, które powinny być unikalne dla każdej instancji komponentu
      default: () => ({ name: 'John' })
    }
  }
}
```

</div>

## Praca z reaktywnością {#working-with-reactivity}

<div class="composition-api">

Podczas używania reaktywnych wartości provide / inject, **zaleca się, aby wszelkie mutacje stanu reaktywnego były wykonywane wewnątrz _dostawcy_ zawsze, gdy jest to możliwe**. Zapewnia to, że dostarczany stan i jego możliwe mutacje są umiejscowione w tym samym komponencie, co ułatwia późniejsze utrzymanie kodu.

Mogą zdarzyć się sytuacje, gdy potrzebujemy zaktualizować dane z komponentu wstrzykującego. W takich przypadkach zalecamy dostarczenie funkcji, która jest odpowiedzialna za mutację stanu:

```vue{7-9,13}
<!-- wewnątrz komponentu dostarczającego -->
<script setup>
import { provide, ref } from 'vue'

const location = ref('North Pole')

function updateLocation() {
  location.value = 'South Pole'
}

provide('location', {
  location,
  updateLocation
})
</script>
```

```vue{5}
<!-- wewnątrz komponentu wstrzykującego -->
<script setup>
import { inject } from 'vue'

const { location, updateLocation } = inject('location')
</script>

<template>
  <button @click="updateLocation">{{ location }}</button>
</template>
```

Ostatecznie, możesz opakować dostarczoną wartość za pomocą [`readonly()`](/api/reactivity-core#readonly) jeśli chcesz mieć pewność, że dane przekazywane przez `provide` nie mogą być mutowane przez komponent wstrzykujący.

```vue
<script setup>
import { ref, provide, readonly } from 'vue'

const count = ref(0)
provide('read-only-count', readonly(count))
</script>
```

</div>

<div class="options-api">

Aby powiązać reaktywnie wstrzyknięcia z dostawcą, musimy dostarczyć właściwość obliczaną przy użyciu funkcji [computed()](/api/reactivity-core#computed):

```js{10}
import { computed } from 'vue'

export default {
  data() {
    return {
      message: 'witaj!'
    }
  },
  provide() {
    return {
      // jawnie zdefiniuj właściwość obliczaną
      message: computed(() => this.message)
    }
  }
}
```

[Pełny przykład provide + inject z reaktywnością](https://play.vuejs.org/#eNqNUctqwzAQ/JVFFyeQxnfjBEoPPfULqh6EtYlV9EKWTcH43ytZtmPTQA0CsdqZ2dlRT16tPXctkoKUTeWE9VeqhbLGeXirheRwc0ZBds7HKkKzBdBDZZRtPXIYJlzqU40/I4LjjbUyIKmGEWw0at8UgZrUh1PscObZ4ZhQAA596/RcAShsGnbHArIapTRBP74O8Up060wnOO5QmP0eAvZyBV+L5jw1j2tZqsMp8yWRUHhUVjKPoQIohQ460L0ow1FeKJlEKEnttFweijJfiORElhCf5f3umObb0B9PU/I7kk17PJj7FloN/2t7a2Pj/Zkdob+x8gV8ZlMs2de/8+14AXwkBngD9zgVqjg2rNXPvwjD+EdlHilrn8MvtvD1+Q==)

Funkcja `computed()` jest zazwyczaj używana w komponentach Composition API, ale może być również używana jako uzupełnienie niektórych przypadków użycia w Options API. Możesz dowiedzieć się więcej o jej zastosowaniu czytając [Podstawy Reaktywności](/guide/essentials/reactivity-fundamentals) oraz [Właściwości Obliczane](/guide/essentials/computed) z ustawieniem preferencji API na Composition API.

</div>

## Praca z Symbolami jako kluczami {#working-with-symbol-keys}

Do tej pory używaliśmy w przykładach kluczy wstrzykiwania jako ciągów znaków. Jeśli pracujesz nad dużą aplikacją z wieloma dostawcami zależności lub tworzysz komponenty, które będą używane przez innych programistów, najlepiej jest używać kluczy wstrzykiwania typu Symbol, aby uniknąć potencjalnych kolizji.

Zalecane jest eksportowanie Symboli w dedykowanym pliku:

```js
// keys.js
export const myInjectionKey = Symbol()
```

<div class="composition-api">

```js
// w komopnencie dostarczającym
import { provide } from 'vue'
import { myInjectionKey } from './keys.js'

provide(myInjectionKey, {
  /* dane do wstrzyknięcia */
})
```

```js
// w komponencie wstrzykującym
import { inject } from 'vue'
import { myInjectionKey } from './keys.js'

const injected = inject(myInjectionKey)
```

Zobacz także: [Typowanie Provide / Inject (Dostarczanie / Wstrzykiwanie)](/guide/typescript/composition-api#typing-provide-inject) <sup class="vt-badge ts" />

</div>

<div class="options-api">

```js
// w komponencie dostarczającym
import { myInjectionKey } from './keys.js'

export default {
  provide() {
    return {
      [myInjectionKey]: {
        /* dane do wstrzyknięcia */
      }
    }
  }
}
```

```js
// w komponencie wstrzykującym
import { myInjectionKey } from './keys.js'

export default {
  inject: {
    injected: { from: myInjectionKey }
  }
}
```

</div>
