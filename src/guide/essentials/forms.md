---
outline: deep
---

<script setup>
import { ref } from 'vue'
const message = ref('')
const multilineText = ref('')
const checked = ref(false)
const checkedNames = ref([])
const picked = ref('')
const selected = ref('')
const multiSelected = ref([])
</script>

# Wiązanie z formularzami inputów {#form-input-bindings}

<div class="options-api">
  <VueSchoolLink href="https://vueschool.io/lessons/user-inputs-vue-devtools-in-vue-3" title="Darmowa lekcja Vue.js o inputach użytkownika"/>
</div>

<div class="composition-api">
  <VueSchoolLink href="https://vueschool.io/lessons/vue-fundamentals-capi-user-inputs-in-vue" title="Darmowa lekcja Vue.js o inputach użytkownika"/>
</div>

Podczas pracy z formularzami na froncie często musimy zsynchronizować stan elementów formularza z odpowiadającym mu stanem w JavaScript. Może to być kłopotliwe, ponieważ trzeba ręcznie połączyć powiązania wartości i nasłuchiwania wydarzeń zmiany:

```vue-html
<input
  :value="text"
  @input="event => text = event.target.value">
```

Dyrektywa `v-model` pomaga nam uprościć powyższe do:

```vue-html
<input v-model="text">
```

Ponadto `v-model` można używać na inputach różnych typów, elementach `<textarea>` i `<select>`. Automatycznie rozszerza się do różnych par właściwości i wydarzeń DOM w zależności od elementu, na którym jest używany:

- `<input>` z typami tekstowymi i `<textarea>` używają właściwości `value` i wydarzenia `input`;
- `<input type="checkbox">` i `<input type="radio">` używają właściwości `checked` i wydarzenia `change`;
- `<select>` używa `value` jako propsa, a `change` jako wydarzenia.

::: tip Note
`v-model` will ignore the initial `value`, `checked` or `selected` attributes found on any form elements. It will always treat the current bound JavaScript state as the source of truth. You should declare the initial value on the JavaScript side, using <span class="options-api">the [`data`](/api/options-state.html#data) option</span><span class="composition-api">[reactivity APIs](/api/reactivity-core.html#reactivity-api-core)</span>.

`v-model` zignoruje początkowe atrybuty `value`, `checked` lub `selected` znalezione w dowolnych elementach formularza. Zawsze będzie traktować bieżący powiązany stan JavaScript jako źródło prawdy. Powinieneś zadeklarować początkową wartość po stronie JavaScript, używając <span class="options-api">opcji [`data`](/api/options-state.html#data)</span><span class="composition-api">[API reaktywności](/api/reactivity-core.html#reactivity-api-core)</span>.
:::

## Podstawowe użycie {#basic-usage}

### Text {#text}

```vue-html
<p>Wiadomość brzmi: {{ message }}</p>
<input v-model="message" placeholder="edit me" />
```

<div class="demo">
  <p>Wiadomość brzmi: {{ message }}</p>
  <input v-model="message" placeholder="edit me" />
</div>

<div class="composition-api">

[Wypróbuj w playground](https://play.vuejs.org/#eNo9jUEOgyAQRa8yYUO7aNkbNOkBegM2RseWRGACoxvC3TumxuX/+f+9ql5Ez31D1SlbpuyJoSBvNLjoA6XMUCHjAg2WnAJomWoXXZxSLAwBSxk/CP2xuWl9d9GaP0YAEhgDrSOjJABLw/s8+NJBrde/NWsOpWPrI20M+yOkGdfeqXPiFAhowm9aZ8zS4+wPv/RGjtZcJtV+YpNK1g==)

</div>
<div class="options-api">

[Wypróbuj w playground](https://play.vuejs.org/#eNo9jdEKwjAMRX8l9EV90L2POvAD/IO+lDVqoetCmw6h9N/NmBuEJPeSc1PVg+i2FFS90nlMnngwEb80JwaHL1sCQzURwFm258u2AyTkkuKuACbM2b6xh9Nps9o6pEnp7ggWwThRsIyiADQNz40En3uodQ+C1nRHK8HaRyoMy3WaHYa7Uf8To0CCRvzMwWESH51n4cXvBNTd8Um1H0FuTq0=)

</div>

<span id="vmodel-ime-tip"></span>
::: tip Note
W przypadku języków, które wymagają [IME](https://en.wikipedia.org/wiki/Input_method) (chiński, japoński, koreański itd.), zauważysz, że `v-model` nie jest aktualizowany podczas kompozycji IME. Jeśli chcesz również odpowiedzieć na te aktualizacje, użyj własnego `input` event listener i powiązania `value` zamiast używać `v-model`.
:::

### Tekst wielowierszowy {#multiline-text}

```vue-html
<span>Wielowierszowa wiadomość brzmi:</span>
<p style="white-space: pre-line;">{{ message }}</p>
<textarea v-model="message" placeholder="dodaj wiele linii"></textarea>
```

<div class="demo">
  <span>Wielowierszowa wiadomość brzmi:</span>
  <p style="white-space: pre-line;">{{ multilineText }}</p>
  <textarea v-model="multilineText" placeholder="dodaj wiele linii"></textarea>
</div>

<div class="composition-api">

[Wypróbuj w playground](https://play.vuejs.org/#eNo9jktuwzAMRK9CaON24XrvKgZ6gN5AG8FmGgH6ECKdJjB891D5LYec9zCb+SH6Oq9oRmN5roEEGGWlyeWQqFSBDSoeYYdjLQk6rXYuuzyXzAIJmf0fwqF1Prru02U7PDQq0CCYKHrBlsQy+Tz9rlFCDBnfdOBRqfa7twhYrhEPzvyfgmCvnxlHoIp9w76dmbbtDe+7HdpaBQUv4it6OPepLBjV8Gw5AzpjxlOJC1a9+2WB1IZQRGhWVqsdXgb1tfDcbvYbJDRqLQ==)

</div>
<div class="options-api">

[Wypróbuj w playground](https://play.vuejs.org/#eNo9jk2OwyAMha9isenMIpN9hok0B+gN2FjBbZEIscDpj6LcvaZpKiHg2X6f32L+mX+uM5nO2DLkwNK7RHeesoCnE85RYHEJwKPg1/f2B8gkc067AhipFDxTB4fDVlrro5ce237AKoRGjihUldjCmPqjLgkxJNoxEEqnrtp7TTEUeUT6c+Z2CUKNdgbdxZmaavt1pl+Wj3ldbcubUegumAnh2oyTp6iE95QzoDEGukzRU9Y6eg9jDcKRoFKLUm27E5RXxTu7WZ89/G4E)

</div>

Zauważ, że interpolacja wewnątrz `<textarea>` nie zadziała. Zamiast tego użyj `v-model`.

```vue-html
<!-- źle -->
<textarea>{{ text }}</textarea>

<!-- dobrze -->
<textarea v-model="text"></textarea>
```

### Pola wyboru (checkbox) {#checkbox}

Pojedyncze pole wyboru, wartość boolean:

```vue-html
<input type="checkbox" id="checkbox" v-model="checked" />
<label for="checkbox">{{ checked }}</label>
```

<div class="demo">
  <input type="checkbox" id="checkbox-demo" v-model="checked" />
  <label for="checkbox-demo">{{ checked }}</label>
</div>

<div class="composition-api">

[Wypróbuj w playground](https://play.vuejs.org/#eNpVjssKgzAURH/lko3tonVfotD/yEaTKw3Ni3gjLSH/3qhUcDnDnMNk9gzhviRkD8ZnGXUgmJFS6IXTNvhIkCHiBAWm6C00ddoIJ5z0biaQL5RvVNCtmwvFhFfheLuLqqIGQhvMQLgm4tqFREDfgJ1gGz36j2Cg1TkvN+sVmn+JqnbtrjDDiAYmH09En/PxphTebqsK8PY4wMoPslBUxQ==)

</div>
<div class="options-api">

[Wypróbuj w playground](https://play.vuejs.org/#eNpVjtEKgzAMRX8l9Gl72Po+OmH/0ZdqI5PVNnSpOEr/fVVREEKSc0kuN4sX0X1KKB5Cfbs4EDfa40whMljsTXIMWXsAa9hcrtsOEJFT9DsBdG/sPmgfwDHhJpZl1FZLycO6AuNIzjAuxGrwlBj4R/jUYrVpw6wFDPbM020MFt0uoq2a3CycadFBH+Lpo8l5jwWlKLle1QcljwCi/AH7gFic)

</div>

Możemy również powiązać wiele pól wyboru z tą samą tablicą lub [ustawić (set)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) wartość:

<div class="composition-api">

```js
const checkedNames = ref([])
```

</div>
<div class="options-api">

```js
export default {
  data() {
    return {
      checkedNames: []
    }
  }
}
```

</div>

```vue-html
<div>Wybrane imiona: {{ checkedNames }}</div>

<input type="checkbox" id="jack" value="Jack" v-model="checkedNames" />
<label for="jack">Jack</label>

<input type="checkbox" id="john" value="John" v-model="checkedNames" />
<label for="john">John</label>

<input type="checkbox" id="mike" value="Mike" v-model="checkedNames" />
<label for="mike">Mike</label>
```

<div class="demo">
  <div>Wybrane imiona: {{ checkedNames }}</div>

  <input type="checkbox" id="demo-jack" value="Jack" v-model="checkedNames" />
  <label for="demo-jack">Jack</label>

  <input type="checkbox" id="demo-john" value="John" v-model="checkedNames" />
  <label for="demo-john">John</label>

  <input type="checkbox" id="demo-mike" value="Mike" v-model="checkedNames" />
  <label for="demo-mike">Mike</label>
</div>

W tym przypadku tablica `checkedNames` będzie zawsze zawierać wartości z aktualnie zaznaczonych pól.

<div class="composition-api">

[Wypróbuj w playground](https://play.vuejs.org/#eNqVkUtqwzAURbfy0CTtoNU8KILSWaHdQNWBIj8T1fohyybBeO+RbOc3i2e+vHvuMWggHyG89x2SLWGtijokaDF1gQunbfAxwQARaxihjt7CJlc3wgmnvGsTqAOqBqsfabGFXSm+/P69CsfovJVXckhog5EJcwJgle7558yBK+AWhuFxaRwZLbVCZ0K70CVIp4A7Qabi3h8FAV3l/C9Vk797abpy/lrim/UVmkt/Gc4HOv+EkXs0UPt4XeCFZHQ6lM4TZn9w9+YlrjFPCC/kKrPVDd6Zv5e4wjwv8ELezIxeX4qMZwHduAs=)

</div>
<div class="options-api">

[Wypróbuj w playground](https://play.vuejs.org/#eNqVUc1qxCAQfpXBU3tovS9WKL0V2hdoenDjLGtjVNwxbAl592rMpru3DYjO5/cnOLLXEJ6HhGzHxKmNJpBsHJ6DjwQaDypZgrFxAFqRenisM0BEStFdEEB7xLZD/al6PO3g67veT+XIW16Cr+kZEPbBKsKMAIQ2g3yrAeBqwjjeRMI0CV5kxZ0dxoVEQL8BXxo2C/f+3DAwOuMf1XZ5HpRNhX5f4FPvNdqLfgnOBK+PsGqPFg4+rgmyOAWfiaK5o9kf3XXzArc0zxZZnJuae9PhVfPHAjc01wRZnP/Ngq8/xaY/yMW74g==)

</div>

### Radio {#radio}

```vue-html
<div>Wybrane: {{ picked }}</div>

<input type="radio" id="one" value="One" v-model="picked" />
<label for="one">Jeden</label>

<input type="radio" id="two" value="Two" v-model="picked" />
<label for="two">Dwa</label>
```

<div class="demo">
  <div>Wybrane: {{ picked }}</div>

  <input type="radio" id="one" value="One" v-model="picked" />
  <label for="one">Jeden</label>

  <input type="radio" id="two" value="Two" v-model="picked" />
  <label for="two">Dwa</label>
</div>

<div class="composition-api">

[Wypróbuj w playground](https://play.vuejs.org/#eNqFkDFuwzAMRa9CaHE7tNoDxUBP0A4dtTgWDQiRJUKmHQSG7x7KhpMMAbLxk3z/g5zVD9H3NKI6KDO02RPDgDxSbaPvKWWGGTJ2sECXUw+VrFY22timODCQb8/o4FhWPqrfiNWnjUZvRmIhgrGn0DCKAjDOT/XfCh1gnnd+WYwukwJYNj7SyMBXwqNVuXE+WQXeiUgRpZyaMJaR5BX11SeHQfTmJi1dnNiE5oQBupR3shbC6LX9Posvpdyz/jf1OksOe85ayVqIR5bR9z+o5Qbc6oCk)

</div>
<div class="options-api">

[Wypróbuj w playground](https://play.vuejs.org/#eNqNkEEOAiEMRa/SsFEXyt7gJJ5AFy5ng1ITIgLBMmomc3eLOONSEwJ9Lf//pL3YxrjqMoq1ULdTspGa1uMjhkRg8KyzI+hbD2A06fmi1gAJKSc/EkC0pwuaNcx2Hme1OZSHLz5KTtYMhNfoNGEhUsZ2zf6j7vuPEQyDkmVSBPzJ+pgJ6Blx04qkjQ2tAGsYgkcuO+1yGXF6oeU1GHTM1Y1bsoY5fUQH55BGZcMKJd/t31l0L+WYdaj0V9Zb2bDim6XktAcxvADR+YWb)

</div>

### Select {#select}

Pojedynczy element select:

```vue-html
<div>Wybrane: {{ selected }}</div>

<select v-model="selected">
  <option disabled value="">Proszę wybrać jedną opcję</option>
  <option>A</option>
  <option>B</option>
  <option>C</option>
</select>
```

<div class="demo">
  <div>Wybrane: {{ selected }}</div>
  <select v-model="selected">
    <option disabled value="">Proszę wybrać jedną opcję</option>
    <option>A</option>
    <option>B</option>
    <option>C</option>
  </select>
</div>

<div class="composition-api">

[Wypróbuj w playground](https://play.vuejs.org/#eNp1j7EOgyAQhl/lwmI7tO4Nmti+QJOuLFTPxASBALoQ3r2H2jYOjvff939wkTXWXucJ2Y1x37rBBvAYJlsLPYzWuAARHPaQoHdmhILQQmihW6N9RhW2ATuoMnQqirPQvFw9ZKAh4GiVDEgTAPdW6hpeW+sGMf4VKVEz73Mvs8sC5stoOlSVYF9SsEVGiLFhMBq6wcu3IsUs1YREEvFUKD1udjAaebnS+27dHOT3g/yxy+nHywM08PJ3KksfXwJ2dA==)

</div>
<div class="options-api">

[Wypróbuj w playground](https://play.vuejs.org/#eNp1j1ELgyAUhf/KxZe2h633cEHbHxjstReXdxCYSt5iEP333XIJPQSinuN3jjqJyvvrOKAohAxN33oqa4tf73oCjR81GIKptgBakTqd4x6gRxp6uymAgAYbQl1AlkVvXhaeeMg8NbMg7LxRhKwAZPDKlvBK8WlKXTDPnFzOI7naMF46p9HcarFxtVgBRpyn1lnQbVBvwwWjMgMyycTToAr47wZnUeaR3mfL6sC/H/iPnc/vXS9gIfP0UTH/ACgWeYE=)

</div>

:::tip Note
Jeśli początkowa wartość wyrażenia `v-model` nie pasuje do żadnej z opcji, element `<select>` zostanie wyrenderowany w stanie „unselected”. W systemie iOS spowoduje to, że użytkownik nie będzie mógł wybrać pierwszego elementu, ponieważ w tym przypadku system iOS nie uruchamia zdarzenia change. Dlatego zaleca się podanie wyłączonej opcji z pustą wartością, jak pokazano w przykładzie powyżej.
:::

Wybór wielokrotny (powiązany z tablicą):

```vue-html
<div>Wybrane: {{ selected }}</div>

<select v-model="selected" multiple>
  <option>A</option>
  <option>B</option>
  <option>C</option>
</select>
```

<div class="demo">
  <div>Wybrane: {{ multiSelected }}</div>

  <select v-model="multiSelected" multiple>
    <option>A</option>
    <option>B</option>
    <option>C</option>
  </select>
</div>

<div class="composition-api">

[Wypróbuj w playground](https://play.vuejs.org/#eNp1kL2OwjAQhF9l5Ya74i7QBhMJeARKTIESIyz5Z5VsAsjyu7NOQEBB5xl/M7vaKNaI/0OvRSlkV7cGCTpNPVbKG4ehJYjQ6hMkOLXBwYzRmfLK18F3GbW6Jt3AKkM/+8Ov8rKYeriBBWmH9kiaFYBszFDtHpkSYnwVpCSL/JtDDE4+DH8uNNqulHiCSoDrLRm0UyWzAckEX61l8Xh9+psv/vbD563HCSxk8bY0y45u47AJ2D/HHyDm4MU0dC5hMZ/jdal8Gg8wJkS6A3nRew4=)

</div>
<div class="options-api">

[Wypróbuj w playground](https://play.vuejs.org/#eNp1UEEOgjAQ/MqmJz0oeMVKgj7BI3AgdI1NCjSwIIbwdxcqRA4mTbsznd2Z7CAia49diyIQsslrbSlMSuxtVRMofGStIRiSEkBllO32rgaokdq6XBBAgwZzQhVAnDpunB6++EhvncyAsLAmI2QEIJXuwvvaPAzrJBhH6U2/UxMLHQ/doagUmksiFmEioOCU2ho3krWVJV2VYSS9b7Xlr3/424bn1LMDA+n9hGbY0Hs2c4J4sU/dPl5a0TOAk+/b/rwsYO4Q4wdtRX7l)

</div>

Opcje select można dynamicznie renderować za pomocą `v-for`:

<div class="composition-api">

```js
const selected = ref('A')

const options = ref([
  { text: 'Raz', value: 'A' },
  { text: 'Dwa', value: 'B' },
  { text: 'Trzy', value: 'C' }
])
```

</div>
<div class="options-api">

```js
export default {
  data() {
    return {
      selected: 'A',
      options: [
        { text: 'Raz', value: 'A' },
        { text: 'Dwa', value: 'B' },
        { text: 'Trzy', value: 'C' }
      ]
    }
  }
}
```

</div>

```vue-html
<select v-model="selected">
  <option v-for="option in options" :value="option.value">
    {{ option.text }}
  </option>
</select>

<div>Wybrane: {{ selected }}</div>
```

<div class="composition-api">

[Wypróbuj w playground](https://play.vuejs.org/#eNplkMFugzAQRH9l5YtbKYU7IpFoP6CH9lb3EMGiWgLbMguthPzvXduEJMqNYUazb7yKxrlimVFUop5arx3BhDS7kzJ6dNYTrOCxhwC9tyNIjkpllGmtmWJ0wJawg2MMPclGPl9N60jzx+Z9KQPcRfhHFch3g/IAy3mYkVUjIRzu/M9fe+O/Pvo/Hm8b3jihzDdfr8s8gwewIBzdcCZkBVBnXFheRtvhcFTiwq9ECnAkQ3Okt54Dm9TmskYJqNLR3SyS3BsYct3CRYSFwGCpusx/M0qZTydKRXWnl9PHBlPFhv1lQ6jL6MZl+xoR/gFjPZTD)

</div>
<div class="options-api">

[Wypróbuj w playground](https://play.vuejs.org/#eNp1kMFqxCAQhl9l8JIWtsk92IVtH6CH9lZ7COssDbgqZpJdCHn3nWiUXBZE/Mdvxv93Fifv62lE0Qo5nEPv6ags3r0LBBov3WgIZmUBdEfdy2s6AwSkMdisAAY0eCbULVSn6pCrzlPv7NDCb64AzEB4J+a+LFYHmDozYuyCpfTtqJ+b21Efz6j/gPtpn8xl7C8douaNl2xKUhaEV286QlYAMgWB6e3qNJp3JXIyJSLASErFyMUFBjbZ2xxXCWijkXJZR1kmsPF5g+s1ACybWdmkarLSpKejS0VS99Pxu3wzT8jOuF026+2arKQRywOBGJfE)

</div>

## Wiązanie wartości {#value-bindings}

For radio, checkbox and select options, the `v-model` binding values are usually static strings (or booleans for checkbox):

W przypadku radio, pól wyboru (checkbox) i select wartości powiązania `v-model` są zazwyczaj ciągami statycznymi (string), (lub wartościami logicznymi boolean w przypadku pól wyboru):

```vue-html
<!-- `picked` jest ciągiem znaków (string) „a” po zaznaczeniu -->
<input type="radio" v-model="picked" value="a" />

<!-- `toggle` jest albo prawdą albo fałszem -->
<input type="checkbox" v-model="toggle" />

<!-- `selected` to ciąg (string) „abc” w przypadku wybrania pierwszej opcji -->
<select v-model="selected">
  <option value="abc">ABC</option>
</select>
```

Ale czasami możemy chcieć powiązać wartość z dynamiczną właściwością w bieżącej aktywnej instancji. Możemy użyć `v-bind`, aby to osiągnąć. Ponadto użycie `v-bind` pozwala nam powiązać wartość wejściową z wartościami niebędącymi ciągami znaków (stringami).

### Pole wyboru (checkbox) {#checkbox-1}

```vue-html
<input
  type="checkbox"
  v-model="toggle"
  true-value="yes"
  false-value="no" />
```

`true-value` i `false-value` to atrybuty specyficzne dla Vue, które działają tylko z `v-model`. Tutaj wartość właściwości `toggle` zostanie ustawiona na `'yes'`, gdy pole jest zaznaczone, i na `'no'`, gdy pole jest odznaczone. Możesz również powiązać je z wartościami dynamicznymi za pomocą `v-bind`:

```vue-html
<input
  type="checkbox"
  v-model="toggle"
  :true-value="dynamicTrueValue"
  :false-value="dynamicFalseValue" />
```

:::tip Tip
Atrybuty `true-value` i `false-value` nie wpływają na atrybut `value` wejścia, ponieważ przeglądarki nie uwzględniają niezaznaczonych pól w przesłanych formularzach. Aby zagwarantować, że jedna z dwóch wartości zostanie przesłana w formularzu (np. „yes” lub „no”), zamiast tego użyj inputów radio.
:::

### Radio {#radio-1}

```vue-html
<input type="radio" v-model="pick" :value="first" />
<input type="radio" v-model="pick" :value="second" />
```

`pick` zostanie ustawiony na wartość `first`, gdy zaznaczone zostanie pierwszy input radio, a na wartość `second`, gdy zaznaczone zostanie drugi.

### Select options {#select-options}

```vue-html
<select v-model="selected">
  <!-- literał obiektu definiowany bezpośrednio w kodzie -->
  <option :value="{ number: 123 }">123</option>
</select>
```

`v-model` obsługuje również wiązania wartości niebędących ciągami znaków (stringami)! W powyższym przykładzie, gdy opcja jest zaznaczona, `selected` zostanie ustawione na wartość obiektu literałowego (object literal value) `{ number: 123 }`.

## Modifiers {#modifiers}

### `.lazy` {#lazy}

Domyślnie `v-model` synchronizuje inputy z danymi po każdym zdarzeniu `input` (z wyjątkiem kompozycji IME, jak [opisano powyżej](#vmodel-ime-tip)). Możesz dodać modyfikator `lazy`, aby zamiast tego synchronizować po zdarzeniach `change`:

```vue-html
<!-- zsynchronizowane po "change" zamiast „input” -->
<input v-model.lazy="msg" />
```

### `.number` {#number}

Jeśli chcesz, aby dane wprowadzane przez użytkownika były automatycznie konwertowane na liczbę, możesz dodać modyfikator `number` do inputów zarządzanych `v-model`:

```vue-html
<input v-model.number="age" />
```

Jeśli wartości nie można przeanalizować za pomocą `parseFloat()`, wówczas zamiast niej używana jest wartość oryginalna.

Modyfikator `number` jest stosowany automatycznie, jeśli input ma `type="number"`.

### `.trim` {#trim}

Jeśli chcesz, aby odstępy między znakami w inputach użytkownika były automatycznie przycinane, możesz dodać modyfikator `trim` do inputów zarządzanych przez `v-model`:

```vue-html
<input v-model.trim="msg" />
```

## `v-model` with Components {#v-model-with-components}

> Jeśli nie jesteś jeszcze zaznajomiony z komponentami Vue, możesz pominąć ten punkt.

Wbudowane typy danych wejściowych HTML nie zawsze spełnią Twoje potrzeby. Na szczęście komponenty Vue pozwalają na tworzenie inputów wielokrotnego użytku o całkowicie customizowantm zachowaniu. Te inputy działają nawet z `v-model`! Aby dowiedzieć się więcej, przeczytaj o [Użyciu z `v-model`](/guide/components/v-model) w przewodniku po komponentach.
