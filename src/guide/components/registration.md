# Rejestracja komponentów {#component-registration}

> Ta strona zakłada, że przeczytałeś już [Podstawy Komponentów](/guide/essentials/component-basics). Przeczytaj je najpierw, jeśli dopiero zaczynasz pracę z komponentami.

<VueSchoolLink href="https://vueschool.io/lessons/vue-3-global-vs-local-vue-components" title="Free Vue.js Component Registration Lesson"/>

Komponent Vue musi zostać "zarejestrowany", aby Vue wiedziało, gdzie znaleźć jego implementację, gdy napotka go w szablonie. Istnieją dwa sposoby rejestrowania komponentów: globalny i lokalny.
## Rejestracja globalna {#global-registration}

Możemy sprawić, że komponenty będą dostępne globalnie w bieżącej [aplikacji Vue](/guide/essentials/application) używając metody `.component()`:

```js
import { createApp } from 'vue'

const app = createApp({})

app.component(
  // zarejestrowana nazwa
  'MyComponent',
  // implementacja
  {
    /* ... */
  }
)
```

Jeśli używasz SFC, będziesz rejestrować zaimportowane pliki `.vue`:

```js
import MyComponent from './App.vue'

app.component('MyComponent', MyComponent)
```

Metoda `.component()` może być łączona:

```js
app
  .component('ComponentA', ComponentA)
  .component('ComponentB', ComponentB)
  .component('ComponentC', ComponentC)
```

Komponenty zarejestrowane globalnie mogą być używane w szablonie dowolnego komponentu w tej aplikacji:

```vue-html
<!-- to zadziała w każdym komponencie wewnątrz aplikacji -->
<ComponentA/>
<ComponentB/>
<ComponentC/>
```

Dotyczy to również wszystkich podkomponentów, co oznacza, że wszystkie trzy komponenty będą również dostępne _wewnątrz siebie nawzajem_.

## Rejestracja lokalna {#local-registration}

Pomimo że wygodna, rejestracja globalna ma kilka słabości:

1. Rejestracja globalna uniemożliwia systemom budowania usuwanie nieużywanych komponentów (tzw. "tree-shaking"). Jeśli zarejestrujesz komponent globalnie, ale nie użyjesz go nigdzie w swojej aplikacji, nadal zostanie on dołączony do końcowej paczki.

2. Rejestracja globalna sprawia, że zależności między komponentami są mniej przejrzyste w dużych aplikacjach. Utrudnia to zlokalizowanie implementacji komponentu potomnego z poziomu komponentu nadrzędnego, który go używa. Może to wpływać na długoterminową utrzymywalność podobnie jak używanie zbyt wielu zmiennych globalnych.

Rejestracja lokalna ogranicza dostępność zarejestrowanych komponentów tylko do bieżącego komponentu. Sprawia to, że zależności między komponentami są bardziej przejrzyste i jest bardziej przyjazna dla tree-shakingu.

<div class="composition-api">

Podczas używania SFC z `<script setup>`, zaimportowane komponenty mogą być używane lokalnie bez rejestracji:

```vue
<script setup>
import ComponentA from './ComponentA.vue'
</script>

<template>
  <ComponentA />
</template>
```

W przypadku braku `<script setup>`, będziesz musiał użyć opcji `components`:

```js
import ComponentA from './ComponentA.js'

export default {
  components: {
    ComponentA
  },
  setup() {
    // ...
  }
}
```

</div>
<div class="options-api">

Rejestracja lokalna jest wykonywana przy użyciu opcji `components`:

```vue
<script>
import ComponentA from './ComponentA.vue'

export default {
  components: {
    ComponentA
  }
}
</script>

<template>
  <ComponentA />
</template>
```

</div>

Dla każdej właściwości w obiekcie `components`, klucz będzie zarejestrowaną nazwą komponentu, podczas gdy wartość będzie zawierać implementację komponentu. Powyższy przykład używa skróconego zapisu właściwości z ES2015 i jest równoważny z:

```js
export default {
  components: {
    ComponentA: ComponentA
  }
  // ...
}
```

Zauważ, że **komponenty zarejestrowane lokalnie _nie_ są dostępne w komponentach potomnych**. W tym przypadku, `ComponentA` będzie dostępny tylko dla bieżącego komponentu, nie dla żadnego z jego komponentów potomnych czy dalszych potomków.

## Konwencja nazewnictwa komponentów {#component-name-casing}

W całym przewodniku używamy nazw w formacie PascalCase podczas rejestrowania komponentów. Jest to spowodowane tym, że:

1. Nazwy w formacie PascalCase są poprawnymi identyfikatorami JavaScript. Ułatwia to importowanie i rejestrowanie komponentów w JavaScript. Pomaga to również IDE w autouzupełnianiu.

2. `<PascalCase />` sprawia, że bardziej oczywiste jest to, że jest to komponent Vue, a nie natywny element HTML w szablonach. Odróżnia to również komponenty Vue od elementów niestandardowych (web components).

Jest to zalecany styl podczas pracy z SFC lub szablonami stringowymi. Jednak, jak omówiono w [zastrzeżeniach dotyczących parsowania szablonów w DOM](/guide/essentials/component-basics#in-dom-template-parsing-caveats), tagi w formacie PascalCase nie mogą być używane w szablonach w DOM.

Na szczęście Vue obsługuje rozwiązywanie tagów w formacie kebab-case do komponentów zarejestrowanych przy użyciu PascalCase. Oznacza to, że komponent zarejestrowany jako `MyComponent` może być przywoływany w szablonie zarówno przez `<MyComponent>`, jak i `<my-component>`. Pozwala nam to używać tego samego kodu rejestracji komponentów JavaScript niezależnie od źródła szablonu.
