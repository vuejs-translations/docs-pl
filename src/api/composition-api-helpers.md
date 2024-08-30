# Composition API: Helpers {#composition-api-helpers}

## useAttrs() {#useattrs}

## useSlots() {#useslots}

## useModel() <sup class="vt-badge" data-text="3.4+" /> {#usemodel}

## useTemplateRef() <sup class="vt-badge" data-text="3.5+" /> {#usetemplateref}

## useId() <sup class="vt-badge" data-text="3.5+" /> {#useid}

`useId()` to API, które może być użyte do generowania identyfikatorów unikalnych w danej aplikacji.

- **Tylko dla Composition API.**

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
