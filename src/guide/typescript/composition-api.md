# TypeScript z Composition API {#typescript-with-composition-api}

> Ta strona zakłada, że przeczytałeś już ogólne informacje o [Używaniu Vue z TypeScript](./overview).

## Typowanie Propsów Komponentu {#typing-component-props}

### Używanie `<script setup>` {#using-script-setup}

Podczas używania `<script setup>`, makro `defineProps()` obsługuje wnioskowanie typów propsów na podstawie jego argumentu:

```vue
<script setup lang="ts">
const props = defineProps({
  foo: { type: String, required: true },
  bar: Number
})

props.foo // string
props.bar // number | undefined
</script>
```

Jest to nazywane "deklaracją w czasie wykonania", ponieważ argument przekazany do `defineProps()` będzie używany jako opcja `props` w czasie wykonania.

Jednak zazwyczaj bardziej bezpośrednie jest definiowanie propsów za pomocą czystych typów poprzez argument typu generycznego:

```vue
<script setup lang="ts">
const props = defineProps<{
  foo: string
  bar?: number
}>()
</script>
```

Jest to nazywane "deklaracją opartą na typach". Kompilator będzie starał się jak najlepiej wywnioskować odpowiednie opcje czasu wykonania na podstawie argumentu typu. W tym przypadku, nasz drugi przykład kompiluje się do dokładnie tych samych opcji czasu wykonania co pierwszy przykład.

Możesz używać deklaracji opartej na typach ALBO deklaracji czasu wykonania, ale nie możesz używać obu jednocześnie.

Możemy również przenieść typy propsów do osobnego interfejsu:

```vue
<script setup lang="ts">
interface Props {
  foo: string
  bar?: number
}

const props = defineProps<Props>()
</script>
```

To działa również, gdy `Props` jest importowany z zewnętrznego źródła. Ta funkcja wymaga, aby TypeScript był zależnością równorzędną (peer dependency) Vue.

```vue
<script setup lang="ts">
import type { Props } from './foo'

const props = defineProps<Props>()
</script>
```

#### Ograniczenia Składni {#syntax-limitations}

W wersji 3.2 i starszych, parametr typu generycznego dla `defineProps()` był ograniczony do literału typu lub odwołania do lokalnego interfejsu.

To ograniczenie zostało rozwiązane w wersji 3.3. Najnowsza wersja Vue obsługuje odwoływanie się do importowanych i ograniczonego zestawu złożonych typów w pozycji parametru typu. Jednak ponieważ konwersja typu na czas wykonania jest wciąż oparta na AST, niektóre złożone typy, które wymagają rzeczywistej analizy typu, np. typy warunkowe, nie są obsługiwane. Możesz używać typów warunkowych dla typu pojedynczego propa, ale nie dla całego obiektu props.

### Domyślne Wartości Propsów {#props-default-values}

Podczas używania deklaracji opartej na typach, tracimy możliwość deklarowania domyślnych wartości dla propsów. Można to rozwiązać za pomocą makra kompilatora `withDefaults`:

```ts
export interface Props {
  msg?: string
  labels?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  msg: 'witaj',
  labels: () => ['jeden', 'dwa']
})
```

Zostanie to skompilowane do odpowiadających opcji `default` propsów w czasie wykonania. Dodatkowo, helper `withDefaults` zapewnia sprawdzanie typów dla wartości domyślnych i gwarantuje, że zwrócony typ `props` ma usunięte flagi opcjonalności dla właściwości, które mają zadeklarowane wartości domyślne.

:::info
Zwróć uwagę że domyślne wartości dla mutowalnych typów (jak tablice czy obiekty) powinny być opakowane funkcjami, aby zapobiec przypadkowym mutacjom czy efektom ubocznym. To działanie zapewnia, że każda instancja komponentu ma swoją własną kopię domyślnej wartości.
:::

### Bez `<script setup>` {#without-script-setup}

Jeśli nie używasz `<script setup>`, konieczne jest użycie `defineComponent()`, aby włączyć wnioskowanie typów propsów. Typ obiektu props przekazanego do `setup()` jest wywnioskowany z opcji `props`.

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    message: String
  },
  setup(props) {
    props.message // <-- typ: string
  }
})
```

### Złożone typy props {#complex-prop-types}

Używając deklaracji opartej na typach, prop może wykorzystywać złożony typ, podobnie jak każdy inny typ:

```vue
<script setup lang="ts">
interface Book {
  title: string
  author: string
  year: number
}

const props = defineProps<{
  book: Book
}>()
</script>
```

Dla deklaracji w czasie wykonywania możemy użyć typu narzędziowego `PropType`:

```ts
import type { PropType } from 'vue'

const props = defineProps({
  book: Object as PropType<Book>
})
```

Działa to w bardzo podobny sposób, jeśli określamy opcję `props` bezpośrednio:

```ts
import { defineComponent } from 'vue'
import type { PropType } from 'vue'

export default defineComponent({
  props: {
    book: Object as PropType<Book>
  }
})
```

Opcja `props` jest częściej używana z Options API, więc więcej szczegółowych przykładów znajdziesz w przewodniku [TypeScript z Options API](/guide/typescript/options-api#typing-component-props). Techniki pokazane w tych przykładach mają również zastosowanie do deklaracji w czasie wykonywania przy użyciu `defineProps()`.

## Typowanie emitów komponentu {#typing-component-emits}

W `<script setup>` funkcja `emit` może być również typowana przy użyciu deklaracji w czasie wykonywania LUB deklaracji typu:

```vue
<script setup lang="ts">
// w czasie wykonywania
const emit = defineEmits(['change', 'update'])

// oparte na opcjach
const emit = defineEmits({
  change: (id: number) => {
    // zwróć `true` lub `false` aby wskazać
    // powodzenie / niepowodzenie walidacji
  },
  update: (value: string) => {
    // zwróć `true` lub `false` aby wskazać
    // powodzenie / niepowodzenie walidacji
  }
})

// oparte na typach
const emit = defineEmits<{
  (e: 'change', id: number): void
  (e: 'update', value: string): void
}>()

// 3.3+: alternatywna, bardziej zwięzła składnia
const emit = defineEmits<{
  change: [id: number]
  update: [value: string]
}>()
</script>
```

Argument typu może być jednym z następujących:

1. Typ funkcji wywoływalnej, zapisany jako literał typu z [Sygnaturami wywołań](https://www.typescriptlang.org/docs/handbook/2/functions.html#call-signatures). Będzie używany jako typ zwracanej funkcji `emit`.
2. Literał typu, gdzie kluczami są nazwy zdarzeń, a wartościami są typy tablicowe / krotkowe reprezentujące dodatkowe akceptowane parametry dla zdarzenia. Powyższy przykład używa nazwanych krotek, dzięki czemu każdy argument może mieć jawną nazwę.

Jak widzimy, deklaracja typu daje nam znacznie dokładniejszą kontrolę nad ograniczeniami typu emitowanych zdarzeń.

Gdy nie używamy `<script setup>`, `defineComponent()` jest w stanie wywnioskować dozwolone zdarzenia dla funkcji `emit` udostępnionej w kontekście setup:

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  emits: ['change'],
  setup(props, { emit }) {
    emit('change') // <-- sprawdzanie typu / automatyczne uzupełnianie
  }
})
```

## Typowanie `ref()` {#typing-ref}

Refy wnioskują typ na podstawie wartości początkowej:

```ts
import { ref } from 'vue'

// wywnioskowany typ: Ref<number>
const year = ref(2020)

// => TS Error: Type 'string' is not assignable to type 'number'.
year.value = '2020'
```

Czasami może być konieczne określenie złożonych typów dla wewnętrznej wartości refa. Możemy to zrobić używając typu `Ref`:

```ts
import { ref } from 'vue'
import type { Ref } from 'vue'

const year: Ref<string | number> = ref('2020')

year.value = 2020 // ok!
```

Lub poprzez przekazanie argumentu generycznego podczas wywoływania `ref()`, aby nadpisać domyślne wnioskowanie:

```ts
// typ wynikowy: Ref<string | number>
const year = ref<string | number>('2020')

year.value = 2020 // ok!
```

Jeśli określisz argument typu generycznego, ale pominiesz wartość początkową, wynikowy typ będzie typem unii, który zawiera `undefined`:

```ts
// wywnioskowany typ: Ref<number | undefined>
const n = ref<number>()
```

## Typowanie `reactive()` {#typing-reactive}

`reactive()` również niejawnie wnioskuje typ na podstawie swojego argumentu:

```ts
import { reactive } from 'vue'

// wywnioskowany typ: { title: string }
const book = reactive({ title: 'Przewodnik Vue 3' })
```

Aby jawnie określić typ właściwości `reactive`, możemy użyć interfejsów:

```ts
import { reactive } from 'vue'

interface Book {
  title: string
  year?: number
}

const book: Book = reactive({ title: 'Przewodnik Vue 3' })
```

:::tip
Nie zaleca się używania argumentu generycznego `reactive()`, ponieważ zwracany typ, który obsługuje rozpakowywanie zagnieżdżonych referencji, różni się od typu argumentu generycznego.
:::

## Typowanie `computed()` {#typing-computed}

`computed()` wnioskuje swój typ na podstawie wartości zwracanej przez getter:

```ts
import { ref, computed } from 'vue'

const count = ref(0)

// wywnioskowany typ: ComputedRef<number>
const double = computed(() => count.value * 2)

// => TS Error: Property 'split' does not exist on type 'number'
const result = double.value.split('')
```

Możesz również określić jawny typ za pomocą argumentu generycznego:

```ts
const double = computed<number>(() => {
  // błąd typu, jeśli to nie zwraca liczby
})
```

## Typowanie Procedur Obsługi Zdarzeń {#typing-event-handlers}

Podczas pracy z natywnymi zdarzeniami DOM, może być przydatne poprawne typowanie argumentu, który przekazujemy do procedury obsługi. Przyjrzyjmy się temu przykładowi:

```vue
<script setup lang="ts">
function handleChange(event) {
  // `event` niejawnie ma typ `any`
  console.log(event.target.value)
}
</script>

<template>
  <input type="text" @change="handleChange" />
</template>
```

Bez adnotacji typu, argument `event` będzie miał niejawnie typ `any`. Spowoduje to również błąd TS, jeśli w `tsconfig.json` używane są opcje `"strict": true` lub `"noImplicitAny": true`. Dlatego zaleca się jawne adnotowanie argumentu procedur obsługi zdarzeń. Dodatkowo, może być konieczne użycie asercji typu podczas dostępu do właściwości `event`:

```ts
function handleChange(event: Event) {
  console.log((event.target as HTMLInputElement).value)
}
```

## Typowanie Provide / Inject {#typing-provide-inject}

Provide i inject są zazwyczaj wykonywane w osobnych komponentach. Aby poprawnie typować wstrzykiwane wartości, Vue dostarcza interfejs `InjectionKey`, który jest typem generycznym rozszerzającym `Symbol`. Może być używany do synchronizacji typu wstrzykiwanej wartości między dostawcą a konsumentem:

```ts
import { provide, inject } from 'vue'
import type { InjectionKey } from 'vue'

const key = Symbol() as InjectionKey<string>

provide(key, 'foo') // dostarczenie wartości nie będącej typu string będzie prowadzić do błędu

const foo = inject(key) // typ foo: string | undefined
```

Zaleca się umieszczenie klucza wstrzykiwania w osobnym pliku, aby można go było importować w wielu komponentach.

Podczas używania kluczy wstrzykiwania typu string, typ wstrzykiwanej wartości będzie `unknown` i musi być jawnie zadeklarowany za pomocą argumentu typu generycznego:

```ts
const foo = inject<string>('foo') // typ: string | undefined
```

Zwróć uwagę, że wstrzyknięta wartość nadal może być `undefined`, ponieważ nie ma gwarancji, że provider dostarczy tę wartość podczas wykonywania.

Typ `undefined` można usunąć poprzez dostarczenie wartości domyślnej:

```ts
const foo = inject<string>('foo', 'bar') // typ: string
```

Jeśli masz pewność, że wartość jest zawsze dostarczana, możesz również wymusić rzutowanie wartości:

```ts
const foo = inject('foo') as string
```

## Typowanie referencji szablonów {#typing-template-refs}

Referencje szablonów powinny być tworzone z jawnym argumentem typu generycznego i początkową wartością `null`:

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'

const el = ref<HTMLInputElement | null>(null)

onMounted(() => {
  el.value?.focus()
})
</script>

<template>
  <input ref="el" />
</template>
```

Aby uzyskać właściwy interfejs DOM, możesz sprawdzić strony takie jak [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#technical_summary).

Należy pamiętać, że dla ścisłego bezpieczeństwa typów, konieczne jest użycie opcjonalnego łańcuchowania lub strażników typów podczas dostępu do `el.value`. Wynika to z faktu, że początkowa wartość referencji to `null` do momentu zamontowania komponentu, a także może zostać ustawiona na `null`, jeśli element, do którego się odwołuje, zostanie odmontowany przez `v-if`.

## Typowanie referencji szablonów komponentów {#typing-component-template-refs}

Czasami może być konieczne nadanie adnotacji referencji szablonu dla komponentu potomnego w celu wywołania jego publicznej metody. Na przykład, mamy komponent potomny `MyModal` z metodą, która otwiera modal:

```vue
<!-- MyModal.vue -->
<script setup lang="ts">
import { ref } from 'vue'

const isContentShown = ref(false)
const open = () => (isContentShown.value = true)

defineExpose({
  open
})
</script>
```

Aby uzyskać typ instancji `MyModal`, musimy najpierw uzyskać jego typ za pomocą `typeof`, a następnie użyć wbudowanego narzędzia TypeScript `InstanceType` do wyodrębnienia typu instancji:

```vue{5}
<!-- App.vue -->
<script setup lang="ts">
import MyModal from './MyModal.vue'

const modal = ref<InstanceType<typeof MyModal> | null>(null)

const openModal = () => {
  modal.value?.open()
}
</script>
```

W przypadkach, gdy dokładny typ komponentu nie jest dostępny lub nie jest istotny, można zamiast tego użyć `ComponentPublicInstance`. Będzie to zawierać tylko właściwości wspólne dla wszystkich komponentów, takie jak `$el`:

```ts
import { ref } from 'vue'
import type { ComponentPublicInstance } from 'vue'

const child = ref<ComponentPublicInstance | null>(null)
```

W przypadkach gdy taki komponent jest [komponentem generycznym](/guide/typescript/overview.html#generic-components), na przykład `MyGenericModal`:

```vue
<!-- MyGenericModal.vue -->
<script setup lang="ts" generic="ContentType extends string | number">
import { ref } from 'vue'

const content = ref<ContentType | null>(null)

const open = (newContent: ContentType) => (content.value = newContent)

defineExpose({
  open
})
</script>
```

Odwołanie do niego musi korzystać z `ComponentExposed` z biblioteki [`vue-component-type-helpers`](https://www.npmjs.com/package/vue-component-type-helpers), gdyż `InstanceType` nie zadziała.

```vue
<!-- App.vue -->
<script setup lang="ts">
import MyGenericModal from './MyGenericModal.vue'

import type { ComponentExposed } from 'vue-component-type-helpers';

const modal = ref<ComponentExposed<typeof MyModal> | null>(null)

const openModal = () => {
  modal.value?.open('newValue')
}
</script>
```
