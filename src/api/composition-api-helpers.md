# Composition API: Helpers {#composition-api-helpers}

## useAttrs() {#useattrs}

Zwraca obiekt `attrs` z [Setup Context](/api/composition-api-setup#setup-context), który zawiera [dziedziczone atrybuty](/guide/components/attrs#fallthrough-attributes) obecnego komponentu. Stworzone celem użycia w `<script setup>`, gdzie obiekt setup context nie jest dostępny.

## useSlots() {#useslots}

Zwraca obiekt `slots` z [Setup Context](/api/composition-api-setup#setup-context), który zawiera sloty przekazane przez rodzica jako wywoływalne funkcje, które zwracają węzły Virtual DOM. Stworzone celem użycia w `<script setup>`, gdzie obiekt setup context nie jest dostępny.

Gdy używasz TypeScript, zamiast tego używaj [`defineSlots()`](/api/sfc-script-setup#defineslots).

## useModel() <sup class="vt-badge" data-text="3.4+" /> {#usemodel}

To helper, który jest używany w [`defineModel()`](/api/sfc-script-setup#definemodel). Jeśli używasz `<script setup>`, zamiast niego używaj `defineModel()`.

`useModel()` może być używany w komponentach niebędących SFC, np. używających funkcji `setup()`. Spodziewa się on obiektu `props` jako pierwszy argument oraz nazwy modelu jako drugi argument. Trzeci, opcjonalny argument może być użyty do zadeklarowania niestandardowego gettera i settera dla zwracanej referencji modelu. Zwróć uwagę, że w przeciwieństwie do `defineModel()`, odpowiedzialność za zadeklarowanie propsów i emitowanych zdarzeń leży na Tobie.

- **Przykład**

  ```js
  export default {
    props: ['count'],
    emits: ['update:count'],
    setup(props) {
      const msg = useModel(props, 'count')
      msg.value = 1
    }
  }
  ```

## useTemplateRef() <sup class="vt-badge" data-text="3.5+" /> {#usetemplateref}

## useId() <sup class="vt-badge" data-text="3.5+" /> {#useid}

`useId()` to API, które może być użyte do generowania identyfikatorów unikalnych w danej aplikacji.

- **Przykład**

  ```vue
  <script setup>
  import { useId } from 'vue'

  const id = useId()
  </script>

  <template>
    <form>
      <label :for="id">Imię:</label>
      <input :id="id" type="text" />
    </form>
  </template>
  ```

- **Szczegóły**

  Identyfikatory generowane przez `useId()` są unikalne dla danej aplikacji. Możemy go użyć by generować identyfikatory dla elementów formularzy lub atrybutów związanych z dostępnością. Wiele wywołań w ramach jednego komponentu wygeneruje różne identyfikatory; wiele instancji tego samego komponentu wywołujących `useId()` również otrzyma różne identyfikatory.
  
  Identyfikatory generowane przez `useId()` mają gwarancję stabilności między renderowaniem po stronie serwera jak i klienta, więc możemy ich bezpiecznie używać w aplikacjach SSR bez obaw o problemy z hydracją.

  Jeśli mamy więcej niż jedną instancję aplikacji Vue na tej samej stronie, możemy ominąć problem konfilktów identyfikatorów przez skonfigurowanie w każdej z aplikacji odpowiedniego prefixu poprzez [`app.config.idPrefix`](/api/application#app-config-idprefix).
