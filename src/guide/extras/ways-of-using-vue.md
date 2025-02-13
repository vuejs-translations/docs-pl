# Sposoby użycia Vue {#ways-of-using-vue}

Wierzymy, że nie istnieje uniwersalne rozwiązanie dla sieci. Dlatego Vue zostało zaprojektowane tak, aby było elastyczne i możliwe do stopniowego przyjęcia. W zależności od przypadku użycia, Vue może być używane na różne sposoby, aby osiągnąć optymalną równowagę między złożonością stosu, doświadczeniem programisty a wydajnością końcową.

## Samodzielny Skrypt {#standalone-script}

Vue może być używane jako samodzielny plik skryptu - bez konieczności budowania! Jeśli masz już backend renderujący większość HTML-a lub Twoja logika frontendowa nie jest wystarczająco złożona, aby uzasadnić etap budowania, jest to najłatwiejszy sposób na integrację Vue ze stosem technologicznym. W takich przypadkach możesz myśleć o Vue jako o bardziej deklaratywnym zamienniku jQuery.

Vue oferuje również alternatywną dystrybucję o nazwie [petite-vue](https://github.com/vuejs/petite-vue), która jest specjalnie zoptymalizowana do progresywnego ulepszania istniejącego HTML-a. Ma mniejszy zestaw funkcji, ale jest niezwykle lekka i wykorzystuje implementację, która jest bardziej wydajna w scenariuszach bez etapu budowania.

## Osadzone Web Components {#embedded-web-components}

Możesz użyć Vue do [budowania standardowych Web Components](/guide/extras/web-components), które można osadzić na dowolnej stronie HTML, niezależnie od sposobu ich renderowania. Ta opcja pozwala na wykorzystanie Vue w sposób całkowicie niezależny od konsumenta: powstałe web components mogą być osadzone w starszych aplikacjach, statycznym HTML-u lub nawet aplikacjach zbudowanych z użyciem innych frameworków.

## Aplikacja Jednostronicowa (SPA) {#single-page-application-spa}

Niektóre aplikacje wymagają bogatej interaktywności, głębokiej sesji i nietrywialna logika stanu po stronie frontendu. Najlepszym sposobem budowania takich aplikacji jest wykorzystanie architektury, w której Vue nie tylko kontroluje całą stronę, ale także obsługuje aktualizacje danych i nawigację bez konieczności przeładowywania strony. Ten typ aplikacji jest zazwyczaj nazywany Aplikacją Jednostronicową (SPA).

Vue dostarcza podstawowe biblioteki i [kompleksowe wsparcie narzędziowe](/guide/scaling-up/tooling) z niesamowitym doświadczeniem programisty do budowania nowoczesnych SPA, w tym:

- Router po stronie klienta
- Błyskawicznie szybki łańcuch narzędzi do budowania
- Wsparcie IDE
- Narzędzia deweloperskie przeglądarki
- Integracje TypeScript
- Narzędzia do testowania

SPA zazwyczaj wymagają, aby backend udostępniał punkty końcowe API - ale możesz również połączyć Vue z rozwiązaniami takimi jak [Inertia.js](https://inertiajs.com), aby uzyskać korzyści SPA, zachowując model rozwoju skoncentrowany na serwerze.

## Fullstack / SSR {#fullstack-ssr}

Czysto klienckie SPA są problematyczne, gdy aplikacja jest wrażliwa na SEO i czas do wyświetlenia treści. Dzieje się tak, ponieważ przeglądarka otrzyma w dużej mierze pusty HTML i musi czekać na załadowanie JavaScript przed wyrenderowaniem czegokolwiek.

Vue dostarcza pierwszorzędne API do "renderowania" aplikacji Vue w ciągi znaków HTML na serwerze. Pozwala to serwerowi na odesłanie już wyrenderowanego HTML-a, umożliwiając użytkownikom końcowym natychmiastowe zobaczenie treści podczas pobierania JavaScript. Vue następnie "uwadnia" aplikację po stronie klienta, aby uczynić ją interaktywną. Jest to nazywane [Renderowaniem Po Stronie Serwera (SSR)](/guide/scaling-up/ssr) i znacznie poprawia podstawowe metryki Web Vital, takie jak [Largest Contentful Paint (LCP)](https://web.dev/lcp/).

Istnieją frameworki wyższego poziomu oparte na Vue zbudowane na tym paradygmacie, takie jak [Nuxt](https://nuxt.com/), które pozwalają na tworzenie aplikacji fullstack przy użyciu Vue i JavaScript.

## JAMStack / SSG {#jamstack-ssg}

Renderowanie po stronie serwera może być wykonywane z wyprzedzeniem, jeśli wymagane dane są statyczne. Oznacza to, że możemy wstępnie wyrenderować całą aplikację do HTML i serwować je jako pliki statyczne. Poprawia to wydajność strony i znacznie upraszcza wdrażanie, ponieważ nie musimy już dynamicznie renderować stron przy każdym żądaniu. Vue nadal może uwadniać takie aplikacje, aby zapewnić bogatą interaktywność po stronie klienta. Ta technika jest powszechnie nazywana Generowaniem Stron Statycznych (SSG), znana również jako [JAMStack](https://jamstack.org/what-is-jamstack/).

Istnieją dwa rodzaje SSG: jednostronicowy i wielostronicowy. Oba rodzaje wstępnie renderują stronę do statycznego HTML-a, różnica polega na tym, że:

- Po początkowym załadowaniu strony, jednostronicowy SSG "uwadnia" stronę w SPA. Wymaga to większego początkowego ładunku JS i kosztu uwodnienia, ale kolejne nawigacje będą szybsze, ponieważ wymagają tylko częściowej aktualizacji zawartości strony zamiast przeładowywania całej strony.

- Wielostronicowy SSG ładuje nową stronę przy każdej nawigacji. Zaletą jest to, że może dostarczyć minimalny JS - lub w ogóle bez JS-a, jeśli strona nie wymaga interakcji! Niektóre wielostronicowe frameworki SSG, takie jak [Astro](https://astro.build/), obsługują również "częściowe uwadnianie" - co pozwala na używanie komponentów Vue do tworzenia interaktywnych "wysp" wewnątrz statycznego HTML-a.

Jednostronicowe SSG są lepiej dostosowane, jeśli oczekujesz nietrywialna interaktywność, długie sesje lub trwałe elementy/stan między nawigacjami. W przeciwnym razie, wielostronicowy SSG będzie lepszym wyborem.

Zespół Vue utrzymuje również generator stron statycznych o nazwie [VitePress](https://vitepress.dev/), który zasila tę stronę, którą właśnie czytasz! VitePress obsługuje oba rodzaje SSG. [Nuxt](https://nuxt.com/) również obsługuje SSG. Możesz nawet mieszać SSR i SSG dla różnych tras w tej samej aplikacji Nuxt.

## Poza siecią {#beyond-the-web}

Chociaż Vue jest głównie zaprojektowane do budowania aplikacji internetowych, nie jest w żaden sposób ograniczone tylko do przeglądarki. Możesz:

- Budować aplikacje desktopowe z [Electron](https://www.electronjs.org/)
- Budować aplikacje mobilne z [Ionic Vue](https://ionicframework.com/docs/vue/overview)
- Budować aplikacje desktopowe i mobilne z tego samego kodu źródłowego z [Quasar](https://quasar.dev/) lub [Tauri](https://tauri.app)
- Budować doświadczenia 3D WebGL z [TresJS](https://tresjs.org/)
- Używać [API Renderera Niestandardowego](/api/custom-renderer) Vue do budowania własnych rendererów, jak te dla [terminala](https://github.com/vue-terminal/vue-termui)!
