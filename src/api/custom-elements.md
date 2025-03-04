# Custom Elements API {#custom-elements-api}

## defineCustomElement() {#definecustomelement}

Ta metoda przyjmuje ten sam argument co [`defineComponent`](#definecomponent), ale zamiast tego zwraca natywny konstruktor klasy [Custom Element](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements).

- **Typ**

  ```ts
  function defineCustomElement(
    component:
      | (ComponentOptions & CustomElementsOptions)
      | ComponentOptions['setup'],
    options?: CustomElementsOptions
  ): {
    new (props?: object): HTMLElement
  }

  interface CustomElementsOptions {
    styles?: string[]

    // the following options are 3.5+
    configureApp?: (app: App) => void
    shadowRoot?: boolean
    nonce?: string
  }
  ```

  > Typ jest uproszczony w celu zwiększenia czytelności.

- **Szczegóły**

  Poza zwykłymi opcjami komponentu, `defineCustomElement()` obsługuje również wiele opcji związanych z niestandardowymi elementami:

  - **`styles`**: tablica stringów CSS, którymi dostarczamy style CSS do wstrzyknięcia w shadow root elementu.

  - **`configureApp`** <sup class="vt-badge" data-text="3.5+"/>: funkcja służąca do skonfigurowania instancji aplikacji Vue dla niestandardowego elementu.

  - **`shadowRoot`** <sup class="vt-badge" data-text="3.5+"/>: `boolean`, domyślnie `true`. Ustawienie na `false` sprawi że renderujemy niestandardowy element bez shadow root. Oznacza to, że `<style>` z niestandarowego elementu SFC nie będzie enkapsułowany.

  - **`nonce`** <sup class="vt-badge" data-text="3.5+"/>: `string`, jeśli zdefiniowana, będzie uzyta jako atrybut `nonce` na tagach style wstrzykniętych do shadow root.

  Pamiętaj, że te opcje zamiast być przekazanymi jako część komponentu, mogą być przekazane poprzez drugi argument:

  ```js
  import Element from './MyElement.ce.vue'

  defineCustomElement(Element, {
    configureApp(app) {
      // ...
    }
  })
  ```

  Wartością zwrotną jest konstruktor klasy niestandarowego elementu, który można zarejestrować używając [`customElements.define()`](https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/define).

- **Przykład**

  ```js
  import { defineCustomElement } from 'vue'

  const MyVueElement = defineCustomElement({
    /* component options */
  })

  // Zarejestruj niestandardowy element.
  customElements.define('my-vue-element', MyVueElement)
  ```

- **Zobacz również**

  - [Poradnik - Budowanie elementów niestandardowych z Vue](/guide/extras/web-components#building-custom-elements-with-vue)

  - Należy również pamiętać, że funkcja `defineCustomElement()` wymaga [specjalnej konfiguracji](/guide/extras/web-components#sfc-as-custom-element), gdy jest używana z komponentami jednoplikowymi.

## useHost() <sup class="vt-badge" data-text="3.5+"/> {#usehost}

Helper Composition API, który zwraca hostujący element obecnej instancji niestandarowego elementu Vue.

## useShadowRoot() <sup class="vt-badge" data-text="3.5+"/> {#useshadowroot}

Helper Composition API, który zwraca shadow root obecnej instancji niestandarowego elementu Vue.

## this.$host <sup class="vt-badge" data-text="3.5+"/> {#this-host}

Własność Options API, która udostępnia hostujący element obecnej instancji niestandardowego elementu Vue.
