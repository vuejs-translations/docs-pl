# Renderowanie warunkowe {#conditional-rendering}

<div class="options-api">
  <VueSchoolLink href="https://vueschool.io/lessons/conditional-rendering-in-vue-3" title="Darmowa lekcja Vue.js o renderowaniu warunkowym"/>
</div>

<div class="composition-api">
  <VueSchoolLink href="https://vueschool.io/lessons/vue-fundamentals-capi-conditionals-in-vue" title="Darmowa lekcja Vue.js o renderowaniu warunkowym"/>
</div>

<script setup>
import { ref } from 'vue'
const awesome = ref(true)
</script>

## `v-if` {#v-if}

Dyrektywa `v-if` jest używana do warunkowego renderowania bloku. Blok będzie renderowany tylko wtedy, gdy wyrażenie dyrektywy zwróci wartość prawdziwą.

```vue-html
<h1 v-if="awesome">Vue jest niesamowite!</h1>
```

## `v-else` {#v-else}

Można użyć dyrektywy `v-else`, aby wskazać blok "else" dla `v-if`:

```vue-html
<button @click="awesome = !awesome">Przełącz</button>

<h1 v-if="awesome">Vue jest niesamowite!</h1>
<h1 v-else>O nie 😢</h1>
```

<div class="demo">
  <button @click="awesome = !awesome">Przełącz</button>
  <h1 v-if="awesome">Vue jest niesamowite!</h1>
  <h1 v-else>O nie 😢</h1>
</div>

<div class="composition-api">

[Wypróbuj w playground](https://play.vuejs.org/#eNpFjkEOgjAQRa8ydIMulLA1hegJ3LnqBskAjdA27RQXhHu4M/GEHsEiKLv5mfdf/sBOxux7j+zAuCutNAQOyZtcKNkZbQkGsFjBCJXVHcQBjYUSqtTKERR3dLpDyCZmQ9bjViiezKKgCIGwM21BGBIAv3oireBYtrK8ZYKtgmg5BctJ13WLPJnhr0YQb1Lod7JaS4G8eATpfjMinjTphC8wtg7zcwNKw/v5eC1fnvwnsfEDwaha7w==)

</div>
<div class="options-api">

[Wypróbuj w playground](https://play.vuejs.org/#eNpFjj0OwjAMha9iMsEAFWuVVnACNqYsoXV/RJpEqVOQqt6DDYkTcgRSWoplWX7y56fXs6O1u84jixlvM1dbSoXGuzWOIMdCekXQCw2QS5LrzbQLckje6VEJglDyhq1pMAZyHidkGG9hhObRYh0EYWOVJAwKgF88kdFwyFSdXRPBZidIYDWvgqVkylIhjyb4ayOIV3votnXxfwrk2SPU7S/PikfVfsRnGFWL6akCbeD9fLzmK4+WSGz4AA5dYQY=)

</div>

Element `v-else` musi natychmiast po `v-if` lub `v-else-if` - w przeciwnym razie nie zostanie rozpoznany.

## `v-else-if` {#v-else-if}

`v-else-if`, jak sama nazwa wskazuje, pełni rolę bloku "else if" dla `v-if`. Może być również dołączne wielokrotnie:

```vue-html
<div v-if="type === 'A'">
  A
</div>
<div v-else-if="type === 'B'">
  B
</div>
<div v-else-if="type === 'C'">
  C
</div>
<div v-else>
  Not A/B/C
</div>
```

Podobnie jak `v-else`, element `v-else-if` musi pojawić się natychmiast po `v-if` lub `v-else-if`.

## `v-if` w `<template>` {#v-if-on-template}

Ponieważ `v-if` jest dyrektywą, musi być przypisane do pojedynczego elementu. Ale co w przypadku kiedy chcemy przełączać więcej niż jeden element? W takim przypadku możemy użyć `v-if` na elemencie `<template>`, który służy jako niewidoczny kontener. Końcowy wynik renderowania nie będzie zawierał elementu `<template>`.

```vue-html
<template v-if="ok">
  <h1>Tytuł</h1>
  <p>Paragraf 1</p>
  <p>Paragraf 2</p>
</template>
```

`v-else` i `v-else-if` mogą być również używane w `<template>`.

## `v-show` {#v-show}

Inną opcją warunkowego wyświetlania elementu jest dyrektywa `v-show`. Użycie jest zasadniczo takie samo:

```vue-html
<h1 v-show="ok">Cześć!</h1>
```

Różnica polega na tym, że element z `v-show` będzie zawsze renderowany i pozostanie w DOM; `v-show` tylko przełącza właściwość CSS `display` elementu.

`v-show` nie obsługuje elementu `<template>`, ani nie działa z `v-else`.

## `v-if` vs. `v-show` {#v-if-vs-v-show}

`v-if` to "prawdziwe" renderowanie warunkowe, ponieważ zapewnia, że nasłuchiwacze zdarzeń i komponenty potomne w bloku warunkowym są odpowiednio niszczone i ponownie tworzone podczas przełączania.

`v-if` jest również **lazy**: jeśli warunek jest fałszywy podczas początkowego renderowania, nie zrobi nic - blok warunkowy nie zostanie wyrenderowany, dopóki warunek nie stanie się prawdziwy po raz pierwszy.

W porównaniu, `v-show` jest o wiele prostsze - element jest zawsze renderowany, niezależnie od początkowego warunku, z przełączaniem oparte na CSS.

Ogólnie rzecz biorąc, `v-if` ma wyższe koszty przełączania, podczas gdy `v-show` ma wyższe koszty początkowego renderowania. Wybieraj zatem `v-show`, jeśli musisz przełączać coś bardzo często, a `v-if`, jeśli mało prawdopodobne jest, aby warunek zmienił się w czasie wykonywania.

## `v-if` z `v-for` {#v-if-with-v-for}

Kiedy `v-if` i `v-for` są używane w tym samym elemencie, `v-if` zostanie wzięte pod uwagę pierwsze. Zobacz [przewodnik renderowania list](list#v-for-with-v-if), żeby poznać szczegóły.

::: warning Note
Nie zaleca się używania `v-if` i `v-for` na tym samym elemencie ze względu na niejawne pierwszeństwo. Więcej szczegółów można znaleźć w [przewodniku renderowania listy](list#v-for-with-v-if).
:::
