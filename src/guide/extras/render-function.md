---
outline: deep
---

# Funkcje renderujące i JSX {#render-functions-jsx}

Vue zaleca używanie szablonów do budowania aplikacji w zdecydowanej większości przypadków. Jednak istnieją sytuacje, w których potrzebujemy pełnej programistycznej mocy JavaScript. W takich przypadkach możemy użyć **funkcji renderującej**.

> Jeśli jesteś nowy w koncepcji wirtualnego DOM i funkcji renderujących, upewnij się, że najpierw przeczytasz rozdział [Mechanizm Renderowania](/guide/extras/rendering-mechanism).

## Podstawowe użycie {#basic-usage}

### Tworzenie Vnode'ów {#creating-vnodes}

Vue udostępnia funkcję `h()` do tworzenia vnode'ów:

```js
import { h } from 'vue'

const vnode = h(
  'div', // typ
  { id: 'foo', class: 'bar' }, // props
  [
    /* dzieci */
  ]
)
```

`h()` jest skrótem od **hyperscript** - co oznacza "JavaScript, który tworzy HTML (hypertext markup language)". Ta nazwa została odziedziczona z konwencji wspólnych dla wielu implementacji wirtualnego DOM-u. Bardziej opisowa nazwa mogłaby brzmieć `createVnode()`, ale krótsza nazwa pomaga, gdy musisz wielokrotnie wywoływać tę funkcję w funkcji renderującej.

Funkcja `h()` została zaprojektowana, aby być bardzo elastyczna:

```js
// wszystkie argumenty oprócz typu są opcjonalne
h('div')
h('div', { id: 'foo' })

// zarówno atrybuty jak i właściwości mogą być używane w props
// Vue automatycznie wybiera właściwy sposób przypisania
h('div', { class: 'bar', innerHTML: 'witaj' })

// modyfikatory props takie jak `.prop` i `.attr` mogą być dodane
// odpowiednio z przedrostkami `.` i `^`
h('div', { '.name': 'some-name', '^width': '100' })

// class i style mają takie samo wsparcie dla wartości
// obiektowych / tablicowych jak w szablonach
h('div', { class: [foo, { bar }], style: { color: 'red' } })

// nasłuchiwacze zdarzeń powinny być przekazywane jako onXxx
h('div', { onClick: () => {} })

// potomkowie mogą być stringiem
h('div', { id: 'foo' }, 'witaj')

// props mogą być pominięte gdy nie ma props
h('div', 'witaj')
h('div', [h('span', 'witaj')])

// tablica potomków może zawierać mieszane vnode'y i stringi
h('div', ['witaj', h('span', 'witaj')])
```

Wynikowy vnode ma następującą strukturę:

```js
const vnode = h('div', { id: 'foo' }, [])

vnode.type // 'div'
vnode.props // { id: 'foo' }
vnode.children // []
vnode.key // null
```

:::warning Note
Pełny interfejs `VNode` zawiera wiele innych wewnętrznych właściwości, ale zdecydowanie zaleca się unikanie polegania na właściwościach innych niż te wymienione tutaj. Zapobiega to niezamierzonym uszkodzeniom w przypadku zmiany właściwości wewnętrznych.
:::

### Deklarowanie funkcji renderujących {#declaring-render-functions}

<div class="composition-api">

Podczas używania szablonów z Composition API, wartość zwracana przez hook `setup()` jest używana do udostępniania danych szablonowi. Jednak podczas używania funkcji renderujących możemy bezpośrednio zwrócić funkcję renderującą:

```js
import { ref, h } from 'vue'

export default {
  props: {
    /* ... */
  },
  setup(props) {
    const count = ref(1)

    // zwraca funkcję renderującą
    return () => h('div', props.msg + count.value)
  }
}
```

Funkcja renderująca jest deklarowana wewnątrz `setup()`, więc naturalnie ma dostęp do propsów i dowolnego stanu reaktywnego zadeklarowanego w tym samym zakresie.

Oprócz zwracania pojedynczego vnode, możesz również zwracać ciągi znaków lub tablice:

```js
export default {
  setup() {
    return () => 'witaj świecie!'
  }
}
```

```js
import { h } from 'vue'

export default {
  setup() {
    // użyj tablicy by zwrócić wiele bloków głównych
    return () => [
      h('div'),
      h('div'),
      h('div')
    ]
  }
}
```

:::tip
Upewnij się, że zwracasz funkcję zamiast bezpośrednio zwracać wartości! Funkcja `setup()` jest wywoływana tylko raz na komponent, podczas gdy zwrócona funkcja renderująca będzie wywoływana wielokrotnie.
:::

</div>
<div class="options-api">

Możemy deklarować funkcje renderujące używając opcji `render`:

```js
import { h } from 'vue'

export default {
  data() {
    return {
      msg: 'witaj'
    }
  },
  render() {
    return h('div', this.msg)
  }
}
```

Funkcja `render()` ma dostęp do instancji komponentu poprzez `this`.

Oprócz zwracania pojedynczego vnode, możesz również zwracać ciągi znaków lub tablice:

```js
export default {
  render() {
    return 'witaj świecie!'
  }
}
```

```js
import { h } from 'vue'

export default {
  render() {
    // użyj tablicy by zwrócić wiele bloków głównych
    return [
      h('div'),
      h('div'),
      h('div')
    ]
  }
}
```

</div>

Jeśli komponent funkcji renderującej nie potrzebuje żadnego stanu instancji, może być również zadeklarowany bezpośrednio jako funkcja dla zwięzłości:

```js
function Hello() {
  return 'witaj świecie!'
}
```

Zgadza się, to jest prawidłowy komponent Vue! Zobacz [Komponenty Funkcyjne](#functional-components), aby uzyskać więcej szczegółów na temat tej składni.

### Vnody muszą być unikalne {#vnodes-must-be-unique}

Wszystkie vnody w drzewie komponentów muszą być unikalne. Oznacza to, że następująca funkcja renderująca jest nieprawidłowa:

```js
function render() {
  const p = h('p', 'hi')
  return h('div', [
    // Ups - zduplikowane vnody!
    p,
    p
  ])
}
```

Jeśli naprawdę chcesz powielić ten sam element/komponent wiele razy, możesz to zrobić za pomocą funkcji wytwórczej. Na przykład, poniższa funkcja renderująca jest całkowicie prawidłowym sposobem renderowania 20 identycznych akapitów:

```js
function render() {
  return h(
    'div',
    Array.from({ length: 20 }).map(() => {
      return h('p', 'hej')
    })
  )
}
```

## JSX / TSX {#jsx-tsx}

[JSX](https://facebook.github.io/jsx/) jest rozszerzeniem JavaScript podobnym do XML, które pozwala nam pisać kod w taki sposób:

```jsx
const vnode = <div>witaj</div>
```

Wewnątrz wyrażeń JSX użyj nawiasów klamrowych do osadzania wartości dynamicznych:

```jsx
const vnode = <div id={dynamicId}>witaj, {userName}</div>
```

Zarówno `create-vue` jak i Vue CLI mają opcje do tworzenia projektów ze wstępnie skonfigurowaną obsługą JSX. Jeśli konfigurujesz JSX ręcznie, zapoznaj się z dokumentacją [`@vue/babel-plugin-jsx`](https://github.com/vuejs/jsx-next), aby uzyskać szczegóły.

Chociaż JSX zostało po raz pierwszy wprowadzone przez React, w rzeczywistości nie ma zdefiniowanej semantyki wykonawczej i może być kompilowane do różnych wyników. Jeśli pracowałeś wcześniej z JSX, pamiętaj, że **transformacja JSX Vue różni się od transformacji JSX Reacta**, więc nie możesz używać transformacji JSX Reacta w aplikacjach Vue. Niektóre znaczące różnice w porównaniu z JSX Reacta obejmują:

- Możesz używać atrybutów HTML takich jak `class` i `for` jako props - nie ma potrzeby używania `className` lub `htmlFor`.
- Przekazywanie dzieci do komponentów (tj. sloty) [działa inaczej](#passing-slots).

Definicja typów Vue zapewnia również wnioskowanie typów dla użycia TSX. Podczas używania TSX upewnij się, że określiłeś `"jsx": "preserve"` w `tsconfig.json`, aby TypeScript pozostawił składnię JSX nietkniętą do przetworzenia przez transformację JSX Vue.

### Wnioskowanie typów JSX {#jsx-type-inference}

Podobnie jak transformacja, JSX Vue również potrzebuje innych definicji typów.

Począwszy od Vue 3.4, Vue nie rejestruje już niejawnie globalnej przestrzeni nazw `JSX`. Aby poinstruować TypeScript do używania definicji typów JSX Vue, upewnij się, że w pliku `tsconfig.json` znajduje się następujący wpis:

```json
{
  "compilerOptions": {
    "jsx": "preserve",
    "jsxImportSource": "vue"
    // ...
  }
}
```

Możesz także włączyć tę opcję per plik dodając komentarz `/* @jsxImportSource vue */` na górze pliku.

Jeśli istnieje kod, który zależy od obecności globalnej przestrzeni nazw `JSX`, możesz zachować dokładnie to samo zachowanie globalne sprzed wersji 3.4 poprzez jawne zaimportowanie lub odwołanie się do `vue/jsx` w swoim projekcie, co rejestruje globalną przestrzeń nazw `JSX`.

## Przepisy na funkcje renderujące {#render-function-recipes}

Poniżej przedstawimy popularne przepisy na implementację funkcjonalności szablonów jako ich odpowiedniki w funkcjach renderujących / JSX.

### `v-if` {#v-if}

Template:

```vue-html
<div>
  <div v-if="ok">tak</div>
  <span v-else>nie</span>
</div>
```

Tożsama funkcja renderująca i JSX:

<div class="composition-api">

```js
h('div', [ok.value ? h('div', 'tak') : h('span', 'nie')])
```

```jsx
<div>{ok.value ? <div>tak</div> : <span>nie</span>}</div>
```

</div>
<div class="options-api">

```js
h('div', [this.ok ? h('div', 'tak') : h('span', 'nie')])
```

```jsx
<div>{this.ok ? <div>tak</div> : <span>nie</span>}</div>
```

</div>

### `v-for` {#v-for}

Template:

```vue-html
<ul>
  <li v-for="{ id, text } in items" :key="id">
    {{ text }}
  </li>
</ul>
```

Tożsama funkcja renderująca i JSX:

<div class="composition-api">

```js
h(
  'ul',
  // zakładając, że `items` jest refem z wartością tablicową
  items.value.map(({ id, text }) => {
    return h('li', { key: id }, text)
  })
)
```

```jsx
<ul>
  {items.value.map(({ id, text }) => {
    return <li key={id}>{text}</li>
  })}
</ul>
```

</div>
<div class="options-api">

```js
h(
  'ul',
  this.items.map(({ id, text }) => {
    return h('li', { key: id }, text)
  })
)
```

```jsx
<ul>
  {this.items.map(({ id, text }) => {
    return <li key={id}>{text}</li>
  })}
</ul>
```

</div>

### `v-on` {#v-on}

Właściwości o nazwach zaczynających się od `on` z następującą wielką literą są traktowane jako nasłuchiwacze zdarzeń. Na przykład, `onClick` jest odpowiednikiem `@click` w szablonach.

```js
h(
  'button',
  {
    onClick(event) {
      /* ... */
    }
  },
  'Wciśnij mnie'
)
```

```jsx
<button
  onClick={(event) => {
    /* ... */
  }}
>
  Wciśnij mnie
</button>
```

#### Modyfikatory zdarzeń {#event-modifiers}

Modyfikatory `.passive`, `.capture`, oraz `.once`, mogą być łączone po dodaniu do nazwy zdarzenia przy użyciu konwencji camelCase.

For example:

```js
h('input', {
  onClickCapture() {
    /* nasłuchwiacz w trybie przechwytywania */
  },
  onKeyupOnce() {
    /* wyzwalany tylko raz */
  },
  onMouseoverOnceCapture() {
    /* jednokrotnie + przechwytywanie */
  }
})
```

```jsx
<input
  onClickCapture={() => {}}
  onKeyupOnce={() => {}}
  onMouseoverOnceCapture={() => {}}
/>
```

Dla innych modyfikatorów zdarzeń i klawiszy można użyć helpera [`withModifiers`](/api/render-function#withmodifiers):

```js
import { withModifiers } from 'vue'

h('div', {
  onClick: withModifiers(() => {}, ['self'])
})
```

```jsx
<div onClick={withModifiers(() => {}, ['self'])} />
```

### Komponenty {#components}

Aby utworzyć vnode dla komponentu, pierwszym argumentem przekazanym do `h()` powinna być definicja komponentu. Oznacza to, że podczas używania funkcji renderujących nie jest konieczne rejestrowanie komponentów - możesz po prostu bezpośrednio używać zaimportowanych komponentów:

```js
import Foo from './Foo.vue'
import Bar from './Bar.jsx'

function render() {
  return h('div', [h(Foo), h(Bar)])
}
```

```jsx
function render() {
  return (
    <div>
      <Foo />
      <Bar />
    </div>
  )
}
```

Jak widzimy, `h` może działać z komponentami importowanymi z dowolnego formatu pliku, o ile jest to prawidłowy komponent Vue.

Komponenty dynamiczne są proste w przypadku funkcji renderujących:

```js
import Foo from './Foo.vue'
import Bar from './Bar.jsx'

function render() {
  return ok.value ? h(Foo) : h(Bar)
}
```

```jsx
function render() {
  return ok.value ? <Foo /> : <Bar />
}
```

Jeśli komponent jest zarejestrowany po nazwie i nie może być bezpośrednio zaimportowany (na przykład, zarejestrowany globalnie przez bibliotekę), może zostać programowo rozwiązany przy użyciu helpera [`resolveComponent()`](/api/render-function#resolvecomponent).

### Renderowanie Slotów {#rendering-slots}

<div class="composition-api">

W funkcjach renderujących można uzyskać dostęp do slotów z kontekstu `setup()`. Każdy slot w obiekcie `slots` jest **funkcją, która zwraca tablicę vnode'ów**:

```js
export default {
  props: ['message'],
  setup(props, { slots }) {
    return () => [
      // domyślny slot:
      // <div><slot /></div>
      h('div', slots.default()),

      // named slot:
      // <div><slot name="footer" :text="message" /></div>
      h(
        'div',
        slots.footer({
          text: props.message
        })
      )
    ]
  }
}
```

Odpowiednik JSX:

```jsx
// domyślny
<div>{slots.default()}</div>

// nazwany
<div>{slots.footer({ text: props.message })}</div>
```

</div>
<div class="options-api">

W funkcjach renderujących dostęp do slotów można uzyskać przez [`this.$slots`](/api/component-instance#slots):

```js
export default {
  props: ['message'],
  render() {
    return [
      // <div><slot /></div>
      h('div', this.$slots.default()),

      // <div><slot name="footer" :text="message" /></div>
      h(
        'div',
        this.$slots.footer({
          text: this.message
        })
      )
    ]
  }
}
```

Odpowiednik JSX:

```jsx
// <div><slot /></div>
<div>{this.$slots.default()}</div>

// <div><slot name="footer" :text="message" /></div>
<div>{this.$slots.footer({ text: this.message })}</div>
```

</div>

### Przekazywanie slotów {#passing-slots}

Przekazywanie dzieci do komponentów działa nieco inaczej niż przekazywanie dzieci do elementów. Zamiast tablicy, musimy przekazać funkcję slotu lub obiekt funkcji slotów. Funkcje slotów mogą zwracać wszystko, co może zwrócić normalna funkcja renderująca - co zawsze zostanie znormalizowane do tablic vnode'ów podczas dostępu w komponencie potomnym.

```js
// pojedynczy slot domyślny
h(MyComponent, () => 'witaj')

// nazwane sloty
// zauważ że `null` jest wymagane by zapobiec
// potraktowaniu obiektu slots jako props
h(MyComponent, null, {
  default: () => 'default slot',
  foo: () => h('div', 'foo'),
  bar: () => [h('span', 'jeden'), h('span', 'dwa')]
})
```

JSX equivalent:

```jsx
// domyślny
<MyComponent>{() => 'witaj'}</MyComponent>

// nazwany
<MyComponent>{{
  default: () => 'default slot',
  foo: () => <div>foo</div>,
  bar: () => [<span>jeden</span>, <span>dwa</span>]
}}</MyComponent>
```

Przekazywanie slotów jako funkcji pozwala na ich leniwe wywołanie przez komponent potomny. Prowadzi to do śledzenia zależności slotu przez potomka zamiast rodzica, co skutkuje dokładniejszymi i wydajniejszymi aktualizacjami.

### Sloty z zakresem {#scoped-slots}

Aby wyrenderować slot z zakresem w komponencie nadrzędnym, slot jest przekazywany do komponentu potomnego. Zwróć uwagę, jak slot ma teraz parametr `text`. Slot zostanie wywołany w komponencie potomnym, a dane z komponentu potomnego zostaną przekazane w górę do komponentu nadrzędnego.

```js
// komponent nadrzędny
export default {
  setup() {
    return () => h(MyComp, null, {
      default: ({ text }) => h('p', text)
    })
  }
}
```

Pamiętaj by przekazać `null` by sloty nie zostały potraktowane jako props.

```js
// komponent podrzędny
export default {
  setup(props, { slots }) {
    const text = ref('hi')
    return () => h('div', null, slots.default({ text: text.value }))
  }
}
```

Odpowiednik JSX:

```jsx
<MyComponent>{{
  default: ({ text }) => <p>{ text }</p>  
}}</MyComponent>
```

### Wbudowane komponenty {#built-in-components}

[Komponenty wbudowane](/api/built-in-components) takie jak `<KeepAlive>`, `<Transition>`, `<TransitionGroup>`, `<Teleport>` i `<Suspense>` muszą zostać zaimportowane aby ich użyć w funkcjach renderujących:

<div class="composition-api">

```js
import { h, KeepAlive, Teleport, Transition, TransitionGroup } from 'vue'

export default {
  setup () {
    return () => h(Transition, { mode: 'out-in' }, /* ... */)
  }
}
```

</div>
<div class="options-api">

```js
import { h, KeepAlive, Teleport, Transition, TransitionGroup } from 'vue'

export default {
  render () {
    return h(Transition, { mode: 'out-in' }, /* ... */)
  }
}
```

</div>

### `v-model` {#v-model}

Dyrektywa `v-model` jest rozwijana do propsów `modelValue` i `onUpdate:modelValue` podczas kompilacji szablonu - musimy sami dostarczyć te propsy:

<div class="composition-api">

```js
export default {
  props: ['modelValue'],
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () =>
      h(SomeComponent, {
        modelValue: props.modelValue,
        'onUpdate:modelValue': (value) => emit('update:modelValue', value)
      })
  }
}
```

</div>
<div class="options-api">

```js
export default {
  props: ['modelValue'],
  emits: ['update:modelValue'],
  render() {
    return h(SomeComponent, {
      modelValue: this.modelValue,
      'onUpdate:modelValue': (value) => this.$emit('update:modelValue', value)
    })
  }
}
```

</div>

### Niestandardowe dyrektywy {#custom-directives}

Własne dyrektywy mogą być zastosowane do vnode za pomocą [`withDirectives`](/api/render-function#withdirectives):

```js
import { h, withDirectives } from 'vue'

// niestandardowa dyrektywa
const pin = {
  mounted() { /* ... */ },
  updated() { /* ... */ }
}

// <div v-pin:top.animate="200"></div>
const vnode = withDirectives(h('div'), [
  [pin, 200, 'top', { animate: true }]
])
```

Jeśli dyrektywa jest zarejestrowana po nazwie i nie może być bezpośrednio zaimportowana, można ją rozwiązać za pomocą helpera [`resolveDirective`](/api/render-function#resolvedirective).

### Referencje szablonu {#template-refs}

<div class="composition-api">

W Composition API referencje szablonu są tworzone poprzez przekazanie samego `ref()` jako props do vnode:

```js
import { h, ref } from 'vue'

export default {
  setup() {
    const divEl = ref()

    // <div ref="divEl">
    return () => h('div', { ref: divEl })
  }
}
```

lub (w wersji >= 3.5)

```js
import { h, useTemplateRef } from 'vue'

export default {
  setup() {
    const divEl = useTemplateRef('my-div')

    // <div ref="divEl">
    return () => h('div', { ref: 'my-div' })
  }
}
```

</div>
<div class="options-api">

W Options API referencje szablonu są tworzone poprzez przekazanie nazwy referencji jako ciągu znaków w propsach vnode:

```js
export default {
  render() {
    // <div ref="divEl">
    return h('div', { ref: 'divEl' })
  }
}
```

</div>

## Komponenty funkcyjne {#functional-components}

Komponenty funkcyjne są alternatywną formą komponentów, które nie mają własnego stanu. Działają jak czyste funkcje: propsy na wejściu, vnode na wyjściu. Są renderowane bez tworzenia instancji komponentu (tj. bez `this`) i bez typowych haków cyklu życia komponentu.

Aby utworzyć komponent funkcyjny, używamy zwykłej funkcji zamiast obiektu opcji. Funkcja ta jest efektywnie funkcją `render` dla komponentu.

<div class="composition-api">

Sygnatura komponentu funkcyjnego jest taka sama jak hooka `setup()`:

```js
function MyComponent(props, { slots, emit, attrs }) {
  // ...
}
```

</div>
<div class="options-api">

Ponieważ nie ma referencji `this` dla komponentu funkcyjnego, Vue przekaże `props` jako pierwszy argument:

```js
function MyComponent(props, context) {
  // ...
}
```

Drugi argument, `context`, zawiera trzy właściwości: `attrs`, `emit` i `slots`. Są one odpowiednikami właściwości instancji [`$attrs`](/api/component-instance#attrs), [`$emit`](/api/component-instance#emit) i [`$slots`](/api/component-instance#slots).

</div>

Większość zwykłych opcji konfiguracyjnych dla komponentów nie jest dostępna dla komponentów funkcyjnych. Jednakże możliwe jest zdefiniowanie [`props`](/api/options-state#props) i [`emits`](/api/options-state#emits) poprzez dodanie ich jako właściwości:

```js
MyComponent.props = ['value']
MyComponent.emits = ['click']
```

Jeśli opcja `props` nie jest określona, to obiekt `props` przekazany do funkcji będzie zawierał wszystkie atrybuty, tak samo jak `attrs`. Nazwy propsów nie będą normalizowane do camelCase, chyba że opcja `props` zostanie określona.

Dla komponentów funkcyjnych z jawnie określonymi `props`, [dziedziczenie atrybutów](/guide/components/attrs) działa podobnie jak w przypadku zwykłych komponentów. Jednakże dla komponentów funkcyjnych, które nie określają jawnie swoich `props`, tylko `class`, `style` i nasłuchiwacze zdarzeń `onXxx` będą dziedziczone z `attrs` domyślnie. W obu przypadkach `inheritAttrs` może być ustawione na `false`, aby wyłączyć dziedziczenie atrybutów:

```js
MyComponent.inheritAttrs = false
```

Komponenty funkcyjne mogą być rejestrowane i używane tak samo jak zwykłe komponenty. Jeśli przekażesz funkcję jako pierwszy argument do `h()`, będzie ona traktowana jako komponent funkcyjny.

### Typowanie komponentów funkcyjnych<sup class="vt-badge ts" /> {#typing-functional-components}

Komponenty funkcyjne mogą być typowane w zależności od tego, czy są nazwane czy anonimowe. [Vue - Oficjalne rozszerzenie](https://github.com/vuejs/language-tools) obsługuje również sprawdzanie typów poprawnie typowanych komponentów funkcyjnych podczas używania ich w szablonach SFC.

**Nazwany komponent funkcyjny**

```tsx
import type { SetupContext } from 'vue'
type FComponentProps = {
  message: string
}

type Events = {
  sendMessage(message: string): void
}

function FComponent(
  props: FComponentProps,
  context: SetupContext<Events>
) {
  return (
    <button onClick={() => context.emit('sendMessage', props.message)}>
        {props.message} {' '}
    </button>
  )
}

FComponent.props = {
  message: {
    type: String,
    required: true
  }
}

FComponent.emits = {
  sendMessage: (value: unknown) => typeof value === 'string'
}
```

**Anonimowy komponent funkcyjny**

```tsx
import type { FunctionalComponent } from 'vue'

type FComponentProps = {
  message: string
}

type Events = {
  sendMessage(message: string): void
}

const FComponent: FunctionalComponent<FComponentProps, Events> = (
  props,
  context
) => {
  return (
    <button onClick={() => context.emit('sendMessage', props.message)}>
        {props.message} {' '}
    </button>
  )
}

FComponent.props = {
  message: {
    type: String,
    required: true
  }
}

FComponent.emits = {
  sendMessage: (value) => typeof value === 'string'
}
```
