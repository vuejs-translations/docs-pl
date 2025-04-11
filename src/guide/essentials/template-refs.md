# Referencje w szablonach {#template-refs}

Chociaż deklaratywny model renderowania Vue abstrahuje większość operacji na DOM, mogą zdarzyć się przypadki, w których potrzebujemy bezpośredniego dostępu do elementów DOM. Aby to osiągnąć, możemy użyć specjalnego atrybutu `ref`:

```vue-html
<input ref="input">
```

`ref` to specjalny atrybut, podobny do atrybutu `key` omawianego w rozdziale `v-for`. Pozwala nam uzyskać bezpośrednie referencję do konkretnego elementu DOM lub instancji komponentu dziecka po jej zamontowaniu. Może to być przydatne, gdy chcemy na przykład programowo ustawić fokus na inpucie podczas montowania komponentu lub zainicjować bibliotekę zewnętrzną na elemencie.

## Dostęp do referencji {#accessing-the-refs}

<div class="composition-api">

Aby uzyskać referencję do elementu przy użyciu Composition API, możemy użyć helpera [`useTemplateRef()`](/api/composition-api-helpers#usetemplateref) <sup class="vt-badge" data-text="3.5+" />:

```vue
<script setup>
import { useTemplateRef, onMounted } from 'vue'

// pierwszy argument musi odpowiadać atrybutowi ref w szablonie
const input = useTemplateRef('my-input')

onMounted(() => {
  input.value.focus()
})
</script>

<template>
  <input ref="my-input" />
</template>
```

Używając TypeScripta z Vue, IDE razem z `vue-tsc` powinny automatycznie wywnioskować typ `input.value` na podstawie elementu lub komponentu na podstawie odpowiadającego atrybutu `ref`.

<details>
<summary>Użycie przed 3.5</summary>

W wersjach przed 3.5 gdzie `useTemplateRef` nie był dostępny, musimy zadeklarować ref z nazwą, która odpowiada atrybutowi ref w szablonie:

```vue
<script setup>
import { ref, onMounted } from 'vue'

// zadeklaruj ref do przechowywania referencji do elementu
// nazwa musi pasować do wartości atrybutu ref w szablonie
const input = ref(null)

onMounted(() => {
  input.value.focus()
})
</script>

<template>
  <input ref="input" />
</template>
```

Jeśli nie używasz `<script setup>`, upewnij się, że zwrócisz ref z funkcji `setup()`:

```js{6}
export default {
  setup() {
    const input = ref(null)
    // ...
    return {
      input
    }
  }
}
```

</details>

</div>
<div class="options-api">

Wynikowa referencja jest dostępne przez `this.$refs`:

```vue
<script>
export default {
  mounted() {
    this.$refs.input.focus()
  }
}
</script>

<template>
  <input ref="input" />
</template>
```

</div>

Należy pamiętać, że dostęp do referencji jest możliwy dopiero **po zamontowaniu komponentu**. Jeśli spróbujesz uzyskać dostęp do <span class="options-api">$refs.input</span><span class="composition-api">`input`</span> w wyrażeniu szablonu, będzie to <span class="options-api">`undefined`</span><span class="composition-api">`null`</span> przy pierwszym renderowaniu. Dzieje się tak, ponieważ element nie istnieje aż do pierwszego renderowania!

<div class="composition-api">

Jeśli próbujesz obserwować zmiany referencji w szablonie, upewnij się, że uwzględniasz przypadek, gdy referencja ma wartość `null`:

```js
watchEffect(() => {
  if (input.value) {
    input.value.focus()
  } else {
    // nie jest jeszcze zamontowany, lub element został odmontowany (np. przez v-if)
  }
})
```

Zobacz także: [Typowanie referencji w szablonie](/guide/typescript/composition-api#typing-template-refs) <sup class="vt-badge ts" />

</div>

## Referencje na komponencie {#ref-on-component}

> Ta sekcja zakłada znajomość [komponentów](/guide/essentials/component-basics). Jeśli chcesz, możesz ją pominąć i wrócić później.

`ref` może być również używane na komponencie dziecka. W takim przypadku referencja będzie dotyczyła instancji komponentu:

<div class="composition-api">

```vue
<script setup>
import { useTemplateRef, onMounted } from 'vue'
import Child from './Child.vue'

const childRef = useTemplateRef('child')

onMounted(() => {
  // childRef.value will hold an instance of <Child />
})
</script>

<template>
  <Child ref="child" />
</template>
```

<details>
<summary>Użycie przed 3.5</summary>

```vue
<script setup>
import { ref, onMounted } from 'vue'
import Child from './Child.vue'

const child = ref(null)

onMounted(() => {
  // child.value będzie przechowywać instancję <Child />
})
</script>

<template>
  <Child ref="child" />
</template>
```

</details>

</div>
<div class="options-api">

```vue
<script>
import Child from './Child.vue'

export default {
  components: {
    Child
  },
  mounted() {
    // this.$refs.child będzie przechowywać instancję <Child />
  }
}
</script>

<template>
  <Child ref="child" />
</template>
```

</div>

<span class="composition-api">Jeśli komponent dziecka używa Options API lub nie korzysta ze `<script setup>`,</span><span class="options-api">Wtedy</span> referowana instancja będzie identyczna z `this` komponentu dziecka, co oznacza, że komponent nadrzędny będzie miał pełny dostęp do wszystkich właściwości i metod komponentu dziecka. Ułatwia to tworzenie ściśle powiązanych szczegółów implementacyjnych między rodzicem a dzieckiem, więc referencje do komponentów należy stosować tylko wtedy, gdy jest to absolutnie konieczne – w większości przypadków należy spróbować zaimplementować interakcje rodzic-dziecko przy użyciu standardowych interfejsów props i emit.

<div class="composition-api">

Wyjątkiem są komponenty używające `<script setup>`, które są **domyślnie prywatne**: komponent nadrzędny, który odwołuje się do komponentu dziecka używającego `<script setup>`, nie będzie miał dostępu do niczego, chyba że komponent dziecka zdecyduje się ujawnić publiczny interfejs za pomocą makro `defineExpose`:

```vue
<script setup>
import { ref } from 'vue'

const a = 1
const b = ref(2)

// Makra kompilatora, takie jak defineExpose, nie muszą być importowane
defineExpose({
  a,
  b
})
</script>
```

Kiedy komponent nadrzędny uzyska instancję tego komponentu przez referencje do szablonu, zwrócona instancja będzie miała postać `{ a: number, b: number }` (referencje są automatycznie rozpakowywane tak jak na zwykłych instancjach).

Należy pamiętać, że defineExpose musi być wywołane przed jakąkolwiek operacją await. W przeciwnym razie właściwości i metody ujawnione po operacji await nie będą dostępne.

Zobacz także: [Typowanie referencji w szablonach komponentów](/guide/typescript/composition-api#typing-component-template-refs) <sup class="vt-badge ts" />

</div>
<div class="options-api">

Opcja `expose` może być użyta, aby ograniczyć dostęp do instancji komponentu:

```js
export default {
  expose: ['publicData', 'publicMethod'],
  data() {
    return {
      publicData: 'foo',
      privateData: 'bar'
    }
  },
  methods: {
    publicMethod() {
      /* ... */
    },
    privateMethod() {
      /* ... */
    }
  }
}
```

W powyższym przykładzie, komponent nadrzędny, który odwołuje się do tego komponentu za pomocą referencji w szablonie, będzie miał dostęp tylko do `publicData` i `publicMethod`.

</div>

## Referencje wewnątrz `v-for` {#refs-inside-v-for}

> Wymaga wersji v3.5 lub wyższej

<div class="composition-api">

Gdy `ref` jest używane wewnątrz `v-for`, odpowiednia referencja powinna zawierać wartość tablicy, która zostanie wypełniona elementami po zamontowaniu:

```vue
<script setup>
import { ref, useTemplateRef, onMounted } from 'vue'

const list = ref([
  /* ... */
])

const itemRefs = useTemplateRef('items')

onMounted(() => console.log(itemRefs.value))
</script>

<template>
  <ul>
    <li v-for="item in list" ref="items">
      {{ item }}
    </li>
  </ul>
</template>
```

[Wypróbuj w playground](https://play.vuejs.org/#eNp9UsluwjAQ/ZWRLwQpDepyQoDUIg6t1EWUW91DFAZq6tiWF4oU5d87dtgqVRyyzLw3b+aN3bB7Y4ptQDZkI1dZYTw49MFMuBK10dZDAxZXOQSHC6yNLD3OY6zVsw7K4xJaWFldQ49UelxxVWnlPEhBr3GszT6uc7jJ4fazf4KFx5p0HFH+Kme9CLle4h6bZFkfxhNouAIoJVqfHQSKbSkDFnVpMhEpovC481NNVcr3SaWlZzTovJErCqgydaMIYBRk+tKfFLC9Wmk75iyqg1DJBWfRxT7pONvTAZom2YC23QsMpOg0B0l0NDh2YjnzjpyvxLrYOK1o3ckLZ5WujSBHr8YL2gxnw85lxEop9c9TynkbMD/kqy+svv/Jb9wu5jh7s+jQbpGzI+ZLu0byEuHZ+wvt6Ays9TJIYl8A5+i0DHHGjvYQ1JLGPuOlaR/TpRFqvXCzHR2BO5iKg0Zmm/ic0W2ZXrB+Gve2uEt1dJKs/QXbwePE)

<details>
<summary>Użycie przed 3.5</summary>

W wersjach przed 3.5, gdzie `useTemplateRef()` nie było dostępne, musimy zadeklarować ref z nazwą która odpowiada atrybutowi ref w szablonie. Ten ref będzie zawierał wartość tablicową:

```vue
<script setup>
import { ref, onMounted } from 'vue'

const list = ref([
  /* ... */
])

const itemRefs = ref([])

onMounted(() => console.log(itemRefs.value))
</script>

<template>
  <ul>
    <li v-for="item in list" ref="itemRefs">
      {{ item }}
    </li>
  </ul>
</template>
```

</details>

</div>
<div class="options-api">

Gdy `ref` jest używane wewnątrz `v-for`, wynikowa wartość referencji będzie tablicą zawierającą odpowiednie elementy:

```vue
<script>
export default {
  data() {
    return {
      list: [
        /* ... */
      ]
    }
  },
  mounted() {
    console.log(this.$refs.items)
  }
}
</script>

<template>
  <ul>
    <li v-for="item in list" ref="items">
      {{ item }}
    </li>
  </ul>
</template>
```

[Wypróbuj w playground](https://play.vuejs.org/#eNpFjk0KwjAQha/yCC4Uaou6kyp4DuOi2KkGYhKSiQildzdNa4WQmTc/37xeXJwr35HEUdTh7pXjszT0cdYzWuqaqBm9NEDbcLPeTDngiaM3PwVoFfiI667AvsDhNpWHMQzF+L9sNEztH3C3JlhNpbaPNT9VKFeeulAqplfY5D1p0qurxVQSqel0w5QUUEedY8q0wnvbWX+SYgRAmWxIiuSzm4tBinkc6HvkuSE7TIBKq4lZZWhdLZfE8AWp4l3T)

</div>

Należy zauważyć, że tablica referencji **nie** gwarantuje tej samej kolejności, co tablica źródłowa.

## Referencje funkcyjne {#function-refs}

Zamiast nazwy klucza, atrybut `ref` może być również powiązany z funkcją, która będzie wywoływana przy każdej aktualizacji komponentu i daje pełną elastyczność w przechowywaniu referencji do elementu. Funkcja ta otrzymuje referencję do elementu jako pierwszy argument:

```vue-html
<input :ref="(el) => { /* przypisz el do właściwości lub referencji */ }">
```

Zauważ, że używamy dynamicznego powiązania `:ref`, aby przekazać funkcję zamiast ciągu znaków jako nazwę referencji. Gdy element zostanie odmontowany, argument będzie `null`. Oczywiście można użyć metody zamiast funkcji inline.
