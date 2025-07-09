# Podstawy komponentów {#components-basics}

<ScrimbaLink href="https://scrimba.com/links/vue-component-basics" title="Darmowa lekcja o podstawach komponentów w Vue.js" type="scrimba">
  Objerzyj interaktywną lekcję w Scrimba
</ScrimbaLink>

Komponenty pozwalają nam podzielić interfejs użytkownika na niezależne części wielokrotnego użytku oraz myśleć o każdej z nich w izolacji. Często aplikacja jest organizowana w strukturę komponentów zagnieżdżonych w drzewie:

![Drzewo komponentów](./images/components.png)

<!-- https://www.figma.com/file/qa7WHDQRWuEZNRs7iZRZSI/components -->

Jest to bardzo podobne do sposobu, w jaki zagnieżdżamy natywne elementy HTML, ale Vue implementuje swój własny model komponentów, który pozwala hermetyzować niestandardową zawartość i logikę w każdym komponencie. Vue dobrze współpracuje również z natywnymi komponentami sieciowymi (Web Components). Jeśli jesteś ciekawy relacji między komponentami Vue a natywnymi komponentami sieciowymi, [przeczytaj więcej tutaj](/guide/extras/web-components).

## Definiowanie komponentu {#defining-a-component}

Podczas korzystania z procesu budowania, zazwyczaj definiujemy każdy komponent Vue w dedykowanym pliku z rozszerzeniem `.vue` - znanym jako [jednoplikowy komponent (Single-File Component)](/guide/scaling-up/sfc) (w skrócie SFC):

<div class="options-api">

```vue
<script>
export default {
  data() {
    return {
      count: 0
    }
  }
}
</script>

<template>
  <button @click="count++">Kliknąłeś mnie {{ count }} razy.</button>
</template>
```

</div>
<div class="composition-api">

```vue
<script setup>
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <button @click="count++">Kliknąłeś mnie {{ count }} razy.</button>
</template>
```

</div>

Kiedy nie używamy procesu budowania, komponent Vue może być zdefiniowany jako zwykły obiekt JavaScript zawierający opcje specyficzne dla Vue:

<div class="options-api">

```js
export default {
  data() {
    return {
      count: 0
    }
  },
  template: `
    <button @click="count++">
      Kliknąłeś mnie {{ count }} razy.
    </button>`
}
```

</div>
<div class="composition-api">

```js
import { ref } from 'vue'

export default {
  setup() {
    const count = ref(0)
    return { count }
  },
  template: `
    <button @click="count++">
      Kliknąłeś mnie {{ count }} razy.
    </button>`
  // Można również używać szablonów w DOM:
  // template: '#my-template-element'
}
```

</div>

Szablon jest tutaj wstawiony bezpośrednio jako ciąg znaków JavaScript, który Vue skompiluje na bieżąco. Można również używać selektora ID wskazującego na element (zwykle natywne elementy `<template>`) - Vue użyje jego zawartości jako źródła szablonu.

Powyższy przykład definiuje pojedynczy komponent i eksportuje go jako domyślny eksport pliku `.js`, ale można używać eksportów nazwanych, aby eksportować wiele komponentów z tego samego pliku.

## Używanie komponentu {#using-a-component}

:::tip
Będziemy używać składni SFC przez resztę tego przewodnika - koncepcje związane z komponentami są takie same, niezależnie od tego, czy używasz procesu budowania, czy nie. Sekcja [przykłady](/examples/) pokazuje użycie komponentów w obu scenariuszach.
:::

Aby użyć komponentu podrzędnego, musimy go zaimportować do komponentu nadrzędnego. Zakładając, że nasz komponent licznika umieściliśmy w pliku o nazwie `ButtonCounter.vue`, komponent będzie dostępny jako domyślny eksport tego pliku:

<div class="options-api">

```vue
<script>
import ButtonCounter from './ButtonCounter.vue'

export default {
  components: {
    ButtonCounter
  }
}
</script>

<template>
  <h1>Oto komponent podrzędny!</h1>
  <ButtonCounter />
</template>
```

Aby udostępnić zaimportowany komponent w naszym szablonie, musimy [zarejestrować](/guide/components/registration) go za pomocą opcji `components`. Komponent będzie dostępny jako tag, używając nazwy, pod którą został zarejestrowany.

</div>

<div class="composition-api">

```vue
<script setup>
import ButtonCounter from './ButtonCounter.vue'
</script>

<template>
  <h1>Oto komponent podrzędny!</h1>
  <ButtonCounter />
</template>
```

W przypadku `<script setup>`, zaimportowane komponenty są automatycznie dostępne w szablonie.

</div>

Możliwe jest również globalne zarejestrowanie komponentu, co sprawia, że jest on dostępny dla wszystkich komponentów w danej aplikacji bez konieczności importowania go. Wady i zalety rejestracji globalnej vs lokalnej są omówione w dedykowanej sekcji [rejestracja komponentów](/guide/components/registration).

Komponenty mogą być używane tyle razy, ile chcesz:

```vue-html
<h1>Oto wiele komponentów podrzędnych!</h1>
<ButtonCounter />
<ButtonCounter />
<ButtonCounter />
```

<div class="options-api">

[Wypróbuj w playground](https://play.vuejs.org/#eNqVUE1LxDAQ/StjLqusNHotcfHj4l8QcontLBtsJiGdiFL6301SdrEqyEJyeG9m3ps3k3gIoXlPKFqhxi7awDtN1gUfGR4Ts6cnn4gxwj56B5tGrtgyutEEoAk/6lCPe5MGhqmwnc9KhMRjuxCwFi3UrCk/JU/uGTC6MBjGglgdbnfPGBFM/s7QJ3QHO/TfxC+UzD21d72zPItU8uQrrsWvnKsT/ZW2N2wur45BI3KKdETlFlmphZsF58j/RgdQr3UJuO8G273daVFFtlstahngxSeoNezBIUzTYgPzDGwdjk1VkYvMj4jzF0nwsyQ=)

</div>
<div class="composition-api">

[Wypróbuj w playground](https://play.vuejs.org/#eNqVj91KAzEQhV/lmJsqlY3eSlr8ufEVhNys6ZQGNz8kE0GWfXez2SJUsdCLuZiZM9+ZM4qnGLvPQuJBqGySjYxMXOJWe+tiSIznwhz8SyieKWGfgsOqkyfTGbDSXsmFUG9rw+Ti0DPNHavD/faVEqGv5Xr/BXOwww4mVBNPnvOVklXTtKeO8qKhkj++4lb8+fL/mCMS7TEdAy6BtDfBZ65fVgA2s+L67uZMUEC9N0s8msGaj40W7Xa91qKtgbdQ0Ha0gyOM45E+TWDrKHeNIhfMr0DTN4U0me8=)

</div>

Zauważ, że podczas klikania przycisków, każdy z nich utrzymuje swój własny, osobny `count`. Dzieje się tak, ponieważ za każdym razem, gdy używasz komponentu, tworzona jest nowa **instancja** tego komponentu.

W SFC zaleca się używanie nazw tagów w `PascalCase` dla komponentów podrzędnych, aby odróżnić je od natywnych elementów HTML. Chociaż nazwy tagów w HTML są niewrażliwe na wielkość liter, SFC Vue to format skompilowany, więc możemy używać nazw tagów rozróżniających wielkość liter. Możemy również używać `/>` do zamykania tagu.

Jeśli tworzysz swoje szablony bezpośrednio w DOM (np. jako zawartość natywnego elementu `<template>`), szablon będzie podlegał natywnemu zachowaniu parsowania HTML przeglądarki. W takich przypadkach będziesz musiał użyć `kebab-case` i jawnych tagów zamykających dla komponentów:

```vue-html
<!-- jeśli ten szablon jest napisany w DOM -->
<button-counter></button-counter>
<button-counter></button-counter>
<button-counter></button-counter>
```

Zobacz [zagadnienia związane z analizą szablonów w DOM](#in-dom-template-parsing-caveats) po więcej szczegółów.

## Przekazywanie właściwości (props) {#passing-props}

Jeśli budujemy bloga, prawdopodobnie będziemy potrzebować komponentu reprezentującego post. Chcemy, aby wszystkie posty miały ten sam układ wizualny, ale różną zawartość. Taki komponent nie będzie użyteczny, jeśli nie będziesz mógł przekazać do niego danych, takich jak tytuł i treść konkretnego posta, który chcemy wyświetlić. Właśnie do tego służą właściwości (props).

Właściwości (props) to niestandardowe atrybuty, które można zarejestrować w komponencie. Aby przekazać tytuł do naszego komponentu posta blogowego, musimy zadeklarować go na liście właściwości, które ten komponent akceptuje, używając <span class="options-api">opcji [`props`](/api/options-state#props)</span><span class="composition-api">makra [`defineProps`](/api/sfc-script-setup#defineprops-defineemits)</span>:

<div class="options-api">

```vue [BlogPost.vue]
<script>
export default {
  props: ['title']
}
</script>

<template>
  <h4>{{ title }}</h4>
</template>
```

Gdy wartość jest przekazywana do atrybutu prop, staje się ona właściwością w tym wystąpieniu komponentu. Wartość tej właściwości jest dostępna w szablonie i w kontekście `this` komponentu, tak jak każda inna właściwość komponentu.

</div>
<div class="composition-api">

```vue [BlogPost.vue]
<script setup>
defineProps(['title'])
</script>

<template>
  <h4>{{ title }}</h4>
</template>
```

`defineProps` to makro kompilacyjne dostępne tylko w obrębie `<script setup>` nie wymagające bezpośredniego importu. Zadeklarowane właściwości są automatycznie dostępne w szablonie. `defineProps` zwraca również obiekt zawierający wszystkie właściwości przekazane do komponentu, dzięki czemu możemy uzyskać do nich dostęp w JavaScript, jeśli to potrzebne:

```js
const props = defineProps(['title'])
console.log(props.title)
```

Zobacz także: [Typowanie właściwości komponentu](/guide/typescript/composition-api#typing-component-props) <sup class="vt-badge ts" />

Jeśli nie używasz `<script setup>`, właściwości (props) powinny być deklarowane przy użyciu opcji `props`, a obiekt props zostanie przekazany do funkcji `setup()` jako pierwszy argument:

```js
export default {
  props: ['title'],
  setup(props) {
    console.log(props.title)
  }
}
```

</div>

Komponent może mieć dowolną liczbę właściwości (props), a domyślnie każda wartość może być przekazana do każdej właściwości.

Po zarejestrowaniu właściwości można przekazać do niej dane jako atrybut niestandardowy:

```vue-html
<BlogPost title="Moja przygoda z Vue" />
<BlogPost title="Blogowanie z Vue" />
<BlogPost title="Dlaczego Vue jest takie fajne" />
```

Jednak w typowej aplikacji w komponencie nadrzędnym prawdopodobnie będzie dostępna tablica postów:

<div class="options-api">

```js
export default {
  // ...
  data() {
    return {
      posts: [
        { id: 1, title: 'My journey with Vue' },
        { id: 2, title: 'Blogowanie z Vue"' },
        { id: 3, title: 'Dlaczego Vue jest takie fajne' }
      ]
    }
  }
}
```

</div>
<div class="composition-api">

```js
const posts = ref([
  { id: 1, title: 'My journey with Vue' },
  { id: 2, title: 'Blogowanie z Vue"' },
  { id: 3, title: 'Dlaczego Vue jest takie fajne' }
])
```

</div>

Następnie należy wyrenderować komponent dla każdego elementu, używając `v-for`:

```vue-html
<BlogPost
  v-for="post in posts"
  :key="post.id"
  :title="post.title"
 />
```

<div class="options-api">

[Wypróbuj w playground](https://play.vuejs.org/#eNp9UU1rhDAU/CtDLrawVfpxklRo74We2kPtQdaoaTUJ8bmtiP+9ia6uC2VBgjOZeXnz3sCejAkPnWAx4+3eSkNJqmRjtCU817p81S2hsLpBEEYL4Q1BqoBUid9Jmosi62rC4Nm9dn4lFLXxTGAt5dG482eeUXZ1vdxbQZ1VCwKM0zr3x4KBATKPcbsDSapFjOClx5d2JtHjR1KFN9fTsfbWcXdy+CZKqcqL+vuT/r3qvQqyRatRdMrpF/nn/DNhd7iPR+v8HCDRmDoj4RHxbfyUDjeFto8p8yEh1Rw2ZV4JxN+iP96FMvest8RTTws/gdmQ8HUr7ikere+yHduu62y//y3NWG38xIOpeODyXcoE8OohGYZ5VhhHHjl83sD4B3XgyGI=)

</div>
<div class="composition-api">

[Wypróbuj w playground](https://play.vuejs.org/#eNp9kU9PhDAUxL/KpBfWBCH+OZEuid5N9qSHrQezFKhC27RlDSF8d1tYQBP1+N78OpN5HciD1sm54yQj1J6M0A6Wu07nTIpWK+MwwPASI0qjWkQejVbpsVHVQVl30ZJ0WQRHjwFMnpT0gPZLi32w2h2DMEAUGW5iOOEaniF66vGuOiN5j0/hajx7B4zxxt5ubIiphKz+IO828qXugw5hYRXKTnqSydcrJmk61/VF/eB4q5s3x8Pk6FJjauDO16Uye0ZCBwg5d2EkkED2wfuLlogibMOTbMpf9tMwP8jpeiMfRdM1l8Tk+/F++Y6Cl0Lyg1Ha7o7R5Bn9WwSg9X0+DPMxMI409fPP1PELlVmwdQ==)

</div>

Zauważ, że do przekazywania dynamicznych wartości do właściwości komponentu użyto [składni `v-bind`](/api/built-in-directives#v-bind) (`:title="post.title"`). Jest to szczególnie przydatne, gdy nie wiadomo z góry, jaka zawartość zostanie wyrenderowana.

To wszystko, co na razie musisz wiedzieć o właściwościach (props), ale gdy skończysz czytać tę stronę i poczujesz się komfortowo z jej treścią, zalecamy powrót później, aby przeczytać cały poradnik dotyczący [właściwości (props)](/guide/components/props).

## Nasłuchiwanie wydarzeń {#listening-to-events}

Podczas tworzenia komponentu `<BlogPost>` niektóre funkcjonalności mogą wymagać komunikacji z komponentem nadrzędnym. Przykładowo można dodać funkcję zwiększania rozmiaru tekstu w postach, zachowując resztę strony w domyślnym rozmiarze.

W komponencie nadrzędnym można obsłużyć tę funkcjonalność, dodając <span class="options-api">właściwość danych</span><span class="composition-api">odniesienie (ref)</span> `postFontSize` :

<div class="options-api">

```js{6}
data() {
  return {
    posts: [
      /* ... */
    ],
    postFontSize: 1
  }
}
```

</div>
<div class="composition-api">

```js{5}
const posts = ref([
  /* ... */
])

const postFontSize = ref(1)
```

</div>

Którego można użyć w szablonie do kontrolowania rozmiaru czcionki wszystkich wpisów w blogu:

```vue-html{1,7}
<div :style="{ fontSize: postFontSize + 'em' }">
  <BlogPost
    v-for="post in posts"
    :key="post.id"
    :title="post.title"
   />
</div>
```

Teraz dodajmy przycisk do szablonu komponentu `<BlogPost>`:

```vue{5} [BlogPost.vue]
<!-- pomijając <script> -->
<template>
  <div class="blog-post">
    <h4>{{ title }}</h4>
    <button>Powiększ tekst</button>
  </div>
</template>
```

Przycisk nie wykonuje jeszcze żadnej akcji - chcemy, aby kliknięcie przycisku komunikowało komponentowi rodzica, że powinien zwiększyć rozmiar tekstu wszystkich postów. Aby rozwiązać ten problem, komponenty zapewniają niestandardowy system wydarzeń. Rodzic może wybrać, czy chce nasłuchiwać dowolnego wydarzenia na instancji komponentu potomnego za pomocą `v-on` lub `@`, tak jak zrobilibyśmy to w przypadku natywnego wydarzenia DOM:

```vue-html{3}
<BlogPost
  ...
  @enlarge-text="postFontSize += 0.1"
 />
```

Następnie komponent podrzędny może wyemitować wydarzenie na sobie samym, wywołując wbudowaną metodę [**`$emit`**](/api/component-instance#emit), przekazując nazwę wydarzenia:

```vue{5} [BlogPost.vue]
<!-- pomijając <script> -->
<template>
  <div class="blog-post">
    <h4>{{ title }}</h4>
    <button @click="$emit('enlarge-text')">Powiększ tekst</button>
  </div>
</template>
```

Dzięki nasłuchiwaczowi `@enlarge-text="postFontSize += 0.1"` element nadrzędny odbierze wydarzenie i zaktualizuje wartość `postFontSize`.

<div class="options-api">

[Wypróbuj w playground](https://play.vuejs.org/#eNqNUsFOg0AQ/ZUJMaGNbbHqidCmmujNxMRED9IDhYWuhV0CQy0S/t1ZYIEmaiRkw8y8N/vmMZVxl6aLY8EM23ByP+Mprl3Bk1RmCPexjJ5ljhBmMgFzYemEIpiuAHAFOzXQgIVeESNUKutL4gsmMLfbBPStVFTP1Bl46E2mup4xLDKhI4CUsMR+1zFABTywYTkD5BgzG8ynEj4kkVgJnxz38Eqaut5jxvXAUCIiLqI/8TcD/m1fKhTwHHIJYSEIr+HbnqikPkqBL/yLSMs23eDooNexel8pQJaksYeMIgAn4EewcyxjtnKNCsK+zbgpXILJEnW30bCIN7ZTPcd5KDNqoWjARWufa+iyfWBlV13wYJRvJtWVJhiKGyZiL4vYHNkJO8wgaQVXi6UGr51+Ndq5LBqMvhyrH9eYGePtOVu3n3YozWSqFsBsVJmt3SzhzVaYY2nm9l82+7GX5zTGjlTM1SyNmy5SeX+7rqr2r0NdOxbFXWVXIEoBGz/m/oHIF0rB5Pz6KTV6aBOgEo7Vsn51ov4GgAAf2A==)

</div>
<div class="composition-api">

[Wypróbuj w playground](https://play.vuejs.org/#eNp1Uk1PwkAQ/SuTxqQYgYp6ahaiJngzITHRA/UAZQor7W7TnaK16X93th8UEuHEvPdm5s3bls5Tmo4POTq+I0yYyZTAIOXpLFAySXVGUEKGEVQQZToBl6XukXqO9XahDbXc2OsAO5FlAIEKtWJByqCBqR01WFqiBLnxYTIEkhSjD+5rAV86zxQW8C1pB+88Aaphr73rtXbNVqrtBeV9r/zYFZYHacBoiHLFykB9Xgfq1NmLVvQmf7E1OGFaeE0anAMXhEkarwhtRWIjD+AbKmKcBk4JUdvtn8+6ARcTu87hLuCf6NJpSoDDKNIZj7BtIFUTUuB0tL/HomXHcnOC18d1TF305COqeJVtcUT4Q62mtzSF2/GkE8/E8b1qh8Ljw/if8I7nOkPn9En/+Ug2GEmFi0ynZrB0azOujbfB54kki5+aqumL8bING28Yr4xh+2vePrI39CnuHmZl2TwwVJXwuG6ZdU6kFTyGsQz33HyFvH5wvvyaB80bACwgvKbrYgLVH979DQc=)

</div>

Opcjonalnie możemy zadeklarować emitowane wydarzenia za pomocą <span class="options-api">opcji [`emits`](/api/options-state#emits)</span><span class="composition-api">makra [`defineEmits`](/api/sfc-script-setup#defineprops-defineemits)</span>:

<div class="options-api">

```vue{4} [BlogPost.vue]
<script>
export default {
  props: ['title'],
  emits: ['enlarge-text']
}
</script>
```

</div>
<div class="composition-api">

```vue{3} [BlogPost.vue]
<script setup>
defineProps(['title'])
defineEmits(['enlarge-text'])
</script>
```

</div>

Dokumentuje to wszystkie wydarzenia emitowane przez komponent i opcjonalnie [waliduje je](/guide/components/events#events-validation). Pozwala to również Vue uniknąć niejawnego stosowania ich jako natywnych nasłuchiwaczy do głównego elementu komponentu podrzędnego.

<div class="composition-api">

Podobnie jak `defineProps`, `defineEmits` można używać tylko w `<script setup>` i nie trzeba go importować. Zwraca funkcję `emit`, która jest równoważna metodzie `$emit`. Można jej używać do emitowania wydarzeń w sekcji `<script setup>` komponentu, gdzie `$emit` nie jest bezpośrednio dostępny:

```vue
<script setup>
const emit = defineEmits(['enlarge-text'])

emit('enlarge-text')
</script>
```

Zobacz także: [Typowanie emitów komponentu](/guide/typescript/composition-api#typing-component-emits) <sup class="vt-badge ts" />

Jeśli nie używasz `<script setup>`, możesz zadeklarować emitowane wydarzenia za pomocą opcji `emits`. Możesz uzyskać dostęp do funkcji `emit` jako właściwości kontekstu konfiguracji (przekazanej do `setup()` jako drugi argument):

```js
export default {
  emits: ['enlarge-text'],
  setup(props, ctx) {
    ctx.emit('enlarge-text')
  }
}
```

</div>

To wszystko, co na razie musisz wiedzieć o niestandardowych wydarzeniach komponentów. Jednak gdy skończysz czytać tę stronę i poczujesz, że jej treść jest dla Ciebie interesująca, zalecamy powrót później, aby przeczytać cały przewodnik na temat [niestandardowych wydarzeń](/guide/components/events).

## Dystrybucja treści za pomocą slotów {#content-distribution-with-slots}

Podobnie jak w przypadku elementów HTML, często zachodzi potrzeba przekazania treści do komponentu:

```vue-html
<AlertBox>
  Coś złego się stało.
</AlertBox>
```

Co może wyrenderować coś takiego:

:::danger To jest błąd demonstracyjny
Coś złego się stało.
:::

Aby to osiągnąć, w Vue używa się niestandardowego elementu `<slot>`:

```vue{4} [AlertBox.vue]
<template>
  <div class="alert-box">
    <strong>To jest błąd demonstracyjny</strong>
    <slot />
  </div>
</template>

<style scoped>
.alert-box {
  /* ... */
}
</style>
```

Jak widać powyżej, używamy `<slot>` jako symbolu zastępczego, w którym chcemy umieścić treść – i to wszystko. Gotowe!

<div class="options-api">

[Wypróbuj w playground](https://play.vuejs.org/#eNpVUcFOwzAM/RUTDruwFhCaUCmThsQXcO0lbbKtIo0jx52Kpv07TreWouTynl+en52z2oWQnXqrClXGhtrA28q3XUBi2DlL/IED7Ak7WGX5RKQHq8oDVN4Oo9TYve4dwzmxDcp7bz3HAs5/LpfKyy3zuY0Atl1wmm1CXE5SQeLNX9hZPrb+ALU2cNQhWG9NNkrnLKIt89lGPahlyDTVogVAadoTNE7H+F4pnZTrGodKjUUpRyb0h+0nEdKdRL3CW7GmfNY5ZLiiMhfP/ynG0SL/OAuxwWCNMNncbVqSQyrgfrPZvCVcIxkrxFMYIKJrDZA1i8qatGl72ehLGEY6aGNkNwU8P96YWjffB8Lem/Xkvn9NR6qy+fRd14FSgopvmtQmzTT9Toq9VZdfIpa5jQ==)

</div>
<div class="composition-api">

[Wypróbuj w playground](https://play.vuejs.org/#eNpVUEtOwzAQvcpgFt3QBBCqUAiRisQJ2GbjxG4a4Xis8aQKqnp37PyUyqv3mZn3fBVH55JLr0Umcl9T6xi85t4VpW07h8RwNJr4Cwc4EXawS9KFiGO70ubpNBcmAmDdOSNZR8T5Yg0IoOQf7DSfW9tAJRWcpXPaapWM1nVt8ObpukY8ie29GHNzAiBX7QVqI73/LIWMzn2FQylGMcieCW1TfBMhPYSoE5zFitLVZ5BhQnkadt6nGKt5/jMafI1Oq8Ak6zW4xrEaDVIGj4fD4SPiCknpQLy4ATyaVgFptVH2JFXb+wze3DDSTioV/iaD1+eZqWT92xD2Vu2X7af3+IJ6G7/UToVigpJnTzwTO42eWDnELsTtH/wUqH4=)

</div>

To na razie wszystko, co musisz wiedzieć o slotach, ale gdy już skończysz czytać tę stronę i poczujesz się komfortowo z jej treścią, zalecamy powrót później, aby przeczytać cały poradnik dotyczący [slotów](/guide/components/slots).

## Komponenty dynamiczne {#dynamic-components}

Czasami przydatne jest dynamiczne przełączanie się między komponentami, na przykład w interfejsie z kartami:

<div class="options-api">

[Open example in the Playground](https://play.vuejs.org/#eNqNVE2PmzAQ/Ssj9kArLSHbrXpwk1X31mMPvS17cIxJrICNbJMmivLfO/7AEG2jRiDkefP85sNmztlr3y8OA89ItjJMi96+VFJ0vdIWfqqOQ6NVB/midIYj5sn9Sxlrkt9b14RXzXbiMElEO5IAKsmPnljzhg6thbNDmcLdkktrSADAJ/IYlj5MXEc9Z1w8VFNLP30ed2luBy1HC4UHrVH2N90QyJ1kHnUALN1gtLeIQu6juEUMkb8H5sXHqiS+qzK1Cw3Lu76llqMFsKrFAVhLjVlXWc07VWUeR89msFbhhhAWDkWjNJIwPgjp06iy5CV7fgrOOTgKv+XoKIIgpnoGyiymSmZ1wnq9dqJweZ8p/GCtYHtUmBMdLXFitgDnc9ju68b0yxDO1WzRTEcFRLiUJsEqSw3wwi+rMpFDj0psEq5W5ax1aBp7at1y4foWzq5R0hYN7UR7ImCoNIXhWjTfnW+jdM01gaf+CEa1ooYHzvnMVWhaiwEP90t/9HBP61rILQJL3POMHw93VG+FLKzqUYx3c2yjsOaOwNeRO2B8zKHlzBKQWJNH1YHrplV/iiMBOliFILYNK5mOKdSTMviGCTyNojFdTKBoeWNT3s8f/Vpsd7cIV61gjHkXnotR6OqVkJbrQKdsv9VqkDWBh2bpnn8VXaDcHPexE4wFzsojO9eDUOSVPF+65wN/EW7sHRsi5XaFqaexn+EH9Xcpe8zG2eWG3O0/NVzUaeJMk+jGhUXlNPXulw5j8w7t2bi8X32cuf/Vv/wF/SL98A==)

</div>
<div class="composition-api">

[Otwórz przykład w playground](https://play.vuejs.org/#eNqNVMGOmzAQ/ZURe2BXCiHbrXpwk1X31mMPvS1V5RiTWAEb2SZNhPLvHdvggLZRE6TIM/P8/N5gpk/e2nZ57HhCkrVhWrQWDLdd+1pI0bRKW/iuGg6VVg2ky9wFDp7G8g9lrIl1H80Bb5rtxfFKMcRzUA+aV3AZQKEEhWRKGgus05pL+5NuYeNwj6mTkT4VckRYujVY63GT17twC6/Fr4YjC3kp5DoPNtEgBpY3bU0txwhgXYojsJoasymSkjeqSHweK9vOWoUbXIC/Y1YpjaDH3wt39hMI6TUUSYSQAz8jArPT5Mj+nmIhC6zpAu1TZlEhmXndbBwpXH5NGL6xWrADMsyaMj1lkAzQ92E7mvYe8nCcM24xZApbL5ECiHCSnP73KyseGnvh6V/XedwS2pVjv3C1ziddxNDYc+2WS9fC8E4qJW1W0UbUZwKGSpMZrkX11dW2SpdcE3huT2BULUp44JxPSpmmpegMgU/tyadbWpZC7jCxwj0v+OfTDdU7ITOrWiTjzTS3Vei8IfB5xHZ4PmqoObMEJHryWXXkuqrVn+xEgHZWYRKbh06uLyv4iQq+oIDnkXSQiwKymlc26n75WNdit78FmLWCMeZL+GKMwlKrhLRcBzhlh51WnSwJPFQr9/zLdIZ007w/O6bR4MQe2bseBJMzer5yzwf8MtzbOzYMkNsOY0+HfoZv1d+lZJGMg8fNqdsfbbio4b77uRVv7I0Li8xxZN1PHWbeHdyTWXc/+zgw/8t/+QsROe9h)

</div>

Powyższe jest możliwe dzięki elementowi Vue `<component>` ze specjalnym atrybutem `is`:

<div class="options-api">

```vue-html
<!-- komponent zmienia się, gdy zmienia się bieżąca karta -->
<component :is="currentTab"></component>
```

</div>
<div class="composition-api">

```vue-html
<!-- komponent zmienia się, gdy zmienia się bieżąca karta -->
<component :is="tabs[currentTab]"></component>
```

</div>

W powyższym przykładzie wartość przekazana do `:is` może zawierać:

- nazwę zarejestrowanego komponentu (string) LUB
- rzeczywisty zaimportowany obiekt komponentu

Można również użyć atrybutu `is` do utworzenia zwykłych elementów HTML.

Podczas przełączania między wieloma komponentami za pomocą `<component :is="...">`, komponent zostanie odmontowany, gdy zostanie odłączony. Możemy wymusić, aby nieaktywne komponenty pozostały „aktywne” za pomocą wbudowanego komponentu [`<KeepAlive>`](/guide/built-ins/keep-alive).

## Ostrzeżenia dotyczące parsowania szablonów w DOM {#in-dom-template-parsing-caveats}

Jeśli piszesz swoje szablony Vue bezpośrednio w DOM, Vue będzie musiał pobrać ciąg szablonu z DOM. Prowadzi to do pewnych ograniczeń wynikających z natywnego sposobu parsowania HTML przez przeglądarki.

:::tip
Należy zauważyć, że ograniczenia omówione poniżej mają zastosowanie tylko wtedy, gdy piszesz swoje szablony bezpośrednio w DOM. NIE mają zastosowania, jeśli używasz ciągów szablonów z następujących źródeł:

- komponenty jednoplikowe (Single-File Components SFC)
- wbudowane ciągi szablonów (e.g. `template: '...'`)
- `<script type="text/x-template">`
  :::

### Niewrażliwość na wielkość liter {#case-insensitivity}

Znaczniki HTML i nazwy atrybutów nie uwzględniają wielkości liter, więc przeglądarki zinterpretują wszystkie wielkie litery jako małe. Oznacza to, że gdy używasz szablonów w DOM, nazwy komponentów PascalCase i nazwy właściwości camelCased lub nazwy zdarzeń `v-on` muszą używać swoich odpowiedników w formacie kebab-cased (rozdzielonych myślnikami):

```js
// camelCase w JavaScript
const BlogPost = {
  props: ['postTitle'],
  emits: ['updatePost'],
  template: `
    <h3>{{ postTitle }}</h3>
  `
}
```

```vue-html
<!-- kebab-case w HTML -->
<blog-post post-title="hello!" @update-post="onUpdatePost"></blog-post>
```

### Tagi samozamykające się {#self-closing-tags}

W poprzednich przykładach kodu używaliśmy samozamykających się znaczników dla komponentów:

```vue-html
<MyComponent />
```

Dzieje się tak, ponieważ parser szablonów Vue respektuje `/>` jako wskazanie zakończenia dowolnego znacznika, niezależnie od jego typu.

W szablonach in-DOM musimy jednak zawsze uwzględniać wyraźne znaczniki zamykające:

```vue-html
<my-component></my-component>
```

Dzieje się tak, ponieważ specyfikacja HTML zezwala tylko [kilku konkretnym elementom](https://html.spec.whatwg.org/multipage/syntax.html#void-elements) na pominięcie znaczników zamykających, z których najczęstszymi są `<input>` i `<img>`. W przypadku wszystkich innych elementów, jeśli pominiesz znacznik zamykający, natywny parser HTML uzna, że nigdy nie zakończyłeś znacznika otwierającego. Przykładem jest poniższy fragment kodu:

```vue-html
<my-component /> <!-- zamierzamy zamknąć tutaj tag... -->
<span>cześć</span>
```

will be parsed as:

```vue-html
<my-component>
  <span>cześć</span>
</my-component> <!-- ale przeglądarka zamknie go tutaj. -->
```

### Ograniczenia rozmieszczenia elementów {#element-placement-restrictions}

Niektóre elementy HTML, takie jak `<ul>`, `<ol>`, `<table>` i `<select>` mają ograniczenia dotyczące tego, jakie elementy mogą się w nich pojawiać, a niektóre elementy, takie jak `<li>`, `<tr>` i `<option>`, mogą pojawiać się tylko w niektórych z innych elementów.

To prowadzi do problemów podczas używania komponentów z elementami, które mają takie ograniczenia. Na przykład:

```vue-html
<table>
  <blog-post-row></blog-post-row>
</table>
```

Niestandardowy komponent `<blog-post-row>` zostanie wyniesiony jako nieprawidłowa zawartość, powodując błędy w ostatecznym wyniku renderowania. Możemy użyć specjalnego atrybutu [`is`](/api/built-in-special-attributes#is) jako obejścia:

```vue-html
<table>
  <tr is="vue:blog-post-row"></tr>
</table>
```

:::tip
W przypadku użycia w natywnych elementach HTML wartość `is` musi być poprzedzona prefiksem `vue:`, aby mogła zostać zinterpretowana jako komponent Vue. Jest to wymagane, aby uniknąć pomyłki z natywnymi [customowymi wbudowanymi elementami](https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements-customized-builtin-example).
:::

To wszystko, co musisz na razie wiedzieć na temat zastrzeżeń dotyczących analizy szablonów w DOM - i tak naprawdę koniec _Essentials_ Vue. Gratulacje! Jest jeszcze wiele do nauczenia, ale najpierw zalecamy zrobienie sobie przerwy, aby samemu pobawić się Vue - zbuduj coś fajnego lub sprawdź niektóre z [przykładów](/examples/), jeśli jeszcze tego nie zrobiłeś.

Gdy poczujesz się komfortowo z wiedzą, którą właśnie przyswoiłeś, przejdź do przewodnika, aby dowiedzieć się więcej o komponentach dogłębnie.
