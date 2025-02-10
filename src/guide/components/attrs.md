---
outline: deep
---

# Dziedziczone atrybuty {#fallthrough-attributes}

> Ta strona zakłada, że przeczytałeś już [Podstawy komponentów](/guide/essentials/component-basics). Przeczytaj to najpierw, jeśli dopiero zaczynasz pracę z komponentami.

## Dziedziczenie atrybutów {#attribute-inheritance}

"Dziedziczony atrybut" to atrybut lub nasłuchujący zdarzenia `v-on`, który jest przekazywany do komponentu, ale nie jest jawnie zadeklarowany w [właściwościach (props)](./props) lub [zdarzeniach emitowanych](./events#declaring-emitted-events) komponentu odbierającego. Typowe przykłady to atrybuty `class`, `style` i `id`.

Gdy komponent renderuje pojedynczy element główny, dziedziczone atrybuty zostaną automatycznie dodane do atrybutów elementu głównego. Na przykład, mając komponent `<MyButton>` z następującym szablonem:

```vue-html
<!-- szablon <MyButton> -->
<button>Wciśnij mnie</button>
```

A rodzic używający tego komponentu z:

```vue-html
<MyButton class="large" />
```

Finalny wyrenderowany DOM będzie:

```html
<button class="large">Wciśnij mnie</button>
```

Tutaj, `<MyButton>` nie zadeklarował `class` jako akceptowanego prop. W związku z tym, `class` jest traktowany jako przechodzący atrybut i automatycznie dodawany do głównego elementu `<MyButton>`.

### Łączenie `class` i `style` {#class-and-style-merging}

Jeśli główny element komponentu potomnego ma już istniejące atrybuty `class` lub `style`, zostaną one połączone z wartościami `class` i `style` odziedziczonymi po rodzicu. Załóżmy, że zmienimy szablon `<MyButton>` w poprzednim przykładzie na:

```vue-html
<!-- template of <MyButton> -->
<button class="btn">Wciśnij mnie</button>
```

Wtedy finalny wyrenderowany DOM stanie się:

```html
<button class="btn large">Wciśnij mnie</button>
```

### Dziedziczenie nasłuchiwania `v-on` {#v-on-listener-inheritance}

Ta sama zasada dotyczy nasłuchiwania zdarzeń `v-on`:

```vue-html
<MyButton @click="onClick" />
```

Nasłuchiwanie `click` zostanie dodane do głównego elementu `<MyButton>`, tj. natywnego elementu `<button>`. Gdy natywny `<button>` zostanie kliknięty, wywoła metodę `onClick` komponentu rodzica. Jeśli natywny `<button>` ma już nasłuchiwanie `click` powiązane z `v-on`, wtedy oba nasłuchiwania zostaną wywołane.

### Dziedziczenie komponentów zagnieżdżonych {#nested-component-inheritance}

Jeśli komponent renderuje inny komponent jako swój główny węzeł, na przykład, przebudowaliśmy `<MyButton>` aby renderował `<BaseButton>` jako swój główny element:

```vue-html
<!-- szablon <MyButton/> który po prostu renderuje inny komponent -->
<BaseButton />
```

Wtedy przechodzące atrybuty otrzymane przez `<MyButton>` zostaną automatycznie przekazane do `<BaseButton>`.

Należy zauważyć, że:

1. Przekazywane atrybuty nie zawierają żadnych atrybutów, które są zadeklarowane jako props lub nasłuchiwania `v-on` zdarzeń zadeklarowanych przez `<MyButton>` - innymi słowy, zadeklarowane props i nasłuchiwania zostały "skonsumowane" przez `<MyButton>`.

2. Przekazywane atrybuty mogą być akceptowane jako props przez `<BaseButton>`, jeśli zostały przez niego zadeklarowane.

## Wyłączanie dziedziczenia atrybutów {#disabling-attribute-inheritance}

Jeśli **nie** chcesz, aby komponent automatycznie dziedziczył atrybuty, możesz ustawić `inheritAttrs: false` w opcjach komponentu.

<div class="composition-api">

Od wersji 3.3 możesz również użyć [`defineOptions`](/api/sfc-script-setup#defineoptions) bezpośrednio w `<script setup>`:

```vue
<script setup>
defineOptions({
  inheritAttrs: false
})
// ...setup logic
</script>
```

</div>

Częstym scenariuszem wyłączenia dziedziczenia atrybutów jest sytuacja, gdy atrybuty muszą być zastosowane do innych elementów niż główny węzeł. Ustawiając opcję `inheritAttrs` na `false`, możesz przejąć pełną kontrolę nad tym, gdzie przechodzące atrybuty powinny być zastosowane.

Te przechodzące atrybuty mogą być dostępne bezpośrednio w wyrażeniach szablonu jako `$attrs`:

```vue-html
<span>Fallthrough attributes: {{ $attrs }}</span>
```

Obiekt `$attrs` zawiera wszystkie atrybuty, które nie zostały zadeklarowane przez opcje `props` lub `emits` komponentu (np. `class`, `style`, nasłuchiwanie `v-on`, itp.).

Kilka uwag:

- W przeciwieństwie do props, przechodzące atrybuty zachowują swoją oryginalną pisownię w JavaScript, więc do atrybutu takiego jak `foo-bar` trzeba się odwoływać jako `$attrs['foo-bar']`.

- Nasłuchiwanie zdarzenia `v-on` jak `@click` będzie dostępne w obiekcie jako funkcja pod `$attrs.onClick`.

Używając naszego przykładu komponentu `<MyButton>` z [poprzedniej sekcji](#attribute-inheritance) - czasami może być konieczne owinięcie właściwego elementu `<button>` dodatkowym `<div>` dla celów stylizacji:

```vue-html
<div class="btn-wrapper">
  <button class="btn">Wciśnij mnie</button>
</div>
```

Chcemy, aby wszystkie przechodzące atrybuty jak `class` i nasłuchiwanie `v-on` były zastosowane do wewnętrznego `<button>`, a nie zewnętrznego `<div>`. Możemy to osiągnąć za pomocą `inheritAttrs: false` i `v-bind="$attrs"`:

```vue-html{2}
<div class="btn-wrapper">
  <button class="btn" v-bind="$attrs">Wciśnij mnie</button>
</div>
```

Pamiętaj, że [`v-bind` bez argumentu](/guide/essentials/template-syntax#dynamically-binding-multiple-attributes) wiąże wszystkie właściwości obiektu jako atrybuty elementu docelowego.

## Dziedziczenie atrybutów na wielu głównych węzłach {#attribute-inheritance-on-multiple-root-nodes}

W przeciwieństwie do komponentów z pojedynczym głównym węzłem, komponenty z wieloma głównymi węzłami nie mają automatycznego zachowania przechodzenia atrybutów. Jeśli `$attrs` nie są jawnie powiązane, zostanie wyświetlone ostrzeżenie w czasie wykonywania.

```vue-html
<CustomLayout id="custom-layout" @click="changeValue" />
```

Jeśli `<CustomLayout>` ma następujący szablon z wieloma głównymi węzłami, pojawi się ostrzeżenie, ponieważ Vue nie może być pewne, gdzie zastosować przechodzące atrybuty:

```vue-html
<header>...</header>
<main>...</main>
<footer>...</footer>
```

Ostrzeżenie zostanie wyciszone, jeśli `$attrs` zostanie jawnie powiązane:

```vue-html{2}
<header>...</header>
<main v-bind="$attrs">...</main>
<footer>...</footer>
```

## Dostęp do przechodzących atrybutów w JavaScript {#accessing-fallthrough-attributes-in-javascript}

<div class="composition-api">

Jeśli potrzebne, możesz uzyskać dostęp do przechodzących atrybutów komponentu w `<script setup>` używając API `useAttrs()`:

```vue
<script setup>
import { useAttrs } from 'vue'

const attrs = useAttrs()
</script>
```

Jeśli nie używasz `<script setup>`, `attrs` będzie dostępne jako właściwość kontekstu `setup()`:

```js
export default {
  setup(props, ctx) {
    // fallthrough attributes are exposed as ctx.attrs
    console.log(ctx.attrs)
  }
}
```

Zauważ, że chociaż obiekt `attrs` zawsze odzwierciedla najnowsze przechodzące atrybuty, nie jest reaktywny (ze względów wydajnościowych). Nie możesz użyć obserwatorów do śledzenia jego zmian. Jeśli potrzebujesz reaktywności, użyj prop. Alternatywnie, możesz użyć `onUpdated()` aby wykonać efekty uboczne z najnowszymi `attrs` przy każdej aktualizacji.

</div>

<div class="options-api">

Jeśli potrzebne, możesz uzyskać dostęp do przechodzących atrybutów komponentu przez właściwość instancji `$attrs`:

```js
export default {
  created() {
    console.log(this.$attrs)
  }
}
```

</div>
