# Właściwości (Props) {#props}

> Ta strona zakłada, że przeczytałeś już [Podstawy Komponentów](/guide/essentials/component-basics). Przeczytaj to najpierw, jeśli jesteś nowy w komponentach.

<div class="options-api">
  <VueSchoolLink href="https://vueschool.io/lessons/vue-3-reusable-components-with-props" title="Darmowa lekcja o właściwościach (Props) Vue.js"/>
</div>

## Deklaracja właściwości {#props-declaration}

Komponenty Vue wymagają jawnej deklaracji właściwości (props), dzięki czemu Vue wie, które zewnętrzne właściwości przekazane do komponentu powinny być traktowane jako atrybuty przelotowe (które zostaną omówione w [dedykowanej sekcji](/guide/components/attrs)).

<div class="composition-api">

W SFC używających `<script setup>`, właściwości (props) można deklarować za pomocą makra `defineProps()`:

```vue
<script setup>
const props = defineProps(['foo'])

console.log(props.foo)
</script>
```

W komponentach nie używających `<script setup>`, właściwości (props) są deklarowane za pomocą opcji [`props`](/api/options-state#props):

```js
export default {
  props: ['foo'],
  setup(props) {
    // setup() przyjmuje właściwości (props) jako pierwszy argument.
    console.log(props.foo)
  }
}
```

Zauważ, że argument przekazany do `defineProps()` jest taki sam jak wartość przekazana do opcji `props`: to samo API opcji właściwości (props) jest współdzielone między dwoma stylami deklaracji.

</div>

<div class="options-api">

Właściwości (props) są deklarowane za pomocą opcji [`props`](/api/options-state#props):

```js
export default {
  props: ['foo'],
  created() {
    // właściwości (props) są dostępne w `this`
    console.log(this.foo)
  }
}
```

</div>

Oprócz deklarowania właściwości (props) za pomocą tablicy ciągów znaków, możemy również użyć składni obiektowej:

<div class="options-api">

```js
export default {
  props: {
    title: String,
    likes: Number
  }
}
```

</div>
<div class="composition-api">

```js
// wewnątrz <script setup>
defineProps({
  title: String,
  likes: Number
})
```

```js
// wewnątrz nie-<script setup>
export default {
  props: {
    title: String,
    likes: Number
  }
}
```

</div>

Dla każdej właściwości w składni deklaracji obiektu klucz jest nazwą właściwości (prop), podczas gdy wartość powinna być funkcją konstruktora oczekiwanego typu.

Pozwala to nie tylko udokumentować twój komponent, ale również ostrzeże innych programistów używających twojego komponentu w konsoli przeglądarki, jeśli przekażą nieprawidłowy typ. Więcej szczegółów na temat [walidacji właściwości](#prop-validation) omówimy w dalszej części tej strony.

<div class="options-api">

Zobacz także: [Typowanie właściwości komponentu](/guide/typescript/options-api#typing-component-props) <sup class="vt-badge ts" />

</div>

<div class="composition-api">

Jeśli używasz TypeScriptu ze `<script setup>`, możliwe jest również deklarowanie właściwości przy użyciu czystych adnotacji typów:

```vue
<script setup lang="ts">
defineProps<{
  title?: string
  likes?: number
}>()
</script>
```

Więcej szczegółów: [Typowanie właściwości komponentu](/guide/typescript/composition-api#typing-component-props) <sup class="vt-badge ts" />

</div>

<div class="composition-api">

## Reaktywna destrukturyzacja propsów <sup class="vt-badge" data-text="3.5+" /> \*\* {#reactive-props-destructure}

System reaktywności Vue śledzi wykorzystanie stanu na podstawie dostępów do własności. Na przykład gdy pobierasz wartość `props.foo` wewnątrz computed czy watchera, prop `foo` jest śledzony jako zależność.

Mając poniższy kod:

```js
const { foo } = defineProps(['foo'])

watchEffect(() => {
  // wywoła się tylko raz przed wersją 3.5
  // wywoła się zawsze gdy prop "foo" zmieni swoją wartość w wersji 3.5+
  console.log(foo)
})
```

W wersji 3.4 i niższej, `foo` jest wartością stałą i nigdy nie ulegnie zmianie. W wersji 3.5 i wyżej, kompilator Vue automatycznie doda `props.` gdy kod w tym samym bloku `<script setup>` próbuje pobrać wartość zdestrukturyzowane z `defineProps`. Kod powyższy będzie więc równoznaczny z poniższym:

```js {5}
const props = defineProps(['foo'])

watchEffect(() => {
  // `foo` zmienione w `props.foo` przez kompilator
  console.log(props.foo)
})
```

Dodatkowo, możemy wykorzystać natywną składnię JavaScripta by zdefiniować domyślne wartości dla propsów. Jest to bardzo użyteczne gdy używamy deklaracji opartej na typach:

```ts
const { foo = 'witaj' } = defineProps<{ foo?: string }>()
```

Jeśli preferujesz bardziej wizualne rozróżnienie między destrukturyzowanymi propsami a normalnymi zmiennymi w Twoim IDE, wtyczka Vue do VSCode oferuje opcję podpowiedzi dla destrukturyzowanych propsów.

### Przekazywanie destrukturyzowanych propsów do funkcji

Gdy przekazujemy destrukturyzowany prop do funkcji, np.:

```js
const { foo } = defineProps(['foo'])

watch(foo, /* ... */)
```

Nie zadziała to poprawnie, ponieważ jest to odpowiednikiem `watch(props.foo, ...)` - przekazujemy wartość zamiast reaktywnego źródła danych do `watch`. W praktyce, kompilator Vue wyłapie tego typu przypadki i zwróci ostrzeżenie.

Podobnie jak możemy obserwować normalne propsy poprzez `watch(() => props.foo, ...)`, możemy w taki sam sposób obserwować destrukturyzowanego propsa, opakowując go w getter:

```js
watch(() => foo, /* ... */)
```

Dodatkowo, jest to również zalecane podejście gdy musi przekazać destrukturyzowanego propa do zewnętrznej funkcji, zachowując przy tym reaktywność:

```js
useComposable(() => foo)
```

Zewnętrzna funkcja może wywołać getter (lub znormalizować go z użyciem [toValue](/api/reactivity-utilities.html#tovalue)), gdy potrzebuje śledzić zmiany przekazanego propa, np. wewnątrz computed lub watchera.

</div>

## Szczegóły przekazywania właściwości {#prop-passing-details}

### Konwencja nazywania właściwości {#prop-name-casing}

Deklarujemy długie nazwy właściwości używając camelCase, ponieważ pozwala to uniknąć konieczności używania cudzysłowów podczas używania ich jako kluczy właściwości oraz umożliwia bezpośrednie odwoływanie się do nich w wyrażeniach szablonu, ponieważ są poprawnymi identyfikatorami JavaScript:

<div class="composition-api">

```js
defineProps({
  greetingMessage: String
})
```

</div>
<div class="options-api">

```js
export default {
  props: {
    greetingMessage: String
  }
}
```

</div>

```vue-html
<span>{{ greetingMessage }}</span>
```

Technicznie rzecz biorąc, możesz również używać camelCase podczas przekazywania właściwości do komponentu potomnego (z wyjątkiem [szablonów w-DOM](/guide/essentials/component-basics#in-dom-template-parsing-caveats)). Jednak konwencją jest używanie kebab-case we wszystkich przypadkach, aby zachować spójność z atrybutami HTML:

```vue-html
<MyComponent greeting-message="hello" />
```

Używamy [PascalCase dla tagów komponentów](/guide/components/registration#component-name-casing), gdy jest to możliwe, ponieważ poprawia to czytelność szablonu poprzez rozróżnienie komponentów Vue od elementów natywnych. Jednak używanie camelCase podczas przekazywania właściwości nie przynosi aż tak wielu praktycznych korzyści, dlatego wybieramy przestrzeganie konwencji każdego języka.

### Statyczne vs. dynamiczne właściwości {#static-vs-dynamic-props}

Do tej pory widziałeś właściwości przekazywane jako wartości statyczne, jak w:

```vue-html
<BlogPost title="Moja przygoda z Vue" />
```

Widziałeś również właściwości przypisywane dynamicznie za pomocą `v-bind` lub jego skrótu `:`, tak jak w:

```vue-html
<!-- Dynamicznie przypisana wartość zmiennej -->
<BlogPost :title="post.title" />

<!-- Dynamiczne przypisanie wartości złożonego wyrażenia -->
<BlogPost :title="post.title + ' by ' + post.author.name" />
```

### Przekazywanie różnych typów wartości {#passing-different-value-types}

W dwóch powyższych przykładach przekazujemy wartości tekstowe, ale _każdy_ typ wartości może zostać przekazany do właściwości.

#### Liczba {#number}

```vue-html
<!-- Mimo że `42` jest statyczne, potrzebujemy v-bind aby powiedzieć Vue że -->
<!-- to jest wyrażenie JavaScript, a nie ciąg znaków.                       -->
<BlogPost :likes="42" />

<!-- Dynamicznie przypisz do wartości zmiennej. -->
<BlogPost :likes="post.likes" />
```

#### Boolean {#boolean}

```vue-html
<!-- Uwzględnienie właściwości bez wartości będzie oznaczać `true`. -->
<BlogPost is-published />

<!-- Mimo że `false` jest statyczne, potrzebujemy v-bind aby powiedzieć Vue że -->
<!-- to jest wyrażenie JavaScript, a nie ciąg znaków.                          -->
<BlogPost :is-published="false" />

<!-- Dynamicznie przypisz do wartości zmiennej. -->
<BlogPost :is-published="post.isPublished" />
```

#### Tablica {#array}

```vue-html
<!-- Mimo że tablica jest statyczna, potrzebujemy v-bind aby powiedzieć Vue że -->
<!-- to jest wyrażenie JavaScript, a nie ciąg znaków.                          -->
<BlogPost :comment-ids="[234, 266, 273]" />

<!-- Dynamicznie przypisz do wartości zmiennej. -->
<BlogPost :comment-ids="post.commentIds" />
```

#### Obiekt {#object}

```vue-html
<!-- Mimo że obiekt jest statyczny, potrzebujemy v-bind aby powiedzieć Vue że -->
<!-- to jest wyrażenie JavaScript, a nie ciąg znaków.                         -->
<BlogPost
  :author="{
    name: 'Veronica',
    company: 'Veridian Dynamics'
  }"
 />

<!-- Dynamicznie przypisz do wartości zmiennej. -->
<BlogPost :author="post.author" />
```

### Wiązanie wielu właściwości przy użyciu obiektu {#binding-multiple-properties-using-an-object}

Jeśli chcesz przekazać wszystkie właściwości obiektu jako props, możesz użyć [`v-bind` bez argumentu](/guide/essentials/template-syntax#dynamically-binding-multiple-attributes) (`v-bind` zamiast `:prop-name`). Na przykład, mając obiekt `post`:

<div class="options-api">

```js
export default {
  data() {
    return {
      post: {
        id: 1,
        title: 'Moja podróż z Vue'
      }
    }
  }
}
```

</div>
<div class="composition-api">

```js
const post = {
  id: 1,
  title: 'Moja podróż z Vue'
}
```

</div>

Poniższy szablon:

```vue-html
<BlogPost v-bind="post" />
```

Będzie równoważny z:

```vue-html
<BlogPost :id="post.id" :title="post.title" />
```

## Jednokierunkowy przepływ danych {#one-way-data-flow}

Wszystkie props tworzą **jednokierunkowe wiązanie w dół** między właściwością dziecka a właściwością rodzica: gdy właściwość rodzica się aktualizuje, przepływa w dół do dziecka, ale nie w drugą stronę. Zapobiega to przypadkowemu modyfikowaniu stanu rodzica przez komponenty potomne, co mogłoby utrudnić zrozumienie przepływu danych w aplikacji.

Dodatkowo, za każdym razem, gdy komponent nadrzędny jest aktualizowany, wszystkie props w komponencie potomnym zostaną odświeżone najnowszą wartością. Oznacza to, że **nie** powinieneś próbować modyfikować prop wewnątrz komponentu potomnego. Jeśli to zrobisz, Vue ostrzeże Cię w konsoli:

<div class="composition-api">

```js
const props = defineProps(['foo'])

// ❌ uwaga, props są tylko do odczytu!
props.foo = 'bar'
```

</div>
<div class="options-api">

```js
export default {
  props: ['foo'],
  created() {
    // ❌ uwaga, props są tylko do odczytu!
    this.foo = 'bar'
  }
}
```

</div>

Zazwyczaj są dwa przypadki, w których kuszące jest modyfikowanie prop:

1. **Prop jest używany do przekazania wartości początkowej; komponent potomny chce później używać go jako lokalnej właściwości danych.** W tym przypadku najlepiej jest zdefiniować lokalną właściwość danych, która używa prop jako wartości początkowej:

   <div class="composition-api">

   ```js
   const props = defineProps(['initialCounter'])

   // counter używa tylko props.initialCounter jako wartości początkowej;
   // jest odłączony od przyszłych aktualizacji prop.
   const counter = ref(props.initialCounter)
   ```

   </div>
   <div class="options-api">

   ```js
   export default {
     props: ['initialCounter'],
     data() {
       return {
         // counter używa tylko props.initialCounter jako wartości początkowej;
         // jest odłączony od przyszłych aktualizacji prop.
         counter: this.initialCounter
       }
     }
   }
   ```

   </div>

2. **Prop jest przekazywany jako surowa wartość, która wymaga transformacji.** W tym przypadku najlepiej jest zdefiniować właściwość obliczaną (computed) używającą wartości prop:

   <div class="composition-api">

   ```js
   const props = defineProps(['size'])

   // właściwość obliczana, która automatycznie aktualizuje się, gdy prop się zmienia
   const normalizedSize = computed(() => props.size.trim().toLowerCase())
   ```

   </div>
   <div class="options-api">

   ```js
   export default {
     props: ['size'],
     computed: {
       // właściwość obliczana, która automatycznie aktualizuje się, gdy prop się zmienia
       normalizedSize() {
         return this.size.trim().toLowerCase()
       }
     }
   }
   ```

   </div>

### Modyfikowanie obiektów / tablic w props {#mutating-object-array-props}

Gdy obiekty i tablice są przekazywane jako props, pomimo że komponent potomny nie może modyfikować wiązania prop, **będzie** mógł modyfikować zagnieżdżone właściwości obiektu lub tablicy. Dzieje się tak, ponieważ w JavaScript obiekty i tablice są przekazywane przez referencję, a zapobieganie takim modyfikacjom przez Vue byłoby nieracjonalnie kosztowne.

Główną wadą takich modyfikacji jest to, że pozwalają komponentowi potomnemu wpływać na stan rodzica w sposób, który nie jest oczywisty dla komponentu nadrzędnego, potencjalnie utrudniając zrozumienie przepływu danych w przyszłości. Zgodnie z najlepszymi praktykami, powinieneś unikać takich modyfikacji, chyba że rodzic i dziecko są ściśle powiązane przez projekt. W większości przypadków, dziecko powinno [emitować zdarzenie](/guide/components/events), aby pozwolić rodzicowi wykonać modyfikację.

## Walidacja props {#prop-validation}

Komponenty mogą określać wymagania dla swoich props, takie jak typy, które już widziałeś. Jeśli wymaganie nie jest spełnione, Vue ostrzeże Cię w konsoli JavaScript przeglądarki. Jest to szczególnie przydatne podczas tworzenia komponentu, który ma być używany przez innych.

Aby określić walidacje props, możesz dostarczyć obiekt z wymaganiami walidacji do makra <span class="composition-api">`defineProps()`</span><span class="options-api">opcji `props`</span>, zamiast tablicy ciągów znaków. Na przykład:

<div class="composition-api">

```js
defineProps({
  // Podstawowe sprawdzanie typu
  //  (wartości `null` i `undefined` pozwolą na dowolny typ)
  propA: Number,
  // Wiele możliwych typów
  propB: [String, Number],
  // Wymagany string
  propC: {
    type: String,
    required: true
  },
  // Wymagany, ale dopuszczający null string
  propD: {
    type: [String, null],
    required: true
  },
  // Liczba z wartością domyślną
  propE: {
    type: Number,
    default: 100
  },
  // Obiekt z wartością domyślną
  propF: {
    type: Object,
    // Domyślne wartości obiektów lub tablic muszą być zwracane
    // z funkcji fabrycznej. Funkcja otrzymuje surowe
    // props otrzymane przez komponent jako argument.
    default(rawProps) {
      return { message: 'hello' }
    }
  },
  // Niestandardowa funkcja walidacyjna
  // pełne props przekazywane jako 2. argument w 3.4+
  propG: {
    validator(value, props) {
      // Wartość musi pasować do jednego z tych stringów
      return ['success', 'warning', 'danger'].includes(value)
    }
  },
  // Funkcja z wartością domyślną
  propH: {
    type: Function,
    // W przeciwieństwie do domyślnego obiektu lub tablicy, to nie jest funkcja
    // fabryczna - jest to funkcja służąca jako wartość domyślna
    default() {
      return 'Default function'
    }
  }
})
```

:::tip
Kod wewnątrz argumentu `defineProps()` **nie może uzyskać dostępu do innych zmiennych zadeklarowanych w `<script setup>`**, ponieważ całe wyrażenie jest przenoszone do zewnętrznego zakresu funkcji podczas kompilacji.
:::

</div>
<div class="options-api">

```js
export default {
  props: {
    // Podstawowe sprawdzanie typu
    // (wartości `null` i `undefined` pozwolą na użycie dowolnego typu)
    propA: Number,
    // Wiele możliwych typów
    propB: [String, Number],
    // Wymagany string
    propC: {
      type: String,
      required: true
    },
    // Wymagany ale dopuszczający null string
    propD: {
      type: [String, null],
      required: true
    },
    // Liczba z wartością domyślną
    propE: {
      type: Number,
      default: 100
    },
    // Obiekt z wartością domyślną
    propF: {
      type: Object,
      // Wartości domyślne obiektów lub tablic muszą być zwrócone
      // z funkcji fabrykującej. Funkcja otrzymuje surowe
      // propsy przekazane do komponentu jako argument.
      default(rawProps) {
        return { message: 'hello' }
      }
    },
    // Niestandardowa funkcja walidująca
    // pełne propsy przekazane jako 2. argument w wersji 3.4+
    propG: {
      validator(value, props) {
        // Wartość musi pasować do jednego z tych stringów
        return ['success', 'warning', 'danger'].includes(value)
      }
    },
    // Funkcja z wartością domyślną
    propH: {
      type: Function,
      // W przeciwieństwie do domyślnego obiektu lub tablicy, to nie jest funkcja
      // fabrykująca - to funkcja służąca jako wartość domyślna
      default() {
        return 'Default function'
      }
    }
  }
}
```

</div>

Dodatkowe szczegóły:

- Wszystkie propsy są opcjonalne domyślnie, chyba że określono `required: true`.

- Nieobecny opcjonalny props inny niż `Boolean` będzie miał wartość `undefined`.

- Nieobecne propsy typu `Boolean` zostaną rzutowane na `false`. Możesz to zmienić ustawiając dla nich `default` — np.: `default: undefined` aby zachowywały się jak props nie będący typu Boolean.

- Jeśli określona jest wartość `default`, zostanie ona użyta gdy wartość propsa zostanie rozwiązana jako `undefined` - dotyczy to zarówno sytuacji, gdy props jest nieobecny, jak i gdy została jawnie przekazana wartość `undefined`.

Gdy walidacja propsów nie powiedzie się, Vue wyświetli ostrzeżenie w konsoli (jeśli używana jest wersja deweloperska).

<div class="composition-api">

Jeśli używasz [Deklaracji propsów opartych na typach](/api/sfc-script-setup#type-only-props-emit-declarations) <sup class="vt-badge ts" />, Vue postara się jak najlepiej skompilować adnotacje typów do równoważnych deklaracji propsów w czasie wykonania. Na przykład, `defineProps<{ msg: string }>` zostanie skompilowane do `{ msg: { type: String, required: true }}`.

</div>
<div class="options-api">

::: tip Note
Pamiętaj, że propsy są walidowane **przed** utworzeniem instancji komponentu, więc właściwości instancji (np. `data`, `computed`, itp.) nie będą dostępne wewnątrz funkcji `default` lub `validator`.
:::

</div>

### Sprawdzanie typów w czasie wykonania {#runtime-type-checks}

`type` może być jednym z następujących natywnych konstruktorów:

- `String`
- `Number`
- `Boolean`
- `Array`
- `Object`
- `Date`
- `Function`
- `Symbol`
- `Error`

Dodatkowo, `type` może być również niestandardową klasą lub funkcją konstruktora, a sprawdzenie zostanie wykonane za pomocą `instanceof`. Na przykład, mając następującą klasę:

```js
class Person {
  constructor(firstName, lastName) {
    this.firstName = firstName
    this.lastName = lastName
  }
}
```

Możesz użyć jej jako typu propsa:

<div class="composition-api">

```js
defineProps({
  author: Person
})
```

</div>
<div class="options-api">

```js
export default {
  props: {
    author: Person
  }
}
```

</div>

Vue użyje `instanceof Person` do sprawdzenia, czy wartość propsa `author` jest faktycznie instancją klasy `Person`.

### Typ dopuszczający null {#nullable-type}

Jeśli typ jest wymagany, ale dopuszcza null, możesz użyć składni tablicowej, która zawiera `null`:

<div class="composition-api">

```js
defineProps({
  id: {
    type: [String, null],
    required: true
  }
})
```

</div>
<div class="options-api">

```js
export default {
  props: {
    id: {
      type: [String, null],
      required: true
    }
  }
}
```

</div>

Pamiętaj, że jeśli `type` to po prostu `null` bez użycia składni tablicowej, dopuści on każdy typ.

## Rzutowanie Boolean {#boolean-casting}

Propsy typu `Boolean` mają specjalne reguły rzutowania, aby naśladować zachowanie natywnych atrybutów logicznych. Biorąc pod uwagę `<MyComponent>` z następującą deklaracją:

<div class="composition-api">

```js
defineProps({
  disabled: Boolean
})
```

</div>
<div class="options-api">

```js
export default {
  props: {
    disabled: Boolean
  }
}
```

</div>

Komponent może być używany w następujący sposób:

```vue-html
<!-- odpowiednik przekazania :disabled="true" -->
<MyComponent disabled />

<!-- odpowiednik przekazania :disabled="false" -->
<MyComponent />
```

Gdy props jest zadeklarowany tak, aby dopuszczał wiele typów, reguły rzutowania dla `Boolean` również będą stosowane. Jednakże, istnieje szczególny przypadek gdy dozwolone są zarówno `String` jak i `Boolean` - reguła rzutowania Boolean będzie stosowana tylko wtedy, gdy Boolean występuje przed String:

<div class="composition-api">

```js
// disabled zostanie zrzutowane na true
defineProps({
  disabled: [Boolean, Number]
})

// disabled zostanie zrzutowane na true
defineProps({
  disabled: [Boolean, String]
})

// disabled zostanie zrzutowane na true
defineProps({
  disabled: [Number, Boolean]
})

// disabled zostanie sparsowane jako pusty string (disabled="")
defineProps({
  disabled: [String, Boolean]
})
```

</div>
<div class="options-api">

```js
// disabled zostanie zrzutowane na true
export default {
  props: {
    disabled: [Boolean, Number]
  }
}

// disabled zostanie zrzutowane na true
export default {
  props: {
    disabled: [Boolean, String]
  }
}

// disabled zostanie zrzutowane na true
export default {
  props: {
    disabled: [Number, Boolean]
  }
}

// disabled zostanie sparsowane jako pusty string (disabled="")
export default {
  props: {
    disabled: [String, Boolean]
  }
}
```

</div>
