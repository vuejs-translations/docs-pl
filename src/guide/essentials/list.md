# Renderowanie list {#list-rendering}

<div class="options-api">
  <VueSchoolLink href="https://vueschool.io/lessons/list-rendering-in-vue-3" title="Darmowa lekcja Vue.js o renderowaniu list"/>
</div>

<div class="composition-api">
  <VueSchoolLink href="https://vueschool.io/lessons/vue-fundamentals-capi-list-rendering-in-vue" title="Darmowa lekcja Vue.js o renderowaniu list"/>
</div>

## `v-for` {#v-for}

Używamy dyrektywy `v-for`, aby renderować listę elementów na podstawie tablicy. Dyrektywa `v-for` wymaga specjalnej składni w formie `item in items`, gdzie `items` to tablica danych źródłowych, a `item` to **alias** elementu tablicy, przez który iterujemy:

<div class="composition-api">

```js
const items = ref([{ message: 'Foo' }, { message: 'Bar' }])
```

</div>

<div class="options-api">

```js
data() {
  return {
    items: [{ message: 'Foo' }, { message: 'Bar' }]
  }
}
```

</div>

```vue-html
<li v-for="item in items">
  {{ item.message }}
</li>
```

W obrębie zakresu `v-for` wyrażenia szablonu mają dostęp do wszystkich właściwości z zakresu nadrzędnego. Dodatkowo, `v-for` obsługuje opcjonalny drugi alias dla indeksu bieżącego elementu:

<div class="composition-api">

```js
const parentMessage = ref('Parent')
const items = ref([{ message: 'Foo' }, { message: 'Bar' }])
```

</div>
<div class="options-api">

```js
data() {
  return {
    parentMessage: 'Parent',
    items: [{ message: 'Foo' }, { message: 'Bar' }]
  }
}
```

</div>

```vue-html
<li v-for="(item, index) in items">
  {{ parentMessage }} - {{ index }} - {{ item.message }}
</li>
```

<script setup>
const parentMessage = 'Parent'
const items = [{ message: 'Foo' }, { message: 'Bar' }]
</script>
<div class="demo">
  <li v-for="(item, index) in items">
    {{ parentMessage }} - {{ index }} - {{ item.message }}
  </li>
</div>

<div class="composition-api">

[Wypróbuj w playground](https://play.vuejs.org/#eNpdTsuqwjAQ/ZVDNlFQu5d64bpwJ7g3LopOJdAmIRlFCPl3p60PcDWcM+eV1X8Iq/uN1FrV6RxtYCTiW/gzzvbBR0ZGpBYFbfQ9tEi1ccadvUuM0ERyvKeUmithMyhn+jCSev4WWaY+vZ7HjH5Sr6F33muUhTR8uW0ThTuJua6mPbJEgGSErmEaENedxX3Z+rgxajbEL2DdhR5zOVOdUSIEDOf8M7IULCHsaPgiMa1eK4QcS6rOSkhdfapVeQLQEWnH)

</div>
<div class="options-api">

[Wypróbuj w playground](https://play.vuejs.org/#eNpVTssKwjAQ/JUllyr0cS9V0IM3wbvxEOxWAm0a0m0phPy7m1aqhpDsDLMz48XJ2nwaUZSiGp5OWzpKg7PtHUGNjRpbAi8NQK1I7fbrLMkhjc5EJAn4WOXQ0BWHQb2whOS24CSN6qjXhN1Qwt1Dt2kufZ9ASOGXOyvH3GMNCdGdH75VsZVjwGa2VYQRUdVqmLKmdwcpdjEnBW1qnPf8wZIrBQujoff/RSEEyIDZZeGLeCn/dGJyCSlazSZVsUWL8AYme21i)

</div>

Zmienne w obrębie `v-for` są podobne do poniższego kodu JavaScript:

```js
const parentMessage = 'Parent'
const items = [
  /* ... */
]

items.forEach((item, index) => {
  // ma dostęp do zewnętrznego zakresu `parentMessage`
  // ale `item` i `index` są dostępne tylko tutaj
  console.log(parentMessage, item.message, index)
})
```

Zauważ, jak wartość `v-for` odpowiada sygnaturze funkcji callback w `forEach`. Możesz także używać destrukturyzacji w aliasie `v-for` podobnie jak w argumentach funkcji:

```vue-html
<li v-for="{ message } in items">
  {{ message }}
</li>

<!-- with index alias -->
<li v-for="({ message }, index) in items">
  {{ message }} {{ index }}
</li>
```

W przypadku zagnieżdżonych `v-for`, zakres również działa podobnie do zagnieżdżonych funkcji. Każdy zakres `v-for` ma dostęp do zakresu nadrzędnego:

```vue-html
<li v-for="item in items">
  <span v-for="childItem in item.children">
    {{ item.message }} {{ childItem }}
  </span>
</li>
```

Możesz również używać `of` jako separatora zamiast `in`, aby składnia była bliższa JavaScriptowi:

```vue-html
<div v-for="item of items"></div>
```

## `v-for` z obiektem {#v-for-with-an-object}

Możesz również używać `v-for`, aby iterować przez właściwości obiektu. Kolejność iteracji będzie oparta na wyniku wywołania `Object.values()` na obiekcie:

<div class="composition-api">

```js
const myObject = reactive({
  title: 'How to do lists in Vue',
  author: 'Jane Doe',
  publishedAt: '2016-04-10'
})
```

</div>
<div class="options-api">

```js
data() {
  return {
    myObject: {
      title: 'How to do lists in Vue',
      author: 'Jane Doe',
      publishedAt: '2016-04-10'
    }
  }
}
```

</div>

```vue-html
<ul>
  <li v-for="value in myObject">
    {{ value }}
  </li>
</ul>
```

Możesz także podać drugi alias dla nazwy właściwości (tzw. klucza):

```vue-html
<li v-for="(value, key) in myObject">
  {{ key }}: {{ value }}
</li>
```

And another for the index:

```vue-html
<li v-for="(value, key, index) in myObject">
  {{ index }}. {{ key }}: {{ value }}
</li>
```

<div class="composition-api">

[Wypróbuj w playground](https://play.vuejs.org/#eNo9jjFvgzAQhf/KE0sSCQKpqg7IqRSpQ9WlWycvBC6KW2NbcKaNEP+9B7Tx4nt33917Y3IKYT9ESspE9XVnAqMnjuFZO9MG3zFGdFTVbAbChEvnW2yE32inXe1dz2hv7+dPqhnHO7kdtQPYsKUSm1f/DfZoPKzpuYdx+JAL6cxUka++E+itcoQX/9cO8SzslZoTy+yhODxlxWN2KMR22mmn8jWrpBTB1AZbMc2KVbTyQ56yBkN28d1RJ9uhspFSfNEtFf+GfnZzjP/oOll2NQPjuM4xTftZyIaU5VwuN0SsqMqtWZxUvliq/J4jmX4BTCp08A==)

</div>
<div class="options-api">

[Wypróbuj w playground](https://play.vuejs.org/#eNo9T8FqwzAM/RWRS1pImnSMHYI3KOwwdtltJ1/cRqXe3Ng4ctYS8u+TbVJjLD3rPelpLg7O7aaARVeI8eS1ozc54M1ZT9DjWQVDMMsBoFekNtucS/JIwQ8RSQI+1/vX8QdP1K2E+EmaDHZQftg/IAu9BaNHGkEP8B2wrFYxgAp0sZ6pn2pAeLepmEuSXDiy7oL9gduXT+3+pW6f631bZoqkJY/kkB6+onnswoDw6owijIhEMByjUBgNU322/lUWm0mZgBX84r1ifz3ettHmupYskjbanedch2XZRcAKTnnvGVIPBpkqGqPTJNGkkaJ5+CiWf4KkfBs=)

</div>

## `v-for` z zakresem {#v-for-with-a-range}

`v-for` może również przyjmować liczbę całkowitą. W takim przypadku powtórzy szablon tyle razy, ile wynosi zakres `1...n.`

```vue-html
<span v-for="n in 10">{{ n }}</span>
```

Zauważ, że `n` zaczyna się od wartości `1`, a nie od `0`.

## `v-for` z `<template>` {#v-for-on-template}

Podobnie jak w przypadku `v-if`, możesz także użyć tagu `<template>` z `v-for`, aby wyrenderować blok wielu elementów. Na przykład:

```vue-html
<ul>
  <template v-for="item in items">
    <li>{{ item.msg }}</li>
    <li class="divider" role="presentation"></li>
  </template>
</ul>
```

## `v-for` z `v-if` {#v-for-with-v-if}

Kiedy `v-if` i `v-for` znajdują się na tym samym elemencie, `v-if` ma wyższy priorytet niż `v-for`. Oznacza to, że warunek `v-if` nie będzie miał dostępu do zmiennych z zakresu `v-for`:

```vue-html
<!--
To spowoduje błąd, ponieważ właściwość "todo"
nie jest zdefiniowana w instancji.
-->
<li v-for="todo in todos" v-if="!todo.isComplete">
  {{ todo.name }}
</li>
```

Można to naprawić, przenosząc `v-for` do opakowującego tagu `<template>` (co jest również bardziej jednoznaczne):

```vue-html
<template v-for="todo in todos">
  <li v-if="!todo.isComplete">
    {{ todo.name }}
  </li>
</template>
```

:::warning Note
It's **not** recommended to use `v-if` and `v-for` on the same element due to implicit precedence.
**Nie** zaleca się używania `v-if` i `v-for` na tym samym elemencie ze względu na niejawne pierwszeństwo.

Istnieją dwa popularne przypadki, w których może się to wydawać kuszące:

- Filtrowanie elementów w liście (np. `v-for="user in users" v-if="user.isActive"`). W tych przypadkach, zamiast filtrować w szablonie, lepiej zastąpić `users` nową właściwością computed, która zwraca przefiltrowaną listę (np. `activeUsers`).

- Unikanie renderowania listy, jeśli ma być ukryta (np. `v-for="user in users" v-if="shouldShowUsers"`). W takich przypadkach przenieś `v-if` do elementu kontenerowego (np. `ul`, `ol`). :::
  :::

## Utrzymywanie stanu za pomocą `key` {#maintaining-state-with-key}

Kiedy Vue aktualizuje listę elementów renderowanych za pomocą `v-for`, domyślnie stosuje strategię "patchowania w miejscu". Jeśli kolejność elementów danych ulegnie zmianie, Vue nie przenosi elementów DOM, aby dopasować je do nowego porządku, ale zamiast tego dokonuje "patchowania" każdego elementu w miejscu, aby upewnić się, że jest zgodny z tym, co powinno być renderowane pod danym indeksem.

Ten domyślny tryb jest wydajny, ale **odpowiedni tylko wtedy, gdy wynik renderowania listy nie zależy od stanu komponentów dziecka lub tymczasowego stanu DOM (np. wartości formularzy)**.

Aby dać Vue wskazówkę, by mogło śledzić tożsamość każdego węzła i w ten sposób ponownie wykorzystać i zmienić kolejność istniejących elementów, musisz podać unikalny atrybut `key` dla każdego elementu:

```vue-html
<div v-for="item in items" :key="item.id">
  <!-- zawartość -->
</div>
```

Podczas korzystania z `<template v-for>`, `key` należy umieścić na kontenerze `<template>`:

```vue-html
<template v-for="todo in todos" :key="todo.name">
  <li>{{ todo.name }}</li>
</template>
```

:::tip Note
`Key` jest specjalnym atrybutem, który jest związany z `v-bind`. Nie należy go mylić z właściwością zmiennej `key` podczas [korzystania z `v-for` z obiektem](#v-for-with-an-object). :::
:::

Zaleca się podanie atrybutu `key` z `v-for` zawsze, gdy to możliwe, chyba że iterowany DOM jest prosty (tzn. nie zawiera komponentów ani stanu DOM), lub jeśli celowo polegasz na domyślnej wydajności.

The `key` binding expects primitive values - i.e. strings and numbers. Do not use objects as `v-for` keys. For detailed usage of the `key` attribute, please see the [`key` API documentation](/api/built-in-special-attributes#key).

Atrybut `key` oczekuje wartości prymitywnych — tzn. ciągów znaków i liczb. Nie używaj obiektów jako kluczy w `v-for`. Szczegółowe informacje o używaniu atrybutu `ke`y można znaleźć w [dokumentacji API `key`](/api/built-in-special-attributes#key).

## `v-for` z komponentem {#v-for-with-a-component}

> Sekcja ta zakłada znajomość [komponentów](/guide/essentials/component-basics). Jeśli chcesz, możesz ją pominąć i wrócić do niej później.

Możesz bezpośrednio użyć `v-for` z komponentem, jak z każdym innym elementem (nie zapomnij o `key`):

```vue-html
<MyComponent v-for="item in items" :key="item.id" />
```

Jednak to nie spowoduje automatycznego przekazania danych do komponentu, ponieważ komponenty mają własne izolowane zakresy. Aby przekazać iterowane dane do komponentu, musisz użyć również props:

```vue-html
<MyComponent
  v-for="(item, index) in items"
  :item="item"
  :index="index"
  :key="item.id"
/>
```

Powód, dla którego nie wstrzykuje się automatycznie `item` do komponentu, jest taki, że wiązałoby to komponent ściśle z tym, jak działa `v-for`. Wyraźne określenie, skąd pochodzą jego dane, sprawia, że ​​komponent nadaje się do ponownego użycia w innych sytuacjach.

<div class="composition-api">

Zobacz [ten przykład prostej todo list](https://play.vuejs.org/#eNp1U8Fu2zAM/RXCGGAHTWx02ylwgxZYB+ywYRhyq3dwLGYRYkuCJTsZjPz7KMmK3ay9JBQfH/meKA/Rk1Jp32G0jnJdtVwZ0Gg6tSkEb5RsDQzQ4h4usG9lAzGVxldoK5n8ZrAZsTQLCduRygAKUUmhDQg8WWyLZwMPtmESx4sAGkL0mH6xrMH+AHC2hvuljw03Na4h/iLBHBAY1wfUbsTFVcwoH28o2/KIIDuaQ0TTlvrwNu/TDe+7PDlKXZ6EZxTiN4kuRI3W0dk4u4yUf7bZfScqw6WAkrEf3m+y8AOcw7Qv6w5T1elDMhs7Nbq7e61gdmme60SQAvgfIhExiSSJeeb3SBukAy1D1aVBezL5XrYN9Csp1rrbNdykqsUehXkookl0EVGxlZHX5Q5rIBLhNHFlbRD6xBiUzlOeuZJQz4XqjI+BxjSSYe2pQWwRBZizV01DmsRWeJA1Qzv0Of2TwldE5hZRlVd+FkbuOmOksJLybIwtkmfWqg+7qz47asXpSiaN3lxikSVwwfC8oD+/sEnV+oh/qcxmU85mebepgLjDBD622Mg+oDrVquYVJm7IEu4XoXKTZ1dho3gnmdJhedEymn9ab3ysDPdc4M9WKp28xE5JbB+rzz/Trm3eK3LAu8/E7p2PNzYM/i3ChR7W7L7hsSIvR7L2Aal1EhqTp80vF95sw3WcG7r8A0XaeME=), żeby dowiedzieć się jak renderować listę komponentów za pomocą `v-for`, przekazując różne dane do każdej instancji.

</div>
<div class="options-api">

Zobacz [ten przykład prostej todo list](https://play.vuejs.org/#eNqNVE2PmzAQ/SsjVIlEm4C27Qmx0a7UVuqhPVS5lT04eFKsgG2BSVJF+e8d2xhIu10tihR75s2bNx9wiZ60To49RlmUd2UrtNkUUjRatQa2iquvBhvYt6qBOEmDwQbEhQQoJJ4dlOOe9bWBi7WWiuIlStNlcJlYrivr5MywxdIDAVo0fSvDDUDiyeK3eDYZxLGLsI8hI7H9DHeYQuwjeAb3I9gFCFMjUXxSYCoELroKO6fZP17Mf6jev0i1ZQcE1RtHaFrWVW/l+/Ai3zd1clQ1O8k5Uzg+j1HUZePaSFwfvdGhfNIGTaW47bV3Mc6/+zZOfaaslegS18ZE9121mIm0Ep17ynN3N5M8CB4g44AC4Lq8yTFDwAPNcK63kPTL03HR6EKboWtm0N5MvldtA8e1klnX7xphEt3ikTbpoYimsoqIwJY0r9kOa6Ag8lPeta2PvE+cA3M7k6cOEvBC6n7UfVw3imPtQ8eiouAW/IY0mElsiZWqOdqkn5NfCXxB5G6SJRvj05By1xujpJWUp8PZevLUluqP/ajPploLasmk0Re3sJ4VCMnxvKQ//0JMqrID/iaYtSaCz+xudsHjLpPzscVGHYO3SzpdixIXLskK7pcBucnTUdgg3kkmcxhetIrmH4ebr8m/n4jC6FZp+z7HTlLsVx1p4M7odcXPr6+Lnb8YOne5+C2F6/D6DH2Hx5JqOlCJ7yz7IlBTbZsf7vjXVBzjvLDrH5T0lgo=), żeby dowiedzieć się jak renderować listę komponentów za pomocą `v-for`, przekazując różne dane do każdej instancji.

</div>

## Wykrywanie zmian w tablicach {#array-change-detection}

### Metody mutujące {#mutation-methods}

Vue jest w stanie wykryć, gdy w tablicy reaktywnej wywoływane są metody mutujące i wywołać niezbędne aktualizacje. Są to metody mutujące:

- `push()`
- `pop()`
- `shift()`
- `unshift()`
- `splice()`
- `sort()`
- `reverse()`

### Zastępowanie tablicy {#replacing-an-array}

Metody mutujące, jak sama nazwa wskazuje, mutują oryginalną tablicę, na której są wywoływane. W porównaniu do nich istnieją również metody niemutujące, takie jak `filter()`, `concat()` i `slice()`, które nie mutują oryginalnej tablicy, ale **zawsze zwracają nową tablicę**. Pracując z niemutującymi metodami, należy zastąpić starą tablicę nową:

<div class="composition-api">

```js
// `items` to ref z wartością tablicy
items.value = items.value.filter((item) => item.message.match(/Foo/))
```

</div>
<div class="options-api">

```js
this.items = this.items.filter((item) => item.message.match(/Foo/))
```

</div>

Można pomyśleć, że spowoduje to, że Vue usunie istniejący DOM i ponownie wyrenderuje całą listę – na szczęście tak się nie dzieje. Vue implementuje sprytne heurystyki, aby zmaksymalizować ponowne użycie elementów DOM, więc zastąpienie tablicy inną tablicą zawierającą wspólne obiekty jest bardzo wydajną operacją.

## Wyświetlanie przefiltrowanych/posortowanych wyników {#displaying-filtered-sorted-results}

Czasami chcemy wyświetlić przefiltrowaną lub posortowaną wersję tablicy, nie mutując ani nie resetując oryginalnych danych. W takim przypadku możesz stworzyć właściwość obliczeniową, która zwróci przefiltrowaną lub posortowaną tablicę.

Na przykład:

<div class="composition-api">

```js
const numbers = ref([1, 2, 3, 4, 5])

const evenNumbers = computed(() => {
  return numbers.value.filter((n) => n % 2 === 0)
})
```

</div>
<div class="options-api">

```js
data() {
  return {
    numbers: [1, 2, 3, 4, 5]
  }
},
computed: {
  evenNumbers() {
    return this.numbers.filter(n => n % 2 === 0)
  }
}
```

</div>

```vue-html
<li v-for="n in evenNumbers">{{ n }}</li>
```

W sytuacjach, w których obliczone właściwości nie są wykonalne (np. wewnątrz zagnieżdżonych pętli `v-for`), możesz użyć metody:

<div class="composition-api">

```js
const sets = ref([
  [1, 2, 3, 4, 5],
  [6, 7, 8, 9, 10]
])

function even(numbers) {
  return numbers.filter((number) => number % 2 === 0)
}
```

</div>
<div class="options-api">

```js
data() {
  return {
    sets: [[ 1, 2, 3, 4, 5 ], [6, 7, 8, 9, 10]]
  }
},
methods: {
  even(numbers) {
    return numbers.filter(number => number % 2 === 0)
  }
}
```

</div>

```vue-html
<ul v-for="numbers in sets">
  <li v-for="n in even(numbers)">{{ n }}</li>
</ul>
```

Uważaj na `reverse()` i `sort()` we właściwości computed! Te dwie metody zmutują oryginalną tablicę, czego należy unikać w getterach computed. Utwórz kopię oryginalnej tablicy przed wywołaniem tych metod:

```diff
- return numbers.reverse()
+ return [...numbers].reverse()
```
