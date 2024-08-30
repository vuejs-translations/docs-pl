# Composition API: Helpers {#composition-api-helpers}

## useAttrs() {#useattrs}

Zwraca obiekt `attrs` z [Setup Context](/api/composition-api-setup#setup-context), który zawiera [dziedziczone atrybuty](/guide/components/attrs#fallthrough-attributes) obecnego komponentu. Stworzone celem użycia w `<script setup>`, gdzie obiekt setup context nie jest dostępny.

- **Typ**

  ```ts
  function useAttrs(): Record<string, unknown>
  ```

## useSlots() {#useslots}

Zwraca obiekt `slots` z [Setup Context](/api/composition-api-setup#setup-context), który zawiera sloty przekazane przez rodzica jako wywoływalne funkcje, które zwracają węzły Virtual DOM. Stworzone celem użycia w `<script setup>`, gdzie obiekt setup context nie jest dostępny.

Gdy używasz TypeScript, zamiast tego używaj [`defineSlots()`](/api/sfc-script-setup#defineslots).

- **Typ**

  ```ts
  function useSlots(): Record<string, (...args: any[]) => VNode[]>
  ```

## useModel() {#usemodel}

To helper, który jest używany w [`defineModel()`](/api/sfc-script-setup#definemodel). Jeśli używasz `<script setup>`, zamiast niego używaj `defineModel()`.

- Wspierane tylko w 3.4+

- **Typ**

  ```ts
  function useModel(
    props: Record<string, any>,
    key: string,
    options?: DefineModelOptions
  )

  type DefineModelOptions<T = any> = {
    get?: (v: T) => any
    set?: (v: T) => any
  }
  ```

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

- **Szczegóły**

  `useModel()` może być używany w komponentach niebędących SFC, np. używających funkcji `setup()`. Spodziewa się on obiektu `props` jako pierwszy argument oraz nazwy modelu jako drugi argument. Trzeci, opcjonalny argument może być użyty do zadeklarowania niestandardowego gettera i settera dla zwracanej referencji modelu. Zwróć uwagę, że w przeciwieństwie do `defineModel()`, odpowiedzialność za zadeklarowanie propsów i emitowanych zdarzeń leży na Tobie.

## useTemplateRef() <sup class="vt-badge" data-text="3.5+" /> {#usetemplateref}

Zwraca płytką referencję, której wartość będzie zsynchronizowana z elementem szablonu lub komponentem pasującym do atrybutu ref.

- **Typ**

  ```ts
  function useTemplateRef<T>(key: string): Readonly<ShallowRef<T | null>>
  ```

- **Przykład**

  ```vue
  <script setup>
  import { useTemplateRef, onMounted } from 'vue'

  const inputRef = useTemplateRef('input')

  onMounted(() => {
    inputRef.value.focus()
  })
  </script>

  <template>
    <input ref="input" />
  </template>
  ```

- **Zobacz również**
  - [Poradnik - Referencje szablonów](/guide/essentials/template-refs)
  - [Poradnik - Typowanie referencji szablonów](/guide/typescript/composition-api#typing-template-refs) <sup class="vt-badge ts" />
  - [Poradnik - Typowanie referencji szablonów komponentów](/guide/typescript/composition-api#typing-component-template-refs) <sup class="vt-badge ts" />

## useId() <sup class="vt-badge" data-text="3.5+" /> {#useid}

Używane do generowania identyfikatorów unikalnych w danej aplikacji.

- **Typ**

  ```ts
  function useId(): string
  ```

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
