---
outline: deep
---

# Używanie Vue z TypeScriptem {#using-vue-with-typescript}

System typów taki jak TypeScript może wykrywać wiele powszechnych błędów poprzez statyczną analizę podczas kompilacji. Zmniejsza to szansę wystąpienia błędów w środowisku produkcyjnym, a także pozwala nam pewniej refaktoryzować kod w aplikacjach na dużą skalę. TypeScript poprawia również ergonomię pracy programisty poprzez autouzupełnianie oparte na typach w środowiskach IDE.

Vue jest napisane w TypeScript i zapewnia pierwszorzędne wsparcie dla TypeScript. Wszystkie oficjalne pakiety Vue zawierają dołączone deklaracje typów, które powinny działać od razu po instalacji.

## Ustawienie projektu {#project-setup}

[`create-vue`](https://github.com/vuejs/create-vue), oficjalne narzędzie do tworzenia projektów, oferuje opcję stworzenia projektu na [Vite](https://vitejs.dev/), gotowego do użycia z TypeScript.

### Przegląd {#overview}

W konfiguracji opartej na Vite, serwer deweloperski i proces budowania wykonują tylko transpilację bez sprawdzania typów. Zapewnia to, że serwer deweloperski Vite pozostaje błyskawicznie szybki nawet podczas używania TypeScript.

- Podczas developmentu zalecamy korzystanie z dobrej [konfiguracji IDE](#ide-support) w celu uzyskania natychmiastowej informacji zwrotnej o błędach typów.

- Jeśli używasz SFC, użyj narzędzia [`vue-tsc`](https://github.com/vuejs/language-tools/tree/master/packages/tsc) do sprawdzania typów w wierszu poleceń i generowania deklaracji typów. `vue-tsc` jest wrapperem wokół `tsc`, interfejsu wiersza poleceń TypeScript. Działa w większości tak samo jak `tsc`, z tą różnicą, że oprócz plików TypeScript obsługuje również Vue SFC. Możesz uruchomić `vue-tsc` w trybie watch równolegle do serwera deweloperskiego Vite lub użyć wtyczki Vite, takiej jak [vite-plugin-checker](https://vite-plugin-checker.netlify.app/), która uruchamia sprawdzanie w osobnym wątku roboczym.

- Vue CLI również zapewnia wsparcie dla TypeScript, ale nie jest już zalecane. Zobacz [uwagi poniżej](#note-on-vue-cli-and-ts-loader).

### Wsparcie IDE {#ide-support}

- [Visual Studio Code](https://code.visualstudio.com/) (VS Code) jest zdecydowanie zalecany ze względu na świetną, wbudowaną obsługę TypeScript.

  - [Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (wcześniej Volar) to oficjalne rozszerzenie VS Code, które zapewnia wsparcie TypeScript wewnątrz Vue SFC, wraz z wieloma innymi świetnymi funkcjami.

    :::tip
    Rozszerzenie Vue - Official zastępuje [Vetur](https://marketplace.visualstudio.com/items?itemName=octref.vetur), nasze poprzednie oficjalne rozszerzenie VS Code dla Vue 2. Jeśli masz obecnie zainstalowany Vetur, upewnij się, że jest on wyłączony w projektach Vue 3.
    :::

- [WebStorm](https://www.jetbrains.com/webstorm/) również zapewnia wbudowaną obsługę zarówno TypeScript, jak i Vue. Inne IDE JetBrains obsługują je także, albo od razu po instalacji, albo poprzez [darmową wtyczkę](https://plugins.jetbrains.com/plugin/9442-vue-js). Od wersji 2023.2, WebStorm i wtyczka Vue zawierają wbudowane wsparcie dla Vue Language Server. Możesz ustawić usługę Vue do korzystania z integracji Volar na wszystkich wersjach TypeScript w Settings > Languages & Frameworks > TypeScript > Vue. Domyślnie Volar będzie używany dla TypeScript w wersji 5.0 i wyższej.

### Konfiguracja `tsconfig.json` {#configuring-tsconfig-json}

Projekty utworzone za pomocą `create-vue` zawierają wstępnie skonfigurowany `tsconfig.json`. Podstawowa konfiguracja jest wyabstrahowana w pakiecie [`@vue/tsconfig`](https://github.com/vuejs/tsconfig). Wewnątrz projektu używamy [Project References](https://www.typescriptlang.org/docs/handbook/project-references.html), aby zapewnić poprawne typy dla kodu działającego w różnych środowiskach (np. kod aplikacji i kod testowy powinny mieć różne zmienne globalne).

Podczas ręcznej konfiguracji `tsconfig.json` niektóre istotne opcje to:

- [`compilerOptions.isolatedModules`](https://www.typescriptlang.org/tsconfig#isolatedModules) jest ustawione na `true`, ponieważ Vite używa [esbuild](https://esbuild.github.io/) do transpilacji TypeScript i podlega ograniczeniom transpilacji pojedynczych plików. [`compilerOptions.verbatimModuleSyntax`](https://www.typescriptlang.org/tsconfig#verbatimModuleSyntax) jest [nadrzędnym zbiorem `isolatedModules`](https://github.com/microsoft/TypeScript/issues/53601) i również jest dobrym wyborem - jest to to, czego używa [`@vue/tsconfig`](https://github.com/vuejs/tsconfig).

- Jeśli używasz Options API, musisz ustawić [`compilerOptions.strict`](https://www.typescriptlang.org/tsconfig#strict) na `true` (lub przynajmniej włączyć [`compilerOptions.noImplicitThis`](https://www.typescriptlang.org/tsconfig#noImplicitThis), który jest częścią flagi `strict`), aby wykorzystać sprawdzanie typów `this` w opcjach komponentu. W przeciwnym razie `this` będzie traktowane jako `any`.

- Jeśli skonfigurowałeś aliasy resolvera w swoim narzędziu do budowania, na przykład alias `@/*` skonfigurowany domyślnie w projekcie `create-vue`, musisz również skonfigurować go dla TypeScript poprzez [`compilerOptions.paths`](https://www.typescriptlang.org/tsconfig#paths).

- Jeśli zamierzasz używać TSX z Vue, ustaw [`compilerOptions.jsx`](https://www.typescriptlang.org/tsconfig#jsx) na `"preserve"` i ustaw [`compilerOptions.jsxImportSource`](https://www.typescriptlang.org/tsconfig#jsxImportSource) na `"vue"`.

Zobacz także:

- [Oficjalna dokumentacja opcji kompilatora TypeScript](https://www.typescriptlang.org/docs/handbook/compiler-options.html)
- [Uwagi dotyczące kompilacji TypeScript w esbuild](https://esbuild.github.io/content-types/#typescript-caveats)

### Uwaga dotycząca Vue CLI i `ts-loader` {#note-on-vue-cli-and-ts-loader}

W konfiguracjach opartych na webpack, takich jak Vue CLI, powszechne jest wykonywanie sprawdzania typów jako części potoku transformacji modułów, na przykład za pomocą `ts-loader`. Nie jest to jednak czyste rozwiązanie, ponieważ system typów potrzebuje wiedzy o całym grafie modułów do przeprowadzenia sprawdzania typów. Krok transformacji pojedynczego modułu po prostu nie jest odpowiednim miejscem na to zadanie. Prowadzi to do następujących problemów:

- `ts-loader` może sprawdzać typy tylko po transformacji kodu. Nie pokrywa się to z błędami, które widzimy w IDE lub z `vue-tsc`, które mapują się bezpośrednio do kodu źródłowego.

- Sprawdzanie typów może być wolne. Kiedy jest wykonywane w tym samym wątku / procesie co transformacje kodu, znacząco wpływa na szybkość budowania całej aplikacji.

- Mamy już sprawdzanie typów uruchomione w naszym IDE w osobnym procesie, więc koszt spowolnienia doświadczenia programistycznego po prostu nie jest dobrym kompromisem.

Jeśli obecnie używasz Vue 3 + TypeScript poprzez Vue CLI, zdecydowanie zalecamy migrację do Vite. Pracujemy również nad opcjami CLI, aby umożliwić obsługę TS tylko w trybie transpilacji, dzięki czemu będziesz mógł przejść na `vue-tsc` do sprawdzania typów.

## Ogólne uwagi dotyczące użytkowania {#general-usage-notes}

### `defineComponent()` {#definecomponent}

Aby TypeScript mógł poprawnie wywnioskować typy wewnątrz opcji komponentu, musimy definiować komponenty za pomocą [`defineComponent()`](/api/general#definecomponent):

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  // wnioskowanie typów włączone
  props: {
    name: String,
    msg: { type: String, required: true }
  },
  data() {
    return {
      count: 1
    }
  },
  mounted() {
    this.name // typ: string | undefined
    this.msg // typ: string
    this.count // typ: number
  }
})
```

`defineComponent()` obsługuje również wnioskowanie właściwości przekazywanych do `setup()` podczas korzystania z Composition API bez `<script setup>`:

```ts
import { defineComponent } from 'vue'

export default defineComponent({
  // wnioskowanie typów włączone
  props: {
    message: String
  },
  setup(props) {
    props.message // typ: string | undefined
  }
})
```

Zobacz także:

- [Uwaga na temat webpack Treeshaking](/api/general#note-on-webpack-treeshaking)
- [testy typów dla `defineComponent`](https://github.com/vuejs/core/blob/main/packages/dts-test/defineComponent.test-d.tsx)

:::tip
`defineComponent()` umożliwia również wnioskowanie typów dla komponentów zdefiniowanych w czystym JavaScript.
:::

### Użycie w komponentach jednoplikowych {#usage-in-single-file-components}

Aby używać TypeScript w SFC, dodaj atrybut `lang="ts"` do znaczników `<script>`. Gdy `lang="ts"` jest obecny, wszystkie wyrażenia w szablonie również podlegają ściślejszemu sprawdzaniu typów.

```vue
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  data() {
    return {
      count: 1
    }
  }
})
</script>

<template>
  <!-- sprawdzanie typów i auto-uzupełnianie włączone -->
  {{ count.toFixed(2) }}
</template>
```

`lang="ts"` może być również używane ze `<script setup>`:

```vue
<script setup lang="ts">
// TypeScript włączony
import { ref } from 'vue'

const count = ref(1)
</script>

<template>
  <!-- sprawdzanie typów i auto-uzupełnianie włączone -->
  {{ count.toFixed(2) }}
</template>
```

### TypeScript w szablonach {#typescript-in-templates}

Znacznik `<template>` również obsługuje TypeScript w wyrażeniach wiążących, gdy używany jest `<script lang="ts">` lub `<script setup lang="ts">`. Jest to przydatne w przypadkach, gdy musisz wykonać rzutowanie typów w wyrażeniach szablonu.

Oto przykład:

```vue
<script setup lang="ts">
let x: string | number = 1
</script>

<template>
  <!-- błąd ponieważ x może być typu string -->
  {{ x.toFixed(2) }}
</template>
```

Można to obejść za pomocą wbudowanego rzutowania typu:

```vue{6}
<script setup lang="ts">
let x: string | number = 1
</script>

<template>
  {{ (x as number).toFixed(2) }}
</template>
```

:::tip
Jeśli używasz Vue CLI lub konfiguracji opartej na webpacku, TypeScript w wyrażeniach szablonu wymaga `vue-loader@^16.8.0`.
:::

### Użycie z TSX {#usage-with-tsx}

Vue obsługuje również tworzenie komponentów z JSX / TSX. Szczegóły zostały omówione w przewodniku [Funkcja Render i JSX](/guide/extras/render-function.html#jsx-tsx).

## Komponenty generyczne {#generic-components}

Komponenty generyczne są obsługiwane w dwóch przypadkach:

- W SFC: [`<script setup>` z atrybutem `generic`](/api/sfc-script-setup.html#generics)
- Komponenty funkcji Render / JSX: [sygnatura funkcji `defineComponent()`](/api/general.html#function-signature)

## Przepisy specyficzne dla API {#api-specific-recipes}

- [TS z Composition API](./composition-api)
- [TS z Options API](./options-api)
