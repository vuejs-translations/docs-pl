<script setup>
import { onMounted } from 'vue'

if (typeof window !== 'undefined') {
  const hash = window.location.hash

  // Dokumentacja dla v-model była kiedyś częścią tej strony. Próba przekierowania nieaktualnych linków.
  if ([
    '#usage-with-v-model',
    '#v-model-arguments',
    '#multiple-v-model-bindings',
    '#handling-v-model-modifiers'
  ].includes(hash)) {
    onMounted(() => {
      window.location = './v-model.html' + hash
    })
  }
}
</script>

# Wydarzenia komponentu {#component-events}

> Ta strona zakłada, że przeczytałeś już [Podstawy Komponentów](/guide/essentials/component-basics). Przeczytaj to najpierw, jeśli dopiero zaczynasz pracę z komponentami.

<div class="options-api">
 <VueSchoolLink href="https://vueschool.io/lessons/defining-custom-events-emits" title="Darmowa lekcja Vue.js o definiowaniu własnych wydarzeń"/>
</div>

## Emitowanie i nasłuchiwanie wydarzeń {#emitting-and-listening-to-events}

Komponent może emitować własne wydarzenia bezpośrednio w wyrażeniach szablonu (np. w obsłudze `v-on`) używając wbudowanej metody `$emit`:

```vue-html
<!-- MyComponent -->
<button @click="$emit('someEvent')">Wciśnij mnie</button>
```

<div class="options-api">

Metoda `$emit()` jest również dostępna w instancji komponentu jako `this.$emit()`:

```js
export default {
  methods: {
    submit() {
      this.$emit('someEvent')
    }
  }
}
```

</div>

Rodzic może następnie nasłuchiwać jej używając `v-on`:

```vue-html
<MyComponent @some-event="callback" />
```

Modyfikator `.once` jest również wspierany przy nasłuchiwaniu wydarzeń komponentu:

```vue-html
<MyComponent @some-event.once="callback" />
```

Podobnie jak komponenty i propsy, nazwy wydarzeń zapewniają automatyczną transformację wielkości liter. Zauważ, że wyemitowaliśmy wydarzenie w formacie camelCase, ale możemy go nasłuchiwać używając formatu kebab-case w komponencie rodzica. Tak jak w przypadku [formatowania propsów](/guide/components/props#prop-name-casing), zalecamy używanie formatu kebab-case dla nasłuchiwania wydarzeń w szablonach.

:::tip
W przeciwieństwie do natywnych wydarzeń DOM, emitowane wydarzenia komponentów **nie** bąbelkują. Możesz nasłuchiwać tylko wydarzeń emitowanych przez bezpośredni komponent potomny. Jeśli istnieje potrzeba komunikacji między komponentami rodzeństwa lub głęboko zagnieżdżonymi komponentami, użyj zewnętrznej magistrali wydarzeń lub [rozwiązania do zarządzania stanem globalnym](/guide/scaling-up/state-management).
:::

## Argumenty Wydarzenia {#event-arguments}

Czasami przydatne jest emitowanie określonej wartości wraz z wydarzeniem. Na przykład, możemy chcieć, aby komponent `<BlogPost>` był odpowiedzialny za to, o ile powiększyć tekst. W takich przypadkach możemy przekazać dodatkowe argumenty do `$emit`, aby dostarczyć tę wartość:

```vue-html
<button @click="$emit('increaseBy', 1)">
  Zwiększ o 1
</button>
```

Następnie, gdy nasłuchujemy wydarzenia w komponencie rodzica, możemy użyć funkcji strzałkowej w linii jako nasłuchiwacza, co pozwala nam uzyskać dostęp do argumentu wydarzenia:

```vue-html
<MyButton @increase-by="(n) => count += n" />
```

Lub, jeśli obsługa wydarzenia jest metodą:

```vue-html
<MyButton @increase-by="increaseCount" />
```

Wtedy wartość zostanie przekazana jako pierwszy parametr tej metody:

<div class="options-api">

```js
methods: {
  increaseCount(n) {
    this.count += n
  }
}
```

</div>
<div class="composition-api">

```js
function increaseCount(n) {
  count.value += n
}
```

</div>

:::tip
Wszystkie dodatkowe argumenty przekazane do `$emit()` po nazwie wydarzenia zostaną przekazane do nasłuchiwacza. Na przykład, przy `$emit('foo', 1, 2, 3)` funkcja nasłuchująca otrzyma trzy argumenty.
:::

## Deklarowanie emitowanych zdarzeń {#declaring-emitted-events}

Komponent może jawnie zadeklarować zdarzenia, które będzie emitował, używając <span class="composition-api">makra [`defineEmits()`](/api/sfc-script-setup#defineprops-defineemits)</span><span class="options-api">opcji [`emits`](/api/options-state#emits)</span>:

<div class="composition-api">

```vue
<script setup>
defineEmits(['inFocus', 'submit'])
</script>
```

Metoda `$emit`, której używaliśmy w `<template>` nie jest dostępna w sekcji `<script setup>` komponentu, ale `defineEmits()` zwraca równoważną funkcję, której możemy użyć zamiast niej:

```vue
<script setup>
const emit = defineEmits(['inFocus', 'submit'])

function buttonClick() {
  emit('submit')
}
</script>
```

Makro `defineEmits()` **nie może** być używane wewnątrz funkcji, musi być umieszczone bezpośrednio w `<script setup>`, jak w powyższym przykładzie.

Jeśli używasz bezpośrednio funkcji `setup` zamiast `<script setup>`, zdarzenia powinny być deklarowane przy użyciu opcji [`emits`](/api/options-state#emits), a funkcja `emit` jest udostępniana w kontekście `setup()`:

```js
export default {
  emits: ['inFocus', 'submit'],
  setup(props, ctx) {
    ctx.emit('submit')
  }
}
```

Podobnie jak w przypadku innych właściwości kontekstu `setup()`, `emit` może być bezpiecznie destrukturyzowany:

```js
export default {
  emits: ['inFocus', 'submit'],
  setup(props, { emit }) {
    emit('submit')
  }
}
```

</div>
<div class="options-api">

```js
export default {
  emits: ['inFocus', 'submit']
}
```

</div>

Opcja `emits` oraz makro `defineEmits()` obsługują również składnię obiektową. Jeśli używasz TypeScript, możesz określić typy argumentów, co pozwala nam na walidację w czasie wykonywania zawartości emitowanych zdarzeń:

<div class="composition-api">

```vue
<script setup lang="ts">
const emit = defineEmits({
  submit(payload: { email: string, password: string }) {
    // zwróć `true` lub `false` aby wskazać
    // powodzenie / niepowodzenie walidacji
  }
})
</script>
```

Jeśli używasz TypeScript z `<script setup>`, możliwe jest również deklarowanie emitowanych zdarzeń przy użyciu czystych adnotacji typów:

```vue
<script setup lang="ts">
const emit = defineEmits<{
  (e: 'change', id: number): void
  (e: 'update', value: string): void
}>()
</script>
```

Więcej szczegółów: [Typowanie emiterów w komponencie](/guide/typescript/composition-api#typing-component-emits) <sup class="vt-badge ts" />

</div>
<div class="options-api">

```js
export default {
  emits: {
    submit(payload: { email: string, password: string }) {
      // zwróć `true` lub `false` aby wskazać
      // powodzenie / niepowodzenie walidacji
    }
  }
}
```

Zobacz także: [Typowanie emiterów w komponencie](/guide/typescript/options-api#typing-component-emits) <sup class="vt-badge ts" />

</div>

Mimo że jest to opcjonalne, zaleca się zdefiniowanie wszystkich emitowanych zdarzeń w celu lepszego udokumentowania sposobu działania komponentu. Pozwala to również Vue na wykluczenie znanych nasłuchujących z [dziedziczonych atrybutów](/guide/components/attrs#v-on-listener-inheritance), unikając przypadków brzegowych spowodowanych zdarzeniami DOM ręcznie wywołanymi przez kod zewnętrzny.

:::tip
Jeśli natywne zdarzenie (np. `click`) jest zdefiniowane w opcji `emits`, nasłuchujący będzie teraz reagował tylko na zdarzenia `click` emitowane przez komponent i nie będzie już reagował na natywne zdarzenia `click`.
:::

## Walidacja zdarzeń {#events-validation}

Podobnie jak w przypadku walidacji właściwości (props), emitowane zdarzenie może być walidowane, jeśli jest zdefiniowane przy użyciu składni obiektowej zamiast składni tablicowej.

Aby dodać walidację, zdarzeniu przypisywana jest funkcja, która otrzymuje argumenty przekazane do wywołania <span class="options-api">`this.$emit`</span><span class="composition-api">`emit`</span> i zwraca wartość logiczną wskazującą, czy zdarzenie jest prawidłowe, czy nie.

<div class="composition-api">

```vue
<script setup>
const emit = defineEmits({
  // Brak walidacji
  click: null,

  // Walidacja zdarzenia submit
  submit: ({ email, password }) => {
    if (email && password) {
      return true
    } else {
      console.warn('Nieprawidłowa zawartość zdarzenia submit!')
      return false
    }
  }
})

function submitForm(email, password) {
  emit('submit', { email, password })
}
</script>
```

</div>
<div class="options-api">

```js
export default {
  emits: {
    // Brak walidacji
    click: null,

    // Walidacja zdarzenia submit
    submit: ({ email, password }) => {
      if (email && password) {
        return true
      } else {
        console.warn('Nieprawidłowa zawartość zdarzenia submit!')
        return false
      }
    }
  },
  methods: {
    submitForm(email, password) {
      this.$emit('submit', { email, password })
    }
  }
}
```

</div>
